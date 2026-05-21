#!/usr/bin/env node
/**
 * caretaker-agent.js — runs every 2 hours.
 *
 * Replaces: fixer-agent, audit-agent, faq-fixer, chart-adder,
 *           pipeline-manager, research-agent, improver-agent
 *
 * Phases each run:
 *   1. FIX    — repair syntax issues in all MDX, inject service links
 *   2. FAQ    — add FAQ sections to articles missing them (up to 5/run)
 *   3. CHARTS — add charts to articles missing them (up to 3/run)
 *   4. QUEUE  — refill queue if pending < 25
 *   5. COMMIT — one commit (or two if content changed → deploy trigger)
 *   6. REPORT — one Telegram health summary
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const { execSync } = require('child_process');

// ── CONFIG ────────────────────────────────────────────────────────────────────

const GROQ_KEY     = process.env.GROQ_API_KEY;
const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY;
const GH_TOKEN     = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const REPO         = 'natalyineu/datalatte';
const TG_TOKEN     = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT      = process.env.TELEGRAM_CHAT_ID;

const BLOG_DIR   = path.join(process.cwd(), 'content/blog');
const QUEUE_PATH = path.join(process.cwd(), 'content/queue.json');
const DEPLOY_FILE = path.join(process.cwd(), 'content/last-deploy.txt');

const GROQ_MODELS     = ['llama-3.3-70b-versatile', 'meta-llama/llama-4-scout-17b-16e-instruct', 'openai/gpt-oss-120b', 'qwen/qwen3-32b', 'llama-3.1-8b-instant'];
const CEREBRAS_MODELS = ['llama-3.3-70b', 'llama3.1-70b', 'llama3.1-8b'];

const FAQ_BATCH         = 5;   // max FAQ additions per run
const CHART_BATCH       = 3;   // max chart additions per run
const QUEUE_MIN_PENDING = 25;  // refill threshold
const QUEUE_REFILL      = 15;  // topics to add when refilling

let _tokens = 0;

// ── HTTP ──────────────────────────────────────────────────────────────────────

function fetchJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,
      headers: { 'User-Agent': 'DataLatte-Caretaker', ...options.headers },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data: null, raw: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ── LLM ──────────────────────────────────────────────────────────────────────

async function callLLM(prompt, maxTokens = 800) {
  if (CEREBRAS_KEY) {
    for (const model of CEREBRAS_MODELS) {
      const res = await fetchJson('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CEREBRAS_KEY}`, 'Content-Type': 'application/json' },
      }, JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.6, max_tokens: maxTokens }));
      if (res.status === 200) {
        _tokens += res.data?.usage?.total_tokens ?? 0;
        return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
      }
      if (res.status === 429 || res.status === 404) continue;
    }
  }
  for (const model of GROQ_MODELS) {
    const res = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    }, JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.6, max_tokens: maxTokens }));
    if (res.status === 200) {
      _tokens += res.data?.usage?.total_tokens ?? 0;
      return res.data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
    }
    const code = res.data?.error?.code;
    if (res.status === 429 || code === 'rate_limit_exceeded' || code === 'model_decommissioned') continue;
  }
  throw new Error('All LLM models unavailable');
}

// ── TELEGRAM ──────────────────────────────────────────────────────────────────

async function telegram(text) {
  if (!TG_TOKEN || !TG_CHAT) return;
  await fetchJson(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, JSON.stringify({ chat_id: TG_CHAT, text })).catch(() => {});
}

// ── GIT ───────────────────────────────────────────────────────────────────────

function gitCommitPush(message) {
  try {
    execSync('git config user.email "caretaker@datalatte.pro"', { encoding: 'utf8' });
    execSync('git config user.name "DataLatte Caretaker"', { encoding: 'utf8' });
    execSync('git add -A', { encoding: 'utf8' });
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (!status) { console.log('  Nothing to commit'); return false; }
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
    execSync('git pull --rebase --autostash origin main', { encoding: 'utf8' });
    execSync('git push origin main', { encoding: 'utf8' });
    console.log(`  ✅ Committed: ${message}`);
    return true;
  } catch (e) {
    if (e.message.includes('nothing to commit')) return false;
    console.error('  git error:', e.message.slice(0, 200));
    return false;
  }
}

// ── UTILS ──────────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw, fmRaw: '' };
  const fm = {};
  m[1].split('\n').forEach(line => {
    const lm = line.match(/^(\w+):\s*(.*)$/);
    if (lm) fm[lm[1]] = lm[2].replace(/^["']|["']$/g, '');
  });
  return { fm, body: m[2], fmRaw: m[1] };
}

/** Add or update `lastModified` field in a raw YAML frontmatter string. */
function stampLastModified(fmRaw) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  if (/^lastModified:/m.test(fmRaw)) {
    return fmRaw.replace(/^lastModified:.*$/m, `lastModified: "${today}"`);
  }
  return fmRaw + `\nlastModified: "${today}"`;
}

