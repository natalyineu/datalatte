import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const QUEUE_PATH = path.join(process.cwd(), "content/queue.json");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Recommendation {
  title: string;
  slug: string;
  primaryKeyword: string;
  cluster: string;
  targetWords: number;
  source: "queue";
  status: "pending" | "generating" | "generated" | "published";
}

// ── GET /api/admin/recommendations ───────────────────────────────────────────
// Returns pending/generating articles from queue.json, sorted by cluster.

export async function GET(): Promise<NextResponse> {
  try {
    if (!fs.existsSync(QUEUE_PATH)) {
      return NextResponse.json({ recommendations: [], total: 0 }, { status: 200 });
    }

    const raw = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8")) as {
      queue: Array<{
        slug: string;
        title: string;
        status: string;
        category?: string;
        cluster?: string;
        niche?: string;
        primaryKeyword?: string;
        targetWords?: number;
      }>;
    };

    const recommendations: Recommendation[] = raw.queue
      .filter((e) => e.status === "pending" || e.status === "generating")
      .map((e) => ({
        title:          e.title || e.slug,
        slug:           e.slug,
        primaryKeyword: e.primaryKeyword || e.category || e.cluster || "",
        cluster:        e.cluster || e.category || "Uncategorised",
        targetWords:    e.targetWords ?? 1600,
        source:         "queue" as const,
        status:         (e.status as "pending" | "generating" | "generated" | "published"),
      }))
      .sort((a, b) => a.cluster.localeCompare(b.cluster));

    return NextResponse.json(
      { recommendations, total: recommendations.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Recommendations error:", err);
    return NextResponse.json(
      { error: "Failed to load queue" },
      { status: 500 }
    );
  }
}
