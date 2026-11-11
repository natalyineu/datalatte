// One-time bulk insert of social_posts rows (content plan). Requires a one-time token stored in social_settings.insert_token (deleted after use).
// POST {rows:[...]} ?token=<token>. Only whitelisted columns and platforms are accepted.
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const COLS = ["platform", "status", "title", "content", "media_url", "media_type", "media_urls", "content_type", "group_key", "scheduled_at", "destination_url"];
const PLATFORMS = new Set(["telegram", "twitter", "facebook", "instagram", "threads", "linkedin"]);
const STATUS = new Set(["draft", "scheduled"]);

Deno.serve(async (req) => {
  const tok = new URL(req.url).searchParams.get("token");
  const { data } = await sb.from("social_settings").select("value").eq("key", "insert_token").maybeSingle();
  if (!tok || !data?.value || tok !== data.value) return Response.json({ error: "valid one-time token required" }, { status: 403 });
  await sb.from("social_settings").delete().eq("key", "insert_token");
  const body = await req.json().catch(() => null);
  const rows = (body?.rows ?? []) as Record<string, unknown>[];
  if (!rows.length) return Response.json({ error: "no rows" }, { status: 400 });
  const clean = rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => COLS.includes(k))));
  for (const r of clean) if (!PLATFORMS.has(String(r.platform)) || !STATUS.has(String(r.status))) return Response.json({ error: "bad platform/status", row: r.title }, { status: 400 });
  let inserted = 0;
  for (let i = 0; i < clean.length; i += 50) {
    const { error } = await sb.from("social_posts").insert(clean.slice(i, i + 50));
    if (error) return Response.json({ error: error.message, inserted }, { status: 500 });
    inserted += Math.min(50, clean.length - i);
  }
  return Response.json({ ok: true, inserted });
});
