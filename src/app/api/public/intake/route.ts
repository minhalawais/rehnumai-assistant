import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type { Db } from "mongodb";
import { getDb } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { jsonError, requestId } from "@/lib/api";
import { requireCsrf } from "@/lib/csrf";
import { cnicMatchPattern, identityFromAnswers, normalizeCnic, normalizePassport, passportMatchPattern } from "@/lib/intake-identity";
import { applicableFieldKeys, stripHiddenAnswers, validatePublicAnswersForCategory } from "@/lib/kobo-intake-rules";
import { publicSubmissionSchema } from "@/lib/public-intake";

let identityIndexesReady = false;

async function ensureIdentityIndexes(db: Db) {
  if (identityIndexesReady) return;
  const cases = db.collection("cases");
  await cases.createIndex(
    { tenantId: 1, "identity.cnic": 1 },
    { unique: true, name: "uniq_tenant_cnic", partialFilterExpression: { "identity.cnic": { $type: "string" } } },
  );
  await cases.createIndex(
    { tenantId: 1, "identity.passports": 1 },
    { unique: true, name: "uniq_tenant_passport", partialFilterExpression: { "identity.passports.0": { $exists: true } } },
  );
  identityIndexesReady = true;
}

function duplicateMessage(language: "ur" | "en", field: "cnic" | "passport") {
  if (field === "cnic") return language === "ur" ? "یہ شناختی کارڈ نمبر پہلے سے درج ہے۔" : "This CNIC number is already registered.";
  return language === "ur" ? "یہ پاسپورٹ نمبر پہلے سے درج ہے۔" : "This passport number is already registered.";
}

function isDuplicateKey(error: unknown): error is { code: number; keyPattern?: Record<string, unknown> } {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 11000;
}

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
    const { clientRequestId, answers: rawAnswers } = parsed.data;
    const answers = stripHiddenAnswers(rawAnswers);
    const categoryCheck = validatePublicAnswersForCategory(answers);
    if (!categoryCheck.ok) return jsonError(422, "VALIDATION_FAILED", "Please check the answers and try again.", id);
    const tenantId = env.PUBLIC_INTAKE_TENANT_ID;
    const collection = db.collection("cases");
    const existing = await collection.findOne({ tenantId, clientRequestId }, { projection: { _id: 0, caseReference: 1 } });
    if (existing) return NextResponse.json({ data: { caseReference: existing.caseReference }, meta: { requestId: id } }, { headers: { "Cache-Control": "no-store" } });

    const identity = identityFromAnswers(answers);
    if (identity.cnic || identity.passports.length) {
      const clauses: Record<string, unknown>[] = [];
      if (identity.cnic) clauses.push({ "answers.cnic": { $regex: cnicMatchPattern(identity.cnic) } });
      for (const passport of identity.passports) {
        const pattern = { $regex: passportMatchPattern(passport), $options: "i" };
        clauses.push({ "answers.passportNo": pattern }, { "answers.passportNoAlt": pattern });
      }
      const prior = await db.collection("caseRevisions").findOne(
        { tenantId, $or: clauses },
        { projection: { "answers.cnic": 1, "answers.passportNo": 1, "answers.passportNoAlt": 1 } },
      );
      if (prior) {
        const priorAnswers = (prior.answers ?? {}) as { cnic?: string; passportNo?: string; passportNoAlt?: string };
        const sameCnic = Boolean(identity.cnic) && normalizeCnic(String(priorAnswers.cnic ?? "")) === identity.cnic;
        const field = sameCnic ? "cnic" : "passport";
        return jsonError(409, "DUPLICATE_IDENTITY", duplicateMessage(answers.language, field), id);
      }
    }
    await ensureIdentityIndexes(db);

    // This is an application-level floor. Production deployments also need an edge rate limit.
    const forwardedIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("cf-connecting-ip")?.trim();
    const rateSource =
      forwardedIp ||
      createHash("sha256").update(`${request.headers.get("user-agent") ?? "unknown"}:${Math.floor(Date.now() / 86_400_000)}`).digest("hex");
    if (rateSource) {
      const bucket = Math.floor(Date.now() / 3_600_000);
      const key = createHash("sha256").update(`${env.SESSION_SECRET ?? "development"}:${rateSource}:${bucket}`).digest("hex");
      const rate = await db.collection<{ _id: string; count: number; expiresAt: Date }>("publicIntakeRate").findOneAndUpdate({ _id: key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 7_200_000) } }, { upsert: true, returnDocument: "after" });
      if ((rate?.count ?? 0) > 10) return jsonError(429, "RATE_LIMITED", "Too many submissions. Try again later.", id);
    }

    const now = new Date();
    const caseId = crypto.randomUUID();
    const caseReference = `MIG-${String(now.getFullYear()).slice(-2)}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const attentionSignalCodes: string[] = [];
    const storedAnswers = { ...answers, attentionSignalCodes };
    const migrationStage = answers.migrantCategory === "return_migrants" ? "returned" : "exploring";
    const identityRecord = {
      ...(identity.cnic ? { cnic: identity.cnic } : {}),
      ...(identity.passports.length ? { passports: identity.passports } : {}),
    };
    try {
      await collection.insertOne({ tenantId, teamId: null, locationId: null, caseId, caseReference, clientRequestId, formKey: "migration-intake", formVersion: "2.0.0", currentRevision: 1, workingRevision: null, status: "submitted", language: answers.language, sourceChannel: "public_intake", applicantSummary: { displayName: answers.fullName }, migrationSummary: { category: answers.migrantCategory, stage: migrationStage, destinationCountry: answers.countryReturnFrom || undefined }, identity: identityRecord, attentionSignalCodes, reviewPriority: "routine", assignedUserId: null, createdBy: null, createdAt: now, updatedAt: now, submittedAt: now, version: 1 });
    } catch (error) {
      if (!isDuplicateKey(error)) throw error;
      const field = error.keyPattern && "identity.cnic" in error.keyPattern ? "cnic" : "passport";
      return jsonError(409, "DUPLICATE_IDENTITY", duplicateMessage(answers.language, field), id);
    }
    await db.collection("caseRevisions").insertOne({ tenantId, caseId, revisionNumber: 1, formVersion: "2.0.0", state: "submitted", answers: storedAnswers, applicableFieldKeys: applicableFieldKeys(answers.migrantCategory), createdBy: null, createdAt: now, version: 1 });
    await db.collection("auditEvents").insertOne({ eventId: crypto.randomUUID(), tenantId, category: "case", action: "public_submit", outcome: "success", actor: { type: "public" }, target: { type: "case", id: caseId, caseReference }, occurredAt: now, requestId: id, metadata: {} });
    return NextResponse.json({ data: { caseReference }, meta: { requestId: id } }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return jsonError(422, "VALIDATION_FAILED", "Please check the form and try again.", id);
    console.error("public-intake.submit", { requestId: id, error: error instanceof Error ? error.message : "unknown" });
    return jsonError(503, "SERVICE_UNAVAILABLE", "Submission is temporarily unavailable. Please try again.", id);
  }
}
