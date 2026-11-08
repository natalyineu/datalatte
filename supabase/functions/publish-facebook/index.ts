// Publishes due social_posts (platform='facebook', status='scheduled') to the DataLatte Facebook Page.
// Secrets (Supabase): FB_PAGE_TOKEN (never-expiring Page token), FB_PAGE_ID. Modes: ?dry=1, ?whoami=1
import { createClient } from "npm:@supabase/supabase-js@2";

const GRAPH = "https://graph.facebook.com/v21.0";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = Deno.env.get("FB_PAGE_TOKEN")!;
  const pageId = Deno.env.get("FB_PAGE_ID")!;
  const dry = url.searchParams.get("dry") === "1";

  if (url.searchParams.get("whoami") === "1") {
    const r = await fetch(`${GRAPH}/${pageId}?fields=id,name&access_token=${token}`);
    const j = await r.json();
    return Response.json(r.ok ? { id: j.id, name: j.name } : { error: j.error?.message });
  }

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: posts, error } = await sb
    .from("social_posts")
    .select("*")
    .eq("platform", "facebook")
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at")
    .limit(3);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const out: unknown[] = [];
  for (const p of posts ?? []) {
    if (dry) { out.push({ id: p.id, title: p.title, dry: true }); continue; }

    // Mark first so a timeout/re-run can never double-post.
    await sb.from("social_posts").update({ status: "failed", error_message: "in flight" }).eq("id", p.id);

    const body = new URLSearchParams({ access_token: token });
    let endpoint = "feed";
    if (p.media_url && p.media_type === "video") {
      endpoint = "videos"; body.set("file_url", p.media_url); body.set("description", p.content);
    } else if (p.media_url) {
      endpoint = "photos"; body.set("url", p.media_url); body.set("caption", p.content);
    } else {
      body.set("message", p.content);
      if (p.destination_url) body.set("link", p.destination_url);
    }

    try {
      const r = await fetch(`${GRAPH}/${pageId}/${endpoint}`, { method: "POST", body });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? `HTTP ${r.status}`);
      const extId: string = j.post_id ?? j.id;
      await sb.from("social_posts").update({
        status: "published",
        post_id_external: extId,
        post_url: `https://www.facebook.com/${extId}`,
        published_at: new Date().toISOString(),
        error_message: null,
      }).eq("id", p.id);
      out.push({ id: p.id, ok: true, extId });
    } catch (e) {
      await sb.from("social_posts").update({ status: "failed", error_message: String(e).slice(0, 500) }).eq("id", p.id);
      out.push({ id: p.id, ok: false, error: String(e) });
    }
  }
  return Response.json({ processed: out });
});
