import type { Metadata } from "next";
import Link from "next/link";
import { Instagram, Calendar, CheckCircle2, Zap, Image, BarChart2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/services/ai-agents/social-media";
const PAGE_TITLE =
  "AI Social Media Agent for Local Businesses: Automate Instagram, Facebook & Google Posts in 2026";
const PAGE_DESC =
  "AI agent that writes, schedules, and publishes social media content for local businesses — Instagram captions, Facebook posts, Google Business Profile updates, automated from your booking data and reviews.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

// ── Pipeline steps ────────────────────────────────────────────────────────────

const pipeline = [
  {
    step: "1",
    title: "Trigger fires automatically",
    body: "Three triggers kick off content generation: a daily 9am cron for scheduled posts, a new booking webhook for confirmation/promo content, and a new review event to generate a review-highlight post.",
  },
  {
    step: "2",
    title: "Context pulled from your systems",
    body: "Agent reads your upcoming appointments, recent reviews, current promotions, and seasonal calendar. It knows if Tuesday is slow at your café and can push a daily special — without you lifting a finger.",
  },
  {
    step: "3",
    title: "Platform-native content generated",
    body: "Claude 3.5 Sonnet writes captions tailored per platform: Instagram gets hashtags + emoji, Facebook gets longer conversational copy, GBP gets SEO-keyword-rich updates that signal relevance to Google Maps.",
  },
  {
    step: "4",
    title: "Image selected, resized, and prepped",
    body: "GPT-4o Vision analyses your image library and selects the most relevant photo. It auto-crops to platform specs: 1:1 for Instagram feed, 9:16 for Stories, 4:3 for Facebook, 1200×900 for GBP.",
  },
  {
    step: "5",
    title: "Scheduled via platform APIs",
    body: "Posts go through Meta Graph API for Instagram/Facebook and Google My Business API for GBP. Timing is optimised for your audience's peak engagement window, not just 'whenever the cron runs.'",
  },
  {
    step: "6",
    title: "Logged and reported",
    body: "Every post is logged to a Google Sheet with platform, caption, post time, and performance data pulled 48 hours later. Monthly report delivered automatically — reach, engagement, and what content worked best.",
  },
];

// ── Niche content examples ────────────────────────────────────────────────────

const nicheExamples = [
  {
    niche: "Hair salons",
    icon: "✂️",
    examples: [
      "Before/after transformation posts auto-generated when a stylist marks a colour appointment complete",
      "Seasonal colour trend posts linked to your current promotions",
      "Staff spotlight posts pulled from your team profiles",
      "Review highlight posts featuring specific service mentions from Google reviews",
    ],
  },
  {
    niche: "Coffee shops & cafés",
    icon: "☕",
    examples: [
      "Daily specials post at 7:30am every morning — pulled from your POS menu",
      "Seasonal drink announcements when new menu items are added",
      "Behind-the-scenes posts based on your content calendar",
      "Community event promotions with date/time pulled from your booking system",
    ],
  },
  {
    niche: "Fitness studios & gyms",
    icon: "🏋️",
    examples: [
      "Weekly class schedule posted every Sunday evening",
      "Member transformation spotlights (with permission) when trainers tag progress",
      "Upcoming workshop or challenge announcements",
      "Motivational Monday posts tied to your membership offers",
    ],
  },
  {
    niche: "Pet groomers",
    icon: "🐾",
    examples: [
      "After-groom 'reveal' posts when appointments are marked complete",
      "Breed-specific grooming tip posts drawn from your knowledge base",
      "Appointment availability reminders for peak booking periods",
      "Seasonal posts (summer shave-downs, Halloween costumes) on auto-schedule",
    ],
  },
];

// ── What's included ───────────────────────────────────────────────────────────

const included = [
  { icon: Instagram, label: "Caption writing in brand voice", detail: "Onboarded from your top 5–10 posts. Voice profile refreshed monthly." },
  { icon: Zap, label: "Hashtag research & rotation", detail: "Platform-specific hashtag sets, rotated to avoid shadowbanning." },
  { icon: Image, label: "Image prompt generation", detail: "DALL-E/Midjourney prompts for original content, or auto-resize from your library." },
  { icon: Calendar, label: "Meta Graph API scheduling", detail: "Instagram and Facebook posts scheduled and published without manual intervention." },
  { icon: CheckCircle2, label: "GBP post automation", detail: "Google Business Profile updates via the Google My Business API — improves local SEO signals." },
  { icon: BarChart2, label: "Monthly content calendar + performance report", detail: "Planned content 30 days ahead, plus reach/engagement data pulled automatically." },
];

// ── Integrations ──────────────────────────────────────────────────────────────

const integrations = [
  { name: "Instagram Graph API", detail: "Publish feed posts, Stories, and carousels via official API" },
  { name: "Facebook Pages API", detail: "Post to your Facebook Page, schedule in advance, pull analytics" },
  { name: "Google Business Profile API", detail: "Publish GBP posts (What's New, Offers, Events) via Google My Business API" },
  { name: "Canva API", detail: "Generate on-brand image templates automatically for each post type" },
  { name: "n8n / Make.com", detail: "Workflow orchestration — connects booking systems, review sources, and social APIs" },
  { name: "Google Sheets", detail: "Content calendar logging, performance data, pause/resume flags" },
];

// ── Impact stats ──────────────────────────────────────────────────────────────

const impact = [
  { metric: "8–12×", label: "More posts per month vs manual posting" },
  { metric: "3–4 hrs", label: "Saved per week on content creation and scheduling" },
  { metric: "~35%", label: "Average engagement increase from consistent posting cadence" },
  { metric: "2–3×", label: "More GBP views with weekly update cadence" },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Does it just copy-paste the same caption everywhere?",
    a: "No — each platform gets platform-native content. Instagram gets hashtags + emoji optimised for discovery, Facebook gets longer conversational copy that performs better in the feed algorithm, and GBP gets SEO-keyword-rich updates that signal relevance to Google Maps and local search. The same core message, but written natively for each channel.",
  },
  {
    q: "What happens if I have a bad week and don't want it posting?",
    a: "There's a built-in pause mechanism. Send a WhatsApp message to the agent ('pause until Friday') or toggle a flag in the linked Google Sheet — posting stops immediately for the date range you specify. No posts will go live until you unpause. You can also preview and approve posts before they publish if you prefer to stay in the loop.",
  },
  {
    q: "Can it generate images too?",
    a: "It can generate image prompts for DALL-E and Midjourney, and describe image compositions for your designer or photographer. For regulated industries like salons and pet groomers, we recommend using your own real photos — the agent can auto-resize and crop your uploaded images to every platform's exact specifications (Instagram 1:1, Stories 9:16, Facebook 4:3, GBP 1200×900). GPT-4o Vision also analyses your image library and suggests the best match for each post.",
  },
  {
    q: "How does it learn my brand voice?",
    a: "Initial onboarding: you share 5–10 posts you love — could be your own past posts, competitors you admire, or examples from any brand. These are analysed and distilled into a voice profile: tone adjectives, sentence length, emoji usage, hashtag density, CTA style. The profile lives in the system prompt and is refreshed monthly as your account grows and your style evolves.",
  },
  {
    q: "Does it handle Instagram Reels and Stories?",
    a: "Stories yes — the agent generates the image or graphic and adds text overlay in your brand font and colours, then publishes via the Instagram Graph API. Reels require video, which the agent doesn't edit. However, it can write Reels scripts, auto-generate Reels cover images, and add captions and hashtags when you upload the video file. Full Reels automation requires a video editing integration (we can connect CapCut API or Canva Video for some formats).",
  },
];

