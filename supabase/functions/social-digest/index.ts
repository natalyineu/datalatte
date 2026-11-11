// Reports to the Telegram forum group (topics via tg-report settings).
// Report format everywhere: ALL TIME first, then LAST 7 DAYS (this week vs last week, change, flag), then a short conclusion.
// Modes: social | outreach | partners | recs (social & sales recommendations) | publish (event: recent posts) | health (alerts only if broken)
// Site/SEO/traffic reports are sent by the GitHub Action (scripts/fetch-analytics.js) in the same format.
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const TG = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const G = "https://graph.facebook.com/v21.0";
const get = async (k: string) => (await sb.from("social_settings").select("value").eq("key", k).maybeSingle()).data?.value as string | undefined;
const PL: Record<string, string> = { telegram: "Telegram", twitter: "X", facebook: "Facebook", instagram: "Instagram", threads: "Threads", linkedin: "LinkedIn" };
const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const num = (n: number) => Math.round(n).toLocaleString("en-US");
const pad = (v: string | number, n: number) => String(v).padStart(n);
const lab = (t: string, n = 22) => String(t).padEnd(n);
const pre = (lines: string[]) => `<pre>${esc(lines.join("\n"))}</pre>`;
const chg = (cur: number, prev: number) => { if (!prev) return cur ? "new" : "–"; const d = (cur / prev - 1) * 100; return `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(0)}%`; };
const flag = (cur: number, prev: number) => { if (!prev) return cur ? "🟢" : "⚪"; const d = (cur / prev - 1) * 100; return d > 5 ? "🟢" : d < -5 ? "🔴" : "⚪"; };
const wrow = (name: string, cur: number, prev: number, f = num) => `${lab(name)}${pad(f(cur), 8)}${pad(f(prev), 9)}${pad(chg(cur, prev), 7)} ${flag(cur, prev)}`;
const mr = (name: string, cur: number, prev: number, f = num) => `${flag(cur, prev)} ${esc(name)}: <b>${f(cur)}</b> · was ${f(prev)} (${chg(cur, prev)})`;
const sec = (t: string, sub = "") => `<b>━━ ${t} ━━</b>${sub ? ` <i>${esc(sub)}</i>` : ""}`;
const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const D7 = 7 * 864e5;

async function send(topic: string, text: string) {
  const chat = await get("tg_group_id"); const topics = JSON.parse((await get("tg_topics")) ?? "{}");
  if (!chat || !topics[topic]) return { error: "tg group/topic not configured" };
  const r = await (await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, message_thread_id: topics[topic], text: text.slice(0, 3900), parse_mode: "HTML", disable_web_page_preview: true }) })).json();
  return r.ok ? { ok: true } : { error: r.description };
}

