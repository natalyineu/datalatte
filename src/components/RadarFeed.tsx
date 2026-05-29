"use client";

import { useState } from "react";
import { ExternalLink, Lightbulb } from "lucide-react";

/* ─── Data types ─────────────────────────────────────────────────────────── */

type Impact = "high" | "medium" | "fyi";
type Category = "meta" | "google" | "ai" | "tiktok" | "seo";
type Niche = "coffee" | "salons" | "pet" | "fitness";

interface Signal {
  id: number;
  source: string;
  sourceUrl: string;
  category: Category;
  timeAgo: string;
  impact: Impact;
  headline: string;
  summary: string;
  insight: string;
  niches: Niche[];
}

/* ─── Signals ────────────────────────────────────────────────────────────── */

const SIGNALS: Signal[] = [
  {
    id: 1,
    source: "Meta Newsroom",
    sourceUrl: "https://www.facebook.com/business/news",
    category: "meta",
    timeAgo: "3h ago",
    impact: "high",
    headline: "Meta Rolls Out AI Advantage+ to All Local Ad Accounts",
    summary:
      "Meta's AI bidding now automatically finds high-intent customers near your location — even on small budgets. Previously only available to mid-to-large advertisers, Advantage+ Shopping is now open to accounts spending as little as $5/day.",
    insight:
      "Enable Advantage+ on your next Instagram or Facebook campaign. Local businesses typically see 20–30% lower cost-per-click within the first two weeks.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
  {
    id: 2,
    source: "Search Engine Journal",
    sourceUrl: "https://www.searchenginejournal.com",
    category: "google",
    timeAgo: "6h ago",
    impact: "high",
    headline: "Google AI Overviews Now Pull Directly from Business Profiles",
    summary:
      "Google's AI-generated summaries at the top of search results are now surfacing hours, reviews, photos and services from Google Business Profiles for local queries — appearing before the standard map pack.",
    insight:
      "Audit your GBP description and service list today. Incomplete profiles risk being skipped by AI Overviews in favour of competitors with richer data.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
  {
    id: 3,
    source: "TikTok for Business",
    sourceUrl: "https://www.tiktok.com/business/en",
    category: "tiktok",
    timeAgo: "1d ago",
    impact: "medium",
    headline: "TikTok Launches 'Nearby' Ad Format — Targets Users Within 5 Miles",
    summary:
      "TikTok's new hyperlocal ad unit shows video ads only to users physically within a radius you set (1–10 miles). Available via TikTok Ads Manager with a $20/day minimum and no creative agency required.",
    insight:
      "Test a 7-day Nearby campaign at $20/day and compare foot traffic to your baseline week. Coffee shops and salons in dense urban areas are seeing strong early results.",
    niches: ["coffee", "salons", "fitness"],
  },
  {
    id: 4,
    source: "n8n Blog",
    sourceUrl: "https://n8n.io/blog",
    category: "ai",
    timeAgo: "1d ago",
    impact: "medium",
    headline: "n8n Releases Official MCP Connector — Automate Review Replies with Claude",
    summary:
      "n8n's new MCP connector wires Claude AI directly into no-code workflows: pull new Google reviews → AI drafts branded responses → auto-post reply. Setup takes under 2 hours with no coding required.",
    insight:
      "If you get 10+ Google reviews a month, this pays for itself immediately. Set up a workflow that drafts replies for your approval — or goes fully automatic for 4- and 5-star reviews.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
  {
    id: 5,
    source: "Google Ads Help",
    sourceUrl: "https://support.google.com/google-ads",
    category: "seo",
    timeAgo: "2d ago",
    impact: "fyi",
    headline: "Google Ads 'Profit Optimisation' Bidding Now Available Under $1k/Month",
    summary:
      "Google's profit-margin bidding mode no longer requires large conversion volumes. It now works with as few as 30 conversions per month, making it accessible to local businesses running modest budgets.",
    insight:
      "If you track bookings or purchases in Google Ads, pilot one campaign on Profit Optimisation and compare ROAS after 4 weeks. Don't switch everything at once.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
];

/* ─── Config ─────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { id: "all" as const, label: "All signals" },
  { id: "meta" as const, label: "Meta / Instagram" },
  { id: "google" as const, label: "Google" },
  { id: "ai" as const, label: "AI & Automation" },
  { id: "tiktok" as const, label: "TikTok" },
  { id: "seo" as const, label: "SEO" },
];

const NICHES = [
  { id: "all" as const, label: "All niches" },
  { id: "coffee" as const, label: "☕ Coffee" },
  { id: "salons" as const, label: "💇 Salons" },
  { id: "pet" as const, label: "🐾 Pet Groomers" },
  { id: "fitness" as const, label: "🏋️ Fitness" },
];

const NICHE_LABELS: Record<Niche, string> = {
  coffee: "☕ Coffee Shops",
  salons: "💇 Hair & Beauty",
  pet: "🐾 Pet Groomers",
  fitness: "🏋️ Fitness Studios",
};

const SOURCE_BADGE: Record<Category, string> = {
  meta: "bg-gray-900 text-white",
  google: "bg-coffee-700 text-white",
  ai: "bg-gray-700 text-white",
  tiktok: "bg-gray-950 text-white",
  seo: "bg-coffee-100 text-coffee-800",
};

const IMPACT_CONFIG: Record<Impact, { dot: string; label: string; badge: string; border: string }> = {
  high: {
    dot: "bg-red-500",
    label: "High Impact",
    badge: "bg-red-50 text-red-700 border border-red-100",
    border: "border-l-red-400",
  },
  medium: {
    dot: "bg-amber-400",
    label: "Watch",
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    border: "border-l-amber-400",
  },
  fyi: {
    dot: "bg-gray-400",
    label: "FYI",
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    border: "border-l-gray-300",
  },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function RadarFeed() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [niche, setNiche] = useState<Niche | "all">("all");

  const visible = SIGNALS.filter((s) => {
    const catMatch = category === "all" || s.category === category;
    const nicheMatch = niche === "all" || s.niches.includes(niche as Niche);
    return catMatch && nicheMatch;
  });

  return (
    <section className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Filters */}
        <div className="space-y-3 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                  category === c.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Niche pills */}
          <div className="flex flex-wrap gap-2">
            {NICHES.map((n) => (
              <button
                key={n.id}
                onClick={() => setNiche(n.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                  niche === n.id
                    ? "bg-coffee-700 text-white border-coffee-700"
                    : "bg-white text-gray-600 border-gray-200 hover:border-coffee-300 hover:text-coffee-700"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Signal count */}
        <p className="text-xs text-gray-400 font-medium mb-5">
          {visible.length} signal{visible.length !== 1 ? "s" : ""} matching
        </p>

        {/* Cards */}
        <div className="space-y-4">
          {visible.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
              No signals match this filter.
            </div>
          ) : (
            visible.map((signal) => {
              const impact = IMPACT_CONFIG[signal.impact];
              return (
                <article
                  key={signal.id}
                  className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${impact.border} shadow-sm hover:shadow-md transition-shadow p-6`}
                >
                  {/* Card header */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Source badge */}
                    <a
                      href={signal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${SOURCE_BADGE[signal.category]} hover:opacity-80 transition-opacity`}
                    >
                      {signal.source}
                      <ExternalLink size={10} className="opacity-60" />
                    </a>

                    {/* Time */}
                    <span className="text-xs text-gray-400 font-medium">{signal.timeAgo}</span>

                    {/* Spacer */}
                    <span className="flex-1" />

                    {/* Impact badge */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${impact.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${impact.dot}`} />
                      {impact.label}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug mb-2">
                    {signal.headline}
                  </h2>

                  {/* Summary */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {signal.summary}
                  </p>

                  {/* Insight box */}
                  <div className="flex gap-3 bg-coffee-50 border border-coffee-100 rounded-xl px-4 py-3">
                    <Lightbulb size={16} className="text-coffee-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-coffee-700 uppercase tracking-wide block mb-0.5">
                        For your business
                      </span>
                      <p className="text-sm text-coffee-900 leading-relaxed">{signal.insight}</p>
                    </div>
                  </div>

                  {/* Niche tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {signal.niches.map((n) => (
                      <span
                        key={n}
                        className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
                      >
                        {NICHE_LABELS[n]}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-10">
          Signals are curated daily by Nataliia — founder of DataLatte. Sources are linked above each card.
        </p>
      </div>
    </section>
  );
}
