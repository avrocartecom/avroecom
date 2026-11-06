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

    // 1. Contact TECHNEXT Central Licensing API to activate
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

      centralResult = await res.json();
      if (!res.ok || !centralResult.success) {
        throw new Error(centralResult.error || "Central license activation failed.");
      }
    } catch (apiErr: any) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to contact TECHNEXT Licensing Authority: ${apiErr.message}`,
        },
        { status: 400 }
      );
    }

    const lic = centralResult.license;
    const tokenVerification = verifyEntitlementToken(lic.token, SECRET);
    if (!tokenVerification.valid || !tokenVerification.payload) {
      return NextResponse.json(
        { success: false, error: "Cryptographic signature on license activation token is invalid." },
        { status: 400 }
      );
    }

    const payload = tokenVerification.payload;
    const graceExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000);

    // 2. Save License Cache in Local Database
    await prisma.licenseCache.deleteMany(); // Reset old if reconfiguring
    await prisma.licenseCache.create({
      data: {
        licenseKey: payload.licenseKey,
        plan: payload.plan,
        status: payload.status,
        domain: lic.domain || domain,
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
