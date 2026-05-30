"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, Zap } from "lucide-react";
import {
  NICHE_LABELS,
  CATEGORY_LABEL,
  type Impact,
  type Category,
  type Niche,
  type Signal,
} from "@/lib/radar-signals";

/* ─── Config ─────────────────────────────────────────────────────────────── */

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All signals" },
  { id: "meta", label: "Meta / Instagram" },
  { id: "google", label: "Google" },
  { id: "ai", label: "AI & Automation" },
  { id: "tiktok", label: "TikTok" },
  { id: "seo", label: "SEO" },
];

const NICHES: { id: Niche | "all"; label: string }[] = [
  { id: "all", label: "All niches" },
  { id: "coffee", label: "☕ Coffee" },
  { id: "salons", label: "💇 Salons" },
  { id: "pet", label: "🐾 Pet Groomers" },
  { id: "fitness", label: "🏋️ Fitness" },
];

const IMPACT: Record<Impact, { dot: string; label: string; badge: string; bar: string }> = {
  breaking: {
    dot: "bg-red-500",
    label: "Breaking",
    badge: "bg-red-500/10 text-red-400 border border-red-500/30",
    bar: "bg-red-500",
  },
  high: {
    dot: "bg-orange-400",
    label: "High Impact",
    badge: "bg-orange-400/10 text-orange-400 border border-orange-400/30",
    bar: "bg-orange-400",
  },
  medium: {
    dot: "bg-amber-400",
    label: "Watch",
    badge: "bg-amber-400/10 text-amber-400 border border-amber-400/30",
    bar: "bg-amber-400",
  },
  fyi: {
    dot: "bg-gray-500",
    label: "FYI",
    badge: "bg-gray-700/50 text-gray-400 border border-gray-700",
    bar: "bg-gray-600",
  },
};

const CATEGORY_BAR: Record<Category, string> = {
  meta: "bg-blue-500",
  google: "bg-coffee-500",
  ai: "bg-purple-500",
  tiktok: "bg-pink-500",
  seo: "bg-green-500",
};

/* ─── Card ───────────────────────────────────────────────────────────────── */

function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const impact = IMPACT[signal.impact];
  const isBreaking = signal.impact === "breaking";

  return (
    <Link href={`/radar/${signal.slug}`}>
      <article
        className="radar-card-in group relative bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/40 cursor-pointer"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        {/* Top accent bar — category color */}
        <div className={`h-0.5 w-full ${CATEGORY_BAR[signal.category]}`} />

        {/* Breaking pulse overlay */}
        {isBreaking && (
          <div className="absolute top-3 right-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
          </div>
        )}

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {signal.source}
            </span>
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-xs text-gray-600">{signal.timeAgo}</span>
            <span className="ml-auto" />
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${impact.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${impact.dot} ${isBreaking ? "animate-pulse" : ""}`} />
              {impact.label}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-white font-bold text-base md:text-lg leading-snug mb-3 group-hover:text-coffee-300 transition-colors">
            {signal.headline}
          </h2>

          {/* Summary */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {signal.summary}
          </p>

          {/* Insight */}
          <div className="flex gap-2.5 bg-coffee-950/30 border border-coffee-900/30 rounded-xl px-3.5 py-2.5 mb-4">
            <Lightbulb size={13} className="text-coffee-400 mt-0.5 shrink-0" />
            <p className="text-xs text-coffee-300/80 leading-relaxed line-clamp-2">
              {signal.insight}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {signal.niches.map((n) => (
                <span key={n} className="text-xs text-gray-600 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full">
                  {NICHE_LABELS[n]}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-coffee-400 transition-colors font-medium flex-shrink-0 ml-2">
              Full signal <ArrowRight size={11} />
            </span>
          </div>
        </div>

        {/* Hover scan line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="radar-scan-line" />
        </div>
      </article>
    </Link>
  );
}

/* ─── Feed ───────────────────────────────────────────────────────────────── */

export default function RadarFeed({ signals }: { signals: Signal[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [niche, setNiche] = useState<Niche | "all">("all");

  const visible = signals.filter((s) => {
    const catMatch = category === "all" || s.category === category;
    const nicheMatch = niche === "all" || s.niches.includes(niche as Niche);
    return catMatch && nicheMatch;
  });

  return (
    <section className="bg-gray-950 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Filter bar */}
        <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur-md pb-4 pt-1 border-b border-gray-800/50 mb-8">
          <div className="space-y-2.5 pt-4">
            {/* Category */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                    category === c.id
                      ? "bg-white text-gray-950 border-white"
                      : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Niche */}
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNiche(n.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                    niche === n.id
                      ? "bg-coffee-600 text-white border-coffee-600"
                      : "bg-transparent text-gray-600 border-gray-800 hover:border-gray-600 hover:text-gray-400"
                  }`}
                >
                  {n.label}
                </button>
              ))}

              <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-600">
                <Zap size={11} />
                {visible.length} signal{visible.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        {visible.length === 0 ? (
          <div className="border border-gray-800 rounded-2xl p-16 text-center text-gray-600 text-sm">
            No signals match this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map((signal, i) => (
              <SignalCard key={signal.slug} signal={signal} index={i} />
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-700 mt-12 pb-4">
          Curated daily by Nataliia · DataLatte · Sources linked on each signal
        </p>
      </div>
    </section>
  );
}
