import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { execSync } from "child_process";

// ── Paths ────────────────────────────────────────────────────────────────────

const QUEUE_PATH   = path.join(process.cwd(), "content/queue.json");
const BLOG_DIR     = path.join(process.cwd(), "content/blog");
const INDEX_PATH   = path.join(BLOG_DIR, "INDEX.md");
const CLUSTERS_PATH = path.join(process.cwd(), "seo-research/02-keyword-clusters-expanded.md");
const PAA_PATH     = path.join(process.cwd(), "seo-research/serpapi-raw/paa-all.json");

// ── Types ────────────────────────────────────────────────────────────────────

interface QueueEntry {
  slug: string;
  title: string;
  primaryKeyword: string;
  cluster: string;
  targetWords: number;
  status: "pending" | "generated" | "published";
  generatedDate: string | null;
  addedDate: string;
  errorNote?: string;
}

interface QueueFile {
  _schema: Record<string, string>;
  queue: QueueEntry[];
}

// ── Queue helpers ─────────────────────────────────────────────────────────────

function readQueue(): QueueFile {
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8")) as QueueFile;
}

function writeQueue(data: QueueFile) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// ── SEO context helpers ───────────────────────────────────────────────────────

function getRelevantKeywords(cluster: string, primaryKeyword: string): string {
  try {
    const raw = fs.readFileSync(CLUSTERS_PATH, "utf8");
    const lines = raw.split("\n");
    // Find the cluster section and extract ~30 lines of it
    const startIdx = lines.findIndex(
      (l) => l.toLowerCase().includes(cluster.toLowerCase().slice(0, 20)) ||
             l.toLowerCase().includes(primaryKeyword.toLowerCase().slice(0, 15))
    );
    if (startIdx === -1) return "";
    return lines.slice(startIdx, startIdx + 35).join("\n");
  } catch {
    return "";
  }
}

function getRelevantPAA(primaryKeyword: string): string[] {
  try {
    const raw = JSON.parse(fs.readFileSync(PAA_PATH, "utf8")) as {
      data: Record<string, Array<{ question: string; snippet?: string }>>;
    };
    const keyword = primaryKeyword.toLowerCase();
    const questions: string[] = [];

    for (const [kw, items] of Object.entries(raw.data)) {
      if (kw.toLowerCase().includes(keyword.slice(0, 12)) || keyword.includes(kw.slice(0, 12))) {
        items.slice(0, 6).forEach((q) => questions.push(q.question));
      }
    }
    // Fallback: collect a broad set if nothing matched specifically
    if (questions.length === 0) {
      const allQ = Object.values(raw.data).flat();
      return allQ.slice(0, 8).map((q) => q.question);
    }
    return [...new Set(questions)].slice(0, 8);
  } catch {
    return [];
  }
}

