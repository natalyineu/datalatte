import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/crm";
import { getChecklist } from "@/lib/checklists";

const RESEND_API_KEY      = process.env.RESEND_API_KEY!;
const RESEND_AUDIENCE_ID  = process.env.RESEND_AUDIENCE_ID;
const TELEGRAM_BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID    = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


// ── Budget-calculator result (sent from the client, so every value is sanitised) ──
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
function num(v: unknown, max = 1e9): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
}
function str(v: unknown, len = 120): string {
  return typeof v === "string" ? escapeHtml(v.slice(0, len)) : "";
}

interface CalcResult {
  niche: string; goal: string; revenue: number; budget: number;
  channels: { label: string; pct: number; amount: number }[];
  estimates: { label: string; amount: number; cpl: number; benchLabel: string; leads: number; customers: number }[];
  customerValue: number; closeRate: number;
}

function parseResult(raw: unknown): CalcResult | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const budget = num(r.budget, 1e7);
  if (!budget) return null;
  const arr = (v: unknown) => (Array.isArray(v) ? v.slice(0, 8) : []);
  return {
    niche: str(r.niche, 40), goal: str(r.goal, 60), revenue: num(r.revenue, 1e8), budget,
    channels: arr(r.channels).map((c: any) => ({ label: str(c?.label, 40), pct: num(c?.pct, 100), amount: num(c?.amount, 1e7) })),
    estimates: arr(r.estimates).map((e: any) => ({
      label: str(e?.label, 40), amount: num(e?.amount, 1e7), cpl: num(e?.cpl, 1e5), benchLabel: str(e?.benchLabel, 120),
      leads: num(e?.leads, 1e6), customers: num(e?.customers, 1e6),
    })),
    customerValue: num(r.customerValue, 1e7), closeRate: num(r.closeRate, 100),
  };
}

function resultEmailHtml(r: CalcResult): string {
  const td = 'style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#333"';
  const tdr = 'style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#333;text-align:right;font-weight:700"';
  const rows = r.channels.map(c => `<tr><td ${td}>${c.label} <span style="color:#888;font-size:12px">${Math.round(c.pct)}%</span></td><td ${tdr}>${money(c.amount)}</td></tr>`).join("");
  const est = r.estimates.map(e => `<tr><td ${td}>${e.label} · ${money(e.amount)}<br><span style="color:#888;font-size:12px">at $${e.cpl.toFixed(2)} per lead: ${e.benchLabel}</span></td><td ${tdr}>≈ ${e.leads} leads<br>≈ ${e.customers} customers</td></tr>`).join("");
  const custs = r.estimates.reduce((s, e) => s + e.customers, 0);
  const spend = r.estimates.reduce((s, e) => s + e.amount, 0);
  const back = spend > 0 ? ((custs * r.customerValue) / spend).toFixed(1) : "0.0";
  return `
    <div style="background:#5c3317;color:#fff;border-radius:14px;padding:20px 22px;margin:18px 0">
      <div style="font-size:13px;color:#e8d5c0">Your recommended monthly marketing budget${r.niche ? ` (${r.niche})` : ""}</div>
      <div style="font-size:34px;font-weight:700;margin:4px 0">${money(r.budget)}</div>
      ${r.revenue ? `<div style="font-size:13px;color:#e8d5c0">~${Math.round((r.budget / r.revenue) * 100)}% of your ${money(r.revenue)}/month revenue${r.goal ? ` · goal: ${r.goal}` : ""}</div>` : ""}
    </div>
    <h3 style="color:#5c3317;margin:22px 0 4px;font-size:16px">Budget by channel</h3>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    ${est ? `
    <h3 style="color:#5c3317;margin:24px 0 4px;font-size:16px">What your paid budget could buy</h3>
    <p style="font-size:12px;color:#888;margin:0 0 6px">Your assumptions: a new customer is worth ${money(r.customerValue)} and ${Math.round(r.closeRate)}% of leads become customers. Cost per lead comes from published medians (LocaliQ 2026).</p>
    <table style="width:100%;border-collapse:collapse">${est}
      <tr><td style="padding:10px 0;font-size:14px;font-weight:700;color:#333">Paid ads in total</td><td style="padding:10px 0;font-size:14px;font-weight:700;color:#333;text-align:right">≈ ${Math.round(custs * 10) / 10} customers · ≈ $${back} back per $1</td></tr>
    </table>
    <p style="font-size:12px;color:#888;margin:8px 0 0">Revenue, not profit. SEO, Business Profile, email and social are not estimated because they build over months. Medians across advertisers; your numbers will differ. <a href="https://datalatte.pro/rates" style="color:#7c4a2d">See all sources and rates</a></p>` : ""}
    <p style="margin:22px 0 0"><a href="https://datalatte.pro/tools/marketing-budget-calculator" style="color:#7c4a2d">Recalculate with different numbers</a> · <a href="https://datalatte.pro/free-audit" style="color:#7c4a2d">Get a free audit of your marketing</a></p>`;
}

