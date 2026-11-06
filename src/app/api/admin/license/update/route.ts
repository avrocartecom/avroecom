import { NextRequest, NextResponse } from "next/server";
import { updateStoreLicenseKey } from "@/lib/license-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { licenseKey, domain, centralApiUrl } = body;

    if (!licenseKey) {
      return NextResponse.json(
        { success: false, error: "License key is required." },
        { status: 400 }
      );
    }

    const result = await updateStoreLicenseKey({
      licenseKey,
      domain,
      centralApiUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      license: result.license,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update license key." },
      { status: 500 }
    );
  }
}
