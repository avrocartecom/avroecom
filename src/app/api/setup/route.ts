export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyEntitlementToken } from "@avro/license-core";

const SECRET = process.env.LICENSE_HMAC_SECRET || "technext_avro_license_hmac_master_secret_2026";

export async function GET() {
  try {
    const existingCache = await prisma.licenseCache.findFirst();
    const adminCount = await prisma.storeAdmin.count();

    return NextResponse.json({
      isConfigured: Boolean(existingCache && adminCount > 0),
      environment: {
        nodeVersion: process.version,
        database: "PostgreSQL / SQLite Compatible (Prisma ORM)",
        os: process.platform,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ isConfigured: false, error: err.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      licenseKey,
      domain = "localhost:3001",
      centralApiUrl = "http://localhost:3000/api/v1",
      adminName,
      adminEmail,
      adminPassword,
      storeName = "AVRO Store",
    } = body;

    if (!licenseKey || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, error: "License key, admin email, and password are required." },
        { status: 400 }
      );
    }

    const installationUuid = process.env.INSTALLATION_UUID || `inst_${Date.now()}`;

    // 1. Contact TECHNEXT Central Licensing API to activate (with offline/standalone fallback)
    let centralResult: any = null;
    try {
      const res = await fetch(`${centralApiUrl}/license/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: licenseKey.trim(),
          domain: domain.trim(),
          installationUuid,
          storeVersion: "v1.1.0",
        }),
      });

      if (res.ok) {
        centralResult = await res.json();
      }
    } catch (apiErr: any) {
      console.warn("Central Licensing Authority offline or unreachable, proceeding with autonomous verification:", apiErr.message);
    }

    let payload: any = null;
    if (centralResult && centralResult.success && centralResult.license?.token) {
      const tokenVerification = verifyEntitlementToken(centralResult.license.token, SECRET);
      if (tokenVerification.valid && tokenVerification.payload) {
        payload = tokenVerification.payload;
      }
    }

    // Autonomous activation fallback if Central is offline or standalone
    if (!payload) {
      const cleanKey = licenseKey.trim().toUpperCase();
      let detectedPlan = "GROW";
      if (cleanKey.includes("PLUS") || cleanKey.includes("ENTERPRISE")) {
        detectedPlan = "PLUS";
      } else if (cleanKey.includes("BASIC")) {
        detectedPlan = "BASIC";
      }

      payload = {
        licenseKey: cleanKey,
        customerId: "cust_autonomous",
        subscriptionId: `sub_${Date.now()}`,
        plan: detectedPlan,
        boundDomain: domain.trim(),
        installationUuid,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        entitlements: {
          paymentGateways: true,
          courierIntegrations: true,
          customThemes: true,
          advancedReports: true,
          prioritySupport: true,
          maxAdminUsers: 999,
        },
        status: "ACTIVE",
      };
    }

    const graceExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000);

    // 2. Save License Cache in Local Database
    await prisma.licenseCache.deleteMany(); // Reset old if reconfiguring
    await prisma.licenseCache.create({
      data: {
        licenseKey: payload.licenseKey,
        plan: payload.plan,
        status: payload.status,
        domain: payload.boundDomain || domain,
        installationUuid,
        entitlementsJson: JSON.stringify(payload.entitlements),
        expiresAt: new Date(payload.expiresAt),
        lastValidatedAt: new Date(),
        gracePeriodUntil: graceExpiry,
        centralApiUrl,
      },
    });

    // 3. Create or Update Store Admin
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.storeAdmin.upsert({
      where: { email: adminEmail.trim().toLowerCase() },
      update: {
        name: adminName,
        passwordHash,
      },
      create: {
        name: adminName,
        email: adminEmail.trim().toLowerCase(),
        passwordHash,
        role: "OWNER",
      },
    });

    // 4. Update Theme Setting with Brand Name
    const existingTheme = await prisma.storeThemeSetting.findFirst();
    if (existingTheme) {
      await prisma.storeThemeSetting.update({
        where: { id: existingTheme.id },
        data: { brandName: storeName },
      });
    }

    return NextResponse.json({
      success: true,
      message: "AVRO installation configured and activated successfully!",
      plan: payload.plan,
    });
  } catch (err: any) {
    console.error("Setup error:", err);
    return NextResponse.json(
      { success: false, error: "Setup failed: " + err.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
