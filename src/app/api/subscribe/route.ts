import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE = "Subscribers";
const RESEND_API_KEY = process.env.RESEND_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { email, source = "blog" } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Save to Airtable
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Email: email,
            Source: source,
            Date: new Date().toISOString().split("T")[0],
          },
        }),
      }
    );

    if (!airtableRes.ok) {
      const err = await airtableRes.json();
      console.error("Airtable error:", err);
      // Don't fail the whole request if Airtable has a duplicate — just continue
      if (err?.error?.type !== "INVALID_VALUE_FOR_COLUMN") {
        return NextResponse.json({ error: "Could not save subscriber" }, { status: 500 });
      }
    }

    // Send welcome email via Resend
    if (RESEND_API_KEY) {
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
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