// ── Related links ─────────────────────────────────────────────────────────────

const relatedLinks = [
  { label: "AI Review Management", href: "/services/ai-agents/review-management" },
  { label: "AI Booking Agent", href: "/services/ai-agents/booking" },
  { label: "AI Lead Capture", href: "/services/ai-agents/lead-capture" },
  { label: "Social Media Management", href: "/services/social-media" },
  { label: "All AI Agents", href: "/services/ai-agents" },
];

// ── Tool schema ───────────────────────────────────────────────────────────────

const toolSchema = `{
  "name": "generate_social_post",
  "parameters": {
    "business_type": "enum[salon,cafe,gym,pet_groomer]",
    "post_type": "enum[promotion,before_after,review_highlight,seasonal,class_schedule]",
    "platform": "enum[instagram,facebook,gbp]",
    "tone": "enum[warm,professional,playful,urgent]",
    "include_cta": "boolean",
    "cta_type": "enum[book_now,call_us,visit_link,dm_us]"
  }
}`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AISocialMediaAgentPage() {
  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "AI Agents", url: "https://datalatte.pro/services/ai-agents" },
      { name: "AI Social Media Agent", url: PAGE_URL },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agent Skill · Social Media Automation</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Post every day without<br />
              <span className="text-coffee-300">touching your phone.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              An AI agent that monitors your bookings, reviews, and seasonal events —
              then writes, schedules, and publishes platform-native content to Instagram,
              Facebook, and Google Business Profile on autopilot. Built on Claude 3.5 Sonnet
              and the official Meta and Google APIs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Automate my social media →</Link>
              <Link href="/services/ai-agents" className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                All AI agent skills
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* ── Impact stats ────────────────────────────────────────────────────── */}
      <div className="bg-coffee-50 border-b border-coffee-100 py-8">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {impact.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-coffee-700">{s.metric}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>

      {/* ── How it works pipeline ───────────────────────────────────────────── */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">The 6-step social posting pipeline</h2>
        <p className="text-gray-600 max-w-2xl mb-14">
          Triggered by real business events — completed appointments, new reviews, daily cron — not just a
          content calendar someone has to fill in. Every step is fully automated.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipeline.map((p) => (
            <div key={p.step} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <span className="text-3xl font-bold text-coffee-200">{p.step}</span>
              <h3 className="text-base font-semibold text-gray-900 mt-2 mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Tool schema ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 py-16">
        <SectionWrapper>
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-mono text-coffee-400 uppercase tracking-widest mb-2">Under the hood</p>
            <h2 className="text-2xl font-bold text-white mb-4">Real function schema — not a chatbot wrapper</h2>
            <p className="text-gray-400 text-sm mb-8">
              Each post is generated by calling <code className="text-coffee-400 bg-gray-900 px-1.5 py-0.5 rounded">generate_social_post</code> with
              structured parameters — business type, post format, platform, tone, and CTA type.
              This makes output predictable, brand-safe, and auditable in your content log.
            </p>
            <pre className="bg-gray-900 border border-gray-800 text-green-400 text-sm rounded-2xl p-6 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">
              {toolSchema}
            </pre>
            <p className="text-gray-500 text-xs mt-4">
              Model: Claude 3.5 Sonnet for caption writing · GPT-4o Vision for image analysis and selection
            </p>
          </div>
        </SectionWrapper>
      </section>

      {/* ── Niche content examples ──────────────────────────────────────────── */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">What it creates for your business type</h2>
        <p className="text-gray-600 max-w-2xl mb-12">
          Content is tailored to your industry — not generic marketing filler.
          The agent knows what converts for your niche and writes accordingly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nicheExamples.map((niche) => (
            <div key={niche.niche} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{niche.icon}</span>
                <h3 className="text-base font-semibold text-gray-900">{niche.niche}</h3>
              </div>
              <ul className="space-y-2.5">
                {niche.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-coffee-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── What's included ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-3">Everything included</h2>
          <p className="text-gray-600 max-w-2xl mb-12">
            Not just caption generation — a complete content operation that handles
            writing, image prep, scheduling, API publishing, and performance reporting.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {included.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-coffee-50 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-coffee-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                </div>
              );
            })}
          </div>
          {/* A/B caption testing callout */}
          <div className="mt-8 bg-coffee-50 border border-coffee-100 rounded-2xl p-6 max-w-2xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">A/B caption testing (included)</h3>
            <p className="text-sm text-gray-600">
              For high-value posts (promotions, seasonal campaigns), the agent generates two caption
              variants. Version A goes live first. 24 hours later, engagement data is pulled — the
              stronger performer's approach is fed back into your voice profile for future posts.
            </p>
          </div>
        </SectionWrapper>
      </section>

      {/* ── Integrations ────────────────────────────────────────────────────── */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">Integrations the agent connects to</h2>
        <p className="text-gray-600 max-w-2xl mb-10">
          Every integration uses official APIs — no scraping, no third-party schedulers that break
          when platforms update. Built on the same infrastructure Meta and Google provide to enterprise customers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map((t) => (
            <div key={t.name} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <CheckCircle2 size={16} className="text-coffee-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-10">Social media agent questions</h2>
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

      {/* ── Related links ───────────────────────────────────────────────────── */}
      <SectionWrapper className="py-14 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Explore related pages</p>
        <div className="flex flex-wrap gap-3">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-coffee-700 bg-coffee-50 border border-coffee-200 px-4 py-2 rounded-full hover:bg-coffee-100 transition-colors"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Post to Instagram, Facebook, and Google every day — automatically"
        sub="Free audit — we'll review your current posting frequency, content quality, and GBP activity, then show you exactly what an AI social media agent would add to your online presence."
        ctaLabel="Get your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
