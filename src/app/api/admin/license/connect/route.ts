export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { updateStoreLicenseKey, getStoreLicenseStatus } from "@/lib/license-client";

// CORS headers to allow Central Admin (e.g. port 3000 or production domain) to communicate with Store
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Central-Secret",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * GET /api/admin/license/connect
 * Health check & status query for Central Admin to probe store connectivity
 */
export async function GET(req: NextRequest) {
  try {
    const status = await getStoreLicenseStatus();
    return NextResponse.json(
      {
        success: true,
        message: "AVRO Store Licensing Endpoint Ready",
        storeDomain: req.headers.get("host") || "localhost:3001",
        license: status,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * POST /api/admin/license/connect
 * Receives license key and Central API endpoint, activates and registers local cache
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { licenseKey, domain, centralApiUrl } = body;

    if (!licenseKey || !licenseKey.trim()) {
      return NextResponse.json(
        { success: false, error: "License key is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const hostDomain = domain || req.headers.get("host") || "localhost:3001";
    const targetCentralUrl =
      centralApiUrl?.trim() ||
      process.env.CENTRAL_API_URL ||
      "http://localhost:3000/api/v1";

    const result = await updateStoreLicenseKey({
      licenseKey: licenseKey.trim(),
      domain: hostDomain,
      centralApiUrl: targetCentralUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `License key successfully connected and activated from Central Admin!`,
        license: result.license,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to connect license key.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
