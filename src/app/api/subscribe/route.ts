import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const { email, source = "blog" } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Send welcome email to subscriber
    await fetch("https://api.resend.com/emails", {
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
            <p style="font-size:12px;color:#aaa">You subscribed at datalatte.pro. <a href="https://datalatte.pro" style="color:#aaa">Unsubscribe</a> any time.</p>
          </div>
        `,
      }),
    });

    // Notify via Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const msg = `🎉 New subscriber!%0A${email}%0ASource: ${source}`;
      fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${msg}`
      ).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
