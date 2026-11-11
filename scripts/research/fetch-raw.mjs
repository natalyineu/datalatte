// Fetches full page markdown via Jina Reader and stores it gzipped: data/research/raw/<sha1(url)>.md.gz (+ index.json with length/hash/date).
// Usage: NODE_USE_ENV_PROXY=1 node fetch-raw.mjs <urls.json> [--limit N]
import fs from "fs"; import path from "path"; import crypto from "crypto"; import zlib from "zlib";
const RAW = path.join(process.cwd(), "data/research/raw"); fs.mkdirSync(RAW, { recursive: true });
const IDX = path.join(RAW, "index.json"); const idx = fs.existsSync(IDX) ? JSON.parse(fs.readFileSync(IDX, "utf8")) : {};
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex");
const urls = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).filter((u) => !idx[sha(u)]).slice(0, process.argv.includes("--limit") ? +process.argv[process.argv.indexOf("--limit") + 1] : 1e9);
console.log("to fetch", urls.length);
function clean(t) { // drop obvious boilerplate: empty link-only menu lines, cookie notices, repeated blank lines
  return t.split("\n").filter((l) => !/^\s*(\*|-)?\s*\[[^\]]{0,40}\]\([^)]*\)\s*$/.test(l) || l.length > 90).join("\n").replace(/\n{3,}/g, "\n\n"); }
let ok = 0, fail = 0;
async function one(u) {
  for (let a = 0; a < 2; a++) {
    try { const r = await fetch("https://r.jina.ai/" + u, { signal: AbortSignal.timeout(90000) }); if (!r.ok) throw new Error("http " + r.status); const t = clean(await r.text()); if (t.length < 800) throw new Error("short");
      fs.writeFileSync(path.join(RAW, sha(u) + ".md.gz"), zlib.gzipSync(t)); idx[sha(u)] = { url: u, chars: t.length, fetchedAt: new Date().toISOString().slice(0, 10), hash: sha(t) }; ok++; return; } catch (e) { if (a) { fail++; } }
  }
}
const q = [...urls]; await Promise.all(Array.from({ length: 5 }, async () => { for (let u; (u = q.shift()); ) { await one(u); if ((ok + fail) % 50 === 0) fs.writeFileSync(IDX, JSON.stringify(idx)); } }));
fs.writeFileSync(IDX, JSON.stringify(idx)); console.log("fetched", ok, "failed", fail);
