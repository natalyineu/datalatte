import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/email-sms",
    languages: {
      "en-US": "https://datalatte.pro/services/email-sms",
      "en-GB": "https://datalatte.pro/services/email-sms",
      "en-AU": "https://datalatte.pro/services/email-sms",
      "en-CA": "https://datalatte.pro/services/email-sms",
      "x-default": "https://datalatte.pro/services/email-sms",
    },
  },
  title: "Email & SMS Marketing for Local Businesses",
  description:
    "Email and SMS marketing for coffee shops, salons, pet groomers, and fitness studios. Build a list, stay top of mind, and turn one-time visitors into loyal regulars.",
  openGraph: {
    title: "Email & SMS Marketing for Local Businesses",
    description: "Email and SMS marketing for coffee shops, salons, pet groomers, and fitness studios. Build a list, stay top of mind, and turn one-time visitors into loyal regulars.",
    url: "https://datalatte.pro/services/email-sms",
    siteName: "DataLatte",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email & SMS Marketing for Local Businesses",
    description: "Email and SMS marketing for coffee shops, salons, pet groomers, and fitness studios. Build a list, stay top of mind, and turn one-time visitors into loyal regulars.",
  },
};

export default function EmailSMSPage() {
  return (
    <ServicePage
      service="Email & SMS Marketing"
      tagline="Your regulars are your best asset. Keep them coming back."
      description="New customer acquisition is expensive. Your existing customers are 5× more likely to book again — if you stay in front of them. Email and SMS are the highest-ROI channels for turning one-time visitors into loyal regulars."
      icon="✉️"
      accentClass="bg-gradient-to-br from-coffee-700 to-gray-900"
      whatItIs="Email and SMS marketing for local businesses means building a list of real customers who've opted in to hear from you, and then sending them the right messages at the right times — a seasonal offer, a reminder that it's been 6 weeks since their last haircut, a 'we miss you' re-engagement for lapsed clients, or a heads-up about a new service. Unlike ads (where you pay every time you want to reach someone), your email and SMS list is an owned audience: you built it, you own it, and you can reach them for pennies. For local businesses with repeat purchase potential — which is all four of our niches — this compounds into real revenue over time.\n\nIn the marketing funnel, email and SMS sit primarily at the retention and loyalty layer — but they can do real work further up too. A well-structured welcome sequence introduces new subscribers to your full range of services and nudges first-timers toward a second visit. Mid-funnel, automated follow-ups after appointments or purchases keep your business top of mind during the consideration window when customers decide whether to rebook or wander to a competitor. At the loyalty stage, segmented campaigns to your best customers — exclusive offers, early access to new services, birthday treats — drive the high-margin repeat business that pays the rent. Done well, email and SMS don't just support your other marketing; they reduce your dependence on it.\n\nThe most common mistake local businesses make with email and SMS is treating it as a broadcast channel — blasting the same generic message to everyone on the list, every time, regardless of where they are in the customer lifecycle. Litmus research shows that segmented email campaigns generate 760% more revenue than non-segmented sends, yet most small business owners either don't segment at all or only do so by accident. Sending a 'book your next appointment' email to someone who booked yesterday, or a re-engagement offer to a customer who was in last week, erodes trust and drives unsubscribes. The fix is simple: three core segments minimum — new subscribers, active customers, and lapsed customers — with tailored messages for each."
      howItWorks={[
        {
          step: "01",
          title: "Platform setup",
          desc: "Set up or migrate to the right email/SMS platform for your business — Klaviyo, Mailchimp, or a combined email+SMS tool like Attentive or GoHighLevel depending on your budget and booking system.",
        },
        {
          step: "02",
          title: "List building strategy",
          desc: "Build your opt-in flow: email capture at checkout, QR codes, booking confirmation opt-ins, social media lead magnets. Many businesses are sitting on hundreds of uncaptured customer contacts.",
        },
        {
          step: "03",
          title: "Core automations",
          desc: "Set up the sequences that run forever: welcome series for new subscribers, post-visit follow-up, re-engagement for lapsed customers, birthday offers, appointment reminders.",
        },
        {
          step: "04",
          title: "Campaign calendar",
          desc: "Build a 3-month send calendar timed to your business seasonality — holidays, slow months, new service launches. I write the copy and you approve before anything goes out.",
        },
        {
          step: "05",
          title: "Tracking & optimisation",
          desc: "Set up open rate, click rate, and revenue tracking. Refine subject lines, send times, and offers based on real data — not guesswork.",
        },
      ]}
      included={[
        "Email/SMS platform setup or audit",
        "List segmentation (new customers, regulars, lapsed)",
        "Welcome automation sequence",
        "Post-visit follow-up sequence",
        "Re-engagement campaign for lapsed customers",
        "Birthday/anniversary automation",
        "3-month campaign calendar with copy",
        "Subject line and offer A/B testing framework",
        "Performance dashboard (open rates, click rates, revenue)",
        "List growth playbook specific to your business type",
        "Opt-in landing page or sign-up form setup",
        "SMS compliance configuration (opt-in, opt-out, quiet hours)",
        "Booking system integration where supported",
      ]}
      notIncluded={[
        "Ongoing monthly campaign management after setup (I can quote separately)",
        "Graphic design for emails (I provide text-based templates you can brand)",
        "SMS compliance legal advice (I advise on best practices, not legal counsel)",
        "CRM buildout beyond email/SMS platform",
      ]}
      bestFor={[
        "Businesses with an existing customer base they haven't marketed to",
        "Coffee shops and salons with high repeat-purchase potential",
        "Studios and groomers who want to reduce seasonal revenue dips",
        "Businesses that want to reduce reliance on paid ads over time",
        "Owners who've collected customer emails but never emailed them",
        "Any business with a loyalty or rewards programme to promote",
      ]}
      faqs={[
        {
          q: "What if I don't have an email list yet?",
          a: "That's actually a great time to start — you build it right from the beginning with proper opt-ins. I'll build the capture mechanisms alongside the platform setup so you're growing from day one.",
        },
        {
          q: "Is SMS marketing too intrusive?",
          a: "When done right — proper opt-in, low frequency (2–4 per month), and relevant content — SMS has the highest open rates of any channel (98%+ within 3 minutes). The key is permission and relevance. Nobody minds a text that says 'your favourite coffee drink is back on the menu this week.'",
        },
        {
          q: "Which platform do you recommend?",
          a: "For most local businesses, Mailchimp is a solid free starting point for email only. If you want SMS too, GoHighLevel or Klaviyo are worth the investment. I'll recommend based on your booking system integrations and budget.",
        },
        {
          q: "How often should I email my list?",
          a: "For most local businesses: once or twice a month for email, 2–4 times a month for SMS. Frequency depends on how much value you can deliver — I'd rather send fewer high-quality messages than flood inboxes with noise.",
        },
        {
          q: "Can I integrate email and SMS with my booking system?",
          a: "In most cases, yes. Platforms like Klaviyo and GoHighLevel integrate with popular booking tools including Mindbody, Acuity, Fresha, and Square. That means automations can trigger based on real appointment data — bookings made, appointments completed, gaps in rebooking — rather than requiring manual list management.",
        },
        {
          q: "What's a realistic open rate I should expect?",
          a: "For a warm local business list with relevant content, email open rates of 30–45% are achievable — well above the industry average of around 21%. SMS open rates sit at 95–98%. The key driver is relevance: messages tied to the customer's history with your business consistently outperform generic broadcasts by a wide margin.",
        },
        {
          q: "How do I grow my email list without paying for ads?",
          a: "The best list-building tactics for local businesses don't require any ad spend: a QR code at your counter linking to a sign-up form, an opt-in checkbox in your booking confirmation, a 'join our list for exclusive offers' prompt on your receipt, and a link in your GBP bio. Most businesses that implement all four see meaningful list growth within 30 days.",
        },
        {
          q: "Is there a legal compliance angle I need to worry about?",
          a: "Yes — CAN-SPAM (US), CASL (Canada), and GDPR (UK/EU) all apply. The short version: always get explicit opt-in, include an unsubscribe option in every send, honour opt-outs promptly, and for SMS, never send during quiet hours. I configure all of this correctly during setup so you're protected from day one.",
        },
      ]}
      stats={[
        { value: "42:1", label: "Average email marketing ROI" },
        { value: "98%", label: "SMS open rate vs 20% for email" },
        { value: "3×", label: "More revenue from segmented campaigns" },
        { value: "$0.01", label: "Typical cost per email sent" },
      ]}
      relatedLinks={[
        { label: "AI Agents & Automation", href: "/services/ai-agents" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Google Business Profile", href: "/services/google-business-profile" },
      ]}
    />
  );
}
