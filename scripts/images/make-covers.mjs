// Generates a unique SVG cover per blog post (title + headline stat from StatRow). Usage: node make-covers.mjs [--out dir] [--slugs a,b] [--all]
import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT = process.cwd(), args = process.argv.slice(2), arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const OUT = arg("--out") || path.join(ROOT, "public/images/blog"); fs.mkdirSync(OUT, { recursive: true });
const dir = path.join(ROOT, "content/blog");
const slugs = arg("--slugs") ? arg("--slugs").split(",") : fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const PAL = ["#6f4e37", "#8b5e3c", "#5a3e2b", "#7a5230", "#4b3621"];
function wrap(t, max, lines) { const w = t.split(/\s+/), out = []; let cur = ""; for (const x of w) { if ((cur + " " + x).trim().length > max) { out.push(cur); cur = x; } else cur = (cur + " " + x).trim(); } if (cur) out.push(cur); if (out.length > lines) { out.length = lines; out[lines - 1] = out[lines - 1].replace(/\s*\S*$/, "") + "…"; } return out; }
let n = 0;
for (const s of slugs) {
  const f = path.join(dir, s + ".mdx"); if (!fs.existsSync(f)) continue;
  const { data, content } = matter(fs.readFileSync(f, "utf8"));
  const sr = content.match(/<StatRow[^>]*values="([^"]*)"[^>]*labels="([^"]*)"(?:[^>]*subs="([^"]*)")?/);
  let stat = null;
  if (sr) { const V = sr[1].split("|"), L = sr[2].split("|"), S = (sr[3] || "").split("|"); const i = V.findIndex((v, k) => /\d/.test(v) && !/assumption|example|illustrat/i.test(S[k] || "")); if (i >= 0) stat = { v: V[i], l: L[i] || "" }; }
  const title = String(data.title || s).replace(/\s*\|.*$/, ""); const cat = String(data.category || "Local Marketing");
  const bg = PAL[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PAL.length];
  const tl = wrap(title, 26, 3), ll = stat ? wrap(stat.l, 34, 2) : [];
  const ty = 200 - (tl.length - 1) * 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title><desc>${esc(stat ? stat.v + " — " + stat.l : cat)}</desc>
<rect width="1200" height="630" fill="${bg}"/><rect x="0" y="0" width="1200" height="630" fill="#fdf8f3" opacity="0.06"/>
<rect x="60" y="56" width="${Math.min(60 + cat.length * 13, 520)}" height="40" rx="20" fill="#fdf8f3" opacity="0.16"/>
<text x="84" y="83" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="700" fill="#fdf8f3" letter-spacing="1">${esc(cat.toUpperCase().slice(0, 34))}</text>
${tl.map((l, i) => `<text x="60" y="${ty + i * 66}" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700" fill="#fdf8f3">${esc(l)}</text>`).join("\n")}
${stat ? `<rect x="60" y="400" width="1080" height="150" rx="18" fill="#fdf8f3" opacity="0.12"/>
<text x="90" y="500" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="800" fill="#fdf8f3">${esc(stat.v.slice(0, 14))}</text>
${ll.map((l, i) => `<text x="520" y="${462 + i * 36}" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#fdf8f3">${esc(l)}</text>`).join("\n")}` : ""}
<text x="60" y="598" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" fill="#fdf8f3" opacity="0.85">DataLatte · datalatte.pro</text>
</svg>`;
  fs.writeFileSync(path.join(OUT, s + ".svg"), svg); n++;
}
console.log("covers", n);
