#!/usr/bin/env node
/**
 * fix-internal-links.mjs
 * Injects a "Related Articles" section into every MDX post that has
 * fewer than 4 internal links, boosting the internalLinking score to 8+.
 *
 * Strategy:
 *  - Parse category + tags from each article's frontmatter
 *  - Find 4 related articles in the same category (or nearby tags)
 *  - Append a "## Related Articles" section before the final CTA/Callout
 *    (or at the end if no CTA found)
 *  - Skip articles that already have 4+ internal links
 *
 * Usage:  node scripts/fix-internal-links.mjs [--dry-run] [--limit N]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT   = path.join(__dirname, '../content/blog');
const DRY_RUN   = process.argv.includes('--dry-run');
const LIMIT     = (() => { const i = process.argv.indexOf('--limit'); return i >= 0 ? parseInt(process.argv[i+1]) : Infinity; })();

// ── helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  // Parse tags array
  const tagLine = m[1].match(/^tags:\s*\[([^\]]+)\]/m);
  if (tagLine) {
    fm.tags = tagLine[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, '').toLowerCase());
  } else {
    fm.tags = [];
  }
  return fm;
}

function countInternalLinks(src) {
  return (src.match(/\]\(\/[^)]+\)/g) || []).length;
}

// Build index of all articles
const files = fs.readdirSync(CONTENT).filter(f => f.endsWith('.mdx'));
const index = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(CONTENT, file), 'utf8');
  const fm  = parseFrontmatter(src);
  index.push({
    slug:     file.replace('.mdx', ''),
    title:    fm.title || file.replace('.mdx', '').replace(/-/g, ' '),
    category: (fm.category || 'general').toLowerCase(),
    tags:     fm.tags || [],
    file,
  });
}

// Score similarity between two articles (higher = more related)
function similarity(a, b) {
  if (a.slug === b.slug) return -1;
  let score = 0;
  if (a.category === b.category) score += 5;
  const sharedTags = a.tags.filter(t => b.tags.includes(t)).length;
  score += sharedTags * 2;
  // Niche overlap (coffee/hair/pet/fitness in slug)
  const niches = ['coffee', 'hair', 'salon', 'pet', 'groomer', 'fitness', 'yoga'];
  for (const n of niches) {
    if (a.slug.includes(n) && b.slug.includes(n)) score += 3;
  }
  return score;
}

function findRelated(article, count = 4) {
  return index
    .map(b => ({ ...b, score: similarity(article, b) }))
    .filter(b => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

function buildRelatedSection(related) {
  const items = related.map(r => `- [${r.title}](/blog/${r.slug})`).join('\n');
  return `\n## Related Articles\n\n${items}\n`;
}

// ── main ─────────────────────────────────────────────────────────────────────

let processed = 0;
let skipped   = 0;
let fixed     = 0;

for (const article of index.slice(0, LIMIT)) {
  const filePath = path.join(CONTENT, article.file);
  const src = fs.readFileSync(filePath, 'utf8');
  const links = countInternalLinks(src);

  if (links >= 4) {
    skipped++;
    continue;
  }

  processed++;
  const needed  = 4 - links;
  const related = findRelated(article, Math.min(needed + 2, 5));

  if (related.length === 0) continue;

  // Already has a Related Articles section? Skip.
  if (/^## Related Articles/m.test(src)) {
    skipped++;
    continue;
  }

  const section = buildRelatedSection(related);

  // Insert before the last Callout or at the end of body
  let newSrc;
  const lastCalloutIdx = src.lastIndexOf('\n<Callout');
  if (lastCalloutIdx > src.length / 2) {
    newSrc = src.slice(0, lastCalloutIdx) + section + src.slice(lastCalloutIdx);
  } else {
    newSrc = src.trimEnd() + '\n' + section;
  }

  fixed++;
  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newSrc, 'utf8');
  }
  if (DRY_RUN && fixed <= 5) {
    console.log(`  [${links} links → +${related.length}] ${article.slug}`);
    related.forEach(r => console.log(`      → /blog/${r.slug}`));
  }
}

console.log(`\n${DRY_RUN ? 'DRY RUN — ' : ''}Internal links:`);
console.log(`  Already had 4+ links: ${skipped}`);
console.log(`  Fixed (added Related section): ${fixed}`);
