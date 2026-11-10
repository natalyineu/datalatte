// Generates a unique SVG cover per blog post (title + headline stat from StatRow). Usage: node make-covers.mjs [--out dir] [--slugs a,b] [--all]
import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT = process.cwd(), args = process.argv.slice(2), arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const OUT = arg("--out") || path.join(ROOT, "public/images/blog"); fs.mkdirSync(OUT, { recursive: true });
const dir = path.join(ROOT, "content/blog");
const slugs = arg("--slugs") ? arg("--slugs").split(",") : fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const BG = "#2c1a0e", CREAM = "#f5e6d3", ACC = "#d4a574";
function wrap(t, max, lines) { const w = t.split(/\s+/), out = []; let cur = ""; for (const x of w) { if ((cur + " " + x).trim().length > max) { out.push(cur); cur = x; } else cur = (cur + " " + x).trim(); } if (cur) out.push(cur); if (out.length > lines) { out.length = lines; out[lines - 1] = out[lines - 1].replace(/\s*\S*$/, "") + "…"; } return out; }
// simple category glyphs drawn as shapes (no emoji fonts): cup, pin, bars, target, star
const GLYPH = { cup: '<path d="M0 10h44v26a18 18 0 0 1-18 18h-8A18 18 0 0 1 0 36z M44 16h8a10 10 0 0 1 0 22h-8" fill="none" stroke="ACC" stroke-width="5"/><path d="M10 -6c0-8 8-8 8-16M26 -6c0-8 8-8 8-16" fill="none" stroke="ACC" stroke-width="4" stroke-linecap="round"/>', pin: '<path d="M26 0C12 0 2 10 2 24c0 18 24 40 24 40s24-22 24-40C50 10 40 0 26 0z" fill="none" stroke="ACC" stroke-width="5"/><circle cx="26" cy="24" r="9" fill="ACC"/>', bars: '<rect x="0" y="34" width="12" height="24" fill="ACC"/><rect x="20" y="18" width="12" height="40" fill="ACC"/><rect x="40" y="0" width="12" height="58" fill="ACC"/>', target: '<circle cx="28" cy="28" r="26" fill="none" stroke="ACC" stroke-width="5"/><circle cx="28" cy="28" r="14" fill="none" stroke="ACC" stroke-width="5"/><circle cx="28" cy="28" r="5" fill="ACC"/>', star: '<path d="M28 0l8 19 20 2-15 14 5 20-18-11-18 11 5-20L0 21l20-2z" fill="ACC"/>' };
const glyphFor = (s, c) => { const x = (s + " " + c).toLowerCase(); return /review|reput|rating/.test(x) ? "star" : /seo|map|business profile|gbp|local|city|location/.test(x) ? "pin" : /analytic|report|data|roi|cost|budget|benchmark/.test(x) ? "bars" : /coffee|caf|bakery|restaurant/.test(x) ? "cup" : "target"; };
let n = 0;
for (const s of slugs) {
  const f = path.join(dir, s + ".mdx"); if (!fs.existsSync(f)) continue;
  const { data, content } = matter(fs.readFileSync(f, "utf8"));
  const sr = content.match(/<StatRow[^>]*values="([^"]*)"[^>]*labels="([^"]*)"(?:[^>]*subs="([^"]*)")?/);
  let cards = [];
  if (sr) { const V = sr[1].split("|"), L = sr[2].split("|"), S = (sr[3] || "").split("|"); V.forEach((v, k) => { if (/\d/.test(v) && !/assumption|example|illustrat/i.test(S[k] || "") && !/spotify|vibe|flodesk|airops/i.test(L[k] || "")) cards.push({ v: v.slice(0, 11), l: L[k] || "" }); }); cards = cards.slice(0, 3); }
  const title = String(data.title || s).replace(/\s*\|.*$/, ""); const cat = String(data.category || "Local Marketing");
  const tl = wrap(title, 24, 3), g = GLYPH[glyphFor(s, cat)].replace(/ACC/g, ACC);
  const ty = 180 - (tl.length - 1) * 8;
  const cw = cards.length ? Math.floor((1080 - (cards.length - 1) * 20) / cards.length) : 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title><desc>${esc(cards.map((c) => c.v + " " + c.l).join("; ") || cat)}</desc>
<defs><radialGradient id="g" cx="85%" cy="10%" r="70%"><stop offset="0" stop-color="${ACC}" stop-opacity="0.28"/><stop offset="1" stop-color="${BG}" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="${BG}"/><rect width="1200" height="630" fill="url(#g)"/>
<circle cx="1110" cy="90" r="150" fill="none" stroke="${ACC}" stroke-opacity="0.18" stroke-width="2"/><circle cx="1110" cy="90" r="105" fill="none" stroke="${ACC}" stroke-opacity="0.12" stroke-width="2"/>
<g transform="translate(1076 62) scale(1.0)">${g}</g>
<text x="60" y="76" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" fill="${ACC}" letter-spacing="3">${esc(cat.toUpperCase().slice(0, 36))}</text>
<rect x="60" y="94" width="64" height="4" rx="2" fill="${ACC}"/>
${tl.map((l, i) => `<text x="60" y="${ty + i * 68}" font-family="Georgia, 'Times New Roman', serif" font-size="60" font-weight="700" fill="${CREAM}">${esc(l)}</text>`).join("\n")}
${!cards.length ? `<rect x="60" y="388" width="1080" height="160" rx="16" fill="${CREAM}" fill-opacity="0.08" stroke="${ACC}" stroke-opacity="0.35"/>${wrap(String(data.description || cat), 62, 3).map((l, j) => `<text x="90" y="${446 + j * 40}" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="${CREAM}" fill-opacity="0.92">${esc(l)}</text>`).join("")}` : ""}
${cards.map((c, i) => { const x = 60 + i * (cw + 20), ll = wrap(c.l, Math.max(14, Math.floor(cw / 15)), 2); return `<rect x="${x}" y="388" width="${cw}" height="160" rx="16" fill="${CREAM}" fill-opacity="0.08" stroke="${ACC}" stroke-opacity="0.35"/><text x="${x + 24}" y="465" font-family="Helvetica, Arial, sans-serif" font-size="${Math.max(30, Math.min(70, Math.floor((cw - 48) / (c.v.length * 0.64))))}" font-weight="800" fill="${ACC}">${esc(c.v)}</text>${ll.map((l, j) => `<text x="${x + 24}" y="${500 + j * 26}" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="${CREAM}" fill-opacity="0.9">${esc(l)}</text>`).join("")}`; }).join("\n")}
<text x="60" y="596" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="${CREAM}">DataLatte</text><text x="178" y="596" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="${ACC}">Brew up better business with data that works</text>
</svg>`;
  fs.writeFileSync(path.join(OUT, s + ".svg"), svg); n++;
}
console.log("covers", n);
