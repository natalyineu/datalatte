// Minimal card thumbnails for blog lists: one big stat + glyph, no title (the card already shows it). Usage: node make-cards.mjs [--out dir] [--slugs a,b]
import { decor } from "./decor.mjs";
import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT = process.cwd(), args = process.argv.slice(2), arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const OUT = arg("--out") || path.join(ROOT, "public/images/blog/cards"); fs.mkdirSync(OUT, { recursive: true });
const dir = path.join(ROOT, "content/blog");
const slugs = arg("--slugs") ? arg("--slugs").split(",") : fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const BG = "#2c1a0e", CREAM = "#f5e6d3";
const GLYPH = { cup: '<path d="M0 10h44v26a18 18 0 0 1-18 18h-8A18 18 0 0 1 0 36z M44 16h8a10 10 0 0 1 0 22h-8" fill="none" stroke="ACC" stroke-width="5"/><path d="M10 -6c0-8 8-8 8-16M26 -6c0-8 8-8 8-16" fill="none" stroke="ACC" stroke-width="4" stroke-linecap="round"/>', pin: '<path d="M26 0C12 0 2 10 2 24c0 18 24 40 24 40s24-22 24-40C50 10 40 0 26 0z" fill="none" stroke="ACC" stroke-width="5"/><circle cx="26" cy="24" r="9" fill="ACC"/>', bars: '<rect x="0" y="34" width="12" height="24" fill="ACC"/><rect x="20" y="18" width="12" height="40" fill="ACC"/><rect x="40" y="0" width="12" height="58" fill="ACC"/>', target: '<circle cx="28" cy="28" r="26" fill="none" stroke="ACC" stroke-width="5"/><circle cx="28" cy="28" r="14" fill="none" stroke="ACC" stroke-width="5"/><circle cx="28" cy="28" r="5" fill="ACC"/>', star: '<path d="M28 0l8 19 20 2-15 14 5 20-18-11-18 11 5-20L0 21l20-2z" fill="ACC"/>' };
const glyphFor = (s, c) => { const x = (s + " " + c).toLowerCase(); return /review|reput|rating/.test(x) ? "star" : /seo|map|business profile|gbp|local|city|location/.test(x) ? "pin" : /analytic|report|data|roi|cost|budget|benchmark/.test(x) ? "bars" : /coffee|caf|bakery|restaurant/.test(x) ? "cup" : "target"; };
function wrap(t, max, lines) { const w = t.split(/\s+/), out = []; let cur = ""; for (const x of w) { if ((cur + " " + x).trim().length > max) { out.push(cur); cur = x; } else cur = (cur + " " + x).trim(); } if (cur) out.push(cur); if (out.length > lines) { out.length = lines; out[lines - 1] = out[lines - 1].replace(/\s*\S*$/, "") + "…"; } return out; }
let n = 0;
for (const s of slugs) {
  const f = path.join(dir, s + ".mdx"); if (!fs.existsSync(f)) continue;
  const { data, content } = matter(fs.readFileSync(f, "utf8"));
  const sr = content.match(/<StatRow[^>]*values="([^"]*)"[^>]*labels="([^"]*)"(?:[^>]*subs="([^"]*)")?/);
  let stat = null;
  if (sr) { const V = sr[1].split("|"), L = sr[2].split("|"), S = (sr[3] || "").split("|"); const i = V.findIndex((v, k) => /\d/.test(v) && !/assumption|example|illustrat/i.test(S[k] || "")); if (i >= 0) stat = { v: V[i].slice(0, 12), l: L[i] || "" }; if (/spotify|vibe|flodesk|airops/i.test((V[i] || "") + " " + (L[i] || ""))) stat = null; }
  const D = decor(s); const ACC = D.acc; const cat = String(data.category || "Local Marketing"); const g = GLYPH[glyphFor(s, cat)].replace(/ACC/g, ACC);
  const fs0 = stat ? Math.max(70, Math.min(210, Math.floor(980 / (stat.v.length * 0.64)))) : 0;
  const ll = stat ? wrap(stat.l, 40, 2) : [];
  const body = stat
    ? `<text x="70" y="${300 + (fs0 > 150 ? 20 : 0)}" font-family="Helvetica, Arial, sans-serif" font-size="${fs0}" font-weight="800" fill="${ACC}">${esc(stat.v)}</text>${ll.map((l, i) => `<text x="74" y="${392 + i * 50}" font-family="Helvetica, Arial, sans-serif" font-size="40" fill="${CREAM}">${esc(l)}</text>`).join("")}`
    : `<text x="70" y="330" font-family="Georgia, serif" font-size="76" font-weight="700" fill="${CREAM}">${wrap(cat, 18, 2).map((l, i) => `<tspan x="70" dy="${i ? 84 : 0}">${esc(l)}</tspan>`).join("")}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(data.title || s)}">
<title>${esc(data.title || s)}</title><desc>${esc(stat ? stat.v + " " + stat.l : cat)}</desc>
<defs><radialGradient id="g" cx="${D.gx}%" cy="${D.gy}%" r="75%"><stop offset="0" stop-color="${ACC}" stop-opacity="0.30"/><stop offset="1" stop-color="${BG}" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="${BG}"/><rect width="1200" height="630" fill="url(#g)"/>
${D.shapes}
<g transform="translate(${D.glyphPos[0]} ${D.glyphPos[1]}) scale(3.6)" opacity="0.9">${g}</g>
${body}
</svg>`;
  fs.writeFileSync(path.join(OUT, s + ".svg"), svg); n++;
}
console.log("cards", n);
