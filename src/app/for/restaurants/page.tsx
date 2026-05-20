import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: { canonical: "https://datalatte.pro/for/restaurants" },
  title: "Restaurant Marketing | Google Ads, Local SEO & More",
  description:
    "Data-driven marketing for restaurants and cafés. Fill more tables, build a loyal following, and dominate 'restaurants near me' searches with proven local strategies.",
  openGraph: {
    title: "Restaurant Marketing That Fills Tables | DataLatte",
    description:
      "More reservations, more walk-ins, more regulars. Local SEO, Google Ads, and Google Business Profile built specifically for restaurants.",
  },
};

export default function RestaurantsPage() {
  return (
    <NichePage
      niche="Restaurants"
      headline="Fill Every Table. Build a Dining Room Full of Regulars."
      subheadline="Restaurants run on reputation, foot traffic, and timing. Let's use data to make sure hungry locals find you first — and keep coming back."
      heroImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-700 to-coffee-900"
      problems={[
        "You're not showing up when people search 'restaurants near me' or 'dinner in [your neighbourhood]'.",
        "Your Google Business Profile photos are outdated and your menu isn't uploaded.",
        "Weekday lunch slots and early-week evenings are half-empty.",
        "You have no system for turning first-time visitors into regulars.",
        "Competitors with mediocre food are outranking you because they've optimised their listings.",
      ]}
      kpis={[
        {
          metric: "Google Maps Visibility",
          improvement: "+80–150%",
          desc: "More impressions from 'restaurant near me' searches drive direct reservations and walk-ins.",
        },
        {
          metric: "Reservation Rate",
          improvement: "+35–60%",
          desc: "Targeted Google Ads and a polished booking link in GBP convert browsers into seated guests.",
        },
        {
          metric: "Review Count",
          improvement: "3–5×",
          desc: "A structured ask-and-respond review strategy can multiply new monthly reviews within 60 days.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile Optimization",
          icon: "📍",
          desc: "Complete profile, accurate hours, high-quality food photos, menu upload, and a review generation system. The map pack is free traffic — let's win it.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for 'best [cuisine] near me', 'restaurants in [neighbourhood]', and occasion-based searches like 'date night restaurant'. Built on citations, reviews, and on-page signals.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Search campaigns targeting high-intent queries like 'where to eat tonight in [city]'. Only pay when someone actively looks for a place to eat.",
        },
        {
          title: "Meta Ads",
          icon: "📱",
          desc: "Showcase your ambiance, signature dishes, and seasonal menus to locals on Instagram and Facebook. Perfect for building brand recall before the Friday night decision.",
        },
        {
          title: "Email & SMS Marketing",
          icon: "✉️",
          desc: "Build a list of regulars and re-engage them with slow-night specials, new menu launches, and loyalty offers. Your most profitable channel.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Track calls, bookings, direction requests, and ad conversions so you know exactly what's driving covers — not just likes.",
        },
      ]}
      tactics={[
        {
          title: "Dominate 'near me' searches",
          detail:
            "Over 60% of restaurant searches have local intent. Optimising your GBP categories, attributes, and post frequency for cuisine type + neighbourhood is the single highest-ROI move for a restaurant.",
        },
        {
          title: "Target occasion and craving keywords",
          detail:
            "People search 'date night dinner [city]', 'best pasta near me', 'brunch spots [neighbourhood]'. Ranking for these mid-intent searches brings in customers who are already ready to eat.",
        },
        {
          title: "Run weekday fill campaigns",
          detail:
            "Wednesday and Thursday ads with a specific offer (early-bird discount, set menu) can turn empty midweek evenings into profitable services. Short-burst campaigns — 3–4 day windows — keep costs low.",
        },
        {
          title: "Build a regulars pipeline",
          detail:
            "A simple SMS opt-in at the table + monthly message about specials can generate 2–3× more return visits from existing customers. Acquisition is expensive; retention is where margin lives.",
        },
      ]}
      testimonial={{
        quote:
          "Our Tuesday and Wednesday evenings used to be dead. After three months with DataLatte — Google Business Profile overhaul, a few targeted ads, and an email list we actually use — midweek is now our most profitable stretch. Real results, no fluff.",
        author: "Marco T.",
        role: "Owner, Trattoria Moderna",
        rating: 5,
      }}
      faq={[
        {
          q: "How quickly can you get us more reservations?",
          a: "Google Ads can drive traffic from day one. GBP improvements typically show measurable results in 4–6 weeks. Organic local SEO builds over 3–6 months but compounds with time.",
        },
        {
          q: "What ad budget do restaurants typically need?",
          a: "Most independent restaurants see strong results with $400–$900/month in ads. I'll recommend a budget based on your location, competition, and goals — not one that maximises my commission.",
        },
        {
          q: "Do you handle menu photography or social content creation?",
          a: "I focus on strategy and paid/organic distribution. For photography, I can connect you with trusted local photographers. For social content, I can manage scheduling and copywriting alongside existing assets.",
        },
        {
          q: "Can you help with OpenTable or Resy integration?",
          a: "Yes — I'll make sure your booking platform is correctly linked in your GBP, ads, and website to minimise friction from search to reservation.",
        },
      ]}
      ctaHeadline="Ready to turn more searches into seated guests?"
    />
  );
}
