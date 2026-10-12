#!/usr/bin/env node
/**
 * Checks blog articles against the DataLatte article brief.
 * Usage:
 *   node scripts/audit/check-article.mjs <slug> [slug...]
 *   node scripts/audit/check-article.mjs --since 2026-10-11     # every indexable post with lastModified >= date
 * Options: --date YYYY-MM-DD (expected lastModified, default today UTC)
 * Exit code 1 when any ERROR is found (warnings do not fail).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../content/blog");
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i === -1 ? null : args[i + 1]; };
const today = opt("--date") || new Date().toISOString().slice(0, 10);
const since = opt("--since");

function split(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const k = line.match(/^(\w+):\s*(.*)$/);
    if (k) fm[k[1]] = k[2].replace(/^["']|["']$/g, "");
  }
  return { fm, body: m[2] };
}
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const exists = (slug) => fs.existsSync(path.join(DIR, slug + ".mdx"));
const noindex = (slug) => /^noindex:\s*true/m.test(fs.readFileSync(path.join(DIR, slug + ".mdx"), "utf8").split("\n---")[0]);

function check(slug) {
  const file = path.join(DIR, slug + ".mdx");
  if (!fs.existsSync(file)) return { slug, errors: ["file not found"], warns: [] };
  const { fm, body } = split(fs.readFileSync(file, "utf8"));
  const E = [], W = [];
  const lines = body.split("\n");

  if ((fm.title || "").length > 55) E.push(`title ${fm.title.length} chars (max 55)`);
  const dl = (fm.description || "").length;
  if (dl < 120 || dl > 155) E.push(`description ${dl} chars (need 120-155)`);
  if (!/\d/.test(fm.description || "")) W.push("description has no number");
  if (fm.lastModified !== today) W.push(`lastModified ${fm.lastModified} (expected ${today})`);
  if (fm.noindex === "true") W.push("noindex: true");

  // headings (ignore fenced code)
  let fence = false; const h1 = [], h2 = [];
  for (const l of lines) {
    if (l.startsWith("```")) fence = !fence;
    if (fence) continue;
    if (/^# /.test(l)) h1.push(l);
    if (/^## /.test(l)) h2.push(l.slice(3));
  }
  if (h1.length) E.push(`${h1.length} H1 in body (the page title is the H1; use H2)`);
  const faq = h2.filter((h) => /^FAQ\b|Frequently Asked/i.test(h));
  if (faq.length !== 1) E.push(`${faq.length} FAQ sections (need exactly 1)`);
  if (!h2.some((h) => /^Sources?\b/i.test(h))) E.push("no Sources section");
  const qh = h2.filter((h) => h.trim().endsWith("?")).length;
  if (h2.length && qh / h2.length < 0.5) W.push(`only ${qh}/${h2.length} H2s are questions`);

  // StatRow
  const sr = [...body.matchAll(/<StatRow\b([\s\S]*?)\/>/g)];
  if (!sr.length) E.push("no StatRow");
  for (const m of sr) {
    const miss = ["values", "labels", "subs", "trends"].filter((p) => !new RegExp(`\\b${p}="`).test(m[1]));
    if (miss.length) E.push(`StatRow missing ${miss.join(",")}`);
    else {
      const n = (p) => m[1].match(new RegExp(`\\b${p}="([^"]*)"`))[1].split("|").length;
      if (new Set(["values", "labels", "subs", "trends"].map(n)).size > 1) E.push("StatRow props have different item counts");
    }
  }

  // worked example flagged as assumption
  if (!/assumption/i.test(body)) E.push('no worked example marked "assumption"');

  // internal links
  const links = [...new Set([...body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)].map((m) => m[1]))].filter((s) => s !== slug);
  if (links.length < 3 || links.length > 6) W.push(`${links.length} internal /blog links (target 3-6)`);
  for (const s of links) {
    if (!exists(s)) E.push(`broken internal link /blog/${s}`);
    else if (noindex(s)) E.push(`link to noindex post /blog/${s}`);
  }

  // paragraph length + first person + MDX hazards
  fence = false; let long = 0, para = [];
  const flush = () => { if (para.length && words(para.join(" ")) > 70) long++; para = []; };
  for (const l of lines) {
    if (l.startsWith("```")) { fence = !fence; flush(); continue; }
    if (fence) continue;
    if (!l.trim() || /^(#|\||<|-|\d+\.|>|!\[)/.test(l.trim())) { flush(); continue; }
    para.push(l);
  }
  flush();
  if (long) W.push(`${long} paragraphs over 70 words`);
  const prose = lines.filter((l) => !/^\s*(<|\||#|-|\d+\.)/.test(l)).join("\n");
  const fp = prose.match(/\b(we tested|we ran|our client|my client|our clients|I tested|I ran|I've|I'm|I'd|Picture it|in my experience|we found|I made|I wrote|I used|I chose|I recommend|I think|I believe|I picked)\b/gi);
  if (fp) E.push(`first person / invented-case phrasing: ${[...new Set(fp.map((x) => x.toLowerCase()))].join(", ")}`);
  const hazard = lines.filter((l) => !fence && !/^\s*(<|[a-z]+=|\/>)/.test(l) && !/^\s*[a-z]+="/.test(l) && (/[{}]/.test(l) || /<(?![A-Za-z/!])/.test(l)));
  if (hazard.length) E.push(`bare { } or < in MDX on ${hazard.length} line(s): "${hazard[0].trim().slice(0, 50)}"`);
  return { slug, errors: E, warns: W };
}

let slugs = args.filter((a) => !a.startsWith("--") && a !== today && a !== since);
if (since) {
  slugs = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4)).filter((s) => {
    const { fm } = split(fs.readFileSync(path.join(DIR, s + ".mdx"), "utf8"));
    return fm.noindex !== "true" && (fm.lastModified || "") >= since;
  });
}
if (!slugs.length) { console.error("No articles given. Usage: check-article.mjs <slug...> | --since DATE"); process.exit(2); }

let bad = 0;
for (const s of slugs) {
  const r = check(s);
  if (r.errors.length) bad++;
  console.log(`${r.errors.length ? "✗" : "✓"} ${s}`);
  r.errors.forEach((e) => console.log(`    ERROR ${e}`));
  r.warns.forEach((w) => console.log(`    warn  ${w}`));
}
console.log(`\n${slugs.length - bad}/${slugs.length} pass`);
process.exit(bad ? 1 : 0);
