import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
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
  status: "pending" | "generating" | "generated" | "published";
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

// ── Unique image per article (slug-based seed → Picsum) ──────────────────────

function getArticleImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/1200/630`;
}

// ── Post-generation MDX sanitizer ─────────────────────────────────────────────
// Fixes common patterns the AI generates that break the MDX compiler.

function sanitizeMdx(content: string): string {
  const lines = content.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Collapse multi-line <Callout> blocks (open tag without close on same line)
    const calloutOpen = line.match(/^(<Callout[^>]*>)(.*)$/);
    if (calloutOpen && !line.includes("</Callout>")) {
      const openTag = calloutOpen[1];
      const inline = calloutOpen[2].trim();
      const collected: string[] = inline ? [inline] : [];
      i++;
      let _closed = false;
      while (i < lines.length) {
        const next = lines[i];
        if (next.includes("</Callout>")) {
          const before = next.replace("</Callout>", "").trim();
          if (before) collected.push(before);
          _closed = true;
          i++;
          break;
        }
        // Stop collecting at new section or new component
        if (/^#{1,6}\s/.test(next) || /^<[A-Z]/.test(next) || /^---/.test(next)) break;
        if (next.trim()) collected.push(next.trim());
        i++;
      }
      const body = collected.join(" ").replace(/\s+/g, " ").trim();
      out.push(`${openTag}${body}</Callout>`);
      out.push("");
      continue;
    }

    // 2. Escape bare <https://...> and <http://...> URLs
    const fixedLine = line
      .replace(/<(https?:\/\/[^\s>]+)>/g, "[$1]($1)")
      // 3. Escape <N where N is a digit (e.g. <10%, <5x)
      .replace(/<(\d)/g, "&lt;$1")
      // 4. Escape <$ patterns
      .replace(/<(\$)/g, "&lt;$1")
      // 5. Remove orphaned </Callout> with no matching open
      // (handled by tracking opens — simple: just drop unmatched ones)
      ;

    out.push(fixedLine);
    i++;
  }

  // 6. Remove orphaned </Callout> closing tags (no matching open on same line)
  const result = out.join("\n");
  const openCount = (result.match(/<Callout/g) ?? []).length;
  const closeCount = (result.match(/<\/Callout>/g) ?? []).length;
  if (closeCount > openCount) {
    // Strip the excess closing tags from the bottom up
    let excess = closeCount - openCount;
    return result.replace(/<\/Callout>/g, (match) => {
      if (excess > 0) { excess--; return ""; }
      return match;
    });
  }

  return result;
}

// ── Groq API call (with auto-retry on 429) ───────────────────────────────────

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "qwen/qwen3-32b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
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
      max_tokens: 8000,
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
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

  const articleImage = getArticleImage(entry.slug);

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
- Short paragraphs, punchy sentences

════════════════════════════════════════
OUTPUT FORMAT — MANDATORY
════════════════════════════════════════
- Output ONLY raw MDX. No code fences, no \`\`\`mdx wrapper, no preamble.
- Start immediately with the YAML frontmatter block (---).
- Copy this frontmatter exactly, filling in the blanks:

---
title: "..."
date: "${today}"
description: "..."
author: "Nataliia"
category: "..."
tags: ["tag1", "tag2", "tag3", "tag4"]
slug: "${entry.slug}"
image: "${articleImage}"
readTime: "X min read"
---

════════════════════════════════════════
MDX SYNTAX RULES — READ CAREFULLY
════════════════════════════════════════
You may use ONLY these four JSX components: <Callout>, <BarChart>, <StatRow>, <Funnel>.
Any other capitalised tag (e.g. <Example>, <Tip>, <Warning>, <Note>) will break the build. Do NOT use them.

CALLOUT — must open AND close on the same single line, always:
✅ CORRECT:   <Callout type="tip">Your insight here in one line.</Callout>
✅ CORRECT:   <Callout type="warning">Short warning sentence.</Callout>
❌ WRONG — never split across lines:
   <Callout type="tip">
   Content here
   </Callout>

Allowed type values: tip | warning | example | coffee | stat

BARCHART — all on one line:
✅ <BarChart title="Title" labels="A|B|C" values="10|20|30" unit="%" caption="Source" highlights="A"/>

STATROW — all on one line, pipe-separated, matching count in each attribute:
✅ <StatRow values="80%|60%|40%" labels="Label one|Label two|Label three" subs="Source A|Source B|Source C" trends="up|down|neutral"/>

LINKS — never put a URL in angle brackets:
❌ WRONG:  <https://example.com>
✅ CORRECT: [anchor text](https://example.com)

NUMBERS — never write < directly before a number or $ sign:
❌ WRONG:  costs <$500, results in <10 days
✅ CORRECT: costs under $500, results in under 10 days

════════════════════════════════════════
CONTENT STRUCTURE
════════════════════════════════════════
1. Opening paragraph (no heading) — hook with a bold claim or real stat
2. 4–7 ## sections covering the topic thoroughly
3. Use ### subheadings within sections where helpful
4. Use bullet lists and numbered lists freely
5. Include 2–4 Callout components naturally in the body
6. End with ## Frequently Asked Questions (5–7 questions from the PAA list below)
7. Final short paragraph: natural CTA linking to /contact

INTERNAL LINKS — weave 2-3 of these naturally into the body:
${internalLinksContext}

PAA QUESTIONS (use in FAQ section):
${paaContext}

KEYWORDS (use naturally, never stuff):
${clusterKeywords || `Primary keyword: ${entry.primaryKeyword}`}

TARGET LENGTH: ${entry.targetWords} words (±200 words)`;

  const userPrompt = `/no_think

Write a complete MDX blog post for DataLatte.

Title: ${entry.title}
Primary keyword: ${entry.primaryKeyword}
Cluster: ${entry.cluster}
Target words: ${entry.targetWords}

Output ONLY raw MDX starting with --- frontmatter. No code fences.`;

  // ── Call Groq ────────────────────────────────────────────────────────────
  let mdxContent: string;
  try {
    const raw = await callGroq(systemPrompt, userPrompt);
    const cleaned = ensureValidMdx(raw);
    mdxContent = sanitizeMdx(cleaned);
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
