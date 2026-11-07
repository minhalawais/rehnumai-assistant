import { NextResponse } from "next/server";
import { issueCsrfToken } from "@/lib/csrf";

export const runtime = "nodejs";
export async function GET() { return NextResponse.json({ data: { token: await issueCsrfToken() } }); }
