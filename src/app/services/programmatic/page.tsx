import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/programmatic",
    languages: {
      "en-US": "https://datalatte.pro/services/programmatic",
      "en-GB": "https://datalatte.pro/services/programmatic",
      "en-AU": "https://datalatte.pro/services/programmatic",
      "en-CA": "https://datalatte.pro/services/programmatic",
      "x-default": "https://datalatte.pro/services/programmatic",
    },
  },
  title: "Programmatic Advertising for Small & Growing Businesses",
  description:
    "Programmatic advertising on DV360, The Trade Desk, and Amazon DSP — built for local and mid-market businesses. Reach the right audience at the right moment, at a fraction of the waste of traditional media.",
  openGraph: {
    title: "Programmatic Advertising for Small & Growing Businesses | DataLatte",
    description:
      "Access enterprise-grade programmatic advertising without the enterprise price tag. Display, video, CTV, and audio across the open web — targeted by location, behaviour, and intent.",
    url: "https://datalatte.pro/services/programmatic",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programmatic Advertising for Small & Growing Businesses | DataLatte",
    description: "DV360, The Trade Desk, and Amazon DSP — enterprise programmatic for businesses of every size.",
  },
};

export default function ProgrammaticPage() {
  return (
    <ServicePage
      service="Programmatic Advertising"
      tagline="Every impression, measured. Every dollar, justified."
      description="Programmatic advertising automates the buying of digital ad space in real time, placing your message in front of the right person at the right moment — across every screen, format, and platform. Until now it was the exclusive domain of enterprise budgets and specialist trading desks. Not anymore."
      icon="📡"
      accentClass="bg-gradient-to-br from-gray-800 to-gray-950"
      stats={[
        { value: "$700B+", label: "Global programmatic ad spend in 2025 — the dominant media buying method" },
        { value: "0.1s", label: "Time it takes for a programmatic auction to run when a page loads" },
        { value: "DV360", label: "Google's DSP — DataLatte's primary programmatic platform" },
      ]}
      whatItIs="Programmatic advertising replaces manual ad buying with automated, data-driven auctions. When someone loads a webpage, an auction takes place in milliseconds — bidding systems evaluate whether your ad should appear to that specific user based on their location, device, browsing behaviour, demographics, and dozens of other signals. The winning bid places the ad. All of this happens before the page finishes loading. This precision is what makes programmatic so powerful: instead of buying a slot on a website (and hoping your audience shows up), you're buying access to a specific audience profile, wherever they are on the web. The main programmatic platforms — DV360 (Google's demand-side platform), The Trade Desk, and Amazon DSP — provide access to billions of impressions daily across display, video, connected TV, audio, and native formats.

What separates programmatic from conventional display advertising is the depth of audience intelligence available. You can layer first-party customer data (your own email or CRM list) with third-party intent signals, demographic data, and behavioural patterns to reach people who look exactly like your best customers — before they've even heard of you. For multi-location businesses and brands with larger media budgets ($5,000+/month), programmatic unlocks audience segments and inventory that Google Ads and Meta simply don't offer access to.

The connected TV (CTV) opportunity deserves particular attention. Streaming advertising — placing your brand's video ads inside Netflix, Hulu, Disney+, YouTube TV, and other streaming platforms — is now accessible to mid-market businesses through programmatic buying. CTV combines the reach and brand-building power of traditional TV with the precision targeting and measurability of digital. For businesses building brand awareness alongside direct response campaigns, CTV programmatic is one of the highest-quality ad environments available today."
      howItWorks={[
        {
          step: "01",
          title: "Audience & goal definition",
          desc: "We start by defining who we're trying to reach and what we want them to do. First-party data, lookalike audiences, intent signals, and contextual targeting are layered to build your ideal audience segment.",
        },
        {
          step: "02",
          title: "Platform & inventory selection",
          desc: "I select the right DSP and inventory sources based on your budget and goals — DV360 for scale and brand safety, The Trade Desk for independent inventory and advanced data, Amazon DSP for commerce intent.",
        },
        {
          step: "03",
          title: "Creative strategy & trafficking",
          desc: "Programmatic works best with multiple creative formats and sizes. I define the creative requirements and traffic them correctly across environments — desktop, mobile, CTV, audio.",
        },
        {
          step: "04",
          title: "Brand safety & viewability setup",
          desc: "I configure Integral Ad Science (IAS) or DoubleVerify controls to ensure ads appear in brand-safe, viewable environments. Every impression is measured — not just served.",
        },
        {
          step: "05",
          title: "Optimise bid strategy & frequency",
          desc: "Weekly bid strategy reviews, frequency cap management to avoid overexposure, and audience exclusions to avoid wasting impressions on existing customers or irrelevant segments.",
        },
        {
          step: "06",
          title: "Attribution & reporting",
          desc: "Programmatic campaigns are measured against real business outcomes — not just impressions and clicks. I connect campaign delivery to conversions, store visits, or view-through attribution.",
        },
      ]}
      included={[
        "DSP selection and account setup (DV360, The Trade Desk, or Amazon DSP)",
        "Audience strategy: first-party, lookalike, contextual, and intent segments",
        "Inventory planning and private marketplace (PMP) deal curation",
        "Creative specifications and trafficking across all formats",
        "Brand safety and viewability controls (IAS / DoubleVerify)",
        "Frequency management and audience exclusions",
        "Bid strategy and pacing optimisation",
        "Connected TV (CTV) and streaming audio campaigns",
        "Retargeting and sequential messaging flows",
        "Cross-channel attribution and campaign reporting",
      ]}
      bestFor={[
        "Multi-location businesses building regional brand awareness",
        "Growing e-commerce brands scaling beyond Google and Meta",
        "Local businesses wanting to reach customers before they search",
        "Companies with seasonal demand needing precise timing",
        "Businesses that have exhausted search and social and need new reach",
        "Enterprises needing white-label programmatic expertise",
        "Anyone frustrated with wasted spend on broad untargeted media buys",
      ]}
      faqs={[
        {
          q: "What's the minimum budget for programmatic advertising?",
          a: "Programmatic can work from around $2,000–$3,000 per month in media spend, but the sweet spot for local and regional campaigns is $5,000–$15,000/month. Below $2k, the data volume is too thin for the algorithms to optimise effectively. I'll always be honest about whether programmatic makes financial sense for your budget.",
        },
        {
          q: "How is programmatic different from Google Display Network?",
          a: "Google Display Network (GDN) is a walled garden — it only accesses Google-owned and partner inventory. Programmatic DSPs like DV360 and The Trade Desk access the entire open web, including premium publishers, CTV platforms, streaming audio, and native placements that GDN doesn't reach. DSPs also give far more control over audience targeting, brand safety, and bid strategies.",
        },
        {
          q: "What is DV360 and who uses it?",
          a: "DV360 (Display & Video 360) is Google's enterprise demand-side platform, used by major brands and agencies worldwide. It accesses Google's full inventory stack plus premium publishers, YouTube, and CTV. It's the platform I used extensively at OMD and Dentsu for global campaigns — now accessible to businesses of any size through DataLatte.",
        },
        {
          q: "Can programmatic work for local businesses, not just national brands?",
          a: "Yes — location targeting has become highly precise. You can target by city, zip code, radius around a physical location, or even specific neighbourhoods. Geo-fencing allows you to target users who have recently visited competitor locations. For local businesses with tight geographic targeting requirements, programmatic can outperform broad national buys significantly.",
        },
        {
          q: "How long does it take to see results from programmatic?",
          a: "Expect 4–6 weeks for the campaign to exit the learning phase and start optimising efficiently. Brand awareness and upper-funnel metrics (reach, frequency, viewability) are visible within days. Direct response outcomes — conversions, store visits — typically become clear after 6–8 weeks of consistent spend.",
        },
      ]}
      relatedLinks={[
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "TikTok Ads", href: "/services/tiktok-ads" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
        { label: "Video Marketing", href: "/services/video-marketing" },
      ]}
    />
  );
}
