// Publishes due social_posts (platform='linkedin', status='scheduled') to the DataLatte LinkedIn company page.
// Needs LinkedIn app with "Community Management API" (w_organization_social).
// Secrets: LINKEDIN_ORG_ID (numeric page id), LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET,
//          LINKEDIN_TOKEN (access token), LINKEDIN_REFRESH_TOKEN (optional), LINKEDIN_VERSION (optional, e.g. 202510)
// A refreshed access token is stored in social_settings.linkedin_token and preferred.
// Post text: everything before a line "---COMMENT---"; text after it is posted as the first comment.
// Modes: ?whoami=1, ?refresh=1, ?dry=1
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const API = "https://api.linkedin.com";
const VER = Deno.env.get("LINKEDIN_VERSION") ?? "202510";
const ORG = `urn:li:organization:${Deno.env.get("LINKEDIN_ORG_ID")}`;

async function token(): Promise<string> {
  const { data } = await sb.from("social_settings").select("value").eq("key", "linkedin_token").maybeSingle();
  return data?.value || Deno.env.get("LINKEDIN_TOKEN")!;
}
const hdr = (t: string, extra: Record<string, string> = {}) => ({
  Authorization: `Bearer ${t}`, "LinkedIn-Version": VER, "X-Restli-Protocol-Version": "2.0.0", "Content-Type": "application/json", ...extra,
});
// LinkedIn "little text" reserves these characters
const esc = (s: string) => s.replace(/[\\|{}@\[\]()<>#*_~]/g, (c) => "\\" + c);

async function refresh(): Promise<{ ok: boolean; msg?: string }> {
  const rt = Deno.env.get("LINKEDIN_REFRESH_TOKEN");
  if (!rt) return { ok: false, msg: "no LINKEDIN_REFRESH_TOKEN" };
  const r = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: rt, client_id: Deno.env.get("LINKEDIN_CLIENT_ID")!, client_secret: Deno.env.get("LINKEDIN_CLIENT_SECRET")! }),
  });
  const j = await r.json();
  if (!r.ok) return { ok: false, msg: j.error_description ?? j.error };
  await sb.from("social_settings").upsert({ key: "linkedin_token", value: j.access_token }, { onConflict: "key" });
  return { ok: true, msg: `expires_in_days=${Math.round(j.expires_in / 86400)}` };
}

async function upload(t: string, kind: "videos" | "images", url: string): Promise<string> {
  const bin = new Uint8Array(await (await fetch(url)).arrayBuffer());
  const init = await fetch(`${API}/rest/${kind}?action=initializeUpload`, {
    method: "POST", headers: hdr(t),
    body: JSON.stringify({ initializeUploadRequest: { owner: ORG, ...(kind === "videos" ? { fileSizeBytes: bin.length, uploadCaptions: false, uploadThumbnail: false } : {}) } }),
  });
  const ij = await init.json();
  if (!init.ok) throw new Error(`init ${kind}: ${ij.message ?? init.status}`);
  const v = ij.value; const etags: string[] = [];
  if (kind === "videos") {
    for (const p of v.uploadInstructions) {
      const part = bin.slice(p.firstByte, p.lastByte + 1);
      const r = await fetch(p.uploadUrl, { method: "PUT", headers: { "Content-Type": "application/octet-stream" }, body: part });
      if (!r.ok) throw new Error(`upload part: ${r.status}`);
      etags.push(r.headers.get("etag") ?? "");
    }
    const fin = await fetch(`${API}/rest/videos?action=finalizeUpload`, {
      method: "POST", headers: hdr(t), body: JSON.stringify({ finalizeUploadRequest: { video: v.video, uploadToken: v.uploadToken ?? "", uploadedPartIds: etags } }),
    });
    if (!fin.ok) throw new Error(`finalize: ${fin.status} ${await fin.text()}`);
    // wait until processed
    for (let i = 0; i < 20; i++) {
      const s = await (await fetch(`${API}/rest/videos/${encodeURIComponent(v.video)}`, { headers: hdr(t) })).json();
      if (s.status === "AVAILABLE") break;
      if (s.status === "PROCESSING_FAILED") throw new Error("video processing failed");
      await new Promise((r) => setTimeout(r, 4000));
    }
    return v.video;
  }
  const r = await fetch(v.uploadUrl, { method: "PUT", headers: { "Content-Type": "application/octet-stream" }, body: bin });
  if (!r.ok) throw new Error(`upload image: ${r.status}`);
  return v.image;
}

Deno.serve(async (req) => {
  const url = new URL(req.url); const q = (k: string) => url.searchParams.get(k) === "1";
  if (q("refresh")) return Response.json(await refresh());
  const t = await token();
  if (q("whoami")) {
    const r = await fetch(`${API}/rest/organizations/${Deno.env.get("LINKEDIN_ORG_ID")}`, { headers: hdr(t) });
    const j = await r.json();
    return Response.json(r.ok ? { id: j.id, name: j.localizedName } : { error: j.message ?? r.status });
  }

  const { data: posts, error } = await sb.from("social_posts").select("*").eq("platform", "linkedin").eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(2);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const out: unknown[] = [];
  for (const p of posts ?? []) {
    if (q("dry")) { out.push({ id: p.id, title: p.title, dry: true }); continue; }
    await sb.from("social_posts").update({ status: "failed", error_message: "in flight" }).eq("id", p.id);
    try {
      const [body, comment] = String(p.content).split(/\n---COMMENT---\n/);
      const post: Record<string, unknown> = {
        author: ORG, commentary: esc(body.trim()), visibility: "PUBLIC", lifecycleState: "PUBLISHED", isReshareDisabledByAuthor: false,
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      };
      if (p.media_url) {
        const kind = p.media_type === "video" ? "videos" : "images";
        post.content = { media: { id: await upload(t, kind, p.media_url), title: (p.title ?? "DataLatte").slice(0, 100) } };
      }
      const r = await fetch(`${API}/rest/posts`, { method: "POST", headers: hdr(t), body: JSON.stringify(post) });
      if (!r.ok) throw new Error(`post: ${r.status} ${(await r.text()).slice(0, 300)}`);
      const postUrn = r.headers.get("x-restli-id")!;
      if (comment?.trim()) {
        await fetch(`${API}/rest/socialActions/${encodeURIComponent(postUrn)}/comments`, {
          method: "POST", headers: hdr(t), body: JSON.stringify({ actor: ORG, object: postUrn, message: { text: comment.trim() } }),
        });
      }
      await sb.from("social_posts").update({
        status: "published", post_id_external: postUrn, post_url: `https://www.linkedin.com/feed/update/${postUrn}`,
        published_at: new Date().toISOString(), error_message: null,
      }).eq("id", p.id);
      out.push({ id: p.id, ok: true, urn: postUrn });
    } catch (e) {
      await sb.from("social_posts").update({ status: "failed", error_message: String(e).slice(0, 500) }).eq("id", p.id);
      out.push({ id: p.id, ok: false, error: String(e) });
    }
  }
  return Response.json({ processed: out });
});
