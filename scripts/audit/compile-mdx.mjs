#!/usr/bin/env node
/** Compiles blog MDX with @mdx-js/mdx (same grammar as next-mdx-remote) and reports files that fail.
 *  Usage: node scripts/audit/compile-mdx.mjs [--changed]   (--changed: only files modified vs HEAD) */
import fs from "fs"; import path from "path"; import { execSync } from "child_process";
import { compile } from "@mdx-js/mdx";
const DIR = "content/blog";
let files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));
if (process.argv.includes("--changed")) {
  const ch = new Set(execSync("git diff --name-only HEAD; git ls-files -o --exclude-standard", { encoding: "utf8" }).split("\n"));
  files = files.filter((f) => ch.has(`${DIR}/${f}`));
}
let bad = 0;
for (const f of files) {
  const raw = fs.readFileSync(path.join(DIR, f), "utf8");
  const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, "");
  try { await compile(body); } catch (e) { bad++; console.log(`FAIL ${f}: ${String(e.message).split("\n")[0]} (line ${e.line ?? "?"})`); }
}
console.log(`${files.length} compiled, ${bad} failed`);
process.exit(bad ? 1 : 0);
