import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Extend timeout to 60s (requires Vercel Pro) — runs fine locally with no limit
export const maxDuration = 60;

// ── Paths (read-only on Vercel — writes go via GitHub API) ───────────────────

const QUEUE_PATH    = path.join(process.cwd(), "content/queue.json");
const BLOG_DIR      = path.join(process.cwd(), "content/blog");
const INDEX_PATH    = path.join(BLOG_DIR, "INDEX.md");
const CLUSTERS_PATH = path.join(process.cwd(), "seo-research/02-keyword-clusters-expanded.md");
const PAA_PATH      = path.join(process.cwd(), "seo-research/serpapi-raw/paa-all.json");

const GH_OWNER = "natalyineu";
const GH_REPO  = "datalatte";

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

// ── GitHub Contents API helpers ───────────────────────────────────────────────

interface GHFile { sha: string; content: string; }

async function ghGet(filePath: string, token: string): Promise<GHFile | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filePath}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
  );
  if (!res.ok) return null;
  return res.json() as Promise<GHFile>;
}

async function ghPut(
  filePath: string,
  content: string,
  message: string,
  sha: string | undefined,
  token: string
): Promise<{ ok: boolean; status: number }> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: "main",
  };
  if (sha) body.sha = sha;
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return { ok: res.ok, status: res.status };
}

// ── Queue helpers — read from GitHub API for freshness, fallback to disk ─────

