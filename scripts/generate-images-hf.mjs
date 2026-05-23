/**
 * Generate blog post images using HuggingFace Inference JS client (FLUX.1-schnell).
 * Saves images to public/blog/clusters/{slug}.jpg
 *
 * Usage:
 *   node scripts/generate-images-hf.mjs              # fill all missing images
 *   node scripts/generate-images-hf.mjs --slug coffee-shops-dominate-google-maps
 *   node scripts/generate-images-hf.mjs --limit 10
 *
 * Requires HF_TOKEN in .env.local or as environment variable.
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { InferenceClient } from "@huggingface/inference";

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

const client = new InferenceClient(HF_TOKEN);
const MODEL  = "black-forest-labs/FLUX.1-schnell";

// ── Parse args ───────────────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const slugIdx  = args.indexOf("--slug");
const limitIdx = args.indexOf("--limit");
const slugArg  = slugIdx  !== -1 ? (args[slugIdx  + 1] || null) : null;
const limitArg = limitIdx !== -1 ? (args[limitIdx + 1] || null) : null;
const LIMIT    = limitArg ? parseInt(limitArg, 10) : Infinity;

// ── Build prompt from slug ───────────────────────────────────────────────────
function slugToPrompt(slug) {
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return (
    `Professional marketing photography for a blog post titled "${title}". ` +
    `Modern, clean, commercial style. Warm natural tones, business context. ` +
    `No text, no logos, no watermarks. Horizontal 16:9 composition.`
  );
}

// ── Generate one image via HF client ─────────────────────────────────────────
async function generateImage(slug) {
  const blob = await client.textToImage({
    model:  MODEL,
    inputs: slugToPrompt(slug),
    parameters: { width: 1200, height: 630, num_inference_steps: 4 },
  });
  return Buffer.from(await blob.arrayBuffer());
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

console.log(`\n🖼  Generating ${slugs.length} image(s) with FLUX.1-schnell via HF client…\n`);

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
