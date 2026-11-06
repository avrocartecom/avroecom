export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let centralUrl = body.centralUrl?.trim();

    if (!centralUrl) {
      const cache = await prisma.licenseCache.findFirst({
        orderBy: { updatedAt: "desc" },
      });
      centralUrl = cache?.centralApiUrl || process.env.CENTRAL_API_URL || "http://localhost:3000/api/v1";
    }

    // Clean URL
    centralUrl = centralUrl.replace(/\/+$/, "");

    // Ping Central health or validate endpoint
    const pingEndpoint = `${centralUrl}/license/validate`;
    const fetchUrl = pingEndpoint.replace("://localhost:", "://127.0.0.1:");

    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(fetchUrl, {
      method: "OPTIONS",
      signal: controller.signal,
    }).catch(async () => {
      // If OPTIONS isn't supported, test GET or POST ping
      return await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ping: true }),
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      success: true,
      centralUrl,
      pingEndpoint,
      status: res.status,
      latencyMs,
      message: `Successfully connected to TECHNEXT Central (${latencyMs}ms)`,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: `Could not reach Central API: ${err.message}`,
    });
  }
}
