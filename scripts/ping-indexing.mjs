#!/usr/bin/env node
/**
 * ping-indexing.mjs
 * Notifies search engines of new/updated content.
 * Run after every deploy: node scripts/ping-indexing.mjs
 *
 * 1. Pings Google to recrawl sitemap
 * 2. Pings Bing to recrawl sitemap
 * 3. Sends IndexNow batch to Bing for recent articles (last 50)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL    = 'https://datalatte.pro';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const INDEXNOW_KEY = '0db0ab755c9749b2ba9521accb56b1dd';
const CONTENT_DIR  = path.join(__dirname, '../content/blog');

async function ping(label, url) {
  try {
    const res = await fetch(url);
    console.log(`  ${res.ok ? '✓' : '✗'} ${label} → ${res.status}`);
  } catch (e) {
    console.log(`  ✗ ${label} → ${e.message}`);
  }
}

async function indexNowBatch(urls) {
  try {
    const body = {
      host: 'datalatte.pro',
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    console.log(`  ${res.ok ? '✓' : '✗'} IndexNow batch (${urls.length} URLs) → ${res.status}`);
  } catch (e) {
    console.log(`  ✗ IndexNow → ${e.message}`);
  }
}

// Get 50 most recently modified articles
function getRecentSlugs(limit = 50) {
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => ({ slug: f.replace('.mdx', ''), mtime: fs.statSync(path.join(CONTENT_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit)
    .map(({ slug }) => `${BASE_URL}/blog/${slug}`);
}

console.log('Pinging search engines...\n');

// 1. Sitemap pings
console.log('Sitemap pings:');
await ping('Google', `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`);
await ping('Bing',   `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`);

// 2. IndexNow for recent articles
console.log('\nIndexNow (recent articles):');
const recentUrls = getRecentSlugs(50);
await indexNowBatch(recentUrls);

console.log(`\nDone. Pinged sitemap + ${recentUrls.length} recent URLs.`);
console.log(`Tip: run again after each content batch to keep Bing fresh.`);
