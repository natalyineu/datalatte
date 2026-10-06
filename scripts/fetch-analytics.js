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

  return {
    fetchedAt: new Date().toISOString(),
    period: { startDate, endDate },
    propertyId,
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
    // Top queries / pages (Bing returns per-day rows; aggregate by key over the window it gives us)
    const agg = async (method, keyName) => {
      try {
        const r = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/${method}?apikey=${key}&siteUrl=${site}`);
        if (!r.ok) return [];
        const m = new Map();
        for (const x of (await r.json()).d || []) {
          const k = x[keyName]; if (!k) continue;
          const a = m.get(k) || { key: k, impressions: 0, clicks: 0 };
          a.impressions += x.Impressions || 0; a.clicks += x.Clicks || 0; m.set(k, a);
        }
        return [...m.values()].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 25);
      } catch { return []; }
    };
    const [queries, pages] = await Promise.all([agg("GetQueryStats", "Query"), agg("GetPageStats", "Query")]);
    fs.writeFileSync(path.join(OUT_DIR, "bing-latest.json"), JSON.stringify({ fetchedAt: new Date().toISOString(), rows: rows.slice(-400), queries, pages }, null, 2));
    console.log(`✓ Bing saved (${rows.length} days)`);
    return rows;
  } catch (e) {
    console.error("✗ Bing error (skipped):", e.message);
    return null;
  }
}

// ── Leads (Supabase contact_submissions) ─────────────────────────────────────
// Real lead = enquiry that is not test / spam / bounced / partnership / newsletter signup.
const IGNORE = new Set(["test", "spam", "bounced"]);
const DONE = new Set(["replied", "call", "won", "lost"]);
function classify(r) {
  if (IGNORE.has(r.status)) return "ignore";
  if (r.status === "partnership") return "partner";
  if (r.form_type === "newsletter") return "sub";
  return "lead";
}
async function fetchLeads() {
  const url = process.env.SUPABASE_URL || "https://olsxxfwvwsycwzihbmdn.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/contact_submissions?select=created_at,form_type,status,replied_at&order=created_at.asc&limit=5000`,
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

function buildReport(gsc, ga4, leads, bing) {
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

  // ---------- presentation (Telegram HTML) ----------
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const SP = "▁▂▃▄▅▆▇█";
  const spark = (a) => { const m = Math.max(...a, 1); return a.map(v => SP[Math.min(7, Math.round((v / m) * 7))]).join(""); };
  const pad = (v, n) => String(v).padStart(n);
  const lab = (t, n = 15) => String(t).padEnd(n);
  const pctOf = (a, b) => (b ? (a / b * 100) : 0);
  const fp = (v) => (v >= 10 ? v.toFixed(0) : v.toFixed(1)) + "%";
  const tbl = (head, rows) => `<pre>${esc([head, ...rows].join("\n"))}</pre>`;

  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const periodTxt = `${fmtDay(g1[0].keys[0])} – ${fmtDay(g1[g1.length - 1].keys[0])}`;

  // ---- all-time (since launch) ----
  const gAll = gsc.allDaily || [];
  const allImp = sum(gAll, d => d.impressions), allClk = sum(gAll, d => d.clicks);
  const allSessRows = ga4.allTimeChannels || [];
  const SPIKE = 2000; // single day x channel above this is a one-day spam burst (e.g. 6 Jun)
  const allReal = sum(allSessRows.filter(r => r.ch !== "Direct" && r.s <= SPIKE), r => r.s);
  const allDirect = sum(allSessRows.filter(r => r.ch === "Direct"), r => r.s);
  const launch = gAll.length ? fmtDay(gAll[0].d) : "launch";

  // ---- weekly sparklines (last 8 weeks) ----
  const weeklySeries = (key) => {
    const m = new Map();
    for (const d of gAll) {
      const t = new Date(d.d + "T00:00:00Z"); const dow = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - dow);
      const k = t.toISOString().slice(0, 10); m.set(k, (m.get(k) || 0) + d[key]);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-9, -1).map(x => x[1]); // drop the current partial week
  };
  const sparkImp = gAll.length > 14 ? spark(weeklySeries("impressions")) : "";
  const sparkClk = gAll.length > 14 ? spark(weeklySeries("clicks")) : "";

  const L = [];
  L.push(`<b>📊 DATALATTE WEEKLY</b>`, `<i>${esc(periodTxt)} · compared with the previous 7 days · ${esc(date)}</i>`, "");

  // ---- LEADS ----
  if (leads) {
    const A = leads.all, W1 = leads.w1, W0 = leads.w0;
    const convW = real1 ? W1.leads / real1 * 100 : 0, convAll = allReal ? A.leads / allReal * 100 : 0;
    L.push(`<b>🎯 LEADS</b>`);
    L.push(tbl("                This wk  Prev wk  All time", [
      `${lab("Leads")}${pad(W1.leads, 7)}${pad(W0.leads, 9)}${pad(A.leads, 10)}`,
      `${lab("  ready to start")}${pad(W1.ready, 7)}${pad("", 9)}${pad(A.ready, 10)}`,
      `${lab("  answered")}${pad(W1.replied, 7)}${pad(W0.replied, 9)}${pad(`${A.replied} (${fp(pctOf(A.replied, A.leads))})`, 10)}`,
      `${lab("  waiting reply")}${pad(W1.waiting, 7)}${pad("", 9)}${pad(A.waiting, 10)}`,
      `${lab("Partnerships")}${pad(W1.partner, 7)}${pad(W0.partner, 9)}${pad(A.partner, 10)}`,
      `${lab("Newsletter subs")}${pad(W1.subs, 7)}${pad(W0.subs, 9)}${pad(A.subs, 10)}`,
    ]));
    L.push(`<b>Conversion</b> (real visitor → lead): <b>${fp(convW)}</b> this week · <b>${fp(convAll)}</b> since launch`);
    L.push(`<i>${num(allReal)} real visitors and ${A.leads} leads since ${esc(launch)}</i>`);
    if (A.waiting) L.push(`⚠️ <b>${A.waiting} lead(s) waiting for a reply</b>, oldest ${leads.oldestWaitingDays}d`);
    L.push("");
  }

  // ---- FUNNEL ----
  if (ev.length) {
    const e = (n, r) => evCount(n, r);
    const ctaNames = ["free_audit_clicked", "contact_cta_clicked", "book_call_clicked", "email_link_clicked", "phone_link_clicked"];
    const cta = (r) => sum(ctaNames, n => e(n, r));
    const stages = [["Real visitors", real1], ["Scrolled 50%", e("scroll_50", 0) || null], ["Clicked a CTA", cta(0)], ["Started the form", e("form_start", 0)], ["Became a lead", leads ? leads.w1.leads : leads1]].filter(x => x[1] !== null);
    const top = Math.max(...stages.map(x => x[1]), 1);
    L.push(`<b>🔁 VISITOR FUNNEL (last 7 days)</b>`);
    L.push(`<pre>${esc(stages.map(([n, v]) => `${lab(n, 17)}${pad(num(v), 5)}  ${"█".repeat(Math.max(v ? 1 : 0, Math.round(v / top * 12)))}`).join("\n"))}</pre>`, "");
  }

  // ---- SEARCH ----
  const bz = (bing && bing.length >= 14) ? (() => { const b1 = sum(bing.slice(-7), d => d.clicks), b0 = sum(bing.slice(-14, -7), d => d.clicks); return { b1, b0 }; })() : null;
  L.push(`<b>🔍 SEARCH</b>`);
  L.push(tbl("                This wk  Prev wk       Δ", [
    `${lab("Impressions")}${pad(num(c1.imp), 7)}${pad(num(c0.imp), 9)}${pad(arrow(c1.imp, c0.imp), 8)}`,
    `${lab("Clicks")}${pad(num(c1.clk), 7)}${pad(num(c0.clk), 9)}${pad(arrow(c1.clk, c0.clk), 8)}`,
    `${lab("CTR")}${pad(c1.ctr.toFixed(2) + "%", 7)}${pad(c0.ctr.toFixed(2) + "%", 9)}${pad("", 8)}`,
    `${lab("Avg position")}${pad(c1.pos.toFixed(1), 7)}${pad(c0.pos.toFixed(1), 9)}${pad(c1.pos < c0.pos ? "▲ better" : "▼ worse", 8)}`,
    ...(bz ? [`${lab("Bing clicks")}${pad(bz.b1, 7)}${pad(bz.b0, 9)}${pad(arrow(bz.b1, bz.b0), 8)}`] : []),
  ]));
  if (sparkImp) L.push(`8 weeks  impressions ${sparkImp}   clicks ${sparkClk}`);
  L.push(`<i>Since launch: ${num(allImp)} impressions · ${num(allClk)} clicks · CTR ${fp(pctOf(allClk, allImp))}</i>`, "");

  // ---- TRAFFIC ----
  L.push(`<b>🌐 TRAFFIC (GA4)</b>`);
  if (hasChan) {
    L.push(tbl("                This wk  Prev wk       Δ", [
      `${lab("Real visitors")}${pad(num(real1), 7)}${pad(num(real0), 9)}${pad(arrow(real1, real0), 8)}`,
      `${lab("  organic")}${pad(chSum(wk1, "Organic Search"), 7)}${pad(chSum(wk0, "Organic Search"), 9)}${pad(arrow(chSum(wk1, "Organic Search"), chSum(wk0, "Organic Search")), 8)}`,
      `${lab("  AI assistants")}${pad(chSum(wk1, "AI Assistant"), 7)}${pad(chSum(wk0, "AI Assistant"), 9)}${pad(arrow(chSum(wk1, "AI Assistant"), chSum(wk0, "AI Assistant")), 8)}`,
      `${lab("Bots (Direct)")}${pad(num(direct1), 7)}${pad(num(chSum(wk0, "Direct")), 9)}${pad(arrow(direct1, chSum(wk0, "Direct")), 8)}`,
    ]));
  } else {
    L.push(tbl("                This wk  Prev wk       Δ", [`${lab("Sessions")}${pad(num(s1), 7)}${pad(num(s0), 9)}${pad(arrow(s1, s0), 8)}`]));
  }
  L.push(`<i>Since launch: ${num(allReal)} real visitors vs ${num(allDirect)} bot-like Direct sessions</i>`, "");

  // ---- WHY / DO ----
  if (why.length) L.push(`<b>💡 WHY IT MOVED</b>`, ...why.slice(0, 3).map(t => `• ${esc(t)}`), "");
  if (movers) L.push(`<b>📈 PAGE MOVERS</b>`, `<pre>${esc(movers.split("\n").slice(2).join("\n"))}</pre>`, "");
  if (recs.length) L.push(`<b>⚡ DO THIS WEEK</b>`, ...recs.slice(0, 4).map((t, i) => `${i + 1}. ${esc(t)}`));
  return L.join("\n");
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
  let bing = null;
  try { bing = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "bing-latest.json"), "utf8")).rows; } catch { /* optional */ }
  const msg = buildReport(gsc, ga4, await fetchLeads(), bing);

  const body = JSON.stringify({ chat_id: tgChat, text: msg.slice(0, 4000), parse_mode: "HTML", disable_web_page_preview: true });
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
module.exports = { buildReport, fetchLeads };