async function readQueue(token?: string): Promise<{ data: QueueFile; sha?: string }> {
  if (token) {
    const file = await ghGet("content/queue.json", token);
    if (file) {
      const content = Buffer.from(file.content, "base64").toString("utf8");
      return { data: JSON.parse(content) as QueueFile, sha: file.sha };
    }
  }
  // Fallback: read from deployed filesystem (may be slightly stale)
  return { data: JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8")) as QueueFile };
}

// ── SEO context helpers ───────────────────────────────────────────────────────

function getRelevantKeywords(cluster: string, primaryKeyword: string): string {
  try {
    const raw = fs.readFileSync(CLUSTERS_PATH, "utf8");
    const lines = raw.split("\n");
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

function sanitizeUnicode(text: string): string {
  return text
    .replace(/‑/g, '-').replace(/‐/g, '-').replace(/‒/g, '-')
    .replace(/–/g, '-').replace(/—/g, ' - ')
    .replace(/'/g, "'").replace(/'/g, "'")
    .replace(/"/g, '"').replace(/"/g, '"')
    .replace(/ /g, ' ')
    .replace(/<($d)/g, '&lt;$1')
    .replace(/<(d)/g, '&lt;$1')
    .replace(/<(%)/g, '&lt;$1');
}

function stripFences(text: string): string {
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  cleaned = cleaned
    .replace(/^```(?:mdx|markdown|md)?\s*\n/i, "")
    .replace(/\n```\s*$/i, "")
    .trim();
  return sanitizeUnicode(cleaned);
}

function ensureValidMdx(text: string): string {
  const stripped = stripFences(text);
  if (stripped.startsWith("---")) {
    const secondDash = stripped.indexOf("---", 3);
    if (secondDash === -1) throw new Error("Generated content has unclosed YAML frontmatter");
    return stripped;
  }
  const fmStart = stripped.indexOf("\n---");
  if (fmStart !== -1) {
    const sliced = stripped.slice(fmStart + 1).trim();
    if (sliced.indexOf("---", 3) !== -1) return sliced;
  }
  const anyFm = stripped.indexOf("---");
  if (anyFm !== -1) {
    const sliced = stripped.slice(anyFm).trim();
    if (sliced.indexOf("---", 3) !== -1) return sliced;
  }
  throw new Error("Generated content does not contain valid YAML frontmatter (---)");
}

// ── Index regeneration (returns string, no disk write) ───────────────────────

function buildIndex(extraPost?: { slug: string; title: string; date: string; wordCount: number; tags: string; description: string }): string {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const raw  = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      const tags = Array.isArray(data.tags) ? (data.tags as string[]).join(", ") : String(data.tags ?? "");
      return { slug, title: String(data.title ?? ""), date: String(data.date ?? ""), wordCount, tags, description: String(data.description ?? "") };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Prepend the new article (not yet on disk) if provided
  if (extraPost && !posts.find((p) => p.slug === extraPost.slug)) {
    posts.unshift(extraPost);
  }

  return `# Blog Post Index — DataLatte.pro
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
}

// ── Groq API call (with auto-retry on 429) ───────────────────────────────────

const GROQ_MODELS = [
  "qwen/qwen3-32b",
  "openai/gpt-oss-120b",
  "llama-3.1-8b-instant",
];

async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  modelIndex = 0,
  retries = 3
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set in environment variables");

  const model = GROQ_MODELS[modelIndex] ?? GROQ_MODELS[0];
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429 && retries > 0) {
      const match = errText.match(/try again in ([\d.]+)s/i);
      const waitMs = match ? Math.ceil(parseFloat(match[1]) * 1000) + 2000 : 20000;
      await new Promise((r) => setTimeout(r, waitMs));
      const nextModel = retries === 1 ? modelIndex + 1 : modelIndex;
      return callGroq(systemPrompt, userPrompt, nextModel, retries - 1);
    }
    throw new Error(`Groq API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const json = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return json.choices?.[0]?.message?.content ?? "";
}

// ── POST /api/admin/generate ──────────────────────────────────────────────────

export async function POST(): Promise<NextResponse> {
  const ghToken = process.env.GH_TOKEN;

  // ── Read queue (from GitHub API if token set; else fall back to disk) ────
  const { data, sha: queueSha } = await readQueue(ghToken);
  const entry = data.queue.find((e) => e.status === "pending");

  if (!entry) {
    return NextResponse.json({ message: "No pending articles in queue" }, { status: 200 });
  }

  // ── Build context ────────────────────────────────────────────────────────
  const clusterKeywords  = getRelevantKeywords(entry.cluster, entry.primaryKeyword);
  const paaQuestions     = getRelevantPAA(entry.primaryKeyword);
  const existingPosts    = getExistingArticles();
  const today            = new Date().toISOString().split("T")[0];

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

  const userPrompt = `/no_think

Write a complete MDX blog post for DataLatte.

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

  // ── Parse frontmatter to get metadata for the index ──────────────────────
  const { data: fm, content: mdxBody } = matter(mdxContent);
  const newWordCount = mdxBody.trim().split(/\s+/).filter(Boolean).length;
  const newTags = Array.isArray(fm.tags) ? (fm.tags as string[]).join(", ") : String(fm.tags ?? "");

  // ── Check if file already exists on disk (stale deploy read) ─────────────
  const mdxPath = path.join(BLOG_DIR, `${entry.slug}.mdx`);
  if (fs.existsSync(mdxPath)) {
    const existing = matter(fs.readFileSync(mdxPath, "utf8"));
    if (existing.data.date) {
      // Mark as generated in queue and skip
      const idx = data.queue.findIndex((e) => e.slug === entry.slug);
      if (idx !== -1 && ghToken && queueSha) {
        data.queue[idx].status = "generated";
        data.queue[idx].generatedDate = data.queue[idx].generatedDate ?? new Date().toISOString();
        delete data.queue[idx].errorNote;
        await ghPut(
          "content/queue.json",
          JSON.stringify(data, null, 2) + "\n",
          `Mark ${entry.slug} as generated (already exists)`,
          queueSha,
          ghToken
        );
      }
      const wordCount = existing.content.trim().split(/\s+/).filter(Boolean).length;
      return NextResponse.json(
        { success: true, slug: entry.slug, url: `https://datalatte.pro/blog/${entry.slug}`, wordCount, gitNote: "skipped — file already exists" },
        { status: 200 }
      );
    }
  }

  // ── Push files via GitHub API (or fall back to local fs write) ───────────
  let gitNote = "";

  if (ghToken) {
    // 1. Push new MDX file
    const mdxResult = await ghPut(
      `content/blog/${entry.slug}.mdx`,
      mdxContent + "\n",
      `Add article: ${entry.title}\n\nAuto-generated (~${newWordCount} words)\nCluster: ${entry.cluster}`,
      undefined, // new file — no sha needed
      ghToken
    );

    if (!mdxResult.ok) {
      return NextResponse.json(
        { success: false, error: `GitHub API failed to create MDX file (status ${mdxResult.status})` },
        { status: 500 }
      );
    }

    // 2. Update queue.json
    const idx = data.queue.findIndex((e) => e.slug === entry.slug);
    if (idx !== -1) {
      data.queue[idx].status = "generated";
      data.queue[idx].generatedDate = new Date().toISOString();
      delete data.queue[idx].errorNote;
    }

    if (queueSha) {
      await ghPut(
        "content/queue.json",
        JSON.stringify(data, null, 2) + "\n",
        `Update queue: mark ${entry.slug} as generated`,
        queueSha,
        ghToken
      );
    }

    // 3. Update INDEX.md
    const indexFile = await ghGet("content/blog/INDEX.md", ghToken);
    const newIndexContent = buildIndex({
      slug: entry.slug,
      title: String(fm.title ?? entry.title),
      date: today,
      wordCount: newWordCount,
      tags: newTags,
      description: String(fm.description ?? ""),
    });
    await ghPut(
      "content/blog/INDEX.md",
      newIndexContent,
      `Update INDEX.md: add ${entry.slug}`,
      indexFile?.sha,
      ghToken
    );

    gitNote = "pushed via GitHub API";
  } else {
    // Local development fallback: write to disk directly
    try {
      fs.writeFileSync(mdxPath, mdxContent + "\n", "utf8");

      const idx = data.queue.findIndex((e) => e.slug === entry.slug);
      if (idx !== -1) {
        data.queue[idx].status = "generated";
        data.queue[idx].generatedDate = new Date().toISOString();
        delete data.queue[idx].errorNote;
        fs.writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
      }

      const newIndexContent = buildIndex({
        slug: entry.slug,
        title: String(fm.title ?? entry.title),
        date: today,
        wordCount: newWordCount,
        tags: newTags,
        description: String(fm.description ?? ""),
      });
      fs.writeFileSync(INDEX_PATH, newIndexContent, "utf8");

      gitNote = "saved locally (no GH_TOKEN — run git push manually)";
    } catch (fsErr) {
      const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
      gitNote = `local write failed: ${msg.slice(0, 120)}`;
    }
  }

  const url = `https://datalatte.pro/blog/${entry.slug}`;
  return NextResponse.json(
    { success: true, slug: entry.slug, url, wordCount: newWordCount, gitNote },
    { status: 200 }
  );
}
