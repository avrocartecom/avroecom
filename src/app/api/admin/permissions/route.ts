export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStorePermissions } from "@/lib/permissions";

export async function GET() {
  try {
    const permissions = await getStorePermissions();
    return NextResponse.json({
      success: true,
      valid: permissions.valid,
      status: permissions.status,
      plan: permissions.plan,
      planName: permissions.planName,
      pricing: permissions.pricing,
      priceINR: permissions.pricing.monthly,
      expiresAt: permissions.expiresAt,
      isGracePeriod: permissions.isGracePeriod,
      entitlements: permissions.entitlements,
      customAddons: permissions.customAddons,
      customPermissions: permissions.customPermissions,
      featureMatrix: permissions.featureMatrix,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load permissions." },
      { status: 500 }
    );
  }
}
