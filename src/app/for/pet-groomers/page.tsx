import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/pet-groomers",
    languages: {
      "en-US": "https://datalatte.pro/for/pet-groomers",
      "en-GB": "https://datalatte.pro/for/pet-groomers",
      "en-AU": "https://datalatte.pro/for/pet-groomers",
      "en-CA": "https://datalatte.pro/for/pet-groomers",
      "x-default": "https://datalatte.pro/for/pet-groomers",
    },
  },
  title: "Pet Groomer Marketing | Local SEO, Google Ads & More for Pet Businesses",
  description:
    "Marketing for pet groomers, dog walkers, and pet care businesses. Rank higher on Google Maps, get more appointment bookings, and grow your local client base.",
  openGraph: {
    title: "Pet Groomer Marketing | DataLatte",
    description:
      "Data-driven marketing for pet groomers — local SEO, Google Ads, and Google Business Profile optimization that brings in more furry clients.",
  },
};

export default function PetGroomersPage() {
  return (
    <NichePage
      niche="Pet Groomers"
      headline="More Tails Wagging — More Appointments Booked"
      subheadline="Pet owners love their pets and they will pay for quality. Let's make sure your grooming business is the first one they find and trust when they search locally."
      heroImage="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-700 to-coffee-950"
      problems={[
        "You depend on repeat clients and referrals — there's no reliable stream of new customers.",
        "Your Google Maps listing is buried behind competitors who may not even be better than you.",
        "Pet owners go to Facebook groups or NextDoor to ask for recommendations — and you're not in those conversations.",
        "You have no tracking in place, so you can't tell if that Yelp listing or Google ad is worth the money.",
        "Seasonal dips hit hard because there's no marketing system to smooth them out.",
      ]}
      kpis={[
        {
          metric: "New Appointments / Month",
          improvement: "+30–60%",
          desc: "A combination of local SEO and targeted ads can significantly grow your monthly bookings.",
        },
        {
          metric: "Google Maps Ranking",
          improvement: "Top 3",
          desc: "The local map pack captures the majority of clicks for \"pet groomer near me\" searches.",
        },
        {
          metric: "Cost Per New Client",
          improvement: "$5–$12",
          desc: "With good targeting and local ad strategy, acquisition cost is very low relative to lifetime value.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile",
          icon: "📍",
          desc: "Fully optimized listing with the right categories, services, photos of your space and happy pets, and a review strategy that works.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for \"dog groomer near me\", \"mobile pet grooming [city]\", \"cat grooming [neighborhood]\". Consistent citations and on-page SEO.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Show up at the top when pet owners are searching. Tight geo-targeting, strong ad copy, and proper conversion tracking.",
        },
        {
          title: "Meta Ads",
          icon: "📱",
          desc: "Target local pet owners on Facebook and Instagram. Adorable before/after photos, testimonials, and seasonal offers.",
        },
        {
          title: "Reputation & Reviews",
          icon: "⭐",
          desc: "Pet owners trust reviews heavily. I'll help you build a steady stream of genuine 5-star reviews and respond professionally to any negatives.",
        },
        {
          title: "Analytics Setup",
          icon: "📊",
          desc: "Track appointment form submissions, phone calls, and ad performance in one simple dashboard.",
        },
      ]}
      tactics={[
        {
          title: "Win the 'near me' search",
          detail:
            "\"Pet groomer near me\" and \"dog grooming near me\" are among the most common local searches in this niche. Google Maps optimization combined with consistent NAP citations is the foundation.",
        },
        {
          title: "Use pet photos obsessively",
          detail:
            "Before/after grooming photos perform exceptionally well on both Instagram and Facebook. Real photos of real pets you've groomed (with permission) build trust instantly.",
        },
        {
          title: "Target new movers",
          detail:
            "People who just moved to an area are actively looking for a new groomer. Meta Ads has 'new mover' targeting that can reach this high-intent audience within your service area.",
        },
        {
          title: "Build a referral and loyalty loop",
          detail:
            "Pet owners talk to each other. A simple referral offer (give $10, get $10) combined with a loyalty punch card or app can compound your word-of-mouth.",
        },
      ]}
      testimonial={{
        quote:
          "I'd been grooming for 8 years but always struggled with slow months. DataLatte set up my Google presence properly and ran some targeted Facebook ads. Now I have a waiting list. Genuinely didn't think this was possible for a small grooming salon.",
        author: "Lisa W.",
        role: "Owner, Happy Paws Grooming",
        rating: 5,
      }}
      faq={[
        {
          q: "Does this work for mobile groomers too?",
          a: "Absolutely. Mobile groomers can use Google Ads and local SEO just as effectively — often with less competition than brick-and-mortar. The service-area targeting in Google Business Profile is built for this.",
        },
        {
          q: "What about Yelp and other directories?",
          a: "I'll audit which directories you should be on and make sure your listings are consistent. For most groomers, Google is where I'd invest the most — but Yelp can still drive leads in some markets.",
        },
        {
          q: "I don't have a website — is that a problem?",
          a: "It helps, but isn't required to get started. Google Business Profile alone can drive real results. If you need a simple booking page, I can point you to the right tools.",
        },
        {
          q: "How competitive is the pet grooming space locally?",
          a: "It varies by market. During the free audit I'll check your local map pack and tell you exactly what you're up against and how realistic it is to win top positions.",
        },
      ]}
      ctaHeadline="Ready to grow your grooming business with real marketing?"
    />
  );
}
