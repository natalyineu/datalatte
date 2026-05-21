import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWidgets from "@/components/ClientWidgets";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import { Analytics } from "@vercel/analytics/next";

const BASE = "https://datalatte.pro";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6B4226",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "DataLatte — Data-Driven Local Marketing for Small Businesses",
    template: "%s | DataLatte",
  },
  description:
    "Freelance marketing & analytics for coffee shops, hair salons, pet groomers, and fitness studios. Google Ads, Meta Ads, local SEO & Google Business Profile — results you can actually measure.",
  keywords: [
    "local marketing agency",
    "small business marketing",
    "google ads for local business",
    "local seo",
    "hair salon marketing",
    "coffee shop marketing",
    "pet groomer marketing",
    "fitness studio marketing",
  ],
  authors: [{ name: "Nataliia Makota", url: `${BASE}/about` }],
  creator: "Nataliia Makota",
  // ── Canonical + hreflang ──────────────────────────────────────────────────
  alternates: {
    canonical: BASE,
    languages: {
      "en-US": BASE,
      "en-GB": BASE,
      "en-AU": BASE,
      "en-CA": BASE,
      "x-default": BASE,
    },
  },
  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_AU", "en_CA"],
    url: BASE,
    siteName: "DataLatte",
    title: "DataLatte — Data-Driven Local Marketing for Small Businesses",
    description:
      "Brew up better business with data-driven marketing. Helping local businesses get more customers through the door.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DataLatte — Data-Driven Local Marketing",
      },
    ],
  },
  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "DataLatte — Data-Driven Local Marketing",
    description:
      "Brew up better business with data-driven marketing for local SMBs.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    yandex: "f5be53e8a0a36e39",
    // Bing Webmaster Tools (meta tag + file at /0db0ab755c9749b2ba9521accb56b1dd.txt)
    other: { "msvalidate.01": "0db0ab755c9749b2ba9521accb56b1dd" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* LocalBusiness structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
        {/* WebSite structured data — enables Google Sitelinks Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <ClientWidgets />
        <Analytics />
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M4L8HJGRCH"
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-M4L8HJGRCH');`}
        </Script>
      </body>
    </html>
  );
}
