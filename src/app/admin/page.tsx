"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QueueEntry {
  slug: string;
  title: string;
  primaryKeyword: string;
  cluster: string;
  targetWords: number;
  status: "pending" | "generating" | "generated" | "published";
  generatedDate: string | null;
  addedDate: string;
  errorNote?: string;
}

interface Article {
  slug: string;
  title: string;
  date: string;
  wordCount: number;
  category: string;
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
  source: "queue";
  status: "pending" | "generating" | "generated" | "published";
}

type TabId = "agents" | "proposals" | "pipeline" | "queue" | "research" | "published" | "reports";

// ── Agent types ───────────────────────────────────────────────────────────────

interface RunSummary {
  id: number;
  status: string;
  conclusion: string | null;
  startedAt: string | null;
  durationSeconds: number | null;
  url: string;
}

interface WriterReport {
  type: "writer";
  title: string | null;
  keyword: string | null;
  cluster: string | null;
  remaining: number | null;
  model: string | null;
  slug: string | null;
  noPending: boolean;
}

interface AuditorReport {
  type: "auditor";
  syntaxIssues: number;
  sampled: number;
  totalIssues: number;
  allClean: boolean;
  triggeredFixer: boolean;
  scores: { file: string; score: number }[];
  avgScore: string | null;
}

interface FixerReport {
  type: "fixer";
  nothingToFix: boolean;
  toFix: number;
  toRegen: number;
  fixedFiles: { file: string; score: number }[];
  regenFiles: string[];
}

interface PipelineReport {
  type: "pipeline";
  score: number | null;
  status: string | null;
  today: number | null;
  restarted: boolean;
  components: { generation: number | null; reliability: number | null; quality: number | null; bugs: number | null; queue: number | null };
  qualityAvg: number | null;
  published: number | null;
  pending: number | null;
}

interface ResearcherReport {
  type: "researcher";
  added: number;
  pending: number | null;
  published: number | null;
  topics: { cluster: string; title: string }[];
}

interface ImproverReport {
  type: "improver";
  analyzed: number;
  added: number;
  proposals: { slug: string; impact: number; type: string }[];
}

type AgentReport = WriterReport | AuditorReport | FixerReport | PipelineReport | ResearcherReport | ImproverReport;

// ── Proposal + Quality types ──────────────────────────────────────────────────

interface Proposal {
  id: string;
  slug: string;
  title: string;
  cluster: string;
  issue: string;
  proposal: string;
  type: "cta" | "internal_link" | "conversion_language" | "social_proof";
  impactScore: number;
  ctaScore: number;
  linkScore: number;
  conversionScore: number;
  overallScore: number;
  status: "pending" | "approved" | "rejected" | "applied";
  createdAt: string;
  reviewedAt?: string;
}

interface QualityScore {
  score: number;
  has_cta: boolean;
  on_topic: boolean;
  checkedAt: string;
}

