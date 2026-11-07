import { cookies } from "next/headers";
import { createOpaqueToken, safeEqual } from "./security";

const COOKIE = "rehnumai_csrf";
export async function issueCsrfToken() { const token = createOpaqueToken(24); const jar = await cookies(); jar.set(COOKIE, token, { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" }); return token; }
export async function requireCsrf(request: Request) { const cookie = (await cookies()).get(COOKIE)?.value; const header = request.headers.get("x-csrf-token"); if (!cookie || !header || !safeEqual(cookie, header)) return false; const origin = request.headers.get("origin"); const host = request.headers.get("host"); return !origin || !host || new URL(origin).host === host; }
