const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
const envPath = path.join(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

if (!fs.existsSync(schemaPath)) {
  console.log("[prepare-prisma] schema.prisma not found at", schemaPath);
  process.exit(0);
}

let schema = fs.readFileSync(schemaPath, "utf8");
const envKeys = Object.keys(process.env);

// 1. Discover primary database URL with SUPABASE prioritizing over old Vercel Postgres
let urlEnvVar = "";
let dbUrl = "";

const supabaseKeys = [
  "SUPABASE_POSTGRES_PRISMA_URL",
  "SUPABASE_POSTGRES_URL",
  "SUPABASE_DATABASE_URL",
  "SUPABASE_POSTGRES_URL_NON_POOLING",
];

for (const k of supabaseKeys) {
  if (process.env[k] && typeof process.env[k] === "string" && process.env[k].trim()) {
    urlEnvVar = k;
    dbUrl = process.env[k].trim();
    break;
  }
}

if (!dbUrl) {
  for (const k of envKeys) {
    if (
      k.toUpperCase().includes("SUPABASE") &&
      (k.includes("PRISMA_URL") || k.includes("DATABASE_URL") || k.includes("POSTGRES_URL")) &&
      process.env[k]
    ) {
      urlEnvVar = k;
      dbUrl = process.env[k].trim();
      break;
    }
  }
}

if (!dbUrl) {
  for (const k of envKeys) {
    const val = process.env[k];
    if (val && typeof val === "string" && (val.includes("supabase.co") || val.includes("pooler.supabase.com"))) {
      urlEnvVar = k;
      dbUrl = val.trim();
      break;
    }
  }
}

if (!dbUrl && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("vercel-storage.com")) {
  urlEnvVar = "DATABASE_URL";
  dbUrl = process.env.DATABASE_URL.trim();
}

if (!dbUrl) {
  const fallbacks = ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL", "DIRECT_URL"];
  for (const k of fallbacks) {
    if (process.env[k] && typeof process.env[k] === "string" && process.env[k].trim()) {
      urlEnvVar = k;
      dbUrl = process.env[k].trim();
      break;
    }
  }
}

if (!urlEnvVar) urlEnvVar = "DATABASE_URL";

// 2. Discover Direct (Non-Pooling) URL for migrations
let directEnvVar = "";
let directUrl = "";

const supabaseDirectKeys = [
  "SUPABASE_POSTGRES_URL_NON_POOLING",
  "SUPABASE_DIRECT_URL",
  "SUPABASE_POSTGRES_URL",
];

for (const k of supabaseDirectKeys) {
  if (process.env[k] && typeof process.env[k] === "string" && process.env[k].trim()) {
    directEnvVar = k;
    directUrl = process.env[k].trim();
    break;
  }
}

if (!directUrl) {
  for (const k of envKeys) {
    if (
      k.toUpperCase().includes("SUPABASE") &&
      (k.includes("NON_POOLING") || k.includes("DIRECT")) &&
      process.env[k]
    ) {
      directEnvVar = k;
      directUrl = process.env[k].trim();
      break;
    }
  }
}

if (!directUrl && process.env.DIRECT_URL && !process.env.DIRECT_URL.includes("vercel-storage.com")) {
  directEnvVar = "DIRECT_URL";
  directUrl = process.env.DIRECT_URL.trim();
}

if (!directUrl) {
  const fallbacks = ["DIRECT_URL", "POSTGRES_URL_NON_POOLING"];
  for (const k of fallbacks) {
    if (process.env[k] && typeof process.env[k] === "string" && process.env[k].trim()) {
      directEnvVar = k;
      directUrl = process.env[k].trim();
      break;
    }
  }
}

if (!directEnvVar) directEnvVar = "DIRECT_URL";

console.log(`[prepare-prisma] Store bound DB URL: ${urlEnvVar} (${dbUrl ? "found" : "empty"})`);
console.log(`[prepare-prisma] Store bound Direct URL: ${directEnvVar} (${directUrl ? "found" : "empty"})`);

// 3. Configure PostgreSQL in schema.prisma and enforce schema=store
if (
  dbUrl.startsWith("postgres://") ||
  dbUrl.startsWith("postgresql://") ||
  dbUrl.startsWith("prisma://") ||
  process.env.VERCEL
) {
  console.log(`[prepare-prisma] Detected PostgreSQL (Supabase/Postgres). Binding url = env("${urlEnvVar}")`);
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');

  if (dbUrl && !dbUrl.includes("schema=")) {
    dbUrl += (dbUrl.includes("?") ? "&" : "?") + "schema=store";
    process.env[urlEnvVar] = dbUrl;
    process.env.DATABASE_URL = dbUrl;
  }

  if (directUrl && !directUrl.includes("schema=")) {
    directUrl += (directUrl.includes("?") ? "&" : "?") + "schema=store";
    process.env[directEnvVar] = directUrl;
    process.env.DIRECT_URL = directUrl;
  }

  if (urlEnvVar !== "DATABASE_URL") {
    schema = schema.replace(/env\("DATABASE_URL"\)/g, `env("${urlEnvVar}")`);
  }

  if ((directUrl || process.env[directEnvVar]) && !schema.includes("directUrl")) {
    schema = schema.replace(
      new RegExp(`url\\s*=\\s*env\\("${urlEnvVar}"\\)`, "g"),
      `url       = env("${urlEnvVar}")\n  directUrl = env("${directEnvVar}")`
    );
  }

  // Update .env file if it exists so Next.js build workers inherit it
  try {
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    if (dbUrl && !envContent.includes(dbUrl)) {
      if (/^DATABASE_URL=.*/m.test(envContent)) {
        envContent = envContent.replace(/^DATABASE_URL=.*/m, `DATABASE_URL="${dbUrl}"`);
      } else {
        envContent += `\nDATABASE_URL="${dbUrl}"\n`;
      }
      if (directUrl) {
        if (/^DIRECT_URL=.*/m.test(envContent)) {
          envContent = envContent.replace(/^DIRECT_URL=.*/m, `DIRECT_URL="${directUrl}"`);
        } else {
          envContent += `\nDIRECT_URL="${directUrl}"\n`;
        }
      }
      fs.writeFileSync(envPath, envContent.trim() + "\n");
    }
  } catch (e) {
    console.warn("[prepare-prisma] Could not write to .env:", e.message);
  }
} else if (dbUrl.startsWith("file:") || (!dbUrl && !process.env.VERCEL)) {
  console.log('[prepare-prisma] Detected SQLite/local DATABASE_URL. Ensuring provider = "sqlite" in schema.prisma');
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  schema = schema.replace(/\s*directUrl\s*=\s*env\("[^"]+"\)/g, "");
}

fs.writeFileSync(schemaPath, schema);
console.log("[prepare-prisma] Store schema.prisma verified successfully.");

// 4. On Vercel build: Automatically sync schema to ensure tables exist in connected DB
if (process.env.VERCEL && dbUrl && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
  try {
    console.log("[prepare-prisma] Executing build-time schema sync (prisma db push)...");
    execSync("npx prisma db push --accept-data-loss --skip-generate", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: directUrl || dbUrl,
        DIRECT_URL: directUrl || dbUrl,
        [urlEnvVar]: dbUrl,
        [directEnvVar]: directUrl || dbUrl,
      },
    });
    console.log("[prepare-prisma] Schema push succeeded.");
  } catch (syncErr) {
    console.warn("[prepare-prisma] Non-fatal schema push notice:", syncErr.message);
  }
}
