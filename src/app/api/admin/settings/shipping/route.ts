export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getStoreLicenseStatus } from "@/lib/license-client";

export async function GET() {
  try {
    const providers = await prisma.shippingProviderSetting.findMany({
      orderBy: { createdAt: "asc" },
    });

    const licenseStatus = await getStoreLicenseStatus();

    const formatted = providers.map((p) => {
      let config = {};
      try {
        config = JSON.parse(p.configJson || "{}");
      } catch (e) {}

      return {
        id: p.id,
        provider: p.provider,
        isEnabled: p.isEnabled,
        isTestMode: p.isTestMode,
        title: p.title,
        config,
      };
    });

    return NextResponse.json({
      success: true,
      providers: formatted,
      canUseCourierAPIs: licenseStatus.entitlements.courierIntegrations,
      plan: licenseStatus.plan,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, isEnabled, isTestMode, title, config } = body;

    const licenseStatus = await getStoreLicenseStatus();

    const isCourierAPI = ["SHIPROCKET", "DELHIVERY", "DTDC"].includes(provider);
    if (isCourierAPI && isEnabled && !licenseStatus.entitlements.courierIntegrations) {
      return NextResponse.json(
        {
          success: false,
          error: `Automated courier integrations require an AVRO Grow or Plus license. Your current plan is AVRO ${licenseStatus.plan}.`,
        },
        { status: 403 }
      );
    }

    const updated = await prisma.shippingProviderSetting.upsert({
      where: { provider },
      update: {
        isEnabled: Boolean(isEnabled),
        isTestMode: Boolean(isTestMode),
        title,
        configJson: JSON.stringify(config || {}),
      },
      create: {
        provider,
        isEnabled: Boolean(isEnabled),
        isTestMode: Boolean(isTestMode),
        title: title || provider,
        configJson: JSON.stringify(config || {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: `${provider} configuration saved locally.`,
      provider: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
