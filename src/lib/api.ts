import { NextResponse } from "next/server";
export function jsonError(status: number, code: string, message: string, requestId: string) { return NextResponse.json({ error: { code, message, requestId } }, { status }); }
export function requestId(request: Request) { return request.headers.get("x-request-id") ?? crypto.randomUUID(); }
