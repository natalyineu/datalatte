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
const MODEL  = "black-forest-labs/FLUX.1-dev";

// ── Parse args ───────────────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const slugIdx  = args.indexOf("--slug");
const limitIdx = args.indexOf("--limit");
const slugArg  = slugIdx  !== -1 ? (args[slugIdx  + 1] || null) : null;
const limitArg = limitIdx !== -1 ? (args[limitIdx + 1] || null) : null;
const LIMIT    = limitArg ? parseInt(limitArg, 10) : Infinity;

// ── Niche scene detection from slug ─────────────────────────────────────────
const NICHE_SCENES = [
  {
    keys: ["coffee", "cafe", "espresso", "latte", "barista", "brew"],
    scene: "cozy independent coffee shop interior, espresso machine steaming, ceramic cups on wooden counter, warm café lighting, coffee beans scattered, latte art close-up",
  },
  {
    keys: ["hair", "salon", "barber", "haircut", "balayage", "stylist", "beauty", "spa", "nail"],
    scene: "modern hair salon interior, professional styling station with mirror, haircare products neatly arranged, salon chairs, soft ambient lighting, clean and luxurious atmosphere",
  },
  {
    keys: ["pet", "groomer", "grooming", "dog", "cat", "vet", "animal"],
    scene: "bright professional pet grooming studio, grooming tools laid out on table, fluffy towels, pet shampoo bottles, clean stainless steel grooming table, warm welcoming space",
  },
  {
    keys: ["fitness", "gym", "yoga", "workout", "exercise", "studio", "pilates", "training"],
    scene: "modern fitness studio interior, exercise equipment, yoga mats rolled out, large windows with natural light, motivational minimalist space, clean athletic environment",
  },
  {
    keys: ["restaurant", "food", "menu", "dining", "kitchen", "chef", "meal"],
    scene: "upscale restaurant interior, beautifully plated dish on table, ambient candlelight, elegant table setting, empty chairs, warm restaurant atmosphere",
  },
  {
    keys: ["google", "ads", "meta", "tiktok", "facebook", "instagram", "advertising", "campaign", "paid"],
    scene: "modern marketing workspace, laptop showing colorful analytics dashboard, charts and graphs on screen, clean desk with notebook, soft office lighting",
  },
  {
    keys: ["seo", "search", "local", "maps", "ranking", "keyword", "organic"],
    scene: "flat lay of notebook with SEO strategy mind map, laptop with search results on screen, coffee cup beside keyboard, clean minimalist desk setup, bright natural light",
  },
  {
    keys: ["email", "sms", "crm", "automation", "retention", "newsletter"],
    scene: "close-up of smartphone showing email inbox with notification badges, laptop in background, clean modern desk, plants, soft morning light",
  },
  {
    keys: ["social", "media", "content", "instagram", "video", "reels", "tiktok"],
    scene: "content creation flat lay: smartphone on tripod, ring light, props arranged artfully, colorful backgrounds, creative studio setup",
  },
  {
    keys: ["budget", "pricing", "cost", "revenue", "roi", "profit", "money", "finance"],
    scene: "overhead flat lay of financial planning: calculator, notebook with graphs, pen, glasses on white desk, clean minimal composition",
  },
  {
    keys: ["ai", "automation", "agent", "chatbot", "technology", "software"],
    scene: "abstract technology concept: glowing laptop screen with data visualization, soft blue light, minimalist desk, futuristic but approachable atmosphere",
  },
  {
    keys: ["cleaning", "service", "home", "maintenance", "janitorial"],
    scene: "professional cleaning supplies neatly arranged, spray bottles and microfiber cloths on pristine white surface, bright clean environment",
  },
  {
    keys: ["real", "estate", "property", "agent", "house", "home"],
    scene: "beautiful modern home exterior or bright living room interior, architectural photography, clean lines, warm inviting atmosphere, no people",
  },
];

function slugToPrompt(slug) {
  const lower = slug.toLowerCase();

  // Find matching niche scene
  let scene = null;
  for (const niche of NICHE_SCENES) {
    if (niche.keys.some(k => lower.includes(k))) {
      scene = niche.scene;
      break;
    }
  }

  // Default scene for unmatched slugs
  if (!scene) {
    scene = "modern small business storefront exterior, clean signage, welcoming entrance, warm natural lighting, vibrant neighbourhood street";
  }

  return (
    `${scene}. ` +
    `Professional commercial photography, 16:9 horizontal composition, shallow depth of field, ` +
    `warm natural tones, high detail. ` +
    `No people, no faces, no text, no logos, no watermarks, no words.`
  );
}

// ── Generate one image via HF client ─────────────────────────────────────────
async function generateImage(slug) {
  const blob = await client.textToImage({
    model:  MODEL,
    inputs: slugToPrompt(slug),
    parameters: { width: 1200, height: 630, num_inference_steps: 28 },
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
