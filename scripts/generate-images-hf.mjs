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

// HF Inference API — try newer router endpoint first, fall back to legacy
const ENDPOINTS = [
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

async function generateImage(slug) {
  const prompt = slugToPrompt(slug);
  let lastError = null;

  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "image/jpeg,image/*",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { width: 1200, height: 630, num_inference_steps: 4 },
        }),
      });

      if (res.status === 503) {
        const text = await res.text();
        let wait = 20;
        try { wait = JSON.parse(text)?.estimated_time ?? 20; } catch {}
        console.log(`\n   ⏳ Model loading on ${endpoint.includes("router") ? "router" : "legacy"}, waiting ${Math.ceil(wait)}s…`);
        await new Promise(r => setTimeout(r, (wait + 2) * 1000));
        // retry same endpoint
        const res2 = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json", "Accept": "image/jpeg,image/*" },
          body: JSON.stringify({ inputs: prompt, parameters: { width: 1200, height: 630, num_inference_steps: 4 } }),
        });
        if (res2.ok) return Buffer.from(await res2.arrayBuffer());
        lastError = new Error(`HTTP ${res2.status} from ${endpoint}`);
        continue;
      }

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        lastError = new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
        continue;
      }

      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = err;
      // try next endpoint
    }
  }

  throw lastError ?? new Error("All endpoints failed");
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
