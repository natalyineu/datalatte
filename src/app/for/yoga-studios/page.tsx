import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/yoga-studios",
    languages: {
      "en-US": "https://datalatte.pro/for/yoga-studios",
      "en-GB": "https://datalatte.pro/for/yoga-studios",
      "en-AU": "https://datalatte.pro/for/yoga-studios",
      "en-CA": "https://datalatte.pro/for/yoga-studios",
      "x-default": "https://datalatte.pro/for/yoga-studios",
    },
  },
  title: "Yoga Studio Marketing | Google Ads, Local SEO & More",
  description:
    "Data-driven marketing for yoga studios. Fill your classes, reduce churn, and grow memberships with Google Ads, local SEO, and analytics built for studios.",
  openGraph: {
    title: "Yoga Studio Marketing | DataLatte",
    description:
      "Fill every class and grow your membership base with local SEO, Google Ads, and marketing analytics built specifically for yoga studios.",
  },
};

export default function YogaStudiosPage() {
  return (
    <NichePage
      niche="Yoga Studios"
      headline="Fill Every Class and Grow Memberships — With Data, Not Guesswork"
      subheadline="Yoga studios live on consistent class attendance and low churn. Let's build a marketing system that brings in new students and keeps your members coming back."
      heroImage="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80"
      accentColor="bg-gradient-to-br from-coffee-700 to-coffee-900"
      problems={[
        "You're not showing up when people search 'yoga studio near me' — even though you have amazing classes.",
        "New student acquisition is inconsistent — some months great, others slow for no obvious reason.",
        "You spend time on Instagram but it's hard to know if it's actually driving sign-ups.",
        "Membership churn is eating into growth — you're filling the top of the bucket while it leaks.",
        "Larger studios with bigger marketing budgets are outranking you for local searches.",
      ]}
      kpis={[
        {
          metric: "New Student Sign-ups",
          improvement: "+40–80%",
          desc: "Targeted local campaigns bring in students actively looking for yoga in your area.",
        },
        {
          metric: "Cost Per New Member",
          improvement: "$15–$35",
          desc: "With high lifetime value per member, a well-targeted ad campaign pays back fast.",
        },
        {
          metric: "Class Fill Rate",
          improvement: "+25–50%",
          desc: "Better local visibility and retargeting campaigns fill your off-peak slots.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile Optimization",
          icon: "📍",
          desc: "Optimize your studio's GBP with classes, photos, and reviews. Show up when people search for yoga near them — the highest-intent local traffic there is.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank for 'yoga studio near me', 'beginner yoga classes [city]', and style-specific terms like 'hot yoga' or 'vinyasa [neighborhood]'.",
        },
        {
          title: "Google Ads",
          icon: "🎯",
          desc: "Search and Performance Max campaigns targeting people actively looking for yoga studios. Pay only when someone clicks — and only within your target area.",
        },
        {
          title: "Meta Ads",
          icon: "📱",
          desc: "Intro offer promotions, class schedule highlights, and membership campaigns on Instagram and Facebook — reaching locals who match your ideal student profile.",
        },
        {
          title: "Email & SMS Marketing",
          icon: "✉️",
          desc: "Re-engage lapsed members, promote workshops, and run class-fill campaigns with automated sequences that work while you teach.",
        },
        {
          title: "Analytics & Reporting",
          icon: "📊",
          desc: "Track which channels are driving trials, conversions, and memberships. Know your cost per acquisition and lifetime value so every marketing dollar is accountable.",
        },
      ]}
      tactics={[
        {
          title: "Target style-specific and intent-rich keywords",
          detail:
            "'Yoga near me' is competitive. 'Hot yoga [city]', 'beginner yoga classes [neighborhood]', 'prenatal yoga [area]' — these long-tail searches have lower competition and higher conversion because the searcher knows exactly what they want.",
        },
        {
          title: "Convert intro offers into memberships",
          detail:
            "Most yoga studios offer a discounted first month or class pack. The marketing work doesn't stop at getting someone through the door — an automated email/SMS sequence during the intro period dramatically improves conversion to full membership.",
        },
        {
          title: "Use class schedule as content",
          detail:
            "New workshops, specialty classes, and seasonal offerings are natural hooks for email, social, and even Google Ads. Consistent content around your schedule keeps your studio top-of-mind with people who haven't joined yet.",
        },
        {
          title: "Retarget website visitors with class promotions",
          detail:
            "Someone who visited your schedule page but didn't book is a warm lead. Meta retargeting with a specific offer (first class free, intro week) converts these visitors at 3–5× the rate of cold audiences.",
        },
      ]}
      testimonial={{
        quote:
          "We'd been relying on word-of-mouth for 5 years. DataLatte built us a Google Ads campaign that brought in 23 new members in the first 6 weeks. The intro offer funnel they set up is now our biggest growth driver.",
        author: "Sarah K.",
        role: "Owner, Flow & Ground Yoga",
        rating: 5,
      }}
      faq={[
        {
          q: "How much should a yoga studio spend on Google Ads?",
          a: "Most studios see strong results with $300–$700/month. With a monthly membership worth $80–$150, acquiring a member for $20–$40 in ad spend has an excellent ROI.",
        },
        {
          q: "Should I focus on Google Ads or Meta Ads?",
          a: "Google Ads captures people actively searching — higher intent, faster results. Meta Ads build awareness and work well for promotions. Ideally both, but if choosing one, start with Google.",
        },
        {
          q: "Can you help with reducing membership churn?",
          a: "Yes — email and SMS retention sequences, re-engagement campaigns, and tracking drop-off points are all part of a full-funnel strategy. Reducing churn by even 10% dramatically improves growth.",
        },
        {
          q: "Do you work with studios that use ClassPass or Mindbody?",
          a: "Yes — I work around your existing booking system. I can also advise on how to balance direct memberships vs. third-party platforms from a margin perspective.",
        },
        {
          q: "How do I attract people who've never done yoga before?",
          a: "Beginners need lower-friction entry points: a free or discounted intro class, clear messaging about what to expect, and social proof from people who look like them. Meta Lead Ads with 'first class free' offers and beginner-specific ad copy consistently outperform generic campaigns for first-time yoga students.",
        },
        {
          q: "What's the difference between marketing for a yoga studio versus a general gym?",
          a: "Yoga clients tend to be more values-driven — they respond to authenticity, community, and instructor personality more than equipment or facilities. Your marketing should feature real instructors, genuine transformations, and a sense of the studio's culture. This performs better than generic fitness imagery.",
        },
        {
          q: "Do you work with yoga studios outside the US?",
          a: "Yes — UK, Australia, Canada, and other English-speaking markets. Yoga is a strong local search category globally and the core acquisition channels (Google, Meta, local SEO) are available everywhere. I adapt strategy and pricing benchmarks to your local competitive environment.",
        },
      ]}
      ctaHeadline="Ready to fill every class and grow your membership?"
    />
  );
}
