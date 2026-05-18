#!/usr/bin/env node
/**
 * Standalone article generator for GitHub Actions
 * Bypasses serverless timeout limits by running directly in workflow
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GROQ_KEY = process.env.GROQ_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO = 'natalyineu/datalatte';

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: {
        'User-Agent': 'DataLatte',
        ...options.headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'qwen/qwen3-32b',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'openai/gpt-oss-120b',
  'llama-3.1-8b-instant',
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callGroq(systemPrompt, userPrompt) {
  for (const model of GROQ_MODELS) {
    let lastErr = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const body = JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });

      const res = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json',
        },
      }, body);

      if (res.status === 200) {
        console.log(`✅ Model used: ${model}`);
        return res.data.choices[0].message.content;
      }

      const code = res.data?.error?.code;
      const errMsg = res.data?.error?.message || '';

      if (res.status === 429 || code === 'rate_limit_exceeded') {
        const waitMatch = errMsg.match(/try again in ([\d.]+)s/i);
        const waitMs = waitMatch ? Math.ceil(parseFloat(waitMatch[1]) * 1000) + 2000 : 15000;
        console.log(`⏳ Rate limited on ${model}, waiting ${Math.round(waitMs/1000)}s...`);
        await sleep(waitMs);
        lastErr = `rate_limit on ${model}`;
        continue;
      }

      if (code === 'model_decommissioned' || res.status === 404) {
        console.log(`⚠️ Skipping ${model} (decommissioned)`);
        break;
      }

      throw new Error(`Groq error ${res.status}: ${JSON.stringify(res.data)}`);
    }
    if (lastErr) console.log(`⚠️ Giving up on ${model} after retries, trying next model...`);
  }

  throw new Error('All Groq models unavailable. rate_limit — try again later.');
}

// ── MDX sanitizer — fixes common AI output bugs ───────────────────────────────
function sanitizeMdx(content) {
  const lines = content.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const calloutOpen = line.match(/^(<Callout[^>]*>)(.*)$/);
    if (calloutOpen && !line.includes('</Callout>')) {
      const openTag = calloutOpen[1];
      const inline = calloutOpen[2].trim();
      const collected = inline ? [inline] : [];
      i++;
      let closed = false;
      while (i < lines.length) {
        const next = lines[i];
        if (next.includes('</Callout>')) {
          const before = next.replace('</Callout>', '').trim();
          if (before) collected.push(before);
          closed = true;
          i++;
          break;
        }
        if (/^#{1,6}\s/.test(next) || /^<[A-Z]/.test(next) || /^---/.test(next)) break;
        if (next.trim()) collected.push(next.trim());
        i++;
      }
      const body = collected.join(' ').replace(/\s+/g, ' ').trim();
      out.push(`${openTag}${body}</Callout>`);
      out.push('');
      continue;
    }

    const fixed = line
      .replace(/<(https?:\/\/[^\s>]+)>/g, '[$1]($1)')
      .replace(/<(\d)/g, '&lt;$1')
      .replace(/<(\$)/g, '&lt;$1');
    out.push(fixed);
    i++;
  }

  // Remove orphaned </Callout> tags
  const result = out.join('\n');
  const opens = (result.match(/<Callout/g) || []).length;
  const closes = (result.match(/<\/Callout>/g) || []).length;
  if (closes > opens) {
    let excess = closes - opens;
    return result.replace(/<\/Callout>/g, m => { if (excess > 0) { excess--; return ''; } return m; });
  }
  return result;
}

async function ghPutFile(filePath, content, message) {
  const encodedContent = Buffer.from(content).toString('base64');
  const url = `https://api.github.com/repos/${REPO}/contents/${filePath}`;

  // Get existing SHA
  let sha = '';
  try {
    const getRes = await fetchJson(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${GH_TOKEN}` },
    });
    if (getRes.status === 200 && getRes.data?.sha) {
      sha = getRes.data.sha;
    }
  } catch (e) {
    // File doesn't exist yet
  }

  const body = JSON.stringify({
    message,
    content: encodedContent,
    branch: 'main',
    ...(sha && { sha }),
  });

  const res = await fetchJson(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
  }, body);

  if (res.status > 299) {
    throw new Error(`GitHub API error ${res.status}: ${JSON.stringify(res.data)}`);
  }

  return true;
}

// Unique image per article — slug-seeded Picsum (guaranteed unique, no 404s)
function getImageForEntry(entry) {
  return `https://picsum.photos/seed/${entry.slug}/1200/630`;
}

async function generateOne() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const entry = queue.queue.find((e) => e.status === 'pending');

  if (!entry) {
    console.log('✅ No pending articles');
    return null;
  }

  // Claim entry immediately to prevent duplicate generation by concurrent runs
  const claimIdx = queue.queue.findIndex((e) => e.slug === entry.slug);
  queue.queue[claimIdx].status = 'generating';
  queue.queue[claimIdx].generatedDate = new Date().toISOString();
  await ghPutFile(
    'content/queue.json',
    JSON.stringify(queue, null, 2) + '\n',
    `Claim: ${entry.slug} [vercel skip]`
  );
  console.log(`🔒 Claimed: ${entry.slug}`);

  console.log(`🔄 Generating: ${entry.slug}`);
  const today = new Date().toISOString().split('T')[0];
  const image = getImageForEntry(entry);

  const systemPrompt = `You are Nataliia, founder of DataLatte (datalatte.pro) — a freelance local marketing consultant who helps small local businesses grow with paid ads, local SEO, and marketing automation.

## WHO YOU ARE WRITING FOR
Small business owners in the US, UK, Australia, Canada — specifically:
- Coffee shop & café owners (often solo operators, tight budgets, competing with chains)
- Hair salon & barbershop owners (mostly 1–5 chair operations, rely on repeat clients)
- Pet groomers & dog walkers (appointment-based, word-of-mouth dependent)
- Fitness studio & yoga studio owners (seasonal demand, high churn, class-based revenue)

These owners are NOT marketers. They are time-poor, budget-conscious, and skeptical of agencies. They want tactics that work this week, not theory. They respond to: specific numbers, honest trade-offs, step-by-step breakdowns, and real-world examples from businesses like theirs.

## VOICE & TONE
- Write as Nataliia: direct, warm, no-nonsense. "Here's what I'd do" energy.
- Use "you" throughout. Talk to the owner, not about them.
- No corporate jargon. Say "get more customers" not "drive customer acquisition".
- Be honest about limitations: if something is expensive or risky, say so.
- Use real numbers (budgets, CPCs, timelines, conversion rates). Make them up if needed but keep them realistic.
- Short sentences. Short paragraphs. Maximum 3 sentences per paragraph.

## OUTPUT FORMAT — CRITICAL
- Respond ONLY with raw MDX content
- Do NOT wrap in code fences
- Start directly with the YAML frontmatter (---)
- Use EXACTLY this frontmatter structure (no extra fields, no missing fields):
---
title: "${entry.title}"
date: "${today}"
description: "SEO meta description containing the primary keyword, 150–160 characters, written as a compelling benefit statement"
author: "Nataliia"
category: "${entry.cluster}"
tags: ["tag1", "tag2", "tag3", "tag4"]
slug: "${entry.slug}"
image: "${image}"
readTime: "X min read"
---

## CONTENT STRUCTURE (follow in order)

**1. Opening hook (2–3 sentences, no heading)**
Start with a specific problem, surprising stat, or bold claim. Make the owner feel seen immediately. No "In this article we will..." intros.

**2. StatRow component (REQUIRED — place right after the opening hook)**
Show 3–4 key stats relevant to the topic. Use realistic numbers.
Syntax:
<StatRow
  values="VALUE1|VALUE2|VALUE3|VALUE4"
  labels="LABEL1|LABEL2|LABEL3|LABEL4"
  subs="sub text|sub text|sub text|sub text"
  trends="up|down|neutral|up"
/>

**3. Body sections (4–6 H2 headings)**
Each H2 section should:
- Answer a specific question or cover a distinct action step
- Be 150–250 words
- Include at least one concrete example (name a city, a business type, a dollar figure)
- Use bullet lists for steps/options where appropriate

**4. BarChart component (REQUIRED — use once, inside the most data-heavy section)**
Show a comparison, ranking, or before/after. Use realistic values.
Syntax:
<BarChart
  title="Chart title"
  labels="Label A|Label B|Label C|Label D"
  values="85|62|45|30"
  unit="$"
  caption="Source or context note"
  highlights="Label A"
/>

**5. Callout components (REQUIRED — use 2–3 throughout the article)**
Place after key insights. Types available: tip | warning | stat | example | coffee
Syntax:
<Callout type="tip">Your callout text here. Can include **bold** and links.</Callout>
<Callout type="warning">Watch out text here.</Callout>
<Callout type="example">Real example text here.</Callout>
<Callout type="coffee">DataLatte's personal take or recommendation.</Callout>

**6. FAQ section (REQUIRED — H2 heading "Frequently Asked Questions")**
5–7 questions written exactly as someone would type them into Google.
Each answer: 2–4 sentences, direct and specific.

**7. Closing CTA (no heading)**
2–3 sentences. Natural mention of DataLatte and a link to /contact for a free audit. Don't be salesy — frame it as "if you want help applying this."

## SEO RULES
- Use the primary keyword in the first 100 words
- Use it naturally 3–5 more times throughout
- Use related terms and synonyms — don't keyword-stuff
- H2 headings should answer real search queries when possible
- Meta description must include the primary keyword and be 150–160 chars

## WHAT TO AVOID
- Never use <think> tags or reasoning blocks before the MDX
- Never wrap output in code fences (\`\`\`)
- Never use H1 headings inside the content (title is already H1)
- Never write generic advice that applies to any business — always tie to the specific niche
- Never start a section with "In conclusion" or "To summarize"
- Never use the Funnel component (reserved for special use)

PRIMARY KEYWORD: ${entry.primaryKeyword}
TARGET LENGTH: ${entry.targetWords} words (±200)
CLUSTER: ${entry.cluster}`;

  const userPrompt = `Write a complete MDX blog post for DataLatte.pro.

Title: ${entry.title}
Primary keyword: ${entry.primaryKeyword}
Target audience: small local business owners (coffee shops, salons, pet groomers, fitness studios)
Target word count: ${entry.targetWords}

Requirements:
- Include StatRow with 3–4 real stats right after the opening hook
- Include one BarChart in the most data-heavy section
- Include 2–3 Callout components (mix types: tip, warning, example, or coffee)
- Include FAQ section with 5–7 questions
- End with a natural CTA to /contact

Output ONLY raw MDX — no code fences, start with ---.`;

  let mdx;
  try {
    mdx = await callGroq(systemPrompt, userPrompt);
  } catch (err) {
    // Reset claim so the next run can retry this article
    console.error(`❌ Groq failed, resetting ${entry.slug} to pending: ${err.message}`);
    const resetQueue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const ri = resetQueue.queue.findIndex((e) => e.slug === entry.slug);
    if (ri !== -1 && resetQueue.queue[ri].status === 'generating') {
      resetQueue.queue[ri].status = 'pending';
      delete resetQueue.queue[ri].generatedDate;
      await ghPutFile(
        'content/queue.json',
        JSON.stringify(resetQueue, null, 2) + '\n',
        `Reset: ${entry.slug} back to pending [vercel skip]`
      );
      console.log(`🔄 Reset: ${entry.slug} → pending`);
    }
    throw err;
  }

  // Strip <think>...</think> reasoning blocks some models emit before output
  mdx = mdx.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trimStart();
  // Fix common MDX syntax bugs before pushing
  mdx = sanitizeMdx(mdx);

  // Push MDX file
  await ghPutFile(
    `content/blog/${entry.slug}.mdx`,
    mdx + '\n',
    `Add article: ${entry.title}`
  );
  console.log(`✅ Pushed: ${entry.slug}`);

  // Update queue
  const idx = queue.queue.findIndex((e) => e.slug === entry.slug);
  if (idx !== -1) {
    queue.queue[idx].status = 'published';
    queue.queue[idx].generatedDate = new Date().toISOString();
  }

  await ghPutFile(
    'content/queue.json',
    JSON.stringify(queue, null, 2) + '\n',
    `Update queue: mark ${entry.slug} as published [vercel skip]`
  );

  const remaining = queue.queue.filter((e) => e.status === 'pending').length;
  console.log(`ARTICLE_TITLE: ${entry.title}`);
  console.log(`ARTICLE_KEYWORD: ${entry.primaryKeyword}`);
  console.log(`ARTICLE_CLUSTER: ${entry.cluster}`);
  console.log(`QUEUE_REMAINING: ${remaining}`);

  return { slug: entry.slug, status: 200 };
}

async function run() {
  const results = [];

  try {
    const result = await generateOne();
    if (result) results.push(result);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    results.push({ slug: '?', status: 500, error: err.message });
  }

  console.log('\n=== Final Results ===');
  console.log(JSON.stringify(results, null, 2));

  // Set env for notification
  process.env.GEN_RESULTS = JSON.stringify(results);
}

if (!GROQ_KEY) {
  console.error('❌ GROQ_API_KEY not set');
  process.stdout.write('ERROR_GROQ_KEY_MISSING');
  process.exit(1);
}

if (!GH_TOKEN) {
  console.error('❌ GH_TOKEN or GITHUB_TOKEN not set');
  process.stdout.write('ERROR_GH_TOKEN_MISSING');
  process.exit(1);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.stdout.write('ERROR_' + err.message.replace(/\s+/g, '_').slice(0, 50));
  process.exit(1);
});
