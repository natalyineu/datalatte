import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: { canonical: "https://datalatte.pro/for/real-estate-agents" },
  title: "Real Estate Agent Marketing | Google Ads, SEO & Lead Generation",
  description:
    "Data-driven marketing for real estate agents and brokers. Generate buyer and seller leads, build your personal brand, and stop depending on Zillow referral fees.",
  openGraph: {
    title: "Real Estate Marketing That Generates Qualified Leads | DataLatte",
    description:
      "Google Ads, local SEO, and Meta Ads built for real estate agents. Own your leads instead of renting them from Zillow and Realtor.com.",
  },
};

export default function RealEstateAgentsPage() {
  return (
    <NichePage
      niche="Real Estate Agents"
      headline="Generate More Listings and Buyer Leads — Without Zillow's Fees"
      subheadline="The best real estate agents own their lead generation. Let's build a digital presence that attracts motivated buyers and sellers directly to you."
      heroImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-600 to-coffee-900"
      problems={[
        "You're paying Zillow, Realtor.com, or your team $500–$2,000/month for leads that go cold.",
        "Your personal brand is invisible online — buyers and sellers don't find you, they find the brokerage.",
        "You're relying on referrals, which are great but unpredictable and hard to scale.",
        "Competitors in your market have more Google reviews and consistently rank above you.",
        "Your ads aren't converting because they send people to a generic brokerage website.",
      ]}
      kpis={[
        {
          metric: "Qualified Leads / Month",
          improvement: "+10–30",
          desc: "Targeted Google Ads and Meta campaigns focused on buyer and seller intent generate consistent inbound enquiries.",
        },
        {
          metric: "Cost Per Qualified Lead",
          improvement: "$50–$180",
          desc: "With commission per transaction typically $8,000–$25,000+, even premium lead generation pays back on a single closing.",
        },
        {
          metric: "Brand Search Volume",
          improvement: "+200–400%",
          desc: "A content and social strategy that builds your name in your market creates compounding inbound interest over time.",
        },
      ]}
      services={[
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Search campaigns targeting buyer and seller intent: 'homes for sale in [area]', 'sell my house [city]', 'real estate agent near me'. Own your market instead of sharing leads.",
        },
        {
          title: "Meta Ads (Facebook & Instagram)",
          icon: "📱",
          desc: "Listing promotion, neighbourhood spotlights, and brand-building campaigns. Video ads showcasing your personality convert browsers into enquiries.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for neighbourhood-specific searches: 'real estate agent [neighbourhood]', 'best realtor [city]'. Organic rankings produce the highest-quality leads.",
        },
        {
          title: "Google Business Profile",
          icon: "📍",
          desc: "A fully optimised GBP with reviews, posts, and service areas builds credibility and local visibility for buyers and sellers searching your market.",
        },
        {
          title: "Website & Landing Pages",
          icon: "💻",
          desc: "Personal brand websites and dedicated buyer/seller landing pages that convert ad traffic into real enquiries — not generic brokerage pages.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Know exactly which channels produce your best leads. Track cost per lead, cost per closing, and ROI across every campaign.",
        },
      ]}
      tactics={[
        {
          title: "Build neighbourhood authority content',",
          detail:
            "The agents who dominate Google are those with content about specific neighbourhoods: school districts, commute times, market stats. This content attracts highly motivated buyers who are already researching.",
        },
        {
          title: "Separate buyer and seller campaigns',",
          detail:
            "Buyers and sellers have completely different intent, pain points, and decision timelines. Running separate ad campaigns with dedicated landing pages dramatically improves conversion rates and lead quality.",
        },
        {
          title: "Use retargeting to stay top of mind",
          detail:
            "Most real estate decisions take weeks to months. A Meta retargeting campaign that follows up website visitors with market updates, new listings, and success stories keeps you front-of-mind through the decision process.",
        },
        {
          title: "Leverage video for personal branding',",
          detail:
            "Short-form video on Instagram and Facebook showing property tours, neighbourhood walks, and market commentary builds trust and brand recognition faster than any other format. Buyers want to know who they're working with.",
        },
      ]}
      testimonial={{
        quote:
          "I was spending $1,800/month on Zillow leads that were shared with 5 other agents. DataLatte built me a Google Ads campaign and neighbourhood landing pages that now generate 15–20 exclusive leads per month at a third of the cost. I wish I'd done this years ago.",
        author: "Robert K.",
        role: "Licensed Realtor, Chicago Metro",
        rating: 5,
      }}
      faq={[
        {
          q: "Can I really compete with large brokerages on Google?",
          a: "In local search, yes. Google prioritises relevance and proximity over domain authority. A well-optimised personal GBP and local landing pages often outrank brokerage sites for neighbourhood-specific searches.",
        },
        {
          q: "What's a realistic monthly ad budget for real estate?",
          a: "Most individual agents see strong results with $600–$1,500/month. Given that a single closing typically produces $8,000–$25,000+ in commission, the ROI threshold is low.",
        },
        {
          q: "How do you handle compliance with real estate advertising rules?",
          a: "I'm experienced with NAR guidelines, fair housing requirements, and Meta's special ad category policies for housing. All campaigns are built to be fully compliant.",
        },
        {
          q: "I'm with a large brokerage — can I still build my own brand?",
          a: "Absolutely. Building your personal brand alongside your brokerage affiliation is not only allowed — it's expected. The agents with the strongest personal brands are the ones who survive market downturns and brokerage changes.",
        },
      ]}
      ctaHeadline="Ready to own your leads instead of renting them?"
    />
  );
}
