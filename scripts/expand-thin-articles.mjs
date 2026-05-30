/**
 * Expand thin blog articles using Claude API
 * Targets posts under 600 words and expands them to 900-1200 words.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/expand-thin-articles.mjs
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/expand-thin-articles.mjs --limit 10   # do 10 first
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/expand-thin-articles.mjs --dry-run     # preview only
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "content/blog");
const MIN_WORDS = 600;
const TARGET_WORDS = 1000;

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("❌ ANTHROPIC_API_KEY not set");
  console.error("   Usage: ANTHROPIC_API_KEY=sk-ant-... node scripts/expand-thin-articles.mjs");
  process.exit(1);
}

const client = new Anthropic({ apiKey });

function countWords(text) {
  const clean = text.replace(/<[^>]+>/g, "").replace(/^---.*?---/s, "").trim();
  return clean.split(/\s+/).filter(Boolean).length;
}

function getThinPosts(limit) {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const thin = [];

  for (const file of files) {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const words = countWords(content);

    if (words < MIN_WORDS) {
      thin.push({ file, fullPath, raw, frontmatter: data, content, words });
    }
  }

  thin.sort((a, b) => a.words - b.words); // shortest first
  return limit ? thin.slice(0, limit) : thin;
}

async function expandArticle(frontmatter, content, currentWords) {
  const prompt = `You are expanding a blog article for DataLatte.pro — a local marketing agency targeting small businesses (coffee shops, hair salons, pet groomers, fitness studios).

ARTICLE FRONTMATTER:
Title: ${frontmatter.title}
Category: ${frontmatter.category || "Marketing"}
Description: ${frontmatter.description || ""}

CURRENT CONTENT (${currentWords} words — needs expanding to ~${TARGET_WORDS} words):
${content}

TASK:
Expand this article to approximately ${TARGET_WORDS} words. Keep the same MDX format and any existing components (Callout, BarChart, StatRow, etc.).

Rules:
- Keep all existing content — only ADD new sections, don't replace
- Add 2-3 new H2 sections with practical advice, examples, or data
- Use concrete numbers, real examples, and actionable tips
- Tone: professional but warm, data-oriented, coffee metaphors where natural
- Target audience: local small business owners in US/UK/AU/CA
- End with a strong CTA paragraph mentioning DataLatte

Return ONLY the expanded MDX body content (no frontmatter, no code fences). Start directly with the article text.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text.trim();
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : null;

  console.log("📝 Thin Article Expander — DataLatte.pro");
  console.log(`   Model: claude-sonnet-4-5`);
  console.log(`   Target: ${MIN_WORDS}+ words per article`);
  if (isDryRun) console.log("   Mode: DRY RUN (no files written)");
  console.log();

  const posts = getThinPosts(limit);
  console.log(`Found ${posts.length} thin articles (< ${MIN_WORDS} words)\n`);

  if (posts.length === 0) {
    console.log("✅ No thin articles found!");
    return;
  }

  let expanded = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const progress = `[${i + 1}/${posts.length}]`;

    process.stdout.write(`${progress} ${post.file} (${post.words}w) → expanding... `);

    if (isDryRun) {
      console.log("(dry run, skipped)");
      continue;
    }

    try {
      const expandedContent = await expandArticle(post.frontmatter, post.content, post.words);
      const newWords = countWords(expandedContent);

      // Rebuild the full MDX file with original frontmatter
      const updatedFile = matter.stringify(expandedContent, {
        ...post.frontmatter,
        lastModified: new Date().toISOString().split("T")[0],
      });

      fs.writeFileSync(post.fullPath, updatedFile, "utf8");
      console.log(`✅ ${newWords}w`);
      expanded++;

      // Rate limit: 1 request per 2 seconds
      if (i < posts.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Expanded: ${expanded}`);
  console.log(`   ❌ Failed:   ${failed}`);
  console.log(`   ⏭️  Skipped:  ${posts.length - expanded - failed}`);

  if (expanded > 0) {
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. git add content/blog/ && git commit -m "expand thin articles [vercel skip]"`);
    console.log(`   2. git push`);
    console.log(`   3. node scripts/submit-indexnow.mjs --new ${expanded}`);
  }
}

main().catch(console.error);
