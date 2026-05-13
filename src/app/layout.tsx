import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://datalatte.pro"),
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
  authors: [{ name: "DataLatte", url: "https://datalatte.pro" }],
  creator: "DataLatte",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://datalatte.pro",
    siteName: "DataLatte",
    title: "DataLatte — Data-Driven Local Marketing",
    description:
      "Brew up better business with data-driven marketing. Helping local businesses get more customers through the door.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DataLatte — Data-Driven Local Marketing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DataLatte — Data-Driven Local Marketing",
    description:
      "Brew up better business with data-driven marketing for local SMBs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
