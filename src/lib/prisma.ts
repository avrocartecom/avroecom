import { PrismaClient } from "../generated/client";

declare global {
  // eslint-disable-next-line no-var
  var storePrisma: PrismaClient | undefined;
}

export function getStoreDbUrl(): string | undefined {
  const env = process.env;
  const envKeys = Object.keys(env);

  // 1. High-priority check for Supabase environment variables (e.g. from Vercel Supabase integration)
  const supabaseCandidateKeys = [
    "SUPABASE_POSTGRES_PRISMA_URL",
    "SUPABASE_POSTGRES_URL",
    "SUPABASE_DATABASE_URL",
    "SUPABASE_POSTGRES_URL_NON_POOLING",
  ];

  let bestKey = supabaseCandidateKeys.find(
    (k) => env[k] && typeof env[k] === "string" && env[k]!.trim().length > 0
  );

  // 2. Check for any environment variable containing SUPABASE in the name
  if (!bestKey) {
    bestKey = envKeys.find(
      (k) =>
        k.toUpperCase().includes("SUPABASE") &&
        (k.includes("PRISMA_URL") || k.includes("DATABASE_URL") || k.includes("POSTGRES_URL")) &&
        env[k] &&
        typeof env[k] === "string" &&
        env[k]!.trim().length > 0
    );
  }

  // 3. Check for any variable whose value targets Supabase hosts
  if (!bestKey) {
    bestKey = envKeys.find(
      (k) =>
        env[k] &&
        typeof env[k] === "string" &&
        (env[k]!.includes("supabase.co") || env[k]!.includes("pooler.supabase.com"))
    );
  }

  // 4. Standard DATABASE_URL (ignore old vercel-storage if alternative exists)
  if (!bestKey && env.DATABASE_URL && !env.DATABASE_URL.includes("vercel-storage.com")) {
    bestKey = "DATABASE_URL";
  }

  // 5. Fallback to any remaining URL variables
  if (!bestKey) {
    const fallbacks = [
      "DATABASE_URL",
      "POSTGRES_PRISMA_URL",
      "POSTGRES_URL",
      "DIRECT_URL",
    ];
    bestKey = fallbacks.find((k) => env[k] && typeof env[k] === "string" && env[k]!.trim().length > 0);
  }

  let dbUrl = bestKey ? env[bestKey]?.trim() : undefined;
  if (!dbUrl) return undefined;

  // Enforce schema=store
  if (
    dbUrl.startsWith("postgres://") ||
    dbUrl.startsWith("postgresql://") ||
    dbUrl.startsWith("prisma://")
  ) {
    try {
      const urlObj = new URL(dbUrl);
      if (!urlObj.searchParams.has("schema")) {
        urlObj.searchParams.set("schema", "store");
        dbUrl = urlObj.toString();
      }
    } catch {
      if (!dbUrl.includes("schema=")) {
        dbUrl += (dbUrl.includes("?") ? "&" : "?") + "schema=store";
      }
    }
  }

  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes("schema=store")) {
    process.env.DATABASE_URL = dbUrl;
  }

  return dbUrl;
}

const storeDbUrl = getStoreDbUrl();

export const prisma =
  global.storePrisma ||
  new PrismaClient({
    ...(storeDbUrl ? { datasources: { db: { url: storeDbUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.storePrisma = prisma;
}

export default prisma;
