import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: { canonical: "https://datalatte.pro/for/dentists" },
  title: "Dental Practice Marketing | Google Ads & Local SEO for Dentists",
  description:
    "Data-driven marketing for dental practices. Attract new patients, fill your appointment book, and rank #1 for 'dentist near me' with proven local strategies.",
  openGraph: {
    title: "Dental Marketing That Fills Your Appointment Book | DataLatte",
    description:
      "New patient acquisition, local SEO, and Google Ads built specifically for dental practices. Stop relying on referrals alone.",
  },
};

export default function DentistsPage() {
  return (
    <NichePage
      niche="Dentists"
      headline="Fill Your Appointment Book With New Patients Who Stay"
      subheadline="Dental practices live on patient lifetime value. Let's build the digital presence that attracts the right patients — and keeps them coming back."
      heroImage="https://images.unsplash.com/photo-1588776814546-1ffedcdb4567?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-800 to-coffee-950"
      problems={[
        "You're not ranking for 'dentist near me' even though you've been in the area for years.",
        "Your Google Business Profile has fewer than 20 reviews — and competitors have hundreds.",
        "New patient flow is inconsistent, leaving gaps in the schedule every week.",
        "Your website is outdated and doesn't convert visitors into booked appointments.",
        "You're paying Zocdoc or Healthgrades referral fees when you could own that traffic.",
      ]}
      kpis={[
        {
          metric: "New Patients / Month",
          improvement: "+15–40",
          desc: "Targeted Google Ads and local SEO can consistently add new patients without referral platform fees.",
        },
        {
          metric: "Cost Per New Patient",
          improvement: "$40–$120",
          desc: "With high patient lifetime value, even modest ad spend produces strong ROI within the first year.",
        },
        {
          metric: "Appointment Fill Rate",
          improvement: "+25–45%",
          desc: "SMS reminders, retargeting campaigns, and an optimised booking flow reduce cancellations and no-shows.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile",
          icon: "📍",
          desc: "Fully optimised profile with services, photos, booking link, and a review generation system. The map pack drives 40–60% of local dental searches.",
        },
        {
          title: "Google Ads (Search)",
          icon: "🎯",
          desc: "High-intent campaigns targeting 'emergency dentist', 'teeth whitening near me', 'dentist accepting new patients'. Highest-converting channel for dental practices.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank organically for your location + service combinations. Consistent citations, on-page optimisation, and local link building.",
        },
        {
          title: "Website & Landing Pages",
          icon: "💻",
          desc: "A fast, trust-building website with clear service pages, online booking, and conversion-optimised design — tailored for new patient acquisition.",
        },
        {
          title: "Reputation Management",
          icon: "⭐",
          desc: "Systematic review generation after appointments, professional responses, and monitoring across Google, Yelp, and Healthgrades.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Track calls, form submissions, and booked appointments by channel. Know your cost per new patient with precision.",
        },
      ]}
      tactics={[
        {
          title: "Capture emergency search traffic",
          detail:
            "'Emergency dentist near me' and 'tooth pain [city]' are high-urgency, high-converting keywords. Being in the top 3 results for these queries can fill same-day slots consistently.",
        },
        {
          title: "Optimise for high-value services",
          detail:
            "Implants, Invisalign, and cosmetic work have the highest patient LTV. Dedicated landing pages and targeted ads for these services attract patients worth 5–10× a routine cleaning.",
        },
        {
          title: "Build a review system that runs itself',",
          detail:
            "An automated post-appointment review request (text or email, 2 hours after the visit) with a direct Google link can generate 3–5× more reviews than asking manually. Reviews directly impact map pack ranking.",
        },
        {
          title: "Retarget website visitors",
          detail:
            "Most visitors don't book on the first visit. A Meta retargeting campaign keeping your practice top-of-mind for 30 days after their visit converts fence-sitters into booked patients.",
        },
      ]}
      testimonial={{
        quote:
          "I was sceptical about paid ads for a dental practice — it felt too sales-y. DataLatte focused on the right keywords and the right tone. Within 90 days we were consistently getting 20+ new patient enquiries a month from Google. The ROI is undeniable.",
        author: "Dr. Sarah K.",
        role: "Principal Dentist, Parkside Dental",
        rating: 5,
      }}
      faq={[
        {
          q: "Is Google Ads really worth it for a dental practice?",
          a: "Yes — dental patients have one of the highest lifetime values of any local business. A single new patient relationship is worth $1,500–$8,000+ over years. Even at $100 cost per acquisition, the ROI is strong within the first year.",
        },
        {
          q: "How do you handle sensitive healthcare content in ads?",
          a: "Google has specific policies for healthcare advertisers. I'm experienced with compliant ad copy and landing pages that build trust without making prohibited claims.",
        },
        {
          q: "Can you help us switch from Zocdoc to direct booking?",
          a: "Absolutely. Building owned channels (Google Ads + SEO + direct booking widget) is one of the best long-term moves for reducing dependency on referral platforms.",
        },
        {
          q: "How long until we see new patients from the campaigns?",
          a: "Google Ads can generate enquiries within the first week. Local SEO improvements show traction in 6–12 weeks. GBP optimisation often produces results in under a month.",
        },
      ]}
      ctaHeadline="Ready to fill your schedule with high-value new patients?"
    />
  );
}
