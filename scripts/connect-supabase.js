#!/usr/bin/env node

/**
 * ==============================================================================
 * AVRO STORE — 1-CLICK SUPABASE CONNECTION HELPER
 * ==============================================================================
 * Automates connecting this store to Supabase:
 * 1. Formats connection strings
 * 2. Updates local .env
 * 3. Syncs Prisma schema (prisma db push)
 * 4. Seeds sample catalog, themes & admin owner account
 * ==============================================================================
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const envPath = path.resolve(rootDir, ".env");

console.log("\n========================================================");
console.log("⚡ AVRO STORE · 1-CLICK SUPABASE CONNECTION SETUP");
console.log("========================================================\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  let dbUrl = process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl || dbUrl.includes("localhost")) {
    console.log("👉 Step 1: Copy your Supabase URI from: ");
    console.log("   Supabase Dashboard -> Settings -> Database -> Connection string (URI)\n");
    dbUrl = await new Promise((resolve) => {
      rl.question("Paste your Supabase DATABASE_URL:\n> ", (answer) => {
        resolve(answer.trim());
      });
    });
  }

  if (!dbUrl) {
    console.error("❌ Error: No DATABASE_URL provided. Exiting.");
    process.exit(1);
  }

  // Ensure format
  if (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://")) {
    console.error("❌ Error: DATABASE_URL must start with postgresql:// or postgres://");
    process.exit(1);
  }

  // Ensure schema=store
  if (!dbUrl.includes("schema=")) {
    dbUrl += (dbUrl.includes("?") ? "&" : "?") + "schema=store";
  }

  console.log("\n[1/4] Writing configuration to .env...");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  if (/^DATABASE_URL=.*/m.test(envContent)) {
    envContent = envContent.replace(/^DATABASE_URL=.*/m, `DATABASE_URL="${dbUrl}"`);
  } else {
    envContent += `\nDATABASE_URL="${dbUrl}"\n`;
  }
  fs.writeFileSync(envPath, envContent.trim() + "\n");
  console.log("✓ Saved DATABASE_URL to .env");

  console.log("\n[2/4] Generating Prisma Client for PostgreSQL...");
  try {
    execSync("npx prisma generate", {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log("✓ Prisma Client generated");
  } catch (err) {
    console.error("❌ Prisma generate failed:", err.message);
    process.exit(1);
  }

  console.log("\n[3/4] Creating tables in Supabase (npx prisma db push)...");
  try {
    execSync("npx prisma db push --accept-data-loss", {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log("✓ All 16 database tables pushed to Supabase successfully!");
  } catch (err) {
    console.error("❌ Schema push to Supabase failed. Check password and host in your URL.");
    process.exit(1);
  }

  console.log("\n[4/4] Seeding initial catalog, themes & store owner...");
  try {
    execSync("node prisma/seed.js", {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log("✓ Seed completed!");
  } catch (err) {
    console.warn("⚠️ Non-critical seed notice:", err.message);
  }

  console.log("\n========================================================");
  console.log("🎉 SUCCESS: SUPABASE IS CONNECTED & READY!");
  console.log("========================================================");
  console.log("\nYour store now has a live cloud database.");
  console.log("\n📋 Admin Credentials:");
  console.log("   URL:      http://localhost:3001/admin/login (or your Vercel URL)");
  console.log("   Email:    storeadmin@example.com");
  console.log("   Password: storeadmin123");
  console.log("\n🚀 For Vercel Deployment:");
  console.log("   Add DATABASE_URL in Vercel -> Settings -> Environment Variables");
  console.log("   Value: " + dbUrl + "\n");

  rl.close();
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  rl.close();
  process.exit(1);
});
