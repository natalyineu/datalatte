import { NextRequest, NextResponse } from "next/server";

// Cron endpoint — called by GitHub Actions on a schedule.
// Uses a separate CRON_SECRET env var so it never exposes the admin password.
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batchSize = Number(req.headers.get("x-batch-size") ?? "3");
  const results: Array<{ slug: string; success: boolean; error?: string }> = [];

  for (let i = 0; i < batchSize; i++) {
    try {
      const res = await fetch(new URL("/api/admin/generate", req.url).toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_PASSWORD}`,
          "Content-Type": "application/json",
        },
      });

      const data = (await res.json()) as {
        success?: boolean;
        slug?: string;
        message?: string;
        error?: string;
      };

      if (data.message === "No pending articles in queue") {
        results.push({ slug: "—", success: true, error: "Queue empty — stopping" });
        break;
      }

      results.push({
        slug: data.slug ?? "unknown",
        success: !!data.success,
        error: data.error,
      });

      // 25s cooldown between articles to stay within Groq free tier (12k TPM)
      if (i < batchSize - 1) {
        await new Promise((r) => setTimeout(r, 25_000));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ slug: "unknown", success: false, error: msg });
      break;
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  return NextResponse.json({ generated: succeeded, total: results.length, results });
}
