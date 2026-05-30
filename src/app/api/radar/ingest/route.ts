import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Parser from "rss-parser";

// ─── RSS Sources ────────────────────────────────────────────────────────────

const RSS_SOURCES = [
  // ── SEO & Google ──────────────────────────────────────────────────────────
  {
    url: "https://www.searchenginejournal.com/feed/",
    name: "Search Engine Journal",
    siteUrl: "https://www.searchenginejournal.com",
  },
  {
    url: "https://searchengineland.com/feed",
    name: "Search Engine Land",
    siteUrl: "https://searchengineland.com",
  },
  {
    url: "https://developers.google.com/search/blog/rss.xml",
    name: "Google Search Central",
    siteUrl: "https://developers.google.com/search/blog",
  },
  {
    url: "https://blog.google/products/ads/rss/",
    name: "Google Ads Blog",
    siteUrl: "https://blog.google/products/ads/",
  },
  {
    url: "https://moz.com/blog/feed",
    name: "Moz Blog",
    siteUrl: "https://moz.com/blog",
  },
  {
    url: "https://www.semrush.com/blog/feed/",
    name: "Semrush Blog",
    siteUrl: "https://www.semrush.com/blog/",
  },
  {
    url: "https://ahrefs.com/blog/feed/",
    name: "Ahrefs Blog",
    siteUrl: "https://ahrefs.com/blog/",
  },
  {
    url: "https://www.brightlocal.com/blog/feed/",
    name: "BrightLocal Blog",
    siteUrl: "https://www.brightlocal.com/blog/",
  },
  // ── Social & Meta ─────────────────────────────────────────────────────────
  {
    url: "https://www.socialmediatoday.com/rss.xml",
    name: "Social Media Today",
    siteUrl: "https://www.socialmediatoday.com",
  },
  {
    url: "https://www.socialmediaexaminer.com/feed/",
    name: "Social Media Examiner",
    siteUrl: "https://www.socialmediaexaminer.com",
  },
  {
    url: "https://sproutsocial.com/insights/feed/",
    name: "Sprout Social Insights",
    siteUrl: "https://sproutsocial.com/insights/",
  },
  {
    url: "https://later.com/blog/rss/",
    name: "Later Blog",
    siteUrl: "https://later.com/blog",
  },
  {
    url: "https://buffer.com/resources/rss/",
    name: "Buffer Blog",
    siteUrl: "https://buffer.com/resources/",
  },
  {
    url: "https://blog.hubspot.com/marketing/rss.xml",
    name: "HubSpot Marketing Blog",
    siteUrl: "https://blog.hubspot.com/marketing",
  },
  // ── TikTok ───────────────────────────────────────────────────────────────
  {
    url: "https://newsroom.tiktok.com/feed/",
    name: "TikTok Newsroom",
    siteUrl: "https://newsroom.tiktok.com",
  },
  // ── AI & Automation ───────────────────────────────────────────────────────
  {
    url: "https://blog.n8n.io/rss.xml",
    name: "n8n Blog",
    siteUrl: "https://n8n.io/blog",
  },
  {
    url: "https://zapier.com/blog/feeds/latest/",
    name: "Zapier Blog",
    siteUrl: "https://zapier.com/blog",
  },
  {
    url: "https://www.make.com/en/blog/feed",
    name: "Make.com Blog",
    siteUrl: "https://www.make.com/en/blog",
  },
  // ── Multi / Industry ─────────────────────────────────────────────────────
  {
    url: "https://www.morningbrew.com/marketing/rss",
    name: "Marketing Brew",
    siteUrl: "https://www.marketingbrew.com",
  },
  {
    url: "https://blog.google/rss/",
    name: "Google Blog",
    siteUrl: "https://blog.google",
  },
  // ── CTV / OTT / DOOH ─────────────────────────────────────────────────────
  {
    url: "https://www.adexchanger.com/feed/",
    name: "AdExchanger",
    siteUrl: "https://www.adexchanger.com",
  },
  {
    url: "https://digiday.com/feed/",
    name: "Digiday",
    siteUrl: "https://digiday.com",
  },
  {
    url: "https://www.vistarmedia.com/blog/rss.xml",
    name: "Vistar Media Blog",
    siteUrl: "https://www.vistarmedia.com/blog",
  },
  {
    url: "https://www.stackadapt.com/blog/feed",
    name: "StackAdapt Blog",
    siteUrl: "https://www.stackadapt.com/blog",
  },
  {
    url: "https://www.nexttv.com/rss",
    name: "Next TV",
    siteUrl: "https://www.nexttv.com",
  },
  {
    url: "https://adage.com/rss",
    name: "Ad Age",
    siteUrl: "https://adage.com",
  },
];

const MAX_AGE_HOURS = 48;  // only articles from last 48h
const MAX_PER_SOURCE = 5;  // max articles to AI-process per source

