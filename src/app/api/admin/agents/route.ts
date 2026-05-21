import { NextRequest, NextResponse } from "next/server";

const GH_OWNER = "natalyineu";
const GH_REPO  = "datalatte";
const GH_BASE  = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/actions`;

// ── Agent metadata ─────────────────────────────────────────────────────────────
// Only the two workflows that actually drive the pipeline. Everything else
// (the old Auditor / Fixer / Chart Adder / FAQ Fixer / Pipeline Manager /
// Improver / Researcher agents) has been absorbed into Caretaker, which runs
// every 2h. Their workflow files still exist but only fire on workflow_dispatch.

interface AgentMeta {
  name: string;
  emoji: string;
  description: string;
  schedule: string;
  workflowFile: string;
}

const AGENT_META: AgentMeta[] = [
  {
    name: "Writer",
    emoji: "✍️",
    description: "Picks pending articles from queue.json, generates full MDX via Groq, pushes to GitHub. Self-chains until queue empty.",
    schedule: "Every 5 min (self-chaining)",
    workflowFile: "auto-generate.yml",
  },
  {
    name: "Caretaker",
    emoji: "🧰",
    description: "Runs 4 phases every 2h: syntax fix, FAQ enrichment, chart enrichment, queue refill. Absorbs the work of the old Auditor / Fixer / Chart Adder / FAQ Fixer / Pipeline Manager / Improver / Researcher agents.",
    schedule: "Every 2 hours",
    workflowFile: "caretaker.yml",
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

interface CaretakerReport {
  type: "caretaker";
  syntaxFixed: number;
  linksInjected: number;
  faqAdded: number;
  chartsAdded: number;
  queueAdded: number;
  pending: number | null;
}

type AgentReport = WriterReport | CaretakerReport;

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
  tokensLastRun: number;
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

function parseCaretakerReport(log: string): CaretakerReport {
  const syntaxFixed   = Number(log.match(/CARETAKER_FIXED:\s*(\d+)/)?.[1] ?? 0);
  const linksInjected = Number(log.match(/CARETAKER_LINKS:\s*(\d+)/)?.[1] ?? 0);
  const faqAdded      = Number(log.match(/CARETAKER_FAQ:\s*(\d+)/)?.[1] ?? 0);
  const chartsAdded   = Number(log.match(/CARETAKER_CHARTS:\s*(\d+)/)?.[1] ?? 0);
  const queueAdded    = Number(log.match(/CARETAKER_QUEUE_ADDED:\s*(\d+)/)?.[1] ?? 0);
  const pendingRaw    = log.match(/CARETAKER_PENDING:\s*(\d+)/)?.[1];
  return {
    type: "caretaker",
    syntaxFixed,
    linksInjected,
    faqAdded,
    chartsAdded,
    queueAdded,
    pending: pendingRaw ? Number(pendingRaw) : null,
  };
}

function parseReport(workflowFile: string, log: string): AgentReport | null {
  switch (workflowFile) {
    case "auto-generate.yml": return parseWriterReport(log);
    case "caretaker.yml":     return parseCaretakerReport(log);
    default:                  return null;
  }
}

async function fetchRunReport(
  runId: number,
  workflowFile: string,
  token: string
): Promise<{ report: AgentReport | null; tokensLastRun: number }> {
  try {
    // 1. Get jobs for this run
    const jobsRes = await fetch(`${GH_BASE}/runs/${runId}/jobs`, {
      headers: ghHeaders(token),
    });
    if (!jobsRes.ok) return { report: null, tokensLastRun: 0 };

    const jobsData = (await jobsRes.json()) as GHJobsResponse;
    if (!jobsData.jobs || jobsData.jobs.length === 0) return { report: null, tokensLastRun: 0 };
    const jobId = jobsData.jobs[0].id;

    // 2. Fetch logs (follows the 302 redirect to Azure Blob Storage)
    const logsRes = await fetch(
      `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/actions/jobs/${jobId}/logs`,
      {
        headers: ghHeaders(token),
        redirect: "follow",
      }
    );
    if (!logsRes.ok) return { report: null, tokensLastRun: 0 };

    const logText = await logsRes.text();
    // Strip timestamps like "2026-05-17T17:43:45.716Z "
    const clean = logText.replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z\s*/g, "");
    const tokensMatch = clean.match(/^GROQ_TOKENS:\s*(\d+)/m);
    const tokensLastRun = tokensMatch ? Number(tokensMatch[1]) : 0;
    return { report: parseReport(workflowFile, clean), tokensLastRun };
  } catch {
    return { report: null, tokensLastRun: 0 };
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
            tokensLastRun: 0,
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
            tokensLastRun: 0,
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
        const { report, tokensLastRun } = lastCompletedRun
          ? await fetchRunReport(lastCompletedRun.id, meta.workflowFile, ghToken)
          : { report: null, tokensLastRun: 0 };

        return {
          ...meta,
          workflowId: wf.id,
          state: wf.state === "active" ? "active" : "disabled",
          lastRun,
          runsToday,
          totalRuns: runs.length,
          recentRuns,
          report,
          tokensLastRun,
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
