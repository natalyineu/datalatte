#!/usr/bin/env node
/**
 * Finds indexable blog posts that compete for the same query (candidates for merge + 301).
 * Method adapted from the blog-cannibalization approach in AgriciDaniel/claude-blog (MIT):
 * keyword signals from title/H1 > description/H2s, clustered by phrase overlap.
 * Local only: no network, reads content/blog and (optionally) data/analytics/gsc-pages-90d.json.
 *
 * Usage: node scripts/audit/cannibalization.mjs [--min 0.6] [--limit 40] [--json out.json]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DIR = path.join(ROOT, "content/blog");
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };
const MIN = +opt("--min", 0.6), LIMIT = +opt("--limit", 40), OUT = opt("--json", null);

const STOP = new Set("a an the and or of for to in on at with your you is are how what why when which best top guide complete ultimate 2024 2025 2026 vs versus small business businesses local owners step by from do does can should it its this that vs".split(" "));
const stem = (w) => w.replace(/(ing|ies|es|s)$/, (m) => (m === "ies" ? "y" : "")).replace(/^(.{4,})e$/, "$1");
const toks = (s) => (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => !STOP.has(w) && w.length > 1).map(stem);

let clicks = new Map();
try {
  const j = JSON.parse(fs.readFileSync(path.join(ROOT, "data/analytics/gsc-pages-90d.json"), "utf8"));
  for (const [u, c, i] of j.pages) clicks.set(u.replace(/^\/blog\//, "").replace(/\/$/, ""), { c, i });
} catch { /* optional */ }

const posts = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".mdx"))) {
  const raw = fs.readFileSync(path.join(DIR, f), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m || /^noindex:\s*true/m.test(m[1])) continue;
  const g = (k) => (m[1].match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, "m")) || [])[1] || "";
  const h2 = [...m[2].matchAll(/^## (.+)$/gm)].map((x) => x[1]);
  const slug = f.slice(0, -4);
  posts.push({ slug, title: g("title"), lm: g("lastModified"), words: m[2].split(/\s+/).length,
    t: new Set([...toks(g("title")), ...toks(slug.replace(/-/g, " "))]), d: new Set(toks(g("description") + " " + h2.join(" "))),
    gsc: clicks.get(slug) || { c: 0, i: 0 } });
}

// Template series ("best-google-ad-keywords-for-<niche>-in-2026"): posts that differ by one token
// while 3+ siblings share the rest are different topics, not duplicates.
const series = new Map();
posts.forEach((p, i) => {
  const arr = [...p.t].sort();
  arr.forEach((w) => { const key = arr.filter((x) => x !== w).join("+"); if (!series.has(key)) series.set(key, new Set()); series.get(key).add(i); });
});
const inSeries = new Set();
for (const set of series.values()) if (set.size >= 3) { const a = [...set]; a.forEach((x) => a.forEach((y) => x !== y && inSeries.add(`${Math.min(x, y)}|${Math.max(x, y)}`))); }

// Same first 5 slug words + 3 or more siblings = niche/city series ("google-ads-for-hair-salons-in-<city>").
const byPrefix = new Map();
posts.forEach((p, i) => { const k = p.slug.split("-").slice(0, 5).join("-"); if (!byPrefix.has(k)) byPrefix.set(k, []); byPrefix.get(k).push(i); });
for (const a of byPrefix.values()) if (a.length >= 3) a.forEach((x) => a.forEach((y) => x !== y && inSeries.add(`${Math.min(x, y)}|${Math.max(x, y)}`)));

const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
// inverted index on title tokens to avoid O(n^2) over 1k+ posts
const idx = new Map();
posts.forEach((p, i) => p.t.forEach((w) => { if (!idx.has(w)) idx.set(w, []); idx.get(w).push(i); }));
const pairs = new Map();
posts.forEach((p, i) => {
  const cand = new Map();
  p.t.forEach((w) => (idx.get(w) || []).forEach((j) => { if (j > i) cand.set(j, (cand.get(j) || 0) + 1); }));
  for (const [j, n] of cand) {
    if (n < 2 || inSeries.has(`${i}|${j}`)) continue;
    const q = posts[j], s = jac(p.t, q.t) * 0.8 + jac(p.d, q.d) * 0.2;
    if (s >= MIN) pairs.set(`${i}|${j}`, s);
  }
});

const strength = (p) => p.gsc.c * 1000 + p.gsc.i + p.words / 100 + (p.lm || "").replace(/-/g, "") / 1e8;
const rows = [...pairs].map(([k, s]) => {
  const [i, j] = k.split("|").map(Number); const a = posts[i], b = posts[j];
  const [keep, drop] = strength(a) >= strength(b) ? [a, b] : [b, a];
  return { score: +s.toFixed(2), keep: keep.slug, drop: drop.slug, keepClicks: keep.gsc.c, dropClicks: drop.gsc.c, severity: s >= 0.8 ? "critical" : s >= 0.7 ? "high" : "medium" };
}).sort((a, b) => b.score - a.score);

console.log(`Indexable posts: ${posts.length}; candidate pairs (score >= ${MIN}): ${rows.length}; GSC data: ${clicks.size ? "yes" : "no"}`);
for (const r of rows.slice(0, LIMIT)) console.log(`${r.severity.padEnd(8)} ${r.score}  keep ${r.keep}\n                 drop ${r.drop}  (clicks ${r.keepClicks}/${r.dropClicks})`);
if (OUT) fs.writeFileSync(OUT, JSON.stringify(rows, null, 1));
