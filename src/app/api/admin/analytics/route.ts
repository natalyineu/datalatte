import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GSC_PATH = path.join(process.cwd(), "data/analytics/gsc-latest.json");
const GA4_PATH = path.join(process.cwd(), "data/analytics/ga4-latest.json");

interface GSCRow {
  keys: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

interface GSCFile {
  fetchedAt: string;
  period: { startDate: string; endDate: string };
  siteUrl: string;
  queries: GSCRow[];
  pages: GSCRow[];
  countries: GSCRow[];
  dailyTrend: GSCRow[];
}

interface GA4Row {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface GA4File {
  fetchedAt: string;
  period: { startDate: string; endDate: string };
  propertyId: string;
  overview: { rows?: { metricValues: { value: string }[] }[] };
  topPages: GA4Row[];
  trafficSources: GA4Row[];
  dailyTrend: GA4Row[];
}

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  return token === adminPassword && adminPassword.length > 0;
}

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function sumRows(rows: GSCRow[]): { clicks: number; impressions: number } {
  return rows.reduce(
    (acc, r) => ({
      clicks: acc.clicks + (r.clicks ?? 0),
      impressions: acc.impressions + (r.impressions ?? 0),
    }),
    { clicks: 0, impressions: 0 }
  );
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gsc = readJson<GSCFile>(GSC_PATH);
  const ga4 = readJson<GA4File>(GA4_PATH);

  if (!gsc && !ga4) {
    return NextResponse.json(
      { error: "No analytics snapshots yet — run the Daily Analytics Fetch workflow." },
      { status: 404 }
    );
  }

  // ── GSC summary ──────────────────────────────────────────────────────────────
  const gscSummary = gsc
    ? (() => {
        const totals = sumRows(gsc.queries);
        const pageTotals = sumRows(gsc.pages);
        // Average position weighted by impressions across top queries
        const weightedPos = gsc.queries.reduce(
          (acc, r) => acc + (r.position ?? 0) * (r.impressions ?? 0),
          0
        );
        const avgPosition = totals.impressions > 0 ? weightedPos / totals.impressions : null;
        return {
          fetchedAt: gsc.fetchedAt,
          period: gsc.period,
          clicks: pageTotals.clicks,
          impressions: pageTotals.impressions,
          ctr: pageTotals.impressions > 0 ? pageTotals.clicks / pageTotals.impressions : 0,
          avgPosition,
          topQueries: gsc.queries
            .slice()
            .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
            .slice(0, 10)
            .map((r) => ({
              query: r.keys[0],
              clicks: r.clicks ?? 0,
              impressions: r.impressions ?? 0,
              position: r.position ?? 0,
            })),
          topPages: gsc.pages
            .slice()
            .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0) || (b.impressions ?? 0) - (a.impressions ?? 0))
            .slice(0, 10)
            .map((r) => ({
              page: r.keys[0].replace(/^https?:\/\/(www\.)?datalatte\.pro/, "") || "/",
              clicks: r.clicks ?? 0,
              impressions: r.impressions ?? 0,
              position: r.position ?? 0,
            })),
          dailyTrend: gsc.dailyTrend
            .slice()
            .sort((a, b) => (a.keys[0] < b.keys[0] ? -1 : 1))
            .map((r) => ({
              date: r.keys[0],
              clicks: r.clicks ?? 0,
              impressions: r.impressions ?? 0,
              position: r.position ?? 0,
            })),
        };
      })()
    : null;

  // ── GA4 summary ──────────────────────────────────────────────────────────────
  const ga4Summary = ga4
    ? (() => {
        const o = ga4.overview.rows?.[0]?.metricValues;
        const overview = o
          ? {
              sessions: Number(o[0]?.value ?? 0),
              activeUsers: Number(o[1]?.value ?? 0),
              newUsers: Number(o[2]?.value ?? 0),
              bounceRate: Number(o[3]?.value ?? 0),
              avgSessionDurationSeconds: Number(o[4]?.value ?? 0),
              pageViews: Number(o[5]?.value ?? 0),
            }
          : null;
        return {
          fetchedAt: ga4.fetchedAt,
          period: ga4.period,
          overview,
          topPages: ga4.topPages.slice(0, 10).map((r) => ({
            page: r.dimensionValues[0]?.value ?? "",
            views: Number(r.metricValues[0]?.value ?? 0),
            users: Number(r.metricValues[1]?.value ?? 0),
          })),
          trafficSources: ga4.trafficSources.slice(0, 10).map((r) => ({
            channel: r.dimensionValues[0]?.value ?? "",
            sessions: Number(r.metricValues[0]?.value ?? 0),
            users: Number(r.metricValues[1]?.value ?? 0),
          })),
          dailyTrend: ga4.dailyTrend.map((r) => ({
            date: r.dimensionValues[0]?.value ?? "",
            sessions: Number(r.metricValues[0]?.value ?? 0),
            users: Number(r.metricValues[1]?.value ?? 0),
          })),
        };
      })()
    : null;

  return NextResponse.json({ gsc: gscSummary, ga4: ga4Summary });
}
