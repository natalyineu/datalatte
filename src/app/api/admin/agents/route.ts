import { NextRequest, NextResponse } from "next/server";

const GH_OWNER = "natalyineu";
const GH_REPO  = "datalatte";
const GH_BASE  = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/actions`;

// ── Agent metadata ─────────────────────────────────────────────────────────────

interface AgentMeta {
  name: string;
  emoji: string;
  description: string;
  schedule: string;
  workflowFile: string;
}

const AGENT_META: AgentMeta[] = [
  {
    name: "Researcher",
    emoji: "🔍",
    description: "Discovers new topics from trends & SEO data, proposes articles via Groq",
    schedule: "Daily 9am UTC",
    workflowFile: "research.yml",
  },
  {
    name: "Auditor",
    emoji: "🔎",
    description: "Scans published MDX for quality issues, triggers Fixer when problems found",
    schedule: "Every 2 hours",
    workflowFile: "audit.yml",
  },
  {
    name: "Fixer",
    emoji: "🔧",
    description: "Fixes MDX syntax errors and marks bad articles for regeneration",
    schedule: "On demand",
    workflowFile: "fixer.yml",
  },
  {
    name: "Writer",
    emoji: "✍️",
    description: "Picks pending articles from queue.json, generates via Groq, pushes to GitHub",
    schedule: "Every 5 minutes",
    workflowFile: "auto-generate.yml",
  },
  {
    name: "Pipeline Manager",
    emoji: "🎛️",
    description: "Monitors pipeline health, calculates 0-100 score, auto-restarts stuck agents",
    schedule: "Every hour",
    workflowFile: "pipeline-manager.yml",
  },
  {
    name: "Agent 6 — Improver",
    emoji: "🎯",
    description: "Analyzes published articles for conversion effectiveness, proposes CTAs and internal links",
    schedule: "Weekly Monday 10am",
    workflowFile: "improver.yml",
  },
];

// ── GitHub API types ───────────────────────────────────────────────────────────

interface GHWorkflow {
  id: number;
  name: string;
  path: string;
  state: string; // "active" | "disabled_manually" | "disabled_inactivity" | etc.
}

interface GHWorkflowsResponse {
  workflows: GHWorkflow[];
}

interface GHRun {
  id: number;
  status: string;       // queued | in_progress | completed
  conclusion: string | null; // success | failure | cancelled | skipped | null
  created_at: string;
  updated_at: string;
  run_started_at: string | null;
  html_url: string;
}

interface GHRunsResponse {
  workflow_runs: GHRun[];
}

interface GHJob {
  id: number;
  name: string;
}

interface GHJobsResponse {
  jobs: GHJob[];
}

// ── Agent Report types ─────────────────────────────────────────────────────────

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
  components: {
    generation: number | null;
    reliability: number | null;
    quality: number | null;
    bugs: number | null;
    queue: number | null;
  };
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

// ── Response types ─────────────────────────────────────────────────────────────

interface RunSummary {
  id: number;
  status: string;
  conclusion: string | null;
  startedAt: string | null;
  durationSeconds: number | null;
  url: string;
}

interface AgentData extends AgentMeta {
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
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "DataLatte-Admin",
  } as const;
}

function computeDuration(run: GHRun): number | null {
  if (run.status !== "completed") return null;
  const start = run.run_started_at ?? run.created_at;
  const startMs = new Date(start).getTime();
  const endMs   = new Date(run.updated_at).getTime();
  if (isNaN(startMs) || isNaN(endMs)) return null;
  return Math.round((endMs - startMs) / 1000);
}

function isToday(isoStr: string): boolean {
  const runDate  = new Date(isoStr).toISOString().slice(0, 10);
  const todayStr = new Date().toISOString().slice(0, 10);
  return runDate === todayStr;
}

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  return token === adminPassword && adminPassword.length > 0;
}

// ── Log parsing ────────────────────────────────────────────────────────────────

function parseWriterReport(log: string): WriterReport {
  const title     = log.match(/^ARTICLE_TITLE: (.+)$/m)?.[1] ?? null;
  const keyword   = log.match(/^ARTICLE_KEYWORD: (.+)$/m)?.[1] ?? null;
  const cluster   = log.match(/^ARTICLE_CLUSTER: (.+)$/m)?.[1] ?? null;
  const remaining = log.match(/^QUEUE_REMAINING: (\d+)$/m)?.[1] ?? null;
  const model     = log.match(/✅ Model used: (.+)$/m)?.[1] ?? null;
  const slug      = log.match(/✅ Pushed: (.+)$/m)?.[1] ?? null;
  const noPending = log.includes("No pending articles");
  return {
    type: "writer",
    title,
    keyword,
    cluster,
    remaining: remaining ? Number(remaining) : null,
    model,
    slug,
    noPending,
  };
}

function parseAuditorReport(log: string): AuditorReport {
  const syntaxIssues  = Number(log.match(/Found (\d+) files with syntax issues/)?.[1] ?? 0);
  const sampled       = Number(log.match(/Sampling (\d+) random articles/)?.[1] ?? 0);
  const totalIssues   = Number(log.match(/Total issues: (\d+)/)?.[1] ?? 0);
  const allClean      = log.includes("✅ All clean");
  const triggeredFixer = log.includes("trigger") && log.includes("Fixer");
  const scoreMatches  = [...log.matchAll(/(?:✅|⚠️) (?:Low quality: )?(\S+\.mdx) \((\d+)\/10\)/g)];
  const scores        = scoreMatches.map((m) => ({ file: m[1].replace(".mdx", ""), score: Number(m[2]) }));
  const avgScore      = scores.length
    ? (scores.reduce((s, r) => s + r.score, 0) / scores.length).toFixed(1)
    : null;
  return { type: "auditor", syntaxIssues, sampled, totalIssues, allClean, triggeredFixer, scores, avgScore };
}

function parseFixerReport(log: string): FixerReport {
  const nothingToFix = log.includes("Nothing to fix") || log.includes("nothing needed");
  const toFixMatch   = log.match(/Loaded audit report: (\d+) to fix, (\d+) to regenerate/);
  const toFix        = toFixMatch ? Number(toFixMatch[1]) : 0;
  const toRegen      = toFixMatch ? Number(toFixMatch[2]) : 0;
  const fixedFiles   = [...log.matchAll(/✅ Fixed & kept: (\S+) \(quality: (\d+)\/10\)/g)].map((m) => ({
    file: m[1].replace(".mdx", ""),
    score: Number(m[2]),
  }));
  const regenFiles   = [...log.matchAll(/♻️ (?:Marked for regeneration|Too thin after fix)[^\n]*: (\S+)/g)].map(
    (m) => m[1].replace(".mdx", "")
  );
  return { type: "fixer", nothingToFix, toFix, toRegen, fixedFiles, regenFiles };
}

function parsePipelineReport(log: string): PipelineReport {
  const scoreMatch = log.match(/✅ Score: (\d+)\/100[^|]*\| Status: ([^|]+) \| Today: (\d+)/);
  const score      = scoreMatch ? Number(scoreMatch[1]) : null;
  const status     = scoreMatch ? scoreMatch[2].trim() : null;
  const today      = scoreMatch ? Number(scoreMatch[3]) : null;
  const restarted  = log.includes("auto-restarting");

  const compMatch  = log.match(/PIPELINE_COMPONENTS: generation=(\d+),reliability=(\d+),quality=(\d+),bugs=(\d+),queue=(\d+)/);
  const components = compMatch
    ? { generation: Number(compMatch[1]), reliability: Number(compMatch[2]), quality: Number(compMatch[3]), bugs: Number(compMatch[4]), queue: Number(compMatch[5]) }
    : { generation: null, reliability: null, quality: null, bugs: null, queue: null };

  const qualityStr = log.match(/PIPELINE_QUALITY: ([\d.]+)/)?.[1];
  const qualityAvg = qualityStr && qualityStr !== "n/a" ? Number(qualityStr) : null;
  const published  = log.match(/PIPELINE_PUBLISHED: (\d+)/)?.[1] ? Number(log.match(/PIPELINE_PUBLISHED: (\d+)/)?.[1]) : null;
  const pending    = log.match(/PIPELINE_PENDING: (\d+)/)?.[1] ? Number(log.match(/PIPELINE_PENDING: (\d+)/)?.[1]) : null;

  return { type: "pipeline", score, status, today, restarted, components, qualityAvg, published, pending };
}

function parseResearcherReport(log: string): ResearcherReport {
  const added     = Number(log.match(/RESEARCH_ADDED: (\d+)/)?.[1] ?? log.match(/✅ Added (\d+) articles/)?.[1] ?? 0);
  const pending   = log.match(/RESEARCH_PENDING: (\d+)/)?.[1] ? Number(log.match(/RESEARCH_PENDING: (\d+)/)?.[1]) : null;
  const published = log.match(/RESEARCH_PUBLISHED: (\d+)/)?.[1] ? Number(log.match(/RESEARCH_PUBLISHED: (\d+)/)?.[1]) : null;
  const topics    = [...log.matchAll(/RESEARCH_TOPIC: ([^|]+) \| (.+)/g)]
    .map((m) => ({ cluster: m[1].trim(), title: m[2].trim() }));
  return { type: "researcher", added, pending, published, topics };
}

function parseImproverReport(log: string): ImproverReport {
  const analyzed  = Number(log.match(/ARTICLES_ANALYZED: (\d+)/)?.[1] ?? 0);
  const added     = Number(log.match(/PROPOSALS_ADDED: (\d+)/)?.[1] ?? 0);
  const proposals = [...log.matchAll(/💡 Proposal added: (\S+) \(impact: (\d+)\/10, type: ([^)]+)\)/g)]
    .map((m) => ({ slug: m[1], impact: Number(m[2]), type: m[3] }));
  return { type: "improver", analyzed, added, proposals };
}

function parseReport(workflowFile: string, log: string): AgentReport {
  switch (workflowFile) {
    case "auto-generate.yml":    return parseWriterReport(log);
    case "audit.yml":            return parseAuditorReport(log);
    case "fixer.yml":            return parseFixerReport(log);
    case "pipeline-manager.yml": return parsePipelineReport(log);
    case "research.yml":         return parseResearcherReport(log);
    case "improver.yml":         return parseImproverReport(log);
    default:                     return parseResearcherReport(log);
  }
}

async function fetchRunReport(
  runId: number,
  workflowFile: string,
  token: string
): Promise<AgentReport | null> {
  try {
    // 1. Get jobs for this run
    const jobsRes = await fetch(`${GH_BASE}/runs/${runId}/jobs`, {
      headers: ghHeaders(token),
    });
    if (!jobsRes.ok) return null;

    const jobsData = (await jobsRes.json()) as GHJobsResponse;
    if (!jobsData.jobs || jobsData.jobs.length === 0) return null;
    const jobId = jobsData.jobs[0].id;

    // 2. Fetch logs (follows the 302 redirect to Azure Blob Storage)
    const logsRes = await fetch(
      `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/actions/jobs/${jobId}/logs`,
      {
        headers: ghHeaders(token),
        redirect: "follow",
      }
    );
    if (!logsRes.ok) return null;

    const logText = await logsRes.text();
    // Strip timestamps like "2026-05-17T17:43:45.716Z "
    const clean = logText.replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z\s*/g, "");
    return parseReport(workflowFile, clean);
  } catch {
    return null;
  }
}

// ── GET /api/admin/agents ──────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ghToken = process.env.GH_TOKEN;
  if (!ghToken) {
    return NextResponse.json({ error: "GH_TOKEN not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch all workflows
    const wfRes = await fetch(`${GH_BASE}/workflows`, {
      headers: ghHeaders(ghToken),
    });
    if (!wfRes.ok) {
      return NextResponse.json(
        { error: `GitHub workflows API error: ${wfRes.status}` },
        { status: 502 }
      );
    }
    const wfData = (await wfRes.json()) as GHWorkflowsResponse;

    // Build a map: filename → workflow
    const wfMap = new Map<string, GHWorkflow>();
    for (const wf of wfData.workflows) {
      // path is like ".github/workflows/research.yml"
      const filename = wf.path.split("/").pop() ?? "";
      wfMap.set(filename, wf);
    }

    // 2. For each agent, fetch runs and logs (all in parallel)
    const agents: AgentData[] = await Promise.all(
      AGENT_META.map(async (meta): Promise<AgentData> => {
        const wf = wfMap.get(meta.workflowFile);
        if (!wf) {
          return {
            ...meta,
            workflowId: null,
            state: "disabled",
            lastRun: null,
            runsToday: 0,
            totalRuns: 0,
            recentRuns: [],
            report: null,
          };
        }

        const runsRes = await fetch(
          `${GH_BASE}/workflows/${wf.id}/runs?per_page=30`,
          { headers: ghHeaders(ghToken) }
        );

        if (!runsRes.ok) {
          return {
            ...meta,
            workflowId: wf.id,
            state: wf.state === "active" ? "active" : "disabled",
            lastRun: null,
            runsToday: 0,
            totalRuns: 0,
            recentRuns: [],
            report: null,
          };
        }

        const runsData = (await runsRes.json()) as GHRunsResponse;
        const runs = runsData.workflow_runs;

        const recentRuns: RunSummary[] = runs.slice(0, 5).map((r) => ({
          id: r.id,
          status: r.status,
          conclusion: r.conclusion,
          startedAt: r.run_started_at ?? r.created_at,
          durationSeconds: computeDuration(r),
          url: r.html_url,
        }));

        const lastRun = runs.length > 0
          ? {
              status: runs[0].status,
              conclusion: runs[0].conclusion,
              startedAt: runs[0].run_started_at ?? runs[0].created_at,
              durationSeconds: computeDuration(runs[0]),
            }
          : null;

        const runsToday = runs.filter((r) => isToday(r.created_at)).length;

        // Fetch report from last completed run's logs
        const lastCompletedRun = runs.find((r) => r.status === "completed");
        const report = lastCompletedRun
          ? await fetchRunReport(lastCompletedRun.id, meta.workflowFile, ghToken)
          : null;

        return {
          ...meta,
          workflowId: wf.id,
          state: wf.state === "active" ? "active" : "disabled",
          lastRun,
          runsToday,
          totalRuns: runs.length,
          recentRuns,
          report,
        };
      })
    );

    return NextResponse.json({ agents }, { status: 200 });
  } catch (err) {
    console.error("Agents GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/admin/agents ─────────────────────────────────────────────────────
// Body: { workflow: 'auto-generate.yml', action: 'enable' | 'disable' | 'trigger' }

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ghToken = process.env.GH_TOKEN;
  if (!ghToken) {
    return NextResponse.json({ error: "GH_TOKEN not configured" }, { status: 500 });
  }

  let body: { workflow?: string; action?: string };
  try {
    body = (await req.json()) as { workflow?: string; action?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { workflow, action } = body;
  if (!workflow || !action) {
    return NextResponse.json({ error: "workflow and action are required" }, { status: 400 });
  }

  if (!["enable", "disable", "trigger"].includes(action)) {
    return NextResponse.json({ error: "action must be enable | disable | trigger" }, { status: 400 });
  }

  // Get workflow ID
  const wfRes = await fetch(`${GH_BASE}/workflows`, {
    headers: ghHeaders(ghToken),
  });
  if (!wfRes.ok) {
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 502 });
  }
  const wfData = (await wfRes.json()) as GHWorkflowsResponse;
  const wf = wfData.workflows.find((w) => w.path.endsWith(`/${workflow}`));
  if (!wf) {
    return NextResponse.json({ error: `Workflow ${workflow} not found` }, { status: 404 });
  }

  try {
    if (action === "enable") {
      const res = await fetch(`${GH_BASE}/workflows/${wf.id}/enable`, {
        method: "PUT",
        headers: ghHeaders(ghToken),
      });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: `GitHub enable failed: ${text}` }, { status: 502 });
      }
      return NextResponse.json({ ok: true, action: "enabled", workflow });
    }

    if (action === "disable") {
      const res = await fetch(`${GH_BASE}/workflows/${wf.id}/disable`, {
        method: "PUT",
        headers: ghHeaders(ghToken),
      });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: `GitHub disable failed: ${text}` }, { status: 502 });
      }
      return NextResponse.json({ ok: true, action: "disabled", workflow });
    }

    if (action === "trigger") {
      const res = await fetch(`${GH_BASE}/workflows/${wf.id}/dispatches`, {
        method: "POST",
        headers: { ...ghHeaders(ghToken), "Content-Type": "application/json" },
        body: JSON.stringify({ ref: "main" }),
      });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: `GitHub dispatch failed: ${text}` }, { status: 502 });
      }
      return NextResponse.json({ ok: true, action: "triggered", workflow });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Agents POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
