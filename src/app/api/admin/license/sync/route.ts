export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { syncLicenseWithCentral, getStoreLicenseStatus } from "@/lib/license-client";

export async function POST() {
  try {
    const syncRes = await syncLicenseWithCentral();
    const currentStatus = await getStoreLicenseStatus();

    return NextResponse.json({
      success: syncRes.success,
      message: syncRes.message,
      license: currentStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
