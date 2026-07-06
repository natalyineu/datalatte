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
