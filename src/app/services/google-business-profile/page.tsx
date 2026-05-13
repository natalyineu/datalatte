import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Google Business Profile Optimization | Local Map Pack",
  description:
    "Google Business Profile setup and optimization for local businesses. Rank higher in Google Maps, get more calls and directions, and build reviews that convert.",
};

export default function GoogleBusinessProfilePage() {
  return (
    <ServicePage
      service="Google Business Profile"
      tagline="The free local marketing channel most businesses are leaving almost entirely untouched."
      description="Google Business Profile (formerly Google My Business) is the most underrated local marketing tool available. It's free, it drives real customers, and most businesses have barely optimized it. Let's fix that."
      icon="📍"
      accentClass="bg-gradient-to-br from-coffee-700 to-coffee-900"
      whatItIs="Google Business Profile (GBP) is the listing that appears when someone searches for your business or searches for businesses like yours on Google Search or Google Maps. It shows your hours, photos, reviews, phone number, address, website, and more. When you appear in the 'local pack' — the three business cards that appear under the map on search results — you capture the majority of clicks from people with local intent. Getting there requires a combination of profile completeness, review signals, engagement metrics, and local SEO fundamentals. The best part: it's free traffic, and it compounds over time."
      howItWorks={[
        {
          step: "01",
          title: "Full profile audit",
          desc: "I review every element of your current profile against Google's best practices and your competitors' profiles. Most businesses have 10–15 fixable issues.",
        },
        {
          step: "02",
          title: "Category and attribute optimization",
          desc: "Choosing the right primary and secondary categories is one of the highest-impact optimizations. I research which categories your top-ranking competitors use.",
        },
        {
          step: "03",
          title: "Content and media overhaul",
          desc: "Keyword-rich business description, complete service list with descriptions, fresh photos, and any applicable attributes (outdoor seating, appointment required, etc.).",
        },
        {
          step: "04",
          title: "Review generation strategy",
          desc: "A repeatable system for asking customers for reviews at the right moment. Most businesses get reviews by luck. I build a process so you get them consistently.",
        },
        {
          step: "05",
          title: "Ongoing GBP posts and Q&A",
          desc: "Regular Google Posts (offers, events, updates) signal that your profile is active. I'll also seed Q&A with relevant questions and answers.",
        },
      ]}
      included={[
        "Full GBP audit against best practices",
        "Category and attribute research and optimization",
        "Business description rewrite with local keywords",
        "Complete service list with keyword-optimized descriptions",
        "Photo and media guidance (what to add, what to remove)",
        "Review request strategy and templates",
        "Response templates for positive and negative reviews",
        "Google Posts setup (3 months of posts)",
        "Q&A seeding and management",
        "Monthly performance tracking (impressions, calls, directions)",
      ]}
      notIncluded={[
        "Website SEO (though I'll flag issues I see)",
        "Managing your responses on an ongoing basis (I provide templates)",
        "Photography — I advise on what to shoot, you capture it",
        "Yelp or other directory optimization (can add as a separate scope)",
      ]}
      bestFor={[
        "Any local business that hasn't fully set up their GBP",
        "Businesses ranking below position 5 in the local map pack",
        "Businesses with fewer than 30 Google reviews",
        "Businesses that have never done keyword research for their GBP",
        "Coffee shops, salons, groomers, and studios who want free organic traffic",
        "Businesses that recently moved or changed their services",
      ]}
      faqs={[
        {
          q: "How long before I see results from GBP optimization?",
          a: "Some improvements show results within days (profile completeness, photos). Ranking improvements in the local pack typically take 4–12 weeks. Review accumulation is the slowest but most impactful signal over time.",
        },
        {
          q: "I already have a GBP listing — do I still need this?",
          a: "Almost certainly. Most business owners set up their listing when they opened and haven't touched it since. A proper audit almost always finds significant optimization opportunities.",
        },
        {
          q: "Can you help if my listing has been suspended or has duplicate issues?",
          a: "Yes. GBP suspensions and duplicate listings are painful but fixable. I've navigated the process and can guide you through it.",
        },
        {
          q: "Do reviews really impact ranking?",
          a: "Yes, significantly. Review volume, recency, and keyword content in reviews all influence your local pack ranking. Getting 5 fresh reviews a month is more impactful than getting 50 once and going quiet.",
        },
      ]}
      relatedLinks={[
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
