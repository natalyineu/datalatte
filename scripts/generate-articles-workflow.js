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
  'llama3-70b-8192',
  'gemma2-9b-it',
  'llama-3.1-8b-instant',
];

async function callGroq(systemPrompt, userPrompt) {
  for (const model of GROQ_MODELS) {
    const body = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
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
    const shouldSkip = res.status === 429 || code === 'rate_limit_exceeded' || code === 'model_decommissioned';
    if (shouldSkip) {
      console.log(`⚠️ Skipping ${model} (${code || res.status}), trying next...`);
      continue;
    }

    throw new Error(`Groq error ${res.status}: ${JSON.stringify(res.data)}`);
  }

  throw new Error('All Groq models unavailable. Try again later.');
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

const CLUSTER_IMAGES = {
  // Niches
  'Coffee Shop Marketing':            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
  'Hair Salon Marketing':             'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
  'Pet Groomer Marketing':            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80',
  'Fitness Studio Marketing':         'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
  // Channels
  'Meta Ads':                         'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
  'Instagram Marketing':              'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80',
  'TikTok Marketing':                 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&q=80',
  'Snapchat Advertising':             'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
  'Pinterest Marketing':              'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80',
  'Microsoft Ads':                    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80',
  'Yahoo Advertising':                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80',
  'Programmatic Advertising':         'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  'Audio Advertising':                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
  'Messaging & Community Marketing':  'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1200&q=80',
  'Nextdoor & Neighborhood Marketing':'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  'Review Platform Ads':              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  'Offline Marketing':                'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80',
  'Influencer & Creator Marketing':   'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1200&q=80',
  'Reddit & Community Marketing':     'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
  // Strategy & tools
  'AI & Automation':                  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
  'Local Business Strategy':          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  'Local SEO':                        'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
  'Analytics & Tracking':             'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  'Email & SMS Marketing':            'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80',
  'Social Media':                     'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
  'Website & CRO':                    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
  'Content Marketing':                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
  'Reputation Management':            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  'Seasonal Marketing':               'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80',
  'Tool Comparisons':                 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80',
  'Case Studies':                     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80';

function getImageForEntry(entry) {
  if (CLUSTER_IMAGES[entry.cluster]) return CLUSTER_IMAGES[entry.cluster];
  // Fallback: keyword match
  const slug = entry.slug.toLowerCase();
  if (slug.includes('coffee')) return CLUSTER_IMAGES['Coffee Shop Marketing'];
  if (slug.includes('salon') || slug.includes('hair')) return CLUSTER_IMAGES['Hair Salon Marketing'];
  if (slug.includes('groom') || slug.includes('dog') || slug.includes('cat') || slug.includes('pet')) return CLUSTER_IMAGES['Pet Groomer Marketing'];
  if (slug.includes('gym') || slug.includes('fitness') || slug.includes('yoga')) return CLUSTER_IMAGES['Fitness Studio Marketing'];
  if (slug.includes('tiktok')) return CLUSTER_IMAGES['TikTok Marketing'];
  if (slug.includes('instagram')) return CLUSTER_IMAGES['Instagram Marketing'];
  if (slug.includes('facebook') || slug.includes('meta')) return CLUSTER_IMAGES['Meta Ads'];
  if (slug.includes('programmatic') || slug.includes('dsp') || slug.includes('dv360')) return CLUSTER_IMAGES['Programmatic Advertising'];
  if (slug.includes('spotify') || slug.includes('podcast') || slug.includes('audio')) return CLUSTER_IMAGES['Audio Advertising'];
  if (slug.includes('email') || slug.includes('sms')) return CLUSTER_IMAGES['Email & SMS Marketing'];
  if (slug.includes('ai-') || slug.includes('automation')) return CLUSTER_IMAGES['AI & Automation'];
  if (slug.includes('seo')) return CLUSTER_IMAGES['Local SEO'];
  return DEFAULT_IMAGE;
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
    `Claim: ${entry.slug} [skip ci]`
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

  let mdx = await callGroq(systemPrompt, userPrompt);
  // Strip <think>...</think> reasoning blocks some models emit before output
  mdx = mdx.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trimStart();

  // Push MDX file
  await ghPutFile(
    `content/blog/${entry.slug}.mdx`,
    mdx + '\n',
    `Add article: ${entry.title} [skip ci]`
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
    `Update queue: mark ${entry.slug} as published [skip ci]`
  );

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
