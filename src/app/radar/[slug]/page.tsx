import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lightbulb, Clock } from "lucide-react";
import {
  fetchPublishedSignals,
  fetchSignalBySlug,
  getAdjacentSignals,
  NICHE_LABELS,
  CATEGORY_LABEL,
} from "@/lib/radar-signals";
import SignalNavigator from "@/components/SignalNavigator";

export const revalidate = 21600; // 6 hours
export const dynamicParams = true;

const CATEGORY_BAR: Record<string, string> = {
  meta: "bg-blue-500",
  google: "bg-coffee-500",
  ai: "bg-purple-500",
  tiktok: "bg-pink-500",
  seo: "bg-green-500",
};

const IMPACT_CONFIG: Record<string, { dot: string; label: string; badge: string }> = {
  breaking: {
    dot: "bg-red-500 animate-pulse",
    label: "Breaking",
    badge: "bg-red-500/10 text-red-400 border border-red-500/30",
  },
  high: {
    dot: "bg-orange-400",
    label: "High Impact",
    badge: "bg-orange-400/10 text-orange-400 border border-orange-400/30",
  },
  medium: {
    dot: "bg-amber-400",
    label: "Watch",
    badge: "bg-amber-400/10 text-amber-400 border border-amber-400/30",
  },
  fyi: {
    dot: "bg-gray-500",
    label: "FYI",
    badge: "bg-gray-700/50 text-gray-400 border border-gray-700",
  },
};

export async function generateStaticParams() {
  const signals = await fetchPublishedSignals();
  return signals.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const signal = await fetchSignalBySlug(slug);
  if (!signal) return {};
  return {
    title: signal.headline,
    description: signal.summary,
  };
}

export default async function SignalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [signal, allSignals] = await Promise.all([
    fetchSignalBySlug(slug),
    fetchPublishedSignals(),
  ]);
  if (!signal) notFound();

  const impact = IMPACT_CONFIG[signal.impact];
  const readMinutes = Math.max(1, Math.ceil(signal.body.join(" ").split(/\s+/).length / 200));
  const { prev, next, index, total } = getAdjacentSignals(allSignals, slug);

  const related = allSignals.filter(
    (s) =>
      s.slug !== signal.slug &&
      (s.category === signal.category || s.niches.some((n) => signal.niches.includes(n)))
  ).slice(0, 3);

  return (
    <main className="bg-gray-950 min-h-screen text-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className={`h-1 w-full ${CATEGORY_BAR[signal.category]}`} />

      {/* Progress dots + side arrows */}
      <SignalNavigator prev={prev} next={next} index={index} total={total} />

      <div className="max-w-3xl mx-auto px-4 pt-6 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/radar" className="hover:text-gray-400 transition-colors">Value Radar</Link>
          <span>/</span>
          <span className="text-gray-500 truncate max-w-xs">{signal.headline}</span>
        </nav>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${impact.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${impact.dot}`} />
            {impact.label}
          </span>

          <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">
            {CATEGORY_LABEL[signal.category]}
          </span>

          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-600">{signal.timeAgo}</span>

          <span className="flex items-center gap-1 text-xs text-gray-700 ml-auto">
            <Clock size={11} /> {readMinutes} min read
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          {signal.headline}
        </h1>

        {/* Summary lead */}
        <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-coffee-600 pl-4 mb-10">
          {signal.summary}
        </p>

        {/* Body */}
        <div className="space-y-5 mb-10">
          {signal.body.map((para, i) => (
            <p key={i} className="text-gray-400 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Insight box */}
        <div className="bg-coffee-950/40 border border-coffee-800/40 rounded-2xl p-6 mb-10">
          <div className="flex gap-3">
            <Lightbulb size={18} className="text-coffee-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-coffee-400 uppercase tracking-widest mb-2">
                What this means for your business
              </div>
              <p className="text-coffee-200 leading-relaxed">{signal.insight}</p>
            </div>
          </div>
        </div>

        {/* Niche relevance */}
        <div className="flex flex-wrap gap-2 mb-8">
          {signal.niches.map((n) => (
            <span key={n} className="text-xs text-gray-500 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {NICHE_LABELS[n]}
            </span>
          ))}
        </div>

        {/* Source attribution — end of article */}
        <div className="border-t border-gray-800/60 pt-6 mb-10">
          <p className="text-xs text-gray-600">
            Source:{" "}
            <a
              href={signal.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              {signal.source}
            </a>
            {" · "}{signal.date}
          </p>
        </div>

        {/* ── Bottom navigation ── */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/radar"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> All signals
          </Link>
          <span className="text-xs text-gray-700">{index + 1} / {total}</span>
        </div>
      </div>

      {/* ── Next signal — full-width card ─────────────────────────────────── */}
      {next && (
        <Link href={`/radar/${next.slug}`} className="block group">
          <div className="border-t border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors px-4 py-10">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Up next
                </p>
                <h3 className="text-lg md:text-2xl font-bold text-white leading-snug group-hover:text-coffee-300 transition-colors">
                  {next.headline}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {next.source} · {next.timeAgo}
                </p>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 border border-gray-700 group-hover:border-coffee-500 group-hover:bg-gray-700 flex items-center justify-center transition-all">
                <ArrowRight size={20} className="text-gray-400 group-hover:text-coffee-400 transition-colors translate-x-0 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Related signals ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-gray-800 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
              Related signals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/radar/${s.slug}`}
                  className="group border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all"
                >
                  <div className={`h-0.5 w-8 rounded mb-3 ${CATEGORY_BAR[s.category]}`} />
                  <p className="text-xs text-gray-600 mb-1">{s.timeAgo}</p>
                  <h3 className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors leading-snug line-clamp-3">
                    {s.headline}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-600 group-hover:text-coffee-400 transition-colors mt-3">
                    Read <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
