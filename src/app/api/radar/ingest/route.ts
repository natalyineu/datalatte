import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Parser from "rss-parser";

// ─── RSS Sources ─────────────────────────────────────────────────────────────

const RSS_SOURCES = [
  // SEO & Google
  { url: "https://www.searchenginejournal.com/feed/",          name: "Search Engine Journal",  siteUrl: "https://www.searchenginejournal.com" },
  { url: "https://searchengineland.com/feed",                  name: "Search Engine Land",     siteUrl: "https://searchengineland.com" },
  { url: "https://developers.google.com/search/blog/rss.xml",  name: "Google Search Central",  siteUrl: "https://developers.google.com/search/blog" },
  { url: "https://blog.google/products/ads/rss/",              name: "Google Ads Blog",        siteUrl: "https://blog.google/products/ads/" },
  { url: "https://moz.com/blog/feed",                          name: "Moz Blog",               siteUrl: "https://moz.com/blog" },
  { url: "https://www.semrush.com/blog/feed/",                 name: "Semrush Blog",           siteUrl: "https://www.semrush.com/blog/" },
  { url: "https://ahrefs.com/blog/feed/",                      name: "Ahrefs Blog",            siteUrl: "https://ahrefs.com/blog/" },
  { url: "https://www.brightlocal.com/blog/feed/",             name: "BrightLocal Blog",       siteUrl: "https://www.brightlocal.com/blog/" },
  // Social & Meta
  { url: "https://www.socialmediatoday.com/rss.xml",           name: "Social Media Today",     siteUrl: "https://www.socialmediatoday.com" },
  { url: "https://www.socialmediaexaminer.com/feed/",          name: "Social Media Examiner",  siteUrl: "https://www.socialmediaexaminer.com" },
  { url: "https://sproutsocial.com/insights/feed/",            name: "Sprout Social Insights", siteUrl: "https://sproutsocial.com/insights/" },
  { url: "https://later.com/blog/rss/",                        name: "Later Blog",             siteUrl: "https://later.com/blog" },
  { url: "https://buffer.com/resources/rss/",                  name: "Buffer Blog",            siteUrl: "https://buffer.com/resources/" },
  { url: "https://blog.hubspot.com/marketing/rss.xml",         name: "HubSpot Marketing Blog", siteUrl: "https://blog.hubspot.com/marketing" },
  // TikTok
  { url: "https://newsroom.tiktok.com/feed/",                  name: "TikTok Newsroom",        siteUrl: "https://newsroom.tiktok.com" },
  // AI & Automation
  { url: "https://blog.n8n.io/rss.xml",                        name: "n8n Blog",               siteUrl: "https://n8n.io/blog" },
  { url: "https://zapier.com/blog/feeds/latest/",              name: "Zapier Blog",            siteUrl: "https://zapier.com/blog" },
  { url: "https://www.make.com/en/blog/feed",                  name: "Make.com Blog",          siteUrl: "https://www.make.com/en/blog" },
  // Multi / Industry
  { url: "https://www.morningbrew.com/marketing/rss",          name: "Marketing Brew",         siteUrl: "https://www.marketingbrew.com" },
  { url: "https://blog.google/rss/",                           name: "Google Blog",            siteUrl: "https://blog.google" },
  // CTV / OTT / DOOH
  { url: "https://www.adexchanger.com/feed/",                  name: "AdExchanger",            siteUrl: "https://www.adexchanger.com" },
  { url: "https://digiday.com/feed/",                          name: "Digiday",                siteUrl: "https://digiday.com" },
  { url: "https://www.vistarmedia.com/blog/rss.xml",           name: "Vistar Media Blog",      siteUrl: "https://www.vistarmedia.com/blog" },
  { url: "https://www.stackadapt.com/blog/feed",               name: "StackAdapt Blog",        siteUrl: "https://www.stackadapt.com/blog" },
  { url: "https://www.nexttv.com/rss",                         name: "Next TV",                siteUrl: "https://www.nexttv.com" },
  { url: "https://adage.com/rss",                              name: "Ad Age",                 siteUrl: "https://adage.com" },
];

const MAX_AGE_HOURS  = 48;  // only articles from last 48h
const MAX_PER_SOURCE = 5;   // max articles per source to consider
const BATCH_SIZE     = 10;  // articles per AI call (batching to stay under RPM)

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawArticle {
  title: string;
  description: string;
  link: string;
  source: string;
  siteUrl: string;
  pubDate: string;
}

interface SignalResult {
  index: number;  // position in the batch
  relevant: boolean;
  category?: "meta" | "google" | "ai" | "tiktok" | "seo" | "ctv";
  impact?: "breaking" | "high" | "medium" | "fyi";
  niches?: Array<"coffee" | "salons" | "pet" | "fitness">;
  headline?: string;
  summary?: string;
  body?: [string, string, string];
  insight?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 75);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Batch AI Classification (Cerebras) ──────────────────────────────────────

