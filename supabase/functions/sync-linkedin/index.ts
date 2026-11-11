// Syncs our public LinkedIn company posts via Apify (harvestapi/linkedin-company-posts, no cookies, public data only).
// - marks matching social_posts as published (matched by activity id), inserts posts found only on LinkedIn
// - stores likes/comments/shares in social_metrics (impressions are not available from public data)
// Secrets: APIFY_TOKEN. Optional: LINKEDIN_COMPANY_URL (default https://www.linkedin.com/company/datalattepro/)
// Cost: about $0.002 per post. Modes: ?dry=1
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const COMPANY = Deno.env.get("LINKEDIN_COMPANY_URL") ?? "https://www.linkedin.com/company/datalattepro/";

function postedMs(p: any, id: string): number {
  if (typeof p?.timestamp === "number") return p.timestamp;
  if (p?.date) { const t = Date.parse(p.date); if (!isNaN(t)) return t; }
  if (typeof p === "string") { const t = Date.parse(p); if (!isNaN(t)) return t; }
  return Number(BigInt(id) >> 22n); // LinkedIn activity ids encode the time
}

Deno.serve(async (req) => {
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const token = Deno.env.get("APIFY_TOKEN");
  if (!token) return Response.json({ error: "APIFY_TOKEN secret is not set" }, { status: 500 });

  const r = await fetch(`https://api.apify.com/v2/acts/harvestapi~linkedin-company-posts/run-sync-get-dataset-items?timeout=150&token=${token}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUrls: [COMPANY], maxPosts: 15 }),
  });
  const items = await r.json();
  if (!r.ok || !Array.isArray(items)) return Response.json({ error: "apify failed", detail: JSON.stringify(items).slice(0, 300) }, { status: 500 });
  if (dry) return Response.json({ found: items.length });

  let matched = 0, inserted = 0;
  const today = new Date().toISOString().slice(0, 10);
  for (const it of items) {
    if (it.type !== "post" || !it.id) continue;
    const urn = `urn:li:activity:${it.id}`;
    const url = String(it.linkedinUrl || "").split("?")[0];
    const when = new Date(postedMs(it.postedAt, String(it.id))).toISOString();

    // find our row by external id, by url fragment, or by identical text
    let { data: row } = await sb.from("social_posts").select("id,status").eq("platform", "linkedin").eq("post_id_external", urn).maybeSingle();
    if (!row) ({ data: row } = await sb.from("social_posts").select("id,status").eq("platform", "linkedin").ilike("post_url", `%${it.id}%`).maybeSingle());
    if (!row && it.content) ({ data: row } = await sb.from("social_posts").select("id,status").eq("platform", "linkedin").eq("content", it.content).in("status", ["draft", "scheduled"]).limit(1).maybeSingle());

    if (row) {
      if (row.status !== "published") await sb.from("social_posts").update({ status: "published", post_id_external: urn, post_url: url, published_at: when, error_message: null }).eq("id", row.id);
      else await sb.from("social_posts").update({ post_id_external: urn }).eq("id", row.id);
      matched++;
    } else {
      const ins = await sb.from("social_posts").insert({ platform: "linkedin", status: "published", title: `LinkedIn (auto-found): ${String(it.content || "").slice(0, 60)}`, content: it.content || "", post_url: url, post_id_external: urn, published_at: when, scheduled_at: when, content_type: it.postVideo ? "reel" : it.postImages?.length ? "image" : "text" }).select("id").single();
      if (ins.data) { row = ins.data as any; inserted++; }
    }
    if (row) {
      const e = it.engagement ?? {};
      await sb.from("social_metrics").upsert({ post_id: row.id, platform: "linkedin", external_id: urn, collected_date: today, collected_at: new Date().toISOString(), likes: e.likes ?? null, comments: e.comments ?? null, shares: e.shares ?? null }, { onConflict: "post_id,collected_date" });
    }
  }
  return Response.json({ found: items.length, matched, inserted });
});
