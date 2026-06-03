import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/meta-ads",
    languages: {
      "en-US": "https://datalatte.pro/services/meta-ads",
      "en-GB": "https://datalatte.pro/services/meta-ads",
      "en-AU": "https://datalatte.pro/services/meta-ads",
      "en-CA": "https://datalatte.pro/services/meta-ads",
      "x-default": "https://datalatte.pro/services/meta-ads",
    },
  },
  title: "Meta Ads (Facebook & Instagram) for Local Businesses",
  description:
    "Facebook and Instagram advertising for local SMBs. Reach your ideal local customer with scroll-stopping creative and campaigns that drive real foot traffic and bookings.",
  openGraph: {
    title: "Meta Ads (Facebook & Instagram) for Local Businesses",
    description: "Facebook and Instagram advertising for local SMBs. Reach your ideal local customer with scroll-stopping creative and campaigns that drive real foot traffic and bookings.",
    url: "https://datalatte.pro/services/meta-ads",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Ads (Facebook & Instagram) for Local Businesses",
    description: "Facebook and Instagram advertising for local SMBs. Reach your ideal local customer with scroll-stopping creative and campaigns that drive real foot traffic and bookings.",
  },
};

export default function MetaAdsPage() {
  return (
    <ServicePage
      service="Meta Ads"
      tagline="Reach your ideal local customer on Facebook & Instagram — before they go looking."
      description="While Google captures demand, Meta creates it. Reach people in your neighborhood who match your ideal customer profile, even when they're not actively searching for you yet. Especially powerful for visual businesses."
      icon="📱"
      accentClass="bg-gradient-to-br from-gray-800 to-gray-900"
      whatItIs="Meta Ads covers advertising on Facebook, Instagram, and Meta's network of apps. Unlike Google Search where people are actively looking, Meta lets you proactively reach people based on who they are and where they are — demographics, interests, location radius, and more. For local businesses, this is incredibly powerful: you can target everyone within 3 miles of your shop, filter by age and interests, and show them a compelling offer. Lead Generation ads — where someone fills out a short form without leaving the app — are particularly effective for services like studios, salons, and groomers. The visual nature of Instagram makes it ideal for businesses where results are visible (hair, grooming, food).\n\nIn the marketing funnel, Meta Ads sits at the top and middle — it creates and nurtures demand rather than capturing it. A yoga studio ad showing a serene morning class plants a seed in someone who wasn't actively searching. A retargeting ad reminding them of a free trial offer closes the loop. This is why Meta Ads pairs especially well with Google Ads: Meta warms up an audience, Google captures them when they finally search. Together they reduce cost per acquisition across the whole funnel. With over 2.4 billion monthly active Facebook users and Instagram deeply embedded into daily life, your local audience is already there — you just need to reach the right slice of it. For local businesses, typical CPMs (cost per thousand impressions) run $0.50–$2 for radius-targeted audiences, making brand exposure very affordable even on modest budgets, with first ad impressions typically appearing within 72 hours of launch.\n\nThe most common mistake local businesses make with Meta Ads is treating it like Google Search — running ads with no offer, no clear call to action, and expecting the same immediate purchase intent. People on Facebook and Instagram are in a browsing mindset. Your ad needs a hook strong enough to interrupt the scroll, an offer compelling enough to drive action (a free class, a first-appointment discount, a downloadable guide), and a follow-up sequence to convert the lead. Running a $5/day ad that says 'Come visit us!' with a generic photo will burn budget with nothing to show for it. The creative and the offer do the heavy lifting — the targeting just gets your message in front of the right people."
      howItWorks={[
        {
          step: "01",
          title: "Audience research & strategy",
          desc: "I identify your best customer profile and map it to Meta targeting options. I also check what your competitors are running using the Meta Ad Library.",
        },
        {
          step: "02",
          title: "Offer and creative brief",
          desc: "The offer (free trial class, first booking discount, etc.) and the creative (image/video + copy) are the most important variables. I'll help you define the offer and brief you on what creative to produce.",
        },
        {
          step: "03",
          title: "Campaign setup",
          desc: "Proper campaign structure — awareness, consideration, conversion — with tight geographic targeting. Lead ads or traffic campaigns depending on your goal.",
        },
        {
          step: "04",
          title: "Pixel and conversion setup",
          desc: "Meta Pixel on your website, conversion events set up, lead form responses connected to your CRM or email. No conversions falling through the cracks.",
        },
        {
          step: "05",
          title: "Test, learn, optimize",
          desc: "Meta's algorithm needs data. I test multiple creative variants and audiences, cut underperformers quickly, and scale what's working.",
        },
      ]}
      included={[
        "Ad account setup or audit",
        "Audience research and targeting strategy",
        "Campaign structure (awareness → conversion funnel)",
        "Ad copy for all placements",
        "Creative briefs for images/videos (you supply the assets)",
        "Lead form setup if applicable",
        "Meta Pixel and conversion event configuration",
        "A/B testing framework",
        "Monthly reporting and strategy review",
        "Lookalike audience creation from your existing customer list",
        "Retargeting campaign setup for website visitors and video viewers",
        "Advantage+ Shopping or Advantage+ Audience campaign configuration",
      ]}
      notIncluded={[
        "Content creation / photography / video production (I brief you on what to capture)",
        "Organic social media management",
        "Ad spend — billed directly through your Meta account",
        "Email or SMS follow-up sequences (I can advise but don't build them)",
      ]}
      bestFor={[
        "Hair salons and beauty studios with strong visual results",
        "Fitness and yoga studios offering trial classes",
        "Coffee shops promoting seasonal menus or events",
        "Pet groomers with adorable before/after content",
        "Businesses that want to build local brand awareness",
        "Any local business with a compelling offer for new customers",
      ]}
      faqs={[
        {
          q: "What kind of budget do I need for Meta Ads?",
          a: "$300–$600/month is a good starting point for most local businesses. Lead generation campaigns can work effectively even at $10–$20/day. I'll recommend a budget based on your goals and local competition.",
        },
        {
          q: "Do I need professional photos or videos?",
          a: "Not necessarily. For many niches (especially salons and groomers), authentic photos from your phone perform as well or better than professional shoots. I'll tell you exactly what to capture.",
        },
        {
          q: "What's the difference between boosting a post and running a proper ad?",
          a: "Boosting is a shortcut that skips most of the targeting and optimization options. Proper Meta Ads campaigns give you full control over objectives, audiences, placements, creative testing, and conversion tracking. Boosted posts waste money by comparison.",
        },
        {
          q: "My Instagram has low followers — does that affect ads?",
          a: "No. Your ad can reach thousands of local people regardless of your follower count. A well-targeted ad from a new account will outperform an organic post from an account with 10,000 followers.",
        },
        {
          q: "I tried Facebook Ads before and got zero results — why would it be different now?",
          a: "The three most common culprits are: a weak offer (no clear reason to act), poor creative (a generic stock photo instead of a real image of your business or results), and no follow-up (leads came in but no one called them). Fix those three and the same ad budget can deliver 5–10× better returns. I always review what was run before, identify what went wrong, and rebuild from there.",
        },
        {
          q: "How long does it take before I see results?",
          a: "Your ads can appear within 72 hours of going live once approved. Meta's algorithm typically needs 7–14 days and 50 conversions per ad set to exit the 'learning phase' and start optimising properly. Plan for a 30-day ramp-up before judging performance — though many campaigns show positive early signals within the first two weeks.",
        },
        {
          q: "Should I run Facebook Ads or Instagram Ads — or both?",
          a: "For most local service businesses, I recommend running across both simultaneously and letting Meta's algorithm allocate budget to whichever placement performs better. Instagram tends to outperform for visually-led niches (salons, food, fitness), while Facebook often wins for older demographics and lead generation. Running both and optimising based on data is almost always better than guessing upfront.",
        },
        {
          q: "What offer actually works for local businesses on Meta?",
          a: "The highest-converting offers for local businesses are: a free first session or trial (fitness studios), a percentage off the first appointment (salons, groomers), or a time-limited gift with purchase (cafés, retail). Generic 'come visit us' ads with no clear incentive almost never perform. The more specific and low-risk the offer feels to the customer, the higher the conversion rate.",
        },
      ]}
      stats={[
        { value: "$0.50–2", label: "Average CPM for local audience targeting" },
        { value: "1–3%", label: "Typical CTR for local service ads" },
        { value: "2.4bn", label: "Monthly active Facebook users" },
        { value: "72h", label: "Typical time to first ad impressions" },
      ]}
      relatedLinks={[
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Social Media Management", href: "/services/social-media" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
        { label: "Local SEO", href: "/services/local-seo" },
      ]}
    />
  );
}
