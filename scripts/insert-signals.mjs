#!/usr/bin/env node
/**
 * Insert collected signals into Supabase.
 * Run after collect-signals.mjs:
 *   node scripts/collect-signals.mjs && node scripts/insert-signals.mjs
 *
 * Requires env vars:
 *   SUPABASE_URL              (e.g. https://xxx.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY (service role — bypasses RLS)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local for local runs
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx < 0) continue;
    const key = t.slice(0, idx);
    const val = t.slice(idx + 1).replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const inputPath = path.join(__dirname, "signals-output.json");
if (!fs.existsSync(inputPath)) {
  console.error("❌ signals-output.json not found — run collect-signals.mjs first");
  process.exit(1);
}

const signals = JSON.parse(fs.readFileSync(inputPath, "utf8"));
console.log(`\n📥 Inserting ${signals.length} signals into Supabase...\n`);

if (signals.length === 0) {
  console.log("Nothing to insert.");
  process.exit(0);
}

// Upsert on slug (unique constraint) — safe to re-run
const { data, error } = await supabase
  .from("radar_signals")
  .upsert(signals, { onConflict: "slug", ignoreDuplicates: true });

if (error) {
  console.error("❌ Supabase error:", error.message);
  process.exit(1);
}

console.log(`✅ Upserted ${signals.length} signals (duplicates skipped)`);

// Clean up temp file
fs.unlinkSync(inputPath);
console.log("🗑  Cleaned up signals-output.json\n");
