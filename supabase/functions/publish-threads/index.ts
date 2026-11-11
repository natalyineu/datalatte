// Publishes due social_posts (platform='threads') to Threads.
// Secrets: THREADS_TOKEN (initial token from User Token Generator), APP_TH_TOKEN (Threads app secret).
// A long-lived token obtained via ?exchange=1 / ?refresh=1 is stored in social_settings.threads_token and preferred.
// Modes: ?me=1, ?exchange=1, ?refresh=1, ?dry=1
import { createClient } from "npm:@supabase/supabase-js@2";

const API = "https://graph.threads.net";
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function getToken(): Promise<string> {
  const { data } = await sb.from("social_settings").select("value").eq("key", "threads_token").maybeSingle();
  return data?.value || Deno.env.get("THREADS_TOKEN")!;
}
async function save(key: string, value: string) {
  await sb.from("social_settings").upsert({ key, value }, { onConflict: "key" });
}
const j = async (r: Response) => await r.json();

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const q = (k: string) => url.searchParams.get(k) === "1";
  let token = await getToken();

  if (q("exchange")) {
    const secret = Deno.env.get("APP_TH_TOKEN")!;
    const r = await fetch(`${API}/access_token?grant_type=th_exchange_token&client_secret=${secret}&access_token=${token}`);
    const o = await j(r);
    if (!r.ok) return Response.json({ error: o.error?.message });
    await save("threads_token", o.access_token);
    return Response.json({ ok: true, expires_in_days: Math.round(o.expires_in / 86400) });
  }
  if (q("refresh")) {
    const r = await fetch(`${API}/refresh_access_token?grant_type=th_refresh_token&access_token=${token}`);
    const o = await j(r);
    if (!r.ok) return Response.json({ error: o.error?.message });
    await save("threads_token", o.access_token);
    return Response.json({ ok: true, expires_in_days: Math.round(o.expires_in / 86400) });
  }

  const meR = await fetch(`${API}/v1.0/me?fields=id,username&access_token=${token}`);
  const me = await j(meR);
  if (!meR.ok) return Response.json({ error: me.error?.message }, { status: 500 });
  if (q("me")) { await save("threads_user_id", me.id); return Response.json(me); }

  const { data: posts, error } = await sb.from("social_posts").select("*")
    .eq("platform", "threads").eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(3);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const out: unknown[] = [];
  for (const p of posts ?? []) {
    if (q("dry")) { out.push({ id: p.id, title: p.title, dry: true }); continue; }
    await sb.from("social_posts").update({ status: "failed", error_message: "in flight" }).eq("id", p.id);
    try {
      let co: any;
      if (Array.isArray(p.media_urls) && p.media_urls.length > 1) {
        // Carousel: item containers, then a CAROUSEL container
        const kids: string[] = [];
        for (const u of p.media_urls.slice(0, 20)) {
          const rr = await fetch(`${API}/v1.0/${me.id}/threads`, { method: "POST", body: new URLSearchParams({ access_token: token, media_type: "IMAGE", image_url: u, is_carousel_item: "true" }) });
          const oo = await j(rr); if (!rr.ok) throw new Error(oo.error?.message ?? `item HTTP ${rr.status}`); kids.push(oo.id);
        }
        await new Promise((r) => setTimeout(r, 4000));
        const c = await fetch(`${API}/v1.0/${me.id}/threads`, { method: "POST", body: new URLSearchParams({ access_token: token, media_type: "CAROUSEL", children: kids.join(","), text: p.content.slice(0, 500) }) });
        co = await j(c); if (!c.ok) throw new Error(co.error?.message ?? `HTTP ${c.status}`);
      } else {
        const body = new URLSearchParams({ access_token: token, text: p.content.slice(0, 500) });
        if (p.media_url && p.media_type === "video") { body.set("media_type", "VIDEO"); body.set("video_url", p.media_url); }
        else if (p.media_url) { body.set("media_type", "IMAGE"); body.set("image_url", p.media_url); }
        else body.set("media_type", "TEXT");
        const c = await fetch(`${API}/v1.0/${me.id}/threads`, { method: "POST", body });
        co = await j(c); if (!c.ok) throw new Error(co.error?.message ?? `HTTP ${c.status}`);
      }

      // Wait for container to be ready (videos take longer).
      for (let i = 0; i < 20; i++) {
        const s = await j(await fetch(`${API}/v1.0/${co.id}?fields=status,error_message&access_token=${token}`));
        if (s.status === "FINISHED") break;
        if (s.status === "ERROR" || s.status === "EXPIRED") throw new Error(s.error_message ?? s.status);
        await new Promise((r) => setTimeout(r, 4000));
      }
      const pub = await fetch(`${API}/v1.0/${me.id}/threads_publish`, {
        method: "POST", body: new URLSearchParams({ access_token: token, creation_id: co.id }),
      });
      const po = await j(pub);
      if (!pub.ok) throw new Error(po.error?.message ?? `HTTP ${pub.status}`);
      const pl = await j(await fetch(`${API}/v1.0/${po.id}?fields=permalink&access_token=${token}`));
      await sb.from("social_posts").update({
        status: "published", post_id_external: po.id,
        post_url: pl.permalink ?? `https://www.threads.net/@${me.username}`,
        published_at: new Date().toISOString(), error_message: null,
      }).eq("id", p.id);
      out.push({ id: p.id, ok: true, url: pl.permalink });
    } catch (e) {
      await sb.from("social_posts").update({ status: "failed", error_message: String(e).slice(0, 500) }).eq("id", p.id);
      out.push({ id: p.id, ok: false, error: String(e) });
    }
  }
  return Response.json({ processed: out });
});
