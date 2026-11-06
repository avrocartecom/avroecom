export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { disconnectStoreLicense, getStoreLicenseStatus } from "@/lib/license-client";

export async function POST() {
  try {
    const res = await disconnectStoreLicense();
    const current = await getStoreLicenseStatus();
    return NextResponse.json({
      success: res.success,
      message: res.message,
      license: current,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
