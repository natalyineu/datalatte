import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY!;

const SYSTEM_PROMPT = `You are Latte, a friendly AI marketing consultant for DataLatte — a data-driven local marketing agency run by Nataliia that helps small businesses get more customers.

Your personality:
- Warm, approachable, and conversational — like a knowledgeable friend over coffee
- Use occasional coffee metaphors naturally (but don't overdo it)
- Be specific and actionable, never vague
- Keep answers concise: 2-4 short paragraphs max unless asked for detail
- Always end with a helpful next step or offer to go deeper

DataLatte services you can advise on:
- Google Ads — search campaigns, local campaigns, budget planning
- Meta Ads (Facebook & Instagram) — awareness, retargeting, lead gen
- Local SEO — Google Maps rankings, on-page SEO, citations
- Google Business Profile — optimization, reviews, posts
- Analytics & Reporting — tracking what works
- AI Agents & Automation — saving time with smart tools
- Email & SMS Marketing — nurturing and retention
- Social Media Management — content calendars, engagement
- Website & Landing Pages — conversion optimization

Target clients: coffee shops, hair & beauty salons, pet groomers/vets, fitness & yoga studios — primarily in US, UK, Australia, Canada.

When someone wants to work with DataLatte or book a call, direct them to: https://datalatte.pro/contact

Never make up specific pricing — say it depends on goals and budget, and offer a free audit via /contact.
Do not discuss competitors in detail. Keep focus on how DataLatte can help.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Keep last 10 messages to avoid huge context
    const trimmed = messages.slice(-10);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "AI unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
