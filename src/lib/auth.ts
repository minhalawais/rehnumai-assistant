import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { getEnv } from "./env";
import { createOpaqueToken, hashOpaqueToken, normalizeEmail } from "./security";

const SESSION_DAYS = 8;
export async function verifyPassword(password: string, hash: string) { return argon2.verify(hash, password); }
export async function hashPassword(password: string) { return argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 }); }
export async function createSession(user: { _id: string; tenantId: string; roles: unknown[] }) { const env = getEnv(); const raw = createOpaqueToken(); const now = new Date(); const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000); const db = await getDb(); await db.collection("sessions").insertOne({ sessionId: crypto.randomUUID(), tenantId: user.tenantId, userId: user._id, tokenHash: hashOpaqueToken(raw), roles: user.roles, createdAt: now, lastSeenAt: now, expiresAt, revokedAt: null }); const jar = await cookies(); jar.set(env.SESSION_COOKIE_NAME, raw, { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: expiresAt }); return { expiresAt }; }
export async function getSession() { const env = getEnv(); const token = (await cookies()).get(env.SESSION_COOKIE_NAME)?.value; if (!token) return null; const db = await getDb(); const session = await db.collection("sessions").findOne({ tokenHash: hashOpaqueToken(token), revokedAt: null, expiresAt: { $gt: new Date() } }); if (!session || !ObjectId.isValid(session.userId)) return null; const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId), tenantId: session.tenantId, status: "active" }, { projection: { roles: 1, name: 1 } }); if (!user) return null; return { tenantId: String(session.tenantId), userId: String(session.userId), roles: user.roles ?? [], userName: user.name ?? "" }; }
export function sessionHasRole(session: unknown, allowed: string[]) { const roles = (session as { roles?: unknown[] } | null)?.roles; return Boolean(roles?.some((entry) => allowed.includes(typeof entry === "string" ? entry : (entry as { role?: string })?.role ?? ""))); }
export async function revokeCurrentSession() { const env = getEnv(); const jar = await cookies(); const token = jar.get(env.SESSION_COOKIE_NAME)?.value; if (!token) return; const db = await getDb(); await db.collection("sessions").updateOne({ tokenHash: hashOpaqueToken(token), revokedAt: null }, { $set: { revokedAt: new Date(), revokeReason: "logout" } }); jar.delete(env.SESSION_COOKIE_NAME); }
export { normalizeEmail };
