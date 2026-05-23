/**
 * Generate blog post images using Hugging Face Inference API (FLUX Schnell — free).
 * Saves images to public/blog/clusters/{slug}.jpg
 *
 * Usage:
 *   node scripts/generate-images-hf.mjs              # fill all missing images
 *   node scripts/generate-images-hf.mjs --slug coffee-shops-dominate-google-maps
 *   node scripts/generate-images-hf.mjs --limit 10   # process first 10 missing only
 *
 * Requires HF_TOKEN in .env.local or as environment variable:
 *   HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const CONTENT   = path.join(ROOT, "content/blog");
const CACHE     = path.join(ROOT, "content/blog/image-cache.json");
const OUT_DIR   = path.join(ROOT, "public/blog/clusters");

// ── Load HF token ────────────────────────────────────────────────────────────
const envPath  = path.join(ROOT, ".env.local");
const envRaw   = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const HF_TOKEN = envRaw.match(/HF_TOKEN=(.+)/)?.[1]?.trim() || process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error("❌  HF_TOKEN not found. Add it to .env.local:\n   HF_TOKEN=hf_your_token_here");
  process.exit(1);
}

// Pollinations.ai — free FLUX, no auth, simple GET request
// HF endpoints kept as fallback if Pollinations is unavailable
const POLLINATIONS = `https://image.pollinations.ai/prompt/`;
const HF_ENDPOINTS = [
  `https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell`,
  `https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell`,
];

// ── Parse args (fixed: check index !== -1 before using) ─────────────────────
const args     = process.argv.slice(2);
const slugIdx  = args.indexOf("--slug");
const limitIdx = args.indexOf("--limit");
const slugArg  = slugIdx  !== -1 ? (args[slugIdx  + 1] || null) : null;
const limitArg = limitIdx !== -1 ? (args[limitIdx + 1] || null) : null;
const LIMIT    = limitArg ? parseInt(limitArg, 10) : Infinity;

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugToPrompt(slug) {
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    `Professional marketing photography for a blog post titled "${title}". ` +
    `Modern, clean, commercial photography style. Warm natural tones, business context. ` +
    `No text, no logos, no watermarks. Horizontal 16:9 composition, sharp focus.`
  );
}

async function tryPollinations(slug) {
  const prompt = encodeURIComponent(slugToPrompt(slug));
  const seed   = Math.floor(Math.random() * 99999);
  const url    = `${POLLINATIONS}${prompt}?width=1200&height=630&nologo=true&model=flux&seed=${seed}`;
  const res    = await fetch(url, { headers: { "User-Agent": "DataLatte/1.0" } });
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Pollinations returned too-small response (${buf.length} bytes)`);
  return buf;
}

async function tryHuggingFace(slug) {
  const prompt = slugToPrompt(slug);
  let lastError = null;
  for (const endpoint of HF_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json", "Accept": "image/jpeg,image/*" },
        body: JSON.stringify({ inputs: prompt, parameters: { width: 1200, height: 630, num_inference_steps: 4 } }),
      });
      if (res.status === 503) {
        const text = await res.text();
        let wait = 20;
        try { wait = JSON.parse(text)?.estimated_time ?? 20; } catch {}
        process.stdout.write(`\n   ⏳ HF model loading, waiting ${Math.ceil(wait)}s… `);
        await new Promise(r => setTimeout(r, (wait + 2) * 1000));
        const r2 = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: prompt, parameters: { width: 1200, height: 630, num_inference_steps: 4 } }),
        });
        if (r2.ok) return Buffer.from(await r2.arrayBuffer());
        lastError = new Error(`HF HTTP ${r2.status} after retry`);
        continue;
      }
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        lastError = new Error(`HF HTTP ${res.status}: ${body.slice(0, 120)}`);
        continue;
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = new Error(`HF ${err.message}${err.cause ? ` (${err.cause?.message ?? err.cause})` : ""}`);
    }
  }
  throw lastError ?? new Error("HF: all endpoints failed");
}

async function generateImage(slug) {
  // Try Pollinations first (free, no auth, reliable)
  try {
    return await tryPollinations(slug);
  } catch (pollinationsErr) {
    process.stdout.write(`\n   ⚠️  Pollinations failed (${pollinationsErr.message}), trying HF… `);
  }
  // Fall back to HuggingFace
  return tryHuggingFace(slug);
}

// ── Main ─────────────────────────────────────────────────────────────────────
const imageCache = JSON.parse(fs.existsSync(CACHE) ? fs.readFileSync(CACHE, "utf8") : "{}");
fs.mkdirSync(OUT_DIR, { recursive: true });

let slugs = [];

if (slugArg) {
  slugs = [slugArg];
} else {
  const mdxFiles = fs.readdirSync(CONTENT).filter(f => f.endsWith(".mdx"));
  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, "");
    const hasCache   = !!imageCache[slug];
    const hasCluster = fs.existsSync(path.join(OUT_DIR, `${slug}.jpg`));
    if (!hasCache && !hasCluster) slugs.push(slug);
  }
  slugs = slugs.slice(0, LIMIT);
}

if (slugs.length === 0) {
  console.log("✅  All blog posts already have images. Nothing to do.");
  process.exit(0);
}

console.log(`\n🖼  Generating ${slugs.length} image(s) with FLUX Schnell (free tier)…\n`);

let ok = 0, failed = 0;

for (const slug of slugs) {
  const outPath = path.join(OUT_DIR, `${slug}.jpg`);
  process.stdout.write(`  ${slug}\n     → `);
  try {
    const buf = await generateImage(slug);
    fs.writeFileSync(outPath, buf);
    console.log(`✅  saved (${Math.round(buf.length / 1024)} KB)`);
    ok++;
    if (slugs.indexOf(slug) < slugs.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (err) {
    console.log(`❌  ${err.message}`);
    failed++;
  }
}

console.log(`\nDone — ${ok} generated, ${failed} failed.`);
if (ok > 0) {
  console.log(`Next: git add public/blog/clusters && git commit -m "Add AI-generated blog images"`);
}
