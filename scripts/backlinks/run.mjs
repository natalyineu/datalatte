#!/usr/bin/env node
// Semi-automatic directory submission helper.
//   node scripts/backlinks/run.mjs list
//   node scripts/backlinks/run.mjs submit <id|next>   # visible browser, autofill; YOU solve captcha + submit
//   node scripts/backlinks/run.mjs mark <id> <todo|submitted|live|rejected|skip> [listing_url]
//   node scripts/backlinks/run.mjs check              # verifies listing pages link to datalatte.pro
// Optional: CHROMIUM_PATH=/path/to/chrome
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "../..");
const profile = JSON.parse(fs.readFileSync(path.join(dir, "profile.json"), "utf8"));
const dirs = JSON.parse(fs.readFileSync(path.join(dir, "directories.json"), "utf8"));
const statusFile = path.join(root, "data/backlinks-status.json");
const STATUSES = ["todo", "submitted", "live", "rejected", "skip"];

const load = () => (fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile, "utf8")) : {});
const save = (s) => fs.writeFileSync(statusFile, JSON.stringify(s, null, 2) + "\n");
const st = (s, id) => s[id]?.status ?? "todo";

function setStatus(id, status, listing) {
  if (!dirs.find((d) => d.id === id)) throw new Error(`unknown id: ${id}`);
  if (!STATUSES.includes(status)) throw new Error(`status must be one of ${STATUSES.join("|")}`);
  const s = load();
  s[id] = { ...s[id], status, updated: new Date().toISOString().slice(0, 10), ...(listing ? { listing_url: listing } : {}) };
  save(s);
}

// field hint regex -> profile key (first match wins)
const FIELD_MAP = [
  [/e-?mail/i, "email"],
  [/phone|tel/i, "phone"],
  [/(web)?site|url|link|domain/i, "url"],
  [/tagline|slogan|headline/i, "tagline"],
  [/short.*desc|summary|one.?line/i, "short_description"],
  [/desc|about|bio|overview|details/i, "description"],
  [/categor|industry/i, "category"],
  [/keyword|tags?/i, "keywords"],
  [/twitter|x\.com/i, "twitter"],
  [/linkedin/i, "linkedin"],
  [/founder|owner|contact.*name|your.*name|first.*name/i, "founder"],
  [/city/i, "city"],
  [/country/i, "country"],
  [/year|founded/i, "year_founded"],
  [/name|title/i, "name"],
];

async function autofill(page) {
  let filled = 0;
  for (const frame of page.frames()) {
    const fields = await frame.$$("input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=submit]):not([type=password]), textarea");
    for (const el of fields) {
      const hint = await el.evaluate((n) =>
        [n.name, n.id, n.placeholder, n.getAttribute("aria-label"), n.labels?.[0]?.innerText, n.type].filter(Boolean).join(" "));
      const hit = FIELD_MAP.find(([re]) => re.test(hint));
      const val = hit && profile[hit[1]];
      if (!val) continue;
      if ((await el.inputValue().catch(() => "")) !== "") continue;
      await el.fill(String(val)).then(() => filled++).catch(() => {});
    }
  }
  return filled;
}

async function submit(idArg) {
  const s = load();
  const d = idArg === "next" ? dirs.find((x) => st(s, x.id) === "todo") : dirs.find((x) => x.id === idArg);
  if (!d) return console.log("nothing to submit");
  const { chromium } = await import("playwright-core");
  const browser = await chromium.launch({ headless: false, executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await (await browser.newContext()).newPage();
  console.log(`\n→ ${d.name}  ${d.url}`);
  await page.goto(d.url, { waitUntil: "domcontentloaded" }).catch((e) => console.log("  open failed:", e.message));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("  Open the form in the browser. Enter = autofill current page, 'done' = finished, 'skip' = skip.");
  for (;;) {
    const a = (await rl.question("  > ")).trim().toLowerCase();
    if (a === "") console.log(`  filled ${await autofill(page)} field(s)`);
    else if (a === "done") {
      const listing = (await rl.question("  listing URL (optional): ")).trim();
      setStatus(d.id, "submitted", listing || undefined);
      break;
    } else if (a === "skip") { setStatus(d.id, "skip"); break; }
  }
  rl.close();
  await browser.close();
}

async function check() {
  const s = load();
  for (const d of dirs) {
    const e = s[d.id];
    if (!e?.listing_url || e.status === "skip") continue;
    try {
      const html = await (await fetch(e.listing_url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (link-check)" } })).text();
      const m = html.match(/<a\b[^>]*href=["']https?:\/\/(?:www\.)?datalatte\.pro[^"']*["'][^>]*>/i);
      if (m) {
        const nofollow = /rel=["'][^"']*(nofollow|ugc|sponsored)/i.test(m[0]);
        setStatus(d.id, "live");
        console.log(`✓ ${d.name}  link found (${nofollow ? "nofollow" : "dofollow"})`);
      } else console.log(`· ${d.name}  no link yet (${e.status})`);
    } catch (err) { console.log(`! ${d.name}  ${err.message}`); }
  }
}

const [cmd, a, b, c] = process.argv.slice(2);
if (cmd === "list") {
  const s = load();
  for (const d of dirs) console.log(`${st(s, d.id).padEnd(10)} ${d.id.padEnd(20)} ${d.type.padEnd(9)} ${s[d.id]?.listing_url ?? ""}`);
} else if (cmd === "submit") await submit(a ?? "next");
else if (cmd === "mark") setStatus(a, b, c);
else if (cmd === "check") await check();
else console.log("usage: run.mjs list | submit <id|next> | mark <id> <status> [url] | check");
