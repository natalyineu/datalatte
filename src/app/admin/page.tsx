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

type TabId = "pipeline" | "queue" | "research" | "published" | "reports";

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

// ── Helper: format date ───────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
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

// ── Inline editable cell ──────────────────────────────────────────────────────

function EditableCell({
  value,
  onSave,
  className = "",
  type = "text",
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const [dirty, setDirty]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);

  function startEdit() {
    setEditing(true);
    setDraft(value);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    setEditing(false);
    if (draft !== value) {
      onSave(draft);
      setDirty(true);
      setTimeout(() => setDirty(false), 2000);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className="bg-gray-800 border-none outline-none text-white px-1 py-0.5 rounded w-full text-sm"
      />
    );
  }

  return (
    <span
      onClick={startEdit}
      className={`cursor-pointer hover:text-amber-300 transition ${dirty ? "text-amber-400" : ""} ${className}`}
      title="Click to edit"
    >
      {value || <span className="text-gray-600 italic">—</span>}
      {dirty && <span className="ml-1 text-xs text-amber-500">✓</span>}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [queue, setQueue]                   = useState<QueueEntry[]>([]);
  const [articles, setArticles]             = useState<Article[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab]           = useState<TabId>("pipeline");

  // Queue tab state
  const [queueSearch, setQueueSearch]       = useState("");
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>("all");
  const [queueClusterFilter, setQueueClusterFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm]   = useState<string | null>(null);
  const [bulkOpen, setBulkOpen]             = useState(false);
  const [bulkText, setBulkText]             = useState("");
  const [bulkParsed, setBulkParsed]         = useState<Array<{
    title: string; primaryKeyword: string; cluster: string; targetWords: number; slug: string;
  }>>([]);
  const [bulkAdding, setBulkAdding]         = useState(false);

  // Generate state
  const [generating, setGenerating]         = useState(false);
  const [genResult, setGenResult]           = useState<GenerateResult | null>(null);
  const [batchRunning, setBatchRunning]     = useState(false);
  const [batchCooldown, setBatchCooldown]   = useState(0);
  const [batchProgress, setBatchProgress]   = useState<{
    current: number;
    total: number;
    results: Array<{ title: string; slug: string; success: boolean; error?: string }>;
  } | null>(null);
  const cancelBatchRef = useRef(false);

  // Add form state
  const [addingRec, setAddingRec]           = useState<string | null>(null);
  const [collapsedClusters, setCollapsedClusters] = useState<Set<string>>(new Set());

  // Published sort
  const [pubSort, setPubSort]               = useState<"date" | "words">("date");

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

  // ── Helpers ───────────────────────────────────────────────────────────────

  function deriveSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
  }

  // ── Queue actions ─────────────────────────────────────────────────────────

  async function handleDelete(slug: string) {
    await authFetch(`/api/admin/queue?slug=${slug}`, { method: "DELETE" }, token);
    setDeleteConfirm(null);
    fetchQueue();
  }

  async function handleStatusChange(slug: string, status: string) {
    await authFetch("/api/admin/queue", { method: "PATCH", body: JSON.stringify({ slug, status }) }, token);
    fetchQueue();
  }

  async function handleFieldEdit(slug: string, field: string, value: string) {
    await authFetch("/api/admin/queue", { method: "PATCH", body: JSON.stringify({ slug, [field]: value }) }, token);
    fetchQueue();
  }

  async function handleMoveToTop(slug: string) {
    await authFetch("/api/admin/queue", { method: "PATCH", body: JSON.stringify({ slug, moveToTop: true }) }, token);
    fetchQueue();
  }

  // ── Generate ──────────────────────────────────────────────────────────────

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
          results: [...prev.results, { title: entry.title, slug: entry.slug, success: !!data.success, error: data.error }],
        };
      });
      await fetchQueue();
      await fetchArticles();
      if (i < pending.length - 1 && !cancelBatchRef.current) {
        for (let s = 20; s > 0; s--) {
          if (cancelBatchRef.current) break;
          setBatchCooldown(s);
          await new Promise((r) => setTimeout(r, 1000));
        }
        setBatchCooldown(0);
      }
    }
    setBatchRunning(false);
  }

  function handleCancelBatch() {
    cancelBatchRef.current = true;
    setBatchRunning(false);
  }

  // ── Recommendations ───────────────────────────────────────────────────────

  async function handleAddRecommendation(rec: Recommendation) {
    setAddingRec(rec.slug);
    const res = await authFetch("/api/admin/queue", {
      method: "POST",
      body: JSON.stringify({ slug: rec.slug, title: rec.title, primaryKeyword: rec.primaryKeyword, cluster: rec.cluster, targetWords: rec.targetWords }),
    }, token);
    if (res.ok) {
      setRecommendations((prev) => prev.filter((r) => r.slug !== rec.slug));
      fetchQueue();
    }
    setAddingRec(null);
  }

  async function handleAddAllInCluster(clusterName: string) {
    const recs = recommendations.filter((r) => r.cluster === clusterName);
    for (const rec of recs) {
      await handleAddRecommendation(rec);
    }
  }

  // ── Bulk import ───────────────────────────────────────────────────────────

  function parseBulk(text: string) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    return lines.map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const title = parts[0] ?? "";
      const primaryKeyword = parts[1] ?? title;
      const cluster = parts[2] ?? "General";
      const targetWords = parseInt(parts[3] ?? "1800", 10) || 1800;
      return { title, primaryKeyword, cluster, targetWords, slug: deriveSlug(title) };
    }).filter((r) => r.title.length > 0);
  }

  async function handleBulkAdd() {
    setBulkAdding(true);
    for (const item of bulkParsed) {
      await authFetch("/api/admin/queue", {
        method: "POST",
        body: JSON.stringify(item),
      }, token);
    }
    setBulkAdding(false);
    setBulkText("");
    setBulkParsed([]);
    setBulkOpen(false);
    fetchQueue();
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const pendingCount   = queue.filter((e) => e.status === "pending").length;
  const generatedCount = queue.filter((e) => e.status === "generated").length;
  const publishedQueue = queue.filter((e) => e.status === "published");

  const today = todayStr();
  const publishedToday = queue.filter((e) => e.generatedDate?.startsWith(today)).length;

  const last7Published = queue.filter((e) => {
    if (!e.generatedDate) return false;
    const d = new Date(e.generatedDate);
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return d >= cutoff;
  }).length;
  const avgPerDay = (last7Published / 7).toFixed(1);

  const estMinutes = pendingCount * 5;
  const estTime = estMinutes < 60
    ? `${estMinutes}m`
    : `${Math.floor(estMinutes / 60)}h ${estMinutes % 60}m`;

  const clustersInPublished = new Set(publishedQueue.map((e) => e.cluster)).size;

  const queueClusters = Array.from(new Set(queue.map((e) => e.cluster))).sort();

  const filteredQueue = queue.filter((entry) => {
    const matchSearch = !queueSearch ||
      entry.title.toLowerCase().includes(queueSearch.toLowerCase()) ||
      entry.primaryKeyword.toLowerCase().includes(queueSearch.toLowerCase());
    const matchStatus = queueStatusFilter === "all" || entry.status === queueStatusFilter;
    const matchCluster = queueClusterFilter === "all" || entry.cluster === queueClusterFilter;
    return matchSearch && matchStatus && matchCluster;
  });

  // Activity feed: last 20 published sorted by generatedDate desc
  const activityFeed = [...queue]
    .filter((e) => e.generatedDate)
    .sort((a, b) => (b.generatedDate ?? "").localeCompare(a.generatedDate ?? ""))
    .slice(0, 20);

  // Research: group by cluster
  const recsByCluster: Record<string, Recommendation[]> = {};
  for (const rec of recommendations) {
    if (!recsByCluster[rec.cluster]) recsByCluster[rec.cluster] = [];
    recsByCluster[rec.cluster].push(rec);
  }

  // Published articles sorted
  const sortedArticles = [...articles].sort((a, b) => {
    if (pubSort === "date") return b.date.localeCompare(a.date);
    return b.wordCount - a.wordCount;
  });

  // Reports: articles per day (last 14 days)
  const last14Days: { date: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = queue.filter((e) => e.generatedDate?.startsWith(dateStr)).length;
    last14Days.push({ date: dateStr, label, count });
  }
  const maxDayCount = Math.max(...last14Days.map((d) => d.count), 1);

  // Cluster distribution in published
  const clusterDistrib: Record<string, number> = {};
  for (const e of publishedQueue) {
    clusterDistrib[e.cluster] = (clusterDistrib[e.cluster] ?? 0) + 1;
  }
  const clusterDistribEntries = Object.entries(clusterDistrib).sort((a, b) => b[1] - a[1]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "pipeline", label: "Pipeline" },
    { id: "queue",    label: `Queue (${queue.length})` },
    { id: "research", label: `Research (${recommendations.length})` },
    { id: "published", label: `Published (${articles.length})` },
    { id: "reports",  label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☕</span>
          <div>
            <h1 className="font-bold text-lg leading-none">DataLatte Admin</h1>
            <p className="text-gray-400 text-xs mt-0.5">Pipeline management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              {pendingCount} pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {generatedCount} generated
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
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

      {/* Tab nav */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Tab: Pipeline                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "pipeline" && (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard label="Total Published" value={articles.length} />
              <StatCard label="Published Today" value={publishedToday} sub={today} />
              <StatCard label="Pending in Queue" value={pendingCount} />
              <StatCard label="Est. Time to Clear" value={pendingCount === 0 ? "—" : estTime} sub={`${pendingCount} × 5 min`} />
              <StatCard label="Avg Articles / Day" value={avgPerDay} sub="last 7 days" />
              <StatCard label="Clusters Covered" value={clustersInPublished} sub="in published" />
            </div>

            {/* Generate controls */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Generation Controls</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={generating || batchRunning || pendingCount === 0}
                  className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition flex items-center gap-2"
                >
                  {generating ? (
                    <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                  ) : "⚡ Generate Next"}
                </button>
                {pendingCount > 1 && !batchRunning && (
                  <button
                    onClick={handleGenerateAll}
                    disabled={generating || batchRunning}
                    className="bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition"
                  >
                    🚀 Generate All ({pendingCount} pending)
                  </button>
                )}
                {batchRunning && (
                  <button
                    onClick={handleCancelBatch}
                    className="bg-red-700/40 hover:bg-red-700 border border-red-600/50 text-red-300 hover:text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition"
                  >
                    ✕ Cancel
                  </button>
                )}
              </div>

              {/* Batch progress */}
              {batchProgress && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">
                      {batchRunning
                        ? `Generating ${batchProgress.current} of ${batchProgress.total}…`
                        : `Done — ${batchProgress.results.filter((r) => r.success).length}/${batchProgress.total} succeeded`}
                    </span>
                    {!batchRunning && (
                      <button onClick={() => setBatchProgress(null)} className="text-xs text-gray-500 hover:text-white transition">
                        Dismiss
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(batchProgress.results.length / batchProgress.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-400 shrink-0 w-10 text-right">
                      {Math.round((batchProgress.results.length / batchProgress.total) * 100)}%
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {batchProgress.results.map((r) => (
                      <div key={r.slug} className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${r.success ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                        <span>{r.success ? "✅" : "❌"}</span>
                        <span className="flex-1 min-w-0">
                          <span className="font-medium">{r.title}</span>
                          {r.error && <span className="block text-red-400 mt-0.5">{r.error}</span>}
                        </span>
                      </div>
                    ))}
                    {batchRunning && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2">
                        <span className="inline-block w-3 h-3 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin shrink-0" />
                        {batchCooldown > 0
                          ? `Rate-limit cooldown — next article in ${batchCooldown}s…`
                          : `Generating article ${batchProgress.current} of ${batchProgress.total}…`}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Single generate result */}
              {genResult && !batchProgress && (
                <div className={`mt-4 rounded-xl p-4 border text-sm ${genResult.success ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
                  {genResult.success ? (
                    <div className="space-y-1">
                      <p className="font-semibold">✅ Article generated successfully!</p>
                      <p>Slug: <span className="font-mono">{genResult.slug}</span> · {genResult.wordCount} words</p>
                      <a href={genResult.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline break-all">{genResult.url}</a>
                    </div>
                  ) : genResult.message ? (
                    <p>{genResult.message}</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-semibold">❌ Generation failed</p>
                      <p>{genResult.error}</p>
                      {genResult.details && (
                        <pre className="text-xs mt-2 bg-black/20 rounded p-2 overflow-auto max-h-32">{genResult.details}</pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity timeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="font-semibold text-white">Recent Activity</h2>
                <p className="text-xs text-gray-500 mt-0.5">Last 20 processed articles</p>
              </div>
              {activityFeed.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-500 text-sm">No activity yet</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {activityFeed.map((entry) => (
                    <div key={entry.slug} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-800/50 transition">
                      <span className="text-xs text-gray-500 font-mono shrink-0 w-28">
                        {formatDate(entry.generatedDate)}
                      </span>
                      <span className="flex-1 text-sm text-white truncate">{entry.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 hidden sm:inline">
                        {entry.cluster.split(" — ")[0] ?? entry.cluster}
                      </span>
                      <a
                        href={`https://datalatte.pro/blog/${entry.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-amber-400 transition shrink-0"
                        title="View on site"
                      >
                        ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Tab: Queue                                                         */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "queue" && (
          <div className="space-y-6">
            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                placeholder="Search title or keyword…"
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition w-64"
              />
              <div className="flex gap-1">
                {(["all", "pending", "generated", "published"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setQueueStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
                      queueStatusFilter === s
                        ? "bg-amber-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <select
                value={queueClusterFilter}
                onChange={(e) => setQueueClusterFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition"
              >
                <option value="all">All clusters</option>
                {queueClusters.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="text-xs text-gray-500">{filteredQueue.length} matching</span>
            </div>

            {/* Queue table */}
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-8">#</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Keyword</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Cluster</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Words</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-gray-500">No entries match your filters</td>
                    </tr>
                  ) : (
                    filteredQueue.map((entry, idx) => (
                      <tr key={entry.slug} className="hover:bg-gray-800/50 transition">
                        <td className="px-4 py-3 text-gray-600 text-xs">{idx + 1}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <EditableCell
                            value={entry.title}
                            onSave={(v) => handleFieldEdit(entry.slug, "title", v)}
                            className="text-white font-medium"
                          />
                          {entry.errorNote && (
                            <p className="text-xs text-red-400 mt-1">{entry.errorNote}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell max-w-[160px]">
                          <EditableCell
                            value={entry.primaryKeyword}
                            onSave={(v) => handleFieldEdit(entry.slug, "primaryKeyword", v)}
                            className="text-gray-400 font-mono text-xs"
                          />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell max-w-[140px]">
                          <EditableCell
                            value={entry.cluster}
                            onSave={(v) => handleFieldEdit(entry.slug, "cluster", v)}
                            className="text-gray-400 text-xs"
                          />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <EditableCell
                            value={String(entry.targetWords)}
                            onSave={(v) => handleFieldEdit(entry.slug, "targetWords", v)}
                            className="text-gray-400 text-xs"
                            type="number"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[entry.status]}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500 font-mono">
                          {entry.generatedDate
                            ? new Date(entry.generatedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : entry.addedDate
                            ? new Date(entry.addedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {entry.status === "pending" && (
                              <button
                                onClick={() => handleMoveToTop(entry.slug)}
                                title="Move to top"
                                className="text-gray-500 hover:text-amber-400 border border-gray-700 hover:border-amber-500/40 rounded px-2 py-1 text-xs transition"
                              >
                                ↑
                              </button>
                            )}
                            {entry.status === "generated" && (
                              <button
                                onClick={() => handleStatusChange(entry.slug, "published")}
                                className="text-xs bg-green-700/40 hover:bg-green-700 text-green-300 border border-green-700/50 rounded px-2 py-1 transition"
                              >
                                Publish
                              </button>
                            )}
                            {deleteConfirm === entry.slug ? (
                              <>
                                <button
                                  onClick={() => handleDelete(entry.slug)}
                                  className="text-xs bg-red-700 text-white rounded px-2 py-1 transition"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs text-gray-500 hover:text-white rounded px-2 py-1 transition"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(entry.slug)}
                                className="text-gray-600 hover:text-red-400 border border-gray-700 hover:border-red-500/40 rounded px-2 py-1 text-xs transition"
                                title="Delete"
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bulk import */}
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setBulkOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 bg-gray-900 hover:bg-gray-800 transition text-sm font-medium text-gray-300"
              >
                <span>Bulk Import</span>
                <span className="text-gray-500 text-xs">{bulkOpen ? "▲ Collapse" : "▼ Expand"}</span>
              </button>
              {bulkOpen && (
                <div className="bg-gray-900 border-t border-gray-800 p-5 space-y-4">
                  <textarea
                    value={bulkText}
                    onChange={(e) => {
                      setBulkText(e.target.value);
                      setBulkParsed(parseBulk(e.target.value));
                    }}
                    rows={6}
                    placeholder={"Paste topics, one per line:\nTitle | primary keyword | cluster | word count\nHow to run Google Ads for a gym | google ads for gyms | Google Ads | 1800"}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition font-mono resize-y"
                  />
                  {bulkParsed.length > 0 && (
                    <>
                      <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-700 bg-gray-800">
                              <th className="text-left px-3 py-2 text-gray-500">Title</th>
                              <th className="text-left px-3 py-2 text-gray-500">Keyword</th>
                              <th className="text-left px-3 py-2 text-gray-500">Cluster</th>
                              <th className="text-left px-3 py-2 text-gray-500">Words</th>
                              <th className="text-left px-3 py-2 text-gray-500">Slug</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {bulkParsed.map((item, i) => (
                              <tr key={i} className="bg-gray-900">
                                <td className="px-3 py-2 text-white">{item.title}</td>
                                <td className="px-3 py-2 text-gray-400">{item.primaryKeyword}</td>
                                <td className="px-3 py-2 text-gray-400">{item.cluster}</td>
                                <td className="px-3 py-2 text-gray-400">{item.targetWords}</td>
                                <td className="px-3 py-2 text-gray-500 font-mono">{item.slug}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button
                        onClick={handleBulkAdd}
                        disabled={bulkAdding}
                        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition"
                      >
                        {bulkAdding ? "Adding…" : `Add ${bulkParsed.length} topics to queue`}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Tab: Research                                                       */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "research" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">Topic Recommendations</h2>
                <p className="text-xs text-gray-500 mt-0.5">{recommendations.length} suggestions from SEO research</p>
              </div>
              <button
                onClick={fetchRecommendations}
                className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-1.5 transition"
              >
                ↻ Refresh
              </button>
            </div>

            {Object.keys(recsByCluster).length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No recommendations available</div>
            ) : (
              Object.entries(recsByCluster).map(([cluster, recs]) => {
                const isCollapsed = collapsedClusters.has(cluster);
                return (
                  <div key={cluster} className="border border-gray-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-gray-900 border-b border-gray-800">
                      <button
                        onClick={() => {
                          setCollapsedClusters((prev) => {
                            const next = new Set(prev);
                            if (next.has(cluster)) next.delete(cluster);
                            else next.add(cluster);
                            return next;
                          });
                        }}
                        className="flex items-center gap-2 text-left flex-1"
                      >
                        <span className="text-sm font-semibold text-white">{cluster}</span>
                        <span className="text-xs text-gray-500">{recs.length} articles</span>
                        <span className="text-gray-600 text-xs ml-1">{isCollapsed ? "▼" : "▲"}</span>
                      </button>
                      <button
                        onClick={() => handleAddAllInCluster(cluster)}
                        className="text-xs bg-amber-600/20 hover:bg-amber-600 border border-amber-600/40 hover:border-amber-500 text-amber-300 hover:text-white rounded-lg px-3 py-1.5 transition"
                      >
                        Add All in Cluster
                      </button>
                    </div>
                    {!isCollapsed && (
                      <div className="bg-gray-900 divide-y divide-gray-800">
                        {recs.map((rec) => (
                          <div key={rec.slug} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-800/50 transition">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{rec.title}</p>
                              <p className="text-xs text-gray-500 font-mono mt-0.5">{rec.primaryKeyword} · ~{rec.targetWords.toLocaleString()} words</p>
                            </div>
                            <button
                              onClick={() => handleAddRecommendation(rec)}
                              disabled={addingRec === rec.slug}
                              className="text-xs bg-amber-600/20 hover:bg-amber-600 border border-amber-600/40 hover:border-amber-500 text-amber-300 hover:text-white rounded-lg px-3 py-1.5 transition shrink-0 disabled:opacity-50"
                            >
                              {addingRec === rec.slug ? "Adding…" : "Add →"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Tab: Published                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "published" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">{articles.length} Published Articles</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPubSort("date")}
                  className={`text-xs px-3 py-1.5 rounded-lg transition ${pubSort === "date" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                  By Date
                </button>
                <button
                  onClick={() => setPubSort("words")}
                  className={`text-xs px-3 py-1.5 rounded-lg transition ${pubSort === "words" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                  By Words
                </button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Words</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Tags</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">View</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {sortedArticles.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No articles found</td></tr>
                  ) : (
                    sortedArticles.map((a) => (
                      <tr key={a.slug} className="hover:bg-gray-800/50 transition">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white truncate max-w-xs">{a.title}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">{a.slug}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-400">{a.date}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-400">{a.wordCount.toLocaleString()}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {a.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/60 rounded-lg px-3 py-1.5 transition"
                          >
                            View →
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Tab: Reports                                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            {/* Articles per day */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-1">Articles Per Day</h2>
              <p className="text-xs text-gray-500 mb-5">Last 14 days</p>
              <div className="flex items-end gap-2 h-32">
                {last14Days.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    {day.count > 0 && (
                      <span className="text-xs text-gray-400">{day.count}</span>
                    )}
                    <div
                      className="w-full rounded-t bg-amber-600/70 hover:bg-amber-500 transition min-h-[2px]"
                      style={{ height: `${Math.max((day.count / maxDayCount) * 100, day.count > 0 ? 4 : 0)}%` }}
                      title={`${day.label}: ${day.count} articles`}
                    />
                    <span className="text-xs text-gray-600 hidden sm:block" style={{ fontSize: "0.6rem" }}>
                      {day.label.replace(" ", "\n")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cluster distribution */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-1">Cluster Distribution</h2>
              <p className="text-xs text-gray-500 mb-5">Published articles by cluster</p>
              {clusterDistribEntries.length === 0 ? (
                <p className="text-gray-500 text-sm">No published articles yet</p>
              ) : (
                <div className="space-y-3">
                  {clusterDistribEntries.map(([cluster, count]) => {
                    const pct = Math.round((count / publishedQueue.length) * 100);
                    return (
                      <div key={cluster}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-300 truncate flex-1 mr-4">{cluster}</span>
                          <span className="text-gray-500 text-xs shrink-0">{count} · {pct}%</span>
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
            </div>

            {/* Status breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold text-white mb-5">Status Breakdown</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">{generatedCount}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Generated</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{publishedQueue.length}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Published</p>
                </div>
              </div>
            </div>
          </div>
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

  function handleLogin(t: string) { setToken(t); }
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

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
