export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FeatureKey, FEATURE_REGISTRY } from "@/lib/license-core";

// GET /api/admin/license/custom-addon - Fetch current custom addons
export async function GET() {
  try {
    const cache = await prisma.licenseCache.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!cache) {
      return NextResponse.json({ success: true, customPermissions: {}, customAddons: [] });
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(cache.entitlementsJson);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      customPermissions: parsed.customPermissions || {},
      customAddons: parsed.customAddons || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/admin/license/custom-addon - Grant or revoke custom feature permissions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { featureKey, enabled = true, addonCode, action } = body;
    const targetAddon = addonCode || body.addonKey;

    const cache = await prisma.licenseCache.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!cache) {
      return NextResponse.json(
        { success: false, error: "No local license found." },
        { status: 404 }
      );
    }

    let entitlements: any = {};
    try {
      entitlements = JSON.parse(cache.entitlementsJson);
    } catch (e) {}

    entitlements.customPermissions = entitlements.customPermissions || {};
    entitlements.customAddons = entitlements.customAddons || [];

    if (action === "TOGGLE_FEATURE" && featureKey) {
      if (!FEATURE_REGISTRY[featureKey as FeatureKey]) {
        return NextResponse.json(
          { success: false, error: `Unrecognized feature key: ${featureKey}` },
          { status: 400 }
        );
      }

      if (enabled) {
        entitlements.customPermissions[featureKey] = true;
      } else {
        delete entitlements.customPermissions[featureKey];
      }
    } else if (targetAddon && action !== "REMOVE_ADDON") {
      const code = targetAddon.trim().toUpperCase();
      if (!entitlements.customAddons.includes(code)) {
        entitlements.customAddons.push(code);
      }
    } else if (action === "REMOVE_ADDON" && targetAddon) {
      const code = targetAddon.trim().toUpperCase();
      entitlements.customAddons = entitlements.customAddons.filter((c: string) => c !== code);
    }

    await prisma.licenseCache.update({
      where: { id: cache.id },
      data: {
        entitlementsJson: JSON.stringify(entitlements),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Customized module permissions updated successfully.",
      customPermissions: entitlements.customPermissions,
      customAddons: entitlements.customAddons,
    });
  } catch (err: any) {
    console.error("[CUSTOM_ADDON_ERROR]", err);
    return NextResponse.json(
      { success: false, error: "Failed to update custom module." },
      { status: 500 }
    );
  }
}
