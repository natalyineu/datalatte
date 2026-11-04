#!/usr/bin/env node
/**
 * Web research pack via Apify "rag-web-browser" (Google search + page content as markdown).
 * Reads data/research-queue.json: [{ id, query, maxResults? }], writes data/research/<id>.json.
 * Skips ids that already have an output file. Env: APIFY_TOKEN. Options: --limit N
 * Public pages only; pages that block the crawler simply come back empty (we never bypass blocks).
 */
import fs from "fs";
import path from "path";

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) { console.error("APIFY_TOKEN is not set"); process.exit(1); }
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, "data/research-queue.json"), "utf8"));
const outDir = path.join(ROOT, "data/research");
fs.mkdirSync(outDir, { recursive: true });
const li = process.argv.indexOf("--limit");
const limit = li > -1 ? +process.argv[li + 1] : 20;
const MAX_CHARS = 7000;

let done = 0;
for (const item of queue) {
  const file = path.join(outDir, `${item.id}.json`);
  if (fs.existsSync(file)) continue;
  if (done >= limit) break;
  const url = `https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items?token=${TOKEN}&timeout=120`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: item.query, maxResults: item.maxResults || 4, outputFormats: ["markdown"] }),
    });
    if (!res.ok) { console.error(`✗ ${item.id}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`); continue; }
    const rows = await res.json();
    const results = rows.map((r) => ({
      url: r.metadata?.url || r.searchResult?.url || "",
      title: r.metadata?.title || r.searchResult?.title || "",
      description: r.searchResult?.description || "",
      fetchedAt: new Date().toISOString().slice(0, 10),
      markdown: String(r.markdown || "").slice(0, MAX_CHARS),
    })).filter((r) => r.url);
    fs.writeFileSync(file, JSON.stringify({ id: item.id, query: item.query, results }, null, 1));
    console.log(`✓ ${item.id}: ${results.length} pages, ${results.reduce((a, r) => a + r.markdown.length, 0)} chars`);
    done++;
  } catch (e) { console.error(`✗ ${item.id}: ${e.message}`); }
}
console.log(`done: ${done} new`);
