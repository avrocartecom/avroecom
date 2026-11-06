import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  FeatureKey,
  PlanTier,
  FEATURE_REGISTRY,
  PLAN_DEFAULT_ENTITLEMENTS,
  PLAN_PRICING,
  PLAN_NAMES,
  checkFeatureAccess,
  CheckAccessResult,
  LicenseEntitlements,
} from "@/lib/license-core";

export {
  type FeatureKey,
  type PlanTier,
  FEATURE_REGISTRY,
  PLAN_PRICING,
  PLAN_NAMES,
  checkFeatureAccess,
};

export interface StorePermissionsContext {
  valid: boolean;
  status: string;
  plan: PlanTier;
  planName: string;
  pricing: { monthly: number; sixMonths: number; yearly: number };
  expiresAt: string;
  isGracePeriod: boolean;
  entitlements: LicenseEntitlements;
  customAddons: string[];
  customPermissions: Record<string, boolean>;
  check: (feature: FeatureKey) => CheckAccessResult;
  featureMatrix: Record<FeatureKey, CheckAccessResult>;
}

// In-memory micro-cache to eliminate redundant PostgreSQL lookups across simultaneous server components
let cachedPermissionsContext: StorePermissionsContext | null = null;
let cachedPermissionsTimestamp = 0;
const PERMISSIONS_CACHE_TTL_MS = 15000; // 15 seconds

export function invalidateStorePermissionsCache() {
  cachedPermissionsContext = null;
  cachedPermissionsTimestamp = 0;
}

/**
 * Loads current store subscription, plan tier, entitlements, and custom addons from database.
 */
export async function getStorePermissions(): Promise<StorePermissionsContext> {
  const nowMs = Date.now();
  if (cachedPermissionsContext && nowMs - cachedPermissionsTimestamp < PERMISSIONS_CACHE_TTL_MS) {
    return cachedPermissionsContext;
  }

  let cache: any = null;
  try {
    cache = await prisma.licenseCache.findFirst({
      orderBy: { updatedAt: "desc" },
    });
  } catch (e) {
    // DB not ready or unreachable
  }

  const plan: PlanTier = (cache?.plan?.toUpperCase() || "BASIC") as PlanTier;
  const status = cache?.status || "ACTIVE";
  const now = new Date();
  const expiresAt = cache?.expiresAt ? new Date(cache.expiresAt) : new Date(Date.now() + 365 * 86400000);
  const gracePeriodUntil = cache?.gracePeriodUntil ? new Date(cache.gracePeriodUntil) : expiresAt;
  const isGrace = now < gracePeriodUntil && now > expiresAt;
  const isExpired = now > gracePeriodUntil || (status !== "ACTIVE" && status !== "TRIAL");

  let parsedEntitlements: Partial<LicenseEntitlements> = {};
  if (cache?.entitlementsJson) {
    try {
      parsedEntitlements = JSON.parse(cache.entitlementsJson);
    } catch (e) {}
  }

  const defaultEntitlements = PLAN_DEFAULT_ENTITLEMENTS[plan] || PLAN_DEFAULT_ENTITLEMENTS.BASIC;
  const entitlements: LicenseEntitlements = {
    ...defaultEntitlements,
    ...parsedEntitlements,
    plan,
  };

  const customAddons: string[] = entitlements.customAddons || [];
  const customPermissions: Record<string, boolean> = entitlements.customPermissions || {};

  const check = (feature: FeatureKey): CheckAccessResult => {
    return checkFeatureAccess(feature, plan, {
      status: isExpired ? "EXPIRED" : status,
      isGracePeriod: isGrace,
      customPermissions,
      customAddons,
    });
  };

  // Build full feature matrix
  const featureMatrix: Record<FeatureKey, CheckAccessResult> = {} as any;
  (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach((key) => {
    featureMatrix[key] = check(key);
  });

  const context: StorePermissionsContext = {
    valid: !isExpired,
    status: isExpired ? "EXPIRED" : status,
    plan,
    planName: PLAN_NAMES[plan] || plan,
    pricing: PLAN_PRICING[plan] || PLAN_PRICING.BASIC,
    expiresAt: expiresAt.toISOString(),
    isGracePeriod: isGrace,
    entitlements,
    customAddons,
    customPermissions,
    check,
    featureMatrix,
  };

  cachedPermissionsContext = context;
  cachedPermissionsTimestamp = Date.now();

  return context;
}

/**
 * Backend API guard: validates that the requested feature is permitted.
 * If locked, returns a standard 403 Forbidden Response with upgrade metadata.
 */
export async function enforceApiFeatureAccess(
  feature: FeatureKey
): Promise<{ allowed: true; context: StorePermissionsContext } | { allowed: false; response: NextResponse }> {
  const context = await getStorePermissions();
  const result = context.check(feature);

  if (!result.allowed) {
    const meta = FEATURE_REGISTRY[feature];
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          locked: true,
          feature,
          featureName: meta?.name || feature,
          currentPlan: context.plan,
          requiredPlan: result.requiredPlan,
          error: result.message,
          upgradeUrl: `/admin/license?upgrade=${result.requiredPlan}`,
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true, context };
}
