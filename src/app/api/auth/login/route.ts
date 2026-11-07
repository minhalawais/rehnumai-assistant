import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSession, normalizeEmail, verifyPassword } from "@/lib/auth";
import { jsonError, requestId } from "@/lib/api";
import { loginSchema } from "@/lib/intake-schema";
import { requireCsrf } from "@/lib/csrf";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const id = requestId(request);
  if (!(await requireCsrf(request))) return jsonError(403, "CSRF_FAILED", "Security verification failed.", id);
  const key = request.headers.get("x-forwarded-for") ?? "unknown";
  const current = attempts.get(key);
  if (current && current.resetAt > Date.now() && current.count >= 8) return jsonError(429, "RATE_LIMITED", "Please try again later.", id);
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(422, "VALIDATION_FAILED", "Enter a valid email and password.", id);
    const email = normalizeEmail(parsed.data.email);
    const db = await getDb();
    const user = await db.collection("users").findOne({ emailNormalized: email, status: "active" });
    if (!user || !user.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      attempts.set(key, { count: (current?.count ?? 0) + 1, resetAt: Date.now() + 15 * 60 * 1000 });
      await db.collection("auditEvents").insertOne({ eventId: crypto.randomUUID(), category: "authentication", action: "login", outcome: "denied", occurredAt: new Date(), metadata: { reason: "invalid_credentials" }, requestId: id });
      return jsonError(401, "AUTHENTICATION_FAILED", "We could not sign you in with those details.", id);
    }
    attempts.delete(key);
    await createSession({ _id: user._id.toString(), tenantId: user.tenantId.toString(), roles: user.roles ?? [] });
    await db.collection("auditEvents").insertOne({ eventId: crypto.randomUUID(), category: "authentication", action: "login", outcome: "success", actorId: user._id.toString(), occurredAt: new Date(), metadata: {}, requestId: id });
    return NextResponse.json({ data: { signedIn: true }, meta: { requestId: id } });
  } catch (error) {
    console.error("auth.login", { requestId: id, error: error instanceof Error ? error.message : "unknown" });
    return jsonError(503, "SERVICE_UNAVAILABLE", "The sign-in service is temporarily unavailable.", id);
  }
}
