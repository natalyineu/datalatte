#!/usr/bin/env node
/**
 * Verifies that every paid placement in data/protected-placements.json is still in its article,
 * byte-for-byte. Exit 1 if any block is altered or missing. Usage: node scripts/check-protected-placements.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const list = JSON.parse(fs.readFileSync(path.join(root, "data", "protected-placements.json"), "utf8"));
let bad = 0;
for (const p of list) {
  const file = path.join(root, "content", "blog", p.slug + ".mdx");
  const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const ok = raw.includes(p.text);
  if (!ok) bad++;
  console.log(`${ok ? "OK  " : "FAIL"} ${p.partner} in ${p.slug}`);
}
process.exit(bad ? 1 : 0);
