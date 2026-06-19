import type { Metadata } from "next";
import Link from "next/link";
import { Users, Zap, BarChart2, CheckCircle2, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/services/ai-agents/lead-capture";
const PAGE_TITLE = "AI Lead Capture Agent for Local Businesses: Qualify & Convert Enquiries Automatically in 2026";
const PAGE_DESC =
  "Stop losing warm leads to slow responses. An AI lead capture agent qualifies website visitors, DMs, and ad clicks in real time — collecting contact details, understanding their needs, and routing hot prospects to your CRM or booking system automatically.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const useCases = [
  {
    icon: <Users size={20} className="text-coffee-600" />,
    title: "Website visitors who don't book",
    body: "A visitor lands on your pricing page but doesn't convert. The lead capture agent engages them: 'Looking for something specific? I can help find the right option for you.' Collects their name, need, and contact — then routes to your CRM or directly books a consultation.",
  },
  {
    icon: <Zap size={20} className="text-coffee-600" />,
    title: "Paid ad click traffic",
    body: "Someone clicks your Google Ad or Meta Ad, lands on your page, but leaves without converting. The agent catches them before they bounce: 'Hi! You came from our ad — can I answer any questions about [service]?' Reduces wasted ad spend by converting more clicks into contacts.",
  },
  {
    icon: <BarChart2 size={20} className="text-coffee-600" />,
    title: "Instagram and Facebook DM enquiries",
    body: "Someone DMs 'how much does X cost?' The lead capture agent responds immediately, qualifies their budget and timeline, captures their contact, and either books them or routes them to your sales process — even if the DM arrived at 11pm.",
  },
  {
    icon: <CheckCircle2 size={20} className="text-coffee-600" />,
    title: "Free resource and checklist leads",
    body: "Someone downloads your free marketing checklist or audit template. The lead capture agent follows up immediately: a personalised message referencing the resource they downloaded, a qualifying question, and an offer of a free consultation. Turns cold downloads into warm conversations.",
  },
];

const qualificationFlow = [
  { q: "What do they need?", a: "Service, product, or solution they're looking for" },
  { q: "What's their budget?", a: "General range — not a price negotiation, just qualification" },
  { q: "What's their timeline?", a: "Ready now, in a month, researching — changes your follow-up urgency" },
  { q: "What's their decision context?", a: "Solo decision-maker, consulting partner, comparing options" },
  { q: "What's the best way to reach them?", a: "Phone, email, WhatsApp — their preference captured at source" },
  { q: "What's a good time?", a: "For hot leads, books a callback slot directly in your calendar" },
];

const conversation = [
  { role: "agent", text: "Hi! I noticed you were looking at our local marketing packages — can I help you find the right fit? What type of business are you running?" },
  { role: "customer", text: "I have a hair salon in Manchester, about 3 staff" },
  { role: "agent", text: "Great — salons are one of our specialities. Are you mainly looking to get more new clients, or is it more about reducing no-shows and getting Google reviews from existing ones?" },
  { role: "customer", text: "Bit of both honestly, but more new clients" },
  { role: "agent", text: "That makes sense. For new client growth, we'd typically start with Google Business Profile optimisation and a Google Ads campaign — most salons in Manchester see results within the first 60 days. What's your rough monthly marketing budget at the moment?" },
  { role: "customer", text: "Around £300–400 a month" },
  { role: "agent", text: "That's a solid starting budget for Google Ads + GBP management. Would it be helpful to have a quick 20-minute call to look at your current Google presence and give you a proper picture of what's achievable? What's the best number and time to reach you?" },
  { role: "customer", text: "07712 345678 — any weekday morning is fine" },
  { role: "agent", text: "Noted! I'll have Nataliia reach out tomorrow morning. She'll have already looked at your Google listing before the call so you're not starting from scratch. Talk soon!" },
];

const crms = [
  "GoHighLevel", "HubSpot", "Pipedrive", "Salesforce", "Zoho CRM",
  "Notion", "Airtable", "Google Sheets", "Mailchimp", "Klaviyo",
  "ActiveCampaign", "Slack (lead notifications)", "Email (lead digest)",
];

