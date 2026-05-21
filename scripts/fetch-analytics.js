#!/usr/bin/env node
/**
 * Fetches last-28-day data from Google Search Console and GA4.
 * Both use the same OAuth2 refresh token — no service account needed.
 *
 * Required secrets (all 3 already set from GSC setup):
 *   GSC_OAUTH_CLIENT_ID
 *   GSC_OAUTH_CLIENT_SECRET
 *   GSC_OAUTH_REFRESH_TOKEN   — includes both webmasters + analytics scopes
 *   GSC_SITE_URL              — e.g. "sc-domain:datalatte.pro"
 *   GA4_PROPERTY_ID           — e.g. "properties/123456789"
 */

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "../data/analytics");

function getAuth() {
  const clientId     = process.env.GSC_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GSC_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GSC_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GSC_OAUTH_CLIENT_ID / CLIENT_SECRET / REFRESH_TOKEN not set");
  }
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
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
}

main();
