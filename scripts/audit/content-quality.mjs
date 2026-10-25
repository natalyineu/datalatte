#!/usr/bin/env node
/** Stage 6 gate for changed/new blog posts. Usage: node scripts/audit/content-quality.mjs [--base <git-ref>] [--all]
 * ERRORS (exit 1): MDX does not compile; indexable post with title >55 or description outside 120-155;
 *   first-person anecdote / invented-case patterns; link to a noindex or missing post from an indexable post.
 * WARNINGS: paragraph >90 words; no external source link and no "## Sources"; fewer than 2 inbound posts is not checked here. */
import fs from "fs"; import path from "path"; import { execSync } from "child_process";
import { compile } from "@mdx-js/mdx";
const DIR = "content/blog"; const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "HEAD~1";
let files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));
if (!args.includes("--all")) {
  let ch = "";
  try { ch = execSync(`git diff --name-only ${base} HEAD -- ${DIR}`, { encoding: "utf8" }); } catch { ch = execSync("git ls-files -m -o --exclude-standard " + DIR, { encoding: "utf8" }); }
  const set = new Set(ch.split("\n").map((x) => path.basename(x)));
  files = files.filter((f) => set.has(f));
}
const read = (f) => { const raw = fs.readFileSync(path.join(DIR, f), "utf8"); const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); const fm = {}; if (m) for (const l of m[1].split("\n")) { const k = l.match(/^(\w+):\s*(.*)$/); if (k) fm[k[1]] = k[2].replace(/^["']|["']$/g, ""); } return { fm, body: m ? m[2] : raw }; };
const idx = new Map(); for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".mdx"))) idx.set(f.slice(0, -4), read(f).fm.noindex !== "true");
const FIRST = /\b(I've (seen|helped|worked|run|managed|built|tested|found)|I have (seen|helped|worked)|in my experience|my clients?(?! list)(?<!text my clients)|a client of mine|I worked with|I once|we've helped|we helped|our clients?|DataLatte clients?|we tested|we found that)\b/i;
const CASE = /\b(a|one|an)\s+([A-Z][a-z]+\s+){1,2}(salon|studio|café|cafe|coffee shop|groomer|gym|restaurant|barbershop|bakery|clinic|spa)\b[^.\n]{0,120}\b(saw|increased|grew|boosted|doubled|tripled|went from|gained|cut|reduced|generated)\b/i;
const LENIENT = args.includes("--lenient-seo"); // title/description length become warnings (legacy debt)
let errs = 0, warns = 0;
for (const f of files) {
  const slug = f.slice(0, -4); const { fm, body } = read(f); const E = [], W = [];
  try { await compile(body); } catch (e) { E.push(`MDX compile: ${String(e.message).split("\n")[0]}`); }
  if (fm.noindex !== "true") {
    if ((fm.title || "").length > 55) (LENIENT ? W : E).push(`title ${fm.title.length} chars (max 55)`);
    const dl = (fm.description || "").length; if (dl < 120 || dl > 155) (LENIENT ? W : E).push(`description ${dl} chars (need 120-155)`);
    const prose = body.replace(/^#{2,4} .*$/gm, "").replace(/\b(text|email|message|contact|tell|ask|call) my clients?\b/gi, "");
    if (FIRST.test(prose)) E.push("first-person anecdote pattern");
    if (CASE.test(body)) E.push("invented-case pattern");
    for (const m of new Set([...body.matchAll(/\]\(\/blog\/([A-Za-z0-9-]+)/g)].map((x) => x[1]))) if (idx.get(m) !== true && !["category", "ctv-advertising", "dooh-advertising", "local-marketing-guides"].includes(m)) E.push(`links to noindex/missing post: ${m}`);
    const ext = (body.match(/\]\(https?:\/\//g) || []).length;
    if (!ext && !/## Sources/.test(body)) W.push("no external sources");
    const long = body.split(/\n{2,}/).filter((p) => !/^(#|\||<|-|\*|>|```|\d+\.)/.test(p.trim()) && p.trim().split(/\s+/).length > 90).length;
    if (long) W.push(`${long} paragraph(s) over 90 words`);
  }
  errs += E.length; warns += W.length;
  if (E.length || W.length) console.log(`${E.length ? "✗" : "!"} ${slug}\n${E.map((x) => "   ERROR " + x).join("\n")}${E.length && W.length ? "\n" : ""}${W.map((x) => "   warn  " + x).join("\n")}`);
}
console.log(`\n${files.length} posts checked: ${errs} errors, ${warns} warnings`);
process.exit(errs ? 1 : 0);
