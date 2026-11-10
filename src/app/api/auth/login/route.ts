import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { createSession, normalizeEmail, verifyPassword } from "@/lib/auth";
import { jsonError, requestId } from "@/lib/api";
import { loginSchema } from "@/lib/intake-schema";
import { requireCsrf } from "@/lib/csrf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const id = requestId(request);
  if (!(await requireCsrf(request))) return jsonError(403, "CSRF_FAILED", "Security verification failed.", id);

  const env = getEnv();
  const db = await getDb();
  const forwardedIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim();
  const rateSource =
    forwardedIp ||
    createHash("sha256").update(`${request.headers.get("user-agent") ?? "unknown"}:login`).digest("hex");
  const bucket = Math.floor(Date.now() / 900_000);
  const rateKey = createHash("sha256").update(`${env.SESSION_SECRET ?? "development"}:login:${rateSource}:${bucket}`).digest("hex");
  const rate = await db.collection<{ _id: string; count: number; expiresAt: Date }>("loginRate").findOneAndUpdate(
    { _id: rateKey },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 1_800_000) } },
    { upsert: true, returnDocument: "after" },
  );
  if ((rate?.count ?? 0) > 8) return jsonError(429, "RATE_LIMITED", "Please try again later.", id);

  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(422, "VALIDATION_FAILED", "Enter a valid email and password.", id);
    const email = normalizeEmail(parsed.data.email);
    const user = await db.collection("users").findOne({ emailNormalized: email, status: "active" });
    if (!user || !user.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      await db.collection("auditEvents").insertOne({ eventId: crypto.randomUUID(), category: "authentication", action: "login", outcome: "denied", occurredAt: new Date(), metadata: { reason: "invalid_credentials" }, requestId: id });
      return jsonError(401, "AUTHENTICATION_FAILED", "We could not sign you in with those details.", id);
    }
    await createSession({ _id: user._id.toString(), tenantId: user.tenantId.toString(), roles: user.roles ?? [] });
    await db.collection("auditEvents").insertOne({ eventId: crypto.randomUUID(), category: "authentication", action: "login", outcome: "success", actorId: user._id.toString(), occurredAt: new Date(), metadata: {}, requestId: id });
    return NextResponse.json({ data: { signedIn: true }, meta: { requestId: id } });
  } catch (error) {
    console.error("auth.login", { requestId: id, error: error instanceof Error ? error.message : "unknown" });
    return jsonError(503, "SERVICE_UNAVAILABLE", "The sign-in service is temporarily unavailable.", id);
  }
}
