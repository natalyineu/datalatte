import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Receives direct e-mails to hi@datalatte.pro from a Zoho Mail filter + custom function
 * (Zoho free plan has no IMAP / forwarding). Saves them as leads and pings Telegram.
 *
 * Auth: header `x-inbound-secret` must equal env INBOUND_EMAIL_SECRET.
 * Body (JSON): { from, subject, snippet?, messageId?, date? }
 */
const SECRET = process.env.INBOUND_EMAIL_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function authorized(req: NextRequest): boolean {
  if (!SECRET) return false;
  const got = Buffer.from(req.headers.get("x-inbound-secret") ?? "");
  const want = Buffer.from(SECRET);
  return got.length === want.length && timingSafeEqual(got, want);
}

// Bare address from `Name <addr@x.com>` or `addr@x.com`
function parseFrom(raw: string): { email: string; name: string } {
  const m = raw.match(/^(.*?)<([^>]+)>\s*$/);
  const email = (m ? m[2] : raw).trim().toLowerCase();
  const name = m ? m[1].replace(/["']/g, "").trim() : "";
  return { email, name };
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }); }

  const { email, name } = parseFrom(clip(body.from, 300));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid sender" }, { status: 400 });

  // Skip our own mail (site notifications, auto-replies, bounces)
  if (/@datalatte\.pro$/.test(email) || /^(mailer-daemon|postmaster|no-?reply|noreply)@/.test(email)) {
    return NextResponse.json({ skipped: true });
  }

  const subject = clip(body.subject, 200);
  const snippet = clip(body.snippet, 1500);
  const message = [subject && `Subject: ${subject}`, snippet].filter(Boolean).join("\n\n");

  const tasks: Promise<unknown>[] = [];
  if (SUPABASE_URL && SUPABASE_KEY) {
    tasks.push(
      fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          email, name: name || null, message, form_type: "direct_email", status: "new",
          notes: clip(body.messageId, 200) ? `zoho-message-id: ${clip(body.messageId, 200)}` : null,
        }),
      }).catch((e) => console.error("inbound-email: Supabase save failed", e)),
    );
  }
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    tasks.push(
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID, parse_mode: "HTML",
          text: `✉️ <b>New e-mail to hi@</b>\n📨 ${esc(email)}${name ? `\n👤 ${esc(name)}` : ""}${subject ? `\n📌 ${esc(subject)}` : ""}`,
        }),
      }).catch((e) => console.error("inbound-email: Telegram failed", e)),
    );
  }
  await Promise.allSettled(tasks);
  return NextResponse.json({ success: true });
}
