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

  // Weekly page/query reports (last 7 days vs previous 7) for movers & opportunities
  const wk = async (dimension, start, end) =>
    (await sc.searchanalytics.query({
      siteUrl,
      requestBody: { startDate: start, endDate: end, dimensions: [dimension], rowLimit: 250, dataState: "all" },
    })).data.rows || [];
  const w1 = [dateStr(-7), dateStr(-1)], w0 = [dateStr(-14), dateStr(-8)];
  const [pagesW1, pagesW0, queriesW1, queriesW0] = await Promise.all([
    wk("page", ...w1), wk("page", ...w0), wk("query", ...w1), wk("query", ...w0),
  ]);

  // Whole history since launch (daily), for all-time totals and the weekly sparkline
  const allDailyRes = await sc.searchanalytics.query({
    siteUrl,
    requestBody: { startDate: "2026-05-01", endDate, dimensions: ["date"], rowLimit: 1000, dataState: "all" },
  });

  return {
    fetchedAt: new Date().toISOString(),
    period: { startDate, endDate },
    siteUrl,
    allDaily: (allDailyRes.data.rows || []).map(r => ({ d: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r.position })),
    weekly: { pagesW1, pagesW0, queriesW1, queriesW0 },
    queries: queriesRes.data.rows || [],
    pages: pagesRes.data.rows || [],
    countries: countriesRes.data.rows || [],
    dailyTrend: trendRes.data.rows || [],
  };
}

// Weekly per-URL snapshots (clicks/impressions/position) so rewritten pages can be
// compared before/after. One entry per ISO week; keeps the last 30 weeks.
async function saveGscPageHistory() {
  const auth = getAuth();
  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) return;
  const file = path.join(OUT_DIR, "gsc-pages-history.json");
  let hist = [];
  try { hist = JSON.parse(fs.readFileSync(file, "utf8")); } catch { /* first run */ }
  const end = dateStr(-3);                     // GSC data is stable after ~3 days
  // Full 90-day per-page pull (overwritten daily) — the 250-row weekly lists miss low-impression pages
  const sc90 = google.searchconsole({ version: "v1", auth });
  const rows90 = (await sc90.searchanalytics.query({
    siteUrl,
    requestBody: { startDate: dateStr(-93), endDate: end, dimensions: ["page"], rowLimit: 25000, dataState: "final" },
  })).data.rows || [];
  fs.writeFileSync(path.join(OUT_DIR, "gsc-pages-90d.json"), JSON.stringify({ end, pages: rows90.map(r => [r.keys[0].replace("https://datalatte.pro", ""), r.clicks, r.impressions, +r.position.toFixed(1)]) }));
  console.log(`✓ GSC 90d page list saved (${rows90.length} pages)`);
  // Query x page pairs (top 5000 by impressions) — shows which search queries each page ranks for.
  // Used to retarget titles/H2s and to find "position 8-20" opportunities. Overwritten daily.
  try {
    const qp = (await sc90.searchanalytics.query({
      siteUrl,
      requestBody: { startDate: dateStr(-93), endDate: end, dimensions: ["page", "query"], rowLimit: 25000, dataState: "final" },
    })).data.rows || [];
    qp.sort((a, b) => b.impressions - a.impressions);
    fs.writeFileSync(path.join(OUT_DIR, "gsc-query-page-90d.json"), JSON.stringify({
      end,
      cols: ["page", "query", "clicks", "impressions", "position"],
      rows: qp.slice(0, 5000).map(r => [r.keys[0].replace("https://datalatte.pro", ""), r.keys[1], r.clicks, r.impressions, +r.position.toFixed(1)]),
    }));
    console.log(`✓ GSC query x page saved (${Math.min(qp.length, 5000)} of ${qp.length} pairs)`);
  } catch (e) { console.warn("query x page export failed:", e.message); }
  // Page x country pairs (90d): which pages are shown in which countries (e.g. Poland, Germany, Netherlands).
  try {
    const pc = (await sc90.searchanalytics.query({
      siteUrl,
      requestBody: { startDate: dateStr(-93), endDate: end, dimensions: ["page", "country"], rowLimit: 25000, dataState: "final" },
    })).data.rows || [];
    pc.sort((a, b) => b.impressions - a.impressions);
    fs.writeFileSync(path.join(OUT_DIR, "gsc-page-country-90d.json"), JSON.stringify({
      end,
      cols: ["page", "country", "clicks", "impressions", "position"],
      rows: pc.map(r => [r.keys[0].replace("https://datalatte.pro", ""), r.keys[1], r.clicks, r.impressions, +r.position.toFixed(1)]),
    }));
    console.log(`✓ GSC page x country saved (${pc.length} pairs)`);
  } catch (e) { console.warn("page x country export failed:", e.message); }
  const last = hist[hist.length - 1];
  if (last && (new Date(end) - new Date(last.end)) / 864e5 < 7) return;
  const sc = google.searchconsole({ version: "v1", auth });
  const rows = (await sc.searchanalytics.query({
    siteUrl,
    requestBody: { startDate: dateStr(-9), endDate: end, dimensions: ["page"], rowLimit: 5000, dataState: "final" },
  })).data.rows || [];
  hist.push({ end, pages: rows.map(r => [r.keys[0].replace("https://datalatte.pro", ""), r.clicks, r.impressions, +r.position.toFixed(1)]) });
  fs.writeFileSync(file, JSON.stringify(hist.slice(-30)));
  console.log(`✓ GSC page history saved (${rows.length} pages, week ending ${end})`);
}


