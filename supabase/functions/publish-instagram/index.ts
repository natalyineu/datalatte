// Publishes due social_posts (platform='instagram') as Reels (video) or photos via the Instagram Graph API.
// Secrets: META_PAGE_TOKEN, FB_PAGE_ID. Modes: ?dry=1
import { createClient } from "npm:@supabase/supabase-js@2";

const G = "https://graph.facebook.com/v21.0";
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const j = async (r: Response) => await r.json();

Deno.serve(async (req) => {
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const token = Deno.env.get("META_PAGE_TOKEN")!;
  const pageId = Deno.env.get("FB_PAGE_ID")!;

  const page = await j(await fetch(`${G}/${pageId}?fields=instagram_business_account{id,username}&access_token=${token}`));
  const ig = page.instagram_business_account?.id;
  if (!ig) return Response.json({ error: page.error?.message ?? "no instagram account linked" }, { status: 500 });

  const { data: posts, error } = await sb.from("social_posts").select("*")
    .eq("platform", "instagram").eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(2);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const out: unknown[] = [];
  for (const p of posts ?? []) {
    if (dry) { out.push({ id: p.id, title: p.title, dry: true }); continue; }
    await sb.from("social_posts").update({ status: "failed", error_message: "in flight" }).eq("id", p.id);
    try {
      if (!p.media_url) throw new Error("Instagram needs media_url");
      const body = new URLSearchParams({ access_token: token, caption: p.content.slice(0, 2200) });
      if (p.media_type === "video") { body.set("media_type", "REELS"); body.set("video_url", p.media_url); body.set("share_to_feed", "true"); }
      else body.set("image_url", p.media_url);
      const c = await fetch(`${G}/${ig}/media`, { method: "POST", body });
      const co = await j(c);
      if (!c.ok) throw new Error(co.error?.message ?? `HTTP ${c.status}`);

      for (let i = 0; i < 25; i++) {
        const s = await j(await fetch(`${G}/${co.id}?fields=status_code,status&access_token=${token}`));
        if (s.status_code === "FINISHED") break;
        if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error(s.status ?? s.status_code);
        await new Promise((r) => setTimeout(r, 4000));
      }
      const pub = await fetch(`${G}/${ig}/media_publish`, {
        method: "POST", body: new URLSearchParams({ access_token: token, creation_id: co.id }),
      });
      const po = await j(pub);
      if (!pub.ok) throw new Error(po.error?.message ?? `HTTP ${pub.status}`);
      const pl = await j(await fetch(`${G}/${po.id}?fields=permalink&access_token=${token}`));
      await sb.from("social_posts").update({
        status: "published", post_id_external: po.id,
        post_url: pl.permalink ?? `https://www.instagram.com/${page.instagram_business_account.username}/`,
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
