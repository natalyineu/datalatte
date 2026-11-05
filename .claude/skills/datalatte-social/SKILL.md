---
name: datalatte-social
description: Run DataLatte social media (Telegram, X, LinkedIn, Telegraph) with the Supabase table social_posts, scheduled auto-publishing to Telegram and X, images/videos in Storage, and the X Ads test. Use when asked to write, plan, schedule, publish or log a social post, make a reel/video/cover, check what was published, avoid reposting, or touch X/Telegram automation or costs.
---

# DataLatte social skill

Supabase project `datalatte` (`olsxxfwvwsycwzihbmdn`). Owner Nataliia works in **Europe/Warsaw** time. Replies to her: short, in Russian.

## What is automated
| Platform | How it runs | Notes |
|---|---|---|
| **Telegram** `@datalattepro` | fully automatic | Edge Function `publish-telegram`, pg_cron `publish-telegram-hourly` (`0 * * * *`) |
| **X** `@datalattepro` | automatic for rows with `status='scheduled'` | Edge Function `publish-x`, pg_cron `publish-x-hourly` (`0 * * * *`) |
| **LinkedIn** | manual (copy-paste) | no API; owner sends the post link back |
| **Telegraph** | one article published | page edits need the access token, which lives only in the session scratchpad |
| X link sync | manual, on request only | Edge Function `sync-x-posts`; **no cron** (owner declined auto-run) |

Posts go out at the first cron tick after `scheduled_at` (hourly at :00, so 12:00 Warsaw = 12:00). Store `scheduled_at` as timestamptz computed with `at time zone 'Europe/Warsaw'` (DST-safe).

## Tables
`social_posts`: `platform` (telegram, twitter, linkedin, telegraph, …), `status` (`draft`→`scheduled`→`published` | `failed`), `title`, `content` (exact text), `destination_url`, `utm_*`, `post_url`, `post_id_external`, `scheduled_at`, `published_at`, `error_message`, `media_url`, `media_type` (`image`|`video`), `reminded_at` (unused).
DB rules: `published` needs `post_url` + `published_at`; `(platform, post_url)` unique; platform/status/media_type have check constraints.
`bot_jokes` (text, used_count, last_used_at): jokes for Telegram comments, least recently used first, 119 rows, add rows to extend. `social_settings` (key/value): `x_user_id` cache.
Storage bucket `social-media` (public read, 50 MB, png/jpg/webp/gif/mp4): public URL `https://olsxxfwvwsycwzihbmdn.supabase.co/storage/v1/object/public/social-media/<file>`.

## Workflow
1. **Check history first** (never repost a topic/link without looking):
   `select platform,status,title,destination_url,post_url,published_at from social_posts order by coalesce(published_at,created_at) desc limit 30;`
2. **Source** = an indexable blog post (`content/blog/*.mdx`, no `noindex`), service page or radar signal. **Only facts that are in the source** (same rule as `datalatte-article`). No invented stats, cases, quotes.
3. Insert drafts with `destination_url` + UTM, owner approves, then set `scheduled` + `scheduled_at`. Nothing external happens without her explicit yes.
4. After manual publishing: `published` + `post_url` + `post_id_external` + `published_at`. Report what was inserted / published / still draft.
5. **Never retry a timed-out send** (Telegram once delivered 10 queued duplicates). On a timeout mark `failed`, look at the channel first.