// ── UTM sessions (social/paid) → Supabase social_utm_daily ───────────────────
async function syncUtmToSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) { console.log("⚠ SUPABASE_SERVICE_ROLE_KEY not set — skipping UTM sync"); return; }
  const url = process.env.SUPABASE_URL || "https://olsxxfwvwsycwzihbmdn.supabase.co";
  const auth = getAuth();
  const analytics = google.analyticsdata({ version: "v1beta", auth });
  const res = await analytics.properties.runReport({
    property: process.env.GA4_PROPERTY_ID,
    requestBody: {
      dateRanges: [{ startDate: "14daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "date" }, { name: "sessionSource" }, { name: "sessionMedium" }, { name: "sessionCampaignName" }, { name: "sessionManualAdContent" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "engagedSessions" }, { name: "keyEvents" }],
      dimensionFilter: { filter: { fieldName: "sessionMedium", inListFilter: { values: ["social", "paid", "paid_social"] } } },
      limit: 10000,
    },
  });
  const rows = (res.data.rows || []).map((r) => {
    const d = r.dimensionValues.map((x) => x.value || "");
    const m = r.metricValues.map((x) => +x.value || 0);
    const clean = (v) => (v === "(not set)" ? "" : v);
    return { day: `${d[0].slice(0, 4)}-${d[0].slice(4, 6)}-${d[0].slice(6, 8)}`, source: d[1], medium: d[2], campaign: clean(d[3]), content: clean(d[4]),
      sessions: m[0], users: m[1], engaged_sessions: m[2], key_events: m[3], updated_at: new Date().toISOString() };
  });
  if (!rows.length) { console.log("✓ UTM: no social/paid sessions in the last 14 days"); return; }
  const r = await fetch(`${url}/rest/v1/social_utm_daily?on_conflict=day,source,medium,campaign,content`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(rows),
  });
  if (!r.ok) throw new Error(`Supabase upsert failed: ${r.status} ${await r.text()}`);
  console.log(`✓ UTM sessions synced: ${rows.length} rows`);
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

  // Lead-related events: last 7 days vs previous 7
  const evRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }, { startDate: "14daysAgo", endDate: "8daysAgo" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: ["contact_form_submitted", "generate_lead", "form_submit", "scroll", "scroll_25", "scroll_50", "scroll_75",
        "free_audit_clicked", "book_call_clicked", "calendly_clicked", "email_link_clicked", "phone_link_clicked", "contact_cta_clicked", "service_link_clicked",
        "chat_widget_opened", "chat_message_sent", "chat_lead_captured", "form_start", "email_subscribed", "exit_intent_popup_shown", "floating_cta_shown"] } } },
    },
  });

  // Whole history since launch: sessions by day x channel, and total key events
  const allChanRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate: "2026-05-01", endDate: "yesterday" }],
      dimensions: [{ name: "date" }, { name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      limit: 100000,
    },
  });
  const allEvRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate: "2026-05-01", endDate: "yesterday" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: ["scroll", "scroll_50", "free_audit_clicked", "book_call_clicked", "contact_cta_clicked", "chat_widget_opened", "chat_message_sent", "form_start", "contact_form_submitted", "chat_lead_captured"] } } },
    },
  });

  const allEvRealRes = await analytics.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate: "2026-05-01", endDate: "yesterday" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: { andGroup: { expressions: [
        { filter: { fieldName: "eventName", inListFilter: { values: ["scroll", "scroll_50", "free_audit_clicked", "book_call_clicked", "contact_cta_clicked", "chat_widget_opened", "chat_message_sent", "form_start", "contact_form_submitted", "chat_lead_captured"] } } },
        { notExpression: { filter: { fieldName: "sessionDefaultChannelGroup", stringFilter: { value: "Direct" } } } },
      ] } },
    },
  });

  return {
    fetchedAt: new Date().toISOString(),
    period: { startDate, endDate },
    propertyId,
    allTimeEventsReal: Object.fromEntries((allEvRealRes.data.rows || []).map(r => [r.dimensionValues[0].value, +r.metricValues[0].value])),
    allTimeChannels: (allChanRes.data.rows || []).map(r => ({ d: r.dimensionValues[0].value, ch: r.dimensionValues[1].value, s: +r.metricValues[0].value })),
    allTimeEvents: Object.fromEntries((allEvRes.data.rows || []).map(r => [r.dimensionValues[0].value, +r.metricValues[0].value])),
    events: evRes.data.rows || [],
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
    try { await saveGscPageHistory(); } catch (e) { console.error("page history:", e.message); }
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

  // UTM sessions for the CRM Social metrics page (non-fatal)
  try { await syncUtmToSupabase(); } catch (err) { console.error("✗ UTM sync error:", err.message); }

  if (errors.length) {
    console.error("\nErrors:", errors.join("; "));
    process.exit(1);
  }

  await fetchBing();

  // Send Telegram summary
  await sendTelegramReport();
}

