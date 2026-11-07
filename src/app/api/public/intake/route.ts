import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { jsonError, requestId } from "@/lib/api";
import { requireCsrf } from "@/lib/csrf";
import { publicSubmissionSchema } from "@/lib/public-intake";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const id = requestId(request);
  if (!(await requireCsrf(request))) return jsonError(403, "CSRF_FAILED", "Security verification failed. Refresh and try again.", id);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return jsonError(415, "UNSUPPORTED_MEDIA_TYPE", "Send the form as JSON.", id);
  if (Number(request.headers.get("content-length") ?? 0) > 32_768) return jsonError(413, "FORM_TOO_LARGE", "The form is too large.", id);

  try {
    const raw = await request.text();
    if (raw.length > 32_768) return jsonError(413, "FORM_TOO_LARGE", "The form is too large.", id);
    const parsed = publicSubmissionSchema.safeParse(JSON.parse(raw));
    if (!parsed.success || parsed.data.website) return jsonError(422, "VALIDATION_FAILED", "Please check the answers and try again.", id);

    const env = getEnv();
    const db = await getDb();
    const { clientRequestId, answers } = parsed.data;
    const tenantId = env.PUBLIC_INTAKE_TENANT_ID;
    const collection = db.collection("cases");
    const existing = await collection.findOne({ tenantId, clientRequestId }, { projection: { _id: 0, caseReference: 1 } });
    if (existing) return NextResponse.json({ data: { caseReference: existing.caseReference }, meta: { requestId: id } }, { headers: { "Cache-Control": "no-store" } });

    // This is an application-level floor. Production deployments also need an edge rate limit.
    const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim();
    if (forwardedIp) {
      const bucket = Math.floor(Date.now() / 3_600_000);
      const key = createHash("sha256").update(`${env.SESSION_SECRET ?? "development"}:${forwardedIp}:${bucket}`).digest("hex");
      const rate = await db.collection<{ _id: string; count: number; expiresAt: Date }>("publicIntakeRate").findOneAndUpdate({ _id: key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 7_200_000) } }, { upsert: true, returnDocument: "after" });
      if ((rate?.count ?? 0) > 10) return jsonError(429, "RATE_LIMITED", "Too many submissions. Try again later.", id);
    }

    const now = new Date();
    const caseId = crypto.randomUUID();
    const caseReference = `MIG-${String(now.getFullYear()).slice(-2)}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const attentionSignalCodes = Object.entries(answers.safetyAnswers).filter(([key, value]) => /^AT-\d{3}$/.test(key) && value === "yes").map(([key]) => key);
    const storedAnswers = { ...answers, attentionSignalCodes };
    await collection.insertOne({ tenantId, teamId: null, locationId: null, caseId, caseReference, clientRequestId, formKey: "migration-intake", formVersion: "1.0.0", currentRevision: 1, workingRevision: null, status: "submitted", language: answers.language, sourceChannel: "public_intake", applicantSummary: { displayName: answers.fullName }, migrationSummary: { stage: answers.migrationStage, purpose: answers.migrationPurpose, destinationCountry: answers.destinationCountry }, attentionSignalCodes, reviewPriority: attentionSignalCodes.length ? "priority" : "routine", assignedUserId: null, createdBy: null, createdAt: now, updatedAt: now, submittedAt: now, version: 1 });
    await db.collection("caseRevisions").insertOne({ tenantId, caseId, revisionNumber: 1, formVersion: "1.0.0", state: "submitted", answers: storedAnswers, applicableFieldKeys: Object.keys(storedAnswers), createdBy: null, createdAt: now, version: 1 });
    await db.collection("auditEvents").insertOne({ eventId: crypto.randomUUID(), tenantId, category: "case", action: "public_submit", outcome: "success", actor: { type: "public" }, target: { type: "case", id: caseId, caseReference }, occurredAt: now, requestId: id, metadata: {} });
    return NextResponse.json({ data: { caseReference }, meta: { requestId: id } }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return jsonError(422, "VALIDATION_FAILED", "Please check the form and try again.", id);
    console.error("public-intake.submit", { requestId: id, error: error instanceof Error ? error.message : "unknown" });
    return jsonError(503, "SERVICE_UNAVAILABLE", "Submission is temporarily unavailable. Please try again.", id);
  }
}
