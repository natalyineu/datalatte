#!/usr/bin/env node
/**
 * Fetches last-28-day data from Google Search Console and GA4,
 * then writes JSON snapshots to data/analytics/.
 *
 * Required env vars:
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

async function fetchGSC(auth) {
  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) throw new Error("GSC_SITE_URL not set");

  const sc = google.searchconsole({ version: "v1", auth });
  const endDate = dateStr(-3);   // GSC lags ~3 days
  const startDate = dateStr(-30);

  // Top queries
  const queriesRes = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 100,
      dataState: "final",
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
      dataState: "final",
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
      dataState: "final",
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
      dataState: "final",
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

async function fetchGA4(auth) {
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
  const auth = getAuth();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const errors = [];

  // GSC
  try {
    console.log("Fetching Google Search Console...");
    const gsc = await fetchGSC(auth);
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
    const ga4 = await fetchGA4(auth);
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
}

main();
