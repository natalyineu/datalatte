import { NextRequest, NextResponse } from "next/server";

const REPO = "natalyineu/datalatte";
const FILE = "content/proposals.json";

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

interface ProposalsFile {
  _schema: string;
  proposals: Proposal[];
}

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  return token === adminPassword && adminPassword.length > 0;
}

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "DataLatte-Admin",
  } as const;
}

async function getProposalsFile(ghToken: string): Promise<{ data: ProposalsFile; sha: string } | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    headers: ghHeaders(ghToken),
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitHub GET failed: ${res.status}`);
  }
  const json = await res.json() as { content: string; sha: string };
  const decoded = JSON.parse(Buffer.from(json.content, "base64").toString("utf8")) as ProposalsFile;
  return { data: decoded, sha: json.sha };
}

// ── GET /api/admin/proposals ───────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ghToken = process.env.GH_TOKEN;
  if (!ghToken) {
    return NextResponse.json({ error: "GH_TOKEN not configured" }, { status: 500 });
  }

  try {
    const result = await getProposalsFile(ghToken);
    if (!result) {
      return NextResponse.json({ proposals: [] }, { status: 200 });
    }
    return NextResponse.json({ proposals: result.data.proposals }, { status: 200 });
  } catch (err) {
    console.error("Proposals GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── PATCH /api/admin/proposals ─────────────────────────────────────────────────
// Body: { id: string, action: 'approve' | 'reject' | 'dismiss' }

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ghToken = process.env.GH_TOKEN;
  if (!ghToken) {
    return NextResponse.json({ error: "GH_TOKEN not configured" }, { status: 500 });
  }

  let body: { id?: string; action?: string };
  try {
    body = (await req.json()) as { id?: string; action?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, action } = body;
  if (!id || !action) {
    return NextResponse.json({ error: "id and action are required" }, { status: 400 });
  }

  if (!["approve", "reject", "dismiss"].includes(action)) {
    return NextResponse.json({ error: "action must be approve | reject | dismiss" }, { status: 400 });
  }

  const newStatus: Proposal["status"] =
    action === "approve" ? "approved" :
    action === "reject" ? "rejected" :
    "rejected"; // dismiss maps to rejected

  try {
    // 1. GET current file + SHA
    const result = await getProposalsFile(ghToken);
    if (!result) {
      return NextResponse.json({ error: "proposals.json not found" }, { status: 404 });
    }

    const { data: decoded, sha } = result;

    // 2. Find and update proposal
    const idx = decoded.proposals.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    decoded.proposals[idx].status = newStatus;
    decoded.proposals[idx].reviewedAt = new Date().toISOString();

    // 3. Write back to GitHub
    const writeRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
      method: "PUT",
      headers: { ...ghHeaders(ghToken), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `${action} proposal ${id} [vercel skip]`,
        content: Buffer.from(JSON.stringify(decoded, null, 2) + "\n").toString("base64"),
        sha,
      }),
    });

    if (!writeRes.ok) {
      const text = await writeRes.text();
      return NextResponse.json({ error: `GitHub write failed: ${text}` }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id, status: newStatus }, { status: 200 });
  } catch (err) {
    console.error("Proposals PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
