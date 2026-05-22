import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/nail-salons",
    languages: {
      "en-US": "https://datalatte.pro/for/nail-salons",
      "en-GB": "https://datalatte.pro/for/nail-salons",
      "en-AU": "https://datalatte.pro/for/nail-salons",
      "en-CA": "https://datalatte.pro/for/nail-salons",
      "x-default": "https://datalatte.pro/for/nail-salons",
    },
  },
  title: "Nail Salon Marketing | Google Ads, Local SEO & More",
  description:
    "Data-driven marketing for nail salons. Get found on Google Maps, attract new clients, and build a loyal customer base with proven local marketing strategies.",
  openGraph: {
    title: "Nail Salon Marketing | DataLatte",
    description:
      "Fill your appointment book with local SEO, Google Ads, and Google Business Profile optimization built specifically for nail salons.",
  },
};

export default function NailSalonsPage() {
  return (
    <NichePage
      niche="Nail Salons"
      headline="Fill Your Appointment Book — and Keep Clients Coming Back"
      subheadline="Nail salons thrive on repeat visits and local reputation. Let's build a marketing system that brings in new clients and turns them into regulars."
      heroImage="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-700 to-coffee-900"
      problems={[
        "You're not appearing in the top results when people search 'nail salon near me' in your area.",
        "You rely on regulars but growing your client base feels unpredictable and slow.",
        "Your Google Business Profile doesn't show your best work — and potential clients move on to competitors.",
        "You're posting on Instagram but can't tell if it's actually driving bookings.",
        "Larger chains are dominating local search even though your quality and service are better.",
      ]}
      kpis={[
        {
          metric: "New Client Bookings",
          improvement: "+50–100%",
          desc: "Targeted local campaigns reach people actively searching for nail services in your area.",
        },
        {
          metric: "Cost Per New Client",
          improvement: "$5–$15",
          desc: "With strong lifetime value per client, local ads pay back quickly.",
        },
        {
          metric: "Google Maps Ranking",
          improvement: "Top 3",
          desc: "Get into the local map pack where 70%+ of high-intent searches click.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile Optimization",
          icon: "📍",
          desc: "Showcase your best nail art, complete your services list, and build a review system. The map pack is where clients find you — let's make sure you're there.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for 'nail salon near me', 'gel nails [city]', 'nail art [neighborhood]', and service-specific searches that bring in clients ready to book.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Hyperlocal search campaigns that put your salon in front of people searching for nail services within miles of your location. Only pay when someone clicks.",
        },
        {
          title: "Meta Ads",
          icon: "📱",
          desc: "Visual nail art content, seasonal promotions, and loyalty offers on Instagram and Facebook reaching local women in your target demographic.",
        },
        {
          title: "Reputation Management",
          icon: "⭐",
          desc: "Build a review generation system that consistently turns happy clients into 5-star reviews. Reviews are one of the top factors in map pack ranking.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Know which channels are driving bookings, what your cost per new client is, and where to invest more.",
        },
      ]}
      tactics={[
        {
          title: "Win 'nail salon near me' in your neighborhood",
          detail:
            "This is the highest-value search for nail salons. Optimizing your GBP with the right service categories, regular photo uploads, and review responses puts you in the map pack where most bookings start.",
        },
        {
          title: "Showcase your best work consistently",
          detail:
            "Nail salons have a huge advantage — the work is beautiful and highly shareable. A simple system for photographing every stand-out set and posting it to your GBP and Instagram builds both social proof and search visibility.",
        },
        {
          title: "Run seasonal promotions with tight local targeting",
          detail:
            "Prom season, Valentine's Day, wedding season, holidays — nail salons have natural promotional moments throughout the year. Meta ads with 5–7 day windows and 3–5 mile radius targeting can fill your book fast.",
        },
        {
          title: "Build a rebooking system",
          detail:
            "Most clients need their nails done every 3–4 weeks. An automated text reminder 2 weeks after their last visit — 'Ready to rebook?' — can increase return visit rate by 30%+ with minimal effort.",
        },
      ]}
      testimonial={{
        quote:
          "I was losing clients to the chain salon down the street. DataLatte got us into the Google Maps top 3 for our neighborhood within 6 weeks. Now I'm booked 2 weeks in advance and had to hire another technician.",
        author: "Lisa M.",
        role: "Owner, Polish & Glow Nail Studio",
        rating: 5,
      }}
      faq={[
        {
          q: "How much should a nail salon spend on Google Ads?",
          a: "Most nail salons see strong results with $200–$500/month. The key is hyperlocal targeting — you only want people who can actually reach your location.",
        },
        {
          q: "Is Instagram important for nail salons?",
          a: "Yes — nail art is inherently visual and Instagram is where people discover new salons. But organic Instagram alone is slow. Combining it with paid Meta ads to a local audience accelerates results dramatically.",
        },
        {
          q: "How do I compete with chain salons?",
          a: "Local SEO and GBP optimization level the playing field. Chains have brand recognition but often have weak local profiles. A well-optimized independent salon consistently outranks chains in neighborhood searches.",
        },
        {
          q: "How quickly can I see results?",
          a: "Google Business Profile improvements show results in 4–8 weeks. Google Ads can drive bookings the first week. Organic SEO builds over 3–6 months.",
        },
      ]}
      ctaHeadline="Ready to fill your appointment book?"
    />
  );
}
