#!/usr/bin/env node
/**
 * Fix quality issues in expanded blog articles:
 * 1. Remove duplicate FAQ sections (keep the last/better one)
 * 2. Remove duplicate Mistakes sections (keep the last/better one)
 * 3. Fix "## Callout ..." H2s that should be plain text or removed
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../content/blog");

const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".mdx"));
let fixed = 0;
let totalChanges = 0;

function removeDuplicateSection(content, pattern) {
  // Найти все вхождения секции (H2 с нужным словом)
  const regex = new RegExp(`(^## [^\\n]*${pattern}[^\\n]*\\n)`, "gim");
  const matches = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    matches.push({ index: m.index, header: m[1] });
  }

  if (matches.length <= 1) return { content, removed: 0 };

  // Оставляем ПОСЛЕДНЮЮ секцию, удаляем все предыдущие вместе с контентом
  let removed = 0;
  for (let i = 0; i < matches.length - 1; i++) {
    const start = matches[i].index;
    // Конец этой секции = начало следующей H2 или конец файла
    const nextH2 = content.indexOf("\n## ", start + 4);
    const end = nextH2 > 0 ? nextH2 + 1 : content.length;

    // Убираем эту секцию
    content = content.slice(0, start) + content.slice(end);

    // Пересчитываем индексы оставшихся matches
    const delta = end - start;
    for (let j = i + 1; j < matches.length; j++) {
      matches[j].index -= delta;
    }
    removed++;
  }

  return { content, removed };
}

function fixCalloutH2s(content) {
  let changes = 0;

  // "## Callout Tip: ..." -> убираем заголовок, оставляем текст как обычный параграф
  // "## Callout Warning: ..." -> аналогично
  // "## Callout Example: ..." -> аналогично
  // "## Callout: ..." -> аналогично
  // "## Callouts and Tips" -> убираем весь раздел если он пустой/generic

  content = content.replace(
    /^## Callout(?:\s*:?\s*(?:Tip|Warning|Example|Coffee|Info)[:\s]*)(.*?)$/gim,
    (match, rest) => {
      changes++;
      const text = rest.trim();
      // Если после двоеточия есть осмысленный текст — оставляем как plain paragraph
      if (text.length > 10) return `> **Note:** ${text}`;
      return ""; // иначе удаляем строку
    }
  );

  // "## Callouts and Tips" секцию целиком если там нет реального контента
  content = content.replace(
    /^## Callouts and Tips\s*\n([\s\S]*?)(?=^## |\z)/gm,
    (match, body) => {
      const lines = body.trim().split("\n").filter(l => l.trim());
      // Если контент короткий и generic — убираем заголовок, оставляем тело
      if (lines.length < 5) {
        changes++;
        return body;
      }
      return match;
    }
  );

  // Убираем двойные пустые строки после замен
  content = content.replace(/\n{3,}/g, "\n\n");

  return { content, changes };
}

for (const file of files) {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;
  let fileChanges = 0;

  // 1. Дублирующиеся FAQ
  const faqResult = removeDuplicateSection(content, "FAQ|Frequently Asked|Common Questions");
  if (faqResult.removed > 0) {
    content = faqResult.content;
    fileChanges += faqResult.removed;
  }

  // 2. Дублирующиеся Mistakes
  const mistakesResult = removeDuplicateSection(content, "Mistakes|Pitfalls|Errors to Avoid");
  if (mistakesResult.removed > 0) {
    content = mistakesResult.content;
    fileChanges += mistakesResult.removed;
  }

  // 3. ## Callout H2s
  const calloutResult = fixCalloutH2s(content);
  if (calloutResult.changes > 0) {
    content = calloutResult.content;
    fileChanges += calloutResult.changes;
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixed++;
    totalChanges += fileChanges;
    console.log(`✅ Fixed ${file.replace('.mdx','')} (${fileChanges} fixes)`);
  }
}

console.log(`\n✨ Done: ${fixed} files fixed, ${totalChanges} total changes`);
