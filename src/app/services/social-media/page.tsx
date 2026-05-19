import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/social-media",
    languages: {
      "en-US": "https://datalatte.pro/services/social-media",
      "en-GB": "https://datalatte.pro/services/social-media",
      "en-AU": "https://datalatte.pro/services/social-media",
      "en-CA": "https://datalatte.pro/services/social-media",
      "x-default": "https://datalatte.pro/services/social-media",
    },
  },
  title: "Social Media Management for Local Businesses",
  description:
    "Organic social media management for coffee shops, salons, pet groomers, and fitness studios. Consistent content, real engagement, and a feed that turns followers into customers.",
};

export default function SocialMediaPage() {
  return (
    <ServicePage
      service="Social Media Management"
      tagline="Show up consistently. Build trust. Turn followers into regulars."
      description="Posting once a week and hoping for the best isn't a social media strategy. I build content systems for local businesses that keep your feed active, your audience engaged, and your brand front of mind — so when someone's ready to book, you're the first name they think of."
      icon="📱"
      accentClass="bg-gradient-to-br from-gray-800 to-coffee-900"
      whatItIs="Organic social media management means running your Instagram, Facebook, TikTok, or other channels with a consistent strategy — not just filling a feed. For local businesses, social media serves a specific purpose: it's where people check if you're still open, get a feel for your vibe before visiting, and decide whether to trust you enough to book. A well-run account builds credibility, drives word-of-mouth, and gives your paid ads warm audiences to retarget. Done badly — inconsistent posting, generic content, stock photos — it actively undermines your brand. The key difference between social media management and Meta Ads: ads reach new people who don't know you yet. Organic social nurtures the people who already do."
      howItWorks={[
        {
          step: "01",
          title: "Profile & strategy audit",
          desc: "I audit your existing profiles — bio, highlights, grid, posting history — against your competitors. I define your content pillars: the 3–5 themes that every post should fit into based on your brand and audience.",
        },
        {
          step: "02",
          title: "Content calendar",
          desc: "Build a monthly content calendar with post formats, captions, and hashtag strategy. You approve before anything goes live. I plan around your seasonality, promotions, and key dates.",
        },
        {
          step: "03",
          title: "Content creation",
          desc: "I write all captions and plan all visuals. For photos and videos, I'll either work with assets you provide, brief a photographer, or create graphics. I adapt to what you have — you don't need a professional shoot to start.",
        },
        {
          step: "04",
          title: "Scheduling & publishing",
          desc: "All content is scheduled and published using a social media management tool. Optimal timing per platform and audience. No manual posting required from you.",
        },
        {
          step: "05",
          title: "Community management",
          desc: "Respond to comments and DMs in your brand voice. Monitor tags and mentions. Engage with local accounts to build real community presence — not just broadcast.",
        },
        {
          step: "06",
          title: "Monthly reporting",
          desc: "Follower growth, reach, engagement rate, top posts, and what's working. Plain-language insights, not just vanity metrics.",
        },
      ]}
      included={[
        "Profile audit and optimisation (bio, highlights, link-in-bio)",
        "Content pillar strategy",
        "Monthly content calendar (15–20 posts/month)",
        "Caption copywriting for every post",
        "Hashtag research and strategy",
        "Visual direction and graphic creation",
        "Scheduling and publishing across platforms",
        "Comment and DM management",
        "Stories content (polls, Q&As, countdowns)",
        "Monthly performance report",
      ]}
      notIncluded={[
        "Professional photography or videography (I brief and advise; you supply or hire)",
        "Paid advertising — that's Meta Ads (separate service)",
        "Influencer outreach or partnership management",
        "YouTube or podcast production",
      ]}
      bestFor={[
        "Coffee shops and cafés where atmosphere and seasonal menus drive foot traffic",
        "Hair salons and beauty studios where before/after visuals build instant trust",
        "Pet groomers with adorable transformations worth showing off",
        "Fitness studios where energy, community, and results convert followers",
        "Businesses that have neglected their social presence for 6+ months",
        "Owners who know they should be posting but never have the time",
      ]}
      faqs={[
        {
          q: "Do I need to be involved or can you run it fully?",
          a: "I can run it almost fully — you review and approve the monthly calendar, and supply (or point me to) photos and videos. For the most authentic content, I'll ask for a batch of raw photos/clips each month. The more you give me to work with, the better.",
        },
        {
          q: "Which platforms do you manage?",
          a: "Instagram and Facebook are the priority for most local businesses. TikTok is worth adding for visual niches (salons, groomers, fitness). I'll recommend based on where your customers actually spend time — not just what's trendy.",
        },
        {
          q: "How is this different from Meta Ads?",
          a: "Organic social builds your existing audience and warm community. Meta Ads reach cold audiences who've never heard of you with paid placements. They work best together — organic gives ads audiences to retarget, ads bring in new followers to nurture organically.",
        },
        {
          q: "Can you help grow our following?",
          a: "Follower growth is a side effect of good content and consistent posting, not the goal I optimise for. I focus on reach, engagement, and content that turns profile visitors into customers — that's more valuable than chasing follower counts.",
        },
        {
          q: "What if I already have someone doing social but it's not working?",
          a: "That's the most common scenario. I'll audit what's there, identify why it isn't converting, and either rebuild the strategy or give you a clear brief to hand to whoever's managing it.",
        },
      ]}
      relatedLinks={[
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Email & SMS Marketing", href: "/services/email-sms" },
        { label: "Google Business Profile", href: "/services/google-business-profile" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
      ]}
    />
  );
}
