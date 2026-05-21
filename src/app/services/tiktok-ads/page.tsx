import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/tiktok-ads",
    languages: {
      "en-US": "https://datalatte.pro/services/tiktok-ads",
      "en-GB": "https://datalatte.pro/services/tiktok-ads",
      "en-AU": "https://datalatte.pro/services/tiktok-ads",
      "en-CA": "https://datalatte.pro/services/tiktok-ads",
      "x-default": "https://datalatte.pro/services/tiktok-ads",
    },
  },
  title: "TikTok Ads for Local Businesses & Small Brands | DataLatte",
  description:
    "TikTok Ads management for local businesses and growing brands. Reach a young, high-intent audience at a fraction of the cost of Facebook or Google.",
  openGraph: {
    title: "TikTok Ads for Local Businesses & Small Brands | DataLatte",
    description: "TikTok Ads management for local businesses and growing brands. Reach a young, high-intent audience at a fraction of the cost of Facebook or Google.",
    url: "https://datalatte.pro/services/tiktok-ads",
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte — TikTok Ads for Local Businesses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Ads for Local Businesses & Small Brands | DataLatte",
    description: "TikTok Ads management for local businesses and growing brands.",
    images: ["https://datalatte.pro/opengraph-image"],
  },
};

export default function TikTokAdsPage() {
  return (
    <ServicePage
      service="TikTok Ads"
      tagline="Reach the next generation of local customers before your competitors discover TikTok."
      description="TikTok has over 1 billion monthly active users and ad costs that are still a fraction of Facebook or Instagram. For local businesses targeting 18–45 year olds, TikTok Ads offer extraordinary reach at genuinely low CPMs — and the native video format builds brand recognition faster than any other channel."
      icon="🎵"
      accentClass="bg-gradient-to-br from-pink-800 to-gray-950"
      whatItIs="TikTok Ads (via TikTok Ads Manager) lets you place short-form video ads inside the TikTok feed — the same feed your customers are already scrolling for 90 minutes a day. Unlike Google (where you target intent) or Facebook (where you target demographics), TikTok's algorithm targets by content affinity — it shows your ad to people who have watched similar content. This means even a local business in a small city can reach a highly relevant audience without massive budgets. The creative format is different too: TikTok ads work best when they look like native content, not polished commercials. 'Native feels real, real builds trust, trust drives action' — that's the TikTok Ads playbook."
      howItWorks={[
        {
          step: "01",
          title: "Account and pixel setup",
          desc: "I set up your TikTok Ads Manager account, install the TikTok Pixel on your website for conversion tracking, and configure your business profile.",
        },
        {
          step: "02",
          title: "Audience and campaign strategy",
          desc: "I define your targeting — interest categories, behavioral signals, geographic radius, and lookalike audiences based on your existing customers.",
        },
        {
          step: "03",
          title: "Creative strategy and scripting",
          desc: "I develop video scripts and creative briefs designed to perform in the TikTok feed. Native-style content that hooks within 1–2 seconds and drives a clear CTA.",
        },
        {
          step: "04",
          title: "Campaign launch and testing",
          desc: "I launch campaigns with multiple creative variations, testing hooks, formats (In-Feed, TopView, Spark Ads), and offers to find the winning combination.",
        },
        {
          step: "05",
          title: "Optimise, scale, and report",
          desc: "I monitor CPM, CTR, and cost-per-conversion daily. Winning ads get scaled; underperformers get replaced. Monthly reports in plain English.",
        },
      ]}
      included={[
        "TikTok Ads Manager account setup and configuration",
        "TikTok Pixel installation and conversion event setup",
        "Audience research and targeting strategy",
        "Interest, behaviour, and lookalike audience setup",
        "Geographic targeting for local service areas",
        "Video creative scripting and creative briefs",
        "Spark Ads setup (boosting your organic TikToks as ads)",
        "In-Feed Ad campaign management",
        "Multiple creative variation testing",
        "Retargeting campaigns for website visitors and video viewers",
        "Daily monitoring and bid optimisation",
        "Monthly performance reports",
      ]}
      bestFor={[
        "Hair salons, beauty brands, and cosmetic businesses",
        "Coffee shops and restaurants with strong visual appeal",
        "Fitness studios and wellness brands",
        "Fashion, lifestyle, and consumer product brands",
        "Local businesses targeting 18–35 year olds",
        "Businesses with visual transformations or experiences to show",
        "Any brand willing to invest in native-style video creative",
      ]}
      faqs={[
        {
          q: "Is TikTok only for young people?",
          a: "TikTok's fastest growing demographic is now 25–44 year olds, and it's strong in the 18–34 bracket. If your customers are under 45, TikTok is almost certainly worth testing. If you're targeting 55+ exclusively, Meta Ads or Google Ads are likely a better fit.",
        },
        {
          q: "What budget do I need for TikTok Ads?",
          a: "TikTok's minimum campaign budget is $50/day, but for local businesses I recommend starting with $500–$1,000/month in ad spend to gather meaningful data. CPMs on TikTok are still well below Facebook in most niches, so your money goes further.",
        },
        {
          q: "Do I need to already have a TikTok account?",
          a: "Not necessarily. You can run In-Feed Ads without an organic presence. However, Spark Ads (which boost your organic posts) perform exceptionally well if you already have content — so an existing account helps. I can advise on whether to build organic first or go straight to paid.",
        },
        {
          q: "How is TikTok Ads different from Meta Ads?",
          a: "TikTok is all video — there's no image or carousel ad format. The audience skews younger and the content style is more raw and authentic. CPMs are generally lower than Meta right now, but the creative bar is different. A polished Facebook ad often flops on TikTok. I manage both and can run them in parallel as part of a broader paid social strategy.",
        },
      ]}
      relatedLinks={[
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Social Media Management", href: "/services/social-media" },
        { label: "Video Marketing", href: "/services/video-marketing" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
