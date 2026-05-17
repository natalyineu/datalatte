import { NextRequest, NextResponse } from "next/server";

const REPO = "natalyineu/datalatte";
const FILE = "content/quality-scores.json";

interface QualityScore {
  score: number;
  has_cta: boolean;
  on_topic: boolean;
  checkedAt: string;
}

interface QualityScoresFile {
  _schema: string;
  scores: Record<string, QualityScore>;
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

// ── GET /api/admin/quality ─────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ghToken = process.env.GH_TOKEN;
  if (!ghToken) {
    return NextResponse.json({ error: "GH_TOKEN not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
      headers: ghHeaders(ghToken),
    });

    if (res.status === 404) {
      return NextResponse.json({ scores: {} }, { status: 200 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: `GitHub GET failed: ${res.status}` }, { status: 502 });
    }

    const json = await res.json() as { content: string };
    const decoded = JSON.parse(Buffer.from(json.content, "base64").toString("utf8")) as QualityScoresFile;

    return NextResponse.json({ scores: decoded.scores ?? {} }, { status: 200 });
  } catch (err) {
    console.error("Quality GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
