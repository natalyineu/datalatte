#!/usr/bin/env node
// Fetch a JS-rendered page and print its visible text.
// Only for pages whose text is rendered by JavaScript (Meta/Instagram help, pricing tables).
// It does not spoof a browser identity and must not be used to get around 403/429 blocks:
// if a site refuses automated access, treat that page as unavailable.
// Usage: node scripts/audit/fetch-rendered.mjs <url> [--max 20000] [--wait 2500]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:\/\//.test(a));
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
if (!url) {
  console.error("usage: fetch-rendered.mjs <url> [--max N] [--wait ms]");
  process.exit(2);
}

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
try {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(opt("wait", 2500));
  const text = await page.evaluate(() => document.body.innerText);
  console.log(`# ${res ? res.status() : "?"} ${page.url()}`);
  console.log(`# title: ${await page.title()}`);
  console.log(text.replace(/\n{3,}/g, "\n\n").slice(0, opt("max", 20000)));
} catch (e) {
  console.error("fetch failed:", e.message.split("\n")[0]);
  process.exitCode = 1;
} finally {
  await browser.close();
}
