import { Target, Search, Share2, Cpu, Mail, BarChart2, Coffee, Compass, type LucideProps } from "lucide-react";
import type { FC } from "react";

export type GroupName = "Paid Ads" | "SEO & Content" | "Social" | "AI & Automation" | "Email & SMS" | "Analytics" | "Niches" | "Strategy";

export const CATEGORY_TO_GROUP: Record<string, GroupName> = {
  "Google Ads": "Paid Ads",
  "Google Ads Advanced": "Paid Ads",
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
  "CTV Advertising": "Paid Ads",
  "Retargeting": "Paid Ads",
  "Review Platform Ads": "Paid Ads",
  "Amazon Advertising": "Paid Ads",
  "Mobile Advertising": "Paid Ads",

  "Local SEO": "SEO & Content",
  "Content Marketing": "SEO & Content",
  "Reputation Management": "SEO & Content",
  "Offline Marketing": "SEO & Content",
  "Google Business Profile Optimization": "SEO & Content",

  "Social Media": "Social",
  "Instagram Marketing": "Social",
  "Influencer Marketing": "Social",
  "Influencer & Creator Marketing": "Social",
  "Influencer Marketing for Salons": "Social",
  "Reddit & Community Marketing": "Social",
  "Nextdoor & Neighborhood Marketing": "Social",
  "Messaging & Community Marketing": "Social",
  "Telegram & Messaging Ads": "Social",
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
  "Dog Grooming Marketing": "Niches",
  "Fitness Studios": "Niches",
  "Fitness Studio Marketing": "Niches",
  "Medical Marketing": "Niches",
  "Canada Local Marketing": "Niches",
  "Chinese Market Marketing": "Niches",

  "Marketing Strategy": "Strategy",
  "Local Business Strategy": "Strategy",
  "Seasonal Marketing": "Strategy",
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
    gradient: "from-amber-600 to-orange-700",
    chipActive: "bg-orange-600 text-white",
    chipInactive: "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  },
  "SEO & Content": {
    Icon: Search,
    gradient: "from-coffee-500 to-coffee-700",
    chipActive: "bg-coffee-700 text-white",
    chipInactive: "bg-coffee-50 text-coffee-700 border border-coffee-200 hover:bg-coffee-100 dark:bg-coffee-900/20 dark:text-coffee-300 dark:border-coffee-800 dark:hover:bg-coffee-900/60",
  },
  "Social": {
    Icon: Share2,
    gradient: "from-rose-600 to-rose-700",
    chipActive: "bg-rose-600 text-white",
    chipInactive: "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  },
  "AI & Automation": {
    Icon: Cpu,
    gradient: "from-slate-500 to-slate-700",
    chipActive: "bg-slate-700 text-white",
    chipInactive: "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800",
  },
  "Email & SMS": {
    Icon: Mail,
    gradient: "from-orange-600 to-amber-700",
    chipActive: "bg-amber-600 text-white",
    chipInactive: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  },
  "Analytics": {
    Icon: BarChart2,
    gradient: "from-stone-500 to-stone-700",
    chipActive: "bg-stone-700 text-white",
    chipInactive: "bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 dark:bg-gray-800/60 dark:text-stone-300 dark:border-stone-800",
  },
  "Niches": {
    Icon: Coffee,
    gradient: "from-amber-600 to-coffee-800",
    chipActive: "bg-coffee-800 text-white",
    chipInactive: "bg-amber-50 text-coffee-700 border border-amber-200 hover:bg-amber-100 dark:text-coffee-300 dark:bg-amber-900/30 dark:border-amber-800",
  },
  "Strategy": {
    Icon: Compass,
    gradient: "from-gray-500 to-gray-700",
    chipActive: "bg-gray-700 text-white",
    chipInactive: "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800",
  },
};

export function getGroup(category: string): GroupName {
  return CATEGORY_TO_GROUP[category] ?? "Strategy";
}
