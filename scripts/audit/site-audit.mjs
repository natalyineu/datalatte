#!/usr/bin/env node
/**
 * Rendered-site audit (run against a running server: BASE_URL=http://localhost:3111 node scripts/audit/site-audit.mjs)
 * Catches the bug classes we hit repeatedly: unreadable text (contrast < 3:1) in light AND dark mode,
 * broken internal links, missing/duplicate <h1>, missing title/description/canonical, non-200 pages.
 * Exit code 1 when problems are found. Known/accepted items go to scripts/audit/allowlist.json (substring match on "page|text").
 */
import fs from "fs";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:3111";
const EXE = process.env.CHROMIUM_PATH || undefined;
const MIN = +(process.env.MIN_CONTRAST || 3);
const allow = (() => { try { return JSON.parse(fs.readFileSync(new URL("./allowlist.json", import.meta.url), "utf8")); } catch { return []; } })();

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const pick = (re, n) => all.filter((p) => re.test(p)).sort(() => 0.5 - Math.random()).slice(0, n);
const pages = [...new Set(["/", ...all.filter((p) => !p.startsWith("/blog/") && !p.startsWith("/radar/") && !/^\/(for|checklists)\/[^/]+\/[^/]+/.test(p)), ...pick(/^\/blog\//, 12), ...pick(/^\/for\/[^/]+\/[^/]+/, 4), ...pick(/^\/checklists\/[^/]+/, 4)])].slice(0, +(process.env.MAX_PAGES || 70));

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const problems = [];
const add = (p, kind, detail) => { const line = `${p} | ${kind} | ${detail}`; if (!allow.some((a) => line.includes(a))) problems.push(line); };
const linkSet = new Set();

for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
  const queue = [...pages];
  const worker = async () => { for (let path; (path = queue.shift()); ) {
    const page = await ctx.newPage();
    try {
      const res = await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
      if (!res || res.status() !== 200) { add(path, scheme, `HTTP ${res && res.status()}`); await page.close(); continue; }
      await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}.mdx-fade-up{opacity:1!important;transform:none!important}" });
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 15)); } window.scrollTo(0, 0); });
      const r = await page.evaluate((MIN) => {
        const out = { bad: [], h1: document.querySelectorAll("h1").length, title: document.title, desc: !!document.querySelector('meta[name="description"]'), canon: !!document.querySelector('link[rel="canonical"]'), links: [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href").split("#")[0].split("?")[0]) };
        const num = (c) => (c.match(/[\d.]+/g) || [0, 0, 0, 1]).map(Number);
        const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const dark = matchMedia("(prefers-color-scheme: dark)").matches;
        const stops = (img) => (img.match(/rgba?\([^)]+\)/g) || []).map((x) => num(x).slice(0, 3)); const bgOf = (el, all) => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e); if (c.backgroundImage && c.backgroundImage !== "none") { if (/gradient/.test(c.backgroundImage) && stops(c.backgroundImage).length && !/url\(/.test(c.backgroundImage)) { return { gradient: stops(c.backgroundImage) }; } return null; } const [r, g, b, a = 1] = num(c.backgroundColor); if (a > 0) { stack.push([r, g, b, a]); if (a >= 1) break; } } let [r, g, b] = dark ? [10, 10, 10] : [255, 255, 255]; if (stack.length && stack[stack.length - 1][3] >= 1) { [r, g, b] = stack.pop(); } for (let i = stack.length - 1; i >= 0; i--) { const [R, G, B, A] = stack[i]; r = R * A + r * (1 - A); g = G * A + g * (1 - A); b = B * A + b * (1 - A); } return [r, g, b]; };
        const seen = new Set(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const t = w.currentNode, txt = t.textContent.trim(); if (txt.length < 3) continue;
          const el = t.parentElement; if (!el || el.closest("script,style,noscript,svg,[aria-hidden='true']")) continue;
          const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
          if (cs.webkitTextFillColor === "rgba(0, 0, 0, 0)" || /text/.test(cs.webkitBackgroundClip || cs.backgroundClip || "")) continue; // gradient text
          const rc = el.getBoundingClientRect(); if (rc.width < 2 || rc.height < 2) continue;
          let o = 1; for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); if (o < 0.5) continue;
          const bgr = bgOf(el); if (!bgr) continue;
          const bgs = bgr.gradient || [bgr]; let cr = 99;
          for (const bg of bgs) { const [fr, fg, fb, fa = 1] = num(cs.color); const f = [fr * fa + bg[0] * (1 - fa), fg * fa + bg[1] * (1 - fa), fb * fa + bg[2] * (1 - fa)]; const L1 = lum(f), L2 = lum(bg); cr = Math.min(cr, (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)); }
          if (cr < MIN) { const k = txt.slice(0, 40); if (!seen.has(k)) { seen.add(k); out.bad.push(`${cr.toFixed(2)} "${k}" <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 70)}">`); } }
        }
        return out;
      }, MIN);
      r.bad.slice(0, 6).forEach((b) => add(path, `contrast-${scheme}`, b));
      if (scheme === "light") {
        if (r.h1 !== 1) add(path, "seo", `${r.h1} <h1>`);
        if (!r.title || r.title.length < 10) add(path, "seo", "weak <title>");
        if (!r.desc) add(path, "seo", "no meta description");
        if (!r.canon) add(path, "seo", "no canonical");
        r.links.forEach((l) => linkSet.add(l));
      }
    } catch (e) { add(path, scheme, `error ${String(e).slice(0, 80)}`); }
    await page.close();
  } };
  await Promise.all([worker(), worker(), worker(), worker()]);
  await ctx.close();
}
await browser.close();

// broken internal links (HEAD/GET against the running server)
let checked = 0;
for (const l of [...linkSet].slice(0, 400)) {
  if (!l || l === "/" || /\.(png|jpg|svg|ico|webp|xml|txt|json)$/.test(l)) continue;
  checked++;
  try { const r = await fetch(BASE + l, { redirect: "follow" }); if (r.status >= 400) add(l, "broken-link", `HTTP ${r.status}`); } catch (e) { add(l, "broken-link", "fetch failed"); }
}

console.log(`Audited ${pages.length} pages x light/dark, ${checked} internal links`);
if (problems.length) { console.log(`\n${problems.length} problem(s):`); problems.forEach((p) => console.log(" - " + p)); process.exit(1); }
console.log("No problems found.");
