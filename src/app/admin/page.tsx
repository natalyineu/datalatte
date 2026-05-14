"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QueueEntry {
  slug: string;
  title: string;
  primaryKeyword: string;
  cluster: string;
  targetWords: number;
  status: "pending" | "generated" | "published";
  generatedDate: string | null;
  addedDate: string;
  errorNote?: string;
}

interface Article {
  slug: string;
  title: string;
  date: string;
  wordCount: number;
  tags: string[];
  url: string;
}

interface GenerateResult {
  success: boolean;
  slug?: string;
  url?: string;
  wordCount?: number;
  message?: string;
  error?: string;
  details?: string;
}

interface Recommendation {
  title: string;
  slug: string;
  primaryKeyword: string;
  cluster: string;
  targetWords: number;
  source: "cluster" | "paa" | "autocomplete";
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  generated: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  published: "bg-green-500/20 text-green-300 border border-green-500/30",
};

// ── Helper: authenticated fetch ───────────────────────────────────────────────

async function authFetch(url: string, options: RequestInit = {}, token: string) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/queue", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        sessionStorage.setItem("admin_token", password);
        onLogin(password);
      } else {
        setError("Invalid password.");
      }
    } catch {
      setError("Connection error. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">☕</span>
          <h1 className="text-2xl font-bold text-white mt-3">DataLatte Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Content generation dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Admin password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter ADMIN_PASSWORD"
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition"
          >
            {loading ? "Verifying…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [queue, setQueue]                   = useState<QueueEntry[]>([]);
  const [articles, setArticles]             = useState<Article[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [addingRec, setAddingRec]           = useState<string | null>(null);
  const [generating, setGenerating]         = useState(false);
  const [genResult, setGenResult]           = useState<GenerateResult | null>(null);
  const [addError, setAddError]             = useState("");
  const [addSuccess, setAddSuccess]         = useState("");

  // Batch generation state
  const [batchRunning, setBatchRunning]     = useState(false);
  const [batchProgress, setBatchProgress]   = useState<{
    current: number;
    total: number;
    results: Array<{ title: string; slug: string; success: boolean; error?: string }>;
  } | null>(null);
  const cancelBatchRef = useRef(false);
  const [activeTab, setActiveTab]           = useState<"queue" | "articles">("queue");
  const [form, setForm]             = useState({
    title: "",
    slug: "",
    primaryKeyword: "",
    cluster: "",
    targetWords: "1800",
  });

  // Auto-derive slug from title
  function deriveSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
  }

  // ── Fetchers ──────────────────────────────────────────────────────────────

  const fetchQueue = useCallback(async () => {
    const res = await authFetch("/api/admin/queue", {}, token);
    if (res.ok) {
      const d = await res.json() as { queue: QueueEntry[] };
      setQueue(d.queue);
    }
  }, [token]);

  const fetchArticles = useCallback(async () => {
    const res = await authFetch("/api/admin/articles", {}, token);
    if (res.ok) {
      const d = await res.json() as { articles: Article[] };
      setArticles(d.articles);
    }
  }, [token]);

  const fetchRecommendations = useCallback(async () => {
    const res = await authFetch("/api/admin/recommendations", {}, token);
    if (res.ok) {
      const d = await res.json() as { recommendations: Recommendation[] };
      setRecommendations(d.recommendations ?? []);
    }
  }, [token]);

  useEffect(() => {
    fetchQueue();
    fetchArticles();
    fetchRecommendations();
  }, [fetchQueue, fetchArticles, fetchRecommendations]);

  // ── Add to queue ──────────────────────────────────────────────────────────

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    const res = await authFetch(
      "/api/admin/queue",
      {
        method: "POST",
        body: JSON.stringify({ ...form, targetWords: Number(form.targetWords) }),
      },
      token
    );
    const data = await res.json() as { error?: string };
    if (res.ok) {
      setAddSuccess(`"${form.title}" added to queue.`);
      setForm({ title: "", slug: "", primaryKeyword: "", cluster: "", targetWords: "1800" });
      fetchQueue();
    } else {
      setAddError(data.error ?? "Failed to add entry");
    }
  }

  // ── Add recommendation to queue ──────────────────────────────────────────

  async function handleAddRecommendation(rec: Recommendation) {
    setAddingRec(rec.slug);
    const res = await authFetch(
      "/api/admin/queue",
      {
        method: "POST",
        body: JSON.stringify({
          slug: rec.slug,
          title: rec.title,
          primaryKeyword: rec.primaryKeyword,
          cluster: rec.cluster,
          targetWords: rec.targetWords,
        }),
      },
      token
    );
    if (res.ok) {
      // Remove from recommendations list and refresh queue
      setRecommendations((prev) => prev.filter((r) => r.slug !== rec.slug));
      fetchQueue();
    }
    setAddingRec(null);
  }

  // ── Generate next ─────────────────────────────────────────────────────────

  async function handleGenerate() {
    setGenerating(true);
    setGenResult(null);
    const res = await authFetch("/api/admin/generate", { method: "POST" }, token);
    const data = await res.json() as GenerateResult;
    setGenResult(data);
    setGenerating(false);
    fetchQueue();
    fetchArticles();
  }

  // ── Generate ALL pending articles sequentially ───────────────────────────

  async function handleGenerateAll() {
    const pending = queue.filter((e) => e.status === "pending");
    if (pending.length === 0) return;

    cancelBatchRef.current = false;
    setBatchRunning(true);
    setGenResult(null);
    setBatchProgress({ current: 0, total: pending.length, results: [] });

    for (let i = 0; i < pending.length; i++) {
      if (cancelBatchRef.current) break;

      const entry = pending[i];
      setBatchProgress((prev) => prev ? { ...prev, current: i + 1 } : null);

      const res = await authFetch("/api/admin/generate", { method: "POST" }, token);
      const data = await res.json() as GenerateResult;

      setBatchProgress((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          results: [
            ...prev.results,
            {
              title: entry.title,
              slug: entry.slug,
              success: !!data.success,
              error: data.error,
            },
          ],
        };
      });

      // Refresh queue after each article so status updates are visible
      await fetchQueue();
      await fetchArticles();

      // Small pause between requests to avoid hammering the API
      if (i < pending.length - 1 && !cancelBatchRef.current) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    setBatchRunning(false);
  }

  function handleCancelBatch() {
    cancelBatchRef.current = true;
    setBatchRunning(false);
  }

  // ── Delete queue entry ────────────────────────────────────────────────────

  async function handleDelete(slug: string) {
    await authFetch(`/api/admin/queue?slug=${slug}`, { method: "DELETE" }, token);
    fetchQueue();
  }

  // ── Update status ─────────────────────────────────────────────────────────

  async function handleStatusChange(slug: string, status: string) {
    await authFetch(
      "/api/admin/queue",
      { method: "PATCH", body: JSON.stringify({ slug, status }) },
      token
    );
    fetchQueue();
  }

  const pendingCount   = queue.filter((e) => e.status === "pending").length;
  const generatedCount = queue.filter((e) => e.status === "generated").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☕</span>
          <div>
            <h1 className="font-bold text-lg leading-none">DataLatte Admin</h1>
            <p className="text-gray-400 text-xs mt-0.5">Content generation dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              {pendingCount} pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              {generatedCount} generated
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              {articles.length} published
            </span>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-gray-800"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Add New Topic ───────────────────────────────────────────────── */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <span>+</span> Add Article to Queue
          </h2>
          <form onSubmit={handleAdd} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => {
                    const t = e.target.value;
                    setForm((f) => ({ ...f, title: t, slug: deriveSlug(t) }));
                  }}
                  placeholder="How to Run Google Ads for a Gym"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="how-to-run-google-ads-for-a-gym"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Primary Keyword *</label>
                <input
                  value={form.primaryKeyword}
                  onChange={(e) => setForm((f) => ({ ...f, primaryKeyword: e.target.value }))}
                  placeholder="google ads for gyms"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Cluster *</label>
                <input
                  value={form.cluster}
                  onChange={(e) => setForm((f) => ({ ...f, cluster: e.target.value }))}
                  placeholder="Cluster 1 — Google Ads"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Target Words *</label>
                <input
                  type="number"
                  value={form.targetWords}
                  onChange={(e) => setForm((f) => ({ ...f, targetWords: e.target.value }))}
                  min={500}
                  max={5000}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
            {addError   && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{addError}</p>}
            {addSuccess && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{addSuccess}</p>}
            <div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition"
              >
                Add to Queue
              </button>
            </div>
          </form>
        </section>

        {/* ── Recommended Topics ──────────────────────────────────────────── */}
        {recommendations.length > 0 && (
          <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span>📊</span> Recommended Topics
                <span className="text-xs font-normal text-gray-400 ml-1">
                  — from SEO research
                </span>
              </h2>
              <span className="text-xs text-gray-500">
                {recommendations.length} suggestions
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.slug}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {rec.cluster.split(" — ")[0] ?? rec.cluster}
                      </span>
                      <span className="text-xs text-gray-500">
                        ~{rec.targetWords.toLocaleString()} words
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white leading-snug">
                      {rec.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 font-mono truncate">
                      {rec.primaryKeyword}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddRecommendation(rec)}
                    disabled={addingRec === rec.slug}
                    className="w-full text-xs font-semibold bg-amber-600/20 hover:bg-amber-600 border border-amber-600/40 hover:border-amber-500 text-amber-300 hover:text-white rounded-lg py-2 transition disabled:opacity-50"
                  >
                    {addingRec === rec.slug ? "Adding…" : "+ Add to Queue"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="flex gap-2 border-b border-gray-800">
          {(["queue", "articles"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab === "queue" ? `Queue (${queue.length})` : `Published (${articles.length})`}
            </button>
          ))}
        </div>

        {/* ── Queue tab ───────────────────────────────────────────────────── */}
        {activeTab === "queue" && (
          <section className="space-y-4">
            {/* Generate buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Single */}
              <button
                onClick={handleGenerate}
                disabled={generating || batchRunning || pendingCount === 0}
                className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>⚡ Generate Next</>
                )}
              </button>

              {/* Batch */}
              {pendingCount > 1 && !batchRunning && (
                <button
                  onClick={handleGenerateAll}
                  disabled={generating || batchRunning}
                  className="bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition flex items-center gap-2"
                >
                  🚀 Generate All ({pendingCount} pending)
                </button>
              )}

              {/* Cancel batch */}
              {batchRunning && (
                <button
                  onClick={handleCancelBatch}
                  className="bg-red-700/40 hover:bg-red-700 border border-red-600/50 text-red-300 hover:text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition"
                >
                  ✕ Cancel
                </button>
              )}

              {pendingCount === 0 && !batchRunning && !batchProgress && (
                <p className="text-gray-400 text-sm">No pending articles. Add topics above.</p>
              )}
            </div>

            {/* Batch progress */}
            {batchProgress && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                {/* Header + progress bar */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">
                    {batchRunning
                      ? `Generating ${batchProgress.current} of ${batchProgress.total}…`
                      : `Done — ${batchProgress.results.filter((r) => r.success).length}/${batchProgress.total} succeeded`}
                  </span>
                  {!batchRunning && (
                    <button
                      onClick={() => setBatchProgress(null)}
                      className="text-xs text-gray-500 hover:text-white transition"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(batchProgress.results.length / batchProgress.total) * 100}%`,
                    }}
                  />
                </div>

                {/* Per-article results */}
                {batchProgress.results.length > 0 && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {batchProgress.results.map((r) => (
                      <div
                        key={r.slug}
                        className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${
                          r.success
                            ? "bg-green-500/10 text-green-300"
                            : "bg-red-500/10 text-red-300"
                        }`}
                      >
                        <span>{r.success ? "✅" : "❌"}</span>
                        <span className="flex-1 min-w-0">
                          <span className="font-medium">{r.title}</span>
                          {r.error && (
                            <span className="block text-red-400 mt-0.5">{r.error}</span>
                          )}
                        </span>
                      </div>
                    ))}
                    {batchRunning && batchProgress.current <= batchProgress.total && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2">
                        <span className="inline-block w-3 h-3 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                        Working on article {batchProgress.current}…
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Single-article result */}
            {genResult && !batchProgress && (
              <div className={`rounded-xl p-4 border text-sm ${
                genResult.success
                  ? "bg-green-500/10 border-green-500/30 text-green-300"
                  : "bg-red-500/10 border-red-500/30 text-red-300"
              }`}>
                {genResult.success ? (
                  <div className="space-y-1">
                    <p className="font-semibold">✅ Article generated successfully!</p>
                    <p>Slug: <span className="font-mono">{genResult.slug}</span> · {genResult.wordCount} words</p>
                    <a href={genResult.url} target="_blank" rel="noopener noreferrer"
                       className="underline hover:no-underline break-all">{genResult.url}</a>
                  </div>
                ) : genResult.message ? (
                  <p>{genResult.message}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="font-semibold">❌ Generation failed</p>
                    <p>{genResult.error}</p>
                    {genResult.details && (
                      <pre className="text-xs mt-2 bg-black/20 rounded p-2 overflow-auto max-h-32">
                        {genResult.details}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Queue list */}
            {queue.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Queue is empty</p>
                <p className="text-sm mt-1">Add topics using the form above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((entry) => (
                  <div
                    key={entry.slug}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[entry.status]}`}>
                          {entry.status}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{entry.slug}</span>
                      </div>
                      <p className="font-medium text-sm text-white truncate">{entry.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {entry.primaryKeyword} · {entry.cluster} · {entry.targetWords} words
                      </p>
                      {entry.errorNote && (
                        <p className="text-xs text-red-400 mt-1 bg-red-500/10 rounded px-2 py-1">
                          {entry.errorNote}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {entry.status === "generated" && (
                        <button
                          onClick={() => handleStatusChange(entry.slug, "published")}
                          className="text-xs bg-green-700/40 hover:bg-green-700 text-green-300 border border-green-700/50 rounded-lg px-3 py-1.5 transition"
                        >
                          Mark Published
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(entry.slug)}
                        className="text-xs text-gray-500 hover:text-red-400 border border-gray-700 hover:border-red-500/40 rounded-lg px-3 py-1.5 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Articles tab ─────────────────────────────────────────────────── */}
        {activeTab === "articles" && (
          <section>
            {articles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No articles found in INDEX.md</p>
              </div>
            ) : (
              <div className="space-y-2">
                {articles.map((a) => (
                  <div
                    key={a.slug}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{a.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="font-mono">{a.slug}</span>
                        <span>·</span>
                        <span>{a.date}</span>
                        <span>·</span>
                        <span>{a.wordCount.toLocaleString()} words</span>
                      </div>
                      {a.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {a.tags.slice(0, 4).map((t) => (
                            <span key={t} className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/60 rounded-lg px-3 py-1.5 transition shrink-0"
                    >
                      View →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

// ── Root page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) setToken(stored);
    setReady(true);
  }, []);

  function handleLogin(t: string) {
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
