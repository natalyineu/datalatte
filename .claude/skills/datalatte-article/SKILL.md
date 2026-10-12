---
name: datalatte-article
description: Write or rewrite a DataLatte blog article (content/blog/*.mdx) with sourced facts only, then validate it. Use when asked to rewrite, fix, expand or create a blog post, run a rewrite wave, or clean fabricated stats, invented cases or first-person text.
---

# DataLatte article skill

One article = one pass through six steps. Do not skip the checker.

## 0. Before writing
- URL = file name (`content/blog/<slug>.mdx`), not the `slug:` in frontmatter. Do not rename files.
- Read the current file. Search `content/blog` for the same topic. If another **indexable** article (no `noindex: true`) covers the same query, this is a **duplicate**: merge unique sourced facts into the stronger article, do not edit the duplicate, and report `old-slug -> target-slug` for a 301. Check the target is not noindex, has no chain, and no existing redirect from it in `next.config.ts`.
- Do not run git. Do not touch files outside your list.

## 1. Sources (every number)
- Open each source yourself with WebFetch/WebSearch: vendor pricing pages, LocaliQ/WordStream 2026, BrightLocal 2026, Pew, platform help centers, government pages.
- If a page returns 403/empty, say so in the report and do not use the number. Mark secondary sources (retellings, blogs) as "secondary" in the text and in Sources.
- No invented stats, cases, quotes, testimonials or first person ("we tested", "our client", "Picture it"). Remove them from rewrites.

## 2. Structure
Frontmatter keeps `date`, `author`, `category`, `tags`, `image`, `readTime`; set `lastModified` to today.
- `title` ≤55 chars, main query first. `description` 120-155 chars with a number.
- Body has **no H1** (the title renders as H1). First 100 words answer the query.
- H2s are questions, one every 150-250 words. Paragraphs ≤70 words.
- One `<StatRow values="a|b|c" labels="..." subs="..." trends="neutral|up|down" />` with equal item counts.
- A worked example whose inputs are labelled **assumption**.
- Exactly one `## FAQ` (use `### Question` entries).
- `## Sources` with markdown links, secondary sources marked.
- 3-6 internal `/blog/<slug>` links to existing **indexable** posts, plus the service link `/services/...` or `/free-audit` at the end.
- Valid MDX: no bare `{ }` or `<` in prose.
- Reference article: `content/blog/google-ads-for-hardware-stores.mdx`.

## 3. Style
Plain, direct, specific. No filler openers, no "In today's fast-paced world", no rule-of-three padding, no bold-title bullet lists everywhere, no manufactured conclusions. Facts stay unchanged when editing wording.

## 4. Validate
```bash
node scripts/audit/check-article.mjs <slug> [<slug>...] --date <today>
```
Fix every ERROR. Review warnings. Then `npm run build` once per batch.

## 5. Report back (short, in Russian)
Ready slugs; duplicates to 301 (old -> target); sources that failed or are secondary; anything the user must check.

## Release (main session only)
Commit and push straight to `main` with `[vercel skip]` in the message (inverted Vercel rule: only that tag deploys). One push per wave. For duplicates add the 301 in `next.config.ts` (before `// Renamed posts`) and `noindex: true` on the old file. After the deploy, `node scripts/submit-indexnow.mjs --since <date>` (the workflow also does it on push).
