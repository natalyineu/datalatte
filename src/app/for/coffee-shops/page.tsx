import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/coffee-shops",
    languages: {
      "en-US": "https://datalatte.pro/for/coffee-shops",
      "en-GB": "https://datalatte.pro/for/coffee-shops",
      "en-AU": "https://datalatte.pro/for/coffee-shops",
      "en-CA": "https://datalatte.pro/for/coffee-shops",
      "x-default": "https://datalatte.pro/for/coffee-shops",
    },
  },
  title: "Coffee Shop & Restaurant Marketing | Google Ads, Local SEO & More",
  description:
    "Data-driven marketing for coffee shops, cafés, and restaurants. Dominate Google Maps, run profitable Google Ads, and grow your foot traffic with real analytics.",
  openGraph: {
    title: "Coffee Shop & Restaurant Marketing | DataLatte",
    description:
      "Get more customers through your door with local SEO, Google Ads, and Google Business Profile optimization built specifically for cafés and restaurants.",
  },
};

export default function CoffeeShopsPage() {
  return (
    <NichePage
      niche="Coffee Shops"
      headline="Get More Customers Through Your Door — Not Just More Likes"
      subheadline="Coffee shops live and die on foot traffic and regulars. Let's use data to bring you more of both — without spending a fortune on ads."
      heroImage="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-800 to-coffee-900"
      problems={[
        "You're barely showing up in Google Maps for \"coffee shop near me\" — even though you're right there.",
        "You tried running Facebook ads but it felt like throwing money away.",
        "Your Google Business Profile is half-filled and hasn't been touched in months.",
        "You have no idea which marketing is actually bringing people in vs. what's just looking busy.",
        "Competitors with worse coffee are outranking you online because they've optimized their listings.",
      ]}
      kpis={[
        {
          metric: "Google Maps Visibility",
          improvement: "+60–120%",
          desc: "More impressions from local searches mean more foot traffic without paid ads.",
        },
        {
          metric: "Cost Per New Customer",
          improvement: "$3–$8",
          desc: "Targeted local Google Ads can bring new regulars at a low acquisition cost.",
        },
        {
          metric: "Review Volume",
          improvement: "2–4×",
          desc: "A structured review strategy can double your monthly new reviews in 90 days.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile Optimization",
          icon: "📍",
          desc: "Complete your profile, optimize categories, add photos, and implement a review generation strategy. The map pack is free traffic — let's win it.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for 'coffee shop near me', 'best latte in [city]', and your neighborhood name. Built on consistent citations and on-page signals.",
        },
        {
          title: "Google Ads (Local campaigns)",
          icon: "🎯",
          desc: "Hyperlocal search and Performance Max campaigns targeting people within a mile or two of your shop. Only pay when someone clicks.",
        },
        {
          title: "Meta Ads",
          icon: "📱",
          desc: "Seasonal promotions, new menu items, loyalty offers — reaching locals on Instagram and Facebook with scroll-stopping creative.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Track calls, directions, online orders, and ad conversions in one clear dashboard you can check anytime.",
        },
        {
          title: "Reputation Management",
          icon: "⭐",
          desc: "Build a system to consistently generate reviews and respond to them professionally. Star rating directly impacts map pack ranking.",
        },
      ]}
      tactics={[
        {
          title: "Own the local map pack",
          detail:
            'Most coffee shop searches have local intent — people want somewhere nearby. Optimizing your GBP for "coffee shop" + your neighborhood, city, and zip code is the highest-ROI move you can make.',
        },
        {
          title: "Target micro-local keywords",
          detail:
            'People search for "coffee near [neighborhood]" or "espresso bar downtown [city]". Ranking for these is easier than broad terms and converts better because intent is high.',
        },
        {
          title: "Leverage seasonal promotions in ads",
          detail:
            "Pumpkin spice season, holiday drinks, Valentine's Day — these are natural ad moments. Meta ads with 3–5 day windows and tight local targeting can drive serious foot traffic.",
        },
        {
          title: "Build a review flywheel",
          detail:
            "Ask at the right moment (post great experience), make it easy (QR code to Google review link), and respond to every review. Shops with 100+ reviews convert map pack visitors at 2–3x the rate.",
        },
      ]}
      testimonial={{
        quote:
          "I was skeptical — I'd tried 'marketing people' before and nothing came of it. DataLatte showed me exactly why my Google Maps visibility was low and fixed it. Within 2 months we were in the map pack for our main search terms. Worth every penny.",
        author: "James R.",
        role: "Owner, Morning Ritual Coffee",
        rating: 5,
      }}
      faq={[
        {
          q: "How long until I see results from local SEO?",
          a: "Google Business Profile improvements often show results in 4–8 weeks. Local SEO (ranking in organic search) takes 3–6 months to build traction. Google Ads can send traffic the day you launch.",
        },
        {
          q: "Do I need a big ad budget?",
          a: "No. For most local coffee shops, $300–$800/month in Google Ads can be highly effective when well-targeted. I'll recommend a budget based on your location and competition, not a number that benefits me.",
        },
        {
          q: "What if I already have someone managing my social media?",
          a: "That's fine — I can work alongside them or focus on paid channels and SEO while they handle organic social. I'm flexible.",
        },
        {
          q: "Do you work with chains or just independents?",
          a: "My focus is independent and small-chain coffee shops. I find the work more interesting and the impact more meaningful for owners who are actually building something.",
        },
      ]}
      ctaHeadline="Ready to fill more seats and build more regulars?"
    />
  );
}
