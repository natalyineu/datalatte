#!/usr/bin/env node
// Weekly price watch. For each vendor page we cite, check that the figures we published are still on it.
// A figure that disappears means the price probably changed and the article / /rates row needs a look.
// One polite request per page, default browser identity. A page that refuses automated access (403/429, empty body)
// is reported as "unreadable" and left alone: we never try to get around a block.
//   node scripts/price-watch.mjs [--limit N]
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("playwright-core")); }

const CONFIG = new URL("./data/price-watch.json", import.meta.url);
const STATE = new URL("../data/price-watch-state.json", import.meta.url);
const REPORT = new URL("../price-watch-report.md", import.meta.url);

const limitIdx = process.argv.indexOf("--limit");
const limit = limitIdx > 0 ? Number(process.argv[limitIdx + 1]) : Infinity;
const entries = JSON.parse(readFileSync(CONFIG, "utf8")).entries.slice(0, limit);
const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")).results ?? {} : {};

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// "$3" must not match inside "$30" or "$3.50"
const has = (text, fig) => new RegExp(esc(fig) + "(?![0-9]|[.,][0-9])").test(text);
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
const results = {};

for (const e of entries) {
  const out = { url: e.url, article: e.article, expect: e.expect, checkedAt: new Date().toISOString() };
  try {
    const page = await (await browser.newContext()).newPage();
    const res = await page.goto(e.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3000);
    const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").replace(/\$ (?=\d)/g, "$");
    const code = res ? res.status() : 0;
    if (code >= 400 || text.length < 300) {
      out.status = "unreadable"; out.detail = `HTTP ${code}, ${text.length} chars`;
    } else {
      const missing = e.expect.filter(f => !has(text, f));
      out.status = missing.length ? "missing" : "ok";
      out.missing = missing;
    }
    await page.context().close();
  } catch (err) {
    out.status = "unreadable"; out.detail = String(err.message).split("\n")[0];
  }
  results[e.id] = out;
  console.log(`${out.status.padEnd(10)} ${e.id}${out.missing?.length ? "  missing: " + out.missing.join(", ") : ""}${out.detail ? "  (" + out.detail + ")" : ""}`);
  await new Promise(r => setTimeout(r, 2000));
}
await browser.close();

// A figure is a NEW alert when it was present (or the page was unreadable) last time; persistent ones are only listed.
const changed = Object.entries(results).filter(([id, r]) => r.status === "missing" && !(prev[id]?.status === "missing" && JSON.stringify(prev[id].missing) === JSON.stringify(r.missing)));
const missing = Object.entries(results).filter(([, r]) => r.status === "missing");
const unreadable = Object.entries(results).filter(([, r]) => r.status === "unreadable");

const lines = [`# Price watch ${new Date().toISOString().slice(0, 10)}`, ""];
if (missing.length) {
  lines.push("## Figures no longer on the vendor page (price probably changed)", "");
  for (const [id, r] of missing) lines.push(`- **${id}**: missing ${r.missing.join(", ")} on ${r.url} (article: /blog/${r.article})${changed.some(([i]) => i === id) ? " - NEW" : ""}`);
  lines.push("");
}
if (unreadable.length) {
  lines.push("## Not checked (page refused or empty)", "");
  for (const [id, r] of unreadable) lines.push(`- ${id}: ${r.detail} - ${r.url}`);
  lines.push("");
}
lines.push(`Checked ${entries.length} pages: ${Object.values(results).filter(r => r.status === "ok").length} ok, ${missing.length} changed, ${unreadable.length} not checked.`);
writeFileSync(REPORT, lines.join("\n") + "\n");
writeFileSync(STATE, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + "\n");
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `new_alerts=${changed.length}\nmissing=${missing.length}\n`);
console.log(`\n${changed.length} new alert(s), ${missing.length} total missing, ${unreadable.length} unreadable`);
