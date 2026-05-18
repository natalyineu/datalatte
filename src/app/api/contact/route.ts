import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY     = process.env.RESEND_API_KEY!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
const AIRTABLE_TOKEN     = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID   = process.env.AIRTABLE_BASE_ID;

const NICHE_LABELS: Record<string, string> = {
  coffee:     "Coffee Shop",
  salon:      "Hair & Beauty",
  grooming:   "Pet Business",
  fitness:    "Fitness Studio",
  startup:    "Startup",
  freelancer: "Freelancer / Consultant",
  other:      "Other",
};

async function saveLeadToAirtable(fields: {
  name?: string;
  email: string;
  niche?: string;
  message?: string;
  formType: string;
}) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) return;
  try {
    await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Lead Name": fields.name || fields.email.split("@")[0],
            "Email":      fields.email,
            "Lead Source": fields.formType === "ready" ? "Contact Form — Ready" : "Contact Form — Exploring",
            "Lead Status": "New",
          },
        }),
      }
    );
  } catch (err) {
    console.error("Airtable lead save failed:", err);
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

    // 1. Save to Airtable CRM (fire-and-forget)
    saveLeadToAirtable({ name, email, niche, message, formType: form_type }).catch(() => {});

    // 2. Notify Nataliia via Resend
    const subject = form_type === "ready"
      ? `🔥 New lead: ${name || email}${nicheLabel ? ` (${nicheLabel})` : ""}`
      : `📧 New enquiry from ${email}`;

    await fetch("https://api.resend.com/emails", {
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
              <tr><td style="padding:8px 0;font-weight:bold">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
              ${name ? `<tr><td style="padding:8px 0;font-weight:bold">Name</td><td>${name}</td></tr>` : ""}
              ${nicheLabel ? `<tr><td style="padding:8px 0;font-weight:bold">Business type</td><td>${nicheLabel}</td></tr>` : ""}
              ${message ? `<tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Message</td><td style="white-space:pre-wrap">${message}</td></tr>` : ""}
            </table>
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
            <p style="font-size:12px;color:#aaa">Sent from datalatte.pro/contact</p>
          </div>
        `,
      }),
    });

    // 3. Telegram notification
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const parts = [
        form_type === "ready" ? "🔥 <b>New lead (ready to start)</b>" : "📧 <b>New enquiry</b>",
        `📨 ${email}`,
        name && `👤 ${name}`,
        nicheLabel && `🏪 ${nicheLabel}`,
        message && `💬 ${message.slice(0, 120)}${message.length > 120 ? "…" : ""}`,
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
