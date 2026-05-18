import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY     = process.env.RESEND_API_KEY!;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const NICHE_LABELS: Record<string, string> = {
  coffee:     "Coffee Shop",
  salon:      "Hair & Beauty",
  grooming:   "Pet Business",
  fitness:    "Fitness Studio",
  startup:    "Startup",
  freelancer: "Freelancer / Consultant",
  other:      "Other",
};

async function addToResendAudience(email: string, name?: string) {
  if (!RESEND_AUDIENCE_ID) return;
  try {
    await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: name?.split(" ")[0] ?? undefined,
        last_name: name?.split(" ").slice(1).join(" ") || undefined,
        unsubscribed: false,
      }),
    });
  } catch (err) {
    console.error("Resend audience add failed:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email?: string;
      name?: string;
      niche?: string;
      message?: string;
      form_type?: string;
    };

    const { email, name, niche, message, form_type = "explore" } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const nicheLabel = niche ? (NICHE_LABELS[niche] ?? niche) : null;

    // 1. Add to Resend audience (fire-and-forget)
    addToResendAudience(email, name).catch(() => {});

    // 2. Notify Nataliia via Resend
    const safeEmail     = escapeHtml(email);
    const safeName      = name    ? escapeHtml(name)    : null;
    const safeMessage   = message ? escapeHtml(message) : null;
    const safeNicheLabel = nicheLabel ? escapeHtml(nicheLabel) : null;

    const subject = form_type === "ready"
      ? `🔥 New lead: ${name || email}${nicheLabel ? ` (${nicheLabel})` : ""}`
      : `📧 New enquiry from ${email}`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DataLatte Contact <hi@datalatte.pro>",
        to: "hi@datalatte.pro",
        reply_to: email,
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333">
            <h2 style="color:#5c3317">New contact form submission</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;font-weight:bold;width:140px">Form type</td><td>${form_type === "ready" ? "Ready to start 🔥" : "Just exploring"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold">Email</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
              ${safeName      ? `<tr><td style="padding:8px 0;font-weight:bold">Name</td><td>${safeName}</td></tr>` : ""}
              ${safeNicheLabel ? `<tr><td style="padding:8px 0;font-weight:bold">Business type</td><td>${safeNicheLabel}</td></tr>` : ""}
              ${safeMessage   ? `<tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Message</td><td style="white-space:pre-wrap">${safeMessage}</td></tr>` : ""}
            </table>
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
            <p style="font-size:12px;color:#aaa">Sent from datalatte.pro/contact</p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Resend contact notification failed:", err);
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }

    // 3. Confirmation email to the visitor
    const confirmSubject = form_type === "ready"
      ? "Got it! I'll be in touch soon ☕"
      : "Thanks for reaching out — Nataliia @ DataLatte";

    const confirmHtml = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#333">
        <div style="background:linear-gradient(135deg,#7c4a2d,#a0622a);padding:32px 32px 24px;border-radius:16px 16px 0 0;text-align:center">
          <p style="font-size:28px;margin:0 0 8px">☕</p>
          <h1 style="color:#fff;font-size:20px;margin:0;font-weight:700">${form_type === "ready" ? "You're on my radar 🔥" : "Message received!"}</h1>
        </div>
        <div style="background:#fff;padding:28px 32px;border:1px solid #eee;border-top:none;border-radius:0 0 16px 16px">
          <p style="margin:0 0 16px">Hey${safeName ? ` ${safeName}` : ""}! 👋</p>
          <p style="margin:0 0 16px;line-height:1.6">
            ${form_type === "ready"
              ? "Thanks for reaching out — I can see you mean business. I'll review what you've shared and get back to you <strong>within one business day</strong> with thoughts on how I can help."
              : "Thanks for your message! I'll take a look and get back to you <strong>within one business day</strong> — usually sooner."}
          </p>
          <p style="margin:0 0 24px;line-height:1.6">In the meantime, feel free to browse the blog — I write practical, no-fluff marketing tips for local businesses every week.</p>
          <a href="https://datalatte.pro/blog" style="display:inline-block;background:#7c4a2d;color:#fff;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none">Read the blog →</a>
          <hr style="margin:28px 0;border:none;border-top:1px solid #f0ebe6">
          <p style="margin:0;line-height:1.6">Talk soon,<br><strong>Nataliia</strong><br><span style="color:#999;font-size:13px">Founder, DataLatte · <a href="https://datalatte.pro" style="color:#7c4a2d">datalatte.pro</a></span></p>
        </div>
        <p style="text-align:center;font-size:11px;color:#bbb;margin-top:16px">You're receiving this because you contacted us at datalatte.pro.</p>
      </div>
    `;

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Nataliia at DataLatte <hi@datalatte.pro>",
        to: email,
        reply_to: "hi@datalatte.pro",
        subject: confirmSubject,
        html: confirmHtml,
      }),
    }).catch((err) => console.error("Confirmation email failed:", err));

    // 4. Telegram notification (use escaped values to avoid breaking HTML parse mode)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const msgPreview = message ? message.slice(0, 120) + (message.length > 120 ? "…" : "") : null;
      const parts = [
        form_type === "ready" ? "🔥 <b>New lead (ready to start)</b>" : "📧 <b>New enquiry</b>",
        `📨 ${safeEmail}`,
        safeName      && `👤 ${safeName}`,
        safeNicheLabel && `🏪 ${safeNicheLabel}`,
        msgPreview    && `💬 ${escapeHtml(msgPreview)}`,
      ].filter(Boolean);

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: parts.join("\n"),
          parse_mode: "HTML",
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
