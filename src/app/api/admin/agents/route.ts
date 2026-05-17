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
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
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

    // 2. For each agent, fetch runs
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
          };
        }

        const runsRes = await fetch(
          `${GH_BASE}/workflows/${wf.id}/runs?per_page=10`,
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

        return {
          ...meta,
          workflowId: wf.id,
          state: wf.state === "active" ? "active" : "disabled",
          lastRun,
          runsToday,
          totalRuns: runs.length,
          recentRuns,
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
