import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/google-business-profile",
    languages: {
      "en-US": "https://datalatte.pro/services/google-business-profile",
      "en-GB": "https://datalatte.pro/services/google-business-profile",
      "en-AU": "https://datalatte.pro/services/google-business-profile",
      "en-CA": "https://datalatte.pro/services/google-business-profile",
      "x-default": "https://datalatte.pro/services/google-business-profile",
    },
  },
  title: "Google Business Profile Optimization | Local Map Pack",
  description:
    "Google Business Profile setup and optimization for local businesses. Rank higher in Google Maps, get more calls and directions, and build reviews that convert.",
  openGraph: {
    title: "Google Business Profile Optimization | Local Map Pack",
    description: "Google Business Profile setup and optimization for local businesses. Rank higher in Google Maps, get more calls and directions, and build reviews that convert.",
    url: "https://datalatte.pro/services/google-business-profile",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Business Profile Optimization | Local Map Pack",
    description: "Google Business Profile setup and optimization for local businesses. Rank higher in Google Maps, get more calls and directions, and build reviews that convert.",
  },
};

export default function GoogleBusinessProfilePage() {
  return (
    <ServicePage
      service="Google Business Profile"
      tagline="The free local marketing channel most businesses are leaving almost entirely untouched."
      description="Google Business Profile (formerly Google My Business) is the most underrated local marketing tool available. It's free, it drives real customers, and most businesses have barely optimized it. Let's fix that."
      icon="📍"
      accentClass="bg-gradient-to-br from-coffee-700 to-coffee-900"
      whatItIs="Google Business Profile (GBP) is the listing that appears when someone searches for your business or searches for businesses like yours on Google Search or Google Maps. It shows your hours, photos, reviews, phone number, address, website, and more. When you appear in the 'local pack' — the three business cards that appear under the map on search results — you capture the majority of clicks from people with local intent. Getting there requires a combination of profile completeness, review signals, engagement metrics, and local SEO fundamentals. The best part: it's free traffic, and it compounds over time.\n\nIn the marketing funnel, GBP operates at both the discovery and decision stages. A customer discovers your café while searching 'coffee near me' (discovery), scans your photos and 4.8-star rating, then calls directly from the listing to ask about seating (decision). According to Google's own data, 56% of actions taken on GBP listings are website visits, and profiles with complete information receive 5× more views than incomplete ones. Critically, the top 3 positions in the map pack capture 75% of all clicks — meaning position 4 and below might as well be invisible. Every point of optimization is a direct investment in owning one of those three spots at zero cost per click.\n\nThe most common mistake local business owners make with their GBP is choosing the wrong primary category. A nail salon that lists itself as 'Beauty Salon' instead of 'Nail Salon' misses every search for 'nail salon near me'. A coffee shop listed as 'Cafe' instead of 'Coffee Shop' loses ranking for the highest-volume local query in the food and drink category. Google has over 4,000 business categories — finding the right one for your specific business type, and pairing it with the right secondary categories, is one of the single highest-impact changes you can make. Most business owners pick the first category that sounds right, when the one that actually drives traffic may be three options down the list."
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
        "Products section setup for product-based businesses",
        "Booking link and appointment URL integration",
        "Competitor profile benchmarking across 5 local rivals",
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
        {
          q: "How many reviews do I need to rank in the local pack?",
          a: "There's no hard threshold, but in most local markets, businesses in the top 3 map pack positions have 30–100+ reviews with a rating above 4.5. More important than the total number is recency and velocity — Google favours profiles that are consistently earning new reviews over ones with a big historical count and nothing recent. A review generation system that earns you 5–10 reviews a month will typically outperform a competitor who earned 80 reviews two years ago and has been quiet since.",
        },
        {
          q: "What's the difference between GBP optimization and Local SEO?",
          a: "GBP optimization focuses specifically on your Google Business Profile — the listing that appears in Maps and the local pack. Local SEO is broader: it includes your website's on-page optimization, citation building across dozens of directories, link acquisition, and technical factors. GBP is one of the most powerful inputs into local ranking, but it works best when the website behind it is also properly optimized. Think of GBP as the front window of your store — Local SEO is the rest of the building.",
        },
        {
          q: "Should I respond to negative reviews?",
          a: "Always — and quickly. A professional, empathetic response to a negative review signals to Google that your business is active, and signals to potential customers that you care. Businesses that respond to all reviews consistently outrank businesses that don't. I provide response templates for both positive and negative reviews as part of every engagement, so you never have to wonder what to say.",
        },
        {
          q: "Can I run Google Ads and GBP at the same time?",
          a: "Yes, and they work well together. A fully optimized GBP improves the performance of your local Google Ads through a feature called 'location extensions' — your ads display your address, hours, and a direction link directly in the search results. Click-through rates on ads with location extensions are typically 10–20% higher than ads without them. Optimizing your GBP is therefore a lever that improves both organic and paid performance simultaneously.",
        },
      ]}
      stats={[
        { value: "56%", label: "Actions on GBP are website visits" },
        { value: "5×", label: "More views for complete vs. incomplete profiles" },
        { value: "Free", label: "Cost of organic GBP traffic" },
        { value: "Top 3", label: "Map pack positions that get 75% of clicks" },
      ]}
      relatedLinks={[
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
