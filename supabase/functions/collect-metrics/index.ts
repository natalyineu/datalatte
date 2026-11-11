// Collects per-post metrics for published social_posts (last 30 days) into social_metrics (one row per post per day).
// Facebook/Instagram: Graph API with META_PAGE_TOKEN. Threads: THREADS token (needs threads_manage_insights).
// X: X_BEARER_TOKEN (public_metrics). LinkedIn is filled by sync-linkedin (Apify). Telegram views come from the public preview https://t.me/s/<channel> (Bot API has no view counts).
// Modes: ?dry=1 (show what would be collected)
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const G = "https://graph.facebook.com/v21.0";
const TH = "https://graph.threads.net/v1.0";
const MT = Deno.env.get("META_PAGE_TOKEN")!;
const j = async (r: Response) => await r.json();
type M = { views?: number; reach?: number; likes?: number; comments?: number; shares?: number; saves?: number; clicks?: number; note?: string; raw?: unknown };

async function threadsToken() {
  const { data } = await sb.from("social_settings").select("value").eq("key", "threads_token").maybeSingle();
  return data?.value || Deno.env.get("THREADS_TOKEN")!;
}

async function fb(id: string): Promise<M> {
  const r = await fetch(`${G}/${id}?fields=likes.summary(true).limit(0),comments.summary(true).limit(0)&access_token=${MT}`);
  const o = await j(r);
  if (!r.ok) return { note: o.error?.message };
  const m: M = { likes: o.likes?.summary?.total_count, comments: o.comments?.summary?.total_count };
  // video views/impressions (works for video objects only)
  const v = await fetch(`${G}/${id}/video_insights?metric=total_video_views,total_video_impressions&access_token=${MT}`);
  if (v.ok) {
    const vo = await j(v);
    for (const d of vo.data ?? []) {
      if (d.name === "total_video_views") m.views = d.values?.[0]?.value;
      if (d.name === "total_video_impressions") m.reach = d.values?.[0]?.value;
    }
  }
  return m;
}

async function ig(id: string): Promise<M> {
  for (const metrics of ["reach,likes,comments,saved,shares,views", "reach,likes,comments,saved,shares,plays", "reach,likes,comments,saved,shares"]) {
    const r = await fetch(`${G}/${id}/insights?metric=${metrics}&access_token=${MT}`);
    const o = await j(r);
    if (!r.ok) { if (metrics.endsWith("shares")) return { note: o.error?.message }; continue; }
    const m: M = {};
    for (const d of o.data ?? []) {
      const val = d.values?.[0]?.value ?? d.total_value?.value;
      if (d.name === "reach") m.reach = val; if (d.name === "likes") m.likes = val; if (d.name === "comments") m.comments = val;
      if (d.name === "saved") m.saves = val; if (d.name === "shares") m.shares = val; if (d.name === "views" || d.name === "plays") m.views = val;
    }
    return m;
  }
  return { note: "no insights" };
}

async function threads(id: string, token: string): Promise<M> {
  const r = await fetch(`${TH}/${id}/insights?metric=views,likes,replies,reposts,quotes&access_token=${token}`);
  const o = await j(r);
  if (!r.ok) return { note: o.error?.message };
  const m: M = {};
  for (const d of o.data ?? []) {
    const val = d.values?.[0]?.value;
    if (d.name === "views") m.views = val; if (d.name === "likes") m.likes = val; if (d.name === "replies") m.comments = val; if (d.name === "reposts") m.shares = val;
  }
  return m;
}

async function xBatch(ids: string[]): Promise<Record<string, M>> {
  const out: Record<string, M> = {};
  const bearer = Deno.env.get("X_BEARER_TOKEN");
  if (!bearer || !ids.length) return out;
  const r = await fetch(`https://api.twitter.com/2/tweets?ids=${ids.join(",")}&tweet.fields=public_metrics`, { headers: { Authorization: `Bearer ${bearer}` } });
  const o = await j(r);
  if (!r.ok) { for (const i of ids) out[i] = { note: o.detail ?? o.title ?? `HTTP ${r.status}` }; return out; }
  for (const t of o.data ?? []) {
    const p = t.public_metrics ?? {};
    out[t.id] = { views: p.impression_count, likes: p.like_count, comments: p.reply_count, shares: (p.retweet_count ?? 0) + (p.quote_count ?? 0), saves: p.bookmark_count };
  }
  return out;
}

function kNum(s: string): number { const t = s.trim().toUpperCase(); if (t.endsWith("K")) return Math.round(parseFloat(t) * 1000); if (t.endsWith("M")) return Math.round(parseFloat(t) * 1e6); return parseInt(t.replace(/\D/g, "")) || 0; }
async function tgViews(minId: number): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  let before = "";
  for (let page = 0; page < 6; page++) {
    const html = await (await fetch(`https://t.me/s/datalattepro${before}`)).text();
    const ids: number[] = [];
    for (const blk of html.split("tgme_widget_message_wrap").slice(1)) {
      const id = blk.match(/data-post="[^/]+\/(\d+)"/)?.[1];
      const v = blk.match(/tgme_widget_message_views">([^<]+)</)?.[1];
      if (id) { ids.push(+id); if (v) out[id] = kNum(v); }
    }
    if (!ids.length) break;
    const lo = Math.min(...ids);
    if (lo <= minId) break;
    before = `?before=${lo}`;
  }
  return out;
}

Deno.serve(async (req) => {
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const { data: posts, error } = await sb.from("social_posts").select("id,platform,post_id_external")
    .eq("status", "published").not("post_id_external", "is", null).gte("published_at", new Date(Date.now() - 30 * 864e5).toISOString());
  if (error) return Response.json({ error: error.message }, { status: 500 });
  const list = (posts ?? []).filter((p) => ["facebook", "instagram", "threads", "twitter", "telegram"].includes(p.platform));
  if (dry) return Response.json({ would_collect: list.length });

  const tt = await threadsToken();
  const x = await xBatch(list.filter((p) => p.platform === "twitter").map((p) => p.post_id_external!));
  const tgIds = list.filter((p) => p.platform === "telegram").map((p) => +p.post_id_external!);
  const tgv = tgIds.length ? await tgViews(Math.min(...tgIds)) : {};
  let ok = 0, noted = 0;
  for (const p of list) {
    let m: M = {};
    try {
      if (p.platform === "facebook") m = await fb(p.post_id_external!);
      else if (p.platform === "instagram") m = await ig(p.post_id_external!);
      else if (p.platform === "threads") m = await threads(p.post_id_external!, tt);
      else if (p.platform === "telegram") m = tgv[p.post_id_external!] != null ? { views: tgv[p.post_id_external!] } : { note: "not found in public preview" };
      else m = x[p.post_id_external!] ?? { note: "not returned by X" };
    } catch (e) { m = { note: String(e).slice(0, 200) }; }
    const { note, raw, ...cols } = m;
    await sb.from("social_metrics").upsert({ post_id: p.id, platform: p.platform, external_id: p.post_id_external, collected_date: new Date().toISOString().slice(0, 10), collected_at: new Date().toISOString(), ...cols, note: note ?? null, raw: raw ?? null }, { onConflict: "post_id,collected_date" });
    note ? noted++ : ok++;
  }
  return Response.json({ collected: ok, with_notes: noted });
});
