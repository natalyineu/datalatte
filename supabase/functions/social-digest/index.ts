// Reports to the Telegram forum group (topics via tg-report settings).
// Modes: ?mode=publish (recent published/failed posts) | health (token checks, alerts only if broken) | metrics (weekly) | traffic (weekly UTM sessions)
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
