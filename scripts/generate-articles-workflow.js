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
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
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
