import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { jsonError, requestId } from "@/lib/api";
import { caseScope, hasP3Access } from "@/lib/case-access";

export const runtime = "nodejs";
type Context = { params: Promise<{ reference: string }> };

export async function GET(request: Request, context: Context) {
  const id = requestId(request);
  try {
    const session = await getSession();
    if (!session) return jsonError(401, "AUTHENTICATION_REQUIRED", "Sign in is required.", id);
    const scope = caseScope(session);
    if (!scope) return jsonError(403, "PERMISSION_DENIED", "You do not have permission to view submissions.", id);
    const { reference } = await context.params;
    const db = await getDb();
    const record = await db.collection("cases").findOne({ ...scope, caseReference: reference }, { projection: { _id: 0 } });
    if (!record) return jsonError(404, "SUBMISSION_NOT_FOUND", "Submission not found.", id);
    const revision = await db.collection("caseRevisions").findOne({ tenantId: session.tenantId, caseId: record.caseId, revisionNumber: record.currentRevision }, { projection: { _id: 0, answers: 1 } });
    const answers = revision?.answers && typeof revision.answers === "object" ? { ...revision.answers } : null;
    if (answers && !hasP3Access(session)) delete answers.notes;
    await db.collection("auditEvents").insertOne({ eventId: crypto.randomUUID(), tenantId: session.tenantId, category: "case", action: "view", outcome: "success", actor: { userId: session.userId }, target: { type: "case", id: record.caseId, caseReference: reference }, occurredAt: new Date(), requestId: id, metadata: {} });
    return NextResponse.json({ data: { ...record, answers } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("submissions.detail", { requestId: id, error: error instanceof Error ? error.message : "unknown" });
    return jsonError(503, "SERVICE_UNAVAILABLE", "The submission is temporarily unavailable.", id);
  }
}
