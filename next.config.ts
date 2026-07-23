import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.datalatte.pro" }],
        destination: "https://datalatte.pro/:path*",
        permanent: true,
      },
      // Slug alias Google indexed under a shorter URL
      {
        source: "/blog/is-google-ads-worth-it-small-business",
        destination: "/blog/is-google-ads-worth-it-for-small-businesses-honest-answer-with-real-data",
        permanent: true,
      },
      // Renamed posts — old slugs redirect to new canonical URLs
      {
        source: "/blog/how-to-ask-grooming-clients-for-google-reviews",
        destination: "/blog/how-to-ask-pet-grooming-clients-for-google-reviews",
        permanent: true,
      },
      {
        source: "/blog/instagram-ads-for-salons-get-more-bookings",
        destination: "/blog/instagram-story-ads-for-salons-bookings",
        permanent: true,
      },
      {
        source: "/blog/marketing-automation-for-coffee-shops-save-5-hours-a-week",
        destination: "/blog/marketing-automation-for-coffee-shops-save-5-hours-every-week",
        permanent: true,
      },
      {
        source: "/blog/salon-rebooking-script-that-gets-clients-back",
        destination: "/blog/salon-rebooking-strategy-that-gets-clients-back",
        permanent: true,
      },
      // Truncated slug names → full names
      {
        source: "/blog/google-business-profile-optimization-in-2026-the-complete-guide-25-point-checki",
        destination: "/blog/google-business-profile-optimization-in-2026-the-complete-guide-25-point-checklist",
        permanent: true,
      },
      {
        source: "/blog/how-to-set-up-google-ads-for-your-small-business-in-2026-step-by-step-with-scree",
        destination: "/blog/how-to-set-up-google-ads-for-your-small-business-in-2026-step-by-step-with-screenshots",
        permanent: true,
      },
      {
        source: "/blog/what-is-local-seo-and-why-does-it-matter-plain-english-guide-for-small-business",
        destination: "/blog/what-is-local-seo-and-why-does-it-matter-plain-english-guide-for-small-businesses",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://www.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src * data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://www.clarity.ms",
              "frame-src https://www.google.com https://maps.google.com https://www.youtube.com https://calendly.com",
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
// Sun May 17 12:06:40 UTC 2026
