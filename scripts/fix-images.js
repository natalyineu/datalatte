#!/usr/bin/env node
// One-time script: assign unique Unsplash images to all blog posts by topic

const fs = require("fs");
const path = require("path");

const UNSPLASH_KEY = "q5P82tOFQmdBXoqbUmRW9QFTs-mgDg-7A44B4fyqs8w";
const BLOG_DIR = path.join(__dirname, "../content/blog");

// Topic detection: keyword → Unsplash search query
const TOPICS = [
  { keywords: ["coffee-shop", "coffee-shops", "cafe", "coffeehouse"], query: "coffee shop cafe interior" },
  { keywords: ["hair-salon", "hair-salons", "salon", "barbershop", "barber", "haircut"], query: "hair salon beauty" },
  { keywords: ["pet-groomer", "pet-groomers", "grooming", "dog-groomer", "pet-care", "veterinary", "vet"], query: "pet grooming dog" },
  { keywords: ["fitness", "gym", "yoga", "workout", "personal-trainer", "exercise"], query: "fitness gym workout" },
  { keywords: ["google-ads", "ppc", "paid-ads", "facebook-ads", "meta-ads", "advertising"], query: "digital advertising marketing" },
  { keywords: ["seo", "local-seo", "search-engine", "google-maps", "google-business", "google-ranking"], query: "seo search engine optimization" },
  { keywords: ["email", "email-marketing", "newsletter", "sms", "email-campaign"], query: "email marketing business" },
  { keywords: ["social-media", "instagram", "facebook", "tiktok", "social-post"], query: "social media marketing" },
  { keywords: ["website", "landing-page", "web-design", "cro", "conversion"], query: "website design modern" },
  { keywords: ["ai", "automation", "chatbot", "ai-agent", "ai-driven"], query: "artificial intelligence technology" },
  { keywords: ["analytics", "data", "reporting", "metrics", "dashboard"], query: "data analytics dashboard" },
  { keywords: ["restaurant", "food", "bakery", "pizza"], query: "restaurant food business" },
  { keywords: ["review", "reputation", "testimonial", "rating"], query: "customer reviews business" },
  { keywords: ["budget", "cost", "pricing", "affordable", "cheap"], query: "small business finance budget" },
  { keywords: ["local", "local-business", "small-business", "startup"], query: "local small business owner" },
];

function detectTopic(slug) {
  for (const topic of TOPICS) {
    for (const kw of topic.keywords) {
      if (slug.includes(kw)) return topic;
    }
  }
  return { query: "small business marketing local" };
}

// Simple hash: slug → number (for stable photo assignment)
function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

async function fetchPhotos(query, perPage = 30) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (!res.ok) {
    console.error(`Unsplash error for "${query}": ${res.status}`);
    return [];
  }
  const data = await res.json();
  return (data.results || []).map(
    (p) => `${p.urls.raw}&w=1200&h=630&fit=crop&auto=format&q=80`
  );
}

async function main() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  console.log(`Total MDX files: ${files.length}`);

  // Group slugs by topic
  const topicMap = new Map(); // query → [slug, ...]
  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const topic = detectTopic(slug);
    if (!topicMap.has(topic.query)) topicMap.set(topic.query, []);
    topicMap.get(topic.query).push(slug);
  }

  console.log(`\nTopics detected: ${topicMap.size}`);
  for (const [q, slugs] of topicMap) {
    console.log(`  "${q}": ${slugs.length} articles`);
  }

  // Fetch photos per topic
  console.log("\nFetching photos from Unsplash...");
  const photoPool = new Map(); // query → [url, ...]
  let requestCount = 0;
  for (const query of topicMap.keys()) {
    const needed = topicMap.get(query).length;
    const perPage = Math.min(30, Math.max(10, needed));
    console.log(`  Fetching ${perPage} photos for: "${query}"`);
    const photos = await fetchPhotos(query, perPage);
    photoPool.set(query, photos);
    requestCount++;
    console.log(`    Got ${photos.length} photos`);
    // Small delay to be nice to the API
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nTotal Unsplash API requests: ${requestCount}`);

  // Assign photos to articles and update MDX
  let updated = 0;
  let noPhotos = 0;

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const topic = detectTopic(slug);
    const photos = photoPool.get(topic.query) || [];

    if (photos.length === 0) {
      noPhotos++;
      continue;
    }

    // Pick photo by stable hash
    const photo = photos[hashSlug(slug) % photos.length];
    const filePath = path.join(BLOG_DIR, file);
    let content = fs.readFileSync(filePath, "utf8");

    // Replace image field in frontmatter
    const newContent = content.replace(
      /^image:.*$/m,
      `image: "${photo}"`
    );

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      updated++;
    } else {
      // No image field — add it after description line
      const withImage = content.replace(
        /^(description:.*)$/m,
        `$1\nimage: "${photo}"`
      );
      if (withImage !== content) {
        fs.writeFileSync(filePath, withImage, "utf8");
        updated++;
      }
    }
  }

  console.log(`\nDone!`);
  console.log(`  Updated: ${updated} files`);
  console.log(`  Skipped (no photos): ${noPhotos} files`);
}

main().catch(console.error);
