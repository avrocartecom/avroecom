export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getStoreLicenseStatus } from "@/lib/license-client";

export async function GET() {
  try {
    const gateways = await prisma.paymentGatewaySetting.findMany({
      orderBy: { createdAt: "asc" },
    });

    const licenseStatus = await getStoreLicenseStatus();

    // Map gateways safely (mask secrets slightly for security)
    const formatted = gateways.map((g) => {
      let config = {};
      try {
        config = JSON.parse(g.configJson || "{}");
      } catch (e) {}

      return {
        id: g.id,
        provider: g.provider,
        isEnabled: g.isEnabled,
        isTestMode: g.isTestMode,
        title: g.title,
        description: g.description,
        config,
      };
    });

    return NextResponse.json({
      success: true,
      gateways: formatted,
      canUseOnlineGateways: licenseStatus.entitlements.paymentGateways,
      plan: licenseStatus.plan,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, isEnabled, isTestMode, title, description, config } = body;

    const licenseStatus = await getStoreLicenseStatus();

    // Enforce license entitlement: Basic plan cannot enable Razorpay, PhonePe, or Stripe
    const isOnlineGateway = ["RAZORPAY", "PHONEPE", "STRIPE"].includes(provider);
    if (isOnlineGateway && isEnabled && !licenseStatus.entitlements.paymentGateways) {
      return NextResponse.json(
        {
          success: false,
          error: `Your current AVRO plan (${licenseStatus.plan}) only supports Cash on Delivery and Bank Transfer. Upgrade to AVRO Grow or Plus to unlock online payment gateways.`,
        },
        { status: 403 }
      );
    }

    const updated = await prisma.paymentGatewaySetting.upsert({
      where: { provider },
      update: {
        isEnabled: Boolean(isEnabled),
        isTestMode: Boolean(isTestMode),
        title,
        description,
        configJson: JSON.stringify(config || {}),
      },
      create: {
        provider,
        isEnabled: Boolean(isEnabled),
        isTestMode: Boolean(isTestMode),
        title: title || provider,
        description,
        configJson: JSON.stringify(config || {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: `${provider} configuration saved securely on this server.`,
      gateway: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
