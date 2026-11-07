import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createOpaqueToken(bytes = 32) { return randomBytes(bytes).toString("base64url"); }
export function hashOpaqueToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function safeEqual(left: string, right: string) { const a = Buffer.from(left); const b = Buffer.from(right); return a.length === b.length && timingSafeEqual(a, b); }
export function normalizeEmail(value: string) { return value.trim().toLowerCase(); }
export function redact(value: string, visible = 4) { return value.length <= visible ? "••••" : `${value.slice(0, visible)}••••`; }
