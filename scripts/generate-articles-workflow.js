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

const NICHE_IMAGES = {
  'coffee-shops':    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
  'hair-salons':     'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
  'pet-groomers':    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80',
  'fitness-studios': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
};

const CHANNEL_IMAGES = {
  'ai-agents':       'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
  'ai-automation':   'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
  'google-ads':      'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&q=80',
  'facebook':        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
  'instagram':       'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80',
  'tiktok':          'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&q=80',
  'snapchat':        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
  'pinterest':       'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80',
  'youtube':         'https://images.unsplash.com/photo-1611162614475-46b635cb6868?w=1200&q=80',
  'spotify':         'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
  'programmatic':    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  'ctv':             'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80',
  'email-sms':       'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&q=80',
  'seo':             'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
  'social-media':    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80',
  'influencer':      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1200&q=80',
  'analytics':       'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  'website':         'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
  'content':         'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
  'reviews':         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  'retention':       'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80',
  'local-strategy':  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80';

function getImageForEntry(entry) {
  const slug = (entry.slug || '').toLowerCase();
  const category = (entry.category || entry.cluster || '').toLowerCase();
  const niche = (entry.niche || '').toLowerCase();

  // 1. Niche field (new articles)
  if (NICHE_IMAGES[niche]) return NICHE_IMAGES[niche];

  // 2. Category field (new articles)
  if (category.includes('ai agent')) return CHANNEL_IMAGES['ai-agents'];
  if (category.includes('ai automation') || category.includes('automation')) return CHANNEL_IMAGES['ai-automation'];

  // 3. Slug keyword matching — niches first
  if (slug.includes('coffee') || slug.includes('cafe') || slug.includes('barista') || slug.includes('espresso')) return NICHE_IMAGES['coffee-shops'];
  if (slug.includes('salon') || slug.includes('hair') || slug.includes('barbershop') || slug.includes('barber') || slug.includes('nail') || slug.includes('spa') || slug.includes('beauty')) return NICHE_IMAGES['hair-salons'];
  if (slug.includes('groom') || slug.includes('dog') || slug.includes('cat') || slug.includes('pet') || slug.includes('vet')) return NICHE_IMAGES['pet-groomers'];
  if (slug.includes('gym') || slug.includes('fitness') || slug.includes('yoga') || slug.includes('pilates') || slug.includes('crossfit') || slug.includes('personal-train') || slug.includes('studio')) return NICHE_IMAGES['fitness-studios'];

  // 4. Slug keyword matching — channels
  if (slug.includes('ai-agent') || slug.includes('ai-receptionist') || slug.includes('ai-booking') || slug.includes('voice-ai') || slug.includes('chatbot') || slug.includes('whatsapp-ai')) return CHANNEL_IMAGES['ai-agents'];
  if (slug.includes('automat') || slug.includes('n8n') || slug.includes('zapier') || slug.includes('make-com') || slug.includes('chatgpt') || slug.includes('ai-tool') || slug.includes('ai-for') || slug.includes('ai-market') || slug.includes('ai-content') || slug.includes('ai-power')) return CHANNEL_IMAGES['ai-automation'];
  if (slug.includes('tiktok')) return CHANNEL_IMAGES['tiktok'];
  if (slug.includes('instagram')) return CHANNEL_IMAGES['instagram'];
  if (slug.includes('snapchat')) return CHANNEL_IMAGES['snapchat'];
  if (slug.includes('youtube')) return CHANNEL_IMAGES['youtube'];
  if (slug.includes('facebook') || slug.includes('meta-ad') || slug.includes('meta-ads')) return CHANNEL_IMAGES['facebook'];
  if (slug.includes('spotify') || slug.includes('podcast') || slug.includes('audio')) return CHANNEL_IMAGES['spotify'];
  if (slug.includes('programmatic') || slug.includes('dsp') || slug.includes('dv360') || slug.includes('retarget') || slug.includes('display')) return CHANNEL_IMAGES['programmatic'];
  if (slug.includes('ctv') || slug.includes('ott') || slug.includes('connected-tv') || slug.includes('streaming')) return CHANNEL_IMAGES['ctv'];
  if (slug.includes('email') || slug.includes('sms') || slug.includes('text-message')) return CHANNEL_IMAGES['email-sms'];
  if (slug.includes('seo') || slug.includes('google-maps') || slug.includes('google-business') || slug.includes('local-search')) return CHANNEL_IMAGES['seo'];
  if (slug.includes('influencer') || slug.includes('creator') || slug.includes('ugc')) return CHANNEL_IMAGES['influencer'];
  if (slug.includes('analytic') || slug.includes('tracking') || slug.includes('utm') || slug.includes('dashboard')) return CHANNEL_IMAGES['analytics'];
  if (slug.includes('website') || slug.includes('landing-page') || slug.includes('cro')) return CHANNEL_IMAGES['website'];
  if (slug.includes('content') || slug.includes('blog') || slug.includes('video-market')) return CHANNEL_IMAGES['content'];
  if (slug.includes('review') || slug.includes('reputation') || slug.includes('yelp')) return CHANNEL_IMAGES['reviews'];
  if (slug.includes('loyalty') || slug.includes('retention') || slug.includes('referral') || slug.includes('rebooking')) return CHANNEL_IMAGES['retention'];
  if (slug.includes('social') || slug.includes('reels') || slug.includes('organic')) return CHANNEL_IMAGES['social-media'];
  if (slug.includes('google-ads') || slug.includes('google-ad') || slug.includes('ppc') || slug.includes('keywords-for') || slug.includes('ad-budget') || slug.includes('performance-max')) return CHANNEL_IMAGES['google-ads'];

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

  let mdx = await callGroq(systemPrompt, userPrompt);
  // Strip <think>...</think> reasoning blocks some models emit before output
  mdx = mdx.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trimStart();

  // Push MDX file
  await ghPutFile(
    `content/blog/${entry.slug}.mdx`,
    mdx + '\n',
    `Add article: ${entry.title} [vercel skip]`
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
