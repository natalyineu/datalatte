import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/website",
    languages: {
      "en-US": "https://datalatte.pro/services/website",
      "en-GB": "https://datalatte.pro/services/website",
      "en-AU": "https://datalatte.pro/services/website",
      "en-CA": "https://datalatte.pro/services/website",
      "x-default": "https://datalatte.pro/services/website",
    },
  },
  title: "Website & Landing Pages for Local Businesses",
  description:
    "Conversion-focused websites and landing pages for local businesses. Built to turn visitors into bookings, calls, and customers — not just look good.",
  openGraph: {
    title: "Website & Landing Pages for Local Businesses",
    description: "Conversion-focused websites and landing pages for local businesses. Built to turn visitors into bookings, calls, and customers — not just look good.",
    url: "https://datalatte.pro/services/website",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website & Landing Pages for Local Businesses",
    description: "Conversion-focused websites and landing pages for local businesses. Built to turn visitors into bookings, calls, and customers — not just look good.",
  },
};

export default function WebsitePage() {
  return (
    <ServicePage
      service="Website & Landing Pages"
      tagline="Your website should be working for you 24/7 — not just sitting there looking pretty."
      description="A beautiful website that doesn't convert is just an expensive brochure. I build lean, fast, conversion-focused websites and ad landing pages for local businesses — pages designed around one goal: getting you the call, booking, or form submission."
      icon="🌐"
      accentClass="bg-gradient-to-br from-coffee-800 to-gray-900"
      whatItIs="For local businesses, your website has one job: convert visitors into customers. That means fast load times (Google penalises slow sites in both ads and SEO), clear calls-to-action above the fold, trust signals (reviews, photos, credentials), and a booking or contact flow that doesn't have unnecessary friction. Most local business websites fail on at least three of these. Landing pages are a focused version of this for ad campaigns — a single page with one offer, one CTA, and no distractions. When you're paying for Google Ads or Meta Ads traffic, sending it to a generic homepage instead of a dedicated landing page can cut your conversion rate by 50–70%. The maths are simple: better page = lower cost per lead = more return on your ad spend.\n\nYour website sits at the intersection of every other marketing channel you run. Google Ads, Meta Ads, Local SEO, content marketing, and your Google Business Profile all feed traffic to your website — which makes it the single highest-leverage piece of your marketing stack. A weak website doesn't just underperform on its own; it depresses the returns from everything else. A well-built, fast-loading, conversion-focused site amplifies every pound and dollar you spend elsewhere: better Quality Scores in Google Ads mean lower cost-per-click, better user experience means higher SEO rankings, and a frictionless booking flow means more of your hard-won visitors actually become paying customers.\n\nThe most common mistake local business owners make with their website is prioritising how it looks over how it performs. A visually impressive site with slow load times, no clear CTA, and a buried phone number will always lose to a simpler site that loads in under 2 seconds and puts a 'Book Now' button in the first viewport. Google's own data shows that 53% of mobile users abandon a site that takes longer than 3 seconds to load — and the majority of local business website traffic comes from mobile. Speed is not optional. Neither is a prominent, tap-friendly phone number and a booking link that works on every device."
      howItWorks={[
        {
          step: "01",
          title: "Conversion audit",
          desc: "I audit your existing website against the 10 factors that most impact conversion for local businesses: load speed, mobile experience, above-the-fold CTA, social proof, click-to-call, booking flow friction, and more.",
        },
        {
          step: "02",
          title: "Strategy & wireframe",
          desc: "Define the goal of each page and map out the content hierarchy. I produce a wireframe (not a design — just the structure) so we agree on what goes where before any build begins.",
        },
        {
          step: "03",
          title: "Copy",
          desc: "I write the page copy — headlines, subheads, body text, CTA labels. Good copy does most of the conversion work. I write for your niche and your customers.",
        },
        {
          step: "04",
          title: "Build",
          desc: "I build on whichever platform suits your situation — Webflow for design control, WordPress for flexibility, or Next.js for performance-first requirements. Landing pages can be built in any platform or as standalone pages.",
        },
        {
          step: "05",
          title: "Tracking & launch",
          desc: "GA4 events, conversion tracking for Google Ads and Meta Pixel, Core Web Vitals check, and mobile QA before going live. No launches without tracking in place.",
        },
      ]}
      included={[
        "Conversion audit of existing website",
        "Page strategy and content wireframe",
        "Copywriting for all pages",
        "Mobile-first responsive build",
        "Performance optimisation (Core Web Vitals)",
        "GA4 and conversion event setup",
        "Google Ads and Meta Pixel integration",
        "Click-to-call and booking CTA implementation",
        "Basic on-page SEO (title tags, schema, meta)",
        "30-day post-launch support",
        "PageSpeed and Core Web Vitals QA (targeting 90+ scores)",
        "Review and trust-signal integration (Google reviews widget)",
        "Booking system embed (Acuity, Calendly, Mindbody, etc.)",
      ]}
      notIncluded={[
        "Custom illustration or brand photography (I advise on what you need)",
        "Ongoing hosting and maintenance (I recommend and hand off)",
        "Full e-commerce builds",
        "Complex web applications or member portals",
      ]}
      bestFor={[
        "Local businesses running ads to a homepage (stop doing this)",
        "Businesses whose current website hasn't been updated in 2+ years",
        "Businesses launching a new service or location",
        "Businesses whose website loads slowly on mobile",
        "Owners who want a simple, fast site that just gets the job done",
        "Anyone building a new Google Ads or Meta Ads campaign",
      ]}
      faqs={[
        {
          q: "Do I need a full website or just a landing page?",
          a: "Depends on your situation. If you're running ads, you need a dedicated landing page at minimum — don't send paid traffic to your homepage. A full website makes sense when you're investing in SEO or building long-term brand trust. I'll recommend what's actually right for your stage.",
        },
        {
          q: "Which platform do you build on?",
          a: "I favour Webflow for most local business sites — it's fast, easy for you to manage content, and produces clean code. WordPress for businesses that need specific plugins (like Mindbody integration). Next.js for maximum performance. I'll recommend what suits your needs and budget.",
        },
        {
          q: "Can you redesign my existing site instead of rebuilding it?",
          a: "Yes. Sometimes a redesign of the homepage and key landing pages is more cost-effective than a full rebuild. The audit will tell us whether that's the right call or whether a fresh start is worth it.",
        },
        {
          q: "How long does a landing page take vs a full website?",
          a: "A high-converting landing page can be live in 1–2 weeks. A full 5–8 page website typically takes 3–4 weeks from wireframe to launch, depending on feedback turnaround.",
        },
        {
          q: "What PageSpeed score should my website have?",
          a: "Aim for 90+ on both mobile and desktop in Google PageSpeed Insights. Scores below 50 on mobile hurt your Google Ads Quality Score and your organic rankings simultaneously. Every build I deliver is tested against Core Web Vitals benchmarks before launch — if it doesn't score well, it doesn't ship.",
        },
        {
          q: "Will I be able to update the website myself after it's built?",
          a: "Yes. I build sites with handoff in mind. Webflow sites have a visual editor you can use without touching code. WordPress sites give you full CMS control. I provide a short walkthrough video and documentation so you can update hours, add photos, or publish blog posts independently.",
        },
        {
          q: "Do you handle the hosting and domain setup?",
          a: "I'll guide you through it and can handle the technical configuration, but hosting and domain registration stay in your name and under your control. I typically recommend Webflow Hosting, Cloudflare Pages, or Vercel depending on the stack — all fast, reliable, and affordable for local businesses.",
        },
        {
          q: "What if I already have a website — can you just improve it?",
          a: "Absolutely. A conversion audit often surfaces quick wins — adding a sticky call button, tightening the above-the-fold CTA, compressing images to fix load speed, or adding a reviews section — that can meaningfully improve performance without a full rebuild. I'll tell you honestly whether a refresh or a rebuild makes more financial sense.",
        },
      ]}
      stats={[
        { value: "3s", label: "Load time threshold before 53% of users leave" },
        { value: "2–5×", label: "Conversion lift from optimised landing pages" },
        { value: "14 days", label: "Typical build time for a local business site" },
        { value: "100", label: "PageSpeed target for all builds" },
      ]}
      relatedLinks={[
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "AI Agents & Automation", href: "/services/ai-agents" },
      ]}
    />
  );
}
