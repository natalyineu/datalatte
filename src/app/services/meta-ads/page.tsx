import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Meta Ads (Facebook & Instagram) for Local Businesses",
  description:
    "Facebook and Instagram advertising for local SMBs. Reach your ideal local customer with scroll-stopping creative and campaigns that drive real foot traffic and bookings.",
};

export default function MetaAdsPage() {
  return (
    <ServicePage
      service="Meta Ads"
      tagline="Reach your ideal local customer on Facebook & Instagram — before they go looking."
      description="While Google captures demand, Meta creates it. Reach people in your neighborhood who match your ideal customer profile, even when they're not actively searching for you yet. Especially powerful for visual businesses."
      icon="📱"
      accentClass="bg-gradient-to-br from-gray-800 to-gray-900"
      whatItIs="Meta Ads covers advertising on Facebook, Instagram, and Meta's network of apps. Unlike Google Search where people are actively looking, Meta lets you proactively reach people based on who they are and where they are — demographics, interests, location radius, and more. For local businesses, this is incredibly powerful: you can target everyone within 3 miles of your shop, filter by age and interests, and show them a compelling offer. Lead Generation ads — where someone fills out a short form without leaving the app — are particularly effective for services like studios, salons, and groomers. The visual nature of Instagram makes it ideal for businesses where results are visible (hair, grooming, food)."
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
