#!/usr/bin/env node
/**
 * Article quality audit script
 * Scores every MDX article across 6 dimensions, then groups by tier.
 *
 * Usage:  node scripts/audit-articles.mjs [--limit N] [--json]
 *
 * Output: audit-report.json  +  human-readable summary to stdout
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../content/blog');
const OUT_FILE    = path.join(__dirname, '../data/audit-report.json');

const args = process.argv.slice(2);
const LIMIT  = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i+1]) : Infinity; })();
const JSON_ONLY = args.includes('--json');

// ─── helpers ────────────────────────────────────────────────────────────────

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return fm;
}

function stripMdx(src) {
  return src
    .replace(/^---[\s\S]*?---/, '')          // frontmatter
    .replace(/<[^>]+\/>/g, ' ')              // self-closing JSX
    .replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, ' ') // JSX blocks
    .replace(/```[\s\S]*?```/g, ' ')         // code blocks
    .replace(/`[^`]+`/g, ' ')               // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/[#*_|>~]/g, ' ')              // markdown syntax
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function countH2(src) {
  return (src.match(/^## /gm) || []).length;
}

function countH3(src) {
  return (src.match(/^### /gm) || []).length;
}

// Internal links: [text](/something)
function countInternalLinks(src) {
  return (src.match(/\]\(\/[^)]+\)/g) || []).length;
}

// External links: [text](http...)
function countExternalLinks(src) {
  return (src.match(/\]\(https?:\/\/[^)]+\)/g) || []).length;
}

// MDX components used
function usedComponents(src) {
  return [...new Set((src.match(/<([A-Z][A-Za-z]+)/g) || []).map(s => s.slice(1)))];
}

// Detect structural red flags
function detectIssues(src, text) {
  const issues = [];

  // Duplicate FAQ sections
  const faqMatches = (src.match(/## .*(?:FAQ|Frequently Asked)/gi) || []);
  if (faqMatches.length > 1) issues.push(`duplicate-faq(×${faqMatches.length})`);

  // Duplicate "Common Mistakes" sections
  const mistakesMatches = (src.match(/## .*Common Mistakes/gi) || []);
  if (mistakesMatches.length > 1) issues.push(`duplicate-mistakes(×${mistakesMatches.length})`);

  // Doubled ## in heading (e.g. "## Common ## FAQ")
  if (/## \w+ ##/.test(src)) issues.push('malformed-heading');

  // Suspicious round AI stats: "X% of Y" where X is weirdly specific
  const statMatches = text.match(/\b(87|78|92|94|96|73|67|63|89|91)\s*%/g) || [];
  if (statMatches.length >= 3) issues.push(`suspicious-stats(${statMatches.length})`);

  // "without a source" fabricated dollar amounts like "$12,500 potential"
  const bigFabricatedNums = (text.match(/\$\d{1,3},\d{3}\+?\s+(?:potential|waste|loss)/gi) || []);
  if (bigFabricatedNums.length > 0) issues.push(`fabricated-dollar-claims(×${bigFabricatedNums.length})`);

  // Generic AI filler phrases
  const fillerPhrases = [
    /let'?s (?:dive|break|cut through|explore)/i,
    /(?:game.changer|skyrocket|supercharge|revolutionize)/i,
    /\bin this (?:comprehensive|ultimate|complete) guide\b/i,
    /data-driven (?:approach|strategy|decisions?)/i,
  ];
  const fillerHits = fillerPhrases.filter(r => r.test(text)).length;
  if (fillerHits >= 2) issues.push(`filler-phrases(${fillerHits})`);

  // Unclosed JSX-style tags that could break builds
  const openTags   = (src.match(/<[A-Z][A-Za-z]+[^/]>/g) || []).length;
  const closeTags  = (src.match(/<\/[A-Z][A-Za-z]+>/g) || []).length;
  const selfClosed = (src.match(/<[A-Z][A-Za-z]+[^>]*\/>/g) || []).length;
  if (openTags !== closeTags + selfClosed && openTags > 0) {
    issues.push(`unclosed-jsx(open=${openTags},close=${closeTags})`);
  }

  // Thin intro (first paragraph < 40 words)
  const body = src.replace(/^---[\s\S]*?---/, '').trim();
  const firstPara = body.split(/\n\n/)[0].replace(/<[^>]+>/g, '').trim();
  if (countWords(firstPara) < 40) issues.push('thin-intro');

  return issues;
}

// ─── scoring ────────────────────────────────────────────────────────────────
// Each dimension returns 0–10. Total = weighted average.

function scoreWordCount(wc) {
  if (wc >= 3500) return 10;
  if (wc >= 2500) return 8;
  if (wc >= 1800) return 6;
  if (wc >= 1200) return 4;
  if (wc >= 700)  return 2;
  return 1;
}

function scoreStructure(h2, h3, wc) {
  // Good: 1 H2 per ~500 words, some H3s for hierarchy
  const expectedH2 = Math.max(3, Math.floor(wc / 500));
  const h2ratio = Math.min(h2 / expectedH2, 2); // cap at 2x
  let s = h2ratio * 5; // up to 5
  s += Math.min(h3 * 0.3, 3); // H3s add up to 3
  s += h2 >= 3 ? 2 : 0;       // bonus for at least 3 H2s
  return Math.min(Math.round(s), 10);
}

function scoreInternalLinking(links, wc) {
  // 1 internal link per 500 words is good
  const expected = Math.max(2, Math.floor(wc / 500));
  if (links >= expected * 1.5) return 10;
  if (links >= expected)       return 8;
  if (links >= expected * 0.5) return 5;
  if (links >= 1)              return 3;
  return 0;
}

function scoreComponents(components, wc) {
  // Rich content components add value
  const richComponents = ['StatRow','BarChart','DonutChart','Funnel','StepPlan','Timeline','CompareTable','PricingCard','FAQSection','Callout'];
  const used = components.filter(c => richComponents.includes(c)).length;
  if (used >= 5) return 10;
  if (used >= 3) return 8;
  if (used >= 2) return 6;
  if (used >= 1) return 4;
  return 1;
}

function scoreIssues(issues) {
  const penalty = issues.reduce((acc, issue) => {
    if (issue.startsWith('duplicate-faq'))       return acc + 3;
    if (issue.startsWith('duplicate-mistakes'))  return acc + 2;
    if (issue === 'malformed-heading')            return acc + 2;
    if (issue.startsWith('suspicious-stats'))    return acc + 2;
    if (issue.startsWith('fabricated-dollar'))   return acc + 2;
    if (issue.startsWith('filler-phrases'))      return acc + 1;
    if (issue.startsWith('unclosed-jsx'))        return acc + 4;
    if (issue === 'thin-intro')                  return acc + 1;
    return acc + 1;
  }, 0);
  return Math.max(0, 10 - penalty);
}

function scoreReadability(text, wc) {
  // Avg sentence length (shorter = more readable)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length === 0) return 5;
  const avgLen = wc / sentences.length;
  let s = 10;
  if (avgLen > 30) s -= 3;
  else if (avgLen > 22) s -= 1;
  // Penalize if too many long words (>3 syllables approximation: >8 chars)
  const longWords = text.split(/\s+/).filter(w => w.length > 8).length;
  const longWordRatio = longWords / wc;
  if (longWordRatio > 0.2) s -= 2;
  return Math.max(0, Math.min(s, 10));
}

// ─── main ───────────────────────────────────────────────────────────────────

const files = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.mdx'))
  .slice(0, LIMIT);

if (!JSON_ONLY) console.log(`\nAuditing ${files.length} articles...\n`);

const results = [];

for (const file of files) {
  const src  = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const fm   = parseFrontmatter(src);
  const text = stripMdx(src);
  const wc   = countWords(text);
  const h2   = countH2(src);
  const h3   = countH3(src);
  const internalLinks  = countInternalLinks(src);
  const externalLinks  = countExternalLinks(src);
  const components     = usedComponents(src);
  const issues         = detectIssues(src, text);

  const scores = {
    wordCount:       scoreWordCount(wc),
    structure:       scoreStructure(h2, h3, wc),
    internalLinking: scoreInternalLinking(internalLinks, wc),
    richContent:     scoreComponents(components, wc),
    quality:         scoreIssues(issues),
    readability:     scoreReadability(text, wc),
  };

  // Weighted total
  const weights = { wordCount: 0.20, structure: 0.15, internalLinking: 0.20, richContent: 0.15, quality: 0.20, readability: 0.10 };
  const total = Object.entries(scores).reduce((acc, [k, v]) => acc + v * weights[k], 0);
  const totalRounded = Math.round(total * 10) / 10;

  results.push({
    slug: file.replace('.mdx', ''),
    title: fm.title || file.replace('.mdx', ''),
    category: fm.category || 'uncategorized',
    date: fm.date || '',
    wordCount: wc,
    h2, h3,
    internalLinks,
    externalLinks,
    components,
    issues,
    scores,
    total: totalRounded,
  });
}

// Sort by score descending
results.sort((a, b) => b.total - a.total);

// ─── group into tiers ────────────────────────────────────────────────────────

function assignTier(total) {
  if (total >= 8)   return 'A — Отличные';
  if (total >= 6.5) return 'B — Хорошие';
  if (total >= 5)   return 'C — Нужна доработка';
  return 'D — Критически слабые';
}

for (const r of results) {
  r.tier = assignTier(r.total);
}

const tiers = {};
for (const r of results) {
  if (!tiers[r.tier]) tiers[r.tier] = [];
  tiers[r.tier].push(r);
}

// ─── save JSON ───────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), total: results.length, tiers: Object.keys(tiers).map(t => ({ tier: t, count: tiers[t].length })), articles: results }, null, 2));

if (!JSON_ONLY) {
  // ─── human-readable output ───────────────────────────────────────────────

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  AUDIT REPORT — DataLatte blog articles');
  console.log(`  ${results.length} articles | ${new Date().toLocaleDateString('ru-RU')}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const tierOrder = ['A — Отличные', 'B — Хорошие', 'C — Нужна доработка', 'D — Критически слабые'];
  for (const tierName of tierOrder) {
    const group = tiers[tierName];
    if (!group) continue;

    const icon = tierName.startsWith('A') ? '🟢' : tierName.startsWith('B') ? '🔵' : tierName.startsWith('C') ? '🟡' : '🔴';
    console.log(`${icon} ${tierName.toUpperCase()} (${group.length} статей)`);
    console.log('─'.repeat(70));
    console.log(`  ${'Slug'.padEnd(52)} ${'Слов'.padStart(5)} ${'WC'.padStart(3)} ${'St'.padStart(3)} ${'IL'.padStart(3)} ${'RC'.padStart(3)} ${'Q'.padStart(3)} ${'Re'.padStart(3)} ${'Итог'.padStart(5)}`);
    console.log('─'.repeat(70));

    for (const r of group.slice(0, 20)) { // show up to 20 per tier
      const s = r.scores;
      const slug = r.slug.length > 51 ? r.slug.slice(0, 48) + '...' : r.slug;
      console.log(
        `  ${slug.padEnd(52)} ${String(r.wordCount).padStart(5)} ${String(s.wordCount).padStart(3)} ${String(s.structure).padStart(3)} ${String(s.internalLinking).padStart(3)} ${String(s.richContent).padStart(3)} ${String(s.quality).padStart(3)} ${String(s.readability).padStart(3)} ${String(r.total).padStart(5)}`
      );
      if (r.issues.length > 0) {
        console.log(`    ⚠️  ${r.issues.join(', ')}`);
      }
    }
    if (group.length > 20) {
      console.log(`  ... и ещё ${group.length - 20} статей`);
    }
    console.log();
  }

  // Summary stats
  console.log('─'.repeat(70));
  console.log('СВОДКА:');
  for (const t of tierOrder) {
    const g = tiers[t];
    if (!g) continue;
    const avg = (g.reduce((a, r) => a + r.total, 0) / g.length).toFixed(1);
    const avgWC = Math.round(g.reduce((a, r) => a + r.wordCount, 0) / g.length);
    const withIssues = g.filter(r => r.issues.length > 0).length;
    console.log(`  ${t}: ${g.length} статей, avg score ${avg}, avg слов ${avgWC}, с проблемами ${withIssues}`);
  }

  // Top issues across all articles
  const allIssues = {};
  for (const r of results) {
    for (const iss of r.issues) {
      const key = iss.replace(/\(.*\)/, '');
      allIssues[key] = (allIssues[key] || 0) + 1;
    }
  }
  const topIssues = Object.entries(allIssues).sort((a, b) => b[1] - a[1]);
  if (topIssues.length > 0) {
    console.log('\nТОП ПРОБЛЕМ:');
    for (const [iss, cnt] of topIssues.slice(0, 10)) {
      const bar = '█'.repeat(Math.min(cnt, 40));
      console.log(`  ${iss.padEnd(30)} ${String(cnt).padStart(4)} статей  ${bar}`);
    }
  }

  // Columns legend
  console.log('\nКОЛОНКИ: WC=кол-во слов  St=структура  IL=перелинковка  RC=rich-контент  Q=качество  Re=читаемость');
  console.log(`\nРезультаты сохранены: data/audit-report.json\n`);
}