const faqs = [
  {
    q: "How is this different from a lead form on my website?",
    a: "A lead form is passive — the visitor fills it in, submits it, and you might respond hours later. By then they've contacted two other businesses. An AI lead capture agent is active: it engages the visitor in real time, asks qualification questions conversationally, captures their details, and can book a consultation immediately. Response time is the single biggest driver of lead conversion rate — the agent responds in seconds, not hours.",
  },
  {
    q: "Can it qualify leads based on my specific criteria?",
    a: "Yes — we configure qualification logic specific to your business. For a marketing agency: monthly budget, business type, urgency. For a cleaning company: property size, frequency, postcode coverage. For a personal trainer: fitness goals, availability, budget. The agent only routes leads to your CRM when they meet your minimum qualification threshold — meaning you spend time on prospects who actually fit.",
  },
  {
    q: "What happens to leads that don't qualify?",
    a: "Unqualified leads are handled graciously. The agent thanks them, provides genuinely useful information (a blog post, a checklist, an FAQ page), and captures their email for a lower-priority nurture sequence. Some leads that don't qualify today convert in 3–6 months when their situation changes — capturing them now costs nothing.",
  },
  {
    q: "Can this integrate with my existing CRM or email tool?",
    a: "Yes. We integrate with all major CRMs and automation platforms: GoHighLevel, HubSpot, Pipedrive, Zoho, Salesforce, and simpler tools like Notion or Airtable. Qualified leads are pushed as new contacts with all qualifying data filled in. You can also receive a real-time Slack or email notification for hot leads so you can follow up personally within minutes.",
  },
  {
    q: "What about leads from paid ads — does this affect my ad performance?",
    a: "Positively. Lower bounce rates and higher on-page engagement (triggered by the agent's chat) are signals Google and Meta use to assess landing page quality. Businesses typically see landing page quality scores improve when adding a lead capture agent — which can reduce cost-per-click. More importantly, your ad spend converts better: same budget, more leads captured.",
  },
];

export default function AILeadCapturePage() {
  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "AI Agents", url: "https://datalatte.pro/services/ai-agents" },
      { name: "AI Lead Capture", url: "https://datalatte.pro/services/ai-agents/lead-capture" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agent Skill · Lead Capture & Qualification</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Turn website visitors<br />
              <span className="text-coffee-300">into booked customers.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Most local business websites convert 1–3% of visitors. The other 97% leave — and
              you never know they were there. An AI lead capture agent engages visitors in real
              time, qualifies their need and budget, captures their contact, and routes hot
              prospects to your booking system or CRM before they open a competitor's tab.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Set up your lead capture agent →</Link>
              <Link href="/services/ai-agents" className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                All AI agent skills
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Stats */}
      <div className="bg-coffee-50 border-b border-coffee-100 py-8">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "97%", label: "Of website visitors leave without converting" },
              { value: "5 min", label: "Response time multiplies lead conversion by 21× vs 30 min" },
              { value: "3–5×", label: "More leads captured from the same ad spend" },
              { value: "24/7", label: "Lead qualification running even when you're unavailable" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-coffee-700">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>

      {/* Use cases */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">Every lead source, captured</h2>
        <p className="text-gray-600 max-w-2xl mb-14">Leads arrive through multiple channels. The lead capture agent works across all of them — qualifying and routing each one.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc) => (
            <div key={uc.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-coffee-50 p-2 rounded-lg">{uc.icon}</div>
                <h3 className="font-semibold text-gray-900">{uc.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{uc.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Qualification framework */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="section-title mb-3">What the agent qualifies</h2>
              <p className="text-gray-600 mb-8">Every lead is scored against your qualification criteria — so you only spend time on prospects who are actually ready and right for your business.</p>
              <div className="space-y-4">
                {qualificationFlow.map((item) => (
                  <div key={item.q} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-coffee-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.q}</p>
                      <p className="text-sm text-gray-500">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Live conversation example — local marketing enquiry</p>
              <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Website chat — visitor on pricing page
                </p>
                <div className="space-y-3">
                  {conversation.map((msg, j) => (
                    <div key={j} className={`flex ${msg.role === "agent" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "agent" ? "bg-gray-700 text-gray-100 rounded-tl-sm" : "bg-coffee-600 text-white rounded-tr-sm"
                      }`}>
                        {msg.role === "agent" && <p className="text-xs text-coffee-300 font-semibold mb-1">AI Agent</p>}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* CRM integrations */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">Qualified leads flow into your CRM automatically</h2>
        <p className="text-gray-600 max-w-2xl mb-10">Every qualified lead is pushed as a new contact with all data pre-filled. Hot leads trigger real-time Slack or SMS notifications so you can follow up personally within minutes.</p>
        <div className="flex flex-wrap gap-2">
          {crms.map((c) => (
            <span key={c} className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-full">{c}</span>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-10">Lead capture agent questions</h2>
          <div className="max-w-3xl space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      <CTABanner
        headline="Stop letting warm leads go cold"
        sub="Free audit — we'll review your current website conversion rate, identify where leads are dropping off, and show you exactly what a lead capture agent would add to your funnel."
        ctaLabel="Get your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
