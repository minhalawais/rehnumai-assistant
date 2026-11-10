import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { jsonError, requestId } from "@/lib/api";
import { caseScope } from "@/lib/case-access";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const id = requestId(request);
  try {
    const session = await getSession();
    if (!session) return jsonError(401, "AUTHENTICATION_REQUIRED", "Sign in is required.", id);
    const scope = caseScope(session);
    if (!scope) return jsonError(403, "PERMISSION_DENIED", "You do not have permission to view submissions.", id);
    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20));
    const stage = url.searchParams.get("stage")?.trim();
    const category = url.searchParams.get("category")?.trim();
    const search = url.searchParams.get("q")?.trim().slice(0, 80);
    const requested: Record<string, unknown> = {};
    if (stage) requested["migrationSummary.stage"] = stage;
    if (category) requested["migrationSummary.category"] = category;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      requested.$or = [{ caseReference: { $regex: escaped, $options: "i" } }, { "applicantSummary.displayName": { $regex: escaped, $options: "i" } }];
    }
    const filter = { ...scope, ...requested };
    const db = await getDb();
    const collection = db.collection("cases");
    const [rows, total] = await Promise.all([
      collection.find(filter).sort({ submittedAt: -1 }).skip((page - 1) * limit).limit(limit).project({ _id: 0, caseReference: 1, status: 1, applicantSummary: 1, migrationSummary: 1, attentionSignalCodes: 1, submittedAt: 1, updatedAt: 1 }).toArray(),
      collection.countDocuments(filter),
    ]);
    return NextResponse.json({ data: rows, meta: { requestId: id, page, limit, total } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("submissions.list", { requestId: id, error: error instanceof Error ? error.message : "unknown" });
    return jsonError(503, "SERVICE_UNAVAILABLE", "Submissions are temporarily unavailable.", id);
  }
}
