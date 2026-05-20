import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/email-sms",
    languages: {
      "en-US": "https://datalatte.pro/services/email-sms",
      "en-GB": "https://datalatte.pro/services/email-sms",
      "en-AU": "https://datalatte.pro/services/email-sms",
      "en-CA": "https://datalatte.pro/services/email-sms",
      "x-default": "https://datalatte.pro/services/email-sms",
    },
  },
  title: "Email & SMS Marketing for Local Businesses",
  description:
    "Email and SMS marketing for coffee shops, salons, pet groomers, and fitness studios. Build a list, stay top of mind, and turn one-time visitors into loyal regulars.",
  openGraph: {
    title: "Email & SMS Marketing for Local Businesses",
    description: "Email and SMS marketing for coffee shops, salons, pet groomers, and fitness studios. Build a list, stay top of mind, and turn one-time visitors into loyal regulars.",
    url: "https://datalatte.pro/services/email-sms",
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte — Email & SMS Marketing for Local Businesses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Email & SMS Marketing for Local Businesses",
    description: "Email and SMS marketing for coffee shops, salons, pet groomers, and fitness studios. Build a list, stay top of mind, and turn one-time visitors into loyal regulars.",
    images: ["https://datalatte.pro/opengraph-image"],
  },
};

export default function EmailSMSPage() {
  return (
    <ServicePage
      service="Email & SMS Marketing"
      tagline="Your regulars are your best asset. Keep them coming back."
      description="New customer acquisition is expensive. Your existing customers are 5× more likely to book again — if you stay in front of them. Email and SMS are the highest-ROI channels for turning one-time visitors into loyal regulars."
      icon="✉️"
      accentClass="bg-gradient-to-br from-coffee-700 to-gray-900"
      whatItIs="Email and SMS marketing for local businesses means building a list of real customers who've opted in to hear from you, and then sending them the right messages at the right times — a seasonal offer, a reminder that it's been 6 weeks since their last haircut, a 'we miss you' re-engagement for lapsed clients, or a heads-up about a new service. Unlike ads (where you pay every time you want to reach someone), your email and SMS list is an owned audience: you built it, you own it, and you can reach them for pennies. For local businesses with repeat purchase potential — which is all four of our niches — this compounds into real revenue over time."
      howItWorks={[
        {
          step: "01",
          title: "Platform setup",
          desc: "Set up or migrate to the right email/SMS platform for your business — Klaviyo, Mailchimp, or a combined email+SMS tool like Attentive or GoHighLevel depending on your budget and booking system.",
        },
        {
          step: "02",
          title: "List building strategy",
          desc: "Build your opt-in flow: email capture at checkout, QR codes, booking confirmation opt-ins, social media lead magnets. Many businesses are sitting on hundreds of uncaptured customer contacts.",
        },
        {
          step: "03",
          title: "Core automations",
          desc: "Set up the sequences that run forever: welcome series for new subscribers, post-visit follow-up, re-engagement for lapsed customers, birthday offers, appointment reminders.",
        },
        {
          step: "04",
          title: "Campaign calendar",
          desc: "Build a 3-month send calendar timed to your business seasonality — holidays, slow months, new service launches. I write the copy and you approve before anything goes out.",
        },
        {
          step: "05",
          title: "Tracking & optimisation",
          desc: "Set up open rate, click rate, and revenue tracking. Refine subject lines, send times, and offers based on real data — not guesswork.",
        },
      ]}
      included={[
        "Email/SMS platform setup or audit",
        "List segmentation (new customers, regulars, lapsed)",
        "Welcome automation sequence",
        "Post-visit follow-up sequence",
        "Re-engagement campaign for lapsed customers",
        "Birthday/anniversary automation",
        "3-month campaign calendar with copy",
        "Subject line and offer A/B testing framework",
        "Performance dashboard (open rates, click rates, revenue)",
        "List growth playbook specific to your business type",
      ]}
      notIncluded={[
        "Ongoing monthly campaign management after setup (I can quote separately)",
        "Graphic design for emails (I provide text-based templates you can brand)",
        "SMS compliance legal advice (I advise on best practices, not legal counsel)",
        "CRM buildout beyond email/SMS platform",
      ]}
      bestFor={[
        "Businesses with an existing customer base they haven't marketed to",
        "Coffee shops and salons with high repeat-purchase potential",
        "Studios and groomers who want to reduce seasonal revenue dips",
        "Businesses that want to reduce reliance on paid ads over time",
        "Owners who've collected customer emails but never emailed them",
        "Any business with a loyalty or rewards programme to promote",
      ]}
      faqs={[
        {
          q: "What if I don't have an email list yet?",
          a: "That's actually a great time to start — you build it right from the beginning with proper opt-ins. I'll build the capture mechanisms alongside the platform setup so you're growing from day one.",
        },
        {
          q: "Is SMS marketing too intrusive?",
          a: "When done right — proper opt-in, low frequency (2–4 per month), and relevant content — SMS has the highest open rates of any channel (98%+ within 3 minutes). The key is permission and relevance. Nobody minds a text that says 'your favourite coffee drink is back on the menu this week.'",
        },
        {
          q: "Which platform do you recommend?",
          a: "For most local businesses, Mailchimp is a solid free starting point for email only. If you want SMS too, GoHighLevel or Klaviyo are worth the investment. I'll recommend based on your booking system integrations and budget.",
        },
        {
          q: "How often should I email my list?",
          a: "For most local businesses: once or twice a month for email, 2–4 times a month for SMS. Frequency depends on how much value you can deliver — I'd rather send fewer high-quality messages than flood inboxes with noise.",
        },
      ]}
      relatedLinks={[
        { label: "AI Agents & Automation", href: "/services/ai-agents" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Google Business Profile", href: "/services/google-business-profile" },
      ]}
    />
  );
}
