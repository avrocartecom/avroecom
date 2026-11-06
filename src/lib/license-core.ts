import crypto from "crypto";

export type PlanTier = "BASIC" | "GROW" | "PLUS";

export interface LicenseEntitlements {
  paymentGateways: boolean; // false for Basic (COD & Bank Transfer only), true for Grow & Plus
  courierIntegrations: boolean; // false for Basic, true for Grow & Plus
  customThemes: boolean;
  advancedReports: boolean;
  prioritySupport: boolean;
  maxAdminUsers: number;
}

export interface LicensePayload {
  licenseKey: string;
  customerId: string;
  subscriptionId: string;
  plan: PlanTier;
  boundDomain?: string | null;
  installationUuid?: string | null;
  issuedAt: string;
  expiresAt: string;
  entitlements: LicenseEntitlements;
  status: "ACTIVE" | "SUSPENDED" | "REVOKED" | "EXPIRED";
}

export const PLAN_DEFAULT_ENTITLEMENTS: Record<PlanTier, LicenseEntitlements> = {
  BASIC: {
    paymentGateways: false,
    courierIntegrations: false,
    customThemes: false,
    advancedReports: false,
    prioritySupport: false,
    maxAdminUsers: 1,
  },
  GROW: {
    paymentGateways: true,
    courierIntegrations: true,
    customThemes: true,
    advancedReports: true,
    prioritySupport: false,
    maxAdminUsers: 3,
  },
  PLUS: {
    paymentGateways: true,
    courierIntegrations: true,
    customThemes: true,
    advancedReports: true,
    prioritySupport: true,
    maxAdminUsers: 9999,
  },
};

/**
 * Generate a cryptographically random and structured license key:
 * Format: AVRO-<PLAN>-<12 HEX>-<4 CHECKSUM>
 * Example: AVRO-GROW-9B4F81E732AC-4A12
 */
export function generateLicenseKey(plan: PlanTier): string {
  const randomHex = crypto.randomBytes(6).toString("hex").toUpperCase();
  const rawData = `AVRO-${plan}-${randomHex}`;
  const checksum = crypto
    .createHash("sha256")
    .update(rawData)
    .digest("hex")
    .substring(0, 4)
    .toUpperCase();
  return `${rawData}-${checksum}`;
}

/**
 * Validates the checksum structure of an AVRO license key.
 */
export function verifyLicenseKeyFormat(licenseKey: string): {
  valid: boolean;
  plan?: PlanTier;
} {
  const parts = licenseKey.trim().toUpperCase().split("-");
  if (parts.length !== 4) return { valid: false };
  const [prefix, planStr, randomHex, checksum] = parts;
  if (prefix !== "AVRO") return { valid: false };
  if (!["BASIC", "GROW", "PLUS"].includes(planStr)) return { valid: false };

  const rawData = `AVRO-${planStr}-${randomHex}`;
  const expectedChecksum = crypto
    .createHash("sha256")
    .update(rawData)
    .digest("hex")
    .substring(0, 4)
    .toUpperCase();

  if (checksum !== expectedChecksum) return { valid: false };

  return { valid: true, plan: planStr as PlanTier };
}

/**
 * Technext Central signs an entitlement payload using an HMAC secret.
 */
export function signEntitlementToken(
  payload: LicensePayload,
  secretKey: string
): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Customer Store verifies the entitlement token returned by Central.
 */
export function verifyEntitlementToken(
  token: string,
  secretKey: string
): { valid: boolean; payload?: LicensePayload; error?: string } {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) {
      return { valid: false, error: "Malformed entitlement token format." };
    }

    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false, error: "Invalid signature verification." };
    }

    const payload: LicensePayload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    );

    // Check expiration
    const now = new Date();
    const expiry = new Date(payload.expiresAt);
    if (now > expiry) {
      return {
        valid: false,
        payload,
        error: `License expired on ${expiry.toISOString()}`,
      };
    }

    if (payload.status !== "ACTIVE") {
      return {
        valid: false,
        payload,
        error: `License is currently ${payload.status}`,
      };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || "Token parsing failed." };
  }
}