// ─── Types ──────────────────────────────────────────────────────────────────

interface SignalData {
  relevant: true;
  category: "meta" | "google" | "ai" | "tiktok" | "seo" | "ctv";
  impact: "breaking" | "high" | "medium" | "fyi";
  niches: Array<"coffee" | "salons" | "pet" | "fitness">;
  headline: string;
  summary: string;
  body: [string, string, string];
  insight: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 75);
}

// ─── AI Classification ───────────────────────────────────────────────────────

async function classifyWithGroq(
  title: string,
  description: string,
  sourceName: string
): Promise<SignalData | null> {
  const prompt = `You are a marketing intelligence analyst for DataLatte — a local marketing agency serving coffee shops, hair salons, pet groomers, and fitness studios in US/UK/AU.

Read this article and decide: is it relevant to LOCAL BUSINESS MARKETING? Topics that qualify: digital ads (Meta/Google/TikTok), local SEO, Google Business Profile, AI tools for small business, CTV/OTT/DOOH advertising, social media marketing, review management, booking tools, email/SMS marketing, analytics.

Topics that do NOT qualify: enterprise B2B SaaS, stock markets, politics, unrelated industries, developer tools unrelated to marketing.

If NOT relevant → return exactly: {"relevant": false}

If relevant → return ONLY this JSON (no markdown, no extra text):
{
  "relevant": true,
  "category": "meta" or "google" or "ai" or "tiktok" or "seo" or "ctv",
  "impact": "breaking" or "high" or "medium" or "fyi",
  "niches": array of 1-4 values from ["coffee","salons","pet","fitness"] (all that apply),
  "headline": "punchy newsworthy headline under 90 chars",
  "summary": "1-2 sentences — what changed and why local businesses should care",
  "body": [
    "paragraph 1: what happened and context",
    "paragraph 2: specific data, numbers, or mechanics",
    "paragraph 3: implications and opportunities for local businesses"
  ],
  "insight": "1-2 sentences of concrete actionable advice for a local business owner"
}

Article title: ${title}
Source: ${sourceName}
Content: ${(description || "").slice(0, 1000)}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (!parsed.relevant) return null;

    // Validate required fields
    if (
      !parsed.category || !parsed.impact || !parsed.headline ||
      !parsed.summary || !Array.isArray(parsed.body) || !parsed.insight ||
      !Array.isArray(parsed.niches) || parsed.niches.length === 0
    ) return null;

    return parsed as SignalData;
  } catch {
    return null;
  }
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Auth: Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Supabase admin client — bypasses RLS for inserts
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const parser = new Parser({ timeout: 12000 });
  const cutoff = new Date(Date.now() - MAX_AGE_HOURS * 60 * 60 * 1000);

  const results = {
    processed: 0,
    inserted: 0,
    skipped_dedup: 0,
    skipped_irrelevant: 0,
    errors: [] as string[],
    signals: [] as string[],
  };

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      // Only recent articles
      const recentItems = feed.items
        .filter((item) => {
          const date = item.pubDate || item.isoDate;
          return date ? new Date(date) > cutoff : false;
        })
        .slice(0, MAX_PER_SOURCE);

      for (const item of recentItems) {
        results.processed++;
        const title = item.title || "";
        if (!title) continue;

        // 1. Fuzzy dedup check against existing headlines
        const { data: similar } = await supabase.rpc("find_similar_signals", {
          p_headline: title,
          threshold: 0.55,
        });
        if (similar && similar.length > 0) {
          results.skipped_dedup++;
          continue;
        }

        // 2. AI classification
        const signal = await classifyWithGroq(
          title,
          item.contentSnippet || item.summary || item.content || "",
          source.name
        );
        if (!signal) {
          results.skipped_irrelevant++;
          continue;
        }

        // 3. Build slug (headline-based + timestamp suffix for uniqueness)
        const slug = `${toSlug(signal.headline)}-${Date.now().toString(36)}`;

        // 4. Insert — content_hash constraint catches exact dupes
        const { error } = await supabase.from("radar_signals").insert({
          slug,
          status: "published",
          source: source.name,
          source_url: item.link || source.siteUrl,
          category: signal.category,
          published_at: item.isoDate || item.pubDate || new Date().toISOString(),
          impact: signal.impact,
          headline: signal.headline,
          summary: signal.summary,
          body: signal.body,
          insight: signal.insight,
          niches: signal.niches,
        });

        if (error) {
          if (error.code === "23505") {
            results.skipped_dedup++; // content_hash duplicate
          } else {
            results.errors.push(`${source.name}: ${error.message}`);
          }
        } else {
          results.inserted++;
          results.signals.push(signal.headline);
        }
      }
    } catch (err) {
      results.errors.push(
        `${source.name}: ${err instanceof Error ? err.message : "fetch failed"}`
      );
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    ...results,
  });
}
