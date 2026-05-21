#!/usr/bin/env node
/**
 * Standalone article generator for GitHub Actions
 * Bypasses serverless timeout limits by running directly in workflow
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GROQ_KEY = process.env.GROQ_API_KEY;
const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
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
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',                    // best quality — 12K TPM, 100K TPD
  'meta-llama/llama-4-scout-17b-16e-instruct',  // 30K TPM, 500K TPD — highest throughput
  'openai/gpt-oss-120b',                        // 8K TPM, 200K TPD
  'openai/gpt-oss-20b',                         // 8K TPM, 200K TPD
  'groq/compound',                              // 70K TPM, no daily cap (scout+gpt-oss internally)
  'qwen/qwen3-32b',                             // 6K TPM, 500K TPD — needs max_tokens ≤ 4000
  'llama-3.1-8b-instant',                       // 6K TPM, 500K TPD — needs max_tokens ≤ 4000
  'groq/compound-mini',                         // 70K TPM, no daily cap (llama-3.3-70b internally)
];

const CEREBRAS_MODELS = [
  'llama-3.3-70b',   // 30K TPM, 1M TPD — best quality
  'llama3.1-70b',    // 30K TPM, 1M TPD
  'llama3.1-8b',     // 30K TPM, 1M TPD — fastest
  'qwen-3-32b',      // 30K TPM, 1M TPD
];

let _groqTokens = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Gemini 2.5 Flash ─────────────────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  if (!GEMINI_KEY) return null;
  const model = 'gemini-2.5-flash-preview-05-20';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
  });
  try {
    const res = await fetchJson(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, body);
    if (res.status === 200) {
      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`✅ Gemini 2.5 Flash used`);
        return text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
    }
    if (res.status === 429) { console.log('⏳ Gemini rate limited, falling back...'); return null; }
    if (res.status === 403) { console.log('⚠️  Gemini API key invalid or quota exceeded'); return null; }
    console.log(`⚠️  Gemini error ${res.status}: ${JSON.stringify(res.data)?.slice(0, 100)}`);
  } catch (e) {
    console.log(`⚠️  Gemini fetch error: ${e.message}`);
  }
  return null;
}

async function callGroq(systemPrompt, userPrompt) {
  // Try Gemini 2.5 Flash first — best quality, free tier 1500 req/day
  const geminiResult = await callGemini(systemPrompt, userPrompt);
  if (geminiResult) return geminiResult;

  // Try Cerebras next — 2400 RPD per model, OpenAI-compatible
  if (CEREBRAS_KEY) {
    for (const model of CEREBRAS_MODELS) {
      const body = JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
      const res = await fetchJson('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CEREBRAS_KEY}`, 'Content-Type': 'application/json' },
      }, body);
      if (res.status === 200) {
        _groqTokens += res.data?.usage?.total_tokens ?? 0;
        console.log(`✅ Cerebras model used: ${model}`);
        return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
      if (res.status === 429 || res.data?.error?.code === 'rate_limit_exceeded') {
        console.log(`⏳ Cerebras rate limit on ${model}, trying next...`);
        continue;
      }
      if (res.status === 404 || res.data?.error?.code === 'model_decommissioned') continue;
    }
    console.log('⚠️  All Cerebras models unavailable, falling back to Groq...');
  }

  let consecutiveRateLimits = 0;
  const callStart = Date.now();
  const BUDGET_MS = 5 * 60 * 1000; // 5-minute total budget — must exit before 20-min GH timeout

  for (const model of GROQ_MODELS) {
    // Hard exit if we've spent too long — ensures script exits cleanly so Telegram is sent
    if (Date.now() - callStart > BUDGET_MS) {
      console.log(`⏱ Budget exceeded (${Math.round((Date.now()-callStart)/1000)}s) — exiting rate-limit path`);
      throw new Error('All Groq models unavailable. rate_limit — try again later.');
    }

    // Brief pause after 3 consecutive failures (reduced from 90s to 15s)
    if (consecutiveRateLimits >= 3) {
      console.log(`⏸️  ${consecutiveRateLimits} models rate-limited — pausing 15s...`);
      await sleep(15000);
      consecutiveRateLimits = 0;
    }

    let lastErr = null;
    for (let attempt = 0; attempt < 3; attempt++) {
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
        _groqTokens += res.data?.usage?.total_tokens ?? 0;
        const content = res.data?.choices?.[0]?.message?.content;
        if (!content) { console.log(`⚠️  ${model} returned 200 but no content — skipping`); continue; }
        console.log(`✅ Model used: ${model}`);
        consecutiveRateLimits = 0;
        return content;
      }

      const code = res.data?.error?.code;
      const errMsg = res.data?.error?.message || '';

      if (res.status === 429 || code === 'rate_limit_exceeded') {
        const retryAfterHeader = res.headers?.['retry-after'];
        const waitMatch = errMsg.match(/try again in ([\d.]+)s/i) || errMsg.match(/please retry after ([\d.]+) second/i);
        const rawWaitMs = retryAfterHeader
          ? Math.ceil(parseFloat(retryAfterHeader) * 1000) + 2000
          : waitMatch
            ? Math.ceil(parseFloat(waitMatch[1]) * 1000) + 2000
            : 60000;
        // Skip model entirely if it needs a long wait (daily quota)
        if (rawWaitMs > 30000) {
          console.log(`⚡ ${model} quota exhausted (retry-after ${Math.round(rawWaitMs/1000)}s) — skipping`);
          break;
        }
        console.log(`⏳ Rate limited on ${model}, waiting ${Math.round(rawWaitMs/1000)}s...`);
        await sleep(rawWaitMs);
        lastErr = `rate_limit on ${model}`;
        continue;
      }

      if (code === 'model_decommissioned' || res.status === 404) {
        console.log(`⚠️ Skipping ${model} (decommissioned)`);
        break;
      }

      throw new Error(`Groq error ${res.status}: ${JSON.stringify(res.data)}`);
    }
    if (lastErr) {
      console.log(`⚠️ Giving up on ${model} after retries, trying next model...`);
      consecutiveRateLimits++;
    }
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
  let result = out.join('\n');
  const opens = (result.match(/<Callout/g) || []).length;
  const closes = (result.match(/<\/Callout>/g) || []).length;
  if (closes > opens) {
    let excess = closes - opens;
    result = result.replace(/<\/Callout>/g, m => { if (excess > 0) { excess--; return ''; } return m; });
  }

  // Fix duplicate FAQ headings — keep only the first occurrence
  const faqHeadings = [...result.matchAll(/^##\s+Frequently Asked Questions/gm)];
  if (faqHeadings.length > 1) {
    let first = true;
    result = result.replace(/^##\s+Frequently Asked Questions/gm, (m) => {
      if (first) { first = false; return m; }
      return '';
    });
  }

  // Fix space-separated quoted attribute values in MDX components → pipe-separated
  // e.g. labels="A" "B" "C" → labels="A|B|C"  (only on component-attribute lines)
  result = result.split('\n').map(line => {
    if (!/^[\s]*<[A-Z]|<[A-Z][A-Za-z]+/.test(line) && !/^\s+[a-z]+="|^\s+[a-z]+\s*$/.test(line)) return line;
    let fixed = line;
    let prev;
    do {
      prev = fixed;
      fixed = fixed.replace(/"([^"\n]*)"\s+"([^"\n]*)"/g, '"$1|$2"');
    } while (fixed !== prev);
    return fixed;
  }).join('\n');

  // Fix BarChart non-numeric values — strip %, $, commas
  result = result.replace(/(<BarChart[^>]*values=")([^"]+)(")/g, (full, pre, vals, post) => {
    const cleaned = vals.split('|').map(v => {
      const n = parseFloat(v.replace(/[%$,\s]/g, ''));
      return isNaN(n) ? '0' : String(n);
    }).join('|');
    return pre + cleaned + post;
  });

  // ── Frontmatter fixes ──────────────────────────────────────────────────────

  // 1. Ensure frontmatter has a closing ---
  //    The content must start with --- and have a second --- on its own line
  //    before any body content begins.
  if (result.startsWith('---\n')) {
    const afterOpen = result.slice(4); // skip opening ---\n
    const closeIdx = afterOpen.search(/^---\s*$/m);
    if (closeIdx === -1) {
      // No closing --- found — insert one after the last frontmatter field
      // (the first blank line after the opening ---)
      const blankIdx = afterOpen.search(/^\s*$/m);
      if (blankIdx !== -1) {
        result = '---\n' + afterOpen.slice(0, blankIdx) + '\n---\n' + afterOpen.slice(blankIdx);
      }
    }
  }

  // 2a. Fix double-escaped title: title:" \"Actual Title\"" → title: "Actual Title"
  result = result.replace(
    /^(title:)" \\"(.*)\\""/m,
    (_, prefix, val) => `${prefix} "${val}"`
  );

  // 2b. Quote any title that contains ": " but is unquoted — YAML parse error
  result = result.replace(
    /^(title:\s*)([^"\n][^\n]*:\s[^\n]*)$/m,
    (_, prefix, val) => `${prefix}"${val.replace(/"/g, '\\"')}"`
  );

  // 3. Replace unknown shorthand components with Callout equivalents
  const COMPONENT_MAP = {
    Tip:     'tip',
    Warning: 'warning',
    Coffee:  'coffee',
    Example: 'example',
    Stat:    'stat',
    Faq:     'faq',
    Info:    'tip',
    Note:    'tip',
    Alert:   'warning',
    Danger:  'warning',
  };
  for (const [tag, calloutType] of Object.entries(COMPONENT_MAP)) {
    result = result
      .replace(new RegExp(`<${tag}(\\s[^>]*)?>`, 'g'), `<Callout type="${calloutType}">`)
      .replace(new RegExp(`</${tag}>`, 'g'), `</Callout>`);
  }

  // 4. Replace unknown Callout types with 'tip'
  const VALID_CALLOUT_TYPES = new Set(['tip', 'warning', 'stat', 'example', 'coffee', 'faq']);
  result = result.replace(/(<Callout\s+type=")([^"]+)(")/g, (full, pre, t, post) => {
    return VALID_CALLOUT_TYPES.has(t) ? full : `${pre}tip${post}`;
  });

  return result;
}

async function refreshLocalQueue() {
  const url = `https://api.github.com/repos/${REPO}/contents/content/queue.json`;
  const res = await fetchJson(url, { method: 'GET', headers: { 'Authorization': `Bearer ${GH_TOKEN}` } });
  if (res.status === 200 && res.data?.content) {
    const content = Buffer.from(res.data.content, 'base64').toString('utf8');
    fs.writeFileSync(path.join(process.cwd(), 'content/queue.json'), content);
    return true;
  }
  return false;
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

// Curated cluster images — one professional photo per content cluster
const CLUSTER_IMAGES = {
  'Google Ads':                           '/blog/clusters/google-ads.jpg',
  'AI & Automation':                      '/blog/clusters/ai-automation.jpg',
  'Email & SMS Marketing':                '/blog/clusters/email-sms-marketing.jpg',
  'Programmatic Advertising':             '/blog/clusters/programmatic-advertising.jpg',
  'Meta Ads':                             '/blog/clusters/meta-ads.jpg',
  'Pet Groomer Marketing':                '/blog/clusters/pet-groomer-marketing.jpg',
  'TikTok Ads':                           '/blog/clusters/tiktok-ads.jpg',
  'Instagram Ads':                        '/blog/clusters/instagram-ads.jpg',
  'Local SEO':                            '/blog/clusters/local-seo.jpg',
  'Coffee Shop Marketing':                '/blog/clusters/coffee-shop-marketing.jpg',
  'Hair Salon Marketing':                 '/blog/clusters/hair-salon-marketing.jpg',
  'Social Media':                         '/blog/clusters/social-media.jpg',
  'Audio Advertising':                    '/blog/clusters/audio-advertising.jpg',
  'Fitness Studio Marketing':             '/blog/clusters/fitness-studio-marketing.jpg',
  'Website & CRO':                        '/blog/clusters/website-cro.jpg',
  'Tool Comparisons':                     '/blog/clusters/tool-comparisons.jpg',
  'Influencer Marketing':                 '/blog/clusters/influencer-marketing.jpg',
  'Analytics & Tracking':                 '/blog/clusters/analytics-tracking.jpg',
  'Content Marketing':                    '/blog/clusters/content-marketing.jpg',
  'YouTube Ads':                          '/blog/clusters/youtube-ads.jpg',
  'CTV Advertising':                      '/blog/clusters/ctv-advertising.jpg',
  'Retargeting':                          '/blog/clusters/retargeting.jpg',
  'Marketing Strategy':                   '/blog/clusters/marketing-strategy.jpg',
  'Reputation Management':                '/blog/clusters/reputation-management.jpg',
  'Case Studies':                         '/blog/clusters/case-studies.jpg',
  'Snapchat Advertising':                 '/blog/clusters/snapchat-advertising.jpg',
  'Messaging & Community Marketing':      '/blog/clusters/messaging-community-marketing.jpg',
  'Google Business Profile Optimization': '/blog/clusters/google-business-profile.jpg',
  'Microsoft Ads':                        '/blog/clusters/microsoft-ads.jpg',
  'Yahoo Advertising':                    '/blog/clusters/yahoo-advertising.jpg',
  'Nextdoor & Neighborhood Marketing':    '/blog/clusters/nextdoor-neighborhood.jpg',
  'Pinterest Marketing':                  '/blog/clusters/pinterest-marketing.jpg',
  'Review Platform Ads':                  '/blog/clusters/review-platform-ads.jpg',
  'Reddit & Community Marketing':         '/blog/clusters/reddit-community-marketing.jpg',
  'Offline Marketing':                    '/blog/clusters/offline-marketing.jpg',
};

function getImageForEntry(entry) {
  return CLUSTER_IMAGES[entry.cluster] || '/blog/clusters/marketing-strategy.jpg';
}

async function generateOne() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

  // Reset articles stuck in 'generating' for more than 8 minutes.
  // IMPORTANT: must push reset to GitHub — writing locally only has no effect
  // because every run starts from a fresh checkout. Without the push, the article
  // gets locally reset, re-claimed, pushed as 'generating' again → infinite loop.
  const STALE_MS = 8 * 60 * 1000;
  const now = Date.now();
  const toReset = [];
  for (const a of queue.queue) {
    if (a.status === 'generating') {
      const age = a.generatedDate ? now - new Date(a.generatedDate).getTime() : STALE_MS + 1;
      if (age > STALE_MS) {
        a.status = 'pending';
        delete a.generatedDate;
        toReset.push(a.slug);
        console.log(`♻️ Reset: ${a.slug} → pending (stuck ${Math.round(age/60000)}m)`);
      }
    }
  }
  if (toReset.length > 0) {
    // Push reset to GitHub so the next run doesn't re-see 'generating'
    await ghPutFile(
      'content/queue.json',
      JSON.stringify(queue, null, 2) + '\n',
      `Reset stuck: ${toReset.join(', ')} → pending [vercel skip]`
    );
    console.log(`✅ Pushed reset for ${toReset.length} stuck article(s) to GitHub`);
  }

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
CRITICAL: ALL multi-value attributes use | (pipe) as separator inside ONE quoted string.
WRONG: labels="Label A" "Label B" "Label C"
RIGHT: labels="Label A|Label B|Label C"

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
CRITICAL: labels= must be ONE quoted string with | separators, never: labels="A" "B" "C"

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

**7. Internal links to DataLatte service pages (REQUIRED — add 2–3 within body sections)**
Naturally link to relevant service pages using descriptive anchor text inside a sentence:
- [Google Ads management](/services/google-ads) — for any Google Ads topic
- [Meta Ads management](/services/meta-ads) — for Facebook/Instagram ads
- [local SEO services](/services/local-seo) — for search/maps/rankings topics
- [Google Business Profile optimization](/services/google-business-profile) — for GBP topics
- [analytics & reporting](/services/analytics) — for tracking/data topics
- [AI agents & automation](/services/ai-agents) — for automation topics
- [email & SMS marketing](/services/email-sms) — for email/text topics
- [social media management](/services/social-media) — for social topics
- [website & landing page services](/services/website) — for website/CRO topics
Place these links naturally in sentences — never as a standalone line or list item.

**8. Closing CTA (no heading)**
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
- NEVER use space-separated quoted attribute values: labels="A" "B" "C" is INVALID JSX and will crash the build. Always use pipe-separated inside one string: labels="A|B|C"

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

  // Push MDX file — [vercel skip] so all articles batch into one deploy trigger at end of run
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

  const remaining = queue.queue.filter((e) => e.status === 'pending').length;
  console.log(`ARTICLE_TITLE: ${entry.title}`);
  console.log(`ARTICLE_KEYWORD: ${entry.primaryKeyword}`);
  console.log(`ARTICLE_CLUSTER: ${entry.cluster}`);
  console.log(`QUEUE_REMAINING: ${remaining}`);

  return { slug: entry.slug, title: entry.title, keyword: entry.primaryKeyword, cluster: entry.cluster, remaining, status: 200 };
}

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT  = process.env.TELEGRAM_CHAT_ID;

async function telegram(msg) {
  if (!TG_TOKEN || !TG_CHAT) {
    console.log(`[Telegram] skipped — token set: ${!!TG_TOKEN}, chat set: ${!!TG_CHAT}`);
    return;
  }
  console.log(`[Telegram] sending: ${msg.slice(0, 60).replace(/\n/g, ' ')}...`);
  const res = await fetchJson(
    `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ chat_id: TG_CHAT, text: msg })
  ).catch((e) => ({ status: 0, error: e.message }));
  console.log(`[Telegram] response: ${res.status}${res.data?.description ? ' — ' + res.data.description : ''}`);
}

async function run() {
  console.log(`[Config] TG_TOKEN set: ${!!TG_TOKEN} | TG_CHAT set: ${!!TG_CHAT} | GROQ_KEY set: ${!!GROQ_KEY}`);
  const published = [];
  const MAX_ARTICLES = 10;
  let errorMsg = null;

  for (let i = 0; i < MAX_ARTICLES; i++) {
    try {
      if (i > 0) {
        const refreshed = await refreshLocalQueue();
        console.log(`♻️ Queue refreshed from GitHub: ${refreshed}`);
      }
      const r = await generateOne();
      if (!r) break; // queue empty
      published.push(r);
    } catch (err) {
      console.error(`❌ Error (article ${i + 1}): ${err.message}`);
      if (!errorMsg) errorMsg = err.message;
      break;
    }
  }

  console.log('\n=== Final Results ===');
  console.log(JSON.stringify(published, null, 2));

  // Push ONE deploy trigger commit for the whole batch (all article commits used [vercel skip])
  // This means Vercel builds ONCE per generator run instead of once per article
  if (published.length > 0) {
    const slugList = published.map(r => r.slug).join(', ');
    const deployMsg = published.length === 1
      ? `Deploy: ${published[0].title}`
      : `Deploy: ${published.length} new articles`;
    await ghPutFile(
      'content/last-deploy.txt',
      `${new Date().toISOString()} — ${published.length} article(s)\n${slugList}\n`,
      deployMsg
    );
    console.log(`🚀 Deploy trigger pushed: "${deployMsg}"`);
  }

  // Telegram notification
  const time = new Date().toUTCString().slice(0, 25);
  if (published.length > 0) {
    const last = published[published.length - 1];
    const countTag = published.length > 1 ? ` x${published.length}` : '';
    const articleLines = published.map(r => `📄 ${r.title}\n   datalatte.pro/blog/${r.slug}`).join('\n');
    await telegram(
      `✍️ Writer — published${countTag}\n🕐 ${time}\n\n${articleLines}\n\n🔑 ${last.keyword}\n📂 ${last.cluster}\n📊 ${last.remaining} pending`
    );
  } else if (errorMsg && (errorMsg.includes('rate_limit') || errorMsg.includes('All Groq') || errorMsg.includes('unavailable'))) {
    await telegram(`⚡ Writer — rate limited\n🕐 ${time}\n\nAll models busy, retrying in 5 min.`);
  } else if (!errorMsg) {
    await telegram(`🏁 Writer — queue empty\n🕐 ${time}\n\nAll articles published.`);
  } else {
    await telegram(`⚠️ Writer — failed\n🕐 ${time}\n\n${errorMsg.slice(0, 200)}`);
  }
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

run().then(() => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
}).catch((err) => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
  console.error('Fatal error:', err);
  process.stdout.write('ERROR_' + err.message.replace(/\s+/g, '_').slice(0, 50));
  process.exit(1);
});
