#!/usr/bin/env node
/**
 * fix-critical.mjs
 * Fixes three classes of issues across all MDX articles:
 *
 *  1. Malformed headings  — ### ## Common Mistakes → ### Common Mistakes
 *  2. Duplicate FAQ sections — keeps only the last occurrence
 *  3. Duplicate "Common Mistakes" sections — keeps only the last occurrence
 *
 * Usage:  node scripts/fix-critical.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const CONTENT    = path.join(__dirname, '../content/blog');
const DRY_RUN    = process.argv.includes('--dry-run');

const files = fs.readdirSync(CONTENT).filter(f => f.endsWith('.mdx'));

let totalFixed = 0;
const summary = { malformedHeading: 0, duplicateFaq: 0, duplicateMistakes: 0 };

for (const file of files) {
  const filePath = path.join(CONTENT, file);
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // ── 1. Malformed headings ─────────────────────────────────────────────────
  // Patterns seen: "### ## Common Mistakes", "## ## Title", "## Common ## Title"
  // Strategy: collapse repeated # markers and clean up
  const headingFixed = src
    // "### ## Something" → "### Something"
    .replace(/^(#{1,6})\s+#+\s+/gm, '$1 ')
    // "## ## Something" → "## Something"
    .replace(/^(#+)\s+(#+)\s+/gm, (_, h1, h2) => {
      const level = Math.max(h1.length, h2.length);
      return '#'.repeat(level) + ' ';
    })
    // "## Common ## Real-World" → "## Real-World" (strip inline ##)
    .replace(/^(#{1,6} )(.+?)##\s+/gm, '$1');

  if (headingFixed !== src) {
    src = headingFixed;
    changed = true;
    summary.malformedHeading++;
  }

  // ── 2. Duplicate FAQ sections ─────────────────────────────────────────────
  // Detect multiple H2-level FAQ headers; keep only the last block
  const faqPattern = /\n## (?:Common |Frequently Asked Questions?|FAQ[s]?).*\n/gi;
  const faqMatches = [...src.matchAll(faqPattern)];

  if (faqMatches.length > 1) {
    // Find all FAQ section start indices
    const faqIndices = faqMatches.map(m => m.index);
    // Remove all but the last FAQ block
    // Work backwards to preserve indices
    for (let i = 0; i < faqIndices.length - 1; i++) {
      const start = faqIndices[i];
      const end   = faqIndices[i + 1];
      // Remove section content from start to end
      const before = src.slice(0, start);
      const after  = src.slice(end);
      src = before + '\n' + after;
      // Recalculate remaining indices
      const removed = end - start - 1;
      for (let j = i + 1; j < faqIndices.length; j++) {
        faqIndices[j] -= removed;
      }
    }
    changed = true;
    summary.duplicateFaq++;
  }

  // ── 3. Duplicate "Common Mistakes" sections ───────────────────────────────
  const mistakesPattern = /\n## Common Mistakes.*\n/gi;
  const mistakesMatches = [...src.matchAll(mistakesPattern)];

  if (mistakesMatches.length > 1) {
    const indices = mistakesMatches.map(m => m.index);
    for (let i = 0; i < indices.length - 1; i++) {
      const start = indices[i];
      const end   = indices[i + 1];
      const before = src.slice(0, start);
      const after  = src.slice(end);
      src = before + '\n' + after;
      const removed = end - start - 1;
      for (let j = i + 1; j < indices.length; j++) {
        indices[j] -= removed;
      }
    }
    changed = true;
    summary.duplicateMistakes++;
  }

  // ── Write ─────────────────────────────────────────────────────────────────
  if (changed) {
    totalFixed++;
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, src, 'utf8');
    }
    if (DRY_RUN || process.env.VERBOSE) {
      console.log(`  ${DRY_RUN ? '[dry]' : '[fix]'} ${file}`);
    }
  }
}

console.log(`\n${DRY_RUN ? 'DRY RUN — ' : ''}Fixed ${totalFixed} files:`);
console.log(`  malformed headings:     ${summary.malformedHeading}`);
console.log(`  duplicate FAQ sections: ${summary.duplicateFaq}`);
console.log(`  duplicate Mistakes:     ${summary.duplicateMistakes}`);
