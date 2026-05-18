import { Target, Search, Share2, Cpu, Mail, BarChart2, Coffee, Compass, type LucideProps } from "lucide-react";
import type { FC } from "react";

export type GroupName = "Paid Ads" | "SEO & Content" | "Social" | "AI & Automation" | "Email & SMS" | "Analytics" | "Niches" | "Strategy";

export const CATEGORY_TO_GROUP: Record<string, GroupName> = {
  "Google Ads": "Paid Ads",
  "Meta Ads": "Paid Ads",
  "Facebook Ads": "Paid Ads",
  "Instagram Ads": "Paid Ads",
  "TikTok Ads": "Paid Ads",
  "TikTok Marketing": "Paid Ads",
  "YouTube Ads": "Paid Ads",
  "Audio Advertising": "Paid Ads",
  "Snapchat Advertising": "Paid Ads",
  "Microsoft Ads": "Paid Ads",
  "Yahoo Advertising": "Paid Ads",
  "Programmatic Advertising": "Paid Ads",
  "CTV & OTT": "Paid Ads",
  "Retargeting": "Paid Ads",
  "Review Platform Ads": "Paid Ads",

  "Local SEO": "SEO & Content",
  "Content Marketing": "SEO & Content",
  "Reputation Management": "SEO & Content",
  "Offline Marketing": "SEO & Content",

  "Social Media": "Social",
  "Instagram Marketing": "Social",
  "Influencer Marketing": "Social",
  "Influencer & Creator Marketing": "Social",
  "Reddit & Community Marketing": "Social",
  "Nextdoor & Neighborhood Marketing": "Social",
  "Messaging & Community Marketing": "Social",
  "Pinterest Marketing": "Social",

  "AI & Automation": "AI & Automation",
  "Marketing Automation": "AI & Automation",

  "Email & SMS Marketing": "Email & SMS",
  "Email Marketing": "Email & SMS",

  "Analytics & Tracking": "Analytics",
  "Tool Comparisons": "Analytics",
  "Case Studies": "Analytics",
  "Website & CRO": "Analytics",

  "Coffee Shops": "Niches",
  "Coffee Shop Marketing": "Niches",
  "Hair Salons": "Niches",
  "Hair Salon Marketing": "Niches",
  "Pet Groomers": "Niches",
  "Pet Groomer Marketing": "Niches",
  "Fitness Studios": "Niches",
  "Fitness Studio Marketing": "Niches",

  "Marketing Strategy": "Strategy",
};

export interface GroupConfig {
  Icon: FC<LucideProps>;
  gradient: string;
  chipActive: string;
  chipInactive: string;
}

export const GROUP_CONFIG: Record<GroupName, GroupConfig> = {
  "Paid Ads": {
    Icon: Target,
    gradient: "from-amber-400 to-orange-500",
    chipActive: "bg-orange-600 text-white",
    chipInactive: "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100",
  },
  "SEO & Content": {
    Icon: Search,
    gradient: "from-coffee-500 to-coffee-700",
    chipActive: "bg-coffee-700 text-white",
    chipInactive: "bg-coffee-50 text-coffee-700 border border-coffee-200 hover:bg-coffee-100",
  },
  "Social": {
    Icon: Share2,
    gradient: "from-rose-400 to-rose-600",
    chipActive: "bg-rose-600 text-white",
    chipInactive: "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
  },
  "AI & Automation": {
    Icon: Cpu,
    gradient: "from-slate-500 to-slate-700",
    chipActive: "bg-slate-700 text-white",
    chipInactive: "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100",
  },
  "Email & SMS": {
    Icon: Mail,
    gradient: "from-orange-300 to-amber-500",
    chipActive: "bg-amber-600 text-white",
    chipInactive: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
  },
  "Analytics": {
    Icon: BarChart2,
    gradient: "from-stone-500 to-stone-700",
    chipActive: "bg-stone-700 text-white",
    chipInactive: "bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100",
  },
  "Niches": {
    Icon: Coffee,
    gradient: "from-amber-600 to-coffee-800",
    chipActive: "bg-coffee-800 text-white",
    chipInactive: "bg-amber-50 text-coffee-700 border border-amber-200 hover:bg-amber-100",
  },
  "Strategy": {
    Icon: Compass,
    gradient: "from-gray-500 to-gray-700",
    chipActive: "bg-gray-700 text-white",
    chipInactive: "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100",
  },
};

export function getGroup(category: string): GroupName {
  return CATEGORY_TO_GROUP[category] ?? "Strategy";
}
