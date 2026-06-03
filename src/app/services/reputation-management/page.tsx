import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/reputation-management",
    languages: {
      "en-US": "https://datalatte.pro/services/reputation-management",
      "en-GB": "https://datalatte.pro/services/reputation-management",
      "en-AU": "https://datalatte.pro/services/reputation-management",
      "en-CA": "https://datalatte.pro/services/reputation-management",
      "x-default": "https://datalatte.pro/services/reputation-management",
    },
  },
  title: "Reputation Management for Local Businesses | DataLatte",
  description:
    "Build 5-star reviews, respond to feedback, and protect your online reputation. Reputation management for local businesses across Google, Yelp, and Facebook.",
  openGraph: {
    title: "Reputation Management for Local Businesses | DataLatte",
    description: "Build 5-star reviews, respond to feedback, and protect your online reputation. Reputation management for local businesses across Google, Yelp, and Facebook.",
    url: "https://datalatte.pro/services/reputation-management",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reputation Management for Local Businesses | DataLatte",
    description: "Build 5-star reviews, respond to feedback, and protect your online reputation.",
  },
};

export default function ReputationManagementPage() {
  return (
    <ServicePage
      service="Reputation Management"
      tagline="More 5-star reviews. Fewer unanswered complaints. A brand customers trust."
      description="88% of consumers trust online reviews as much as personal recommendations. Your star rating directly affects how many people call, book, or walk through the door. Reputation management makes sure the story told about your business online is the right one."
      icon="⭐"
      accentClass="bg-gradient-to-br from-amber-700 to-amber-950"
      stats={[
        { value: "88%", label: "Consumers trust online reviews as much as personal recommendations" },
        { value: "3.3×", label: "More clicks for businesses with 4+ star ratings vs lower-rated competitors" },
        { value: "60 days", label: "Typical time to reach 4.5+ stars with a review generation system" },
      ]}
      whatItIs="Online reputation management (ORM) is the process of monitoring, generating, and responding to customer reviews and mentions across platforms like Google, Yelp, Facebook, TripAdvisor, and industry-specific sites. For local businesses, your Google Business Profile star rating is often the first thing a potential customer sees — before your website, before your ad, before your social media. A 4.2 average with 30 reviews loses to a 4.8 average with 200 reviews every time. ORM isn't about hiding negative feedback — it's about generating so many authentic positive reviews that one bad experience doesn't define you, and responding professionally so even a 1-star becomes a trust signal.\n\nIn the marketing funnel, reputation management operates at the decision stage — the final gate before someone books or walks past. Google's own data shows that businesses with a 4.5+ rating receive significantly more clicks in local search than businesses rated below 4.0, even at the same map-pack position. Your star rating isn't just a trust signal — it actively affects how many people even reach your website. For local search specifically, review velocity (how frequently new reviews appear) and recency are ranking factors in the map pack algorithm. A business with 50 reviews earned two years ago ranks below a competitor with 30 reviews arriving steadily each month.\n\nThe most common mistake local businesses make with reviews is asking in bulk. Sending a review request to your entire customer list at once triggers a sudden spike that Google's algorithm flags as suspicious — and those reviews often get removed. The safe, effective approach is a steady drip: ask each customer at the right moment (immediately after a great experience), via the right channel (SMS outperforms email 3:1 for review response rate), with a direct link to your Google review page. One or two genuine reviews per week, week after week, compounds into a 4.8-star profile with 200+ reviews within a year — far more powerful than any one-time campaign."
      howItWorks={[
        {
          step: "01",
          title: "Reputation audit",
          desc: "I audit your current reviews across all platforms, identify patterns in negative feedback, and benchmark your rating against local competitors.",
        },
        {
          step: "02",
          title: "Review generation system",
          desc: "I set up an automated (but genuine) post-visit or post-purchase review request flow via email or SMS that consistently generates new Google reviews from happy customers.",
        },
        {
          step: "03",
          title: "Response management",
          desc: "I draft and publish responses to new reviews — thanking positive reviewers and professionally addressing negative ones. Every review gets a response within 48 hours.",
        },
        {
          step: "04",
          title: "Monitoring & alerts",
          desc: "I set up monitoring across Google, Yelp, Facebook, and any industry-specific platforms so you're never caught off-guard by a new review or brand mention.",
        },
        {
          step: "05",
          title: "Monthly reporting",
          desc: "Monthly reports covering new review volume, average rating trend, response rate, and competitor comparison — so you can see the trajectory clearly.",
        },
      ]}
      included={[
        "Full reputation audit across all major platforms",
        "Competitor rating benchmarking",
        "Review generation campaign setup (email + SMS)",
        "Response to all new Google reviews (positive and negative)",
        "Response templates for common review scenarios",
        "Google Business Profile monitoring and updates",
        "Yelp, Facebook, and industry platform monitoring",
        "Brand mention monitoring (Google Alerts + social)",
        "Crisis response guidance for serious negative reviews",
        "Monthly reputation health report",
        "Review velocity tracking and trend analysis",
      ]}
      bestFor={[
        "Coffee shops and restaurants where reviews drive foot traffic",
        "Hair salons, spas, and beauty businesses with high review volume",
        "Dentists and healthcare providers where trust is critical",
        "Pet groomers dealing with emotional customers",
        "Fitness studios and gyms competing on customer experience",
        "Any local business with under 4.5 stars wanting to improve",
        "New businesses trying to build their first 50 reviews quickly",
      ]}
      faqs={[
        {
          q: "Can you remove negative reviews?",
          a: "Only if they violate platform guidelines (fake, spam, off-topic, or contain prohibited content). I'll flag any that qualify for removal. For legitimate negative reviews, the right response is a professional reply and a strategy to generate more positives — which dilutes the impact of any single bad review.",
        },
        {
          q: "Is it against Google's rules to ask for reviews?",
          a: "No — Google explicitly allows businesses to ask customers for reviews. What's not allowed is incentivising reviews (offering discounts or gifts in exchange) or review gating (only sending review requests to customers you think will leave 5 stars). My system is fully compliant.",
        },
        {
          q: "How quickly can I improve my star rating?",
          a: "With a consistent review generation system, most businesses see meaningful improvement within 60–90 days. If you currently have 20 reviews at 3.8 stars, 30 new 5-star reviews can push you above 4.5. The math moves faster than most people expect.",
        },
        {
          q: "Do you manage reputation for multi-location businesses?",
          a: "Yes. I manage review generation and response management across multiple locations under one reporting dashboard, with location-specific benchmarking.",
        },
        {
          q: "What platforms do you monitor beyond Google?",
          a: "I monitor Google, Yelp, Facebook, TripAdvisor (for hospitality), Healthgrades and Zocdoc (for healthcare), Houzz (for home services), Avvo (for legal), and any industry-specific platform relevant to your business. I also set up Google Alerts and social listening for brand mentions.",
        },
        {
          q: "How does responding to reviews help my ranking?",
          a: "Google has confirmed that responding to reviews is a positive signal for local search rankings. It shows your business is active, engaged, and customer-focused. Businesses that respond to more than 75% of their reviews consistently outrank those that don't — and it also directly increases the trust of prospects who read the responses.",
        },
        {
          q: "What if a competitor is leaving fake negative reviews?",
          a: "This happens more often than people think. If you suspect fake reviews, I can audit the review profiles for bot signals and guide you through the formal flagging and dispute process with Google and other platforms. In severe cases, this can escalate to a legal notice — I can advise on when that threshold has been reached.",
        },
      ]}
      relatedLinks={[
        { label: "Google Business Profile", href: "/services/google-business-profile" },
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "Email & SMS Marketing", href: "/services/email-sms" },
        { label: "Social Media Management", href: "/services/social-media" },
      ]}
    />
  );
}
