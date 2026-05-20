"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  wordCount: number;
  category: string;
  tags: string[];
  url: string;
}

interface QueueEntry {
  slug: string;
  status: "pending" | "generating" | "generated" | "published";
  cluster: string;
  generatedDate: string | null;
}

interface QualityScore {
  score: number;
  checkedAt: string;
  improvedAt?: string;
  improvedFrom?: number;
}

interface QualityStats {
  totalScored: number;
  avgScore: number | null;
  dist: { excellent: number; good: number; fair: number; poor: number };
  fixerQueue: number;
  recentlyImproved: { slug: string; score: number; improvedFrom: number | null; improvedAt: string }[];
  lowestScoring: { slug: string; score: number; checkedAt: string; improvedAt: string | null }[];
}

// ── Auth fetch helper ─────────────────────────────────────────────────────────

async function authFetch(url: string, token: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) return null;
  return res.json();
}

// ── Small components ──────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, color = "text-white",
}: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function QualityBadge({ score }: { score: number }) {
  const color = score >= 8
    ? "text-green-400 bg-green-500/10 border-green-500/30"
    : score >= 6
    ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
    : "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${color}`}>
      {score}/10
    </span>
  );
}

function SectionCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="font-semibold text-white mb-1">{title}</h2>
      {sub && <p className="text-xs text-gray-500 mb-5">{sub}</p>}
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [qualityScores, setQualityScores] = useState<Record<string, QualityScore>>({});
  const [qualityStats, setQualityStats] = useState<QualityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (!stored) {
      router.replace("/admin");
      return;
    }
    setToken(stored);
    setReady(true);
  }, [router]);

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchAll = useCallback(async (t: string) => {
    setLoading(true);
    const [articlesRes, queueRes, qualityRes] = await Promise.all([
      authFetch("/api/admin/articles", t),
      authFetch("/api/admin/queue", t),
      authFetch("/api/admin/quality", t),
    ]);
    if (articlesRes) setArticles(articlesRes.articles ?? []);
    if (queueRes) setQueue(queueRes.queue ?? []);
    if (qualityRes) {
      setQualityScores(qualityRes.scores ?? {});
      if (qualityRes.stats) setQualityStats(qualityRes.stats);
    }
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    if (token) fetchAll(token);
  }, [token, fetchAll]);

  // ── Computed stats (source of truth: articles array from MDX files) ────────

  const today = new Date().toISOString().slice(0, 10);

  // Chart: articles published per day (last 14 days) — use MDX date field
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400_000);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = articles.filter((a) => a.date === dateStr).length;
    return { dateStr, label, count };
  });
  const maxDayCount = Math.max(...last14Days.map((d) => d.count), 1);

  // Published today / this week — based on real article date
  const publishedToday = articles.filter((a) => a.date === today).length;
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);
  const publishedThisWeek = articles.filter((a) => a.date >= sevenDaysAgo).length;
  const avgPerDay = (publishedThisWeek / 7).toFixed(1);

  // Queue status counts
  const pendingCount = queue.filter((e) => e.status === "pending").length;
  const generatingCount = queue.filter((e) => e.status === "generating").length;

  // Cluster distribution — from real article category (MDX frontmatter)
  const categoryDistrib: Record<string, number> = {};
  for (const a of articles) {
    const cat = a.category || "Uncategorized";
    categoryDistrib[cat] = (categoryDistrib[cat] ?? 0) + 1;
  }
  const categoryEntries = Object.entries(categoryDistrib).sort((a, b) => b[1] - a[1]);

  // Word count buckets
  const wcBuckets = { short: 0, medium: 0, long: 0, vlong: 0 };
  for (const a of articles) {
    if (a.wordCount < 800) wcBuckets.short++;
    else if (a.wordCount < 1500) wcBuckets.medium++;
    else if (a.wordCount < 2500) wcBuckets.long++;
    else wcBuckets.vlong++;
  }

  // Quality scores
  const allScores = Object.values(qualityScores).map((s) => s.score);
  const avgQuality = allScores.length > 0
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
    : null;

  // Coverage: % of articles scored
  const scoredPct = articles.length > 0
    ? Math.round((allScores.length / articles.length) * 100)
    : 0;

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1.5"
          >
            ← Admin
          </Link>
          <div className="h-4 w-px bg-gray-700" />
          <div>
            <h1 className="font-bold text-lg leading-none">Reports</h1>
            <p className="text-gray-400 text-xs mt-0.5">Content analytics & quality</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-600">
              Updated {lastRefresh.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </span>
          )}
          <button
            onClick={() => token && fetchAll(token)}
            disabled={loading}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-1.5 transition disabled:opacity-50"
          >
            {loading ? "⟳ Loading…" : "⟳ Refresh"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {loading && articles.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse h-40" />
            ))}
          </div>
        ) : (
          <>
            {/* ── Summary stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Total Published"
                value={articles.length}
                sub="MDX files live"
                color="text-green-400"
              />
              <StatCard
                label="Published Today"
                value={publishedToday}
                sub={today}
                color={publishedToday > 0 ? "text-amber-400" : "text-gray-500"}
              />
              <StatCard
                label="This Week"
                value={publishedThisWeek}
                sub="last 7 days"
                color="text-blue-400"
              />
              <StatCard
                label="Avg / Day"
                value={`${avgPerDay}`}
                sub="7-day average"
              />
              <StatCard
                label="Pending in Queue"
                value={pendingCount}
                sub="ready to generate"
                color={pendingCount > 0 ? "text-yellow-400" : "text-gray-500"}
              />
              <StatCard
                label="Generating"
                value={generatingCount}
                sub={generatingCount > 0 ? "in progress now" : "idle"}
                color={generatingCount > 0 ? "text-orange-400" : "text-gray-500"}
              />
              <StatCard
                label="Audited"
                value={`${allScores.length} (${scoredPct}%)`}
                sub={`of ${articles.length} articles`}
              />
              <StatCard
                label="Avg Quality"
                value={avgQuality ? `${avgQuality}/10` : "—"}
                sub={`${allScores.length} scored`}
                color={avgQuality ? (Number(avgQuality) >= 7 ? "text-green-400" : Number(avgQuality) >= 5 ? "text-yellow-400" : "text-red-400") : "text-gray-500"}
              />
            </div>

            {/* ── Articles per day chart ─────────────────────────────────────── */}
            <SectionCard title="Articles Published Per Day" sub="Last 14 days — based on article publish date">
              <div className="flex items-end gap-1.5 h-36 mt-2">
                {last14Days.map((day) => (
                  <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-1 group">
                    {day.count > 0 && (
                      <span className="text-xs text-gray-400 font-medium">{day.count}</span>
                    )}
                    <div
                      className={`w-full rounded-t transition-all ${
                        day.dateStr === today
                          ? "bg-amber-500 hover:bg-amber-400"
                          : "bg-amber-700/60 hover:bg-amber-600/80"
                      }`}
                      style={{
                        height: `${Math.max((day.count / maxDayCount) * 100, day.count > 0 ? 6 : 2)}%`,
                        minHeight: "2px",
                      }}
                      title={`${day.label}: ${day.count} article${day.count !== 1 ? "s" : ""}`}
                    />
                    <span
                      className="text-gray-600 hidden sm:block text-center leading-tight"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800 flex gap-6 text-xs text-gray-500">
                <span>Total period: <span className="text-white font-medium">{last14Days.reduce((s, d) => s + d.count, 0)}</span> articles</span>
                <span>Peak day: <span className="text-white font-medium">{Math.max(...last14Days.map((d) => d.count))}</span> articles</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                  Today
                </span>
              </div>
            </SectionCard>

            {/* ── Status breakdown ──────────────────────────────────────────── */}
            <SectionCard title="Status Breakdown" sub="Source of truth: actual MDX files + queue">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Published", value: articles.length, color: "text-green-400", sub: "live on site" },
                  { label: "Pending", value: pendingCount, color: "text-yellow-400", sub: "in queue" },
                  { label: "Generating", value: generatingCount, color: "text-orange-400", sub: "in progress" },
                  { label: "Total Queue", value: queue.length, color: "text-gray-300", sub: "all entries" },
                ].map((s) => (
                  <div key={s.label} className="text-center bg-gray-800/50 rounded-xl py-4 px-3">
                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs font-semibold text-gray-400 mt-1">{s.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4">
                Note: Published count = actual .mdx files in content/blog/. Queue may differ as tracking is separate.
              </p>
            </SectionCard>

            {/* ── Cluster / Category distribution ───────────────────────────── */}
            <SectionCard title="Category Distribution" sub={`${articles.length} published articles by category (from MDX frontmatter)`}>
              {categoryEntries.length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet</p>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {categoryEntries.map(([cat, count]) => {
                    const pct = Math.round((count / articles.length) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-300 truncate flex-1 mr-4">{cat || "Uncategorized"}</span>
                          <span className="text-gray-500 text-xs shrink-0 font-mono">
                            {count} · {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-amber-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* ── Word count distribution ───────────────────────────────────── */}
            <SectionCard title="Word Count Distribution" sub="Article length breakdown">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Short", sub: "< 800 words", value: wcBuckets.short, color: "text-gray-400 bg-gray-800 border-gray-700" },
                  { label: "Medium", sub: "800–1500", value: wcBuckets.medium, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
                  { label: "Long", sub: "1500–2500", value: wcBuckets.long, color: "text-green-400 bg-green-500/10 border-green-500/30" },
                  { label: "Deep-dive", sub: "2500+ words", value: wcBuckets.vlong, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
                ].map((b) => (
                  <div key={b.label} className={`rounded-xl border px-3 py-3 text-center ${b.color}`}>
                    <p className="text-2xl font-black">{b.value}</p>
                    <p className="text-xs font-semibold mt-0.5">{b.label}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">{b.sub}</p>
                  </div>
                ))}
              </div>
              {articles.length > 0 && (
                <p className="text-xs text-gray-600 mt-3">
                  Avg word count:{" "}
                  <span className="text-gray-400 font-medium">
                    {Math.round(articles.reduce((s, a) => s + a.wordCount, 0) / articles.length).toLocaleString()}
                  </span>{" "}
                  words
                </p>
              )}
            </SectionCard>

            {/* ── Quality distribution ─────────────────────────────────────── */}
            {qualityStats && (
              <SectionCard
                title="Quality Score Distribution"
                sub={`${qualityStats.totalScored} articles scored · avg ${qualityStats.avgScore}/10 · ${scoredPct}% coverage`}
              >
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Excellent", sub: "9–10", value: qualityStats.dist.excellent, color: "text-green-400 bg-green-500/10 border-green-500/30" },
                    { label: "Good", sub: "7–8", value: qualityStats.dist.good, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
                    { label: "Fair", sub: "5–6", value: qualityStats.dist.fair, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
                    { label: "Poor", sub: "< 5", value: qualityStats.dist.poor, color: "text-red-400 bg-red-500/10 border-red-500/30" },
                  ].map((b) => (
                    <div key={b.label} className={`rounded-xl border px-3 py-3 text-center ${b.color}`}>
                      <p className="text-2xl font-black">{b.value}</p>
                      <p className="text-xs font-semibold mt-0.5">{b.label}</p>
                      <p className="text-[10px] opacity-70">{b.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Fixer queue */}
                {qualityStats.lowestScoring.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Fixer queue — {qualityStats.fixerQueue} articles need improvement
                    </p>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto">
                      {qualityStats.lowestScoring.map((a) => (
                        <div key={a.slug} className="flex items-center gap-3 text-xs">
                          <QualityBadge score={a.score} />
                          <a
                            href={`https://datalatte.pro/blog/${a.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 truncate flex-1 hover:text-amber-300 transition"
                          >
                            {a.slug.replace(/-/g, " ")}
                          </a>
                          {a.improvedAt && (
                            <span className="text-gray-600 shrink-0">
                              improved {new Date(a.improvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recently improved */}
                {qualityStats.recentlyImproved.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-800">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Recently improved (last 7 days)
                    </p>
                    <div className="space-y-1.5">
                      {qualityStats.recentlyImproved.slice(0, 5).map((a) => (
                        <div key={a.slug} className="flex items-center gap-3 text-xs">
                          <QualityBadge score={a.score} />
                          {a.improvedFrom !== null && (
                            <span className="text-gray-600 shrink-0 font-mono">
                              {a.improvedFrom}→{a.score}
                            </span>
                          )}
                          <span className="text-gray-400 truncate flex-1">
                            {a.slug.replace(/-/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* ── Velocity trend ────────────────────────────────────────────── */}
            <SectionCard title="Publishing Velocity" sub="Daily output for the last 14 days">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="text-left pb-2 font-medium">Date</th>
                      <th className="text-right pb-2 font-medium">Articles</th>
                      <th className="text-left pb-2 pl-4 font-medium">Bar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {[...last14Days].reverse().map((day) => (
                      <tr key={day.dateStr} className={day.dateStr === today ? "bg-amber-500/5" : ""}>
                        <td className={`py-1.5 ${day.dateStr === today ? "text-amber-300 font-medium" : "text-gray-400"}`}>
                          {day.label}{day.dateStr === today && " (today)"}
                        </td>
                        <td className="text-right py-1.5 font-mono text-gray-300">{day.count}</td>
                        <td className="py-1.5 pl-4">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`h-2 rounded-full ${day.dateStr === today ? "bg-amber-500" : "bg-amber-700/60"}`}
                              style={{ width: `${Math.max((day.count / maxDayCount) * 120, day.count > 0 ? 8 : 2)}px` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

          </>
        )}
      </main>
    </div>
  );
}
