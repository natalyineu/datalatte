#!/usr/bin/env node
/**
 * Publish scheduled Telegram posts from Supabase social_posts to the channel.
 * Picks rows: platform='telegram', status='scheduled', scheduled_at <= now.
 * On success -> published (+ post_url, post_id_external, published_at). On error -> failed.
 *
 * Env: TELEGRAM_BOT_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *      TELEGRAM_CHANNEL_ID (default @datalattepro)
 * Usage: node scripts/publish-telegram.mjs [--dry]
 */
const dry = process.argv.includes("--dry");
const {
  TELEGRAM_BOT_TOKEN,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || "@datalattepro";
if (!TELEGRAM_BOT_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing TELEGRAM_BOT_TOKEN / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = (path, init = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...init.headers,
    },
  });

const now = new Date().toISOString();
const res = await sb(
  `social_posts?platform=eq.telegram&status=eq.scheduled&scheduled_at=lte.${encodeURIComponent(now)}&order=scheduled_at.asc&select=id,content`
);
if (!res.ok) throw new Error(`Supabase read failed: ${res.status} ${await res.text()}`);
const rows = await res.json();
console.log(`${rows.length} post(s) due`);

let failed = 0;
for (const row of rows) {
  if (dry) { console.log(`[dry] ${row.id}\n${row.content}\n`); continue; }
  const tg = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHANNEL_ID, text: row.content }),
  });
  const body = await tg.json().catch(() => ({}));
  const patch = body.ok
    ? {
        status: "published",
        post_id_external: String(body.result.message_id),
        post_url: `https://t.me/${String(TELEGRAM_CHANNEL_ID).replace(/^@/, "")}/${body.result.message_id}`,
        published_at: new Date().toISOString(),
        error_message: null,
      }
    : { status: "failed", error_message: String(body.description || `HTTP ${tg.status}`).slice(0, 500) };
  const up = await sb(`social_posts?id=eq.${row.id}`, { method: "PATCH", body: JSON.stringify(patch) });
  if (!up.ok) console.error(`DB update failed for ${row.id}: ${up.status} ${await up.text()}`);
  console.log(row.id, patch.status, patch.post_url || patch.error_message);
  if (patch.status === "failed") failed++;
}
if (failed) process.exit(1);
