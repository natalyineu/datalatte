/**
 * Cleanup expanded articles:
 * 1. Remove duplicate FAQ sections (keep only the last one)
 * 2. Fix broken CTA links → [Book a free consultation](/contact)
 * 3. Remove fake URLs like DataLatte.pro/audit
 *
 * Usage:
 *   node scripts/cleanup-articles.mjs              # fix all articles
 *   node scripts/cleanup-articles.mjs --dry-run    # preview only
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../content/blog");

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");

function fixArticle(content) {
  let fixed = content;
  let changes = [];

  // 1a. Remove duplicate FAQ sections — keep only the LAST one
  const faqPattern = /\n## Frequently Asked Questions\n[\s\S]*?(?=\n## |\n---|\n\*\*Q:|$)/gi;
  const faqMatches = [...fixed.matchAll(faqPattern)];
  if (faqMatches.length > 1) {
    let count = 0;
    fixed = fixed.replace(faqPattern, (match) => {
      count++;
      if (count < faqMatches.length) {
        changes.push(`removed duplicate FAQ #${count}`);
        return "\n";
      }
      return match;
    });
  }

  // 1b. Remove duplicate "Common Mistakes" sections — keep only the LAST one
  const mistakesPattern = /\n## Common Mistakes[^\n]*\n[\s\S]*?(?=\n## (?!###)|\n---\n|$)/gi;
  const mistakesMatches = [...fixed.matchAll(mistakesPattern)];
  if (mistakesMatches.length > 1) {
    let count = 0;
    fixed = fixed.replace(mistakesPattern, (match) => {
      count++;
      if (count < mistakesMatches.length) {
        changes.push(`removed duplicate Common Mistakes #${count}`);
        return "\n";
      }
      return match;
    });
  }

  // 1c. Remove duplicate CTA "Book a free consultation" — keep only the last occurrence
  const ctaCount = (fixed.match(/Book a free consultation/gi) || []).length;
  if (ctaCount > 2) {
    // Keep only the last paragraph containing the CTA
    const ctaParaPattern = /\n[^\n]*Book a free consultation[^\n]*\n/gi;
    const ctaMatches = [...fixed.matchAll(ctaParaPattern)];
    let ctaIdx = 0;
    fixed = fixed.replace(ctaParaPattern, (match) => {
      ctaIdx++;
      if (ctaIdx < ctaMatches.length) {
        changes.push(`removed duplicate CTA #${ctaIdx}`);
        return "\n";
      }
      return match;
    });
  }

  // 2. Fix broken audit links & bare text CTA patterns
  const brokenPatterns = [
    // [Book your free audit at DataLatte.pro/audit]  — bare text in brackets
    /\[Book your free audit at DataLatte\.pro\/audit\]/gi,
    // [Book a free audit at DataLatte.pro/contact]
    /\[Book a free audit at DataLatte\.pro\/[^\]]*\]/gi,
    // (https://datalatte.pro/audit) or similar fake pages
    /\(https?:\/\/(?:www\.)?datalatte\.pro\/audit[^\)]*\)/gi,
    // DataLatte.pro/audit bare mention
    /DataLatte\.pro\/audit/gi,
  ];

  for (const pattern of brokenPatterns) {
    if (pattern.test(fixed)) {
      changes.push("fixed broken audit link");
    }
    fixed = fixed.replace(pattern, "[Book a free consultation](/contact)");
  }

  // 3. Fix duplicate [Book a free consultation](/contact) on same line
  fixed = fixed.replace(
    /(\[Book a free consultation\]\(\/contact\)[\s,]*){2,}/gi,
    "[Book a free consultation](/contact)"
  );

  // 4. Fix any remaining raw DataLatte.pro/audit text (not in markdown link)
  fixed = fixed.replace(
    /(?<!\()(https?:\/\/(?:www\.)?datalatte\.pro\/audit)/gi,
    "https://datalatte.pro/free-audit"
  );

  return { fixed, changes };
}

function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".mdx")).sort();
  let totalFixed = 0;
  let totalClean = 0;

  console.log(`🧹 Article Cleanup — DataLatte.pro`);
  console.log(`   Files: ${files.length}`);
  if (isDryRun) console.log(`   Mode: DRY RUN\n`);
  else console.log();

  for (const file of files) {
    const fullPath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(fullPath, "utf8");
    const { fixed, changes } = fixArticle(content);

    if (changes.length > 0) {
      console.log(`✏️  ${file.replace(".mdx", "")}`);
      for (const c of changes) console.log(`     → ${c}`);
      if (!isDryRun) {
        fs.writeFileSync(fullPath, fixed);
      }
      totalFixed++;
    } else {
      totalClean++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✏️  Fixed:  ${totalFixed}`);
  console.log(`   ✅ Clean:  ${totalClean}`);

  if (isDryRun && totalFixed > 0) {
    console.log(`\nRun without --dry-run to apply fixes.`);
  }
}

main();
