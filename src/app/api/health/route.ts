import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serverLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "connected";

  try {
    // Lightweight database readiness check
    await db.$queryRaw`SELECT 1`;
  } catch (err: unknown) {
    dbStatus = "disconnected";
    serverLogger.warn("Health check database ping failed", {
      error: err instanceof Error ? err.message : "DB unreachable",
    });
  }

  const isHealthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status: "ok",
      db: dbStatus,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
