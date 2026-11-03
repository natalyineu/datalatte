---
name: datalatte-social
description: Run DataLatte social media (Telegram, X/Twitter) with the Supabase table social_posts. Use when asked to write, plan, schedule or log a social post, check what was already published, or avoid reposting the same thing.
---

# DataLatte social skill

Platforms now: `telegram`, `x`. New platform = add it to `social_posts_platform_check` (migration) and a section below.
Supabase project: `datalatte` (`olsxxfwvwsycwzihbmdn`). Table: `public.social_posts` (RLS on, service role only).

## Table
| column | meaning |
|---|---|
| `platform` | `telegram` or `x` |
| `status` | `draft` → `scheduled` → `published` (or `failed`) |
| `title` | internal label, not published |
| `content` | exact post text as published |
| `destination_url` | link the post points to (blog, service page, /free-audit) |
| `utm_source/medium/campaign/content` | UTM parts of that link |
| `post_url` | public link to the post. Required when `published` |
| `post_id_external` | message id (Telegram) / tweet id (X) |
| `scheduled_at`, `published_at` | times. `published_at` required when `published` |
| `signal_id` | optional link to `radar_signals.id` if the post came from a radar signal |
| `error_message` | reason when `failed` |

DB enforces: platform and status values, `published` needs `post_url` + `published_at`, `(platform, post_url)` unique.

## Workflow
1. **Check history first.** Never repost a topic or link without checking:
   ```sql
   select platform, status, title, destination_url, post_url, published_at
   from social_posts order by coalesce(published_at, created_at) desc limit 30;
   ```
   Same `destination_url` on the same platform within 30 days = skip or use a different angle.
2. **Pick source.** Indexable blog post (`content/blog/*.mdx`, no `noindex`), service page, or radar signal. Use only facts that are in the source. No invented stats, cases or quotes (same rule as `datalatte-article`).
3. **Write the post** (rules below). Insert as `draft` with `destination_url` and UTM.
4. **Owner approves** the text. Nothing is posted without an explicit yes.
5. **After publishing**: update the row to `published` with `post_url`, `post_id_external`, `published_at`. If it failed: `failed` + `error_message`.
6. Say in the report: what was inserted, what was published, what is still draft.

## UTM
`utm_source=telegram|x`, `utm_medium=social`, `utm_campaign=<blog-slug or page-slug>`, `utm_content=<post type>` (e.g. `stat`, `howto`, `thread`). Link = `https://www.datalatte.pro/...?utm_...`.

## Telegram
- Channel post, up to ~900 characters (hard limit 4096). First line is the hook with the answer or number.
- Short paragraphs, 1-2 emojis max, no hashtag walls (0-2 tags).
- One link at the end. Format: HTML or plain text; check the preview.
- Types: `stat` (one sourced number + what to do), `howto` (3-5 steps), `checklist`, `digest` (weekly, 3 links).

## X
- Single post ≤280 characters (a link counts as 23). Thread: 3-6 posts, first post stands alone, link in the last one.
- No hashtags except one if it matches the niche. No engagement bait.
- Types: `stat`, `tip`, `thread`.

## Voice
Plain, direct, specific, warm; coffee metaphor only where natural. Audience: owners of coffee shops, salons, pet groomers, fitness studios (US/UK/AU/CA). No "game-changer", no filler openers, no manufactured conclusions. Run `humanizer:humanizer` on long copy if it reads like AI.

## Queries
```sql
-- drafts waiting
select id, platform, title, scheduled_at from social_posts where status in ('draft','scheduled') order by scheduled_at nulls last;
-- what we published per platform
select platform, count(*) , max(published_at) from social_posts where status='published' group by 1;
-- insert
insert into social_posts (platform, status, title, content, destination_url, utm_source, utm_medium, utm_campaign, utm_content)
values ('telegram','draft','...','...','https://www.datalatte.pro/blog/...','telegram','social','<slug>','stat');
```
