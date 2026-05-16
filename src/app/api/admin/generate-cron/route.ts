import { NextRequest, NextResponse } from "next/server";

// Cron endpoint — generates ONE article per call.
// Called repeatedly by GitHub Actions with sleep between calls,
// so no long-running logic lives inside this serverless function.
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (!secret || !expected || secret !== expected) {
    return NextResponse.json({
      error: "Unauthorized",
      debug: {
        secretReceived: !!secret,
        secretLength: secret?.length ?? 0,
        envVarSet: !!expected,
        envVarLength: expected?.length ?? 0,
      }
    }, { status: 401 });
  }

  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const res = await fetch(`${base}/api/admin/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_PASSWORD}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