## Telegram
- Text ≤ ~900 chars, hook first, plain, 0-2 emojis. Raw URLs in `content` are sent as a clickable **"Read the full guide →"** (UTM hidden). Posts with `media_url` are not sent yet (planned: sendPhoto/sendVideo).
- After each post the bot sets one reaction (cycles through 14, no repeat) and replies with a joke **under the post** (the reply goes to the post's auto-forwarded copy in the linked chat `datalatte Chat`; the bot must be admin there).
- Function modes: `?dry=1`, `?react=<id>`, `?delete=9-18`, `?info=1`, `?diag=1`. Run once now: `net.http_post` to `/functions/v1/publish-telegram` with the anon key.
- Bot is `@datalattecontentbot` (secret `TELEGRAM_BOT_TOKEN` in Supabase). Never put tokens in chat or files.

## X
- `publish-x` (OAuth 1.0a user context, secrets `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET`). Text is posted verbatim; image (≤5 MB) or video (chunked upload) when `media_url`/`media_type` set. Modes: `?whoami=1`, `?dry=1`.
- **Cost (official pricing page, pay-per-use credits):** post $0.015; post **with a URL $0.20**; own-post reads $0.001 (other posts $0.005); user lookup $0.01. Default is **no link in the text** (link lives in the profile). Owner set a spend cap in the X console; keep balance low.
- Draft X texts: `Daily NN X: …` (≤ ~210 chars with link, link added by hand if wanted). They stay `draft`; only `Reel NN` rows are scheduled.
- `sync-x-posts` (secret `X_BEARER_TOKEN`) reads the latest 5 posts and marks matching drafts `published` by the article slug in the expanded link. Run only when asked (`?dry=1` first). Do **not** scrape X via mirrors/proxies (blocked by the harness and against policy); ask for the post URL instead.
- X post URL → time: `(tweet_id >> 22) + 1288834974657` ms. LinkedIn `urn:li:activity:<id>`: `id >> 22` ms.

## LinkedIn
Post text = Telegram text without the link block + "Full guide in the first comment." Link (with `utm_source=linkedin`) goes in the first comment. Drafts: `Daily NN LinkedIn: …`. Articles: long text + cover (`1920×1080`, brand colors). Owner publishes and sends the URL.

## Media (images and videos)
- **Reels generator:** `.claude/skills/datalatte-social/reels/` (`videos.json` + `gen.js`). Playwright renders 4 stills per video, ffmpeg crossfades them: 1080×1920, H.264, 30 fps, ~11 s, no audio. Run: `NODE_PATH=<global modules>:<repo>/node_modules node gen.js [n …]` inside a scratch folder with `videos.json` copied. Style: bg `#2c1a0e`, cream `#f5e6d3`, accent `#d4a574`, logo "☕ DataLatte" top-left, kicker, 2-5 short cream lines (≤17 chars), accent line, source, footer `datalatte.pro`. Cream/accent text only with sourced numbers.
- **Upload to the bucket** (no service key available): `create policy tmp_anon_upload_social_media on storage.objects for insert to anon with check (bucket_id='social-media')` → `curl -X POST .../storage/v1/object/social-media/<file> -H "apikey: <anon>" -H "Authorization: Bearer <anon>" -H "Content-Type: video/mp4" --data-binary @file` → **`drop policy` right away** and confirm `pg_policies` has none left (the drop asks the owner for approval).
- Ad/cover images are made the same way (HTML → Playwright PNG). Send the owner the file with SendUserFile.

## Calendar in the DB (extend after 03.12)
- `Daily 01-30` Telegram (scheduled, 04.11-03.12, 12:00), `Daily NN X` and `Daily NN LinkedIn` (drafts, 12:05 plan).
- `Reel 01-10` X videos (scheduled, 06.11-15.11, 12:00).
- Published so far: Telegram posts #20-#27+, X posts incl. the video test, LinkedIn posts + article, Telegraph article.

## X Ads test (running)
- Website-traffic campaign, 2 ads (`utm_content=stat|howto`, `utm_medium=paid`, `utm_campaign=traffic-test-1`), budget €1/day on purpose (smoke test), US + UK, keyword targeting only (AI audience expansion **off**; interests inflate the audience ×8).
- X Pixel `rihym` is installed in `src/components/AnalyticsScripts.tsx` (`afterInteractive`, Polish pages only after cookie consent). CSP in `next.config.ts` allows `static.ads-twitter.com`, `t.co`, `analytics.twitter.com`. Next: create a "Lead" event in Events Manager and fire it on form success next to `gtag.contactFormSubmitted`.
- Read results from GA4 (`utm_medium = paid`) and Ads Manager; don't draw conclusions below ~€35 total.

## Voice
Plain, direct, specific, warm; coffee metaphor only where natural. Audience: owners of coffee shops, salons, pet groomers, fitness studios (US/UK/AU/CA). No "game-changer", no filler, no manufactured conclusions.

## Queries
```sql
select id,platform,title,status,to_char(scheduled_at at time zone 'Europe/Warsaw','DD.MM HH24:MI') from social_posts where status in ('draft','scheduled') order by scheduled_at nulls last;
select platform,status,count(*) from social_posts group by 1,2 order by 1,2;
select jobname,schedule,active from cron.job;
```
