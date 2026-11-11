// Telegram reports into a forum group with topics.
// Secrets: TELEGRAM_BOT_TOKEN. Group id + topic thread ids are stored in social_settings (tg_group_id, tg_topics).
// Modes: ?rename=<key>&name=<new name>, ?purge=<fromId>&to=<toId> (delete bot messages in range), ?discover=1 (list chats the bot sees), ?setup=1&chat=<id> (create topics), POST {topic,text} (send), ?send=<topic>&text=...
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const T = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const api = async (m: string, body?: unknown) => (await fetch(`https://api.telegram.org/bot${T}/${m}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) })).json();
const TOPICS: Record<string, string> = { publish: "📤 Публикации", alerts: "🚨 Алерты", metrics: "📊 Метрики", traffic: "🌐 Сессии с сайта", leads: "💼 Лиды и письма", partners: "💰 Партнёры", outreach: "✉️ Outreach", seo: "🔎 SEO", recs: "🎯 Рекомендации", codes: "🔑 Коды и уведомления", weekly: "🗓 Неделя" };
const get = async (k: string) => (await sb.from("social_settings").select("value").eq("key", k).maybeSingle()).data?.value as string | undefined;
const set = (k: string, v: string) => sb.from("social_settings").upsert({ key: k, value: v }, { onConflict: "key" });

// Sending and purging require the service role key (the anon key is public): used by the GitHub Action report and server jobs.
const isService = (req: Request) => { try { const t = (req.headers.get("authorization") ?? "").replace(/^Bearer /i, "").split(".")[1]; return JSON.parse(atob(t.replace(/-/g, "+").replace(/_/g, "/"))).role === "service_role"; } catch { return false; } };

Deno.serve(async (req) => {
  const u = new URL(req.url);
  if (u.searchParams.get("discover") === "1") {
    const r = await api("getUpdates", { allowed_updates: ["message", "my_chat_member", "channel_post"], limit: 100 });
    if (!r.ok) return Response.json({ error: r.description });
    const chats = new Map<number, unknown>();
    for (const x of r.result) { const c = x.message?.chat ?? x.my_chat_member?.chat ?? x.channel_post?.chat; if (c) chats.set(c.id, { id: c.id, title: c.title ?? c.username ?? c.first_name, type: c.type, is_forum: c.is_forum ?? false }); }
    return Response.json({ chats: [...chats.values()] });
  }
  if (u.searchParams.get("rename")) {
    const chat = await get("tg_group_id"); const topics = JSON.parse((await get("tg_topics")) ?? "{}"); const key = u.searchParams.get("rename")!;
    const r = await api("editForumTopic", { chat_id: chat, message_thread_id: topics[key], name: u.searchParams.get("name") });
    return Response.json(r.ok ? { ok: true } : { error: r.description });
  }
  if (u.searchParams.get("purge")) {
    if (!isService(req)) return Response.json({ error: "service role required" }, { status: 403 });
    const chat = await get("tg_group_id"); const from = +u.searchParams.get("purge")!; const to = +(u.searchParams.get("to") ?? from);
    const ids: number[] = []; for (let i = from; i <= to; i++) ids.push(i);
    let deleted = 0;
    for (let i = 0; i < ids.length; i += 100) { const r = await api("deleteMessages", { chat_id: chat, message_ids: ids.slice(i, i + 100) }); if (r.ok) deleted += ids.slice(i, i + 100).length; else return Response.json({ error: r.description, deleted }); }
    return Response.json({ ok: true, requested: ids.length });
  }
  if (u.searchParams.get("setup") === "1") {
    const chat = u.searchParams.get("chat") ?? (await get("tg_group_id"));
    if (!chat) return Response.json({ error: "no chat id" });
    const info = await api("getChat", { chat_id: chat });
    if (!info.ok) return Response.json({ error: info.description });
    if (!info.result.is_forum) return Response.json({ error: "Topics are not enabled in this group" });
    await set("tg_group_id", String(chat));
    const existing = JSON.parse((await get("tg_topics")) ?? "{}"); const fresh: string[] = [];
    for (const [key, name] of Object.entries(TOPICS)) {
      if (existing[key]) continue;
      const t = await api("createForumTopic", { chat_id: chat, name });
      if (!t.ok) return Response.json({ error: `createForumTopic ${key}: ${t.description}`, created: existing });
      existing[key] = t.result.message_thread_id; fresh.push(key);
    }
    await set("tg_topics", JSON.stringify(existing));
    for (const key of fresh) { const tid = existing[key]; await api("sendMessage", { chat_id: chat, message_thread_id: tid, text: `Тема «${TOPICS[key]}» подключена ✅` }); }
    return Response.json({ ok: true, topics: existing, created: fresh });
  }
  // send (service role only)
  if (!isService(req)) return Response.json({ error: "service role required" }, { status: 403 });
  let topic = u.searchParams.get("send"); let text = u.searchParams.get("text");
  if (req.method === "POST") { try { const b = await req.json(); topic = b.topic ?? topic; text = b.text ?? text; } catch { /* ignore */ } }
  if (!topic || !text) return Response.json({ error: "need topic and text" }, { status: 400 });
  const chat = await get("tg_group_id"); const topics = JSON.parse((await get("tg_topics")) ?? "{}");
  if (!chat || !topics[topic]) return Response.json({ error: "group/topic not configured" }, { status: 400 });
  const r = await api("sendMessage", { chat_id: chat, message_thread_id: topics[topic], text, parse_mode: "HTML", disable_web_page_preview: true });
  return Response.json(r.ok ? { ok: true, message_id: r.result.message_id } : { error: r.description });
});
