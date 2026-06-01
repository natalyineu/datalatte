#!/usr/bin/env node
/**
 * Fetches last-28-day data from Google Search Console and GA4.
 * Uses a Google service account for both — no expiring OAuth tokens.
 *
 * Required secrets:
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — full service account key JSON (as string)
 *   GSC_SITE_URL                 — e.g. "sc-domain:datalatte.pro"
 *   GA4_PROPERTY_ID              — e.g. "properties/123456789"
 */

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "../data/analytics");

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
  const key = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });
}

function dateStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function fetchGSC() {
  const auth = getAuth();
  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) throw new Error("GSC_SITE_URL not set");

  const sc = google.searchconsole({ version: "v1", auth });
  // Use "all" dataState to include fresh (yesterday's) data — matches the GSC web UI.
  // "final" would exclude the last 2-3 days while Google reconciles totals.
  const endDate = dateStr(-1);   // through yesterday
  const startDate = dateStr(-28);

  // Top queries
  const queriesRes = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 100,
      dataState: "all",
    },
  });

  // Top pages
  const pagesRes = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 50,
      dataState: "all",
    },
  });

  // Country breakdown
  const countriesRes = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["country"],
      rowLimit: 20,
      dataState: "all",
    },
  });

  // Daily trend (last 28 days)
  const trendRes = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["date"],
      rowLimit: 30,
      dataState: "all",
    },
  });

  return {
    fetchedAt: new Date().toISOString(),
    period: { startDate, endDate },
    siteUrl,
    queries: queriesRes.data.rows || [],
    pages: pagesRes.data.rows || [],
    countries: countriesRes.data.rows || [],
    dailyTrend: trendRes.data.rows || [],
  };
}

async function fetchGA4() {
  const auth = getAuth();
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) throw new Error("GA4_PROPERTY_ID not set");

  const analytics = google.analyticsdata({ version: "v1beta", auth });
  const endDate = "yesterday";
  const startDate = "28daysAgo";

  // Sessions + users overview
  const overviewRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
        { name: "screenPageViews" },
      ],
    },
  });

  // Top pages by views
  const pagesRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 30,
    },
  });

  // Traffic sources
  const sourcesRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 15,
    },
  });

  // Daily sessions trend
  const trendRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    },
  });

  return {
    fetchedAt: new Date().toISOString(),
    period: { startDate, endDate },
    propertyId,
    overview: overviewRes.data,
    topPages: pagesRes.data.rows || [],
    trafficSources: sourcesRes.data.rows || [],
    dailyTrend: trendRes.data.rows || [],
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const errors = [];

  // GSC
  try {
    console.log("Fetching Google Search Console...");
    const gsc = await fetchGSC();
    const gscPath = path.join(OUT_DIR, "gsc-latest.json");
    fs.writeFileSync(gscPath, JSON.stringify(gsc, null, 2));
    console.log(`✓ GSC saved → ${gscPath}`);
    console.log(`  Queries: ${gsc.queries.length}, Pages: ${gsc.pages.length}`);
  } catch (err) {
    console.error("✗ GSC error:", err.message);
    errors.push("GSC: " + err.message);
  }

  // GA4
  try {
    console.log("Fetching Google Analytics 4...");
    const ga4 = await fetchGA4();
    const ga4Path = path.join(OUT_DIR, "ga4-latest.json");
    fs.writeFileSync(ga4Path, JSON.stringify(ga4, null, 2));
    console.log(`✓ GA4 saved → ${ga4Path}`);
  } catch (err) {
    console.error("✗ GA4 error:", err.message);
    errors.push("GA4: " + err.message);
  }

  if (errors.length) {
    console.error("\nErrors:", errors.join("; "));
    process.exit(1);
  }

  // Send Telegram summary
  await sendTelegramReport();
}

async function sendTelegramReport() {
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat  = process.env.TELEGRAM_CHAT_ID;
  if (!tgToken || !tgChat) {
    console.log("No TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID — skipping Telegram report");
    return;
  }

  const gsc = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "gsc-latest.json"), "utf8"));
  const ga4 = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "ga4-latest.json"), "utf8"));

  const overview = ga4.overview.rows?.[0]?.metricValues || [];
  const sessions  = overview[0]?.value || "0";
  const users     = overview[1]?.value || "0";
  const bounce    = overview[3] ? (parseFloat(overview[3].value) * 100).toFixed(0) + "%" : "—";
  const avgSec    = overview[4] ? Math.round(parseFloat(overview[4].value)) : 0;
  const avgMin    = `${Math.floor(avgSec / 60)}m ${avgSec % 60}s`;

  const totalClicks      = gsc.queries.reduce((s, q) => s + q.clicks, 0);
  const totalImpressions = gsc.queries.reduce((s, q) => s + q.impressions, 0);
  const topQueries = gsc.queries
    .filter(q => q.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 3)
    .map(q => `  • "${q.keys[0]}" — ${q.clicks} clicks, pos ${q.position.toFixed(1)}`)
    .join("\n") || "  (нет кликов пока)";

  const topPages = ga4.topPages
    .filter(p => p.dimensionValues[0].value !== "/admin" && p.dimensionValues[0].value !== "/admin/reports")
    .slice(0, 5)
    .map(p => `  • ${p.dimensionValues[0].value} — ${p.metricValues[0].value} views`)
    .join("\n");

  // Last 7 days trend
  const last7 = ga4.dailyTrend.slice(-7);
  const trend7sessions = last7.reduce((s, d) => s + parseInt(d.metricValues[0].value), 0);

  const organic = ga4.trafficSources.find(s => s.dimensionValues[0].value === "Organic Search");
  const organicSessions = organic?.metricValues[0]?.value || "0";

  const date = new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

  const msg = [
    `📊 Analytics Report — ${date}`,
    `📅 Period: ${gsc.period.startDate} → ${gsc.period.endDate}`,
    "",
    `🌐 GA4 (28 дней)`,
    `  Sessions: ${sessions} | Users: ${users}`,
    `  Bounce: ${bounce} | Avg session: ${avgMin}`,
    `  Organic sessions: ${organicSessions}`,
    `  Last 7 days: ${trend7sessions} sessions`,
    "",
    `🔍 Search Console`,
    `  Clicks: ${totalClicks} | Impressions: ${totalImpressions}`,
    `  Top queries:`,
    topQueries,
    "",
    `📄 Top pages:`,
    topPages,
  ].join("\n");

  const body = JSON.stringify({ chat_id: tgChat, text: msg });
  await new Promise((resolve, reject) => {
    const https = require("https");
    const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }, res => {
      res.resume();
      if (res.statusCode === 200) { console.log("✓ Telegram report sent"); resolve(); }
      else { console.error(`✗ Telegram error: ${res.statusCode}`); resolve(); }
    });
    req.on("error", e => { console.error("✗ Telegram network error:", e.message); resolve(); });
    req.write(body);
    req.end();
  });
}

main();