// ── Bing Webmaster Tools (optional: needs BING_WEBMASTER_API_KEY) ────────────
async function fetchBing() {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) { console.log("– Bing skipped: BING_WEBMASTER_API_KEY not set"); return null; }
  try {
    const site = encodeURIComponent("https://datalatte.pro/");
    const res = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?apikey=${key}&siteUrl=${site}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = ((await res.json()).d || [])
      .map(r => ({ date: new Date(parseInt(String(r.Date).replace(/\D/g, ""), 10)).toISOString().slice(0, 10), clicks: r.Clicks || 0, impressions: r.Impressions || 0 }))
      .sort((a, b) => a.date.localeCompare(b.date));
    // Top queries / pages. Bing returns per-day rows → aggregate all-time AND last-7d vs previous-7d (relative to latest data day)
    const lastDay = rows.length ? rows[rows.length - 1].date : null;
    const dayMs = 86400000;
    const dOf = (x) => new Date(parseInt(String(x.Date).replace(/\D/g, ""), 10)).toISOString().slice(0, 10);
    const agg = async (method, keyName) => {
      try {
        const r = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/${method}?apikey=${key}&siteUrl=${site}`);
        if (!r.ok) return { all: [], win: [] };
        const m = new Map();
        const cut7 = lastDay ? new Date(new Date(lastDay).getTime() - 6 * dayMs).toISOString().slice(0, 10) : "";
        const cut14 = lastDay ? new Date(new Date(lastDay).getTime() - 13 * dayMs).toISOString().slice(0, 10) : "";
        for (const x of (await r.json()).d || []) {
          const k = x[keyName]; if (!k) continue;
          const a = m.get(k) || { key: k, impressions: 0, clicks: 0, i7: 0, c7: 0, ip: 0, cp: 0, posW: 0, posI: 0 };
          const im = x.Impressions || 0, cl = x.Clicks || 0;
          a.impressions += im; a.clicks += cl;
          let d = ""; try { d = dOf(x); } catch {}
          if (d && d >= cut7) { a.i7 += im; a.c7 += cl; if (x.AvgImpressionPosition > 0) { a.posW += x.AvgImpressionPosition * im; a.posI += im; } }
          else if (d && d >= cut14) { a.ip += im; a.cp += cl; }
          m.set(k, a);
        }
        const all = [...m.values()];
        const clean = (a) => ({ key: a.key, impressions: a.impressions, clicks: a.clicks, i7: a.i7, c7: a.c7, ip: a.ip, cp: a.cp, pos: a.posI ? +(a.posW / a.posI).toFixed(1) : null });
        return {
          all: all.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 25).map(clean),
          win: all.filter(a => a.i7 || a.ip).sort((a, b) => b.c7 - a.c7 || b.i7 - a.i7).slice(0, 40).map(clean),
        };
      } catch { return { all: [], win: [] }; }
    };
    const [q, pg] = await Promise.all([agg("GetQueryStats", "Query"), agg("GetPageStats", "Query")]);
    const queries = q.all, pages = pg.all;
    // Crawl / index health (optional)
    let crawl = [];
    try {
      const r = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/GetCrawlStats?apikey=${key}&siteUrl=${site}`);
      if (r.ok) crawl = ((await r.json()).d || []).map(x => ({ date: dOf(x), crawled: x.CrawledPages || 0, inIndex: x.InIndex || 0, errors: (x.CrawlErrors || 0), c4xx: x.Code4xx || 0, c5xx: x.Code5xx || 0, blocked: x.BlockedByRobotsTxt || 0 }))
        .sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    } catch {}
    fs.writeFileSync(path.join(OUT_DIR, "bing-latest.json"), JSON.stringify({ fetchedAt: new Date().toISOString(), rows: rows.slice(-400), queries, pages, queriesWin: q.win, pagesWin: pg.win, crawl }, null, 2));
    console.log(`✓ Bing saved (${rows.length} days)`);
    return rows;
  } catch (e) {
    console.error("✗ Bing error (skipped):", e.message);
    return null;
  }
}

