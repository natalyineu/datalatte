import type { Metadata } from "next";
import NichePage from "@/components/NichePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/for/hair-salons",
    languages: {
      "en-US": "https://datalatte.pro/for/hair-salons",
      "en-GB": "https://datalatte.pro/for/hair-salons",
      "en-AU": "https://datalatte.pro/for/hair-salons",
      "en-CA": "https://datalatte.pro/for/hair-salons",
      "x-default": "https://datalatte.pro/for/hair-salons",
    },
  },
  title: "Hair Salon & Beauty Marketing | Get More Bookings with Local SEO & Ads",
  description:
    "Marketing for hair salons, barbershops, and beauty studios. More online bookings, higher Google Maps visibility, and Instagram ads that actually convert.",
  openGraph: {
    title: "Hair Salon & Beauty Marketing | DataLatte",
    description:
      "Grow your salon's client base with data-driven local marketing — Google Business Profile, targeted ads, and SEO that brings in new booking requests.",
  },
};

export default function HairSalonsPage() {
  return (
    <NichePage
      niche="Hair & Beauty Salons"
      headline="Fill Your Appointment Book Without the Guesswork"
      subheadline="Your clients are searching for you right now. Let's make sure they find you — and book — before they find your competitor down the street."
      heroImage="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80"
      accentColor="bg-gradient-to-br from-gray-700 to-gray-900"
      problems={[
        "You rely almost entirely on word-of-mouth and existing clients — growth has plateaued.",
        "Your Google Business Profile has outdated photos and not enough reviews to compete.",
        "You've tried boosting Instagram posts but have no idea if it actually brought in clients.",
        "New clients say they 'found you on Google' but you're not sure what's driving that or how to get more.",
        "You have empty time slots mid-week that you can't seem to fill.",
      ]}
      kpis={[
        {
          metric: "New Booking Requests",
          improvement: "+40–80%",
          desc: "Combining local SEO with targeted ads consistently drives new clients to book.",
        },
        {
          metric: "Google Maps Impressions",
          improvement: "+90%",
          desc: "Optimized GBP listings get dramatically more views from nearby searchers.",
        },
        {
          metric: "Ad Cost per Booking",
          improvement: "$8–$15",
          desc: "Well-targeted Meta and Google campaigns for salons can be extremely cost-effective.",
        },
      ]}
      services={[
        {
          title: "Google Business Profile",
          icon: "📍",
          desc: "Keyword-optimized profile, fresh photos, service list, booking link, and a review strategy. The map pack is where new clients start their search.",
        },
        {
          title: "Meta Ads (Instagram & Facebook)",
          icon: "✨",
          desc: "Before/after creative, promotional offers, and retargeting people who visited your website. Highly visual ads work extremely well for salons.",
        },
        {
          title: "Google Search Ads",
          icon: "🎯",
          desc: "Capture high-intent searches like \"hair salon near me\" and \"balayage [city]\". These clients are ready to book — let's make sure you show up.",
        },
        {
          title: "Local SEO",
          icon: "🔍",
          desc: "Rank organically for your services + location. Lower cost over time than paid ads, and builds credibility with new clients.",
        },
        {
          title: "Analytics & Conversion Tracking",
          icon: "📊",
          desc: "Set up booking form tracking, call tracking, and a clear report so you know exactly which channels are filling your chair.",
        },
        {
          title: "Booking Funnel Optimization",
          icon: "📅",
          desc: "If your website makes it hard to book, ads won't work. I'll audit your booking flow and fix the friction points.",
        },
      ]}
      tactics={[
        {
          title: "Target service-specific searches",
          detail:
            'Keywords like "balayage near me", "men\'s haircut [city]", and "keratin treatment salon [neighborhood]" have strong booking intent. These convert much better than broad terms.',
        },
        {
          title: "Use before/after content strategically",
          detail:
            "Before/after images are the highest-performing creative for salons on Meta. Used as dark posts (not on your feed, just in ads), they can drive bookings without looking like ads.",
        },
        {
          title: "Fill slow periods with targeted promotions",
          detail:
            "Mid-week is typically slow. Running time-limited offers (Tues–Wed only, $15 off) targeted to people within 5 miles can reliably fill empty slots.",
        },
        {
          title: "Retarget website visitors",
          detail:
            "People who visit your site but don't book are warm leads. A retargeting campaign on Meta or Google showing up with a reminder and social proof converts these at very low cost.",
        },
      ]}
      testimonial={{
        quote:
          "My Instagram was beautiful but it wasn't translating into bookings. DataLatte built out a proper Meta Ads strategy and within a month I had more new client requests than I could handle. Had to hire a second stylist.",
        author: "Aisha B.",
        role: "Owner, Éclat Hair Studio",
        rating: 5,
      }}
      faq={[
        {
          q: "Is this for large salons or small ones?",
          a: "Both — but I specialize in independent and small-chain salons where the owner is hands-on. Whether you have 2 chairs or 10, the fundamentals of local marketing are the same.",
        },
        {
          q: "What kind of ad creative do I need?",
          a: "For Meta ads, before/after photos perform best and you probably already have these. I'll guide you on what to shoot and can help with copy. For Google Ads, it's text-based — no design needed.",
        },
        {
          q: "I already use a booking software like Vagaro or Mindbody. Can you integrate with that?",
          a: "Yes. I can set up conversion tracking for most booking platforms so we know exactly which ads are driving appointments.",
        },
        {
          q: "How much should I budget for ads?",
          a: "For most salons, $300–$600/month in Meta Ads is a great starting point. Google Ads depend on your local competition. I'll give you a specific recommendation during the free audit.",
        },
      ]}
      ctaHeadline="Ready to fill your appointment book with new clients?"
    />
  );
}
