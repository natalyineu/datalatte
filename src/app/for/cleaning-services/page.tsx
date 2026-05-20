import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: { canonical: "https://datalatte.pro/for/cleaning-services" },
  title: "Cleaning Service Marketing | Google Ads & Local SEO",
  description:
    "Marketing for residential and commercial cleaning companies. Get more recurring clients, dominate local search, and stop depending on word of mouth alone.",
  openGraph: {
    title: "Cleaning Company Marketing That Builds Recurring Revenue | DataLatte",
    description:
      "Google Ads, local SEO, and retention marketing built specifically for cleaning services. More jobs, more regulars, less price competition.",
  },
};

export default function CleaningServicesPage() {
  return (
    <NichePage
      niche="Cleaning Services"
      headline="Book More Cleaning Jobs and Build a Base of Loyal Recurring Clients"
      subheadline="Cleaning businesses thrive on consistent, recurring bookings. Let's build the online presence and retention systems that keep your calendar full every week."
      heroImage="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-700 to-coffee-800"
      problems={[
        "You rely almost entirely on word of mouth — which is unpredictable and hard to scale.",
        "Competitors are undercutting your prices online, making it hard to compete on Google.",
        "Seasonal slowdowns leave gaps in your schedule and cash flow.",
        "You have no system to turn one-time jobs into recurring clients.",
        "Your website isn't ranking for 'house cleaning near me' or 'cleaning service [city]'.",
      ]}
      kpis={[
        {
          metric: "Monthly New Bookings",
          improvement: "+20–50%",
          desc: "Targeted Google Ads and local SEO drive inbound leads for both one-time and recurring services.",
        },
        {
          metric: "Recurring Client Rate",
          improvement: "+30–55%",
          desc: "Email and SMS follow-up systems convert first-time clients into weekly or bi-weekly bookings.",
        },
        {
          metric: "Cost Per New Client",
          improvement: "$25–$70",
          desc: "With recurring LTV averaging $1,200–$3,000/year per client, acquisition costs pay back fast.",
        },
      ]}
      services={[
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Search campaigns targeting high-intent queries like 'house cleaning near me', 'move-out cleaning [city]', and 'office cleaning service'. Pay only for clicks from people actively looking.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank organically for your city + service combinations. Citations, reviews, and on-page signals that put you ahead of franchise competitors.",
        },
        {
          title: "Google Business Profile",
          icon: "📍",
          desc: "Fully optimised listing with services, service areas, photos, and a review generation system. Essential for showing up in map pack searches.",
        },
        {
          title: "Email & SMS Retention",
          icon: "✉️",
          desc: "Automated follow-up sequences that convert one-time clients into recurring bookings. Your most cost-effective growth channel.",
        },
        {
          title: "Website & Landing Pages",
          icon: "💻",
          desc: "Clear, fast, trust-building pages with online quote requests and booking forms. Designed to convert mobile searchers into booked jobs.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Track leads, bookings, and revenue by channel. Know your cost per acquisition and customer lifetime value with clarity.",
        },
      ]}
      tactics={[
        {
          title: "Win the 'near me' map pack",
          detail:
            "Cleaning searches are intensely local. A fully optimised GBP with consistent service area citations, 50+ reviews, and weekly posts will beat most competitors in the map pack — which captures 40%+ of clicks.",
        },
        {
          title: "Target high-value one-time services',",
          detail:
            "Move-in/out cleans, post-construction, and deep cleans attract higher-budget clients. Dedicated landing pages and specific ad groups for these services increase average job value.",
        },
        {
          title: "Build a neighbourhood expansion strategy',",
          detail:
            "Once you have density in one neighbourhood, expanding to adjacent areas is cost-effective. Targeted Google Ads by zip code combined with door-hanger-style social proof builds territory efficiently.",
        },
        {
          title: "Convert one-timers to regulars with automation",
          detail:
            "An SMS sequence sent 3 days after the first clean (satisfaction check + recurring discount offer) converts 20–35% of one-time clients into bi-weekly or monthly bookings. This single tactic often doubles LTV.",
        },
      ]}
      testimonial={{
        quote:
          "I was running Facebook ads myself with basically no results. DataLatte switched us to Google, fixed our GBP, and set up a simple SMS follow-up for new clients. We went from 60% word-of-mouth to a fully booked calendar within 4 months. Game changer.",
        author: "Lisa M.",
        role: "Owner, Sparkle & Shine Cleaning Co.",
        rating: 5,
      }}
      faq={[
        {
          q: "Should I focus on Google Ads or local SEO first?",
          a: "Google Ads for immediate lead flow, local SEO for long-term compounding results. I typically recommend running both in parallel — ads while SEO builds, then scaling back ad spend as organic rankings improve.",
        },
        {
          q: "How do I compete with large cleaning franchises online?",
          a: "Local signals beat brand size in local search. Your proximity, review velocity, and GBP completeness matter more than a franchise's domain authority. This is a battle independents win regularly.",
        },
        {
          q: "What's a realistic ad budget for a cleaning company?",
          a: "Most residential cleaning companies see strong ROI with $350–$700/month in Google Ads. Commercial cleaning budgets are typically higher due to larger job values.",
        },
        {
          q: "Can you help me target specific neighbourhoods?",
          a: "Absolutely. Radius and zip-code targeting in Google Ads, combined with neighbourhood-specific landing pages, is one of the most effective approaches for cleaning companies.",
        },
      ]}
      ctaHeadline="Ready to build a fully booked cleaning business?"
    />
  );
}
