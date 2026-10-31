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
      {
        source: "/blog/ai-driven-marketing-automation",
        destination: "/blog/ai-for-marketing-automation",
        permanent: true,
      },
      {
        source: "/blog/using-ai-for-marketing-automation",
        destination: "/blog/ai-for-marketing-automation",
        permanent: true,
      },
      {
        source: "/blog/ai-for-local-marketing-automation",
        destination: "/blog/ai-for-marketing-automation",
        permanent: true,
      },
      {
        source: "/blog/how-much-do-tiktok-ads-cost-real-2026-pricing-benchmarks",
        destination: "/blog/tiktok-ads-cost-guide",
        permanent: true,
      },
      {
        source: "/blog/coffee-shop-marketing-with-klaviyo",
        destination: "/blog/using-klaviyo-for-coffee-shop-email-marketing",
        permanent: true,
      },
      {
        source: "/blog/ai-driven-local-seo-audit-tool",
        destination: "/blog/ai-driven-local-seo-audit",
        permanent: true,
      },
      {
        source: "/blog/responsive-search-ads-explained-what-they-are-and-how-to-use-them-in-2026",
        destination: "/blog/google-responsive-search-ads-best-practices-10-tips-to-improve-your-ad-strength",
        permanent: true,
      },
      {
        source: "/blog/google-business-profile-posts",
        destination: "/blog/how-to-automate-google-posts-local-business",
        permanent: true,
      },
      {
        source: "/blog/google-posts-for-local-seo-how-to-use-them",
        destination: "/blog/how-to-automate-google-posts-local-business",
        permanent: true,
      },
      {
        source: "/blog/marketing-for-pool-builders",
        destination: "/blog/google-ads-for-pool-builders",
        permanent: true,
      },
      {
        source: "/blog/pinterest-marketing-for-local-business",
        destination: "/blog/pinterest-marketing-for-local-businesses-worth-it",
        permanent: true,
      },
      {
        source: "/blog/zapier-for-local-business",
        destination: "/blog/zapier-for-small-business-10-automations-that-save-time",
        permanent: true,
      },
      {
        source: "/blog/whatsapp-marketing-for-local-business",
        destination: "/blog/whatsapp-business-marketing-local-business",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-email-marketing-tips",
        destination: "/blog/pet-groomer-email-marketing-with-mailchimp",
        permanent: true,
      },
      {
        source: "/blog/ai-powered-social-media-management",
        destination: "/blog/ai-powered-social-media-management-tools",
        permanent: true,
      },
      {
        source: "/blog/ai-driven-customer-service",
        destination: "/blog/ai-customer-service-for-small-business",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-yoga-studios",
        destination: "/blog/google-ads-for-yoga-studios-complete-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/bark-vs-thumbtack-for-small-business",
        destination: "/blog/bark-vs-thumbtack-local-business",
        permanent: true,
      },
      {
        source: "/blog/what-is-programmatic-advertising-small-business-guide",
        destination: "/blog/what-is-programmatic-advertising-plain-english-guide-for-business-owners",
        permanent: true,
      },
      {
        source: "/blog/coffee-shop-google-my-business-optimization",
        destination: "/blog/coffee-shop-google-business-profile-optimization",
        permanent: true,
      },
      {
        source: "/blog/marketing-strategy-for-coffee-shops",
        destination: "/blog/how-to-market-a-coffee-shop-the-complete-2026-strategy-guide",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-instagram-marketing",
        destination: "/blog/pet-groomer-instagram-marketing-strategy",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-dog-groomers",
        destination: "/blog/google-ads-for-dog-groomers-complete-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/local-seo-audit-tool-review",
        destination: "/blog/best-local-seo-audit-tools-small-business",
        permanent: true,
      },
      {
        source: "/blog/display-vs-programmatic-advertising-local-business",
        destination: "/blog/programmatic-vs-google-display-ads-whats-the-difference",
        permanent: true,
      },
      {
        source: "/blog/local-marketing-russia-small-business-2026",
        destination: "/blog/small-business-marketing-russia-2026",
        permanent: true,
      },
      {
        source: "/blog/sms-marketing-for-hair-salons-guide",
        destination: "/blog/sms-marketing-for-hair-salons",
        permanent: true,
      },
      {
        source: "/blog/thumbtack-vs-homeadvisor-local-business",
        destination: "/blog/angi-vs-thumbtack-for-local-business",
        permanent: true,
      },
      {
        source: "/blog/local-marketing-brazil-small-business-2026",
        destination: "/blog/local-marketing-brazil-small-business-whatsapp-meta",
        permanent: true,
      },
      {
        source: "/blog/local-marketing-spain-small-business-2026",
        destination: "/blog/small-business-marketing-spain-beginners-guide",
        permanent: true,
      },
      {
        source: "/blog/local-marketing-france-small-business-2026",
        destination: "/blog/local-seo-france-small-business",
        permanent: true,
      },
      {
        source: "/blog/semrush-vs-ahrefs-small-business",
        destination: "/blog/semrush-vs-ahrefs-local-seo-which-to-use",
        permanent: true,
      },
      {
        source: "/blog/retargeting-ads-for-small-business-complete-guide-2026",
        destination: "/blog/retargeting-ads-for-local-business",
        permanent: true,
      },
      {
        source: "/blog/retargeting-ads-local-business-complete-guide-2026",
        destination: "/blog/retargeting-ads-for-local-business",
        permanent: true,
      },
      {
        source: "/blog/local-marketing-china-small-business-2026",
        destination: "/blog/small-business-marketing-china-2026",
        permanent: true,
      },
      {
        source: "/blog/marketing-for-new-york-small-businesses",
        destination: "/blog/small-business-marketing-new-york",
        permanent: true,
      },
      {
        source: "/blog/7-best-marketing-automation-platforms-for-small-businesses-in-2026-compared",
        destination: "/blog/best-marketing-automation-tools-small-business",
        permanent: true,
      },
      {
        source: "/blog/sms-marketing-for-coffee-shops",
        destination: "/blog/sms-marketing-for-coffee-shops-how-to-start",
        permanent: true,
      },
      {
        source: "/blog/pandora-ads-local-business",
        destination: "/blog/digital-audio-advertising-2026-spotify-pandora-podcast-ads",
        permanent: true,
      },
      {
        source: "/blog/coffee-shop-meta-ads-targeting-strategies",
        destination: "/blog/meta-ads-for-coffee-shops-2026",
        permanent: true,
      },
      {
        source: "/blog/tiktok-spark-ads-local-business-guide",
        destination: "/blog/tiktok-spark-ads-guide",
        permanent: true,
      },
      {
        source: "/blog/facebook-ads-pet-groomers-guide",
        destination: "/blog/pet-groomer-meta-ads",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-marketing-facebook-ads",
        destination: "/blog/pet-groomer-meta-ads",
        permanent: true,
      },
      {
        source: "/blog/facebook-ads-for-pet-groomers-what-works-2026",
        destination: "/blog/pet-groomer-meta-ads",
        permanent: true,
      },
      {
        source: "/blog/hair-salon-meta-ads",
        destination: "/blog/using-meta-ads-for-hair-salon-marketing",
        permanent: true,
      },
      {
        source: "/blog/peacock-live-sports-advertising-local-business",
        destination: "/blog/peacock-ads-local-business",
        permanent: true,
      },
      {
        source: "/blog/spotify-ad-studio-minimum-budget-2026",
        destination: "/blog/how-much-do-spotify-ads-cost-pricing-for-local-business",
        permanent: true,
      },
      {
        source: "/blog/wolt-advertising-strategy-restaurants",
        destination: "/blog/wolt-ads-restaurant-guide-europe",
        permanent: true,
      },
      {
        source: "/blog/spotify-ads-for-local-business",
        destination: "/blog/spotify-ads-local-business-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/ott-ads-for-fitness-studios",
        destination: "/blog/ctv-ads-for-fitness-studios",
        permanent: true,
      },
      {
        source: "/blog/youtube-ads-for-local-business",
        destination: "/blog/how-to-run-youtube-ads-for-local-business-step-by-step",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-email-marketing-template",
        destination: "/blog/pet-groomer-email-marketing",
        permanent: true,
      },
      {
        source: "/blog/how-much-should-a-dog-groomer-spend-on-google-ads",
        destination: "/blog/google-ads-for-dog-groomers-complete-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/coffee-shop-marketing-with-google-my-business",
        destination: "/blog/google-business-profile-coffee-shop-tips",
        permanent: true,
      },
      {
        source: "/blog/how-to-get-coffee-shop-walk-ins-from-google-maps",
        destination: "/blog/coffee-shops-dominate-google-maps",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-nail-salons",
        destination: "/blog/google-ads-for-nail-salons-complete-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/local-marketing-new-zealand-small-business-2026",
        destination: "/blog/local-marketing-new-zealand-small-business-guide",
        permanent: true,
      },
      {
        source: "/blog/instagram-ads-for-coffee-shops",
        destination: "/blog/instagram-ads-for-coffee-shops-step-by-step-playbook",
        permanent: true,
      },
      {
        source: "/blog/sales-funnel-for-local-business",
        destination: "/blog/marketing-funnel-for-local-business",
        permanent: true,
      },
      {
        source: "/blog/tiktok-ads-for-coffee-shops-guide",
        destination: "/blog/tiktok-ads-for-coffee-shops-step-by-step-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-pet-groomers-in-pittsburgh-pa",
        destination: "/blog/google-ads-for-pet-groomers-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-pet-groomers-in-los-angeles-ca",
        destination: "/blog/google-ads-for-pet-groomers-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-pet-groomers-in-kansas-city-mo",
        destination: "/blog/google-ads-for-pet-groomers-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-hair-salons-in-miami-fl",
        destination: "/blog/google-ads-for-hair-salons-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-hair-salons-in-los-angeles-ca",
        destination: "/blog/google-ads-for-hair-salons-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/google-my-business-optimization-for-coffee-shops",
        destination: "/blog/coffee-shop-google-business-profile-optimization",
        permanent: true,
      },
      {
        source: "/blog/coffee-shop-marketing-loyalty-programs",
        destination: "/blog/coffee-shop-loyalty-program-ideas-without-an-app",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-marketing-automation",
        destination: "/blog/marketing-automation-for-pet-groomers",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-marketing-with-email-newsletters",
        destination: "/blog/pet-groomer-email-marketing",
        permanent: true,
      },
      {
        source: "/blog/how-to-get-more-orders-on-glovo-promotions-visibility",
        destination: "/blog/how-to-grow-on-glovo-marketing-tips",
        permanent: true,
      },
      {
        source: "/blog/google-business-profile-optimization-in-2026-the-complete-guide-25-point-checklist",
        destination: "/blog/google-business-profile-optimization-checklist",
        permanent: true,
      },
      {
        source: "/blog/programmatic-audio-advertising-local-business-guide",
        destination: "/blog/digital-audio-advertising-2026-spotify-pandora-podcast-ads",
        permanent: true,
      },
      {
        source: "/blog/performance-max-campaigns-guide",
        destination: "/blog/performance-max-vs-standard-google-ads-which-should-you-run",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-pet-groomers-in-tampa-fl",
        destination: "/blog/google-ads-for-pet-groomers-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-pet-groomers-in-mesa-az",
        destination: "/blog/google-ads-for-pet-groomers-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-pet-groomers-in-seattle-wa",
        destination: "/blog/google-ads-for-pet-groomers-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-hair-salons-in-tampa-fl",
        destination: "/blog/google-ads-for-hair-salons-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-hair-salons-in-raleigh-nc",
        destination: "/blog/google-ads-for-hair-salons-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/google-ads-for-coffee-shops-in-san-francisco-ca",
        destination: "/blog/google-ads-for-coffee-shops-complete-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/marketing-automation-for-local-pet-groomers-with-constant-contact",
        destination: "/blog/pet-groomer-marketing-with-constant-contact",
        permanent: true,
      },
      {
        source: "/blog/google-sgE-impact-local-business",
        destination: "/blog/google-ai-mode-local-seo-2026",
        permanent: true,
      },
      {
        source: "/blog/podcast-advertising-for-pet-groomers",
        destination: "/blog/podcast-advertising-for-local-business-guide",
        permanent: true,
      },
      {
        source: "/blog/youtube-ads-for-small-business-is-it-worth-it-2026",
        destination: "/blog/how-to-run-youtube-ads-for-local-business-step-by-step",
        permanent: true,
      },
      {
        source: "/blog/wolt-for-dark-kitchens-guide-europe",
        destination: "/blog/wolt-ads-restaurant-guide-europe",
        permanent: true,
      },
      {
        source: "/blog/website-conversion-local-business-europe",
        destination: "/blog/website-conversion-rate-optimization",
        permanent: true,
      },
      {
        source: "/blog/pet-groomer-instagram-marketing-tips",
        destination: "/blog/pet-groomers-guide-to-instagram-marketing",
        permanent: true,
      },
      {
        source: "/blog/personalized-facebook-ads-for-hair-salons",
        destination: "/blog/hair-salon-facebook-ads-strategy",
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