Deno.serve(async (req) => {
  const mode = new URL(req.url).searchParams.get("mode");
  const now = Date.now();

  // ───────── SOCIAL ─────────
  if (mode === "social" || mode === "metrics") {
    const { data: posts } = await sb.from("social_posts").select("id,platform,title,post_url,published_at,content_type").eq("status", "published").not("published_at", "is", null);
    const { data: met } = await sb.from("social_metrics").select("post_id,views,likes,comments,collected_date").order("collected_date", { ascending: false }).limit(8000);
    const latest = new Map<string, any>(); for (const m of met ?? []) if (!latest.has(m.post_id)) latest.set(m.post_id, m);
    const rows = (posts ?? []).map((p) => ({ ...p, t: Date.parse(p.published_at), m: latest.get(p.id) ?? {} }));
    const sum = (a: any[], k: "views" | "likes" | "comments") => a.reduce((s, x) => s + (x.m[k] ?? 0), 0);
    const w1 = rows.filter((x) => x.t >= now - D7), w0 = rows.filter((x) => x.t >= now - 2 * D7 && x.t < now - D7);
    const first = rows.length ? new Date(Math.min(...rows.map((x) => x.t))).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "launch";
    const plats = Object.keys(PL).filter((k) => rows.some((x) => x.platform === k));
    const L: string[] = [`<b>📊 SOCIAL</b>`, `<i>${esc(today())}</i>`, "", sec("ALL TIME", `since ${first}`)];
    for (const k of plats) { const a = rows.filter((x) => x.platform === k); L.push(`${PL[k]}: <b>${a.length}</b> posts` + (k === "linkedin" ? `, ♥ ${num(sum(a, "likes"))}` : `, 👁 ${num(sum(a, "views"))}, ♥ ${num(sum(a, "likes"))}`)); }
    L.push(`<b>Total: ${rows.length} posts, 👁 ${num(sum(rows, "views"))}, ♥ ${num(sum(rows, "likes"))}</b>`);
    const best = [...rows].sort((a, b) => (b.m.views ?? 0) - (a.m.views ?? 0))[0];
    if (best && best.m.views) L.push(`🏆 Best: ${PL[best.platform]} · <a href="${best.post_url}">${esc(String(best.title).slice(0, 45))}</a> (${num(best.m.views)} views)`);
    L.push("", sec("LAST 7 DAYS", "posts published in the window"), mr("Posts", w1.length, w0.length), mr("Views", sum(w1, "views"), sum(w0, "views")), mr("Likes", sum(w1, "likes"), sum(w0, "likes")), mr("Comments", sum(w1, "comments"), sum(w0, "comments")));
    const byPlat = plats.map((k) => ({ k, v: sum(w1.filter((x) => x.platform === k), "views") })).sort((a, b) => b.v - a.v);
    L.push("", sec("CONCLUSION"), `• ${w1.length} posts this week (${chg(w1.length, w0.length)}), ${num(sum(w1, "views"))} views.`);
    if (byPlat[0]?.v) L.push(`• Most views this week: ${PL[byPlat[0].k]} (${num(byPlat[0].v)}).`);
    L.push(`<i>Newer posts are still collecting views. LinkedIn shows likes only (no official API).</i>`);
    return Response.json(await send("metrics", L.join("\n")));
  }

  // ───────── OUTREACH ─────────
  if (mode === "outreach") {
    const { data: all } = await sb.from("outreach_emails_v").select("campaign,status,sent_at,replied_at_eff,business_name,subject").order("sent_at", { ascending: false }).limit(5000);
    const rows = (all ?? []).filter((x) => x.sent_at).map((x) => ({ ...x, ts: Date.parse(x.sent_at), tr: x.replied_at_eff ? Date.parse(x.replied_at_eff) : 0 }));
    const dlv = (a: any[]) => a.filter((x) => ["delivered", "opened", "clicked"].includes(x.status)).length;
    const opn = (a: any[]) => a.filter((x) => ["opened", "clicked"].includes(x.status)).length;
    const clk = (a: any[]) => a.filter((x) => x.status === "clicked").length;
    const bnc = (a: any[]) => a.filter((x) => x.status === "bounced").length;
    const w1 = rows.filter((x) => x.ts >= now - D7), w0 = rows.filter((x) => x.ts >= now - 2 * D7 && x.ts < now - D7);
    const rep1 = rows.filter((x) => x.tr >= now - D7).length, rep0 = rows.filter((x) => x.tr >= now - 2 * D7 && x.tr < now - D7).length;
    const repAll = rows.filter((x) => x.tr).length, unknown = rows.filter((x) => x.status === "unknown").length;
    const first = rows.length ? new Date(Math.min(...rows.map((x) => x.ts))).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "launch";
    const pc = (a: number, b: number) => (b ? `${(a / b * 100).toFixed(1)}%` : "–");
    const L: string[] = [`<b>✉️ OUTREACH · COLD E-MAILS</b>`, `<i>${esc(today())}</i>`, "", sec("ALL TIME", `since ${first}`),
      `Sent: <b>${num(rows.length)}</b>`, `Delivered: <b>${num(dlv(rows))}</b> (${pc(dlv(rows), rows.length)})`, `Opened: <b>${num(opn(rows))}</b> (${pc(opn(rows), dlv(rows))} of delivered)`, `Clicked: <b>${num(clk(rows))}</b> · Bounced: <b>${num(bnc(rows))}</b> (${pc(bnc(rows), rows.length)})`, `💬 Replies: <b>${num(repAll)}</b> (${pc(repAll, rows.length)})`,
      "", sec("LAST 7 DAYS"), mr("Sent", w1.length, w0.length), mr("Opened", opn(w1), opn(w0)), mr("Clicked", clk(w1), clk(w0)), mr("Bounced", bnc(w1), bnc(w0)), mr("Replies", rep1, rep0)];
    const byC = new Map<string, any[]>(); for (const x of w1) byC.set(x.campaign ?? "–", [...(byC.get(x.campaign ?? "–") ?? []), x]);
    if (byC.size) L.push("", `<b>Campaigns this week</b>`, ...[...byC.entries()].map(([k, a]) => `• ${esc(String(k).slice(0, 30))}: ${a.length} sent, ${opn(a)} opened`));
    L.push("", sec("CONCLUSION"), `• ${w1.length} e-mails this week (${chg(w1.length, w0.length)}), ${rep1} replies.`);
    if (unknown) L.push(`• ${unknown} older e-mails have no delivery status yet, so open/click rates are understated.`);
    const recent = rows.filter((x) => x.tr >= now - D7).slice(0, 5);
    if (recent.length) L.push(`💬 New replies: ` + recent.map((x) => esc(String(x.business_name ?? "–"))).join(", "));
    return Response.json(await send("outreach", L.join("\n")));
  }

  // ───────── PARTNERS ─────────
  if (mode === "partners") {
    const { data: d } = await sb.from("partner_deals").select("partner,deal_status,amount,currency,invoice_status,paid_at,next_step,last_check_result");
    const deals = d ?? [];
    const paid = deals.filter((x) => x.paid_at).map((x) => ({ ...x, t: Date.parse(x.paid_at + "T12:00:00Z"), a: Number(x.amount || 0) }));
    const open = deals.filter((x) => !x.paid_at && Number(x.amount) > 0);
    const offers = deals.filter((x) => !x.paid_at && !Number(x.amount));
    const sumA = (a: any[]) => a.reduce((s, x) => s + x.a, 0);
    const p1 = paid.filter((x) => x.t >= now - D7), p0 = paid.filter((x) => x.t >= now - 2 * D7 && x.t < now - D7);
    const first = paid.length ? paid.map((x) => x.paid_at).sort()[0] : "launch";
    const L: string[] = [`<b>💰 PARTNERS · PAID PLACEMENTS</b>`, `<i>${esc(today())}</i>`, "", sec("ALL TIME", `since ${first}`), `Paid: <b>$${num(sumA(paid))}</b> (${paid.length} deals)`,
      ...paid.sort((a, b) => b.t - a.t).map((x) => `   • ${esc(String(x.partner))}: $${x.a} · ${String(x.paid_at).slice(5)}`),
      `Waiting for payment: <b>$${num(open.reduce((s, x) => s + Number(x.amount), 0))}</b> (${open.length})`, `Upsell offers sent: <b>${offers.length}</b>`,
      "", sec("LAST 7 DAYS"), mr("Payments received $", sumA(p1), sumA(p0)), mr("Deals paid", p1.length, p0.length)];
    const chk = deals.filter((x) => x.last_check_result), bad = chk.filter((x) => String(x.last_check_result).startsWith("FAIL"));
    L.push("", sec("CONCLUSION"), `• $${num(sumA(p1))} received this week (${chg(sumA(p1), sumA(p0))}).`, bad.length ? `• ⚠️ Placement problem: ${bad.map((x) => esc(String(x.partner))).join(", ")}` : `• All ${chk.length} placements are live (links checked).`);
    const steps = deals.filter((x) => x.next_step && !x.paid_at);
    if (steps.length) L.push("", `<b>Next steps</b>`, ...steps.map((x) => `• ${esc(String(x.partner))}: ${esc(String(x.next_step).slice(0, 90))}`));
    return Response.json(await send("partners", L.join("\n")));
  }

  // ───────── RECOMMENDATIONS: social & sales ─────────
  if (mode === "recs") {
    const recs: { key: string; pr: number; text: string }[] = [];
    const todayS = new Date().toISOString().slice(0, 10);
    const tom = new Date(now + 36 * 3600e3).toISOString();
    const { data: sched } = await sb.from("social_posts").select("platform").in("status", ["scheduled", "draft"]).gte("scheduled_at", new Date().toISOString()).lte("scheduled_at", tom);
    const have = new Set((sched ?? []).map((x) => x.platform));
    const miss = ["facebook", "instagram", "threads"].filter((p) => !have.has(p));
    if (miss.length) recs.push({ key: `gap:${todayS}`, pr: 3, text: `Next 36 hours have no posts in ${miss.join(", ")}. Add and approve them in CRM → Social.` });
    const { data: newRows } = await sb.from("contact_submissions").select("email,form_type,message").eq("status", "new").neq("form_type", "newsletter").lt("created_at", new Date(now - 24 * 3600e3).toISOString());
    const AUTO_D = /(facebookmail|mail\.instagram|mail\.threads|instagram\.com|threads\.net|meta\.com|linkedin\.com|rb2b|retention\.com|ahrefs|zendesk|freshworks|freshdesk|google\.com|vercel|supabase|github|apify|stripe|namecheap|zoho|mailchimp|calendly|resend|dodolaunch|vibe-contributors)/i, AUTO_L = /^(no-?reply|notification|notifications|security|support|billing|news|newsletter|marketing|mailer-daemon|postmaster)/i;
    const real = (newRows ?? []).filter((x) => !(x.form_type === "direct_email" && (AUTO_D.test(String(x.email).split("@")[1] ?? "") || AUTO_L.test(String(x.email).split("@")[0] ?? ""))));
    if (real.length) recs.push({ key: `wait:${todayS}`, pr: 3, text: `${real.length} real message(s) have waited over a day for a reply (${real.slice(0, 3).map((x) => String(x.email).split("@")[1]).join(", ")}). Answer in CRM → Inbox.` });
    const { data: deals } = await sb.from("partner_deals").select("partner,next_step");
    for (const d of deals ?? []) { const dt = String(d.next_step ?? "").match(/(\d{4}-\d{2}-\d{2})/)?.[1]; if (dt && dt <= todayS) recs.push({ key: `nudge:${d.partner}:${dt}`, pr: 3, text: `Time to nudge ${d.partner} (${String(d.next_step).slice(0, 80)}).` }); }
    const in7 = new Date(now + 7 * 864e5).toISOString().slice(0, 10);
    const { data: ideas } = await sb.from("social_ideas").select("title,source_path,season_tag").eq("status", "new").gte("season_from", todayS).lte("season_from", in7).limit(20);
    // one recommendation per season (tags like "Black Friday / email" and "Black Friday / holidays" are the same season)
    const bySeason = new Map<string, any[]>();
    for (const i of ideas ?? []) { const k = String(i.season_tag).split("/")[0].trim(); bySeason.set(k, [...(bySeason.get(k) ?? []), i]); }
    for (const [season, list] of bySeason) recs.push({ key: `season:${season}`, pr: 2, text: `${season} starts within a week. ${list.length} ready ideas from your articles: ` + list.slice(0, 3).map((i) => `${String(i.title).slice(0, 60)} (${i.source_path})`).join("; ") + "." });
    const { data: m } = await sb.from("social_metrics").select("platform,views,social_posts(content_type)").gte("collected_date", new Date(now - 14 * 864e5).toISOString().slice(0, 10)).not("views", "is", null);
    const byType = new Map<string, number[]>(); for (const x of m ?? []) { const k = `${PL[x.platform] ?? x.platform} ${(x as any).social_posts?.content_type ?? ""}`.trim(); byType.set(k, [...(byType.get(k) ?? []), x.views ?? 0]); }
    const ranked = [...byType.entries()].filter(([, v]) => v.length >= 3).map(([k, v]) => ({ k, a: v.reduce((s, x) => s + x, 0) / v.length, n: v.length })).sort((a, b) => b.a - a.a);
    if (ranked.length) recs.push({ key: `best:${ranked[0].k}`, pr: 1, text: `Best format over 14 days: ${ranked[0].k}, average ${ranked[0].a.toFixed(0)} views (${ranked[0].n} posts). Make more of it.` });
    const sent = JSON.parse((await get("recs_sent")) ?? "{}") as Record<string, string>;
    const fresh = recs.filter((r) => !sent[r.key] || now - Date.parse(sent[r.key]) > 4 * 864e5).sort((a, b) => b.pr - a.pr).slice(0, 6);
    if (!fresh.length) return Response.json({ skipped: "nothing new" });
    for (const r of fresh) sent[r.key] = todayS;
    await sb.from("social_settings").upsert({ key: "recs_sent", value: JSON.stringify(sent) }, { onConflict: "key" });
    return Response.json(await send("recs", `<b>🎯 WHAT TO DO · SOCIAL & SALES</b>\n<i>${esc(today())}</i>\n\n` + fresh.map((r, i) => `${i + 1}. ${esc(r.text)}`).join("\n")));
  }

  // ───────── PUBLICATIONS (event digest) ─────────
  if (mode === "publish") {
    const since = new Date(now - 7 * 3600e3).toISOString();
    const { data: ok } = await sb.from("social_posts").select("platform,title,post_url,published_at").eq("status", "published").gte("published_at", since).order("published_at");
    const { data: bad } = await sb.from("social_posts").select("platform,title,error_message").eq("status", "failed").gte("updated_at", since);
    if (!ok?.length && !bad?.length) return Response.json({ skipped: "nothing to report" });
    let t = "<b>📤 Published just now</b>\n";
    for (const p of ok ?? []) t += `✅ ${PL[p.platform] ?? p.platform}: <a href="${p.post_url}">${esc(String(p.title).slice(0, 70))}</a>\n`;
    if (bad?.length) { t += "\n<b>❌ Errors</b>\n"; for (const p of bad) t += `${PL[p.platform] ?? p.platform}: ${esc(String(p.title).slice(0, 60))}: ${esc(String(p.error_message ?? "").slice(0, 120))}\n`; await send("alerts", "🚨 Failed posts:\n" + bad.map((p) => `${PL[p.platform] ?? p.platform}: ${esc(String(p.title).slice(0, 60))}`).join("\n")); }
    return Response.json(await send("publish", t));
  }

  // ───────── HEALTH (alerts only) ─────────
  if (mode === "health") {
    const problems: string[] = [];
    const mt = Deno.env.get("META_PAGE_TOKEN"), pid = Deno.env.get("FB_PAGE_ID");
    const f = await (await fetch(`${G}/${pid}?fields=id,name,instagram_business_account{username}&access_token=${mt}`)).json();
    if (f.error) problems.push(`Facebook/Instagram: ${f.error.message.replace(/\s+/g, " ").slice(0, 160)}`);
    else if (!f.instagram_business_account) problems.push("Instagram: the page no longer sees the linked account");
    const tt = (await get("threads_token")) ?? Deno.env.get("THREADS_TOKEN");
    const th = await (await fetch(`https://graph.threads.net/v1.0/me?fields=id,username&access_token=${tt}`)).json();
    if (th.error) problems.push(`Threads: ${String(th.error.message).slice(0, 160)}`);
    if (!problems.length) return Response.json({ ok: true, problems: 0 });
    return Response.json(await send("alerts", "🚨 <b>Social access problem</b>\n" + problems.map(esc).join("\n") + "\n\nPosts may not go out. Check the tokens in Meta for Developers."));
  }
  return Response.json({ error: "mode=social|outreach|partners|recs|publish|health" }, { status: 400 });
});
