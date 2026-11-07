import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/lib/auth";
import { requireCsrf } from "@/lib/csrf";

export const runtime = "nodejs";
export async function POST(request: Request) { if (!(await requireCsrf(request))) return NextResponse.json({ error: { code: "CSRF_FAILED", message: "Security verification failed." } }, { status: 403 }); await revokeCurrentSession(); return NextResponse.json({ data: { signedOut: true } }); }
