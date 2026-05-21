#!/usr/bin/env node
/**
 * Agent 3 — Fixer (with real improvement)
 * Two jobs per run:
 *  1. Syntax fixes  — think tags, double headings, broken frontmatter
 *  2. Content improvement — rewrites thin/low-quality articles (score < 7)
 *
 * Processes 5 improvement articles per run (6× daily = ~30/day).
 * Self-chains while there are articles left to improve.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const GROQ_KEY       = process.env.GROQ_API_KEY;
const CEREBRAS_KEY   = process.env.CEREBRAS_API_KEY;
const GH_TOKEN       = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO           = 'natalyineu/datalatte';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT  = process.env.TELEGRAM_CHAT_ID;
const BLOG_DIR       = path.join(process.cwd(), 'content/blog');
const SCORES_PATH    = path.join(process.cwd(), 'content/quality-scores.json');

const IMPROVE_BATCH     = 5;  // articles improved per run (5×4runs = 20/day)
const IMPROVE_THRESHOLD = 7;  // score < this → eligible for improvement

let _groqTokens = 0;

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'groq/compound',
  'qwen/qwen3-32b',
  'llama-3.1-8b-instant',
  'groq/compound-mini',
];

const CEREBRAS_MODELS = [
  'llama-3.3-70b',
  'llama3.1-70b',
  'llama3.1-8b',
  'qwen-3-32b',
];

// ── HTTP ──────────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-Fixer', ...options.headers },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers }); }
        catch { resolve({ status: res.statusCode, data: null, raw: data, headers: res.headers }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function telegram(msg) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) return;
  await fetchJson(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
  }, JSON.stringify({ chat_id: TELEGRAM_CHAT, text: msg })).catch(() => {});
}

// ── Groq ─────────────────────────────────────────────────────────────────────

async function callGroq(prompt, maxTokens = 2000) {
  if (CEREBRAS_KEY) {
    for (const model of CEREBRAS_MODELS) {
      const res = await fetchJson('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CEREBRAS_KEY}`, 'Content-Type': 'application/json' },
      }, JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: maxTokens }));
      if (res.status === 200) {
        _groqTokens += res.data?.usage?.total_tokens ?? 0;
        console.log(`✅ Cerebras model used: ${model}`);
        return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
      if (res.status === 429 || res.data?.error?.code === 'rate_limit_exceeded') continue;
      if (res.status === 404 || res.data?.error?.code === 'model_decommissioned') continue;
    }
    console.log('⚠️  All Cerebras models unavailable, falling back to Groq...');
  }
  let consecutiveFails = 0;
  for (const model of GROQ_MODELS) {
    if (consecutiveFails >= 3) { await sleep(90000); consecutiveFails = 0; }
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      }, JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: maxTokens }));

      if (res.status === 200) {
        _groqTokens += res.data?.usage?.total_tokens ?? 0;
        return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
      const code = res.data?.error?.code;
      if (res.status === 429 || code === 'rate_limit_exceeded') {
        const retryAfter = res.headers?.['retry-after'];
        const waitMatch  = (res.data?.error?.message || '').match(/try again in ([\d.]+)s/i);
        const rawWaitMs = retryAfter ? Math.ceil(parseFloat(retryAfter) * 1000) + 2000
          : waitMatch ? Math.ceil(parseFloat(waitMatch[1]) * 1000) + 2000 : 60000;
        const MAX_WAIT_MS = 120000;
        if (rawWaitMs > MAX_WAIT_MS) {
          console.log(`⚡ ${model} quota exhausted (retry-after ${Math.round(rawWaitMs/1000)}s) — skipping to next model`);
          break;
        }
        console.log(`⏳ Rate limited on ${model}, waiting ${Math.round(rawWaitMs/1000)}s...`);
        await sleep(rawWaitMs);
        continue;
      }
      if (code === 'model_decommissioned' || res.status === 404) break;
      throw new Error(`Groq ${res.status}: ${JSON.stringify(res.data).slice(0, 120)}`);
    }
    consecutiveFails++;
  }
  throw new Error('All Groq models unavailable');
}

// ── MDX safety: fix bare < before digits/$ (same as writer sanitizeMdx) ──────

function sanitizeBareAngleBrackets(content) {
  const parts = content.split('---');
  if (parts.length < 3) return content;
  const fm = parts[0] + '---' + parts[1] + '---';
  let body = parts.slice(2).join('---');
  const lines = body.split('\n');
  const out = [];
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) inCode = !inCode;
    if (inCode || /^\s*<[A-Z]/.test(line)) { out.push(line); continue; }
    out.push(
      line
        .replace(/<(\d)/g, '&lt;$1')
        .replace(/<\$(\d)/g, 'under $$$1')
        .replace(/ < \$(\d)/g, ' under $$$1')
    );
  }
  return fm + out.join('\n');
}

// ── Rule-based internal link injection ───────────────────────────────────────

const CATEGORY_LINK_MAP = {
  'Google Ads':                           { anchor: 'Google Ads management', href: '/services/google-ads' },
  'Google Ads Advanced':                  { anchor: 'Google Ads management', href: '/services/google-ads' },
  'Microsoft Ads':                        { anchor: 'Google Ads management', href: '/services/google-ads' },
  'YouTube Ads':                          { anchor: 'Google Ads management', href: '/services/google-ads' },
  'Programmatic Advertising':             { anchor: 'Google Ads management', href: '/services/google-ads' },
  'Retargeting':                          { anchor: 'Google Ads management', href: '/services/google-ads' },
  'CTV & OTT':                            { anchor: 'Google Ads management', href: '/services/google-ads' },
  'Audio Advertising':                    { anchor: 'Google Ads management', href: '/services/google-ads' },
  'Meta Ads':                             { anchor: 'Meta Ads management', href: '/services/meta-ads' },
  'Facebook Ads':                         { anchor: 'Meta Ads management', href: '/services/meta-ads' },
  'Instagram Ads':                        { anchor: 'Meta Ads management', href: '/services/meta-ads' },
  'Instagram Marketing':                  { anchor: 'Meta Ads management', href: '/services/meta-ads' },
  'TikTok Ads':                           { anchor: 'social media management', href: '/services/social-media' },
  'TikTok Marketing':                     { anchor: 'social media management', href: '/services/social-media' },
  'Snapchat Advertising':                 { anchor: 'social media management', href: '/services/social-media' },
  'Pinterest Marketing':                  { anchor: 'social media management', href: '/services/social-media' },
  'Reddit & Community Marketing':         { anchor: 'social media management', href: '/services/social-media' },
  'Nextdoor & Neighborhood Marketing':    { anchor: 'local SEO services', href: '/services/local-seo' },
  'Review Platform Ads':                  { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' },
  'Local SEO':                            { anchor: 'local SEO services', href: '/services/local-seo' },
  'Google Business Profile Optimization': { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' },
  'Reputation Management':                { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' },
  'Analytics & Tracking':                 { anchor: 'analytics & reporting', href: '/services/analytics' },
  'AI & Automation':                      { anchor: 'AI agents & automation', href: '/services/ai-agents' },
  'Marketing Automation':                 { anchor: 'AI agents & automation', href: '/services/ai-agents' },
  'Email & SMS Marketing':                { anchor: 'email & SMS marketing', href: '/services/email-sms' },
  'Email Marketing':                      { anchor: 'email & SMS marketing', href: '/services/email-sms' },
  'Messaging & Community Marketing':      { anchor: 'email & SMS marketing', href: '/services/email-sms' },
  'Social Media':                         { anchor: 'social media management', href: '/services/social-media' },
  'Content Marketing':                    { anchor: 'social media management', href: '/services/social-media' },
  'Influencer Marketing':                 { anchor: 'social media management', href: '/services/social-media' },
  'Website & CRO':                        { anchor: 'website & landing page services', href: '/services/website' },
  'Marketing Strategy':                   { anchor: 'analytics & reporting', href: '/services/analytics' },
  'Local Business Strategy':              { anchor: 'local SEO services', href: '/services/local-seo' },
  'Tool Comparisons':                     { anchor: 'analytics & reporting', href: '/services/analytics' },
  'Offline Marketing':                    { anchor: 'local SEO services', href: '/services/local-seo' },
  'Coffee Shop Marketing':                { anchor: 'coffee shop marketing', href: '/for/coffee-shops' },
  'Coffee Shops':                         { anchor: 'coffee shop marketing', href: '/for/coffee-shops' },
  'Hair Salon Marketing':                 { anchor: 'hair salon marketing', href: '/for/hair-salons' },
  'Hair Salons':                          { anchor: 'hair salon marketing', href: '/for/hair-salons' },
  'Pet Groomer Marketing':                { anchor: 'pet groomer marketing', href: '/for/pet-groomers' },
  'Pet Groomers':                         { anchor: 'pet groomer marketing', href: '/for/pet-groomers' },
  'Dog Grooming Marketing':               { anchor: 'pet groomer marketing', href: '/for/pet-groomers' },
  'Fitness Studio Marketing':             { anchor: 'fitness studio marketing', href: '/for/fitness-studios' },
  'Fitness Studios':                      { anchor: 'fitness studio marketing', href: '/for/fitness-studios' },
};

function getCategoryLink(category) {
  if (CATEGORY_LINK_MAP[category]) return CATEGORY_LINK_MAP[category];
  const c = (category || '').toLowerCase();
  if (c.includes('google ads') || c.includes('ppc')) return { anchor: 'Google Ads management', href: '/services/google-ads' };
  if (c.includes('facebook') || c.includes('meta') || c.includes('instagram ad')) return { anchor: 'Meta Ads management', href: '/services/meta-ads' };
  if (c.includes('seo') || c.includes('local market')) return { anchor: 'local SEO services', href: '/services/local-seo' };
  if (c.includes('google business') || c.includes('gbp') || c.includes('review') || c.includes('reputation')) return { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' };
  if (c.includes('analytic') || c.includes('tracking')) return { anchor: 'analytics & reporting', href: '/services/analytics' };
  if (c.includes('ai') || c.includes('automat')) return { anchor: 'AI agents & automation', href: '/services/ai-agents' };
  if (c.includes('email') || c.includes('sms') || c.includes('message')) return { anchor: 'email & SMS marketing', href: '/services/email-sms' };
  if (c.includes('social') || c.includes('tiktok') || c.includes('instagram') || c.includes('content') || c.includes('influenc')) return { anchor: 'social media management', href: '/services/social-media' };
  if (c.includes('website') || c.includes('landing') || c.includes('cro')) return { anchor: 'website & landing page services', href: '/services/website' };
  if (c.includes('coffee') || c.includes('café') || c.includes('cafe')) return { anchor: 'coffee shop marketing', href: '/for/coffee-shops' };
  if (c.includes('salon') || c.includes('hair') || c.includes('beauty') || c.includes('barber')) return { anchor: 'hair salon marketing', href: '/for/hair-salons' };
  if (c.includes('groom') || c.includes('pet') || c.includes('dog')) return { anchor: 'pet groomer marketing', href: '/for/pet-groomers' };
  if (c.includes('fitness') || c.includes('gym') || c.includes('yoga') || c.includes('studio')) return { anchor: 'fitness studio marketing', href: '/for/fitness-studios' };
  return null;
}

/** Return true if the article body already has at least one /services/ or /for/ link. */
function hasInternalLinks(body) {
  return /\(\/services\/|\(\/for\//.test(body);
}

/**
 * Inject a Callout with a service link after the FIRST ## section.
 * Only runs on articles with no existing internal links.
 */
function injectServiceLink(content, category) {
  const parts = content.split(/^---\s*$/m);
  if (parts.length < 3) return null;
  const fmBlock = parts[0] + '---\n' + parts[1].replace(/^\n/, '') + '---';
  const body = parts.slice(2).join('---');

  if (hasInternalLinks(body)) return null;

  const svcLink = getCategoryLink(category);
  if (!svcLink) return null;

  // Find the end of the first ## section (next ## heading or first MDX component)
  const lines = body.split('\n');
  let insertAfter = -1;
  let foundFirstH2 = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      if (!foundFirstH2) { foundFirstH2 = true; continue; }
      // Second ## found — insert before it
      insertAfter = i - 1;
      break;
    }
    if (foundFirstH2 && /^<[A-Z]/.test(lines[i].trim())) {
      // MDX component marks end of first section
      insertAfter = i - 1;
      break;
    }
  }

  if (!foundFirstH2) return null; // no ## headings — skip

  // If no good spot found, insert before FAQ or at end of body
  if (insertAfter === -1) {
    const faqIdx = lines.findIndex(l => /^## (Frequently Asked|FAQ)/i.test(l));
    insertAfter = faqIdx > 0 ? faqIdx - 1 : lines.length - 1;
  }

  const callout = `\n<Callout type="tip">Want expert help? DataLatte's [${svcLink.anchor}](${svcLink.href}) service is built specifically for local small businesses.</Callout>\n`;
  lines.splice(insertAfter + 1, 0, callout);
  return fmBlock + lines.join('\n');
}

// ── Quality scores ────────────────────────────────────────────────────────────

function loadScores() {
  if (!fs.existsSync(SCORES_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(SCORES_PATH, 'utf8')).scores ?? {}; }
  catch { return {}; }
}

function saveScores(scores) {
  const existing = fs.existsSync(SCORES_PATH)
    ? JSON.parse(fs.readFileSync(SCORES_PATH, 'utf8'))
    : { _schema: 'Quality scores from Agent 2 — Auditor', scores: {} };
  existing.scores = scores;
  fs.writeFileSync(SCORES_PATH, JSON.stringify(existing, null, 2) + '\n');
}

// ── Syntax fixes ──────────────────────────────────────────────────────────────

function applyFixes(content) {
  let fixed = content;
  const appliedFixes = [];

  if (/<think>/i.test(fixed)) {
    fixed = fixed.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trimStart();
    appliedFixes.push('stripped think tags');
  }
  if (/^## ##/m.test(fixed)) {
    fixed = fixed.replace(/^## ## /gm, '## ');
    appliedFixes.push('fixed double headings');
  }
  if (/^title:\s+[^"'\n][^\n]*:[^\n]/m.test(fixed)) {
    fixed = fixed.replace(/^(title:\s+)([^"'\n][^\n]*)$/m,
      (_, p, t) => `${p}"${t.replace(/"/g, '\\"')}"`);
    appliedFixes.push('quoted title with colon');
  }
  if (fixed.startsWith('---') && (fixed.match(/^---/gm) || []).length === 1) {
    const lines = fixed.split('\n');
    let insertAfter = 0;
    for (let i = 1; i < lines.length; i++) {
      if (/^[a-zA-Z][\w-]*\s*:/.test(lines[i])) insertAfter = i;
      else if (lines[i].trim() === '' && insertAfter > 0) break;
    }
    if (insertAfter > 0) {
      lines.splice(insertAfter + 1, 0, '---');
      fixed = lines.join('\n');
      appliedFixes.push('added missing frontmatter close');
    }
  }
  return { fixed, appliedFixes };
}

function syntaxScanAll() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .filter(file => {
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      return /<think>/i.test(content)
        || /^## ##/m.test(content)
        || (content.startsWith('---') && (content.match(/^---/gm) || []).length === 1)
        || /^title:\s+[^"'\n][^\n]*:[^\n]/m.test(content);
    });
}

// ── Article improvement ───────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  m[1].split('\n').forEach(line => {
    const lm = line.match(/^(\w+):\s*(.*)$/);
    if (lm) fm[lm[1]] = lm[2].replace(/^["']|["']$/g, '');
  });
  return { fmRaw: m[1], body: m[2], fm };
}

async function improveArticle(filename, content) {
  const parsed = parseFrontmatter(content);
  if (!parsed) return null;
  const { fmRaw, body, fm } = parsed;

  const title    = fm.title    || filename.replace('.mdx', '').replace(/-/g, ' ');
  const category = fm.category || 'Local Marketing';

  // Replace ALL MDX component blocks with numbered placeholders to protect them
  // Includes new chart types: DonutChart, LineChart, CompareBar
  const mdxBlocks = [];
  const bodyWithPlaceholders = body.replace(
    /<(?:BarChart|StatRow|Funnel|Callout|DonutChart|LineChart|CompareBar)[\s\S]*?\/>/g,
    (match) => { mdxBlocks.push(match); return `__MDX_${mdxBlocks.length - 1}__`; }
  );

  const wordsBefore = bodyWithPlaceholders.split(/\s+/).filter(Boolean).length;

  // Send the FULL body — slicing to 4000 chars caused model to return only partial rewrites
  // which then failed the 85% word-count validation. Use full content up to 12000 chars.
  const bodyForPrompt = bodyWithPlaceholders.slice(0, 12000);

  const prompt = `You are a senior content editor improving a blog article for DataLatte.pro — a marketing agency helping US/UK local small businesses (coffee shops, hair salons, pet groomers, fitness studios).

Article title: "${title}"
Category: "${category}"

Current article (${wordsBefore} words). MDX components replaced with __MDX_N__ placeholders — leave ALL placeholders exactly where they are.

---
${bodyForPrompt}
---

YOUR TASK: Rewrite and improve this article. Return the COMPLETE improved body only. No frontmatter, no code fences, no preamble.

REQUIRED improvements:
1. Opening paragraph: replace any vague opener with a specific, data-driven hook. Example: instead of "Many businesses struggle with X" write "A hair salon owner spending $400/month on Google Ads told me she was getting zero calls — here's what changed when she fixed her keyword match types."
2. Thin sections: any ## section with fewer than 3 sentences must be expanded with specific, practical detail. Add real numbers ($, %, timeframes, platform names).
3. Generic advice: replace vague statements ("use social media") with specific tactics ("post a 15-second before/after Reel every Tuesday — this format gets 3× more saves than static images on Instagram in 2026").
4. Missing takeaway: if there is no "## The Bottom Line" or similar closing summary — add one (2-3 punchy sentences recapping the core insight).
5. Missing next step: if the article ends without directing the reader to act — add one closing sentence nudging them toward the next step.

STRICT RULES:
- Return the COMPLETE improved article body — do NOT truncate or stop early
- Keep every __MDX_N__ placeholder exactly in place — do not move, duplicate, or delete any
- Keep all ## and ### headings exactly as written
- Do NOT add new JSX, HTML tags, or MDX components
- Do NOT add new ## sections — only improve existing content
- Output ONLY the improved body, nothing else`;

  const raw = await callGroq(prompt, 4000);
  if (!raw || raw.length < 300) return null;

  // Restore MDX blocks
  const restored = raw.replace(/__MDX_(\d+)__/g, (_, i) => mdxBlocks[parseInt(i)] ?? '');

  // Validate all MDX blocks survived
  for (let i = 0; i < mdxBlocks.length; i++) {
    const firstChars = mdxBlocks[i].slice(0, 35);
    if (!restored.includes(firstChars)) {
      console.log(`  ⚠️  MDX block ${i} lost in output — skipping ${filename}`);
      return null;
    }
  }

  // Sanity: output shouldn't be drastically shorter (lowered to 70% — small models compress)
  const wordsAfter = restored.split(/\s+/).filter(Boolean).length;
  if (wordsAfter < wordsBefore * 0.70) {
    console.log(`  ⚠️  Output too short (${wordsAfter} vs ${wordsBefore} words, need ≥70%) — skipping`);
    return null;
  }

  console.log(`  📝 ${wordsBefore} → ${wordsAfter} words`);
  return `---\n${fmRaw}\n---\n${restored}`;
}

// ── Queue helpers ─────────────────────────────────────────────────────────────

function markForRegeneration(slug) {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return false;
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const entry = queue.queue.find(e => e.slug === slug);
  if (entry) { entry.status = 'pending'; delete entry.generatedDate; }
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n');
  return !!entry;
}

function fixQueueDuplicates() {
  const queuePath = path.join(process.cwd(), 'content/queue.json');
  if (!fs.existsSync(queuePath)) return 0;
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const PRIORITY = { published: 3, generating: 2, pending: 1 };
  const seen = {};
  let removed = 0;
  for (let i = queue.queue.length - 1; i >= 0; i--) {
    const e = queue.queue[i];
    if (seen[e.slug] && (PRIORITY[e.status] || 0) <= (PRIORITY[seen[e.slug].status] || 0)) {
      queue.queue.splice(i, 1); removed++;
    } else { seen[e.slug] = e; }
  }
  if (removed > 0) fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n');
  return removed;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔧 Fixer Agent starting...');

  const scores = loadScores();
  const fixedFiles    = [];
  const improvedFiles = [];
  const regenFiles    = [];

  // ── 1. Syntax scan + fix all articles ──────────────────────────────────────
  const brokenFiles = syntaxScanAll();
  console.log(`🔍 Syntax issues: ${brokenFiles.length}`);

  const allMdxFiles = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx')) : [];
  let mdxFixed = 0;
  let linkInjected = 0;

  for (const filename of allMdxFiles) {
    const fullPath = path.join(BLOG_DIR, filename);
    let content = fs.readFileSync(fullPath, 'utf8');
    const after = sanitizeBareAngleBrackets(content);
    if (after !== content) {
      fs.writeFileSync(fullPath, after);
      content = after;
      mdxFixed++;
    }
  }
  if (mdxFixed > 0) console.log(`🔧 MDX angle-bracket fixes: ${mdxFixed} files`);

  for (const filename of brokenFiles) {
    const fullPath = path.join(BLOG_DIR, filename);
    const original = fs.readFileSync(fullPath, 'utf8');
    const { fixed, appliedFixes } = applyFixes(original);
    if (fixed === original) continue;

    const wordCount = fixed.split(/\s+/).length;
    if (wordCount < 200) {
      fs.unlinkSync(fullPath);
      markForRegeneration(filename.replace('.mdx', ''));
      regenFiles.push({ file: filename, reason: `Only ${wordCount} words after fix` });
      console.log(`♻️  Queued for regen: ${filename}`);
    } else {
      fs.writeFileSync(fullPath, fixed);
      fixedFiles.push({ file: filename, fixes: appliedFixes });
      console.log(`✅ Syntax fixed: ${filename} (${appliedFixes.join(', ')})`);
    }
  }

  // ── 1b. Rule-based internal link injection (batch of 30/run) ───────────────
  const LINK_BATCH = 100;
  let linkCount = 0;
  for (const filename of allMdxFiles) {
    if (linkCount >= LINK_BATCH) break;
    const fullPath = path.join(BLOG_DIR, filename);
    const content = fs.readFileSync(fullPath, 'utf8');
    // Quick pre-check: skip if already has internal links
    if (hasInternalLinks(content)) continue;

    // Extract category from frontmatter
    const catMatch = content.match(/^category:\s*["']?([^"'\n]+)["']?/m);
    const category = catMatch ? catMatch[1].trim() : '';

    const injected = injectServiceLink(content, category);
    if (injected) {
      fs.writeFileSync(fullPath, injected);
      linkInjected++;
      linkCount++;
    }
  }
  if (linkInjected > 0) console.log(`🔗 Internal links injected: ${linkInjected} articles`);

  // ── 2. Improve low-quality articles ────────────────────────────────────────
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  const candidates = Object.entries(scores)
    .filter(([slug, data]) => {
      if ((data.score ?? 10) >= IMPROVE_THRESHOLD) return false;
      if (data.improvedAt && (now - new Date(data.improvedAt).getTime()) < thirtyDays) return false;
      return fs.existsSync(path.join(BLOG_DIR, `${slug}.mdx`));
    })
    .sort(([, a], [, b]) => {
      const scoreDiff = (a.score ?? 5) - (b.score ?? 5);
      return scoreDiff !== 0 ? scoreDiff : (a.checkedAt ?? '').localeCompare(b.checkedAt ?? '');
    })
    .slice(0, IMPROVE_BATCH);

  const totalNeedImprovement = Object.values(scores).filter(d =>
    (d.score ?? 10) < IMPROVE_THRESHOLD &&
    (!d.improvedAt || (now - new Date(d.improvedAt).getTime()) >= thirtyDays) &&
    fs.existsSync(path.join(BLOG_DIR, `${Object.keys(scores).find(k => scores[k] === d) || ''}.mdx`))
  ).length;

  console.log(`\n📈 Articles needing improvement: ${totalNeedImprovement}`);
  console.log(`🔧 Processing batch of ${candidates.length}...\n`);

  for (let i = 0; i < candidates.length; i++) {
    const [slug, scoreData] = candidates[i];
    const filename = `${slug}.mdx`;
    const fullPath = path.join(BLOG_DIR, filename);
    const original = fs.readFileSync(fullPath, 'utf8');

    console.log(`📝 [${i + 1}/${candidates.length}] ${slug} (score: ${scoreData.score}/10)...`);
    try {
      const improved = await improveArticle(filename, original);
      if (improved) {
        fs.writeFileSync(fullPath, improved);
        scores[slug] = { ...scoreData, improvedAt: new Date().toISOString(), improvedFrom: scoreData.score };
        improvedFiles.push({ file: filename, score: scoreData.score });
        console.log(`  ✅ Improved`);
      } else {
        console.log(`  ⏭️  Skipped (validation failed)`);
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }

    if (i < candidates.length - 1) await sleep(5000);
  }

  // Fix queue duplicates
  const dupeFixed = fixQueueDuplicates();
  const totalChanged = fixedFiles.length + improvedFiles.length + regenFiles.length + dupeFixed + linkInjected + mdxFixed;
  const remaining = Math.max(0, totalNeedImprovement - improvedFiles.length);

  console.log(`\n=== ${improvedFiles.length} improved, ${fixedFiles.length} syntax-fixed, ${regenFiles.length} requeued ===`);
  console.log(`FIXER_IMPROVED:${improvedFiles.length}`);
  console.log(`FIXER_REMAINING:${remaining}`);

  // ── 3. Commit ───────────────────────────────────────────────────────────────
  if (totalChanged > 0) {
    saveScores(scores);
    execSync('git config user.email "fixer-agent@datalatte.pro"');
    execSync('git config user.name "DataLatte Fixer"');

    const parts = [];
    if (improvedFiles.length) parts.push(`${improvedFiles.length} improved`);
    if (fixedFiles.length)    parts.push(`${fixedFiles.length} syntax-fixed`);
    if (regenFiles.length)    parts.push(`${regenFiles.length} requeued`);
    if (dupeFixed)            parts.push(`${dupeFixed} dupes removed`);
    if (linkInjected)         parts.push(`${linkInjected} links added`);
    if (mdxFixed)             parts.push(`${mdxFixed} mdx-fixed`);

    try {
      // Stage and commit first, then rebase on top of remote changes
      execSync('git add content/');
      execSync(`git commit -m "Fixer: ${parts.join(', ')} [vercel skip]"`);
      // Retry push up to 3× in case another agent pushed between our commit and push
      let pushed = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          execSync('git pull --rebase --autostash origin main', { stdio: 'inherit' });
          execSync('git push origin main');
          pushed = true;
          break;
        } catch {
          console.log(`⚠️  Push failed (attempt ${attempt + 1}/3) — retrying...`);
        }
      }
      if (!pushed) throw new Error('Push failed after 3 attempts');
    } catch (e) {
      if (!e.message?.includes('nothing to commit')) throw e;
    }
  }

  // ── 4. Telegram report ───────────────────────────────────────────────────────
  const time = new Date().toUTCString().slice(0, 25);
  let msg = `🔧 Fixer${totalChanged === 0 ? ' — nothing to fix ✅' : ''}\n🕐 ${time}\n`;

  if (improvedFiles.length > 0) {
    msg += `\n📈 Content improved (${improvedFiles.length}):\n`;
    msg += improvedFiles.slice(0, 5).map(f =>
      `  • ${f.file.replace('.mdx', '')} (was ${f.score}/10)`
    ).join('\n') + '\n';
  }
  if (fixedFiles.length > 0) {
    msg += `\n✅ Syntax fixed (${fixedFiles.length}):\n`;
    msg += fixedFiles.slice(0, 4).map(f =>
      `  • ${f.file.replace('.mdx', '')} — ${f.fixes.join(', ')}`
    ).join('\n') + '\n';
  }
  if (regenFiles.length > 0) {
    msg += `\n♻️ Requeued (${regenFiles.length}):\n`;
    msg += regenFiles.slice(0, 3).map(f => `  • ${f.file.replace('.mdx', '')} — ${f.reason}`).join('\n') + '\n';
  }

  if (linkInjected > 0) msg += `\n🔗 Service links injected: ${linkInjected} articles\n`;
  if (mdxFixed > 0) msg += `\n🔧 MDX fixes: ${mdxFixed} files\n`;
  msg += `\n📋 Remaining to improve: ${remaining}`;
  if (remaining > 0) msg += `\n⏭ Next batch triggered automatically`;

  await telegram(msg);
  console.log('✅ Fixer Agent done');
}

main().then(() => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
}).catch(async e => {
  console.log(`GROQ_TOKENS: ${_groqTokens}`);
  console.error('Fixer Agent error:', e.message);
  await telegram(`🔧 Fixer — failed ❌\n${e.message}`);
  process.exit(1);
});
