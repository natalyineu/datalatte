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
      // Duplicate guides merged into the stronger article
      {
        source: "/blog/google-ads-for-hair-salons-complete-2026-guide",
        destination: "/blog/google-ads-for-hair-salons-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/hair-salon-google-ads-complete-guide",
        destination: "/blog/google-ads-for-hair-salons-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/facebook-ads-for-coffee-shops",
        destination: "/blog/meta-ads-for-coffee-shops-2026",
        permanent: true,
      },
      {
        source: "/blog/facebook-ads-for-coffee-shops-complete-guide",
        destination: "/blog/meta-ads-for-coffee-shops-2026",
        permanent: true,
      },
      {
        source: "/blog/tiktok-marketing-for-coffee-shops",
        destination: "/blog/coffee-shop-tiktok-marketing-guide",
        permanent: true,
      },
      {
        source: "/blog/ai-powered-chatbots-for-local-businesses",
        destination: "/blog/ai-chatbot-for-local-business-booking-and-faqs",
        permanent: true,
      },
      {
        source: "/blog/ai-driven-chatbots-for-local-businesses",
        destination: "/blog/ai-chatbot-for-local-business-booking-and-faqs",
        permanent: true,
      },
      {
        source: "/blog/instagram-story-ads-for-fitness-studios",
        destination: "/blog/instagram-stories-ads-fitness-studios",
        permanent: true,
      },
      {
        source: "/blog/fitness-studio-instagram-story-ads",
        destination: "/blog/instagram-stories-ads-fitness-studios",
        permanent: true,
      },
      {
        source: "/blog/fitness-studio-marketing-instagram-stories",
        destination: "/blog/instagram-stories-ads-fitness-studios",
        permanent: true,
      },
      {
        source: "/blog/tiktok-ads-for-pet-groomers",
        destination: "/blog/tiktok-ads-for-local-pet-groomers",
        permanent: true,
      },
      {
        source: "/blog/tiktok-ads-for-pet-groomers-cute-content-that-converts",
        destination: "/blog/tiktok-ads-for-local-pet-groomers",
        permanent: true,
      },
      {
        source: "/blog/tiktok-marketing-for-pet-groomers",
        destination: "/blog/tiktok-ads-for-local-pet-groomers",
        permanent: true,
      },
      {
        source: "/blog/ai-powered-chabot-for-local-coffee-shops",
        destination: "/blog/ai-driven-customer-service-for-local-coffee-shops",
        permanent: true,
      },
      {
        source: "/blog/google-business-profile-ai-potential",
        destination: "/blog/google-business-profile-ai-powered-optimization",
        permanent: true,
      },
      {
        source: "/blog/google-business-profile-ai-integration",
        destination: "/blog/google-business-profile-ai-powered-optimization",
        permanent: true,
      },
      {
        source: "/blog/hair-salon-tiktok-marketing",
        destination: "/blog/tiktok-marketing-for-hair-salons",
        permanent: true,
      },
      {
        source: "/blog/tiktok-ads-for-local-hair-salons",
        destination: "/blog/tiktok-ads-for-hair-salons",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-marketing-with-instagram-reels",
        destination: "/blog/pet-groomer-marketing-with-instagram-reels-and-ai",
        permanent: true,
      },
      {
        source: "/blog/using-meta-ads-for-local-businesses",
        destination: "/blog/local-business-meta-ads",
        permanent: true,
      },
      {
        source: "/blog/coffee-shop-instagram-marketing",
        destination: "/blog/coffee-shop-instagram-marketing-strategy",
        permanent: true,
      },
      {
        source: "/blog/instagram-marketing-for-coffee-shops",
        destination: "/blog/coffee-shop-instagram-marketing-strategy",
        permanent: true,
      },
      {
        source: "/blog/wix-vs-squarespace-vs-wordpress-local-business-website",
        destination: "/blog/wix-vs-squarespace-small-business",
        permanent: true,
      },
      {
        source: "/blog/fitness-studio-tiktok-marketing",
        destination: "/blog/using-tiktok-for-fitness-studio-marketing",
        permanent: true,
      },
      {
        source: "/blog/tiktok-marketing-for-fitness-studios",
        destination: "/blog/using-tiktok-for-fitness-studio-marketing",
        permanent: true,
      },
      {
        source: "/blog/salon-rebooking-strategy-that-gets-clients-back",
        destination: "/blog/salon-rebooking-script-that-gets-clients-back",
        permanent: true,
      },
      {
        source: "/blog/website-cro-optimization-for-coffee-shops",
        destination: "/blog/coffee-shop-cro-techniques",
        permanent: true,
      },
      {
        source: "/blog/how-much-do-spotify-ads-cost-pricing-for-local-businesses",
        destination: "/blog/how-much-do-spotify-ads-cost-pricing-for-local-business",
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
