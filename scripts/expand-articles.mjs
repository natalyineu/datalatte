import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "../content/blog");
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "deepseek/deepseek-v4-flash";
const TARGET_WORDS = 2200;
const TEST_SLUGS = [
  "how-to-beat-starbucks-on-google-maps",
];

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: "", body: content };
  return { frontmatter: match[1], body: match[2].trim() };
}

async function expandArticle(slug) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const wordCount = countWords(body);

  if (wordCount >= TARGET_WORDS) {
    console.log(`⏭  ${slug} — уже ${wordCount} слов, пропускаем`);
    return;
  }

  console.log(`✏️  ${slug} — ${wordCount} слов → расширяем до ${TARGET_WORDS}+...`);
  console.log(`   📡 Отправляем запрос к ${MODEL}...`);

  const prompt = `You are a professional content writer specializing in local business marketing.

Expand the following blog article to ${TARGET_WORDS}-2500 words. Keep the same tone, style, and structure. Add:
- More detailed explanations with real examples
- A practical step-by-step section if not present
- A FAQ section (5 questions) at the end
- More specific tips and actionable advice

IMPORTANT:
- Keep all existing MDX components intact (only these are valid: <Callout>, <StatRow>, <BarChart>, <Funnel>, <DonutChart>, <LineChart>, <CompareBar>)
- Do NOT invent or use any other custom components (no FAQSection, no CustomTable, etc.)
- Write the FAQ section as plain markdown: ## Frequently Asked Questions, then ### Q: ... followed by the answer
- Do not change the opening paragraph
- Output ONLY the expanded article body, no frontmatter

---
${body}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://datalatte.pro",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8000,
    }),
  });

  console.log(`   ⏳ Ответ получен (${res.status}), обрабатываем...`);

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ API error for ${slug}:`, err);
    return;
  }

  const data = await res.json();
  const msg = data.choices?.[0]?.message;
  const expanded = (msg?.content || msg?.reasoning)?.trim();

  if (!expanded) {
    console.error(`❌ Пустой ответ для ${slug}`);
    return;
  }

  const newWordCount = countWords(expanded);
  console.log(`✅ ${slug} — ${wordCount} → ${newWordCount} слов`);

  // Save backup
  fs.writeFileSync(`${filePath}.bak`, raw);

  // Write expanded
  const newContent = `---\n${frontmatter}\n---\n\n${expanded}\n`;
  fs.writeFileSync(filePath, newContent);
}

async function main() {
  if (!API_KEY) {
    console.error("❌ OPENROUTER_API_KEY не найден в .env.local");
    process.exit(1);
  }

  console.log(`🚀 Модель: ${MODEL}`);
  console.log(`📝 Тест на ${TEST_SLUGS.length} статьях\n`);

  for (const slug of TEST_SLUGS) {
    await expandArticle(slug);
    await new Promise(r => setTimeout(r, 1000)); // пауза между запросами
  }

  console.log("\n🎉 Готово! Оригиналы сохранены как .bak файлы");
}

main();
