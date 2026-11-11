// Daily site reports + recommendations + inbox triage → Telegram forum topics.
// Data: GA4/GSC JSON committed daily by the GitHub Action (public raw files), social tables in Supabase.
// Modes: ?mode=traffic (GA4, daily) | seo (Search Console, daily) | recs (daily recommendations) | inbox&id=<contact_submissions.id> (triage one e-mail/lead)
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const TG = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const RAW = "https://raw.githubusercontent.com/natalyineu/datalatte/main/data/analytics/";
const get = async (k: string) => (await sb.from("social_settings").select("value").eq("key", k).maybeSingle()).data?.value as string | undefined;
const set = (k: string, v: string) => sb.from("social_settings").upsert({ key: k, value: v }, { onConflict: "key" });
const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const arrow = (a: number, b: number) => (b === 0 ? "" : a > b * 1.1 ? "▲" : a < b * 0.9 ? "▼" : "▬");
const pct = (a: number, b: number) => (b === 0 ? "—" : `${a >= b ? "+" : ""}${Math.round(((a - b) / b) * 100)}%`);
const avg = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const short = (u: string) => String(u).replace(/^https?:\/\/(www\.)?datalatte\.pro/, "") || "/";

async function send(topic: string, text: string) {
  const chat = await get("tg_group_id"); const topics = JSON.parse((await get("tg_topics")) ?? "{}");
  if (!chat || !topics[topic]) return { error: `topic ${topic} not configured` };
  const r = await (await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, message_thread_id: topics[topic], text: text.slice(0, 3900), parse_mode: "HTML", disable_web_page_preview: true }) })).json();
  return r.ok ? { ok: true } : { error: r.description };
}
const raw = async (f: string) => (await fetch(RAW + f + "?t=" + Date.now())).json();
const ymd = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

async function gaDaily() {
  const g = await raw("ga4-latest.json");
  const days = new Map<string, Record<string, number>>();
  for (const r of g.dailyChannels ?? []) { const d = ymd(r.dimensionValues[0].value), ch = r.dimensionValues[1].value; const o = days.get(d) ?? {}; o[ch] = (o[ch] ?? 0) + +r.metricValues[0].value; days.set(d, o); }
  return { days, fetchedAt: g.fetchedAt as string };
}
async function gsc() { return await raw("gsc-latest.json"); }

