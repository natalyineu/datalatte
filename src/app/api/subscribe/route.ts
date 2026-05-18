import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY      = process.env.RESEND_API_KEY!;
const RESEND_AUDIENCE_ID  = process.env.RESEND_AUDIENCE_ID;
const TELEGRAM_BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID    = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function addToResendAudience(email: string) {
  if (!RESEND_AUDIENCE_ID) return;
  try {
    await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  } catch (err) {
    console.error("Resend audience add failed:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, source = "blog" } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1. Add to Resend audience (fire-and-forget)
    addToResendAudience(email).catch(() => {});

    // 2. Send welcome email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nataliia at DataLatte <hi@datalatte.pro>",
        to: email,
        subject: "You're in ☕ — Welcome to DataLatte",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333">
            <h2 style="color:#5c3317">Welcome to DataLatte ☕</h2>
            <p>Hey! Thanks for subscribing.</p>
            <p>Every week I share practical, no-fluff local marketing tips — things that actually move the needle for small businesses like yours.</p>
            <p>In the meantime, here are a few places to start:</p>
            <ul>
              <li><a href="https://datalatte.pro/tools/marketing-budget-calculator" style="color:#7c4a2d">Free Marketing Budget Calculator</a> — find out exactly how much to spend and where</li>
              <li><a href="https://datalatte.pro/blog" style="color:#7c4a2d">The DataLatte Blog</a> — practical, no-fluff local marketing tips</li>
              <li><a href="https://datalatte.pro/services/google-ads" style="color:#7c4a2d">Google Ads for Local Businesses</a> — how it works and what to expect</li>
            </ul>
            <p>Got a question or want a free audit of your marketing? Just reply to this email — I read every one.</p>
            <p style="margin-top:32px">— Nataliia<br><span style="color:#888;font-size:13px">Founder, DataLatte</span></p>
            <hr style="margin:32px 0;border:none;border-top:1px solid #eee">
            <p style="font-size:12px;color:#aaa">
              You subscribed at datalatte.pro. Source: ${escapeHtml(source)}.
              To unsubscribe, reply with "unsubscribe" in the subject line.
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend welcome email failed:", err);
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
    }

    // 3. Telegram notification (optional)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `🎉 New subscriber!\n${email}\nSource: ${source}`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
