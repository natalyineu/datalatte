/**
 * Generate blog post images using Hugging Face Inference API (FLUX Schnell — free).
 * Saves images to public/blog/clusters/{slug}.jpg
 *
 * Usage:
 *   node scripts/generate-images-hf.mjs              # fill all missing images
 *   node scripts/generate-images-hf.mjs --slug coffee-shops-dominate-google-maps
 *   node scripts/generate-images-hf.mjs --limit 10   # process first 10 missing only
 *
 * Requires HF_TOKEN in .env.local:
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
const envPath = path.join(ROOT, ".env.local");
const envRaw  = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const HF_TOKEN = envRaw.match(/HF_TOKEN=(.+)/)?.[1]?.trim() || process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error("❌  HF_TOKEN not found. Add it to .env.local:\n   HF_TOKEN=hf_your_token_here");
  process.exit(1);
}

const MODEL = "black-forest-labs/FLUX.1-schnell";
const API   = `https://api-inference.huggingface.co/models/${MODEL}`;

// ── Parse args ───────────────────────────────────────────────────────────────
const args  = process.argv.slice(2);
const slugArg  = args[args.indexOf("--slug")  + 1] || null;
const limitArg = args[args.indexOf("--limit") + 1] || null;
const LIMIT    = limitArg ? parseInt(limitArg) : Infinity;

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugToPrompt(slug) {
  // Convert slug to a readable title then build a prompt
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    `Professional marketing photography for a blog post titled "${title}". ` +
    `Modern, clean, commercial style. Warm tones, business context. ` +
    `No text, no logos, no watermarks. Horizontal 16:9 composition.`
  );
}

async function generateImage(slug) {
  const prompt = slugToPrompt(slug);
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { width: 1200, height: 630 },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // Model loading — wait and retry
    if (res.status === 503) {
      const wait = JSON.parse(text)?.estimated_time ?? 20;
      console.log(`   ⏳ Model loading, waiting ${Math.ceil(wait)}s…`);
      await new Promise(r => setTimeout(r, (wait + 2) * 1000));
      return generateImage(slug); // retry
    }
    throw new Error(`HF API ${res.status}: ${text}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

// ── Main ─────────────────────────────────────────────────────────────────────
const imageCache = JSON.parse(fs.existsSync(CACHE) ? fs.readFileSync(CACHE, "utf8") : "{}");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Collect slugs to process
let slugs = [];

if (slugArg) {
  slugs = [slugArg];
} else {
  // All MDX slugs not already in image cache AND no cluster image yet
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
  process.stdout.write(`  ${slug} … `);
  try {
    const buf = await generateImage(slug);
    fs.writeFileSync(outPath, buf);
    console.log(`✅  saved (${Math.round(buf.length / 1024)} KB)`);
    ok++;
    // Polite delay between requests on free tier
    if (slugs.indexOf(slug) < slugs.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  } catch (err) {
    console.log(`❌  ${err.message}`);
    failed++;
  }
}

console.log(`\nDone — ${ok} generated, ${failed} failed.`);
if (ok > 0) {
  console.log(`\nNext: git add public/blog/clusters && git commit -m "Add AI-generated blog images"`);
}
