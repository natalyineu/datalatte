import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/electricians",
    languages: {
      "en-US": "https://datalatte.pro/for/electricians",
      "en-GB": "https://datalatte.pro/for/electricians",
      "en-AU": "https://datalatte.pro/for/electricians",
      "en-CA": "https://datalatte.pro/for/electricians",
      "x-default": "https://datalatte.pro/for/electricians",
    },
  },
  title: "Electrician Marketing | Google Ads, Local SEO & More",
  description:
    "Data-driven marketing for electricians and electrical contractors. Get more service calls, dominate local search, and build a reliable pipeline of residential and commercial jobs.",
  openGraph: {
    title: "Electrician Marketing | DataLatte",
    description:
      "Get more service calls and jobs with local SEO, Google Ads, and Google Business Profile optimization built specifically for electricians.",
  },
};

export default function ElectriciansPage() {
  return (
    <NichePage
      niche="Electricians"
      headline="More Service Calls. More Jobs. Predictable Growth."
      subheadline="Electrical services are high-value and high-trust. When homeowners need an electrician, they search Google first. Let's make sure your business is what they find."
      heroImage="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-800 to-coffee-900"
      problems={[
        "You're not showing up in Google Maps or search when people look for 'electrician near me'.",
        "Job flow is inconsistent — busy seasons are great but slow periods hurt your bottom line.",
        "Larger electrical companies with bigger marketing budgets are taking the jobs you should be getting.",
        "You're not sure which marketing channels are worth the investment.",
        "Your website doesn't inspire trust and potential clients call your competitors instead.",
      ]}
      kpis={[
        {
          metric: "Inbound Service Calls",
          improvement: "+70–130%",
          desc: "Dominating local search for electrician queries generates a consistent flow of inbound leads.",
        },
        {
          metric: "Cost Per Lead",
          improvement: "$20–$50",
          desc: "With average job values of $300–$3000+, local advertising has exceptional ROI for electricians.",
        },
        {
          metric: "Google Maps Ranking",
          improvement: "Top 3",
          desc: "The map pack captures most local service searches — getting there transforms lead volume.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile Optimization",
          icon: "📍",
          desc: "Complete your GBP with services, license info, photos, and a review strategy. Trust is critical for electricians — your GBP is often where that trust is established or lost.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for 'electrician near me', 'licensed electrician [city]', 'panel upgrade [area]', and the specific services you most want to grow.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Search campaigns capturing high-intent electrical queries. Emergency and planned job searches both convert well — show up at the right moment.",
        },
        {
          title: "Google LSA (Local Services Ads)",
          icon: "✅",
          desc: "Google-guaranteed placement at the top of local results. Pay per lead, show your license and rating. Perfect for electricians with strong review profiles.",
        },
        {
          title: "Reputation Management",
          icon: "⭐",
          desc: "Build a review generation system. Homeowners choosing an electrician care deeply about reviews — a strong profile wins jobs before you ever pick up the phone.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Track every call, form, and job source. Know your cost per acquisition and which campaigns are generating real revenue.",
        },
      ]}
      tactics={[
        {
          title: "Own high-intent local searches",
          detail:
            "'Emergency electrician [city]', 'electrician near me', 'electrical panel upgrade [area]' — these searches represent homeowners ready to hire. Google Ads and GBP optimization capture them at the highest-converting moment.",
        },
        {
          title: "Differentiate on trust signals",
          detail:
            "Licensed, insured, years in business, reviews — electricians win on trust. Your GBP, website, and ads should lead with these signals. A 'Google Guaranteed' badge through LSA can be a game-changer for conversion.",
        },
        {
          title: "Target high-value service keywords",
          detail:
            "'EV charger installation [city]', 'whole home generator [area]', 'electrical panel replacement' — these high-value jobs often have less ad competition than broad terms and attract clients with bigger budgets.",
        },
        {
          title: "Build a referral and review system",
          detail:
            "Happy homeowners are your best marketing asset. A simple post-job follow-up asking for a Google review, and a referral incentive for repeat customers, builds the reputation that wins you jobs without ad spend.",
        },
      ]}
      testimonial={{
        quote:
          "I spent years relying on referrals and Angi. DataLatte built me a Google presence that now generates more leads than both combined — and the quality is better because they're searching for exactly what I offer.",
        author: "Derek W.",
        role: "Owner, Bright Spark Electrical",
        rating: 5,
      }}
      faq={[
        {
          q: "How much should an electrician spend on Google Ads?",
          a: "Most electrical contractors see strong results with $500–$1500/month. With average job values of $500–$3000, even a modest number of additional jobs per month creates excellent ROI.",
        },
        {
          q: "Should I use Google Ads or Local Services Ads?",
          a: "Both work well for electricians. LSA puts you at the very top with a Google Guarantee badge and charges per lead. Regular Google Ads give more keyword control. I typically recommend starting with LSA if you have strong reviews, adding Google Ads once LSA is optimized.",
        },
        {
          q: "How do I compete with large electrical companies?",
          a: "Local SEO and GBP optimization level the playing field. Large companies often have weak local profiles in specific neighborhoods. A focused independent electrician with great reviews consistently outranks national chains in local searches.",
        },
        {
          q: "How quickly can I see results?",
          a: "Google Ads and LSA can generate calls within days of launch. GBP improvements typically show results in 4–8 weeks. Organic local SEO builds over 3–6 months.",
        },
        {
          q: "I get most of my work from referrals — is online marketing worth it?",
          a: "Referrals are valuable but unpredictable. When a referred customer searches for you online before calling, a weak Google presence loses them. And when referral volume dips (it always does), online channels give you a predictable backup. The best electricians use referrals as a base and digital marketing as the growth layer.",
        },
        {
          q: "How do I attract higher-value jobs like panel upgrades or EV charger installs?",
          a: "Service-specific Google Ads targeting keywords like 'EV charger installation near me' or 'electrical panel upgrade [city]' attract clients specifically looking for those jobs — not just whoever calls first. Landing pages optimized for high-value services convert these searches at a much higher rate than a generic homepage.",
        },
        {
          q: "Do you work with electricians outside the US?",
          a: "Yes — UK, Australia, Canada, and other English-speaking markets. The trade services sector is highly local and search-driven globally. I adapt strategy, pricing benchmarks, and compliance requirements (UK Gas Safe, AU licensing requirements) to your local market.",
        },
      ]}
      ctaHeadline="Ready to build a predictable pipeline of jobs?"
    />
  );
}