function resultNote(r: CalcResult): string {
  return `calculator: ${r.niche || "n/a"}, budget ${money(r.budget)}/mo, revenue ${money(r.revenue)}/mo, goal ${r.goal || "n/a"}; ` +
    r.channels.map(c => `${c.label} ${money(c.amount)}`).join(", ");
}

async function addToResendAudience(email: string) {
  if (!RESEND_AUDIENCE_ID) return;
  try {
    await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  } catch (err) {
    console.error("Resend audience add failed:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, source = "blog", magnet, result: rawResult } = await req.json();
    const calc = source === "budget-calculator" ? parseResult(rawResult) : null;
    const checklist = typeof magnet === "string" ? getChecklist(magnet) : undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 0. Store in CRM (so every signup is kept even if e-mail steps fail)
    await saveLead({ email, form_type: "newsletter", notes: `source: ${source}${checklist ? `, checklist: ${checklist.slug}` : ""}${calc ? `; ${resultNote(calc)}` : ""}` });

    // 1. Add to Resend audience
    await addToResendAudience(email).catch(() => {});

    // 2. Send welcome email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nataliia at DataLatte <hi@datalatte.pro>",
        to: email,
        subject: calc ? `Your marketing budget: ${money(calc.budget)}/month ☕` : checklist ? `Your checklist: ${checklist.title}` : "You're in ☕ — Welcome to DataLatte",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333">
            <h2 style="color:#5c3317">${calc ? "Your budget plan ☕" : checklist ? "Here is your checklist ☕" : "Welcome to DataLatte ☕"}</h2>
            ${calc ? resultEmailHtml(calc) : ""}
            ${checklist ? `<p>Thanks for asking! Here it is: <a href="https://datalatte.pro/checklists/${checklist.slug}?utm_source=email&utm_medium=welcome&utm_campaign=exit-popup" style="color:#7c4a2d;font-weight:600">${escapeHtml(checklist.title)}</a>. Tick items off as you go; your progress is saved in your browser.</p>` : ""}
            <p>${checklist ? "I will also send practical local marketing tips from time to time." : "Hey! Thanks for subscribing."}</p>
            <p>Every week I share practical, no-fluff local marketing tips — things that actually move the needle for small businesses like yours.</p>
            <p>In the meantime, here are a few places to start:</p>
            <ul>
              <li><a href="https://datalatte.pro/tools/marketing-budget-calculator" style="color:#7c4a2d">Free Marketing Budget Calculator</a> — find out exactly how much to spend and where</li>
              <li><a href="https://datalatte.pro/blog" style="color:#7c4a2d">The DataLatte Blog</a> — practical, no-fluff local marketing tips</li>
              <li><a href="https://datalatte.pro/services/google-ads" style="color:#7c4a2d">Google Ads for Local Businesses</a> — how it works and what to expect</li>
            </ul>
            <p>Got a question or want a free audit of your marketing? Just reply to this email — I read every one.</p>
            <p style="margin-top:32px">— Nataliia<br><span style="color:#888;font-size:13px">Founder, DataLatte</span></p>
            <hr style="margin:32px 0;border:none;border-top:1px solid #eee">
            <p style="font-size:12px;color:#aaa">
              You subscribed at datalatte.pro. Source: ${escapeHtml(source)}.
              To unsubscribe, reply with "unsubscribe" in the subject line.
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend welcome email failed:", err);
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
    }

    // 3. Telegram notification (optional)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `🎉 New subscriber!\n${email}\nSource: ${source}${calc ? `\nBudget: ${money(calc.budget)}/mo (${calc.niche})` : ""}`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
