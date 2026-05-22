import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/barbershops",
    languages: {
      "en-US": "https://datalatte.pro/for/barbershops",
      "en-GB": "https://datalatte.pro/for/barbershops",
      "en-AU": "https://datalatte.pro/for/barbershops",
      "en-CA": "https://datalatte.pro/for/barbershops",
      "x-default": "https://datalatte.pro/for/barbershops",
    },
  },
  title: "Barbershop Marketing | Google Ads, Local SEO & More",
  description:
    "Data-driven marketing for barbershops. Dominate Google Maps, attract new clients with Google Ads, and keep your chairs full with real analytics.",
  openGraph: {
    title: "Barbershop Marketing | DataLatte",
    description:
      "Get more clients in your chair with local SEO, Google Ads, and Google Business Profile optimization built specifically for barbershops.",
  },
};

export default function BarbershopsPage() {
  return (
    <NichePage
      niche="Barbershops"
      headline="Keep Every Chair Booked — Without Relying on Walk-Ins"
      subheadline="Barbershops win on repeat business and local reputation. Let's use data to bring you a steady stream of new clients while keeping your regulars coming back."
      heroImage="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-800 to-coffee-900"
      problems={[
        "You're not showing up when people search 'barbershop near me' — even though you've been there for years.",
        "You rely on word-of-mouth but growth has plateaued and you need a more predictable pipeline.",
        "Your Google Business Profile has outdated photos and hasn't been touched since you opened.",
        "You tried Instagram but it takes too much time and doesn't translate to actual bookings.",
        "Newer shops with flashier websites are outranking you even though your cuts are better.",
      ]}
      kpis={[
        {
          metric: "Google Maps Visibility",
          improvement: "+80–150%",
          desc: "More local search impressions mean more walk-ins and calls without paying for every click.",
        },
        {
          metric: "Cost Per New Client",
          improvement: "$4–$10",
          desc: "Targeted local Google Ads can bring new regulars at a fraction of what you make on a single visit.",
        },
        {
          metric: "Monthly New Reviews",
          improvement: "3–5×",
          desc: "A simple review system turns happy clients into your best marketing asset.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile Optimization",
          icon: "📍",
          desc: "Optimize your categories, services, photos, and hours. The map pack is free traffic — and barbershops with complete profiles get 3× more direction requests.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for 'barbershop near me', 'men's haircut in [city]', and neighborhood-specific terms that bring in clients ready to book.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Hyperlocal search campaigns targeting people within a mile or two of your shop. Show up exactly when someone is looking for a barber.",
        },
        {
          title: "Meta Ads",
          icon: "📱",
          desc: "Before-and-after photos, promotions, and loyalty offers on Instagram and Facebook reaching locals who fit your ideal client profile.",
        },
        {
          title: "Reputation Management",
          icon: "⭐",
          desc: "Build a consistent review generation system. Star rating is one of the top factors in map pack ranking — and in a client's decision to book.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Know exactly which marketing is driving calls and bookings. No guesswork, no vanity metrics.",
        },
      ]}
      tactics={[
        {
          title: "Win the map pack for 'barbershop near me'",
          detail:
            "This single search term drives more local barbershop bookings than anything else. Optimizing your GBP with the right categories, services, and consistent NAP data puts you in front of high-intent searchers every day.",
        },
        {
          title: "Use before-and-after content strategically",
          detail:
            "Barbershops have a natural content advantage — the transformation is visual and shareable. A simple photo system for every great cut, posted consistently, builds both social proof and local brand recognition.",
        },
        {
          title: "Target high-value keywords in Google Ads",
          detail:
            "'Fade haircut [city]', 'beard trim near me', 'best barber [neighborhood]' — these long-tail terms have lower competition and higher booking intent than broad terms.",
        },
        {
          title: "Build a loyalty loop",
          detail:
            "The average client visits a barbershop every 3–4 weeks. A simple loyalty program or text reminder system can increase visit frequency by 20–30% without any new client acquisition cost.",
        },
      ]}
      testimonial={{
        quote:
          "I'd been in business 8 years and always relied on regulars. DataLatte got me into the Google Maps top 3 for my neighborhood and I've had to hire an extra barber. The ROI is ridiculous.",
        author: "Marcus T.",
        role: "Owner, Fade & Shave Barbershop",
        rating: 5,
      }}
      faq={[
        {
          q: "How much should a barbershop spend on Google Ads?",
          a: "Most independent barbershops see strong results with $200–$500/month. Because the targeting is hyperlocal and the service has high repeat value, even a small budget can be very profitable.",
        },
        {
          q: "How long until I see results from local SEO?",
          a: "Google Business Profile improvements show results in 4–8 weeks. Organic local SEO takes 3–6 months. Google Ads can start driving traffic the day you launch.",
        },
        {
          q: "Do I need a booking system to run ads?",
          a: "No — ads can drive calls, walk-ins, or clicks to your booking link. But having an online booking option (even a free one like Square Appointments) significantly increases conversion rate.",
        },
        {
          q: "Can you help me get more 5-star reviews?",
          a: "Yes — review generation is part of every engagement. I set up a simple system that asks happy clients at the right moment. Most shops 3× their review volume in 90 days.",
        },
      ]}
      ctaHeadline="Ready to keep every chair booked?"
    />
  );
}
