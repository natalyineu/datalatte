import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY    = process.env.RESEND_API_KEY!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID  = process.env.TELEGRAM_CHAT_ID;
const AIRTABLE_TOKEN    = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID  = process.env.AIRTABLE_BASE_ID;

// Leads table in DataLatte CRM
const AIRTABLE_TABLE = "Leads";

async function saveToAirtable(email: string, source: string) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) return;
  try {
    await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Lead Name": email.split("@")[0],
            "Email": email,
            "Lead Source": "Newsletter",
            "Lead Status": "New",
          },
        }),
      }
    );
  } catch (err) {
    // Non-fatal — don't block the response
    console.error("Airtable save failed:", err);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const { email, source = "blog" } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1. Save to Airtable CRM (fire-and-forget, non-blocking)
    saveToAirtable(email, source).catch(() => {});

    // 2. Send welcome email via Resend
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
            <p>In the meantime, here are a few posts to get you started:</p>
            <ul>
              <li><a href="https://datalatte.pro/blog/coffee-shops-dominate-google-maps" style="color:#7c4a2d">How Coffee Shops Can Dominate Google Maps</a></li>
              <li><a href="https://datalatte.pro/blog/google-business-profile-optimization-checklist" style="color:#7c4a2d">Google Business Profile Optimization Checklist</a></li>
              <li><a href="https://datalatte.pro/blog/local-marketing-budget-guide" style="color:#7c4a2d">Local Marketing Budget Guide</a></li>
            </ul>
            <p>Got a question or want a free audit of your marketing? Just reply to this email — I read every one.</p>
            <p style="margin-top:32px">— Nataliia<br><span style="color:#888;font-size:13px">Founder, DataLatte</span></p>
            <hr style="margin:32px 0;border:none;border-top:1px solid #eee">
            <p style="font-size:12px;color:#aaa">
              You subscribed at datalatte.pro. Source: ${escapeHtml(source)}.
              To unsubscribe, reply to this email with "unsubscribe" in the subject line.
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
    }

    // 3. Notify via Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const msg = `🎉 New subscriber!\n${email}\nSource: ${source}`;
      fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg }),
        }
      ).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