interface AgentData {
  name: string;
  emoji: string;
  description: string;
  schedule: string;
  workflowFile: string;
  workflowId: number | null;
  state: "active" | "disabled";
  lastRun: {
    status: string;
    conclusion: string | null;
    startedAt: string | null;
    durationSeconds: number | null;
  } | null;
  runsToday: number;
  totalRuns: number;
  recentRuns: RunSummary[];
  report: AgentReport | null;
  tokensLastRun: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  generating: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
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

function _formatDate(iso: string | null): string {
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
              placeholder="Enter password"
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

// ── Agent helpers ─────────────────────────────────────────────────────────────

function relativeTime(isoStr: string | null | undefined): string {
  if (!isoStr) return "never";
  const diffMs = Date.now() - new Date(isoStr).getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  return `${diffD}d ago`;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function conclusionIcon(run: { status: string; conclusion: string | null }): string {
  if (run.status === "queued") return "⏳";
  if (run.status === "in_progress") return "🔄";
  if (run.conclusion === "success") return "✅";
  if (run.conclusion === "failure") return "❌";
  if (run.conclusion === "cancelled" || run.conclusion === "skipped") return "⏭";
  return "❓";
}

function formatRunDate(isoStr: string | null): string {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

// ── ScoreBar ──────────────────────────────────────────────────────────────────

function ScoreBar({ value, max, color = "amber" }: { value: number | null; max: number; color?: string }) {
  const pct = value !== null ? Math.round((value / max) * 100) : 0;
  const colorClass = color === "green" ? "bg-green-500" : color === "red" ? "bg-red-500" : color === "blue" ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-12 text-right shrink-0">{value ?? "—"}/{max}</span>
    </div>
  );
}

function QualityBadge({ score }: { score: number }) {
  const color = score >= 8 ? "text-green-400 bg-green-500/10 border-green-500/30"
    : score >= 6 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
    : "text-red-400 bg-red-500/10 border-red-500/30";
  return <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${color}`}>{score}/10</span>;
}

// ── AgentReportSection ────────────────────────────────────────────────────────

function AgentReportSection({ report, lastRunConclusion }: { report: AgentReport | null; lastRunConclusion?: string | null }) {
  if (report === null) {
    const isFailure = lastRunConclusion === "failure";
    return (
      <div className="mt-3 pt-3 border-t border-gray-800">
        <p className="text-xs text-gray-600 italic">
          {isFailure
            ? "⚠️ Last run failed — check GitHub Actions logs for error details"
            : "No report data yet — logs will appear after first successful run"}
        </p>
      </div>
    );
  }

  if (report.type === "writer") {
    if (report.noPending) {
      return (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">Queue empty — nothing to generate</p>
        </div>
      );
    }
    if (!report.title) {
      return (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-600 italic">Rate limited or failed last run</p>
        </div>
      );
    }
    return (
      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Last published</p>
        <p className="text-sm font-medium text-white leading-snug">{report.title}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
          <span>🔑 {report.keyword ?? "—"}</span>
          <span>📂 {report.cluster ?? "—"}</span>
          <span>🤖 {report.model ?? "—"}</span>
          <span className="text-amber-300 font-medium">📊 {report.remaining ?? "?"} pending</span>
        </div>
        {report.slug && (
          <a
            href={`https://www.datalatte.pro/blog/${report.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs text-amber-400 hover:text-amber-300 underline"
          >
            View article →
          </a>
        )}
      </div>
    );
  }

  if (report.type === "auditor") {
    return (
      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Last audit</p>
          {report.avgScore && <QualityBadge score={Number(report.avgScore)} />}
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-gray-400">{report.sampled} sampled</span>
          {report.allClean
            ? <span className="text-green-400 font-medium">✅ All clean</span>
            : <span className="text-yellow-400 font-medium">⚠️ {report.totalIssues} issues</span>}
          {report.triggeredFixer && <span className="text-blue-400">→ Fixer triggered</span>}
        </div>
        {report.scores.length > 0 && (
          <div className="space-y-1.5 mt-1">
            {report.scores.slice(0, 5).map((s) => (
              <div key={s.file} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 truncate">{s.file.replace(/-/g, " ")}</p>
                </div>
                <QualityBadge score={s.score} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (report.type === "fixer") {
    return (
      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Last fix run</p>
        {report.nothingToFix ? (
          <p className="text-sm text-green-400">✅ Nothing to fix — all articles healthy</p>
        ) : (
          <>
            <div className="flex gap-4 text-xs">
              <span className="text-green-400 font-medium">✅ {report.toFix} fixed</span>
              <span className="text-yellow-400 font-medium">♻️ {report.toRegen} re-queued</span>
            </div>
            {report.fixedFiles.slice(0, 3).map((f) => (
              <div key={f.file} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 truncate">{f.file.replace(/-/g, " ")}</span>
                <QualityBadge score={f.score} />
              </div>
            ))}
            {report.regenFiles.slice(0, 2).map((f) => (
              <p key={f} className="text-xs text-yellow-400 truncate">♻️ {f.replace(/-/g, " ")}</p>
            ))}
          </>
        )}
      </div>
    );
  }

  if (report.type === "pipeline") {
    const scoreColor = (report.score ?? 0) >= 80 ? "text-green-400" : (report.score ?? 0) >= 60 ? "text-yellow-400" : "text-red-400";
    const hasComponents = report.components.generation !== null;
    return (
      <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Health score</p>
          <span className={`text-2xl font-black ${scoreColor}`}>{report.score ?? "—"}<span className="text-sm font-normal text-gray-500">/100</span></span>
        </div>
        {hasComponents && (
          <div className="space-y-1.5">
            {[
              { label: "Generation", value: report.components.generation, max: 25, color: "amber" },
              { label: "Reliability", value: report.components.reliability, max: 25, color: "green" },
              { label: "Quality", value: report.components.quality, max: 20, color: "blue" },
              { label: "Bugs", value: report.components.bugs, max: 15, color: "green" },
              { label: "Queue", value: report.components.queue, max: 15, color: "amber" },
            ].map((c) => (
              <div key={c.label} className="grid grid-cols-[80px_1fr] items-center gap-2">
                <span className="text-xs text-gray-500">{c.label}</span>
                <ScoreBar value={c.value} max={c.max} color={c.color} />
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4 text-xs text-gray-400 pt-1">
          <span>📝 <b className="text-white">{report.today ?? 0}</b> today</span>
          {report.published !== null && <span>✅ <b className="text-white">{report.published}</b> published</span>}
          {report.pending !== null && <span>⏳ <b className="text-white">{report.pending}</b> pending</span>}
          {report.qualityAvg !== null && <span>⭐ <b className="text-white">{report.qualityAvg}</b>/10 quality</span>}
        </div>
        {report.restarted && <p className="text-xs text-yellow-400">⚠️ Auto-restarted a stuck agent this run</p>}
      </div>
    );
  }

  if (report.type === "researcher") {
    return (
      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Last research run</p>
          {report.added > 0 && (
            <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-1.5 py-0.5 rounded">+{report.added} topics</span>
          )}
        </div>
        {report.added === 0 ? (
          <p className="text-xs text-gray-500">Queue balanced — no new topics added</p>
        ) : (
          <div className="space-y-1">
            {report.topics.slice(0, 5).map((t, i) => (
              <div key={i} className="text-xs">
                <span className="text-amber-400/70 mr-1">{t.cluster}:</span>
                <span className="text-gray-300">{t.title}</span>
              </div>
            ))}
            {report.topics.length > 5 && (
              <p className="text-xs text-gray-600">+{report.topics.length - 5} more topics</p>
            )}
          </div>
        )}
        {(report.pending !== null || report.published !== null) && (
          <div className="flex gap-4 text-xs text-gray-500 pt-1">
            {report.pending !== null && <span>⏳ {report.pending} pending</span>}
            {report.published !== null && <span>✅ {report.published} published</span>}
          </div>
        )}
      </div>
    );
  }

  if (report.type === "improver") {
    const typeLabel: Record<string, string> = { cta: "CTA", internal_link: "Links", conversion_language: "Copy", social_proof: "Social proof" };
    const impactColor = (n: number) => n >= 8 ? "text-red-400" : n >= 6 ? "text-yellow-400" : "text-green-400";
    return (
      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Last analysis</p>
          <span className="text-xs text-gray-400">{report.analyzed} articles</span>
        </div>
        {report.added === 0 ? (
          <p className="text-xs text-gray-500">No new proposals — content looks good</p>
        ) : (
          <>
            <p className="text-xs text-amber-300 font-medium">{report.added} proposals need review</p>
            <div className="space-y-1.5">
              {report.proposals.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={`font-bold shrink-0 ${impactColor(p.impact)}`}>{p.impact}/10</span>
                  <div className="min-w-0">
                    <span className="text-gray-300 truncate block">{p.slug.replace(/-/g, " ")}</span>
                    <span className="text-gray-500">{typeLabel[p.type] ?? p.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}

// ── TokenBudgetPanel ──────────────────────────────────────────────────────────

const _MODEL_DAILY_CAPS: Record<string, number> = {
  "llama-3.3-70b-versatile":                   100_000,
  "meta-llama/llama-4-scout-17b-16e-instruct": 500_000,
  "openai/gpt-oss-120b":                       200_000,
  "openai/gpt-oss-20b":                        200_000,
  "qwen/qwen3-32b":                            500_000,
  "llama-3.1-8b-instant":                      500_000,
  "groq/compound":                             Infinity,
  "groq/compound-mini":                        Infinity,
};

function fmtK(n: number): string {
  if (n === 0) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function TokenBudgetPanel({ agents }: { agents: AgentData[] }) {
  const rows = agents
    .filter((a) => a.tokensLastRun > 0 || a.runsToday > 0)
    .map((a) => ({
      emoji: a.emoji,
      name: a.name,
      tokensLastRun: a.tokensLastRun,
      runsToday: a.runsToday,
      estimated: a.tokensLastRun * Math.max(a.runsToday, 1),
    }))
    .sort((a, b) => b.estimated - a.estimated);

  const totalEst = rows.reduce((s, r) => s + r.estimated, 0);
  // tightest single-model daily cap that matters (llama-3.3-70b = 100K)
  const tightestCap = 100_000;
  const tightPct = Math.min(100, Math.round((totalEst / tightestCap) * 100));

  if (rows.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Groq Token Budget</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Est. today: <span className="text-amber-300 font-semibold">{fmtK(totalEst)}</span></span>
          <span className="text-gray-700">·</span>
          <span>llama-3.3-70b cap: <span className={tightPct >= 90 ? "text-red-400 font-semibold" : tightPct >= 60 ? "text-yellow-400 font-semibold" : "text-gray-400"}>{tightPct}%</span> of 100K</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {rows.map((r) => {
          const pct = Math.min(100, Math.round((r.estimated / tightestCap) * 100));
          const barColor = pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-yellow-500" : "bg-amber-500";
          return (
            <div key={r.name} className="grid grid-cols-[140px_1fr_90px_80px] items-center gap-3">
              <span className="text-xs text-gray-300 truncate">{r.emoji} {r.name}</span>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${Math.max(pct, r.tokensLastRun > 0 ? 2 : 0)}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 text-right">
                {fmtK(r.tokensLastRun)}<span className="text-gray-600">/run</span>
              </span>
              <span className="text-xs text-gray-500 text-right">
                ×{r.runsToday} <span className="text-gray-600">≈</span> <span className="text-gray-300">{fmtK(r.estimated)}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Daily cap reference */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
        <span>Daily caps:</span>
        <span>llama-3.3-70b <span className="text-gray-500">100K</span></span>
        <span>gpt-oss-120b/20b <span className="text-gray-500">200K</span></span>
        <span>llama-4-scout / qwen / llama-8b <span className="text-gray-500">500K</span></span>
        <span>compound / compound-mini <span className="text-gray-500">∞</span></span>
      </div>
    </div>
  );
}

// ── AgentsTab ─────────────────────────────────────────────────────────────────

function AgentsTab({
  token,
  queue,
  articles,
  onAgentsLoaded,
}: {
  token: string;
  queue: QueueEntry[];
  articles: Article[];
  onAgentsLoaded?: (count: number) => void;
}) {
  const [agents, setAgents]         = useState<AgentData[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAgents = useCallback(async (isInitial = false) => {
    if (isInitial) setInitialLoad(true);
    else setRefreshing(true);
    try {
      const res = await authFetch("/api/admin/agents", {}, token);
      if (res.ok) {
        const data = await res.json() as { agents: AgentData[] };
        setAgents(data.agents);
        onAgentsLoaded?.(data.agents.length);
      }
    } finally {
      setInitialLoad(false);
      setRefreshing(false);
    }
  }, [token, onAgentsLoaded]);

  useEffect(() => { fetchAgents(true); }, [fetchAgents]);

  async function handleAction(workflowFile: string, action: "enable" | "disable" | "trigger") {
    setActionLoading(`${workflowFile}-${action}`);
    try {
      await authFetch("/api/admin/agents", {
        method: "POST",
        body: JSON.stringify({ workflow: workflowFile, action }),
      }, token);
      await fetchAgents(false);
    } finally {
      setActionLoading(null);
    }
  }

  const allDisabled    = agents.length > 0 && agents.every((a) => a.state === "disabled");
  const pendingCount   = queue.filter((e) => e.status === "pending").length;
  const generatingCount = queue.filter((e) => e.status === "generating").length;
  const publishedCount = articles.length;
  const activeCount    = agents.filter((a) => a.state === "active").length;
  const failedToday    = agents.filter((a) => a.lastRun?.conclusion === "failure").length;
  const pipelineReport = agents.find((a) => a.workflowFile === "pipeline-manager.yml")?.report as PipelineReport | null | undefined;
  const pipelineScore  = pipelineReport?.type === "pipeline" ? pipelineReport.score : null;

  if (initialLoad) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-white">GitHub Actions Agents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-5 bg-gray-800 rounded w-40" />
                <div className="h-5 bg-gray-800 rounded w-16" />
              </div>
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-800 rounded w-2/3" />
                <div className="h-3 bg-gray-800 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">GitHub Actions Agents</h2>
        <button
          onClick={() => fetchAgents(false)}
          disabled={refreshing}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-1.5 transition disabled:opacity-50"
        >
          {refreshing ? "↻ Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {/* Stats summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Published", value: publishedCount, color: "text-green-400" },
          { label: "Pending", value: pendingCount, color: "text-amber-300" },
          { label: "Generating", value: generatingCount, color: generatingCount > 0 ? "text-orange-400" : "text-gray-500" },
          { label: "Pipeline score", value: pipelineScore !== null ? `${pipelineScore}/100` : "—", color: pipelineScore !== null ? (pipelineScore >= 80 ? "text-green-400" : pipelineScore >= 60 ? "text-yellow-400" : "text-red-400") : "text-gray-500" },
          { label: "Agents active", value: `${activeCount}/${agents.length}`, color: activeCount === agents.length ? "text-green-400" : "text-yellow-400" },
          { label: "Failed last run", value: failedToday, color: failedToday > 0 ? "text-red-400" : "text-gray-500" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Token budget panel */}
      <TokenBudgetPanel agents={agents} />

      {/* Warning banners */}
      {allDisabled && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300 flex items-center gap-2">
          <span>⚠️</span>
          <span>All agents currently paused — generation is off</span>
        </div>
      )}
      {generatingCount > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-sm text-orange-300 flex items-center gap-2">
          <span>🔄</span>
          <span>{generatingCount} article{generatingCount > 1 ? "s" : ""} stuck in &quot;generating&quot; state — may need manual reset to pending</span>
        </div>
      )}

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {agents.map((agent) => {
          const isActive   = agent.state === "active";
          const isWriter   = agent.workflowFile === "auto-generate.yml";

          return (
            <div
              key={agent.workflowFile}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Status dot */}
                  <span
                    className={`shrink-0 w-2.5 h-2.5 rounded-full ${
                      isActive
                        ? "bg-green-400 animate-pulse"
                        : "bg-gray-600"
                    }`}
                  />
                  <span className="text-base font-semibold text-white truncate">
                    {agent.emoji} {agent.name}
                  </span>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-gray-700/50 text-gray-400 border border-gray-700"
                  }`}>
                    {isActive ? "Active" : "Paused"}
                  </span>
                </div>
                {/* Run button */}
                <button
                  onClick={() => handleAction(agent.workflowFile, "trigger")}
                  disabled={actionLoading !== null || agent.workflowId === null}
                  title="Trigger run now"
                  className="shrink-0 text-xs bg-amber-600/20 hover:bg-amber-600 border border-amber-600/40 hover:border-amber-500 text-amber-300 hover:text-white rounded-lg px-2.5 py-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {actionLoading === `${agent.workflowFile}-trigger` ? "…" : "Run ▶"}
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-snug">{agent.description}</p>

              {/* Stats */}
              <div className="space-y-1.5 text-sm">
                <div className="flex gap-1 text-gray-500">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="text-gray-300">{agent.schedule}</span>
                </div>

                {agent.lastRun ? (
                  <div className="text-gray-500">
                    <span className="text-gray-600">Last run:</span>{" "}
                    <span className="text-gray-300">{relativeTime(agent.lastRun.startedAt)}</span>
                    {agent.lastRun.durationSeconds !== null && (
                      <span className="text-gray-500"> · {formatDuration(agent.lastRun.durationSeconds)}</span>
                    )}
                    {" "}
                    <span>
                      {conclusionIcon(agent.lastRun)}{" "}
                      <span className={
                        agent.lastRun.conclusion === "success" ? "text-green-400" :
                        agent.lastRun.conclusion === "failure" ? "text-red-400" :
                        "text-gray-400"
                      }>
                        {agent.lastRun.status === "in_progress"
                          ? "running"
                          : agent.lastRun.status === "queued"
                          ? "queued"
                          : (agent.lastRun.conclusion ?? "—")}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm">Last run: never</div>
                )}

                <div className="text-gray-500">
                  <span className="text-gray-600">Runs today:</span>{" "}
                  <span className="text-gray-300">{agent.runsToday}</span>
                  <span className="text-gray-600"> · Last 30:</span>{" "}
                  <span className="text-gray-300">{agent.totalRuns}</span>
                </div>

                {/* Writer-specific queue stats */}
                {isWriter && (
                  <div className="mt-1 pt-1.5 border-t border-gray-800 text-gray-500">
                    <span className="text-gray-600">Queue:</span>{" "}
                    <span className="text-amber-300 font-medium">{pendingCount} pending</span>
                    {generatingCount > 0 && (
                      <span className="text-orange-400 font-medium"> · {generatingCount} generating</span>
                    )}
                  </div>
                )}
              </div>

              {/* Recent runs */}
              {agent.recentRuns.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-600 uppercase tracking-wide border-t border-gray-800 pt-3">
                    Recent runs
                  </div>
                  {agent.recentRuns.map((run) => (
                    <a
                      key={run.id}
                      href={run.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition group"
                    >
                      <span className="shrink-0">{conclusionIcon(run)}</span>
                      <span className="text-gray-400 group-hover:text-gray-300">
                        {formatRunDate(run.startedAt)}
                      </span>
                      {run.durationSeconds !== null && (
                        <span className="text-gray-600">· {formatDuration(run.durationSeconds)}</span>
                      )}
                      {run.conclusion === "failure" && (
                        <span className="text-red-400 font-medium">failed</span>
                      )}
                      <span className="ml-auto text-gray-700 group-hover:text-gray-500">↗</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Last run report */}
              <AgentReportSection report={agent.report} lastRunConclusion={agent.lastRun?.conclusion} />

              {/* Toggle button */}
              <div className="flex justify-end border-t border-gray-800 pt-3 mt-auto">
                <button
                  onClick={() => handleAction(
                    agent.workflowFile,
                    isActive ? "disable" : "enable"
                  )}
                  disabled={actionLoading !== null || agent.workflowId === null}
                  className="text-xs border border-amber-600/40 hover:border-amber-500 text-amber-400 hover:text-amber-300 hover:bg-amber-600/10 rounded-lg px-3 py-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {actionLoading === `${agent.workflowFile}-${isActive ? "disable" : "enable"}`
                    ? "…"
                    : isActive ? "⏸ Pause agent" : "▶ Resume agent"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
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
  const [agentCount, setAgentCount]         = useState(0);
  const [queue, setQueue]                   = useState<QueueEntry[]>([]);
  const [articles, setArticles]             = useState<Article[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [collapsedClusters, setCollapsedClusters] = useState<Set<string>>(new Set());
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

  // (addingRec removed — per-item research actions no longer needed)

  // Published sort
  const [pubSort, setPubSort]               = useState<"date" | "words" | "quality">("date");

  // Auto-refresh
  const [autoRefresh, setAutoRefresh]       = useState(false);

  // Proposals + quality
  const [proposals, setProposals]           = useState<Proposal[]>([]);
  const [qualityScores, setQualityScores]   = useState<Record<string, QualityScore>>({});
  const [qualityStats, setQualityStats]     = useState<{
    totalScored: number;
    avgScore: number | null;
    dist: { excellent: number; good: number; fair: number; poor: number };
    fixerQueue: number;
    recentlyImproved: { slug: string; score: number; improvedFrom: number | null; improvedAt: string }[];
    lowestScoring: { slug: string; score: number; checkedAt: string; improvedAt: string | null }[];
  } | null>(null);
  const [proposalStatusFilter, setProposalStatusFilter] = useState<string>("pending");
  const [proposalTypeFilter, setProposalTypeFilter]     = useState<string>("all");

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

  const fetchProposals = useCallback(async () => {
    const res = await authFetch("/api/admin/proposals", {}, token);
    if (res.ok) {
      const d = await res.json() as { proposals: Proposal[] };
      setProposals(d.proposals ?? []);
    }
  }, [token]);

  const fetchQualityScores = useCallback(async () => {
    const res = await authFetch("/api/admin/quality", {}, token);
    if (res.ok) {
      const d = await res.json() as {
        scores: Record<string, QualityScore>;
        stats?: typeof qualityStats;
      };
      setQualityScores(d.scores ?? {});
      if (d.stats) setQualityStats(d.stats);
    }
  }, [token]);

  useEffect(() => {
    fetchQueue();
    fetchArticles();
    fetchRecommendations();
    fetchProposals();
    fetchQualityScores();
  }, [fetchQueue, fetchArticles, fetchRecommendations, fetchProposals, fetchQualityScores]);

  // Auto-refresh: every 30s, 15s if Writer is active
  useEffect(() => {
    if (!autoRefresh) return;
    const hasActive = queue.some((e) => e.status === "generating");
    const ms = hasActive ? 15_000 : 30_000;
    const id = setInterval(() => {
      fetchQueue();
      fetchArticles();
      fetchProposals();
    }, ms);
    return () => clearInterval(id);
  }, [autoRefresh, queue, fetchQueue, fetchArticles, fetchProposals]);

  // Keyboard shortcuts
  useEffect(() => {
    const tabIds: TabId[] = ["pipeline", "agents", "queue", "published", "research", "proposals", "reports"];
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "r" || e.key === "R") { fetchQueue(); fetchArticles(); fetchProposals(); }
      if ((e.key === "g" || e.key === "G") && !generating && !batchRunning) handleGenerate();
      if ((e.key === "a" || e.key === "A") && !generating && !batchRunning) setAutoRefresh((v) => !v);
      const n = parseInt(e.key);
      if (n >= 1 && n <= 7) setActiveTab(tabIds[n - 1]);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generating, batchRunning]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function deriveSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
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

  // ── Proposal actions ──────────────────────────────────────────────────────

  async function handleBulkApproveHighImpact() {
    const highImpact = proposals.filter((p) => p.status === "pending" && p.impactScore >= 8);
    setProposals((prev) =>
      prev.map((p) =>
        p.status === "pending" && p.impactScore >= 8
          ? { ...p, status: "approved" as const, reviewedAt: new Date().toISOString() }
          : p
      )
    );
    await Promise.all(
      highImpact.map((p) =>
        authFetch("/api/admin/proposals", { method: "PATCH", body: JSON.stringify({ id: p.id, action: "approve" }) }, token)
      )
    );
  }

  async function handleProposalAction(id: string, action: "approve" | "reject" | "dismiss") {
    // Optimistic update
    const newStatus = action === "approve" ? "approved" : "rejected";
    setProposals((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: newStatus, reviewedAt: new Date().toISOString() } : p)
    );
    await authFetch("/api/admin/proposals", {
      method: "PATCH",
      body: JSON.stringify({ id, action }),
    }, token);
  }

  // ── Recommendations ───────────────────────────────────────────────────────

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
  const _publishedQueue = queue.filter((e) => e.status === "published");

  const today = todayStr();
  const publishedToday = articles.filter((a) => a.date === today).length;

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);
  const last7Published = articles.filter((a) => a.date >= sevenDaysAgo).length;
  const avgPerDay = (last7Published / 7).toFixed(1);

  const estMinutes = pendingCount * 5;
  const estTime = estMinutes < 60
    ? `${estMinutes}m`
    : `${Math.floor(estMinutes / 60)}h ${estMinutes % 60}m`;

  const clustersInPublished = new Set(articles.map((a) => a.category).filter(Boolean)).size;

  const queueClusters = Array.from(new Set(queue.map((e) => e.cluster))).sort();

  const filteredQueue = queue.filter((entry) => {
    const matchSearch = !queueSearch ||
      entry.title.toLowerCase().includes(queueSearch.toLowerCase()) ||
      entry.primaryKeyword.toLowerCase().includes(queueSearch.toLowerCase());
    const matchStatus = queueStatusFilter === "all" || entry.status === queueStatusFilter;
    const matchCluster = queueClusterFilter === "all" || entry.cluster === queueClusterFilter;
    return matchSearch && matchStatus && matchCluster;
  });

  // Activity feed: last 20 published sorted by date desc (source of truth: MDX)
  const activityFeed = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20);

  // Research: group pending queue articles by cluster
  const recsByCluster: Record<string, Recommendation[]> = {};
  for (const rec of recommendations) {
    if (!recsByCluster[rec.cluster]) recsByCluster[rec.cluster] = [];
    recsByCluster[rec.cluster].push(rec);
  }
  const totalVisible = recommendations.length;

  // Published articles sorted
  const sortedArticles = [...articles].sort((a, b) => {
    if (pubSort === "date") return b.date.localeCompare(a.date);
    if (pubSort === "quality") {
      const qa = qualityScores[a.slug]?.score ?? 99;
      const qb = qualityScores[b.slug]?.score ?? 99;
      return qa - qb; // ascending — worst first
    }
    return b.wordCount - a.wordCount;
  });

  // Reports: articles per day (last 14 days) — source of truth: MDX article dates
  const last14Days: { date: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = articles.filter((a) => a.date === dateStr).length;
    last14Days.push({ date: dateStr, label, count });
  }
  const maxDayCount = Math.max(...last14Days.map((d) => d.count), 1);

  // Cluster/category distribution — source of truth: MDX frontmatter category field
  const clusterDistrib: Record<string, number> = {};
  for (const a of articles) {
    const cat = a.category || "Uncategorized";
    clusterDistrib[cat] = (clusterDistrib[cat] ?? 0) + 1;
  }
  const clusterDistribEntries = Object.entries(clusterDistrib).sort((a, b) => b[1] - a[1]);

  const pendingProposalsCount = proposals.filter((p) => p.status === "pending").length;

  const allQualityValues = Object.values(qualityScores).map((s) => s.score);
  const avgQualityScore = allQualityValues.length > 0
    ? (allQualityValues.reduce((a, b) => a + b, 0) / allQualityValues.length).toFixed(1)
    : null;

  const filteredProposals = proposals.filter((p) => {
    const matchStatus = proposalStatusFilter === "all" || p.status === proposalStatusFilter;
    const matchType   = proposalTypeFilter === "all" || p.type === proposalTypeFilter;
    return matchStatus && matchType;
  });

  // Next article to generate
  const nextArticle = queue.find((e) => e.status === "pending") ?? null;

  // Cluster coverage: published vs pending per cluster
  const clusterCoverage: Record<string, { published: number; pending: number }> = {};
  for (const e of queue) {
    if (!clusterCoverage[e.cluster]) clusterCoverage[e.cluster] = { published: 0, pending: 0 };
    if (e.status === "published") clusterCoverage[e.cluster].published++;
    else if (e.status === "pending" || e.status === "generating") clusterCoverage[e.cluster].pending++;
  }
  const clusterCoverageEntries = Object.entries(clusterCoverage)
    .map(([name, v]) => ({ name, ...v, total: v.published + v.pending }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 12);

  const highImpactPendingCount = proposals.filter((p) => p.status === "pending" && p.impactScore >= 8).length;

  const tabs: { id: TabId; label: string }[] = [
    { id: "pipeline",  label: "Pipeline" },
    { id: "agents",    label: agentCount > 0 ? `Agents (${agentCount})` : "Agents" },
    { id: "queue",     label: `Queue (${queue.length})` },
    { id: "published", label: `Published (${articles.length})` },
    { id: "research",  label: `Research (${totalVisible})` },
    { id: "proposals", label: `Proposals (${pendingProposalsCount})` },
    { id: "reports",   label: "Reports" },
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
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-300 font-medium">{articles.length}</span>
              <span className="text-gray-500">published</span>
            </span>
            <span className="text-gray-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-yellow-300 font-medium">{pendingCount}</span>
              <span className="text-gray-500">pending</span>
            </span>
            <span className="text-gray-700">|</span>
            <span className="text-amber-300 font-medium">{avgPerDay}/day</span>
            {publishedToday > 0 && (
              <span className="text-green-400 font-medium text-xs bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">
                +{publishedToday} today
              </span>
            )}
          </div>
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            title="Toggle auto-refresh (A)"
            className={`text-xs px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              autoRefresh
                ? "bg-amber-600/20 border-amber-500/50 text-amber-300"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            <span className={autoRefresh ? "animate-spin inline-block" : ""} style={{ animationDuration: "3s" }}>⟳</span>
            {autoRefresh ? "Live" : "Auto"}
          </button>
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
        {/* Tab: Agents                                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "agents" && (
          <AgentsTab token={token} queue={queue} articles={articles} onAgentsLoaded={setAgentCount} />
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Tab: Proposals                                                     */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "proposals" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">Improvement Proposals</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Improver runs Mon + Thu · {proposals.length} total ·{" "}
                  <span className={pendingProposalsCount > 0 ? "text-amber-300 font-medium" : "text-gray-500"}>
                    {pendingProposalsCount} pending review
                  </span>
                  {proposals.length > 0 && (
                    <span className="ml-2 text-gray-600">
                      · last: {new Date(Math.max(...proposals.map(p => new Date(p.createdAt).getTime()))).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={fetchProposals}
                className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-1.5 transition"
              >
                ↻ Refresh
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Proposals" value={proposals.length} />
              <StatCard label="Pending Review" value={pendingProposalsCount} />
              <StatCard
                label="Approved This Week"
                value={proposals.filter((p) => {
                  if (p.status !== "approved" || !p.reviewedAt) return false;
                  const d = new Date(p.reviewedAt);
                  return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
                }).length}
              />
              <StatCard
                label="Avg Impact Score"
                value={proposals.length > 0
                  ? (proposals.reduce((s, p) => s + p.impactScore, 0) / proposals.length).toFixed(1)
                  : "—"}
                sub="out of 10"
              />
            </div>

            {/* Bulk actions */}
            {highImpactPendingCount > 0 && (
              <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                <span className="text-sm text-red-300 flex-1">
                  🎯 <span className="font-semibold">{highImpactPendingCount} HIGH IMPACT</span> proposals pending (≥ 8/10)
                </span>
                <button
                  onClick={handleBulkApproveHighImpact}
                  className="text-xs bg-green-700/30 hover:bg-green-700 border border-green-700/50 hover:border-green-600 text-green-300 hover:text-white rounded-lg px-4 py-2 transition font-medium"
                >
                  ✅ Approve all high-impact
                </button>
              </div>
            )}

            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-1">
                {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setProposalStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
                      proposalStatusFilter === s
                        ? "bg-amber-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {([
                  { value: "all", label: "All Types" },
                  { value: "cta", label: "CTA" },
                  { value: "internal_link", label: "Internal Links" },
                  { value: "conversion_language", label: "Conversion" },
                  { value: "social_proof", label: "Social Proof" },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setProposalTypeFilter(value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      proposalTypeFilter === value
                        ? "bg-amber-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Proposal cards */}
            {filteredProposals.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">
                <p className="text-3xl mb-3">🎯</p>
                {proposals.length === 0
                  ? "No proposals yet — Improver runs Mon & Thu. Trigger it manually from the Agents tab."
                  : proposalStatusFilter === "pending"
                  ? <span>No pending proposals — all reviewed ✅ <button onClick={() => setProposalStatusFilter("all")} className="text-amber-400 underline ml-1">View all {proposals.length}</button></span>
                  : "No proposals match your filters"}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProposals.map((p) => {
                  const impactColor = p.impactScore >= 8
                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                    : p.impactScore >= 6
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-gray-700/50 text-gray-400 border-gray-700";

                  const typeColor: Record<string, string> = {
                    cta: "bg-purple-500/20 text-purple-300 border-purple-500/40",
                    internal_link: "bg-blue-500/20 text-blue-300 border-blue-500/40",
                    conversion_language: "bg-green-500/20 text-green-300 border-green-500/40",
                    social_proof: "bg-orange-500/20 text-orange-300 border-orange-500/40",
                  };

                  const statusColor: Record<string, string> = {
                    pending:  "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                    approved: "bg-green-500/20 text-green-300 border-green-500/30",
                    rejected: "bg-gray-700/50 text-gray-400 border-gray-700",
                    applied:  "bg-blue-500/20 text-blue-300 border-blue-500/30",
                  };

                  const typeLabel: Record<string, string> = {
                    cta: "CTA",
                    internal_link: "Internal Link",
                    conversion_language: "Conversion",
                    social_proof: "Social Proof",
                  };

                  return (
                    <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${impactColor}`}>
                            🎯 {p.impactScore >= 8 ? "HIGH" : p.impactScore >= 6 ? "MED" : "LOW"} IMPACT ({p.impactScore}/10)
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeColor[p.type] ?? "bg-gray-700/50 text-gray-400 border-gray-700"}`}>
                            {typeLabel[p.type] ?? p.type}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[p.status] ?? statusColor.pending}`}>
                            {p.status}
                          </span>
                          {p.cluster && (
                            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700">
                              📂 {p.cluster.split(" — ")[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <p className="font-semibold text-white">{p.title}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{p.slug}</p>
                      </div>

                      {/* Issue */}
                      <p className="text-sm text-gray-400">
                        <span className="text-gray-500 font-medium">Issue: </span>
                        {p.issue}
                      </p>

                      {/* Proposal */}
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1.5">Proposed change:</p>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono whitespace-pre-wrap">
                          {p.proposal}
                        </div>
                      </div>

                      {/* Score breakdown */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>CTA: <span className="text-gray-300">{p.ctaScore}/5</span></span>
                        <span>Links: <span className="text-gray-300">{p.linkScore}/3</span></span>
                        <span>Conversion: <span className="text-gray-300">{p.conversionScore}/5</span></span>
                        <span>Overall: <span className="text-gray-300">{p.overallScore}/10</span></span>
                        <span className="ml-auto text-gray-600">
                          {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Actions */}
                      {p.status === "pending" && (
                        <div className="flex gap-2 pt-2 border-t border-gray-800">
                          <button
                            onClick={() => handleProposalAction(p.id, "approve")}
                            className="text-xs bg-green-700/30 hover:bg-green-700 border border-green-700/50 hover:border-green-600 text-green-300 hover:text-white rounded-lg px-4 py-2 transition"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleProposalAction(p.id, "reject")}
                            className="text-xs bg-red-700/20 hover:bg-red-700 border border-red-700/40 hover:border-red-600 text-red-400 hover:text-white rounded-lg px-4 py-2 transition"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                      {p.status !== "pending" && p.reviewedAt && (
                        <p className="text-xs text-gray-600 pt-1 border-t border-gray-800">
                          Reviewed {new Date(p.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Tab: Pipeline                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "pipeline" && (
          <div className="space-y-8">
            {/* Keyboard shortcuts hint */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              <span><kbd className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 font-mono text-gray-500">G</kbd> Generate next</span>
              <span><kbd className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 font-mono text-gray-500">R</kbd> Refresh data</span>
              <span><kbd className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 font-mono text-gray-500">A</kbd> Toggle auto-refresh</span>
              <span><kbd className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 font-mono text-gray-500">1–7</kbd> Switch tabs</span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard label="Total Published" value={articles.length} />
              <StatCard label="Published Today" value={publishedToday} sub={today} />
              <StatCard label="Pending in Queue" value={pendingCount} />
              <StatCard label="Est. Time to Clear" value={pendingCount === 0 ? "—" : estTime} sub={`${pendingCount} × 5 min`} />
              <StatCard label="Avg Articles / Day" value={avgPerDay} sub="last 7 days" />
              <StatCard label="Clusters Covered" value={clustersInPublished} sub="in published" />
              <StatCard label="Avg Quality Score" value={avgQualityScore ? `${avgQualityScore} / 10` : "—"} sub={`${allQualityValues.length} audited`} />
              <StatCard label="Pending Proposals" value={pendingProposalsCount} sub="from Improver" />
              <StatCard label="Fixer Queue" value={qualityStats?.fixerQueue ?? "—"} sub="score < 7, need rewrite" />
              <StatCard label="Excellent (9-10)" value={qualityStats?.dist.excellent ?? "—"} sub="top quality" />
              <StatCard label="Poor (< 5)" value={qualityStats?.dist.poor ?? "—"} sub="urgent fixes" />
              <StatCard label="Recently Improved" value={qualityStats?.recentlyImproved.length ?? "—"} sub="last 7 days" />
            </div>

            {/* Quality score distribution */}
            {qualityStats && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-white">Quality Score Distribution</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{qualityStats.totalScored} articles scored · avg {qualityStats.avgScore}/10</p>
                  </div>
                  <button
                    onClick={fetchQualityScores}
                    className="text-xs text-gray-500 hover:text-white transition px-2 py-1 rounded hover:bg-gray-800"
                  >⟳ Refresh</button>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Excellent", sub: "9–10", value: qualityStats.dist.excellent, color: "text-green-400 bg-green-500/10 border-green-500/30" },
                    { label: "Good", sub: "7–8", value: qualityStats.dist.good, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
                    { label: "Fair", sub: "5–6", value: qualityStats.dist.fair, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
                    { label: "Poor", sub: "< 5", value: qualityStats.dist.poor, color: "text-red-400 bg-red-500/10 border-red-500/30" },
                  ].map((b) => (
                    <div key={b.label} className={`rounded-xl border px-3 py-2.5 text-center ${b.color}`}>
                      <p className={`text-2xl font-black`}>{b.value}</p>
                      <p className="text-xs font-semibold mt-0.5">{b.label}</p>
                      <p className="text-[10px] opacity-70">{b.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Fixer queue + lowest scoring */}
                {qualityStats.lowestScoring.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Fixer queue — {qualityStats.fixerQueue} articles need improvement
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {qualityStats.lowestScoring.map((a) => (
                        <div key={a.slug} className="flex items-center gap-3 text-xs">
                          <QualityBadge score={a.score} />
                          <span className="text-gray-400 truncate flex-1">{a.slug.replace(/-/g, " ")}</span>
                          {a.improvedAt && (
                            <span className="text-gray-600 shrink-0">improved {relativeTime(a.improvedAt)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Recently improved */}
                {qualityStats.recentlyImproved.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recently improved (last 7 days)</p>
                    <div className="space-y-1.5">
                      {qualityStats.recentlyImproved.slice(0, 5).map((a) => (
                        <div key={a.slug} className="flex items-center gap-3 text-xs">
                          <QualityBadge score={a.score} />
                          {a.improvedFrom !== null && (
                            <span className="text-gray-600 shrink-0">{a.improvedFrom}→{a.score}</span>
                          )}
                          <span className="text-gray-400 truncate flex-1">{a.slug.replace(/-/g, " ")}</span>
                          <span className="text-gray-600 shrink-0">{relativeTime(a.improvedAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Article Preview */}
            {nextArticle && (
              <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-2">⏭ Next in Queue</p>
                  <p className="text-white font-semibold leading-snug">{nextArticle.title}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span>🔑 {nextArticle.primaryKeyword}</span>
                    <span>📂 {nextArticle.cluster.split(" — ")[0]}</span>
                    <span>📝 {nextArticle.targetWords} words</span>
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating || batchRunning}
                  className="shrink-0 bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white font-semibold rounded-xl px-4 py-2 text-sm transition flex items-center gap-2"
                >
                  {generating
                    ? <><span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                    : "⚡ Generate"}
                </button>
              </div>
            )}

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

            {/* Cluster Coverage Map */}
            {clusterCoverageEntries.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-white">Cluster Coverage</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Published vs pending per topic cluster</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" /> Published</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-700 inline-block" /> Pending</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {clusterCoverageEntries.map((c) => {
                    const pubPct = Math.round((c.published / c.total) * 100);
                    return (
                      <div key={c.name}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-300 truncate flex-1 mr-4 max-w-xs" title={c.name}>
                            {c.name.split(" — ")[0]}
                          </span>
                          <span className="text-gray-500 shrink-0">
                            <span className="text-amber-300 font-medium">{c.published}</span>
                            <span className="text-gray-600">/{c.total}</span>
                            <span className="ml-1.5 text-gray-600">{pubPct}%</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full transition-all"
                            style={{ width: `${pubPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Activity timeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="font-semibold text-white">Recent Activity</h2>
                <p className="text-xs text-gray-500 mt-0.5">Last 20 published articles</p>
              </div>
              {activityFeed.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-500 text-sm">No activity yet</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {activityFeed.map((entry) => (
                    <div key={entry.slug} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-800/50 transition">
                      <span className="text-xs text-gray-500 font-mono shrink-0 w-16">
                        {new Date(entry.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="flex-1 text-sm text-white truncate">{entry.title}</span>
                      {entry.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 hidden sm:inline">
                          {entry.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-600 shrink-0 hidden md:inline">
                        {entry.wordCount.toLocaleString()}w
                      </span>
                      <a
                        href={entry.url}
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
                {(["all", "pending", "generating", "generated", "published"] as const).map((s) => (
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
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[entry.status]}`}>
                              {entry.status}
                            </span>
                            {entry.status === "published" && qualityScores[entry.slug] && (() => {
                              const qs = qualityScores[entry.slug];
                              const color = qs.score >= 8
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : qs.score >= 6
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30";
                              return (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full border ${color}`}>
                                  {qs.score}/10
                                </span>
                              );
                            })()}
                          </div>
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
                <h2 className="font-semibold text-white">Research Queue</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {totalVisible} articles pending generation · {Object.keys(recsByCluster).length} clusters
                </p>
              </div>
              <button
                onClick={fetchRecommendations}
                className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-1.5 transition"
              >
                ↻ Refresh
              </button>
            </div>

            {Object.keys(recsByCluster).length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">Queue is empty — all articles published or generating</div>
            ) : (
              Object.entries(recsByCluster)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([cluster, recs]) => {
                  const isCollapsed = collapsedClusters.has(cluster);
                  const generatingCount = recs.filter(r => r.status === "generating").length;
                  return (
                    <div key={cluster} className="border border-gray-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => {
                          setCollapsedClusters((prev) => {
                            const next = new Set(prev);
                            if (next.has(cluster)) next.delete(cluster);
                            else next.add(cluster);
                            return next;
                          });
                        }}
                        className="w-full flex items-center justify-between px-5 py-4 bg-gray-900 border-b border-gray-800 hover:bg-gray-800/60 transition text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">{cluster}</span>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{recs.length} articles</span>
                          {generatingCount > 0 && (
                            <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full">
                              {generatingCount} generating
                            </span>
                          )}
                        </div>
                        <span className="text-gray-600 text-xs">{isCollapsed ? "▼" : "▲"}</span>
                      </button>
                      {!isCollapsed && (
                        <div className="bg-gray-900/50 divide-y divide-gray-800">
                          {recs.map((rec) => (
                            <div key={rec.slug} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-800/30 transition">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{rec.title}</p>
                                <p className="text-xs text-gray-600 font-mono mt-0.5">{rec.slug}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                                rec.status === "generating"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              }`}>
                                {rec.status}
                              </span>
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
                <button
                  onClick={() => setPubSort("quality")}
                  className={`text-xs px-3 py-1.5 rounded-lg transition ${pubSort === "quality" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                  By Quality ↑
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
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Quality</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Tags</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">View</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {sortedArticles.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No articles found</td></tr>
                  ) : (
                    sortedArticles.map((a) => {
                      const qs = qualityScores[a.slug];
                      const qBadgeColor = qs
                        ? qs.score >= 8
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : qs.score >= 6
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                        : "bg-gray-800 text-gray-600 border-gray-700";
                      return (
                        <tr key={a.slug} className="hover:bg-gray-800/50 transition">
                          <td className="px-4 py-3">
                            <p className="font-medium text-white truncate max-w-xs">{a.title}</p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">{a.slug}</p>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-400">{a.date}</td>
                          <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-400">{a.wordCount.toLocaleString()}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${qBadgeColor}`}>
                              {qs ? `${qs.score}/10` : "—"}
                            </span>
                          </td>
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
                      );
                    })
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
                    const pct = articles.length > 0 ? Math.round((count / articles.length) * 100) : 0;
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
                  <p className="text-3xl font-bold text-green-400">{articles.length}</p>
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
