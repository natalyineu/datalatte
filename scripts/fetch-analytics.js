#!/usr/bin/env node
/**
 * Fetches last-28-day data from Google Search Console and GA4.
 * Uses OAuth2 refresh token (works for both GSC and GA4).
 *
 * Required secrets:
 *   GOOGLE_SA_KEY             — service-account JSON (preferred), OR the three OAuth vars below
 *   GSC_OAUTH_CLIENT_ID
 *   GSC_OAUTH_CLIENT_SECRET
 *   GSC_OAUTH_REFRESH_TOKEN
 *   GSC_SITE_URL              — e.g. "sc-domain:datalatte.pro"
 *   GA4_PROPERTY_ID           — e.g. "properties/123456789"
 */

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "../data/analytics");

function getAuth() {
  // Preferred: service account (key never expires). Secret GOOGLE_SA_KEY = full JSON key.
  if (process.env.GOOGLE_SA_KEY) {
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SA_KEY),
      scopes: [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
      ],
    });
  }
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

  // Daily sessions by channel (for week-over-week organic / direct split)
  const chanRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }, { name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      limit: 1000,
    },
  });

  return {
    fetchedAt: new Date().toISOString(),
    period: { startDate, endDate },
    propertyId,
    dailyChannels: chanRes.data.rows || [],
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

// ── Report ───────────────────────────────────────────────────────────────────
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const pct = (cur, prev) => {
  if (!prev) return "—";
  const d = (cur / prev - 1) * 100;
  return `${d >= 0 ? "▲ +" : "▼ "}${d.toFixed(0)}%`;
};
const num = (n) => Math.round(n).toLocaleString("en-US");
const row = (label, cur, prev, fmt = num) => `  ${label}: ${fmt(cur)} (${pct(cur, prev)}, was ${fmt(prev)})`;
const fmtDay = (d) => `${d.slice(-2)}.${d.slice(5, 7)}`; // YYYY-MM-DD -> DD.MM
const iso = (d) => (d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}` : d);

function buildReport(gsc, ga4) {
  // ---- GSC: last 7 full days vs previous 7 ----
  const gd = gsc.dailyTrend;
  const g1 = gd.slice(-7), g0 = gd.slice(-14, -7);
  const gStats = (a) => {
    const imp = sum(a, d => d.impressions), clk = sum(a, d => d.clicks);
    return { imp, clk, ctr: imp ? clk / imp * 100 : 0, pos: imp ? sum(a, d => d.position * d.impressions) / imp : 0 };
  };
  const c1 = gStats(g1), c0 = gStats(g0);
  const gTot = gStats(gd);

  // ---- GA4: last 7 vs previous 7 ----
  const ad = ga4.dailyTrend.map(d => ({ date: iso(d.dimensionValues[0].value), sessions: +d.metricValues[0].value, users: +d.metricValues[1].value }));
  ad.sort((a, b) => a.date.localeCompare(b.date));
  const a1 = ad.slice(-7), a0 = ad.slice(-14, -7);
  const weekDates = new Set(a1.map(d => d.date)), prevDates = new Set(a0.map(d => d.date));
  const chan = (ga4.dailyChannels || []).map(r => ({ date: iso(r.dimensionValues[0].value), ch: r.dimensionValues[1].value, s: +r.metricValues[0].value }));
  const chSum = (dates, ch) => sum(chan.filter(r => dates.has(r.date) && (ch === null || r.ch === ch)), r => r.s);
  const hasChan = chan.length > 0;

  const s1 = sum(a1, d => d.sessions), s0 = sum(a0, d => d.sessions);
  const u1 = sum(a1, d => d.users), u0 = sum(a0, d => d.users);

  const ov = ga4.overview.rows?.[0]?.metricValues || [];
  const bounce = ov[3] ? (parseFloat(ov[3].value) * 100).toFixed(0) + "%" : "—";
  const avgSec = ov[4] ? Math.round(parseFloat(ov[4].value)) : 0;
  const direct28 = ga4.trafficSources.find(x => x.dimensionValues[0].value === "Direct")?.metricValues[0]?.value || "0";
  const sess28 = ov[0]?.value || "0";
  const directShare = +sess28 ? (+direct28 / +sess28 * 100).toFixed(0) : "0";

  const range = (a) => a.length ? `${fmtDay(a[0].date || a[0].keys?.[0])}–${fmtDay(a[a.length - 1].date || a[a.length - 1].keys?.[0])}` : "—";
  const date = new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

  const topQueries = gsc.queries.filter(q => q.clicks > 0).sort((a, b) => b.clicks - a.clicks).slice(0, 3)
    .map(q => `  • "${q.keys[0]}" — ${q.clicks} clicks, pos ${q.position.toFixed(1)}`).join("\n") || "  (нет кликов пока)";
  const topPages = ga4.topPages.filter(p => !p.dimensionValues[0].value.startsWith("/admin")).slice(0, 5)
    .map(p => `  • ${p.dimensionValues[0].value} — ${p.metricValues[0].value} views`).join("\n");

  const lines = [
    `📊 DataLatte — ${date}`,
    `📅 Неделя ${range(g1)} vs ${range(g0)}`,
    "",
    "🔍 Search Console (7д vs пред. 7д)",
    row("Impressions", c1.imp, c0.imp),
    row("Clicks", c1.clk, c0.clk),
    row("CTR", c1.ctr, c0.ctr, v => v.toFixed(2) + "%"),
    `  Avg position: ${c1.pos.toFixed(1)} (was ${c0.pos.toFixed(1)}; ниже = лучше)`,
    "",
    "🌐 GA4 (7д vs пред. 7д)",
    row("Sessions", s1, s0),
    row("Users", u1, u0),
  ];
  if (hasChan) {
    lines.push(row("Organic Search", chSum(weekDates, "Organic Search"), chSum(prevDates, "Organic Search")));
    lines.push(row("AI Assistant", chSum(weekDates, "AI Assistant"), chSum(prevDates, "AI Assistant")));
    const nd1 = chSum(weekDates, null) - chSum(weekDates, "Direct"), nd0 = chSum(prevDates, null) - chSum(prevDates, "Direct");
    lines.push(row("Без Direct (≈ реальный)", nd1, nd0));
    lines.push(row("Direct (боты?)", chSum(weekDates, "Direct"), chSum(prevDates, "Direct")));
  }
  lines.push(
    "",
    `📆 28 дней: ${num(gTot.imp)} показов, ${gTot.clk} кликов (CTR ${gTot.ctr.toFixed(2)}%) | ${num(+sess28)} сессий, Direct ${directShare}%, bounce ${bounce}, ${Math.floor(avgSec / 60)}m ${avgSec % 60}s`,
    "",
    "🔎 Top queries (28д):",
    topQueries,
    "",
    "📄 Top pages (28д):",
    topPages,
  );
  return lines.join("\n");
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
  const msg = buildReport(gsc, ga4);

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

if (require.main === module) main();
module.exports = { buildReport };
