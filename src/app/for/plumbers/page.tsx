import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/plumbers",
    languages: {
      "en-US": "https://datalatte.pro/for/plumbers",
      "en-GB": "https://datalatte.pro/for/plumbers",
      "en-AU": "https://datalatte.pro/for/plumbers",
      "en-CA": "https://datalatte.pro/for/plumbers",
      "x-default": "https://datalatte.pro/for/plumbers",
    },
  },
  title: "Plumber Marketing | Google Ads, Local SEO & More",
  description:
    "Data-driven marketing for plumbers and plumbing companies. Get more service calls with Google Ads, dominate local search, and build a steady pipeline of jobs.",
  openGraph: {
    title: "Plumber Marketing | DataLatte",
    description:
      "Get more service calls and jobs with local SEO, Google Ads, and Google Business Profile optimization built specifically for plumbers.",
  },
};

export default function PlumbersPage() {
  return (
    <NichePage
      niche="Plumbers"
      headline="Get More Service Calls — Not Just More Website Visits"
      subheadline="Plumbing is a high-urgency, high-value service. When someone needs a plumber, they need one now. Let's make sure your business is the one they find and call."
      heroImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-800 to-coffee-900"
      problems={[
        "You're not showing up when homeowners search 'plumber near me' or 'emergency plumber [city]'.",
        "You rely on referrals which are unpredictable — some months are slammed, others are quiet.",
        "Competitors with worse reviews are outranking you because they've invested in local SEO.",
        "Your website looks outdated and doesn't convert visitors into calls.",
        "You're spending on advertising but can't tell which campaigns are actually generating jobs.",
      ]}
      kpis={[
        {
          metric: "Inbound Service Calls",
          improvement: "+60–120%",
          desc: "Dominating local search for high-intent plumbing queries drives a consistent flow of inbound calls.",
        },
        {
          metric: "Cost Per Lead",
          improvement: "$15–$40",
          desc: "With average job values of $200–$2000+, a well-targeted local campaign has exceptional ROI.",
        },
        {
          metric: "Google Maps Ranking",
          improvement: "Top 3",
          desc: "The map pack captures 70%+ of local service searches — being in it changes everything.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile Optimization",
          icon: "📍",
          desc: "Optimize your GBP with services, photos, and a review strategy. The map pack is where emergency and planned plumbing jobs start — you need to be there.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for 'plumber near me', 'emergency plumber [city]', 'drain cleaning [area]', and the specific services you want more of.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Search campaigns targeting high-intent plumbing queries. Emergency plumbing searches convert at extremely high rates — show up exactly when someone needs help.",
        },
        {
          title: "Google LSA (Local Services Ads)",
          icon: "✅",
          desc: "Google-guaranteed ads that appear above everything else in local search. Pay per lead, not per click. Ideal for plumbers with strong review profiles.",
        },
        {
          title: "Reputation Management",
          icon: "⭐",
          desc: "Build a review generation system. Plumbers with 50+ reviews and a 4.5+ rating dominate both the map pack and consumer trust.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Track calls, form submissions, and job sources. Know exactly which marketing channels are generating revenue, not just traffic.",
        },
      ]}
      tactics={[
        {
          title: "Capture emergency searches the moment they happen",
          detail:
            "'Emergency plumber near me', 'burst pipe [city]', 'blocked drain now' — these high-urgency searches happen at all hours and convert immediately. Google Ads with call extensions running 24/7 is often the highest-ROI campaign a plumber can run.",
        },
        {
          title: "Target service-specific keywords for planned jobs",
          detail:
            "'Bathroom remodel plumbing [city]', 'hot water heater installation [area]', 'sewer line inspection' — these planned-job searches have lower urgency but higher average job value. Great for filling your schedule during slower periods.",
        },
        {
          title: "Build trust with reviews before they need you",
          detail:
            "Most homeowners look up plumber reviews before they have an emergency. A strong review profile means when something breaks, they already know who to call — your name comes up first and you're already trusted.",
        },
        {
          title: "Optimize for voice search and mobile",
          detail:
            "Most plumbing searches happen on mobile, often in stressful moments. Your GBP click-to-call button, fast-loading website, and clear phone number placement directly impact how many searchers become callers.",
        },
      ]}
      testimonial={{
        quote:
          "I was getting maybe 5–8 new calls a week from the internet. DataLatte rebuilt my Google presence and now I'm getting 20–25. The Google Ads campaign paid for itself in the first week.",
        author: "Tom H.",
        role: "Owner, Reliable Flow Plumbing",
        rating: 5,
      }}
      faq={[
        {
          q: "How much should a plumber spend on Google Ads?",
          a: "Most plumbing companies see strong results with $500–$1500/month. Given average job values, even 2–3 additional jobs per month from ads creates a very strong return.",
        },
        {
          q: "What's the difference between Google Ads and Local Services Ads?",
          a: "Google Ads are keyword-targeted and you pay per click. Local Services Ads appear at the very top, show your Google rating, and you pay per lead (phone call). Both are effective — I'll recommend the right mix for your situation.",
        },
        {
          q: "How long until I see more calls from local SEO?",
          a: "Google Business Profile improvements typically show results in 4–8 weeks. Organic local SEO takes 3–6 months. Google Ads can generate calls the same day you launch.",
        },
        {
          q: "Do you work with solo plumbers or just larger companies?",
          a: "Both. Solo operators and small crews often see the best ROI because overhead is low and a few extra jobs per month is highly meaningful. I tailor the strategy to your capacity.",
        },
        {
          q: "I'm already busy with emergency calls — why do I need marketing?",
          a: "Emergency jobs are reactive and unpredictable. Marketing helps you attract the higher-margin planned work: bathroom renovations, boiler replacements, full replumbs. These jobs are bigger, schedulable, and give you better control over your workload and revenue.",
        },
        {
          q: "How do I get more high-value jobs and fewer small call-outs?",
          a: "Service-specific campaigns targeting 'bathroom remodel plumber [city]', 'boiler installation near me', or 'pipe repiping service' attract clients explicitly looking for larger projects. Paired with landing pages built around those services, you pre-qualify leads before they call.",
        },
        {
          q: "Do you work with plumbers outside the US?",
          a: "Yes — UK, Australia, Canada, and other English-speaking markets. Plumbing is one of the strongest local search categories in all these markets. I adapt campaigns to local platform norms, pricing benchmarks, and licensing contexts (e.g. Gas Safe in the UK).",
        },
      ]}
      ctaHeadline="Ready to keep your schedule full of jobs?"
    />
  );
}
