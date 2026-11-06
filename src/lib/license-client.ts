import prisma from "@/lib/prisma";
import {
  verifyEntitlementToken,
  PLAN_DEFAULT_ENTITLEMENTS,
  LicenseEntitlements,
  PlanTier,
} from "@avro/license-core";

const SECRET = process.env.LICENSE_HMAC_SECRET || "technext_avro_license_hmac_master_secret_2026";

export interface LicenseStatusResult {
  valid: boolean;
  status: string;
  plan: PlanTier;
  entitlements: LicenseEntitlements;
  domain: string;
  expiresAt: string;
  isGracePeriod: boolean;
  message?: string;
}

/**
 * Retrieves the local license cache and optionally validates against Central API if expired.
 */
export async function getStoreLicenseStatus(): Promise<LicenseStatusResult> {
  const cache = await prisma.licenseCache.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (!cache) {
    return {
      valid: false,
      status: "UNACTIVATED",
      plan: "BASIC",
      entitlements: PLAN_DEFAULT_ENTITLEMENTS.BASIC,
      domain: "localhost",
      expiresAt: new Date().toISOString(),
      isGracePeriod: false,
      message: "Installation is not activated. Run the /setup wizard.",
    };
  }

  const now = new Date();
  const isGrace = now < cache.gracePeriodUntil && now > cache.expiresAt;
  const isExpired = now > cache.gracePeriodUntil;

  let entitlements = PLAN_DEFAULT_ENTITLEMENTS.BASIC;
  try {
    entitlements = JSON.parse(cache.entitlementsJson);
  } catch (e) {
    // fallback
  }

  if (isExpired || cache.status !== "ACTIVE") {
    return {
      valid: false,
      status: cache.status === "ACTIVE" ? "EXPIRED" : cache.status,
      plan: cache.plan as PlanTier,
      entitlements,
      domain: cache.domain,
      expiresAt: cache.expiresAt.toISOString(),
      isGracePeriod: false,
      message: `License is ${cache.status}. Please renew your AVRO subscription.`,
    };
  }

  return {
    valid: true,
    status: cache.status,
    plan: cache.plan as PlanTier,
    entitlements,
    domain: cache.domain,
    expiresAt: cache.expiresAt.toISOString(),
    isGracePeriod: isGrace,
    message: isGrace ? "Operating within 72-hour offline grace period." : "License active and in good standing.",
  };
}

/**
 * Triggers a real heartbeat check with TECHNEXT Central API.
 */
export async function syncLicenseWithCentral(): Promise<{
  success: boolean;
  message: string;
  status?: LicenseStatusResult;
}> {
  const cache = await prisma.licenseCache.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (!cache) {
    return { success: false, message: "No local license found to sync." };
  }

  try {
    const res = await fetch(`${cache.centralApiUrl}/license/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        licenseKey: cache.licenseKey,
        domain: cache.domain,
        installationUuid: cache.installationUuid,
        storeVersion: "v1.1.0",
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.valid) {
      if (data.code === "LICENSE_SUSPENDED" || data.code === "LICENSE_REVOKED") {
        await prisma.licenseCache.update({
          where: { id: cache.id },
          data: { status: data.code.replace("LICENSE_", "") },
        });
      }
      return { success: false, message: data.error || "License validation rejected by Central." };
    }

    // Verify token
    const verification = verifyEntitlementToken(data.token, SECRET);
    if (!verification.valid || !verification.payload) {
      return { success: false, message: "Cryptographic entitlement verification failed." };
    }

    const payload = verification.payload;
    const graceExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000);

    await prisma.licenseCache.update({
      where: { id: cache.id },
      data: {
        plan: payload.plan,
        status: payload.status,
        entitlementsJson: JSON.stringify(payload.entitlements),
        expiresAt: new Date(payload.expiresAt),
        lastValidatedAt: new Date(),
        gracePeriodUntil: graceExpiry,
      },
    });

    return {
      success: true,
      message: "License synchronized and validated successfully with TECHNEXT Central!",
      status: {
        valid: true,
        status: payload.status,
        plan: payload.plan,
        entitlements: payload.entitlements,
        domain: cache.domain,
        expiresAt: payload.expiresAt,
        isGracePeriod: false,
      },
    };
  } catch (error: any) {
    return { success: false, message: `Could not connect to Central API: ${error.message}` };
  }
}

/**
 * Replaces or updates the store license key, activates with Central API, and updates local cache.
 */
export async function updateStoreLicenseKey({
  licenseKey,
  domain,
  centralApiUrl,
}: {
  licenseKey: string;
  domain?: string;
  centralApiUrl?: string;
}): Promise<{
  success: boolean;
  message: string;
  license?: LicenseStatusResult;
}> {
  if (!licenseKey || !licenseKey.trim()) {
    return { success: false, message: "A valid license key is required." };
  }

  const existingCache = await prisma.licenseCache.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  const targetCentralUrl =
    centralApiUrl?.trim() ||
    existingCache?.centralApiUrl ||
    process.env.CENTRAL_API_URL ||
    "http://localhost:3000/api/v1";

  const targetDomain =
    domain?.trim() ||
    existingCache?.domain ||
    process.env.STORE_DOMAIN ||
    "localhost:3001";

  const installationUuid =
    existingCache?.installationUuid ||
    process.env.INSTALLATION_UUID ||
    `inst_${Date.now()}`;

  try {
    const res = await fetch(`${targetCentralUrl}/license/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        licenseKey: licenseKey.trim(),
        domain: targetDomain,
        installationUuid,
        storeVersion: "v1.1.0",
      }),
    });

    const centralResult = await res.json();
    if (!res.ok || !centralResult.success) {
      return {
        success: false,
        message: centralResult.error || "Central licensing server rejected the license key.",
      };
    }

    const lic = centralResult.license;
    const tokenVerification = verifyEntitlementToken(lic.token, SECRET);
    if (!tokenVerification.valid || !tokenVerification.payload) {
      return {
        success: false,
        message: "Cryptographic signature on license activation token is invalid.",
      };
    }

    const payload = tokenVerification.payload;
    const graceExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000);

    // Save in local database
    await prisma.licenseCache.deleteMany();
    await prisma.licenseCache.create({
      data: {
        licenseKey: payload.licenseKey,
        plan: payload.plan,
        status: payload.status,
        domain: lic.domain || targetDomain,
        installationUuid,
        entitlementsJson: JSON.stringify(payload.entitlements),
        expiresAt: new Date(payload.expiresAt),
        lastValidatedAt: new Date(),
        gracePeriodUntil: graceExpiry,
        centralApiUrl: targetCentralUrl,
      },
    });

    const newStatus = await getStoreLicenseStatus();

    return {
      success: true,
      message: `License successfully updated to ${payload.plan} tier! All store operations are unlocked.`,
      license: newStatus,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Could not connect to Central Licensing Server at ${targetCentralUrl}: ${error.message}`,
    };
  }
}

/**
 * Fetches active broadcast announcements pushed by TECHNEXT Central
 */
export async function getStoreBroadcasts(plan?: string): Promise<any[]> {
  try {
    const cache = await prisma.licenseCache.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    const centralUrl = cache?.centralApiUrl || "http://localhost:3000/api/v1";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${centralUrl}/broadcasts?tier=${plan || "ALL"}`, {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data.broadcasts || [];
    }
  } catch (err) {
    // Graceful offline fallback
  }
  return [];
}


