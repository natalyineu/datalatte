#!/usr/bin/env node
/**
 * generate-city-articles.mjs
 * Generates 200 local-intent articles: "Google Ads for [Niche] in [City, State]"
 * 50 US cities × 4 niches = 200 articles capturing hyperlocal search demand
 *
 * Usage: node scripts/generate-city-articles.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT   = path.join(__dirname, '../content/blog');
const DRY_RUN   = process.argv.includes('--dry-run');

let written = 0, skipped = 0;
function emit(slug, content) {
  const outPath = path.join(CONTENT, `${slug}.mdx`);
  if (fs.existsSync(outPath)) { skipped++; console.log(`[skip] ${slug}`); return; }
  if (DRY_RUN) { console.log(`[dry]  ${slug}.mdx (~${Math.round(content.length / 5)} words)`); written++; return; }
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`[ok]   ${slug}.mdx`);
  written++;
}

import { CITIES, CITY_NICHES } from './data/block6-cities.mjs';
import { cityNicheArticle } from './templates/block6-city-niche.mjs';

for (const city of CITIES) {
  for (const niche of CITY_NICHES) {
    const slug = `google-ads-for-${niche.niche}-in-${city.slug}`;
    emit(slug, cityNicheArticle(city, niche));
  }
}

console.log(`\n${DRY_RUN ? 'DRY RUN — ' : ''}Generated: ${written} | Skipped (exists): ${skipped}`);
