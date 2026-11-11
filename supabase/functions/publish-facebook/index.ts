// Publishes due social_posts (platform='facebook', status='scheduled') to the DataLatte Facebook Page.
// Secrets (Supabase): META_PAGE_TOKEN (never-expiring Page token), FB_PAGE_ID. Modes: ?dry=1, ?whoami=1
import { createClient } from "npm:@supabase/supabase-js@2";

const GRAPH = "https://graph.facebook.com/v21.0";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = Deno.env.get("META_PAGE_TOKEN")!;
  const pageId = Deno.env.get("FB_PAGE_ID")!;
  const dry = url.searchParams.get("dry") === "1";

  if (url.searchParams.get("whoami") === "1") {
    const r = await fetch(`${GRAPH}/${pageId}?fields=id,name&access_token=${token}`);
    const j = await r.json();
    return Response.json(r.ok ? { id: j.id, name: j.name } : { error: j.error?.message });
  }

  const chk = url.searchParams.get("check");
  if (chk) {
    // Diagnostics: does a post/video exist? (ids comma-separated)
    const res: Record<string, unknown> = {};
    for (const id of chk.split(",")) {
      const r = await fetch(`${GRAPH}/${id}?fields=id,created_time,permalink_url,status&access_token=${token}`);
      const j = await r.json();
      res[id] = r.ok ? { exists: true, created: j.created_time, status: j.status?.video_status ?? null } : { exists: false, error: j.error?.message };
    }
    return Response.json(res);
  }

  if (url.searchParams.get("ids") === "1") {
    // Diagnostics: Instagram business account + Threads user + granted permissions (no secrets returned).
    const g = async (u: string) => { const r = await fetch(u); return await r.json(); };
    const ig = await g(`${GRAPH}/${pageId}?fields=instagram_business_account{id,username},connected_instagram_account{id,username}&access_token=${token}`);
    const perms = await g(`${GRAPH}/me/permissions?access_token=${token}`);
    const th = await g(`https://graph.threads.net/v1.0/me?fields=id,username&access_token=${token}`);
    return Response.json({
      instagram: ig.error ? { error: ig.error.message } : ig,
      permissions: perms.error ? { error: perms.error.message } : perms.data,
      threads: th.error ? { error: th.error.message } : th,
    });
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
    if (Array.isArray(p.media_urls) && p.media_urls.length > 1) {
      // Multi-photo post: upload each photo unpublished, then attach them to one feed post
      const ids: string[] = [];
      try {
        for (const u of p.media_urls.slice(0, 10)) {
          const rr = await fetch(`${GRAPH}/${pageId}/photos`, { method: "POST", body: new URLSearchParams({ access_token: token, url: u, published: "false" }) });
          const oo = await rr.json(); if (!rr.ok) throw new Error(oo.error?.message ?? `photo HTTP ${rr.status}`); ids.push(oo.id);
        }
      } catch (e) { await sb.from("social_posts").update({ status: "failed", error_message: String(e).slice(0, 500) }).eq("id", p.id); out.push({ id: p.id, ok: false, error: String(e) }); continue; }
      body.set("message", p.content);
      ids.forEach((id, i) => body.set(`attached_media[${i}]`, JSON.stringify({ media_fbid: id })));
    } else if (p.media_url && p.media_type === "video") {
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
