import { NextResponse } from "next/server";
import { pingMongo } from "@/lib/db";
import { getEnv } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  const env = getEnv();
  const base = { service: "rehnumai", environment: env.NODE_ENV, timestamp: new Date().toISOString() };
  if (!env.MONGODB_URI) {
    return NextResponse.json({ data: { status: "ok", mongo: "not_configured", ...base } });
  }
  try {
    await pingMongo();
    return NextResponse.json({ data: { status: "ok", mongo: "connected", ...base } });
  } catch {
    return NextResponse.json({ data: { status: "degraded", mongo: "unreachable", ...base } }, { status: 503 });
  }
}
