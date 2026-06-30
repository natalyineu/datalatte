#!/usr/bin/env node
/**
 * generate-50-new-articles.mjs
 * Generates 50 new blog posts across 5 proven content patterns
 * (keyword lists, CTV country guides, vs-comparisons, ad-platform guides,
 * audio/analytics/programmatic topics). Mirrors existing site MDX conventions.
 *
 * Usage: node scripts/generate-50-new-articles.mjs [--dry-run]
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

// ════════════════════════════════════════════════════════════════════════
// BLOCK 1 — "Best Google Ad Keywords for [Niche] in 2026" (20 articles)
// ════════════════════════════════════════════════════════════════════════
import { NICHES } from './data/block1-niches.mjs';
import { keywordArticle } from './templates/block1-keywords.mjs';
for (const n of NICHES) emit(n.slug, keywordArticle(n));

// ════════════════════════════════════════════════════════════════════════
// BLOCK 2 — "CTV Advertising in [Country]" (13 articles)
// ════════════════════════════════════════════════════════════════════════
import { COUNTRIES } from './data/block2-countries.mjs';
import { ctvArticle } from './templates/block2-ctv.mjs';
for (const c of COUNTRIES) emit(c.slug, ctvArticle(c));

// ════════════════════════════════════════════════════════════════════════
// BLOCK 3 — Lead-gen platform "vs" comparisons (5 articles)
// ════════════════════════════════════════════════════════════════════════
import { COMPARISONS } from './data/block3-comparisons.mjs';
import { comparisonArticle } from './templates/block3-comparisons.mjs';
for (const c of COMPARISONS) emit(c.slug, comparisonArticle(c));

// ════════════════════════════════════════════════════════════════════════
// BLOCK 4 — Single ad-platform guides for local business (5 articles)
// ════════════════════════════════════════════════════════════════════════
import { PLATFORMS } from './data/block4-platforms.mjs';
import { platformArticle } from './templates/block4-platforms.mjs';
for (const p of PLATFORMS) emit(p.slug, platformArticle(p));

// ════════════════════════════════════════════════════════════════════════
// BLOCK 5 — Low-confidence audio/analytics/programmatic topics (7 articles)
// ════════════════════════════════════════════════════════════════════════
import { MISC } from './data/block5-misc.mjs';
import { miscArticle } from './templates/block5-misc.mjs';
for (const m of MISC) emit(m.slug, miscArticle(m));

console.log(`\n${DRY_RUN ? 'DRY RUN — ' : ''}Generated: ${written} | Skipped (exists): ${skipped}`);
