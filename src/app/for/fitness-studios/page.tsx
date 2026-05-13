import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  title: "Fitness Studio & Gym Marketing | More Trial Sign-Ups & Memberships",
  description:
    "Marketing for fitness studios, yoga studios, gyms, and personal trainers. Drive trial class bookings, grow memberships, and reduce churn with data-driven campaigns.",
  openGraph: {
    title: "Fitness Studio & Gym Marketing | DataLatte",
    description:
      "Grow your studio's membership with targeted local ads, Google SEO, and analytics that show what's actually working.",
  },
};

export default function FitnessStudiosPage() {
  return (
    <NichePage
      niche="Fitness & Yoga Studios"
      headline="Turn Trial Classes Into Long-Term Members"
      subheadline="The fitness industry is competitive and seasonal. I build marketing systems that bring in new leads consistently — not just in January."
      heroImage="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80"
      accentColor="bg-gradient-to-br from-gray-800 to-gray-900"
      problems={[
        "January is packed and July is empty — your membership numbers swing wildly with seasons.",
        "You're spending on ads but can't connect spend to actual sign-ups or memberships.",
        "New members come in but many churn within 3 months — acquisition cost is high.",
        "Your Google Maps listing gets impressions but few clicks or calls compared to competitors.",
        "You don't know if your best leads come from Instagram, Google, or referrals — so you can't invest smartly.",
      ]}
      kpis={[
        {
          metric: "Trial Class Sign-Ups",
          improvement: "+50–100%",
          desc: "Well-targeted lead-gen campaigns can double your trial bookings month over month.",
        },
        {
          metric: "Cost Per Lead",
          improvement: "$4–$10",
          desc: "Fitness is one of the best niches for Meta lead ads — strong intent, clear offer, measurable result.",
        },
        {
          metric: "Membership Conversion Rate",
          improvement: "+20–35%",
          desc: "With proper follow-up sequences and retargeting, more trials convert to paying members.",
        },
      ]}
      services={[
        {
          title: "Meta Lead Generation Ads",
          icon: "📱",
          desc: "Facebook and Instagram lead forms work brilliantly for fitness studios. Offer a free trial class and capture leads without needing them to visit your website.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Target searches like \"yoga studio near me\", \"HIIT classes [city]\", \"personal trainer [neighborhood]\". High intent, highly local.",
        },
        {
          title: "Google Business Profile",
          icon: "📍",
          desc: "Studio photos, class schedule, reviews, and booking links. Win the local map pack for fitness-related searches in your area.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank organically for your modalities — yoga, pilates, CrossFit, barre — plus your city or neighborhood. Long-term compounding results.",
        },
        {
          title: "Retargeting Campaigns",
          icon: "🔁",
          desc: "Re-engage people who visited your site, watched your videos, or engaged with your social but didn't book. These convert at very low cost.",
        },
        {
          title: "Analytics & Attribution",
          icon: "📊",
          desc: "Connect your ad spend to actual memberships. I'll set up tracking to see which campaigns drive trials that actually convert — not just clicks.",
        },
      ]}
      tactics={[
        {
          title: "Lead ads with irresistible offers",
          detail:
            "\"First class free\", \"2-week unlimited trial for $19\", \"free intro session\" — these offers in Meta Lead Ads with precise local targeting routinely generate $5–$8 trial sign-ups.",
        },
        {
          title: "Counter seasonality with campaign timing",
          detail:
            "Instead of waiting for January, run aggressive campaigns in late November (New Year preparation), August (back-to-routine after summer), and September (fall resets). Seasonality is predictable — plan for it.",
        },
        {
          title: "Video content for class previews",
          detail:
            "Short 15-30 second class clips on Instagram Reels and as video ads perform well for fitness. People want to see the energy and atmosphere before they commit to trying.",
        },
        {
          title: "Retarget based on class interest",
          detail:
            "People who click on your yoga ads see yoga-specific retargeting. People who looked at spin class see spin. Relevance matters a lot — generic retargeting underperforms.",
        },
      ]}
      testimonial={{
        quote:
          "We used to get 15–20 new trial bookings a month from word of mouth. After DataLatte set up our Meta lead ads, we're getting 60–80 per month. The cost per trial is $7. That's incredible for our industry.",
        author: "Rachel T.",
        role: "Studio Director, Rise Yoga & Movement",
        rating: 5,
      }}
      faq={[
        {
          q: "Do you work with independent studios or big chains?",
          a: "I focus on independent studios and small multi-location chains where the owner is involved. Big national chains have different needs and in-house teams — not my sweet spot.",
        },
        {
          q: "We use Mindbody/Pike13 for bookings. Can you track conversions from those?",
          a: "Yes. I can set up conversion events for most booking platforms so we can attribute bookings back to specific campaigns.",
        },
        {
          q: "Should I focus on Google or Meta first?",
          a: "For most studios, Meta (especially lead ads) gives faster results. Google Ads are great once you have a clear offer and landing page. During the audit I'll give you a specific recommendation.",
        },
        {
          q: "Can you help with retention marketing too?",
          a: "I focus primarily on acquisition, but I can advise on email/SMS flows for retention and help you set up the basics if you don't have them.",
        },
      ]}
      ctaHeadline="Ready to fill your classes and grow your membership base?"
    />
  );
}
