// Content plan report → Telegram topic "plan": how much content is ready, how many days it covers, next 7 days, gaps, ideas bank.
// Mobile-friendly plain lines. Run daily (cron). No arguments.
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const TG = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const TZ = "Europe/Warsaw";
const get = async (k: string) => (await sb.from("social_settings").select("value").eq("key", k).maybeSingle()).data?.value as string | undefined;
const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const PL: Record<string, string> = { telegram: "Telegram", twitter: "X", facebook: "Facebook", instagram: "Instagram", threads: "Threads", linkedin: "LinkedIn" };
const SH: Record<string, string> = { telegram: "TG", twitter: "X", facebook: "FB", instagram: "IG", threads: "Threads", linkedin: "LI" };
const dayKey = (d: Date | string) => new Date(d).toLocaleDateString("en-CA", { timeZone: TZ });
const dayLab = (k: string) => new Date(k + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const diffDays = (a: string, b: string) => Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5);

Deno.serve(async () => {
  const now = new Date(); const todayK = dayKey(now);
  const { data } = await sb.from("social_posts").select("platform,status,content_type,scheduled_at").in("status", ["scheduled", "draft"]).gte("scheduled_at", now.toISOString()).limit(2000);
  const rows = (data ?? []).map((r) => ({ ...r, k: dayKey(r.scheduled_at) }));
  const sched = rows.filter((r) => r.status === "scheduled"), drafts = rows.filter((r) => r.status === "draft");
  const auto = ["facebook", "instagram", "threads", "twitter", "telegram"];

  const L: string[] = ["<b>🗂 CONTENT PLAN</b>", `<i>${esc(now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }))}</i>`, "", "<b>━━ READY (APPROVED) ━━</b>"];
  const runway: Record<string, number> = {};
  for (const p of auto) {
    const a = sched.filter((r) => r.platform === p);
    if (!a.length) { L.push(`${SH[p]}: <b>0</b> posts 🔴 nothing scheduled`); runway[p] = 0; continue; }
    const last = a.map((r) => r.k).sort().pop()!; const d = diffDays(todayK, last) + 1; runway[p] = d;
    L.push(`${d <= 3 ? "🔴" : d <= 7 ? "🟡" : "🟢"} ${SH[p]}: <b>${a.length}</b> posts, through ${dayLab(last)} (<b>${d}</b> days)`);
  }
  const dr = ["twitter", "linkedin"].map((p) => ({ p, n: drafts.filter((r) => r.platform === p).length })).filter((x) => x.n);
  if (dr.length) { L.push("", "<b>━━ DRAFTS (NOT APPROVED) ━━</b>", ...dr.map((x) => `${SH[x.p]}: <b>${x.n}</b> drafts${x.p === "linkedin" ? " (published by you manually)" : " (approve in CRM → Social)"}`)); }

  L.push("", "<b>━━ NEXT 7 DAYS ━━</b>");
  for (let i = 0; i < 7; i++) {
    const k = dayKey(new Date(now.getTime() + i * 864e5));
    const a = sched.filter((r) => r.k === k);
    const meta = a.filter((r) => ["facebook", "instagram", "threads"].includes(r.platform));
    const parts: string[] = [];
    if (meta.length) parts.push(`Meta: ${[...new Set(meta.map((r) => r.content_type === "image" ? "card" : (r.content_type ?? "post")))].join("/")}`);
    if (a.some((r) => r.platform === "twitter")) parts.push("X");
    if (a.some((r) => r.platform === "telegram")) parts.push("TG");
    L.push(`${i === 0 ? "▸ " : ""}${dayLab(k)}: ${parts.length ? parts.join(" · ") : "—"}`);
  }

  const { data: ideas } = await sb.from("social_ideas").select("season_tag,season_from,status").eq("status", "new");
  const seasonal = (ideas ?? []).filter((i) => i.season_from && i.season_from >= todayK).sort((a, b) => String(a.season_from).localeCompare(String(b.season_from)));
  L.push("", "<b>━━ IDEAS BANK ━━</b>", `Unused ideas: <b>${ideas?.length ?? 0}</b>` + (seasonal[0] ? ` · nearest season: ${esc(String(seasonal[0].season_tag).split("/")[0].trim())} (${dayLab(String(seasonal[0].season_from))})` : ""));

  const meta = Math.min(runway.facebook ?? 0, runway.instagram ?? 0, runway.threads ?? 0);
  L.push("", "<b>━━ VERDICT ━━</b>");
  L.push(meta >= 14 ? `• Meta is covered for ${meta} days. 🟢` : `• Meta covers only ${meta} days; target is 14. Need about ${Math.max(0, 14 - meta)} more daily posts (one per day, three platforms each).`);
  if ((runway.twitter ?? 0) <= 3) L.push(`• X: approved content ends soon (${runway.twitter ?? 0} days). ${drafts.filter((r) => r.platform === "twitter").length} drafts wait for approval.`);
  L.push(`• Telegram is covered for ${runway.telegram ?? 0} days.`);

  const chat = await get("tg_group_id"); const topics = JSON.parse((await get("tg_topics")) ?? "{}");
  if (!chat || !topics.plan) return Response.json({ error: "plan topic not configured" });
  const r = await (await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, message_thread_id: topics.plan, text: L.join("\n").slice(0, 3900), parse_mode: "HTML", disable_web_page_preview: true }) })).json();
  return Response.json(r.ok ? { ok: true } : { error: r.description });
});
