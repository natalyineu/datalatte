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

async function callGroq(systemPrompt, userPrompt) {
  const body = JSON.stringify({
    model: 'qwen/qwen3-32b',
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

  if (res.status !== 200) {
    throw new Error(`Groq error ${res.status}: ${JSON.stringify(res.data)}`);
  }

  return res.data.choices[0].message.content;
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

  console.log(`🔄 Generating: ${entry.slug}`);
  const today = new Date().toISOString().split('T')[0];
  const image = getImageForEntry(entry);

  const systemPrompt = `You are Nataliia, founder of DataLatte (datalatte.pro) — a freelance local marketing agency.

WRITING STYLE: Expert but conversational, direct and practical, use real numbers and examples.

OUTPUT FORMAT — CRITICAL:
- Respond ONLY with raw MDX content
- Do NOT wrap in code fences
- Start directly with YAML frontmatter (---)
- Use this exact structure:
---
title: "${entry.title}"
date: "${today}"
description: "SEO meta description with primary keyword (150-160 chars)"
author: "Nataliia"
category: "${entry.cluster}"
tags: ["tag1", "tag2", "tag3", "tag4"]
slug: "${entry.slug}"
image: "${image}"
readTime: "5 min read"
---

CONTENT STRUCTURE:
1. Opening hook (no heading)
2. 4-7 H2 sections
3. FAQ section with 5-7 questions at end
4. Natural CTA mentioning DataLatte & /contact

PRIMARY KEYWORD: ${entry.primaryKeyword}
TARGET: ${entry.targetWords} words (±200)`;

  const userPrompt = `Write complete MDX blog post.
Title: ${entry.title}
Primary keyword: ${entry.primaryKeyword}
Target words: ${entry.targetWords}

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
