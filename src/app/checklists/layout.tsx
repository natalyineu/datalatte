import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Marketing Checklists for Local Businesses",
  description:
    "10 free, actionable marketing checklists for local businesses. Google Business Profile, Local SEO, Google Ads, Meta Ads, email marketing, and more — step by step.",
  alternates: {
    canonical: "https://datalatte.pro/checklists",
    languages: {
      "en-US": "https://datalatte.pro/checklists",
      "en-GB": "https://datalatte.pro/checklists",
      "en-AU": "https://datalatte.pro/checklists",
      "en-CA": "https://datalatte.pro/checklists",
      "x-default": "https://datalatte.pro/checklists",
    },
  },
  openGraph: {
    title: "Free Marketing Checklists for Local Businesses | DataLatte",
    description:
      "10 free, actionable marketing checklists covering GBP, SEO, Google Ads, Meta Ads, email marketing, and niche strategies for coffee shops, salons, and more.",
    url: "https://datalatte.pro/checklists",
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function ChecklistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