function allMdxFiles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1: SYNTAX FIX
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_LINK_MAP = {
  'Google Ads':                           { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'Google Ads Advanced':                  { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'Microsoft Ads':                        { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'YouTube Ads':                          { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'Programmatic Advertising':             { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'Retargeting':                          { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'CTV & OTT':                            { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'Audio Advertising':                    { anchor: 'Google Ads management',               href: '/services/google-ads' },
  'Meta Ads':                             { anchor: 'Meta Ads management',                 href: '/services/meta-ads' },
  'Facebook Ads':                         { anchor: 'Meta Ads management',                 href: '/services/meta-ads' },
  'Instagram Ads':                        { anchor: 'Meta Ads management',                 href: '/services/meta-ads' },
  'Instagram Marketing':                  { anchor: 'Meta Ads management',                 href: '/services/meta-ads' },
  'TikTok Ads':                           { anchor: 'social media management',             href: '/services/social-media' },
  'TikTok Marketing':                     { anchor: 'social media management',             href: '/services/social-media' },
  'Snapchat Advertising':                 { anchor: 'social media management',             href: '/services/social-media' },
  'Pinterest Marketing':                  { anchor: 'social media management',             href: '/services/social-media' },
  'Reddit & Community Marketing':         { anchor: 'social media management',             href: '/services/social-media' },
  'Nextdoor & Neighborhood Marketing':    { anchor: 'local SEO services',                 href: '/services/local-seo' },
  'Review Platform Ads':                  { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' },
  'Local SEO':                            { anchor: 'local SEO services',                 href: '/services/local-seo' },
  'Google Business Profile Optimization': { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' },
  'Reputation Management':                { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' },
  'Analytics & Tracking':                 { anchor: 'analytics & reporting',               href: '/services/analytics' },
  'AI & Automation':                      { anchor: 'AI agents & automation',              href: '/services/ai-agents' },
  'Marketing Automation':                 { anchor: 'AI agents & automation',              href: '/services/ai-agents' },
  'Email & SMS Marketing':                { anchor: 'email & SMS marketing',               href: '/services/email-sms' },
  'Email Marketing':                      { anchor: 'email & SMS marketing',               href: '/services/email-sms' },
  'Messaging & Community Marketing':      { anchor: 'email & SMS marketing',               href: '/services/email-sms' },
  'Social Media':                         { anchor: 'social media management',             href: '/services/social-media' },
  'Content Marketing':                    { anchor: 'social media management',             href: '/services/social-media' },
  'Influencer Marketing':                 { anchor: 'social media management',             href: '/services/social-media' },
  'Website & CRO':                        { anchor: 'website & landing page services',     href: '/services/website' },
  'Marketing Strategy':                   { anchor: 'analytics & reporting',               href: '/services/analytics' },
  'Local Business Strategy':              { anchor: 'local SEO services',                 href: '/services/local-seo' },
  'Tool Comparisons':                     { anchor: 'analytics & reporting',               href: '/services/analytics' },
  'Offline Marketing':                    { anchor: 'local SEO services',                 href: '/services/local-seo' },
  'Coffee Shop Marketing':                { anchor: 'coffee shop marketing',               href: '/for/coffee-shops' },
  'Coffee Shops':                         { anchor: 'coffee shop marketing',               href: '/for/coffee-shops' },
  'Hair Salon Marketing':                 { anchor: 'hair salon marketing',                href: '/for/hair-salons' },
  'Hair Salons':                          { anchor: 'hair salon marketing',                href: '/for/hair-salons' },
  'Pet Groomer Marketing':                { anchor: 'pet groomer marketing',               href: '/for/pet-groomers' },
  'Pet Groomers':                         { anchor: 'pet groomer marketing',               href: '/for/pet-groomers' },
  'Dog Grooming Marketing':               { anchor: 'pet groomer marketing',               href: '/for/pet-groomers' },
  'Fitness Studio Marketing':             { anchor: 'fitness studio marketing',            href: '/for/fitness-studios' },
  'Fitness Studios':                      { anchor: 'fitness studio marketing',            href: '/for/fitness-studios' },
};

function getCategoryLink(category) {
  if (CATEGORY_LINK_MAP[category]) return CATEGORY_LINK_MAP[category];
  const c = (category || '').toLowerCase();
  if (c.includes('google ads') || c.includes('ppc'))                            return { anchor: 'Google Ads management',               href: '/services/google-ads' };
  if (c.includes('facebook') || c.includes('meta') || c.includes('instagram ad')) return { anchor: 'Meta Ads management',                href: '/services/meta-ads' };
  if (c.includes('seo') || c.includes('local market'))                          return { anchor: 'local SEO services',                  href: '/services/local-seo' };
  if (c.includes('google business') || c.includes('gbp') || c.includes('review') || c.includes('reputation'))
                                                                                 return { anchor: 'Google Business Profile optimization', href: '/services/google-business-profile' };
  if (c.includes('analytic') || c.includes('tracking'))                         return { anchor: 'analytics & reporting',               href: '/services/analytics' };
  if (c.includes('ai') || c.includes('automat'))                                return { anchor: 'AI agents & automation',              href: '/services/ai-agents' };
  if (c.includes('email') || c.includes('sms') || c.includes('message'))       return { anchor: 'email & SMS marketing',               href: '/services/email-sms' };
  if (c.includes('social') || c.includes('tiktok') || c.includes('instagram') || c.includes('content') || c.includes('influenc'))
                                                                                 return { anchor: 'social media management',             href: '/services/social-media' };
  if (c.includes('website') || c.includes('landing') || c.includes('cro'))     return { anchor: 'website & landing page services',     href: '/services/website' };
  if (c.includes('coffee') || c.includes('café') || c.includes('cafe'))        return { anchor: 'coffee shop marketing',               href: '/for/coffee-shops' };
  if (c.includes('salon') || c.includes('hair') || c.includes('beauty') || c.includes('barber'))
                                                                                 return { anchor: 'hair salon marketing',                href: '/for/hair-salons' };
  if (c.includes('groom') || c.includes('pet') || c.includes('dog'))           return { anchor: 'pet groomer marketing',               href: '/for/pet-groomers' };
  if (c.includes('fitness') || c.includes('gym') || c.includes('yoga') || c.includes('studio'))
                                                                                 return { anchor: 'fitness studio marketing',            href: '/for/fitness-studios' };
  return null;
}

function hasInternalLinks(body) {
  return /\(\/services\/|\(\/for\//.test(body);
}

function injectServiceLink(content, category) {
  const parts = content.split(/^---\s*$/m);
  if (parts.length < 3) return null;
  const fmBlock = parts[0] + '---\n' + parts[1].replace(/^\n/, '') + '---';
  const body = parts.slice(2).join('---');
  if (hasInternalLinks(body)) return null;
  const svcLink = getCategoryLink(category);
  if (!svcLink) return null;
  const lines = body.split('\n');
  let insertAfter = -1;
  let foundFirstH2 = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      if (!foundFirstH2) { foundFirstH2 = true; continue; }
      insertAfter = i - 1;
      break;
    }
    if (foundFirstH2 && /^<[A-Z]/.test(lines[i].trim())) {
      insertAfter = i - 1;
      break;
    }
  }
  if (!foundFirstH2) return null;
  if (insertAfter === -1) {
    const faqIdx = lines.findIndex(l => /^## (Frequently Asked|FAQ)/i.test(l));
    insertAfter = faqIdx > 0 ? faqIdx - 1 : lines.length - 1;
  }
  const callout = `\n<Callout type="tip">Want expert help? DataLatte's [${svcLink.anchor}](${svcLink.href}) service is built specifically for local small businesses.</Callout>\n`;
  lines.splice(insertAfter + 1, 0, callout);
  return fmBlock + lines.join('\n');
}

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
    out.push(line
      .replace(/<(\d)/g, '&lt;$1')
      .replace(/<\$(\d)/g, 'under $$$1')
      .replace(/ < \$(\d)/g, ' under $$$1')
    );
  }
  return fm + out.join('\n');
}

function applyStructuralFixes(content) {
  let fixed = content;
  let changed = false;

  // Strip <think> tags
  if (/<think>/i.test(fixed)) {
    fixed = fixed.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trimStart();
    changed = true;
  }
  // Replace bare <Link href="...">text</Link> with markdown links (not a defined MDX component)
  if (/<Link\s+href=/.test(fixed)) {
    fixed = fixed.replace(/<Link\s+href="([^"]+)">([^<]+)<\/Link>/g, '[$2]($1)');
    changed = true;
  }
  // Fix double headings
  if (/^## ##/m.test(fixed)) {
    fixed = fixed.replace(/^## ## /gm, '## ');
    changed = true;
  }
  // Fix title with unquoted colon
  if (/^title:\s+[^"'\n][^\n]*:[^\n]/m.test(fixed)) {
    fixed = fixed.replace(/^(title:\s+)([^"'\n][^\n]*)$/m,
      (_, p, t) => `${p}"${t.replace(/"/g, '\\"')}"`);
    changed = true;
  }
  // Fix double-escaped title: title:" \"Actual Title\""
  if (/^title:" \\".*\\""/m.test(fixed)) {
    fixed = fixed.replace(/^(title:)" \\"(.*)\\""/m, (_, prefix, val) => `${prefix} "${val}"`);
    changed = true;
  }
  // Fix multi-line Callout where closing tag is on same line as content text
  // Pattern: <Callout ...>\nsome text.</Callout> → needs </Callout> on its own line
  if (/<Callout[^>]*>\n[^\n]+<\/Callout>/.test(fixed)) {
    fixed = fixed.replace(/(<Callout[^>]*>\n)([^\n]+)(<\/Callout>)/g, '$1$2\n$3');
    changed = true;
  }
  // Fix blank line after opening frontmatter fence (causes gray-matter to mis-parse)
  if (/^---\n\n/.test(fixed)) {
    fixed = fixed.replace(/^---\n\n/, '---\n');
    changed = true;
  }
  // Fix missing frontmatter close
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
      changed = true;
    }
  }

  return { fixed, changed };
}

function fixQueueDuplicates() {
  if (!fs.existsSync(QUEUE_PATH)) return 0;
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const PRIORITY = { published: 3, generating: 2, pending: 1 };
  const seen = {};
  let removed = 0;
  for (let i = queue.queue.length - 1; i >= 0; i--) {
    const e = queue.queue[i];
    if (seen[e.slug] && (PRIORITY[e.status] || 0) <= (PRIORITY[seen[e.slug].status] || 0)) {
      queue.queue.splice(i, 1);
      removed++;
    } else {
      seen[e.slug] = e;
    }
  }
  if (removed > 0) fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');
  return removed;
}

/**
 * Reset entries stuck in "generating" back to "pending".
 * Happens when the writer crashes mid-run and never marks them published.
 * Safe to run: if the article was actually written, it exists as an MDX file
 * and the writer will detect it's already published before writing again.
 */
function resetStuckGenerating() {
  if (!fs.existsSync(QUEUE_PATH)) return 0;
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  let reset = 0;
  for (const e of queue.queue) {
    if (e.status === 'generating') {
      e.status = 'pending';
      reset++;
    }
  }
  if (reset > 0) fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');
  return reset;
}

async function runFixPhase() {
  console.log('\n═══ PHASE 1: SYNTAX FIX ═══');
  const files = allMdxFiles();
  console.log(`  Scanning ${files.length} MDX files...`);
  let structFixed = 0, angleFixed = 0, linkInjected = 0;

  for (const filename of files) {
    const fullPath = path.join(BLOG_DIR, filename);
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Structural fixes
    const { fixed: strFixed, changed: strChanged } = applyStructuralFixes(content);
    if (strChanged) { content = strFixed; modified = true; structFixed++; }

    // Angle bracket sanitization
    const angleResult = sanitizeBareAngleBrackets(content);
    if (angleResult !== content) { content = angleResult; modified = true; angleFixed++; }

    // Service link injection
    const { fm } = parseFrontmatter(content);
    const linked = injectServiceLink(content, fm.category || '');
    if (linked) { content = linked; modified = true; linkInjected++; }

    if (modified) fs.writeFileSync(fullPath, content);
  }

  const dupRemoved  = fixQueueDuplicates();
  const genReset    = resetStuckGenerating();

  console.log(`  Structural fixes: ${structFixed}`);
  console.log(`  Angle-bracket fixes: ${angleFixed}`);
  console.log(`  Service links injected: ${linkInjected}`);
  console.log(`  Queue duplicates removed: ${dupRemoved}`);
  if (genReset > 0) console.log(`  ⚠️  Stuck "generating" reset: ${genReset}`);

  return { structFixed, angleFixed, linkInjected, dupRemoved, genReset };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2: FAQ ENRICHMENT
// ═══════════════════════════════════════════════════════════════════════════════

function hasFaq(body) {
  return /^##\s+(Frequently Asked Questions|FAQ)/im.test(body);
}

async function generateFaq(title, category, bodySnippet) {
  const snippet = bodySnippet.slice(0, 800).replace(/[#*`<>]/g, '').trim();
  const prompt = `You are writing a FAQ section for a blog post on DataLatte.pro, a local marketing agency website.

Article title: "${title}"
Category: "${category}"
Article excerpt: "${snippet}"

Write EXACTLY 5 FAQ questions and answers. Format:

### Question one here?

Answer here. 2-3 sentences. Specific and practical.

(repeat for all 5)

Rules:
- Questions must be what a local small business owner would actually Google
- Answers must be direct, 2-4 sentences, no fluff
- Use real numbers where possible
- Output ONLY the 5 Q&A blocks — no preamble, no closing text, no headers
- Do NOT use <Callout> or any JSX`;

  const raw = await callLLM(prompt, 700);
  return '\n\n## Frequently Asked Questions\n\n' + raw.trim();
}

async function runFaqPhase() {
  console.log('\n═══ PHASE 2: FAQ ENRICHMENT ═══');
  const files = allMdxFiles();
  const noFaq = files.filter(f => {
    const { body } = parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'));
    return !hasFaq(body);
  });
  console.log(`  Articles without FAQ: ${noFaq.length}`);
  if (noFaq.length === 0) return { added: 0, remaining: 0 };

  const batch = noFaq.slice(0, FAQ_BATCH);
  let added = 0;

  for (let idx = 0; idx < batch.length; idx++) {
    const filename = batch[idx];
    const fullPath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { fm, body, fmRaw } = parseFrontmatter(raw);
    const title    = fm.title    || filename.replace('.mdx', '').replace(/-/g, ' ');
    const category = fm.category || '';

    try {
      console.log(`  ✍️  FAQ: ${title.slice(0, 55)}...`);
      const faqSection = await generateFaq(title, category, body);
      const updatedBody = body.trimEnd() + faqSection + '\n';
      const updatedFm = stampLastModified(fmRaw);
      fs.writeFileSync(fullPath, `---\n${updatedFm}\n---\n${updatedBody}`);
      added++;
    } catch (e) {
      console.log(`  ⚠️  Failed ${filename}: ${e.message}`);
    }

    if (idx < batch.length - 1) await sleep(3000);
  }

  console.log(`  Added FAQ to ${added}/${batch.length}`);
  return { added, remaining: noFaq.length - added };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3: CHART ENRICHMENT
// ═══════════════════════════════════════════════════════════════════════════════

function hasCharts(body) {
  return /<BarChart|<StatRow|<Funnel|<DonutChart|<LineChart|<CompareBar/.test(body);
}

function pickChartTypes(title, body) {
  const t = (title + ' ' + body.slice(0, 500)).toLowerCase();
  if (/vs\.?|versus|compare|comparison|which is better/.test(t))              return ['CompareBar', 'StatRow'];
  if (/over time|month|quarter|year|trend|growth|season|weekly|monthly/.test(t)) return ['LineChart',   'StatRow'];
  if (/budget|breakdown|split|allocat|spend|portion|percentage/.test(t))      return ['DonutChart',  'StatRow'];
  return ['BarChart', 'StatRow'];
}

const CHART_FORMATS = {
  BarChart:   `<BarChart\n  title="Descriptive chart title"\n  labels="Label 1|Label 2|Label 3|Label 4|Label 5"\n  values="45|38|62|29|51"\n  unit="%"\n  highlights="Label 3"\n  caption="Source or context note"\n/>`,
  DonutChart: `<DonutChart\n  title="Budget breakdown"\n  labels="Category A|Category B|Category C|Category D"\n  values="40|25|20|15"\n  unit="%"\n  centerLabel="Budget"\n  caption="Source or context note"\n/>`,
  LineChart:  `<LineChart\n  title="Trend over time"\n  labels="Jan|Feb|Mar|Apr|May|Jun"\n  values="12|18|15|24|30|28"\n  unit="%"\n  area="true"\n  caption="Source or context note"\n/>`,
  CompareBar: `<CompareBar\n  title="Side-by-side comparison"\n  leftLabel="Option A"\n  rightLabel="Option B"\n  metrics="Avg CPC|CTR|Conversion Rate|ROI"\n  leftValues="3.50|4.2|6.1|210"\n  rightValues="1.20|1.8|3.4|140"\n  unit="$"\n  caption="Source or context note"\n/>`,
  StatRow:    `<StatRow\n  title="KEY NUMBERS"\n  values="$3.50|82%|4.2×|14 days"\n  labels="Avg CPC|Conversion rate|ROI|Time to results"\n  subs="per click|for local searches|vs. no ads|typical"\n  trends="neutral|up|up|neutral"\n/>`,
};

async function generateCharts(title, category, body) {
  const snippet = body.slice(0, 1000).replace(/[<>]/g, '').trim();
  const [type1, type2] = pickChartTypes(title, body);

  const prompt = `You are adding visual data components to a blog post on DataLatte.pro, a local marketing agency for small businesses.

Article title: "${title}"
Category: "${category}"
Article excerpt: "${snippet}"

Generate EXACTLY 2 visual components. Output ONLY raw MDX — no prose, no backticks, no explanation.

Component 1 must be: <${type1}>
Component 2 must be: <${type2}>

Format examples (use same attribute names and pipe-separated values):

${CHART_FORMATS[type1]}

${CHART_FORMATS[type2]}

Rules:
- Use real-world benchmark numbers relevant to the article topic
- All values are pipe-separated strings
- highlights (BarChart) must exactly match one of the labels
- StatRow trends must be: "up", "down", or "neutral"
- Output ONLY the two components, separated by a blank line`;

  const raw = await callLLM(prompt, 600);

  const m1 = raw.match(new RegExp(`<${type1}[\\s\\S]*?\\/>`));
  const m2 = raw.match(new RegExp(`<${type2}[\\s\\S]*?\\/>`));

  if (m1 && m2) return { chart1: m1[0].trim(), chart2: m2[0].trim() };

  // Fallback to BarChart + StatRow
  const fb1 = raw.match(/<BarChart[\s\S]*?\/>/);
  const fb2 = raw.match(/<StatRow[\s\S]*?\/>/);
  if (fb1 && fb2) return { chart1: fb1[0].trim(), chart2: fb2[0].trim() };

  throw new Error(`Chart generation returned unexpected format:\n${raw.slice(0, 200)}`);
}

function injectCharts(body, chart1, chart2) {
  const lines = body.split('\n');
  const h2Positions = [];
  lines.forEach((line, i) => { if (/^##\s/.test(line)) h2Positions.push(i); });

  if (h2Positions.length < 2) {
    const firstBlank = lines.findIndex((l, i) => i > 5 && l.trim() === '');
    const insertAt = firstBlank > 0 ? firstBlank + 1 : Math.floor(lines.length / 2);
    lines.splice(insertAt, 0, '', chart1, '', chart2, '');
    return lines.join('\n');
  }

  // Insert chart1 after first paragraph of 2nd heading
  const h2a = h2Positions[1];
  let insertChart = h2a + 2;
  for (let i = h2a + 2; i < Math.min(h2a + 15, lines.length); i++) {
    if (lines[i].trim() === '' && i > h2a + 2) { insertChart = i + 1; break; }
  }
  lines.splice(insertChart, 0, '', chart1, '');

  // Insert chart2 after first paragraph of 3rd heading (offset by splice above)
  const h2b = h2Positions[Math.min(2, h2Positions.length - 1)] + 3;
  let insertStat = h2b + 2;
  for (let i = h2b + 2; i < Math.min(h2b + 15, lines.length); i++) {
    if (lines[i].trim() === '' && i > h2b + 2) { insertStat = i + 1; break; }
  }
  lines.splice(insertStat, 0, '', chart2, '');

  return lines.join('\n');
}

async function runChartPhase() {
  console.log('\n═══ PHASE 3: CHART ENRICHMENT ═══');
  const files = allMdxFiles();
  const noCharts = files.filter(f => {
    const { body } = parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'));
    return !hasCharts(body);
  });
  console.log(`  Articles without charts: ${noCharts.length}`);
  if (noCharts.length === 0) return { added: 0, remaining: 0 };

  // Prefer articles that already have FAQ (more complete content)
  const withFaq = noCharts.filter(f => {
    const { body } = parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'));
    return hasFaq(body);
  });
  const pool  = withFaq.length > 0 ? withFaq : noCharts;
  const batch = pool.slice(0, CHART_BATCH);
  let added = 0;

  for (let idx = 0; idx < batch.length; idx++) {
    const filename = batch[idx];
    const fullPath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { fm, body, fmRaw } = parseFrontmatter(raw);
    const title    = fm.title    || filename.replace('.mdx', '').replace(/-/g, ' ');
    const category = fm.category || '';

    try {
      console.log(`  📊 Charts: ${title.slice(0, 55)}...`);
      const { chart1, chart2 } = await generateCharts(title, category, body);
      const updatedBody = injectCharts(body, chart1, chart2);
      const updatedFm = stampLastModified(fmRaw);
      fs.writeFileSync(fullPath, `---\n${updatedFm}\n---\n${updatedBody}`);
      added++;
    } catch (e) {
      console.log(`  ⚠️  Failed ${filename}: ${e.message}`);
    }

    if (idx < batch.length - 1) await sleep(3000);
  }

  console.log(`  Added charts to ${added}/${batch.length}`);
  return { added, remaining: noCharts.length - added };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4: QUEUE REFILL
// ═══════════════════════════════════════════════════════════════════════════════

async function runQueueRefill() {
  console.log('\n═══ PHASE 4: QUEUE REFILL ═══');
  if (!fs.existsSync(QUEUE_PATH)) { console.log('  queue.json not found'); return { added: 0 }; }

  const queue     = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const pending   = queue.queue.filter(e => e.status === 'pending').length;
  const published = queue.queue.filter(e => e.status === 'published').length;
  console.log(`  Published: ${published} | Pending: ${pending}`);

  if (pending >= QUEUE_MIN_PENDING) {
    console.log(`  Queue healthy — skipping`);
    return { added: 0, pending, published };
  }

  console.log(`  Pending too low (${pending} < ${QUEUE_MIN_PENDING}) — generating ${QUEUE_REFILL} topics`);

  const catCount = {};
  for (const e of queue.queue) {
    const cat = e.cluster || e.category || 'Unknown';
    catCount[cat] = (catCount[cat] || 0) + 1;
  }
  const topCats = Object.entries(catCount)
    .sort((a, b) => b[1] - a[1]).slice(0, 12)
    .map(([c, n]) => `  ${c}: ${n}`).join('\n');

  const existingSlugs = new Set(queue.queue.map(e => e.slug));

  const prompt = `You are a content strategist for DataLatte.pro — a marketing blog for local small businesses (coffee shops, hair salons, pet groomers, fitness studios) in the US/UK/AU.

Current queue category counts:
${topCats}

Suggest exactly ${QUEUE_REFILL} new article ideas. Focus on: AI for local business, specific niche + tool combinations, practical how-to guides. Avoid generic Google Ads topics (over-represented).

Return ONLY a JSON array, no explanation:
[{"slug":"url-slug","title":"Full Article Title","primaryKeyword":"seo keyword phrase","cluster":"Cluster Name","niche":"general"}]

Valid clusters: Google Ads, Meta Ads, Local SEO, Google Business Profile Optimization, AI & Automation, Email & SMS Marketing, Instagram Marketing, TikTok Marketing, Facebook Ads, Marketing Automation, Coffee Shop Marketing, Hair Salon Marketing, Pet Groomer Marketing, Fitness Studio Marketing, Social Media, Analytics & Tracking, Website & CRO, Marketing Strategy
Valid niches: general, coffee-shops, hair-salons, pet-groomers, fitness-studios`;

  let added = 0;
  try {
    const response = await callLLM(prompt, 2000);
    const match = response.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array in response');
    const suggestions = JSON.parse(match[0]);

    for (const art of suggestions) {
      if (!art.slug || existingSlugs.has(art.slug)) continue;
      queue.queue.push({
        slug: art.slug,
        title: art.title,
        primaryKeyword: art.primaryKeyword || art.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim(),
        cluster: art.cluster || 'Marketing Strategy',
        targetWords: 1500,
        status: 'pending',
        niche: art.niche || 'general',
        addedDate: new Date().toISOString(),
      });
      existingSlugs.add(art.slug);
      added++;
    }

    if (added > 0) {
      fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');
      console.log(`  Added ${added} new topics to queue`);
    }
  } catch (e) {
    console.log(`  Queue refill failed: ${e.message}`);
  }

  return { added, pending: pending + added, published };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  const startTime = Date.now();
  const timeStr   = new Date().toUTCString().slice(5, 22) + ' UTC';
  console.log(`🧰 Caretaker starting — ${timeStr}`);

  if (!GROQ_KEY && !CEREBRAS_KEY) { console.error('❌ No LLM API key'); process.exit(1); }
  if (!GH_TOKEN)                  { console.error('❌ No GH_TOKEN');     process.exit(1); }

  // ── Phase 1: Syntax fix (no LLM, always runs) ──────────────────────────────
  let fixStats = { structFixed: 0, angleFixed: 0, linkInjected: 0, dupRemoved: 0 };
  try { fixStats = await runFixPhase(); }
  catch (e) { console.error('Fix phase error:', e.message); }

  const fixCount = fixStats.structFixed + fixStats.angleFixed;

  // Commit syntax fixes immediately (before LLM phases, so they're not lost if LLM times out)
  if (fixCount > 0 || fixStats.linkInjected > 0 || fixStats.dupRemoved > 0) {
    const parts = [];
    if (fixCount > 0)                parts.push(`fix ${fixCount} syntax issues`);
    if (fixStats.linkInjected > 0)   parts.push(`inject ${fixStats.linkInjected} service links`);
    if (fixStats.dupRemoved > 0)     parts.push(`remove ${fixStats.dupRemoved} queue duplicates`);
    gitCommitPush(`Caretaker: ${parts.join(', ')} [vercel skip]`);
  }

  // ── Phase 2: FAQ enrichment ────────────────────────────────────────────────
  let faqStats = { added: 0, remaining: 0 };
  try { faqStats = await runFaqPhase(); }
  catch (e) { console.error('FAQ phase error:', e.message); }

  // ── Phase 3: Chart enrichment (skip if FAQ batch maxed — don't run too long) ──
  let chartStats = { added: 0, remaining: 0 };
  if (faqStats.added < FAQ_BATCH) {
    try { chartStats = await runChartPhase(); }
    catch (e) { console.error('Chart phase error:', e.message); }
  } else {
    console.log('\n═══ PHASE 3: CHART ENRICHMENT ═══');
    console.log(`  Skipped — FAQ batch was full (${faqStats.added})`);
  }

  // ── Phase 4: Queue refill ──────────────────────────────────────────────────
  let queueStats = { added: 0, pending: 0, published: 0 };
  try { queueStats = await runQueueRefill(); }
  catch (e) { console.error('Queue refill error:', e.message); }

  // ── Commit enrichment + queue changes ─────────────────────────────────────
  const enrichParts = [];
  if (faqStats.added   > 0) enrichParts.push(`FAQ: +${faqStats.added}`);
  if (chartStats.added > 0) enrichParts.push(`charts: +${chartStats.added}`);
  if (queueStats.added > 0) enrichParts.push(`queue: +${queueStats.added} topics`);

  if (enrichParts.length > 0) {
    gitCommitPush(`Caretaker: ${enrichParts.join(', ')} [vercel skip]`);
  }

  // ── Deploy trigger (if blog content was enriched) ─────────────────────────
  const contentChanged = faqStats.added > 0 || chartStats.added > 0;
  if (contentChanged) {
    const n = faqStats.added + chartStats.added;
    fs.writeFileSync(DEPLOY_FILE, `${new Date().toISOString()} — caretaker enriched ${n} articles\n`);
    gitCommitPush(`Deploy: caretaker enriched ${n} articles`);
  }

  // ── Remaining counts for report ────────────────────────────────────────────
  let noFaqCount = 0, noChartsCount = 0;
  for (const f of allMdxFiles()) {
    const { body } = parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'));
    if (!hasFaq(body))    noFaqCount++;
    if (!hasCharts(body)) noChartsCount++;
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);

  // ── Telegram report ────────────────────────────────────────────────────────
  let msg = `🧰 Caretaker — ${timeStr}\n\n`;
  msg += `📊 ${queueStats.published} published · ${queueStats.pending} pending\n`;
  msg += `⏱️ Took ${elapsed}s · ${_tokens} tokens\n`;

  if (fixCount > 0 || fixStats.linkInjected > 0 || fixStats.genReset > 0) {
    msg += `\n🔧 Fixed:\n`;
    if (fixStats.structFixed  > 0) msg += `  • ${fixStats.structFixed} structural issues\n`;
    if (fixStats.angleFixed   > 0) msg += `  • ${fixStats.angleFixed} angle-bracket escapes\n`;
    if (fixStats.linkInjected > 0) msg += `  • ${fixStats.linkInjected} service links injected\n`;
    if (fixStats.genReset     > 0) msg += `  • ${fixStats.genReset} stuck "generating" entries reset ⚠️\n`;
  }

  if (faqStats.added > 0 || chartStats.added > 0) {
    msg += `\n✨ Enriched:\n`;
    if (faqStats.added   > 0) msg += `  • ${faqStats.added} articles got FAQ sections\n`;
    if (chartStats.added > 0) msg += `  • ${chartStats.added} articles got charts\n`;
  }

  if (queueStats.added > 0) msg += `\n📥 Queue: +${queueStats.added} new topics added\n`;

  if (noFaqCount > 0 || noChartsCount > 0) {
    msg += `\n📋 Still pending enrichment:\n`;
    if (noFaqCount    > 0) msg += `  • ${noFaqCount} need FAQ\n`;
    if (noChartsCount > 0) msg += `  • ${noChartsCount} need charts\n`;
  }

  const nothing = fixCount === 0 && faqStats.added === 0 && chartStats.added === 0 && queueStats.added === 0;
  if (nothing) msg += `\n✅ Everything is clean!`;

  await telegram(msg);

  // Structured output for workflow summary
  console.log(`\n🏁 Caretaker done in ${elapsed}s`);
  console.log(`CARETAKER_FIXED:${fixCount}`);
  console.log(`CARETAKER_LINKS:${fixStats.linkInjected}`);
  console.log(`CARETAKER_FAQ:${faqStats.added}`);
  console.log(`CARETAKER_CHARTS:${chartStats.added}`);
  console.log(`CARETAKER_QUEUE_ADDED:${queueStats.added}`);
  console.log(`CARETAKER_PENDING:${queueStats.pending}`);
  console.log(`GROQ_TOKENS:${_tokens}`);
}

main().catch(async e => {
  console.error('Caretaker fatal:', e.message);
  await telegram(`🧰 Caretaker — failed ❌\n${e.message.slice(0, 200)}`);
  process.exit(1);
});
