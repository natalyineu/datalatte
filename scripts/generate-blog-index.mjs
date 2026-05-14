import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../content/blog");
const outputPath = path.join(contentDir, "INDEX.md");

// Simple frontmatter parser (avoid gray-matter ESM issues in scripts)
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, content: raw };
  const data = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      let val = rest.join(":").trim().replace(/^"(.*)"$/, "$1");
      if (val.startsWith("[")) {
        val = val.slice(1,-1).split(",").map(s => s.trim().replace(/^"(.*)"$/, "$1"));
      }
      data[key.trim()] = val;
    }
  });
  const content = raw.slice(match[0].length).trim();
  return { data, content };
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".mdx"));

const posts = files.map(file => {
  const slug = file.replace(".mdx", "");
  const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title || "",
    date: data.date || "",
    wordCount: countWords(content),
    url: `https://datalatte.pro/blog/${slug}`,
    description: data.description || "",
    tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

const table = `# Blog Post Index — DataLatte.pro
Generated: ${new Date().toISOString().split("T")[0]}
Total posts: ${posts.length}

| Slug | Title | Date | Words | Tags |
|---|---|---|---|---|
${posts.map(p => `| \`${p.slug}\` | ${p.title} | ${p.date} | ${p.wordCount} | ${p.tags} |`).join("\n")}

## Full Details

${posts.map(p => `### ${p.title}
- **Slug**: \`${p.slug}\`
- **URL**: ${p.url}
- **Date**: ${p.date}
- **Words**: ${p.wordCount}
- **Tags**: ${p.tags}
- **Description**: ${p.description}
`).join("\n")}`;

fs.writeFileSync(outputPath, table, "utf8");
console.log(`Generated INDEX.md with ${posts.length} posts.`);
