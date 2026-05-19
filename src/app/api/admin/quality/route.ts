import { NextRequest, NextResponse } from "next/server";

const REPO = "natalyineu/datalatte";
const QUALITY_FILE = "content/quality-scores.json";

interface QualityScore {
  score: number;
  has_cta: boolean;
  on_topic: boolean;
  checkedAt: string;
  improvedAt?: string;
  improvedFrom?: number;
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

async function ghGetJson<T>(url: string, token: string): Promise<T | null> {
  const res = await fetch(url, { headers: ghHeaders(token) });
  if (!res.ok) return null;
  const json = await res.json() as { content: string };
  return JSON.parse(Buffer.from(json.content, "base64").toString("utf8")) as T;
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
    // Fetch quality scores
    const qualityData = await ghGetJson<QualityScoresFile>(
      `https://api.github.com/repos/${REPO}/contents/${QUALITY_FILE}`,
      ghToken,
    );

    const scores = qualityData?.scores ?? {};

    // Derive summary stats
    const entries = Object.entries(scores);
    const totalScored = entries.length;
    const avgScore = totalScored > 0
      ? Math.round((entries.reduce((a, [, v]) => a + v.score, 0) / totalScored) * 10) / 10
      : null;

    // Score distribution buckets
    const dist = { excellent: 0, good: 0, fair: 0, poor: 0 };
    for (const [, v] of entries) {
      if (v.score >= 9) dist.excellent++;
      else if (v.score >= 7) dist.good++;
      else if (v.score >= 5) dist.fair++;
      else dist.poor++;
    }

    // Fixer queue: score < 7, not improved in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const fixerQueue = entries.filter(([, v]) =>
      v.score < 7 && (!v.improvedAt || v.improvedAt < thirtyDaysAgo)
    ).length;

    // Recently improved (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentlyImproved = entries
      .filter(([, v]) => v.improvedAt && v.improvedAt > sevenDaysAgo)
      .map(([slug, v]) => ({
        slug,
        score: v.score,
        improvedFrom: v.improvedFrom ?? null,
        improvedAt: v.improvedAt!,
      }))
      .sort((a, b) => b.improvedAt.localeCompare(a.improvedAt))
      .slice(0, 10);

    // Lowest scoring articles (fixer targets)
    const lowestScoring = entries
      .filter(([, v]) => v.score < 7)
      .sort(([, a], [, b]) => a.score - b.score)
      .slice(0, 15)
      .map(([slug, v]) => ({
        slug,
        score: v.score,
        checkedAt: v.checkedAt,
        improvedAt: v.improvedAt ?? null,
      }));

    return NextResponse.json({
      scores,
      stats: {
        totalScored,
        avgScore,
        dist,
        fixerQueue,
        recentlyImproved,
        lowestScoring,
      },
    }, { status: 200 });

  } catch (err) {
    console.error("Quality GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