function getExistingArticles(): Array<{ slug: string; title: string }> {
  try {
    const raw = fs.readFileSync(INDEX_PATH, "utf8");
    const lines = raw.split("\n");
    const headerIdx = lines.findIndex((l) => l.startsWith("| Slug"));
    if (headerIdx === -1) return [];
    return lines
      .slice(headerIdx + 2)
      .filter((l) => l.startsWith("|"))
      .map((line) => {
        const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
        return cols.length >= 2
          ? { slug: cols[0].replace(/`/g, ""), title: cols[1] }
          : null;
      })
      .filter((a): a is { slug: string; title: string } => a !== null)
      .slice(0, 18);
  } catch {
    return [];
  }
}

// ── MDX cleanup ───────────────────────────────────────────────────────────────

function stripFences(text: string): string {
  // Remove ```mdx ... ``` or ``` ... ``` wrappers the LLM sometimes adds
  return text
    .replace(/^```(?:mdx|markdown|md)?\s*\n/i, "")
    .replace(/\n```\s*$/i, "")
    .trim();
}

function ensureValidMdx(text: string): string {
  const stripped = stripFences(text);
  // Verify frontmatter exists
  if (!stripped.startsWith("---")) {
    throw new Error("Generated content does not start with YAML frontmatter (---)");
  }
  // Validate frontmatter closes
  const secondDash = stripped.indexOf("---", 3);
  if (secondDash === -1) {
    throw new Error("Generated content has unclosed YAML frontmatter");
  }
  return stripped;
}

// ── Index regeneration (inlined — avoids Turbopack spawnSync path analysis) ──

function regenerateIndex(): void {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const raw  = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      const tags = Array.isArray(data.tags)
        ? (data.tags as string[]).join(", ")
        : String(data.tags ?? "");
      return { slug, title: String(data.title ?? ""), date: String(data.date ?? ""), wordCount, tags, description: String(data.description ?? "") };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const table = `# Blog Post Index — DataLatte.pro
Generated: ${new Date().toISOString().split("T")[0]}
Total posts: ${posts.length}

| Slug | Title | Date | Words | Tags |
|---|---|---|---|---|
${posts.map((p) => `| \`${p.slug}\` | ${p.title} | ${p.date} | ${p.wordCount} | ${p.tags} |`).join("\n")}

## Full Details

${posts
  .map(
    (p) => `### ${p.title}
- **Slug**: \`${p.slug}\`
- **URL**: https://datalatte.pro/blog/${p.slug}
- **Date**: ${p.date}
- **Words**: ${p.wordCount}
- **Tags**: ${p.tags}
- **Description**: ${p.description}
`
  )
  .join("\n")}`;

  fs.writeFileSync(INDEX_PATH, table, "utf8");
}

// ── Build validation ──────────────────────────────────────────────────────────

function runBuild(): { success: boolean; output: string } {
  if (process.env.NODE_ENV === "production") {
    return { success: true, output: "build skipped in production (Vercel rebuilds on deploy)" };
  }
  try {
    const output = execSync("npm run build", {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: 120_000,
      env: { ...process.env, FORCE_COLOR: "0" },
    });
    return { success: true, output: String(output).slice(-2000) };
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string };
    const output = ((e.stdout ?? "") + (e.stderr ?? "")).slice(-2000);
    return { success: false, output };
  }
}

// ── Groq API call ─────────────────────────────────────────────────────────────

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set in environment variables");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return json.choices?.[0]?.message?.content ?? "";
}

// ── POST /api/admin/generate ──────────────────────────────────────────────────

export async function POST(): Promise<NextResponse> {
  const data = readQueue();
  const entry = data.queue.find((e) => e.status === "pending");

  if (!entry) {
    return NextResponse.json({ message: "No pending articles in queue" }, { status: 200 });
  }

  // ── Build context ────────────────────────────────────────────────────────

  const clusterKeywords = getRelevantKeywords(entry.cluster, entry.primaryKeyword);
  const paaQuestions    = getRelevantPAA(entry.primaryKeyword);
  const existingPosts   = getExistingArticles();
  const today           = new Date().toISOString().split("T")[0];

  const internalLinksContext = existingPosts
    .slice(0, 10)
    .map((p) => `- /blog/${p.slug} — ${p.title}`)
    .join("\n");

  const paaContext = paaQuestions.length
    ? paaQuestions.map((q) => `- ${q}`).join("\n")
    : "- No PAA data available for this cluster";

  // ── System prompt ────────────────────────────────────────────────────────

  const systemPrompt = `You are Nataliia, founder of DataLatte (datalatte.pro) — a freelance local marketing agency helping coffee shops, hair salons, pet groomers, and fitness studios grow with data-driven digital marketing (Google Ads, Meta Ads, local SEO, GBP, email marketing, marketing automation).

WRITING STYLE:
- Expert but conversational — like advice from a specialist friend
- Direct and practical — no filler, no corporate speak
- Use real numbers, real examples, and honest trade-offs
- British/US English spelling is fine
- Short paragraphs, punchy sentences

OUTPUT FORMAT — CRITICAL:
- Respond ONLY with the raw MDX content
- Do NOT wrap in code fences (\`\`\`mdx or \`\`\`)
- Start directly with the YAML frontmatter (---)
- Use this exact frontmatter structure:
---
title: "..."
date: "${today}"
description: "150-160 char SEO meta description with primary keyword"
author: "Nataliia"
category: "..."
tags: ["tag1", "tag2", "tag3", "tag4"]
slug: "${entry.slug}"
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
readTime: "X min read"
---

CONTENT STRUCTURE:
1. Opening paragraph (no heading) — hook the reader with a bold claim or surprising stat
2. 4-7 H2 sections covering the topic thoroughly
3. Use H3 subheadings within sections where helpful
4. Use bullet lists and numbered lists freely
5. End with an FAQ section (## Frequently Asked Questions) answering 5-7 of the PAA questions below
6. Final paragraph: natural CTA mentioning DataLatte and linking to /contact

INTERNAL LINKS — include 2-3 of these naturally in the body:
${internalLinksContext}

PAA QUESTIONS TO ANSWER IN FAQ SECTION:
${paaContext}

RELEVANT KEYWORDS FROM CLUSTER (use naturally, don't stuff):
${clusterKeywords || `Primary keyword: ${entry.primaryKeyword}`}

TARGET LENGTH: ${entry.targetWords} words (±200 words)`;

  const userPrompt = `Write a complete MDX blog post for DataLatte.

Title: ${entry.title}
Primary keyword: ${entry.primaryKeyword}
Cluster: ${entry.cluster}
Target words: ${entry.targetWords}

Remember: output ONLY the raw MDX — no code fences, start with --- frontmatter.`;

  // ── Call Groq ────────────────────────────────────────────────────────────

  let mdxContent: string;
  try {
    const raw = await callGroq(systemPrompt, userPrompt);
    mdxContent = ensureValidMdx(raw);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: `Generation failed: ${msg}` }, { status: 500 });
  }

  // ── Save MDX file ────────────────────────────────────────────────────────

  const mdxPath = path.join(BLOG_DIR, `${entry.slug}.mdx`);

  // Don't overwrite existing published content
  if (fs.existsSync(mdxPath)) {
    const existing = matter(fs.readFileSync(mdxPath, "utf8"));
    if (existing.data.date) {
      return NextResponse.json(
        { success: false, error: `File ${entry.slug}.mdx already exists. Remove it first or change the slug.` },
        { status: 409 }
      );
    }
  }

  fs.writeFileSync(mdxPath, mdxContent + "\n", "utf8");

  // ── Regenerate index ─────────────────────────────────────────────────────

  regenerateIndex();

  // ── Validate build ───────────────────────────────────────────────────────

  const build = runBuild();

  if (!build.success) {
    // Rollback
    fs.unlinkSync(mdxPath);
    const rollbackData = readQueue();
    const idx = rollbackData.queue.findIndex((e) => e.slug === entry.slug);
    if (idx !== -1) {
      rollbackData.queue[idx].status = "pending";
      rollbackData.queue[idx].errorNote = `Build failed: ${build.output.slice(-300)}`;
      writeQueue(rollbackData);
    }
    return NextResponse.json(
      { success: false, error: "Build failed after generation — MDX file rolled back", details: build.output.slice(-800) },
      { status: 422 }
    );
  }

  // ── Mark as generated ────────────────────────────────────────────────────

  const updated = readQueue();
  const idx = updated.queue.findIndex((e) => e.slug === entry.slug);
  if (idx !== -1) {
    updated.queue[idx].status = "generated";
    updated.queue[idx].generatedDate = new Date().toISOString();
    delete updated.queue[idx].errorNote;
    writeQueue(updated);
  }

  const url = `https://datalatte.pro/blog/${entry.slug}`;
  return NextResponse.json(
    { success: true, slug: entry.slug, url, wordCount: mdxContent.split(/\s+/).length },
    { status: 200 }
  );
}
