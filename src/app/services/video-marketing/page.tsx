import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/video-marketing",
    languages: {
      "en-US": "https://datalatte.pro/services/video-marketing",
      "en-GB": "https://datalatte.pro/services/video-marketing",
      "en-AU": "https://datalatte.pro/services/video-marketing",
      "en-CA": "https://datalatte.pro/services/video-marketing",
      "x-default": "https://datalatte.pro/services/video-marketing",
    },
  },
  title: "Video Marketing & YouTube Ads for Local Businesses | DataLatte",
  description:
    "YouTube Ads, Reels, and short-form video strategy for local businesses. Video marketing that builds brand awareness and drives bookings — not just views.",
  openGraph: {
    title: "Video Marketing & YouTube Ads for Local Businesses | DataLatte",
    description: "YouTube Ads, Reels, and short-form video strategy for local businesses. Video marketing that builds brand awareness and drives bookings — not just views.",
    url: "https://datalatte.pro/services/video-marketing",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Marketing & YouTube Ads for Local Businesses | DataLatte",
    description: "YouTube Ads, Reels, and short-form video strategy for local businesses.",
  },
};

export default function VideoMarketingPage() {
  return (
    <ServicePage
      service="Video Marketing"
      tagline="Show your business in motion. Build trust, reach new audiences, and drive bookings."
      description="Video is now the highest-performing content format across every major platform — Google Search, YouTube, Instagram, Facebook, and TikTok. For local businesses, a well-executed video strategy turns browsers into believers before they ever visit you."
      icon="🎬"
      accentClass="bg-gradient-to-br from-rose-800 to-rose-950"
      stats={[
        { value: "86%", label: "Of businesses use video as a marketing tool — up from 61% in 2016" },
        { value: "2×", label: "More time spent on pages with video vs text-only pages" },
        { value: "$0.01", label: "Minimum cost-per-view achievable with YouTube Ads for local targeting" },
      ]}
      whatItIs="Video marketing encompasses everything from YouTube pre-roll ads to Instagram Reels to in-feed Facebook video — and the strategies for each platform are completely different. YouTube Ads work like Google Ads for video: you target people actively searching for relevant content or browsing related channels, and pay when they choose to watch. Short-form video (Reels, Shorts, TikTok) works more like organic content distribution, where the algorithm shows your video to people based on their interests — you don't need a large following to go viral. For local businesses, the most powerful use case is often 'before and after' content (hair salons, cleaning services, fitness studios), 'how it works' explainers (dentists, financial advisors), and local atmosphere content (coffee shops, restaurants) that makes people want to come in.

The single biggest barrier local businesses face with video is the belief that it requires expensive production. It doesn't. The most effective local business video content is filmed on a modern smartphone, edited with a free app, and looks deliberately casual — because on TikTok, Reels, and YouTube Shorts, authenticity outperforms polish every time. A salon owner filming a 30-second transformation with trending audio will routinely outperform a $5,000 brand video shot by a production company. The strategy matters far more than the equipment.

YouTube Ads deserve special attention for local businesses with any consideration phase in the buying journey. Dentists, financial advisors, cosmetic clinics, fitness studios — any business where a prospect needs to feel comfortable before booking — benefit enormously from video ads that show their face, their space, and their approach. A 30-second YouTube Ad that a prospect sees 3–5 times before they book creates the same trust that word-of-mouth used to provide. For these categories, video isn't optional — it's the channel that closes the trust gap faster than anything else."
      howItWorks={[
        {
          step: "01",
          title: "Video strategy and platform selection",
          desc: "I identify which video formats and platforms are the right fit for your business, budget, and audience — YouTube Ads, Instagram Reels, Facebook video, or a mix.",
        },
        {
          step: "02",
          title: "Content planning and scripting",
          desc: "I create a video content plan with briefs and scripts for each piece. For ads, I write scripts designed to hook viewers in the first 5 seconds and drive a clear action.",
        },
        {
          step: "03",
          title: "YouTube Ads campaign setup",
          desc: "For YouTube, I set up In-Stream or In-Feed ad campaigns with geographic targeting, audience layering, and keyword targeting to reach local customers actively researching your category.",
        },
        {
          step: "04",
          title: "Short-form video production guidance",
          desc: "I guide you (or your team) on shooting high-performing Reels and Shorts with your phone — lighting, framing, hooks, captions — so you don't need a production team.",
        },
        {
          step: "05",
          title: "Optimise and scale",
          desc: "I track view-through rates, engagement, and conversion events. Videos that perform get scaled; underperformers get replaced with new creative. Monthly reporting included.",
        },
      ]}
      included={[
        "Video marketing strategy and platform recommendation",
        "YouTube Ads campaign setup and management",
        "In-Stream (skippable and non-skippable) ad campaigns",
        "In-Feed video ad campaigns",
        "Video audience targeting and remarketing setup",
        "Conversion tracking for video campaigns",
        "Short-form video content planning (Reels, Shorts)",
        "Video scripting and creative briefs",
        "Caption and hook copywriting",
        "Instagram and Facebook video ad integration",
        "View-through and engagement rate analysis",
        "Monthly video performance reports",
      ]}
      bestFor={[
        "Hair salons and beauty businesses with visible transformation content",
        "Fitness studios and gyms showcasing classes and results",
        "Restaurants and coffee shops with strong visual atmosphere",
        "Cleaning services, home services, and tradespeople (before/after)",
        "Dentists and healthcare providers building patient trust",
        "Businesses launching a new location or service",
        "Any business with a visual product or process to show",
      ]}
      faqs={[
        {
          q: "Do I need professional video equipment?",
          a: "No. Modern smartphones shoot excellent video. I'll show you exactly how to capture content that looks polished — the right lighting, framing, and editing apps. Professional production is an option for hero brand videos, but most local business content works brilliantly with phone footage.",
        },
        {
          q: "How much should I budget for YouTube Ads?",
          a: "YouTube Ads can work from as little as $200–$400/month for local targeting. Because you only pay when someone watches at least 30 seconds (or the full ad if shorter), the cost-per-view is often very low. For a local service area, your ad can reach thousands of relevant prospects per month on a modest budget.",
        },
        {
          q: "Will my Reels and Shorts get views without followers?",
          a: "Yes — short-form platforms actively distribute new content to non-followers if it's engaging. Many of my clients' best-performing videos came from accounts with under 500 followers. The algorithm rewards content, not follower count.",
        },
        {
          q: "Can video marketing work for B2B businesses?",
          a: "Absolutely. YouTube and LinkedIn video ads are increasingly effective for B2B lead generation — especially explainer videos and case study content. The approach differs from consumer local businesses, but the underlying strategy is the same.",
        },
        {
          q: "What's the difference between YouTube Ads and running organic YouTube content?",
          a: "Organic YouTube requires consistent long-form content publishing over months to build an audience — it's a long game. YouTube Ads give you immediate, targeted reach to people who haven't found your channel yet. For local businesses, ads are almost always the faster path to results. Organic YouTube makes sense as a secondary strategy once you have an established content library.",
        },
        {
          q: "How do I know if my video ads are actually working?",
          a: "I set up conversion tracking for every video campaign — phone clicks, form submissions, and store visits where available. YouTube Ads also provide view-through conversions: people who saw your ad and converted later without clicking. Monthly reports show cost-per-view, view-through rate, and attributed conversions so you can see the full picture.",
        },
        {
          q: "Should I use the same video across all platforms?",
          a: "Not without editing. Video specs, aspect ratios, ideal lengths, and content styles differ significantly between YouTube (16:9, 30–60s for ads), Instagram Reels (9:16, 15–30s), Facebook (square or 4:5 often wins), and TikTok (9:16, fast pace). I'll advise on repurposing your core video into platform-optimised cuts so you get maximum reach without producing everything from scratch.",
        },
      ]}
      relatedLinks={[
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Social Media Management", href: "/services/social-media" },
        { label: "TikTok Ads", href: "/services/tiktok-ads" },
        { label: "Content Marketing", href: "/services/content-marketing" },
      ]}
    />
  );
}
