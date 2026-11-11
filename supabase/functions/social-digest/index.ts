// Reports to the Telegram forum group (topics via tg-report settings).
// Modes: ?mode=leads | outreach | partners | publish (recent published/failed posts) | health (token checks, alerts only if broken) | metrics (weekly) | traffic (weekly UTM sessions)
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const TG = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const G = "https://graph.facebook.com/v21.0";
const get = async (k: string) => (await sb.from("social_settings").select("value").eq("key", k).maybeSingle()).data?.value as string | undefined;
const PL: Record<string, string> = { telegram: "TG", twitter: "X", facebook: "FB", instagram: "IG", threads: "Threads", linkedin: "LI" };
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = (v: number | null | undefined) => (v == null ? "—" : v.toLocaleString("en-US"));

async function send(topic: string, text: string) {
  const chat = await get("tg_group_id"); const topics = JSON.parse((await get("tg_topics")) ?? "{}");
  if (!chat || !topics[topic]) return { error: "tg group/topic not configured" };
  const r = await (await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, message_thread_id: topics[topic], text: text.slice(0, 3900), parse_mode: "HTML", disable_web_page_preview: true }) })).json();
  return r.ok ? { ok: true } : { error: r.description };
}

Deno.serve(async (req) => {
  const mode = new URL(req.url).searchParams.get("mode");
  const now = Date.now();

  if (mode === "leads") {
    const since = new Date(now - 24 * 3600e3).toISOString();
    const { data: fresh } = await sb.from("contact_submissions").select("name,email,niche,form_type,message,status,created_at").gte("created_at", since).not("status", "in", "(spam,system,test)").order("created_at");
    const { count: waiting } = await sb.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new").lt("created_at", since);
    if (!fresh?.length && !waiting) return Response.json({ skipped: "no new leads" });
    let t = "<b>💼 Заявки с сайта</b>\n━━━━━━━━━━━━━━━━━━\n";
    for (const c of fresh ?? []) t += `👤 <b>${esc(String(c.name ?? "—"))}</b> · ${esc(String(c.niche ?? "—"))} · <i>${esc(String(c.form_type ?? ""))}</i>\n<blockquote>${esc(String(c.message ?? "").slice(0, 220))}</blockquote>\n`;
    if (!fresh?.length) t += "Новых за сутки нет.\n";
    if (waiting) t += `\n⏳ Ждут ответа дольше суток: <b>${waiting}</b>`;
    return Response.json(await send("leads", t));
  }

  if (mode === "outreach") {
    const since1 = new Date(now - 24 * 3600e3).toISOString(), since7 = new Date(now - 7 * 864e5).toISOString();
    const { data: all } = await sb.from("outreach_emails_v").select("campaign,status,sent_at,replied_at_eff,outcome,business_name,subject").order("sent_at", { ascending: false }).limit(5000);
    const rows = all ?? [];
    const cnt = (a: any[]) => ({ sent: a.length, delivered: a.filter((x) => ["delivered", "opened", "clicked"].includes(x.status)).length, opened: a.filter((x) => ["opened", "clicked"].includes(x.status)).length, clicked: a.filter((x) => x.status === "clicked").length, bounced: a.filter((x) => x.status === "bounced").length, replied: a.filter((x) => x.replied_at_eff).length });
    const day = rows.filter((x) => x.sent_at && x.sent_at >= since1), week = rows.filter((x) => x.sent_at && x.sent_at >= since7);
    const tot = cnt(rows), d = cnt(day), w = cnt(week);
    const unknown = rows.filter((x) => x.status === "unknown").length;
    let t = "<b>✉️ Outreach</b>\n━━━━━━━━━━━━━━━━━━\n";
    t += `<b>За 24 часа:</b> отправлено <b>${d.sent}</b>, доставлено ${d.delivered}, открыто ${d.opened}, ответов ${d.replied}\n`;
    t += `<b>За 7 дней:</b> отправлено <b>${w.sent}</b>, доставлено ${w.delivered}, открыто ${w.opened}, кликов ${w.clicked}, отказов ${w.bounced}, ответов <b>${w.replied}</b>\n`;
    t += `<b>Всего:</b> ${tot.sent} писем, ответов ${tot.replied}, открытий ${tot.opened}, кликов ${tot.clicked}, отказов ${tot.bounced}\n`;
    const byC = new Map<string, any[]>(); for (const x of week) { const k = x.campaign ?? "—"; byC.set(k, [...(byC.get(k) ?? []), x]); }
    if (byC.size) { t += "\n<b>Кампании за неделю</b>\n"; for (const [k, a] of byC) { const c = cnt(a); t += `<code>${esc(String(k).slice(0, 26))}</code> — ${c.sent} шт, открыто ${c.opened}, ответов ${c.replied}\n`; } }
    const rep = rows.filter((x) => x.replied_at_eff && x.replied_at_eff >= since1);
    if (rep.length) { t += "\n<b>💬 Новые ответы</b>\n"; for (const x of rep.slice(0, 8)) t += `• ${esc(String(x.business_name ?? "—"))}: ${esc(String(x.subject ?? "").slice(0, 60))}\n`; }
    if (unknown) t += `\n<i>Статус не синхронизирован у ${unknown} писем (обновляется скриптом Resend раз в сутки).</i>`;
    return Response.json(await send("outreach", t));
  }

  if (mode === "partners") {
    const { data: d } = await sb.from("partner_deals").select("partner,deal_status,amount,currency,invoice_status,paid_at,next_step,last_check_result,last_checked_at");
    const deals = d ?? [];
    const paid = deals.filter((x) => x.paid_at), open = deals.filter((x) => !x.paid_at && x.amount);
    const sum = (a: any[]) => a.reduce((s, x) => s + Number(x.amount || 0), 0);
    let t = "<b>💰 Партнёры и счета</b>\n━━━━━━━━━━━━━━━━━━\n";
    t += `<b>🟢 Оплачено: $${sum(paid)}</b>\n` + paid.sort((a, b) => String(b.paid_at).localeCompare(String(a.paid_at))).map((x) => `<code>${esc(String(x.partner).slice(0, 24)).padEnd(24)} $${x.amount}  ${String(x.paid_at).slice(5)}</code>`).join("\n");
    t += `\n\n<b>🟡 Ждём оплату: $${sum(open)}</b>` + (open.length ? "\n" + open.map((x) => `• ${esc(String(x.partner))} $${x.amount} (${esc(String(x.invoice_status ?? "—"))})`).join("\n") : "");
    const steps = deals.filter((x) => x.next_step && !x.paid_at);
    if (steps.length) t += "\n\n<b>➡️ Следующие шаги</b>\n" + steps.map((x) => `• ${esc(String(x.partner))}: ${esc(String(x.next_step).slice(0, 90))}`).join("\n");
    const chk = deals.filter((x) => x.last_check_result);
    const bad = chk.filter((x) => String(x.last_check_result).startsWith("FAIL"));
    t += `\n\n<b>✅ Проверка размещений</b>\n` + (bad.length ? `⚠️ Проблемы: ${bad.map((x) => esc(String(x.partner))).join(", ")}` : `Все ${chk.length} размещений на месте.`);
    return Response.json(await send("partners", t));
  }

  if (mode === "publish") {
    const since = new Date(now - 7 * 3600e3).toISOString();
    const { data: ok } = await sb.from("social_posts").select("platform,title,post_url,published_at").eq("status", "published").gte("published_at", since).order("published_at");
    const { data: bad } = await sb.from("social_posts").select("platform,title,error_message").eq("status", "failed").gte("updated_at", since);
    if (!ok?.length && !bad?.length) return Response.json({ skipped: "nothing to report" });
    let t = "<b>📤 Публикации</b>\n";
    for (const p of ok ?? []) t += `✅ ${PL[p.platform] ?? p.platform}: <a href="${p.post_url}">${esc(String(p.title).slice(0, 70))}</a>\n`;
    if (bad?.length) { t += "\n<b>❌ Ошибки</b>\n"; for (const p of bad) t += `${PL[p.platform] ?? p.platform}: ${esc(String(p.title).slice(0, 60))}: ${esc(String(p.error_message ?? "").slice(0, 120))}\n`; await send("alerts", "🚨 Есть неудачные публикации:\n" + bad.map((p) => `${PL[p.platform] ?? p.platform}: ${esc(String(p.title).slice(0, 60))}`).join("\n")); }
    return Response.json(await send("publish", t));
  }

  if (mode === "health") {
    const problems: string[] = [];
    const mt = Deno.env.get("META_PAGE_TOKEN"), pid = Deno.env.get("FB_PAGE_ID");
    const f = await (await fetch(`${G}/${pid}?fields=id,name,instagram_business_account{username}&access_token=${mt}`)).json();
    if (f.error) problems.push(`Facebook/Instagram: ${f.error.message.replace(/\s+/g, " ").slice(0, 160)}`);
    else if (!f.instagram_business_account) problems.push("Instagram: страница не видит привязанный аккаунт");
    const tt = (await get("threads_token")) ?? Deno.env.get("THREADS_TOKEN");
    const th = await (await fetch(`https://graph.threads.net/v1.0/me?fields=id,username&access_token=${tt}`)).json();
    if (th.error) problems.push(`Threads: ${String(th.error.message).slice(0, 160)}`);
    if (!problems.length) return Response.json({ ok: true, problems: 0 });
    return Response.json(await send("alerts", "🚨 <b>Проблема с доступом к соцсетям</b>\n" + problems.map(esc).join("\n") + "\n\nПосты на ближайшее время могут не выйти. Проверьте токены в Meta for Developers."));
  }

  if (mode === "metrics") {
    const { data: m } = await sb.from("social_metrics").select("post_id,platform,views,reach,likes,comments,collected_date,social_posts(title,post_url,published_at)").gte("collected_date", new Date(now - 8 * 864e5).toISOString().slice(0, 10)).order("collected_date", { ascending: false }).limit(2000);
    const latest = new Map<string, any>(); for (const x of m ?? []) if (!latest.has(x.post_id)) latest.set(x.post_id, x);
    const week = [...latest.values()].filter((x) => x.social_posts?.published_at && Date.parse(x.social_posts.published_at) > now - 7 * 864e5);
    if (!week.length) return Response.json({ skipped: "no posts this week" });
    const by: Record<string, { posts: number; views: number; likes: number }> = {};
    for (const x of week) { const b = (by[x.platform] ??= { posts: 0, views: 0, likes: 0 }); b.posts++; b.views += x.views ?? 0; b.likes += x.likes ?? 0; }
    let t = "<b>📊 Метрики за неделю</b>\n";
    for (const [k, v] of Object.entries(by)) t += `${PL[k] ?? k}: ${v.posts} постов, ${n(v.views)} просмотров, ${n(v.likes)} лайков\n`;
    t += "\n<b>Лучшие посты</b>\n";
    for (const x of week.sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5)) t += `${PL[x.platform] ?? x.platform} ${n(x.views)} 👁 ${n(x.likes)} ♥ <a href="${x.social_posts.post_url}">${esc(String(x.social_posts.title).slice(0, 55))}</a>\n`;
    return Response.json(await send("metrics", t));
  }

  if (mode === "traffic") {
    const { data: u } = await sb.from("social_utm_daily").select("source,medium,campaign,sessions,users,engaged_sessions,key_events").gte("day", new Date(now - 7 * 864e5).toISOString().slice(0, 10));
    if (!u?.length) return Response.json(await send("traffic", "🌐 <b>Сессии с сайта из соцсетей за 7 дней</b>\nПока нет сессий с UTM (utm_medium=social). Данные приходят из GA4 раз в сутки."));
    const agg = new Map<string, any>(); for (const x of u) { const k = `${x.source}|${x.campaign}`; const a = agg.get(k) ?? { source: x.source, campaign: x.campaign, s: 0, e: 0, k: 0 }; a.s += x.sessions; a.e += x.engaged_sessions; a.k += x.key_events; agg.set(k, a); }
    let t = "<b>🌐 Сессии с сайта из соцсетей за 7 дней</b>\n";
    for (const a of [...agg.values()].sort((x, y) => y.s - x.s).slice(0, 12)) t += `${esc(a.source)} / ${esc(a.campaign || "—")}: ${a.s} сессий, ${a.e} вовлечённых, ${a.k} целей\n`;
    return Response.json(await send("traffic", t));
  }
  return Response.json({ error: "mode=publish|health|metrics|traffic" }, { status: 400 });
});