Deno.serve(async (req) => {
  const u = new URL(req.url); const mode = u.searchParams.get("mode");

  if (mode === "traffic") {
    const { days, fetchedAt } = await gaDaily();
    const keys = [...days.keys()].sort();
    const last = keys[keys.length - 1]; const prev = keys.slice(-8, -1);
    const total = (o: Record<string, number>) => Object.values(o).reduce((s, x) => s + x, 0);
    const real = (o: Record<string, number>) => total(o) - (o["Direct"] ?? 0);
    const cur = days.get(last)!;
    const direct = cur["Direct"] ?? 0; const directMed = [...prev.map((d) => days.get(d)?.["Direct"] ?? 0)].sort((a, b) => a - b)[Math.floor(prev.length / 2)] ?? 0;
    const realAvg = avg(prev.map((d) => real(days.get(d)!)));
    let t = `<b>🌐 Трафик (GA4) · ${last}</b>\n━━━━━━━━━━━━━━━━━━\n`;
    t += `<b>Реальные визиты</b> (без Direct): <b>${real(cur)}</b> ${arrow(real(cur), realAvg)} ${pct(real(cur), realAvg)} к среднему за 7 дней (${realAvg.toFixed(1)})\n\n`;
    const chans = Object.entries(cur).filter(([k]) => k !== "Direct").sort((a, b) => b[1] - a[1]);
    for (const [k, v] of chans) { const a = avg(prev.map((d) => days.get(d)?.[k] ?? 0)); t += `<code>${esc(k).padEnd(16)} ${String(v).padStart(4)}  ${arrow(v, a)} ср. ${a.toFixed(1)}</code>\n`; }
    t += `\n<b>Direct:</b> ${direct} (обычно ~${directMed}). ${direct > directMed * 3 ? "🚨 всплеск, похоже на ботов" : "Это в основном боты и неатрибутированный трафик, в выводах не учитываем."}\n`;
    const { data: ut } = await sb.from("social_utm_daily").select("source,campaign,sessions").eq("day", last);
    if (ut?.length) t += `\n<b>Из наших соцсетей (UTM):</b> ` + ut.map((x) => `${esc(x.source)}${x.campaign ? "/" + esc(x.campaign) : ""} ${x.sessions}`).join(", ") + "\n";
    t += `\n<i>Данные GA4 обновлены: ${esc(String(fetchedAt).slice(0, 16).replace("T", " "))} UTC</i>`;
    if (direct > directMed * 3) await send("alerts", `🚨 GA4: Direct ${direct} за ${last} при норме ~${directMed}. Скорее всего боты.`);
    return Response.json(await send("traffic", t));
  }

  if (mode === "seo") {
    const s = await gsc(); const ad = (s.allDaily as { d: string; clicks: number; impressions: number; position: number }[]).filter((x) => x.impressions > 0);
    const last = ad[ad.length - 1]; const w0 = ad.slice(-7), w1 = ad.slice(-14, -7);
    const sum = (a: typeof ad, k: "clicks" | "impressions") => a.reduce((x, y) => x + y[k], 0);
    let t = `<b>🔎 SEO (Search Console) · ${last.d}</b>\n━━━━━━━━━━━━━━━━━━\n`;
    t += `<b>Вчера:</b> ${last.clicks} кликов, ${last.impressions.toLocaleString("en-US")} показов, позиция ${last.position.toFixed(1)}\n`;
    t += `<b>7 дней:</b> ${sum(w0, "clicks")} кликов (${pct(sum(w0, "clicks"), sum(w1, "clicks"))}), ${sum(w0, "impressions").toLocaleString("en-US")} показов (${pct(sum(w0, "impressions"), sum(w1, "impressions"))}) к прошлым 7 дням\n`;
    t += `<b>Позиция:</b> ${avg(w0.map((x) => x.position)).toFixed(1)} против ${avg(w1.map((x) => x.position)).toFixed(1)}\n\n`;
    const prevMap = (arr: any[]) => new Map((arr ?? []).map((x) => [x.keys[0], x]));
    const growth = (a: any[], b: any[], n: number) => { const p = prevMap(b); return (a ?? []).filter((x) => x.impressions >= 15).map((x) => ({ k: x.keys[0], i: x.impressions, c: x.clicks, d: x.impressions - (p.get(x.keys[0])?.impressions ?? 0), pos: x.position })).sort((x, y) => y.d - x.d).slice(0, n); };
    const gp = growth(s.weekly.pagesW0, s.weekly.pagesW1, 4), gq = growth(s.weekly.queriesW0, s.weekly.queriesW1, 4);
    if (gp.length) t += "<b>📈 Страницы, где растут показы (неделя к неделе)</b>\n" + gp.map((x) => `• ${esc(short(x.k))}: ${x.i} показов (${x.d >= 0 ? "+" : ""}${x.d}), поз ${x.pos.toFixed(1)}`).join("\n") + "\n\n";
    if (gq.length) t += "<b>🔑 Запросы</b>\n" + gq.map((x) => `• «${esc(x.k)}»: ${x.i} показов (${x.d >= 0 ? "+" : ""}${x.d}), поз ${x.pos.toFixed(1)}`).join("\n") + "\n\n";
    const top = [...(s.weekly.pagesW0 ?? [])].sort((a, b) => b.clicks - a.clicks).slice(0, 3);
    if (top.length) t += "<b>🏆 Топ по кликам за 7 дней</b>\n" + top.map((x: any) => `• ${esc(short(x.keys[0]))}: ${x.clicks} кликов`).join("\n") + "\n\n";
    const cs = (s.countries ?? []).slice(0, 3).map((c: any) => `${esc(c.keys[0])} ${c.impressions}`).join(" · ");
    t += `<b>🌍 Страны (показы за 28 дней):</b> ${cs}\n<i>GSC отстаёт на 1–2 дня.</i>`;
    return Response.json(await send("seo", t));
  }

  if (mode === "recs") {
    const recs: { key: string; pr: number; text: string }[] = [];
    const s = await gsc(); const { days } = await gaDaily();
    for (const p of (s.weekly.pagesW0 ?? []) as any[]) if (p.impressions >= 60 && p.ctr < 0.015 && p.position <= 15) recs.push({ key: `ctr:${p.keys[0]}`, pr: 3, text: `📝 <b>Переписать title и description</b>: ${esc(short(p.keys[0]))} (${p.impressions} показов, CTR ${(p.ctr * 100).toFixed(1)}%, позиция ${p.position.toFixed(1)}). Показы есть, кликов мало.` });
    const pm = new Map(((s.weekly.pagesW1 ?? []) as any[]).map((x) => [x.keys[0], x]));
    for (const p of (s.weekly.pagesW0 ?? []) as any[]) { const b: any = pm.get(p.keys[0]); if (p.impressions >= 40 && b && p.impressions >= b.impressions * 1.5) recs.push({ key: `grow:${p.keys[0]}`, pr: 2, text: `📈 <b>Страница растёт</b>: ${esc(short(p.keys[0]))} (${b.impressions}→${p.impressions} показов). Добавьте внутренние ссылки на неё и CTA, а в соцсетях сделайте пост про эту тему.` }); }
    for (const q of ((s.weekly.queriesW0 ?? []) as any[]).filter((x) => x.impressions >= 20 && x.position >= 8 && x.position <= 20).slice(0, 3)) recs.push({ key: `q:${q.keys[0]}`, pr: 2, text: `🔑 <b>Запрос «${esc(q.keys[0])}»</b> на позиции ${q.position.toFixed(1)} (${q.impressions} показов). Усильте страницу под него: заголовок H2, FAQ, внутренние ссылки.` });
    // social: best platform by average views over 14 days
    const { data: m } = await sb.from("social_metrics").select("platform,views,post_id,social_posts(content_type,published_at)").gte("collected_date", new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10)).not("views", "is", null);
    const byType = new Map<string, number[]>(); for (const x of m ?? []) { const k = `${x.platform}/${(x as any).social_posts?.content_type ?? "?"}`; byType.set(k, [...(byType.get(k) ?? []), x.views ?? 0]); }
    const ranked = [...byType.entries()].filter(([, v]) => v.length >= 3).map(([k, v]) => ({ k, a: avg(v), n: v.length })).sort((a, b) => b.a - a.a);
    if (ranked.length) recs.push({ key: `soc:${ranked[0].k}`, pr: 1, text: `📊 <b>Лучший формат за 14 дней</b>: ${esc(ranked[0].k)}, в среднем ${ranked[0].a.toFixed(0)} просмотров (${ranked[0].n} постов). Делайте больше такого.` });
    // calendar gaps (next 2 days, FB/IG/Threads)
    const tom = new Date(Date.now() + 36 * 3600e3).toISOString();
    const { data: sched } = await sb.from("social_posts").select("platform").in("status", ["scheduled", "draft"]).gte("scheduled_at", new Date().toISOString()).lte("scheduled_at", tom);
    const have = new Set((sched ?? []).map((x) => x.platform));
    const miss = ["facebook", "instagram", "threads"].filter((p) => !have.has(p));
    if (miss.length) recs.push({ key: `gap:${new Date().toISOString().slice(0, 10)}`, pr: 3, text: `🗓 <b>На ближайшие 36 часов нет постов</b> в ${miss.join(", ")}. Добавьте и одобрите в CRM → Social.` });
    // leads waiting
    const { count: waiting } = await sb.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new").lt("created_at", new Date(Date.now() - 24 * 3600e3).toISOString());
    if (waiting) recs.push({ key: `wait:${new Date().toISOString().slice(0, 10)}`, pr: 3, text: `⏳ <b>${waiting} заявок ждут ответа больше суток</b>. Ответить в CRM → Inbox.` });
    // partner nudges
    const { data: deals } = await sb.from("partner_deals").select("partner,next_step");
    for (const d of deals ?? []) { const dt = String(d.next_step ?? "").match(/(\d{4}-\d{2}-\d{2})/)?.[1]; if (dt && dt <= new Date().toISOString().slice(0, 10)) recs.push({ key: `nudge:${d.partner}:${dt}`, pr: 3, text: `💰 <b>Пора напомнить партнёру</b>: ${esc(String(d.partner))} (${esc(String(d.next_step).slice(0, 80))}).` }); }
    // seasonal ideas starting within 7 days
    const today = new Date().toISOString().slice(0, 10), in7 = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
    const { data: ideas } = await sb.from("social_ideas").select("title,source_path,season_tag,season_from").eq("status", "new").gte("season_from", today).lte("season_from", in7).limit(3);
    for (const i of ideas ?? []) recs.push({ key: `idea:${i.title}`, pr: 2, text: `🗓 <b>Скоро сезон «${esc(String(i.season_tag))}»</b>: идея «${esc(String(i.title).slice(0, 80))}» (${esc(String(i.source_path))}).` });
    // GA direct spike
    const keys = [...days.keys()].sort(); const lastDay = days.get(keys[keys.length - 1])!;
    if ((lastDay["Direct"] ?? 0) > 1000) recs.push({ key: `bot:${keys[keys.length - 1]}`, pr: 1, text: `🤖 В GA4 всплеск Direct (${lastDay["Direct"]}). Для выводов используйте «реальные визиты», в отчёте они уже отделены.` });

    // do not repeat the same recommendation within 4 days
    const sentRaw = JSON.parse((await get("recs_sent")) ?? "{}") as Record<string, string>;
    const nowD = new Date().toISOString().slice(0, 10);
    const fresh = recs.filter((r) => !sentRaw[r.key] || Date.parse(nowD) - Date.parse(sentRaw[r.key]) > 4 * 864e5).sort((a, b) => b.pr - a.pr).slice(0, 7);
    if (!fresh.length) return Response.json({ skipped: "nothing new" });
    for (const r of fresh) sentRaw[r.key] = nowD;
    for (const k of Object.keys(sentRaw)) if (Date.parse(nowD) - Date.parse(sentRaw[k]) > 30 * 864e5) delete sentRaw[k];
    await set("recs_sent", JSON.stringify(sentRaw));
    const t = `<b>🎯 Что сделать сегодня</b> · ${nowD}\n━━━━━━━━━━━━━━━━━━\n` + fresh.map((r, i) => `${i + 1}. ${r.text}`).join("\n\n") + "\n\n<i>На основе GSC, GA4, метрик соцсетей и CRM. Повторы не показываются 4 дня.</i>";
    return Response.json(await send("recs", t));
  }

  if (mode === "inbox") {
    const id = u.searchParams.get("id"); if (!id) return Response.json({ error: "id required" }, { status: 400 });
    const { data: c } = await sb.from("contact_submissions").select("*").eq("id", id).maybeSingle();
    if (!c) return Response.json({ error: "not found" }, { status: 404 });
    if (c.triage) return Response.json({ skipped: "already triaged" });
    const status = String(c.status ?? "");
    if (["system", "test", "spam"].includes(status)) { await sb.from("contact_submissions").update({ triage: "skipped" }).eq("id", id); return Response.json({ skipped: status }); }
    const email = String(c.email ?? ""), domain = email.split("@")[1]?.toLowerCase() ?? "", local = email.split("@")[0]?.toLowerCase() ?? "";
    const msg = String(c.message ?? ""); const subj = msg.match(/^Subject:\s*(.*)/m)?.[1] ?? "";
    const known = /(facebookmail|facebook|meta|instagram|linkedin|google|vercel|supabase|github|apify|namecheap|zoho|stripe|resend|twitter|x\.com|telegram|anthropic|openai|mailchimp|calendly)\./i.test(domain);
    const codeRe = /(verification|verify|security code|confirm|login|log in|sign[- ]?in|one[- ]time|otp|2fa|two[- ]factor|passcode|authentication|код|подтвержд)/i;
    const code = codeRe.test(subj + " " + msg.slice(0, 600)) ? (msg.match(/\b(\d{3}[- ]?\d{3}|\d{4,8})\b/)?.[1] ?? null) : null;
    let triage: "human" | "code" | "notice" | "junk";
    if (c.form_type !== "direct_email") triage = "human";
    else if (code) triage = "code";
    else if (known) triage = "notice";
    else if (/unsubscribe|view (this )?(email )?in (your )?browser|manage (your )?preferences|\d+% off|webinar|newsletter|limited[- ]time offer/i.test(msg) || /^(news|newsletter|marketing|promo|offers|deals|noreply|no-reply)/.test(local)) triage = "junk";
    else triage = "human";
    await sb.from("contact_submissions").update({ triage, triaged_at: new Date().toISOString() }).eq("id", id);
    if (triage === "junk") return Response.json({ triaged: "junk" });
    if (triage === "code") return Response.json(await send("codes", `🔑 <b>Код от ${esc(domain)}</b>\n<code>${esc(code!)}</code>\n<i>${esc(subj.slice(0, 100))}</i>`));
    if (triage === "notice") return Response.json(await send("codes", `🔔 <b>${esc(domain)}</b>\n${esc(subj.slice(0, 120) || msg.slice(0, 120))}`));
    const fresh = msg.replace(/^Subject:.*\n+/m, "").split(/\n\s*On\s[^\n]{0,160}wrote:|\n>/i)[0].trim().slice(0, 500);
    const kind = c.form_type === "direct_email" ? "✉️ Письмо" : "📝 Заявка с сайта";
    return Response.json(await send("inbox", `<b>${kind}</b>\n━━━━━━━━━━━━━━━━━━\n👤 <b>${esc(String(c.name ?? "—"))}</b> · ${esc(email)}${c.niche ? " · " + esc(String(c.niche)) : ""}\n${subj ? "📌 " + esc(subj) + "\n" : ""}<blockquote>${esc(fresh)}</blockquote>`));
  }
  return Response.json({ error: "mode=traffic|seo|recs|inbox" }, { status: 400 });
});