async function classifyBatch(articles: RawArticle[]): Promise<SignalResult[]> {
  const articleList = articles
    .map(
      (a, i) =>
        `[${i}] SOURCE: ${a.source}\nTITLE: ${a.title}\nCONTENT: ${a.description.slice(0, 400)}`
    )
    .join("\n\n---\n\n");

  const prompt = `You are a marketing intelligence analyst for DataLatte — a local marketing agency for coffee shops, hair salons, pet groomers, and fitness studios in US/UK/AU.

Evaluate these ${articles.length} articles. For each, decide if it's relevant to LOCAL BUSINESS MARKETING (digital ads, local SEO, Google Business Profile, AI tools for small business, social media marketing, CTV/OTT/DOOH, review management, booking tools).

NOT relevant: enterprise B2B, stock markets, politics, unrelated industries, pure tech/developer content.

Return a JSON array with one object per article (same order, same index):
[
  {
    "index": 0,
    "relevant": false
  },
  {
    "index": 1,
    "relevant": true,
    "category": "meta" | "google" | "ai" | "tiktok" | "seo" | "ctv",
    "impact": "breaking" | "high" | "medium" | "fyi",
    "niches": ["coffee","salons","pet","fitness"] (include all that apply),
    "headline": "punchy headline max 90 chars",
    "summary": "1-2 sentences — what changed and why local businesses care",
    "body": ["context paragraph", "data/specifics paragraph", "implications for local businesses paragraph"],
    "insight": "1-2 sentences of concrete actionable advice for a local business owner"
  }
]

Articles to evaluate:

${articleList}`;

  try {
    const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    // 429 rate limit — wait and retry once
    if (res.status === 429) {
      await sleep(15000);
      return classifyBatch(articles);
    }

    if (!res.ok) return articles.map((_, i) => ({ index: i, relevant: false }));

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return articles.map((_, i) => ({ index: i, relevant: false }));

    const parsed = JSON.parse(content);
    // Handle both array and {results: [...]} shapes
    const results: SignalResult[] = Array.isArray(parsed) ? parsed : (parsed.results ?? []);
    return results;
  } catch {
    return articles.map((_, i) => ({ index: i, relevant: false }));
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Auth: Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Supabase admin client — bypasses RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const parser = new Parser({ timeout: 12000 });
  const cutoff = new Date(Date.now() - MAX_AGE_HOURS * 60 * 60 * 1000);

  const stats = {
    sources_fetched: 0,
    articles_collected: 0,
    batches: 0,
    inserted: 0,
    skipped_dedup: 0,
    skipped_irrelevant: 0,
    errors: [] as string[],
    signals: [] as string[],
  };

  // ── Step 1: Collect all recent articles from all sources ─────────────────

  const allArticles: RawArticle[] = [];

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      stats.sources_fetched++;

      const recent = feed.items
        .filter((item) => {
          const date = item.pubDate || item.isoDate;
          return date ? new Date(date) > cutoff : false;
        })
        .slice(0, MAX_PER_SOURCE);

      for (const item of recent) {
        if (!item.title) continue;

        // Quick dedup check before sending to AI
        const { data: similar } = await supabase.rpc("find_similar_signals", {
          p_headline: item.title,
          threshold: 0.55,
        });
        if (similar && similar.length > 0) {
          stats.skipped_dedup++;
          continue;
        }

        allArticles.push({
          title: item.title,
          description: item.contentSnippet || item.summary || item.content || "",
          link: item.link || source.siteUrl,
          source: source.name,
          siteUrl: source.siteUrl,
          pubDate: item.isoDate || item.pubDate || new Date().toISOString(),
        });
      }
    } catch (err) {
      stats.errors.push(
        `${source.name}: ${err instanceof Error ? err.message : "fetch failed"}`
      );
    }
  }

  stats.articles_collected = allArticles.length;

  // ── Step 2: Process in batches of BATCH_SIZE ─────────────────────────────

  for (let i = 0; i < allArticles.length; i += BATCH_SIZE) {
    const batch = allArticles.slice(i, i + BATCH_SIZE);
    stats.batches++;

    const results = await classifyBatch(batch);

    for (const result of results) {
      const article = batch[result.index];
      if (!article) continue;

      if (!result.relevant || !result.headline) {
        stats.skipped_irrelevant++;
        continue;
      }

      const slug = `${toSlug(result.headline)}-${Date.now().toString(36)}`;

      const { error } = await supabase.from("radar_signals").insert({
        slug,
        status: "published",
        source: article.source,
        source_url: article.link,
        category: result.category,
        published_at: article.pubDate,
        impact: result.impact,
        headline: result.headline,
        summary: result.summary,
        body: result.body,
        insight: result.insight,
        niches: result.niches,
      });

      if (error) {
        if (error.code === "23505") {
          stats.skipped_dedup++;
        } else {
          stats.errors.push(error.message);
        }
      } else {
        stats.inserted++;
        stats.signals.push(result.headline);
      }
    }

    // Polite pause between batches to respect RPM
    if (i + BATCH_SIZE < allArticles.length) {
      await sleep(13000); // ~13s between batches → stay under 5 RPM
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    ...stats,
  });
}