// ── Leads (Supabase contact_submissions) ─────────────────────────────────────
// Real lead = enquiry that is not system (DMARC etc.) / test / spam / bounced / archived / partnership / newsletter signup.
const IGNORE = new Set(["system", "test", "spam", "bounced", "archived"]);
const DONE = new Set(["replied", "call", "won", "lost"]);
// Automated senders (security codes, SaaS onboarding, newsletters): stored in contact_submissions via hi@ but never a lead.
const AUTO_DOMAIN = /(facebookmail|mail\.instagram|mail\.threads|instagram\.com|threads\.net|meta\.com|linkedin\.com|rb2b|retention\.com|ahrefs|zendesk|freshworks|freshdesk|google\.com|vercel|supabase|github|apify|stripe|namecheap|zoho|mailchimp|calendly|resend|dodolaunch|vibe-contributors)/i;
const AUTO_LOCAL = /^(no-?reply|notification|notifications|security|support|billing|news|newsletter|marketing|mailer-daemon|postmaster)/i;
function classify(r) {
  if (IGNORE.has(r.status)) return "ignore";
  if (r.form_type === "direct_email" && r.email && (AUTO_DOMAIN.test(r.email.split("@")[1] || "") || AUTO_LOCAL.test(r.email.split("@")[0] || ""))) return "ignore";
  if (r.status === "partnership") return "partner";
  if (r.form_type === "newsletter") return "sub";
  return "lead";
}
async function fetchLeads() {
  const url = process.env.SUPABASE_URL || "https://olsxxfwvwsycwzihbmdn.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/contact_submissions?select=created_at,form_type,status,replied_at,email&order=created_at.asc&limit=5000`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = (await res.json()).map(r => ({ ...r, t: new Date(r.created_at).getTime(), cls: classify(r) }));
    const now = Date.now(), wk = 7 * 864e5;
    const bucket = (from, to) => {
      const x = rows.filter(r => r.t >= from && r.t < to);
      const leads = x.filter(r => r.cls === "lead");
      return {
        leads: leads.length,
        ready: leads.filter(r => r.form_type === "ready").length,
        replied: leads.filter(r => DONE.has(r.status) || r.replied_at).length,
        waiting: leads.filter(r => r.status === "new").length,
        partner: x.filter(r => r.cls === "partner").length,
        subs: x.filter(r => r.cls === "sub").length,
      };
    };
    const all = bucket(0, Infinity), w1 = bucket(now - wk, Infinity), w0 = bucket(now - 2 * wk, now - wk);
    const waiting = rows.filter(r => r.cls === "lead" && r.status === "new").sort((a, b) => a.t - b.t);
    const days = rows.filter(r => r.cls === "lead" && r.replied_at).map(r => (new Date(r.replied_at).getTime() - r.t) / 864e5).sort((a, b) => a - b);
    return {
      all, w1, w0,
      oldestWaitingDays: waiting.length ? Math.floor((now - waiting[0].t) / 864e5) : 0,
      medianReplyDays: days.length ? days[Math.floor(days.length / 2)] : null,
      first: rows.find(r => r.cls === "lead")?.created_at || null,
    };
  } catch (e) {
    console.error("✗ Leads fetch error:", e.message);
    return null;
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const num = (n) => Math.round(n).toLocaleString("en-US");
const arrow = (cur, prev) => {
  if (!prev) return cur ? "▲ new" : "–";
  const d = (cur / prev - 1) * 100;
  if (Math.round(d) === 0) return "→ 0%";
  return `${d >= 0 ? "▲" : "▼"}${Math.abs(d).toFixed(0)}%`;
};
const row = (label, cur, prev, fmt = num) => `${label}: ${fmt(cur)} ${arrow(cur, prev)} (was ${fmt(prev)})`;
const iso = (d) => (d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}` : d);
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDay = (d) => `${+d.slice(8, 10)} ${MON[+d.slice(5, 7) - 1]}`;
const shortPath = (u) => { const p = u.replace(/^https?:\/\/[^/]+/, "") || "/"; return p.length > 46 ? p.slice(0, 45) + "…" : p; };
const TARGET = new Set(["usa", "gbr", "can", "aus", "nzl", "irl"]);

function buildReport(gsc, ga4, leads, bing, utm) {
  // ---- GSC: last 7 full days vs previous 7 ----
  const gd = gsc.dailyTrend;
  const g1 = gd.slice(-7), g0 = gd.slice(-14, -7);
  const gStats = (a) => {
    const imp = sum(a, d => d.impressions), clk = sum(a, d => d.clicks);
    return { imp, clk, ctr: imp ? clk / imp * 100 : 0, pos: imp ? sum(a, d => d.position * d.impressions) / imp : 0 };
  };
  const c1 = gStats(g1), c0 = gStats(g0), gTot = gStats(gd);

  // ---- GA4: last 7 vs previous 7 ----
  const ad = ga4.dailyTrend.map(d => ({ date: iso(d.dimensionValues[0].value), sessions: +d.metricValues[0].value, users: +d.metricValues[1].value }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const a1 = ad.slice(-7), a0 = ad.slice(-14, -7);
  const wk1 = new Set(a1.map(d => d.date)), wk0 = new Set(a0.map(d => d.date));
  const chan = (ga4.dailyChannels || []).map(r => ({ date: iso(r.dimensionValues[0].value), ch: r.dimensionValues[1].value, s: +r.metricValues[0].value }));
  const chSum = (dates, ch) => sum(chan.filter(r => dates.has(r.date) && (ch === null || r.ch === ch)), r => r.s);
  const s1 = sum(a1, d => d.sessions), s0 = sum(a0, d => d.sessions);
  const u1 = sum(a1, d => d.users), u0 = sum(a0, d => d.users);
  const hasChan = chan.length > 0;
  const direct1 = hasChan ? chSum(wk1, "Direct") : 0;
  const real1 = hasChan ? s1 - direct1 : s1, real0 = hasChan ? s0 - chSum(wk0, "Direct") : s0;
  const directShare1 = s1 ? direct1 / s1 * 100 : 0;

  const ov = ga4.overview.rows?.[0]?.metricValues || [];
  const bounce = ov[3] ? (parseFloat(ov[3].value) * 100).toFixed(0) : "–";
  const avgSec = ov[4] ? Math.round(parseFloat(ov[4].value)) : 0;

  // leads (GA4 events): date_range_0 = last 7, date_range_1 = previous 7
  const ev = ga4.events || [];
  const evCount = (name, r) => sum(ev.filter(x => x.dimensionValues[0].value === name && x.dimensionValues[1]?.value === `date_range_${r}`), x => +x.metricValues[0].value);
  const evLead = (r) => evCount("contact_form_submitted", r) + evCount("generate_lead", r) + evCount("form_submit", r);
  const leads1 = leads ? leads.w1.leads : evLead(0), leads0 = leads ? leads.w0.leads : evLead(1);

  // ---- Movers & opportunities (GSC weekly) ----
  const wkd = gsc.weekly;
  const toMap = (rows) => new Map((rows || []).map(r => [r.keys[0], r]));
  let movers = "", pageOpps = "", queryOpps = "";
  const why = [], recs = [];
  let topOppPage = null, topOppQuery = null, topLoser = null, lowShareDilution = false;
  if (wkd) {
    const p1 = toMap(wkd.pagesW1), p0 = toMap(wkd.pagesW0);
    const diffs = [...new Set([...p1.keys(), ...p0.keys()])].map(k => ({ k, d: (p1.get(k)?.impressions || 0) - (p0.get(k)?.impressions || 0), cur: p1.get(k)?.impressions || 0 }));
    const up = diffs.filter(x => x.d > 0).sort((a, b) => b.d - a.d).slice(0, 2);
    const down = diffs.filter(x => x.d < 0).sort((a, b) => a.d - b.d).slice(0, 2);
    const fmtM = (x) => `  ${x.d > 0 ? "▲ +" : "▼ "}${num(x.d)}  ${shortPath(x.k)}`;
    if (up.length || down.length) movers = ["", "📈 PAGE MOVERS (impressions)", ...up.map(fmtM), ...down.map(fmtM)].join("\n");

    const po = (wkd.pagesW1 || []).filter(r => r.impressions >= 30 && r.ctr < 0.015 && r.position <= 12)
      .sort((a, b) => b.impressions - a.impressions).slice(0, 2)
      .map(r => `  • ${shortPath(r.keys[0])}\n    ${r.impressions} imp · CTR ${(r.ctr * 100).toFixed(1)}% · pos ${r.position.toFixed(1)}`);
    if (po.length) pageOpps = ["", "✏️ FIX TITLES (ranking well, nobody clicks)", ...po].join("\n");

    const qo = (wkd.queriesW1 || []).filter(r => r.position >= 8 && r.position <= 20 && r.impressions >= 8)
      .sort((a, b) => b.impressions - a.impressions).slice(0, 2)
      .map(r => `  • "${r.keys[0].slice(0, 40)}" — pos ${r.position.toFixed(1)}, ${r.impressions} imp`);
    if (qo.length) queryOpps = ["", "🎯 ALMOST TOP 10 (position 8–20)", ...qo].join("\n");

    // ---- WHY: explain the movement with numbers ----
    topOppPage = (wkd.pagesW1 || []).filter(r => r.impressions >= 30 && r.ctr < 0.015 && r.position <= 12).sort((a, b) => b.impressions - a.impressions)[0] || null;
    topOppQuery = (wkd.queriesW1 || []).filter(r => r.position >= 8 && r.position <= 20 && r.impressions >= 8).sort((a, b) => b.impressions - a.impressions)[0] || null;
    topLoser = down[0] || null;

    const newP = [...p1.keys()].filter(k => !p0.has(k)), lostP = [...p0.keys()].filter(k => !p1.has(k));
    const newImp = sum(newP, k => p1.get(k).impressions), lostImp = sum(lostP, k => p0.get(k).impressions);
    if (c1.imp !== c0.imp || newP.length || lostP.length) {
      why.push(`Impressions ${arrow(c1.imp, c0.imp)}: ${newP.length} pages started appearing (+${num(newImp)}), ${lostP.length} dropped out (−${num(lostImp)})` +
        (up[0] ? `; top gain ${shortPath(up[0].k)}` : "") + (down[0] ? `, top loss ${shortPath(down[0].k)}` : "") + ".");
    }

    // position: is it dilution by low-ranking pages, or did good pages slip?
    const lowShare = (m) => { const t = sum([...m.values()], r => r.impressions); return t ? sum([...m.values()].filter(r => r.position > 20), r => r.impressions) / t * 100 : 0; };
    const topPos = (m) => { const rs = [...m.values()].filter(r => r.position <= 20); const t = sum(rs, r => r.impressions); return t ? sum(rs, r => r.position * r.impressions) / t : 0; };
    const ls1 = lowShare(p1), ls0 = lowShare(p0), tp1 = topPos(p1), tp0 = topPos(p0);
    if (Math.abs(c1.pos - c0.pos) >= 1.5) {
      if (ls1 - ls0 >= 5 && c1.pos > c0.pos) {
        lowShareDilution = true;
        why.push(`Position ${c0.pos.toFixed(1)} → ${c1.pos.toFixed(1)}: ${ls1.toFixed(0)}% of impressions now come from pages ranking below #20 (was ${ls0.toFixed(0)}%). Pages inside top 20 ${Math.abs(tp1 - tp0) < 1.5 ? "held steady" : "moved"} (${tp0.toFixed(1)} → ${tp1.toFixed(1)}), check the page movers below.`);
      } else {
        why.push(`Position ${c0.pos.toFixed(1)} → ${c1.pos.toFixed(1)}: pages inside top 20 went ${tp0.toFixed(1)} → ${tp1.toFixed(1)}.`);
      }
    }

    // clicks: brand vs non-brand
    const brand = (rows) => sum((rows || []).filter(r => /datalat+e?/i.test(r.keys[0])), r => r.clicks);
    const b1 = brand(wkd.queriesW1), b0 = brand(wkd.queriesW0);
    if (c1.clk || c0.clk) {
      why.push(`Clicks ${arrow(c1.clk, c0.clk)}: brand searches ("datalatte") gave ${b1} of ${c1.clk} clicks (was ${b0} of ${c0.clk}); non-brand clicks ${c1.clk - b1} vs ${c0.clk - b0}.`);
    }
  }
  if (hasChan) {
    const dD = direct1 - chSum(wk0, "Direct"), dS = s1 - s0;
    if (dS > 0 && dD > 0) why.push(`Sessions ${arrow(s1, s0)}: ${(dD / dS * 100).toFixed(0)}% of the growth is Direct (bot-like). Real traffic ${real0} → ${real1}.`);
    else if (dS < 0) why.push(`Sessions ${arrow(s1, s0)}: Direct ${dD >= 0 ? "+" : ""}${dD}, real traffic ${real0} → ${real1}.`);
  }

  // ---- Geo: share of impressions outside target markets ----
  const cs = gsc.countries || [];
  const totalC = sum(cs, c => c.impressions);
  const offTarget = totalC ? sum(cs.filter(c => !TARGET.has(c.keys[0])), c => c.impressions) / totalC * 100 : 0;

  // ---- Recommendations: specific, tied to the data above ----
  if (topOppPage) recs.push(`Rewrite title + meta for ${shortPath(topOppPage.keys[0])} (${topOppPage.impressions} imp, ${(topOppPage.ctr * 100).toFixed(1)}% CTR at pos ${topOppPage.position.toFixed(1)}): add the exact query, a number and the year.`);
  if (topOppQuery) recs.push(`Push "${topOppQuery.keys[0].slice(0, 40)}" (pos ${topOppQuery.position.toFixed(1)}) into top 10: expand that article and add 3 internal links to it.`);
  if (topLoser && -topLoser.d >= 20) recs.push(`Check ${shortPath(topLoser.k)} (−${num(-topLoser.d)} imp): refresh content and date, confirm it is still indexed.`);
  if (lowShareDilution) recs.push("Pause mass publishing; improve and interlink existing pages ranking 8–20 before adding new ones.");
  if (hasChan && directShare1 > 80) recs.push("Filter bot traffic in GA4 (exclude known bots/internal) and add bot protection, otherwise sessions are not trustworthy.");
  if (leads && leads.all.waiting > 0) recs.unshift(`Reply to ${leads.all.waiting} unanswered lead(s) — oldest waiting ${leads.oldestWaitingDays} days. Speed of reply decides who wins the client.`);
  if (leads1 === 0) recs.push("Zero new leads this week: add a CTA block (free audit) to the top real-traffic pages and check the /contact form works.");
  if (offTarget > 40) recs.push(`${offTarget.toFixed(0)}% of impressions come from non-target countries: shift content toward US/UK/CA/AU niches (coffee, salons, groomers, fitness).`);

  // ---------- presentation (Telegram HTML, plain English) ----------
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const pad = (v, n) => String(v).padStart(n);
  const lab = (t, n = 22) => String(t).padEnd(n);
  const pctOf = (a, b) => (b ? a / b * 100 : 0);
  const fp = (v, d = 1) => v.toFixed(d).replace(/\.0+$/, "") + "%";
  const pre = (lines) => `<pre>${esc(lines.join("\n"))}</pre>`;
  const flag = (cur, prev) => { if (!prev) return cur ? "🟢" : "⚪"; const d = (cur / prev - 1) * 100; return d > 5 ? "🟢" : d < -5 ? "🔴" : "⚪"; };
  const chg = (cur, prev) => { if (!prev) return cur ? "new" : "–"; const d = (cur / prev - 1) * 100; return `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(0)}%`; };
  const wrow = (name, cur, prev, f = num) => `${lab(name)}${pad(f(cur), 8)}${pad(f(prev), 9)}${pad(chg(cur, prev), 7)} ${flag(cur, prev)}`;

  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const periodTxt = `${fmtDay(g1[0].keys[0])} – ${fmtDay(g1[g1.length - 1].keys[0])}`;

  // ---- all-time sources ----
  const gAll = gsc.allDaily || [];
  const gImpAll = sum(gAll, d => d.impressions), gClkAll = sum(gAll, d => d.clicks);
  const gPosAll = gImpAll ? sum(gAll, d => d.position * d.impressions) / gImpAll : 0;
  const bAll = bing && bing.length ? { imp: sum(bing, d => d.impressions), clk: sum(bing, d => d.clicks) } : null;
  const SPIKE = 2000; // one day x channel above this is a one-day spam burst (e.g. 6 Jun)
  const ch = ga4.allTimeChannels || [];
  const sessAll = sum(ch, r => r.s);
  const botsAll = sum(ch.filter(r => r.ch === "Direct"), r => r.s);
  const spamAll = sum(ch.filter(r => r.ch !== "Direct" && r.s > SPIKE), r => r.s);
  const realAll = sessAll - botsAll - spamAll;
  const byCh = {};
  ch.filter(r => r.ch !== "Direct" && r.s <= SPIKE).forEach(r => { byCh[r.ch] = (byCh[r.ch] || 0) + r.s; });
  const chTxt = Object.entries(byCh).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k.replace("Organic Search", "search")} ${num(v)}`).join(", ");
  const evR = ga4.allTimeEventsReal || {};
  const formStarts = evR.form_start || 0;
  const ctaAll = (evR.free_audit_clicked || 0) + (evR.contact_cta_clicked || 0) + (evR.book_call_clicked || 0);
  const searchImp = gImpAll + (bAll ? bAll.imp : 0), searchClk = gClkAll + (bAll ? bAll.clk : 0);
  const launch = gAll.length ? fmtDay(gAll[0].d) : "launch";
  const A = leads ? leads.all : null;

  // Mobile-friendly layout: no <pre> tables (they wrap on a phone), one metric per line, each number appears once.
  const hdr = (t) => [`<b>${t}</b>`, `<i>${esc(date)}</i>`, ""];
  const sec = (t, sub = "") => `<b>━━ ${t} ━━</b>${sub ? ` <i>${esc(sub)}</i>` : ""}`;
  const mr = (name, cur, prev, f = num) => `${flag(cur, prev)} ${esc(name)}: <b>${f(cur)}</b> · was ${f(prev)} (${chg(cur, prev)})`;
  const org1 = hasChan ? chSum(wk1, "Organic Search") : 0, org0 = hasChan ? chSum(wk0, "Organic Search") : 0;
  const shortLine = (t) => esc(String(t).trim());

  // ================= SUMMARY (topic: weekly): funnel + leads + 3 headline numbers =================
  const S = hdr("🗓 DAILY SUMMARY");
  S.push(sec("ALL TIME", `since ${launch}`));
  const funnel = [["👁 Seen in search", searchImp], ["🖱 Clicked to the site", searchClk], ["🧑 Real visitors", realAll], ["🔘 Clicked a button", ctaAll], ["📝 Started the form", formStarts], ["✅ Became a lead", A ? A.leads : 0]];
  S.push(...funnel.filter(x => x[1] > 0 || x[0].includes("lead")).map(([n, v]) => `${n}: <b>${num(v)}</b>`));
  if (A) S.push(`<i>Visitor → lead ${fp(pctOf(A.leads, realAll))} · click rate in search ${fp(pctOf(searchClk, searchImp), 2)}</i>`, "");
  if (A) S.push(`<b>Leads</b>: answered <b>${A.replied}</b> (${fp(pctOf(A.replied, A.leads), 0)}) · waiting <b>${A.waiting}</b>${A.waiting ? ` (oldest ${leads.oldestWaitingDays}d ⚠️)` : ""} · partnership requests ${A.partner} · newsletter ${A.subs}`, "");
  S.push(sec("LAST 7 DAYS", periodTxt), mr("Real visitors", real1, real0), mr("Google clicks", c1.clk, c0.clk), ...(leads ? [mr("New leads", leads.w1.leads, leads.w0.leads)] : []), "");
  const concl = [];
  const dImp = c0.imp ? (c1.imp / c0.imp - 1) * 100 : 0, dClk = c0.clk ? (c1.clk / c0.clk - 1) * 100 : 0;
  concl.push(`Google showed the site ${Math.abs(dImp) < 5 ? "about as often" : dImp > 0 ? "more often" : "less often"} (${chg(c1.imp, c0.imp)}); clicks ${dClk < -5 ? "fell" : dClk > 5 ? "grew" : "stayed flat"} (${chg(c1.clk, c0.clk)}).`);
  concl.push(`${num(real1)} real visitors (${chg(real1, real0)}); ${leads ? (leads.w1.leads ? `${leads.w1.leads} new lead(s).` : "no new leads.") : ""}`);
  if (leads && A.waiting) concl.push(`⚠️ ${A.waiting} lead(s) wait for your reply, the oldest ${leads.oldestWaitingDays} days.`);
  S.push(sec("CONCLUSION"), ...concl.map(t => `• ${shortLine(t)}`), "", `<i>Details: SEO · Traffic topics. Bots (${num(direct1)} sessions) are excluded everywhere.</i>`);

  // ================= SEO (topic: seo): Google + Bing only =================
  const E = hdr("🔎 SEO · GOOGLE + BING");
  E.push(sec("ALL TIME", `since ${launch}`));
  E.push(`Google shown: <b>${num(gImpAll)}</b>`, `Google clicks: <b>${num(gClkAll)}</b> (${fp(pctOf(gClkAll, gImpAll), 2)})`, `Average position: <b>${gPosAll.toFixed(1)}</b> <i>(lower is better)</i>`);
  if (bAll) E.push(`Bing shown: <b>${num(bAll.imp)}</b>`, `Bing clicks: <b>${num(bAll.clk)}</b> (${fp(pctOf(bAll.clk, bAll.imp), 2)})`);
  E.push("", sec("LAST 7 DAYS", periodTxt), mr("Google shown", c1.imp, c0.imp), mr("Google clicks", c1.clk, c0.clk));
  if (bing && bing.length >= 14) E.push(mr("Bing shown", sum(bing.slice(-7), d => d.impressions), sum(bing.slice(-14, -7), d => d.impressions)), mr("Bing clicks", sum(bing.slice(-7), d => d.clicks), sum(bing.slice(-14, -7), d => d.clicks)));
  E.push(`Position: <b>${c1.pos.toFixed(1)}</b> · was ${c0.pos.toFixed(1)}`, "");
  const whySearch = why.filter(w => /^(Impressions|Position|Clicks)/.test(w));
  if (whySearch.length) E.push(sec("WHY IT MOVED"), ...whySearch.map(t => `• ${shortLine(t)}`), "");
  for (const blk of [movers, pageOpps, queryOpps]) if (blk) E.push(...blk.split("\n").filter(Boolean).map(l => shortLine(l.replace(/^\s+/, l.trim().startsWith("•") ? "" : ""))), "");
  if (bing && bing.length >= 14) {
    const bc1 = sum(bing.slice(-7), d => d.clicks), bc0 = sum(bing.slice(-14, -7), d => d.clicks);
    const bCtr = bAll ? pctOf(bAll.clk, bAll.imp) : 0, gCtr = pctOf(gClkAll, gImpAll);
    E.push(`• Bing: ${bc1} clicks (${chg(bc1, bc0)}); people click there ${bCtr > gCtr * 1.3 ? `${(bCtr / gCtr).toFixed(1)}× more often than on Google` : "about as often as on Google"}.`);
  }

  // ================= TRAFFIC (topic: traffic): GA4 only =================
  const T = hdr("🌐 TRAFFIC · GA4");
  T.push(sec("ALL TIME", `since ${launch}`));
  T.push(`All sessions: <b>${num(sessAll)}</b>`, `🧑 Real visitors: <b>${num(realAll)}</b> <i>(${esc(chTxt)})</i>`, `🤖 Bots and one-day spam (ignored): <b>${num(botsAll + spamAll)}</b>`, `🔘 Buttons clicked: <b>${num(ctaAll)}</b> · 📝 form started: <b>${num(formStarts)}</b>`, "");
  const chNow = hasChan ? [...new Set(chan.filter(r => wk1.has(r.date) && r.ch !== "Direct").map(r => r.ch))].sort((a, b) => chSum(wk1, b) - chSum(wk1, a)).slice(0, 5) : [];
  T.push(sec("LAST 7 DAYS", periodTxt), mr("Real visitors", real1, real0));
  for (const c of chNow) T.push(`   ${mr(c, chSum(wk1, c), chSum(wk0, c))}`);
  if (utm) {
    const keys = [...new Set([...Object.keys(utm.w1), ...Object.keys(utm.w0)])].sort((a, b) => (utm.w1[b] || 0) - (utm.w1[a] || 0));
    if (keys.length) T.push("", `🔗 <b>From our posts (UTM)</b>: ` + keys.map(k => `${esc(k)} <b>${utm.w1[k] || 0}</b> (was ${utm.w0[k] || 0})`).join(" · "));
  }
  const whyTraffic = why.filter(w => /^Sessions/.test(w));
  if (whyTraffic.length) T.push("", sec("WHY IT MOVED"), ...whyTraffic.map(t => `• ${shortLine(t)}`));

  // ================= RECOMMENDATIONS (topic: recs) =================
  const R = [`<b>🎯 WHAT TO DO · SITE & SEO</b>`, `<i>${esc(date)}</i>`, "", ...recs.slice(0, 5).map((t, i) => `${i + 1}. ${esc(t)}`)];
  return { weekly: S.join("\n"), seo: E.join("\n"), traffic: T.join("\n"), recs: recs.length ? R.join("\n") : null };
}

async function sendTelegramReport() {
  const sbUrl = process.env.SUPABASE_URL || "https://olsxxfwvwsycwzihbmdn.supabase.co";
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const gsc = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "gsc-latest.json"), "utf8"));
  const ga4 = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "ga4-latest.json"), "utf8"));
  let bing = null;
  try { bing = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "bing-latest.json"), "utf8")).rows; } catch { /* optional */ }

  // UTM sessions from our social posts: last 7 days vs previous 7 (Supabase social_utm_daily)
  let utm = null;
  if (sbKey) {
    try {
      const since = new Date(Date.now() - 15 * 864e5).toISOString().slice(0, 10);
      const r = await fetch(`${sbUrl}/rest/v1/social_utm_daily?select=day,source,sessions&day=gte.${since}`, { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` } });
      if (r.ok) {
        const rows = await r.json(); const cut = new Date(Date.now() - 8 * 864e5).toISOString().slice(0, 10);
        utm = { w1: {}, w0: {} };
        for (const x of rows) { const w = x.day >= cut ? utm.w1 : utm.w0; w[x.source] = (w[x.source] || 0) + x.sessions; }
      }
    } catch { /* optional */ }
  }
  const rep = buildReport(gsc, ga4, await fetchLeads(), bing, utm);

  // Preferred: forum topics through the tg-report edge function (service role only)
  const sections = [["weekly", rep.weekly], ["seo", rep.seo], ["traffic", rep.traffic], ["recs", rep.recs]].filter(x => x[1]);
  let sent = 0;
  if (sbKey) {
    for (const [topic, text] of sections) {
      try {
        const r = await fetch(`${sbUrl}/functions/v1/tg-report`, { method: "POST", headers: { Authorization: `Bearer ${sbKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ topic, text: text.slice(0, 3900) }) });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.ok) sent++; else console.error(`✗ topic ${topic}:`, j.error || r.status);
      } catch (e) { console.error(`✗ topic ${topic}:`, e.message); }
    }
    if (sent) { console.log(`✓ Telegram topic reports sent: ${sent}/${sections.length}`); return; }
  }

  // Fallback: single message to the old chat
  const tgToken = process.env.TELEGRAM_BOT_TOKEN, tgChat = process.env.TELEGRAM_CHAT_ID;
  if (!tgToken || !tgChat) { console.log("No Telegram target configured — skipping report"); return; }
  const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: tgChat, text: [rep.weekly, rep.seo, rep.traffic].join("\n\n").slice(0, 4000), parse_mode: "HTML", disable_web_page_preview: true }) });
  console.log(res.ok ? "✓ Telegram report sent (fallback chat)" : `✗ Telegram error: ${res.status}`);
}

if (require.main === module) main();
module.exports = { buildReport, fetchLeads };
