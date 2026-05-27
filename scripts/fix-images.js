#!/usr/bin/env node
// Redistributes existing unique Unsplash URLs across all blog posts so no image repeats

const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "../content/blog");

// Stable hash: slug → number
function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function main() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx")).sort();
  console.log(`Total MDX files: ${files.length}`);

  // Collect all unique image URLs already in the repo
  const urlSet = new Set();
  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const match = content.match(/^image:\s*"([^"]+)"/m);
    if (match) urlSet.add(match[1]);
  }

  const allUrls = [...urlSet];
  console.log(`Unique image URLs found: ${allUrls.length}`);

  // Sort URLs for determinism
  allUrls.sort();

  // Assign each article its own URL by slug hash (mod pool size)
  // This guarantees stable, evenly-distributed assignment
  let updated = 0;
  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, "utf8");

    const assignedUrl = allUrls[hashSlug(slug) % allUrls.length];
    const newContent = content.replace(/^image:\s*"[^"]*"/m, `image: "${assignedUrl}"`);

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      updated++;
    }
  }

  console.log(`Updated: ${updated} files`);

  // Verify distribution
  const usageCount = new Map();
  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const match = content.match(/^image:\s*"([^"]+)"/m);
    if (match) {
      usageCount.set(match[1], (usageCount.get(match[1]) || 0) + 1);
    }
  }

  const counts = [...usageCount.values()].sort((a, b) => b - a);
  console.log(`\nAfter redistribution:`);
  console.log(`  Max repeats per image: ${counts[0]}`);
  console.log(`  Min repeats per image: ${counts[counts.length - 1]}`);
  console.log(`  Avg repeats per image: ${(counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1)}`);
}

main();
