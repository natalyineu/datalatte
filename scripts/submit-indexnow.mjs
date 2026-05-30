/**
 * IndexNow bulk submission script
 * Submits all blog URLs to Bing, Yandex, Seznam for instant indexing.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs            # submit all blog posts
 *   node scripts/submit-indexnow.mjs --new 50   # submit 50 newest posts only
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/blog");

const BASE_URL = "https://datalatte.pro";
const KEY = "1fa323daf93a42e99fe0a313c9d76d21";
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

// IndexNow API — single endpoint covers Bing, Yandex, Seznam, Naver, Yep
const INDEXNOW_API = "https://api.indexnow.org/indexnow";

async function getBlogUrls(limit) {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf8");
    const { data } = matter(raw);
    return {
      url: `${BASE_URL}/blog/${f.replace(".mdx", "")}`,
      date: new Date(data.date || "2024-01-01"),
    };
  });

  // Sort newest first
  posts.sort((a, b) => b.date - a.date);

  const selected = limit ? posts.slice(0, limit) : posts;
  return selected.map((p) => p.url);
}

function getStaticUrls() {
  return [
    BASE_URL,
    `${BASE_URL}/blog`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/services`,
    `${BASE_URL}/services/google-ads`,
    `${BASE_URL}/services/meta-ads`,
    `${BASE_URL}/services/local-seo`,
    `${BASE_URL}/services/google-business-profile`,
    `${BASE_URL}/services/analytics`,
    `${BASE_URL}/services/ai-agents`,
    `${BASE_URL}/services/email-sms`,
    `${BASE_URL}/services/social-media`,
    `${BASE_URL}/services/website`,
    `${BASE_URL}/for/coffee-shops`,
    `${BASE_URL}/for/hair-salons`,
    `${BASE_URL}/for/pet-groomers`,
    `${BASE_URL}/for/fitness-studios`,
    `${BASE_URL}/for/barbershops`,
    `${BASE_URL}/for/dentists`,
    `${BASE_URL}/for/restaurants`,
    `${BASE_URL}/for/yoga-studios`,
    `${BASE_URL}/for/nail-salons`,
    `${BASE_URL}/for/cleaning-services`,
  ];
}

async function submitBatch(urls) {
  const body = {
    host: "datalatte.pro",
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return res.status;
}

async function main() {
  const args = process.argv.slice(2);
  const limitIdx = args.indexOf("--new");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : null;

  console.log("🔍 IndexNow Submission — datalatte.pro");
  console.log(`   Key: ${KEY}`);
  console.log(`   API: ${INDEXNOW_API}\n`);

  const blogUrls = await getBlogUrls(limit);
  const staticUrls = getStaticUrls();
  const allUrls = [...staticUrls, ...blogUrls];

  console.log(`📋 URLs to submit: ${allUrls.length}`);
  console.log(`   Static pages: ${staticUrls.length}`);
  console.log(`   Blog posts:   ${blogUrls.length}\n`);

  // IndexNow accepts up to 10,000 URLs per request, but 500 is safer
  const BATCH_SIZE = 500;
  let submitted = 0;

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allUrls.length / BATCH_SIZE);

    process.stdout.write(`   Batch ${batchNum}/${totalBatches} (${batch.length} URLs)... `);

    const status = await submitBatch(batch);

    if (status === 200) {
      console.log("✅ 200 OK");
    } else if (status === 202) {
      console.log("✅ 202 Accepted");
    } else {
      console.log(`⚠️  HTTP ${status}`);
    }

    submitted += batch.length;

    // Small delay between batches
    if (i + BATCH_SIZE < allUrls.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n✅ Done! ${submitted} URLs submitted to IndexNow`);
  console.log("   Covered engines: Bing, Yandex, Seznam, Naver, Yep");
  console.log("\n💡 Tip: run again after publishing new content:");
  console.log("   node scripts/submit-indexnow.mjs --new 10\n");
}

main().catch(console.error);
