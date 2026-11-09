#!/usr/bin/env node
/**
 * Collect research packs for triaged articles (REWRITE-P1 first, by impressions).
 * Query = top GSC query of the page (else cleaned title). Apify rag-web-browser, 4 results.
 * Pack quality: pages with text, numeric facts ($/%/years), readiness flag (>=3 pages and >=12 numeric facts).
 * Stops when Apify monthly usage reaches --max-usd (default 4.6). Skips packs that already exist.
 * Run: NODE_USE_ENV_PROXY=1 node scripts/rewrite/collect-sources.mjs [--limit N] [--min-impr 10] [--max-usd 4.6]
 */
import fs from "fs"; import path from "path";
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "../..");
const a = process.argv.slice(2); const opt = (n, d) => (a.includes(n) ? a[a.indexOf(n) + 1] : d);
const LIMIT = +opt("--limit", 1000), MINI = +opt("--min-impr", 10), MAXUSD = +opt("--max-usd", 4.6);
const csvLine = (l) => { const o = []; let cur = "", q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === "," && !q) { o.push(cur); cur = ""; } else cur += ch; } o.push(cur); return o; };
const rows = fs.readFileSync(path.join(ROOT, "data/triage/triage.csv"), "utf8").trim().split("\n").slice(1).map((l) => { const c = csvLine(l); return { slug: c[0], action: c[1], impr: +c[9], title: c[15] }; });
const todo = rows.filter((r) => r.action === "REWRITE-P1" && r.impr >= MINI).sort((x, y) => y.impr - x.impr);
const gq = JSON.parse(fs.readFileSync(path.join(ROOT, "data/analytics/gsc-query-page-90d.json"), "utf8")).rows;
const top = new Map(); for (const [p, q, , i] of gq) { const s = p.replace(/^\/blog\//, "").replace(/\/$/, ""); if (!top.has(s) || top.get(s)[1] < i) top.set(s, [q, i]); }
const dir = path.join(ROOT, "data/research"); fs.mkdirSync(dir, { recursive: true });
const usage = async () => (await (await fetch("https://api.apify.com/v2/users/me/limits")).json()).data.current.monthlyUsageUsd;
const clean = (t) => t.replace(/\(.*?\)|:.*$|\b20\d\d\b/g, "").replace(/\s+/g, " ").trim();
let done = 0, ok = 0, skipped = 0; const q = todo.filter((r) => !fs.existsSync(path.join(dir, r.slug + ".json"))).slice(0, LIMIT);
console.log("to collect", q.length, "of", todo.length);
async function one(r) {
  const gsc = top.get(r.slug); const query = (gsc && gsc[0].split(" ").length >= 2 ? gsc[0] : clean(r.title)) || r.slug.replace(/-/g, " ");
  for (let t = 0; t < 2; t++) {
    try {
      const res = await fetch("https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items?timeout=100", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, maxResults: 4, outputFormats: ["markdown"] }), signal: AbortSignal.timeout(150000) });
      if (!res.ok) { if (res.status === 402) { await new Promise((r) => setTimeout(r, 15000)); } continue; }
      const items = await res.json();
      const results = items.map((x) => ({ url: x.metadata?.url || x.searchResult?.url || "", title: x.metadata?.title || "", fetchedAt: new Date().toISOString().slice(0, 10), markdown: String(x.markdown || "").slice(0, 7000) })).filter((x) => x.markdown.length > 400);
      const facts = results.reduce((n, x) => n + (x.markdown.match(/\$\s?\d[\d,.]*|\d+(?:\.\d+)?\s?%|\b20(?:2[3-6])\b/g) || []).length, 0);
      fs.writeFileSync(path.join(dir, r.slug + ".json"), JSON.stringify({ id: r.slug, query, pages: results.length, facts, ready: results.length >= 3 && facts >= 12, results }, null, 1));
      return results.length >= 3 && facts >= 12 ? "ready" : "thin";
    } catch (e) { /* retry */ }
  }
  return "fail";
}
const stats = { ready: 0, thin: 0, fail: 0 };
async function worker() {
  while (q.length) {
    if (done % 20 === 0 && (await usage()) >= MAXUSD) { console.log("usage cap reached, stopping"); q.length = 0; break; }
    const r = q.shift(); done++; const s = await one(r); if (s === "stop") { console.log("402 stop"); q.length = 0; break; } stats[s]++;
    if (done % 10 === 0) console.log(done, JSON.stringify(stats));
  }
}
await Promise.all([worker(), worker()]);
console.log("final", JSON.stringify(stats), "usage", await usage());
