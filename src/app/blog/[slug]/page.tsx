import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import CTABanner from "@/components/CTABanner";
import { articleSchema } from "@/lib/schema";

const posts: Record<
  string,
  {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    content: string;
  }
> = {
  "coffee-shops-dominate-google-maps": {
    title: "How Coffee Shops Can Dominate Google Maps in Their Neighborhood",
    excerpt:
      "The local map pack gets 44% of clicks for 'near me' searches. Here's exactly how to claim your spot without a big budget.",
    category: "Coffee Shops",
    date: "April 10, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    content: `
When someone in your neighborhood types "coffee shop near me" into Google, three businesses appear under the map. That's the local map pack — and it captures roughly 44% of all clicks for local searches.

If you're not in those three spots, you're invisible for the most valuable local search term in your category.

## Why Most Coffee Shops Aren't in the Map Pack

The irony is that many coffee shops have a Google Business Profile — they set it up when they opened and haven't touched it since. That half-finished profile with two-year-old photos and no reviews is actively hurting you.

Google uses three primary signals to determine local pack rankings:

1. **Relevance** — how well your profile matches the search query
2. **Distance** — how close you are to the searcher
3. **Prominence** — how well-known and trusted Google considers you (reviews, citations, backlinks)

You can't control distance. But relevance and prominence are 100% in your hands.

## The 5-Step Google Maps Optimization Playbook

### 1. Complete every single field in your GBP

Most profiles are 40–60% complete. Google rewards completeness. Go through every section: business description, services, attributes (outdoor seating? WiFi? pet-friendly?), products, hours including holiday hours.

Your business description should naturally include phrases like "[City] coffee shop", "[neighborhood] café", and relevant service terms. Don't stuff keywords — write for humans, but be specific about what you offer and where you are.

### 2. Choose the right categories

Your primary category matters enormously. "Coffee shop" is obvious, but your secondary categories can capture additional searches: "Café", "Espresso bar", "Breakfast restaurant", "Bakery" (if applicable).

Check what categories your top-ranking competitors are using. The Meta Ad Library equivalent for GBP doesn't exist, but you can click through competitor profiles and see their categories.

### 3. Add high-quality photos — consistently

Profiles with photos get 42% more direction requests and 35% more website clicks. But more importantly: consistency of new photos signals to Google that your business is active.

Aim to add 3–5 new photos per week. Real photos: your drinks, your space, your team, happy customers (with permission), seasonal specials. Turn off auto-enhance — authenticity works better than polish for local businesses.

### 4. Build a review generation machine

Reviews are the most powerful prominence signal. Not just star rating — review volume, recency, and the keywords in review text all factor into ranking.

The system that works:
- Ask at the peak moment (right after a great interaction, not at checkout)
- Make it frictionless: a QR code on receipts that goes directly to your "Write a review" link
- Respond to every review — positive and negative — within 24 hours
- Never incentivize reviews (against Google's terms)

If you can get 5 new reviews a month consistently, you'll outrank most competitors within 3–4 months.

### 5. Post regularly to Google Posts

Google Posts are the updates you can add to your GBP — they appear on your listing and signal freshness. Post at minimum once a week: seasonal drinks, events, community involvement, any news.

These don't directly impact ranking dramatically, but they improve click-through from your listing, which does affect ranking signals.

## What to Expect and When

Month 1–2: Improvements to profile completeness and initial photos. Some impression increases.

Month 2–4: Review accumulation starts. You may start appearing for secondary search terms.

Month 4–6+: Consistent ranking improvement for primary terms like "coffee shop near me" and your neighborhood-specific searches.

Local SEO is not a one-month fix — but it's also not magic. It's consistent signals over time. The coffee shops that do this work are almost always in the top 3 within 6 months.

## The One Thing Most People Skip

Citations — consistent mentions of your business Name, Address, and Phone number across the web. Yelp, Apple Maps, Facebook, TripAdvisor, Yelp, local chamber of commerce directories, food-specific directories.

Inconsistencies (different phone number on Yelp vs Google, old address somewhere) confuse Google and hurt ranking. Audit your citations with a tool like BrightLocal or Moz Local, fix inconsistencies, and build new citations on directories you're missing.

It's unglamorous work. Most competitors haven't done it. That's exactly why it works.
    `,
  },
  "hair-salon-instagram-bookings": {
    title: "The Hair Salon Owner's Guide to Getting More Bookings from Instagram",
    excerpt:
      "Meta Ads can feel like throwing money into a black hole — unless you set them up right. Here's what actually works.",
    category: "Hair Salons",
    date: "April 4, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
    content: `
Most salon owners I talk to have tried Instagram ads. Most of them feel burned by the experience: they boosted a post, spent $100, got some likes, and saw zero new bookings.

The problem isn't Instagram. It's how the ads were set up.

## Boosting Posts is Not Running Ads

This is the number one mistake. When you hit "Boost" on a post, you're using a simplified interface that skips most of the targeting, optimization, and tracking options that make Meta Ads actually work.

You have no control over:
- Campaign objective (awareness vs. conversion vs. lead generation)
- Detailed audience targeting
- Placement optimization
- Conversion tracking

You're essentially paying to show your post to random people and hoping someone books. It rarely works.

## The Right Way: Campaign Objectives and Lead Ads

Here's what actually works for salons. For filling your calendar fast, use Lead Generation campaigns. You create a form that people fill out without leaving Instagram. Offer something compelling: "Book your first visit and get 20% off" or "Claim a free consultation". Meta's algorithm finds people likely to fill out forms — your cost per lead can be $5–$15 in most markets.

For brand building and retargeting, use Traffic or Engagement campaigns targeting people who've visited your website or engaged with your profile. These warm up cold audiences and work well for premium services where consideration time is longer.

## Creative That Converts for Salons

Before/after is king. Not because it's clever — because it works.

The creative that consistently performs best:
1. Before → after photo or quick video with transformation (15 seconds max)
2. Authentic testimonials from real clients
3. "Spots available this week" with a compelling offer (urgency works)
4. Stylist showcasing technique (builds expertise and trust)

What doesn't work: stock photos, generic salon imagery, heavily designed graphics that look like ads.

## Targeting: Hyper-Local with the Right Demographics

For a local salon, your targeting should be:
- Geographic: 3–7 mile radius around your salon (adjust based on your market)
- Age: Tailor to your clientele — most salons skew 25–55
- Interests: Beauty, hair care, wellness — but don't over-narrow
- Custom audiences: Website visitors, existing client email list, video viewers

The mistake is targeting too broadly to "get more impressions" or too narrowly until your audience is 2,000 people (too small for the algorithm to optimize).

A good local salon audience is usually 50,000–200,000 people. Let Meta find the converters within that pool.

## Tracking: The Non-Negotiable

You need Meta Pixel installed on your website. Without it, Meta can't optimize for bookings and you can't attribute results.

For most booking platforms (Vagaro, StyleSeat, Acuity, Booksy), you can add a tracking pixel or use Google Tag Manager to fire a conversion event when someone completes a booking. If you're not sure how, ask me — I set this up regularly.

Once tracking is in place, you can see your actual cost per booking and optimize from there.

## A Realistic Starting Budget and Timeline

Start with $15–$20/day ($450–$600/month). That's enough to generate real data and test a few creative variants.

In the first 2 weeks: data collection and learning phase. Don't panic if results seem slow — Meta's algorithm is calibrating.

Week 3–4: You'll start seeing leads come in. Review quality vs. volume — are they the right type of client?

Month 2–3: Optimize based on real data. What creative is performing? What audience segment is converting? Cut underperformers and scale winners.

Most salon owners running properly structured campaigns are seeing $8–$15 cost per booking lead. At an average lifetime client value of $400–$800, that math works.
    `,
  },
  "pet-groomer-google-ads-mistakes": {
    title: "5 Google Ads Mistakes Pet Groomers Keep Making (and How to Fix Them)",
    excerpt:
      "Most small business Google Ads accounts I audit have at least 3 of these issues. They're all fixable in an afternoon.",
    category: "Pet Groomers",
    date: "March 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80",
    content: `
When I audit Google Ads accounts for local pet groomers, I see the same mistakes over and over. The good news: they're all fixable, and fixing them usually cuts wasted spend by 30–50% while improving results at the same time.

Here are the five I see most often.

## Mistake 1: Targeting the Whole City (or Worse, the Whole State)

Google Ads defaults to broad geographic targeting. If you don't manually set your radius, you may be showing ads to people 40 miles away who would never drive to you.

The fix: Set a radius around your grooming location that matches how far your actual clients travel. For most groomers, that's 5–10 miles. For mobile groomers, set a service-area polygon that matches your actual coverage zone.

Every click from outside your real service area is wasted money.

## Mistake 2: No Negative Keywords

If you're bidding on "dog grooming," your ad will also show for searches like "dog grooming school," "dog grooming scissors to buy," "dog grooming jobs near me," and "free dog grooming tips." None of those people want to book an appointment.

The fix: Build a negative keyword list before you launch. Start with terms like: jobs, training, school, DIY, scissors, clippers, salary, course, certificate, how to. Review your search terms report weekly in the first month and add new negatives as you discover them.

## Mistake 3: Sending Clicks to the Homepage

Your homepage is designed to explain your business to someone who doesn't know you. It has navigation, multiple sections, and lots of choices. That's the wrong destination for someone who searched "dog groomer near me" and clicked your ad.

The fix: Send ad traffic to a dedicated landing page with one job — get the booking. It should have your service area, key services, prices (or a range), photos, reviews, and one clear CTA: call or book online. No navigation. No distractions. Conversion rates improve dramatically.

## Mistake 4: No Conversion Tracking

If you don't have conversion tracking set up, you're flying blind. You can see clicks and impressions, but you have no idea which keywords are generating phone calls or booking form submissions — and which are just burning budget.

The fix: Set up at minimum two conversion actions: phone call clicks (when someone clicks your phone number on mobile) and form submissions (when someone submits your contact or booking form). Both can be set up through Google Tag Manager with no coding required. Once tracking is in place, you can see cost per lead by keyword and cut the underperformers.

## Mistake 5: Using Broad Match for Everything

Broad match keywords in Google Ads will trigger your ad for searches Google considers "related" — which often means vaguely, distantly related. Bidding on broad match "pet groomer" can show your ad for "pet hotel," "pet sitting jobs," and stranger things.

The fix: Use phrase match or exact match for your core keywords. Start tight and loosen as you gather data. Your core keywords should look like "dog grooming [city]," "pet groomer near me," and "mobile dog grooming [neighborhood]" — all on phrase or exact match.

## The Underlying Issue

Most of these mistakes happen because Google Ads accounts are set up quickly by someone who isn't a specialist, or by using Google's "Smart Campaigns" which hides all the controls and optimises for Google's revenue, not yours.

A proper account setup takes a few hours but saves hundreds per month in wasted spend. If you're running Google Ads and haven't looked under the hood in a while, it's worth an audit.
    `,
  },
  "fitness-studio-year-round-marketing": {
    title: "Fitness Studios: How to Fill Classes in January AND July",
    excerpt:
      "The fitness industry is notoriously seasonal. Here's how to build a marketing calendar that drives memberships all year.",
    category: "Fitness Studios",
    date: "March 20, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
    content: `
Every fitness studio owner knows the January rush. New year's resolutions flood your calendar with trial bookings, you're turning people away, and the future looks bright. Then February hits. And by July you're staring at half-empty classes wondering where everyone went.

The problem isn't your studio. It's that you're relying on organic demand instead of building a marketing system that creates demand year-round.

Here's how to fix that.

## Understand Your Seasonality First

Before you can counter seasonality, you need to map it. Pull your monthly membership data and new sign-up data for the past 2 years and chart it. Most studios see:

- Peak: January, September (back-to-routine)
- Secondary peaks: March (pre-summer), November (pre-holidays)
- Valleys: July–August, December

Once you know your pattern, you can plan campaigns to run 4–6 weeks before your valleys to smooth them out.

## The Counter-Intuitive Truth About Off-Season Marketing

Most studios reduce their marketing spend in slow months because "there's less demand." This is exactly backwards.

In January, every fitness studio in your area is advertising. The market is flooded with competitors all trying to capture the same resolution-driven demand. Your cost per lead is at its annual high.

In July, most of your competitors have gone quiet. Your cost per lead drops by 30–50%. The people who are interested in fitness in July are serious — they're not resolution-seekers who'll quit by March. These are higher-quality leads with better retention.

Counter-cyclical marketing is one of the highest-ROI strategies available to local fitness studios.

## Build a 12-Month Campaign Calendar

Here's a framework that works for most studios:

January–February: Ride the wave, but focus on conversion quality. Target people with fitness interests AND existing gym memberships (more likely to switch than completely inactive people).

March–April: "Get ready for summer" campaign. This is an underused window. Everyone's thinking about it but the advertising pressure is lower than January.

May–June: Outdoor fitness is competition. Lean into what you offer that outdoor workouts don't — community, instruction, air conditioning, variety.

July–August: Your counter-cyclical window. Run your strongest offer. Acquisition costs are low, and anyone signing up now will be a 12+ month member.

September–October: Back-to-routine push. Almost as strong as January. Run campaigns that appeal to people who "fell off" over summer.

November–December: Pre-holiday stress campaigns. Focus on mental health, energy, and managing the holiday season — not just physical goals.

## Lead Generation Campaigns: Your Year-Round Engine

For fitness studios, Meta Lead Ads are the most reliable year-round acquisition tool. Here's why: you control when they run, who sees them, and what offer they receive. You're not dependent on someone happening to search for a gym at the right moment.

A lead ad campaign with a strong offer — "First class free," "2-week unlimited trial for $19," "Free intro session with a trainer" — running to a 5-mile radius of your studio at $15–$25/day will generate a consistent flow of leads regardless of the time of year.

The offer matters. "Join now" is not an offer. A specific, time-limited, low-friction trial is.

## Retention Is Your Best Acquisition Strategy

A 10% improvement in member retention has more impact than a 20% increase in new member acquisition. Yet most studios spend 10x more on acquisition than retention.

Simple retention systems that work:
- 90-day check-in: personal message or call at the 3-month mark (highest churn window)
- Progress milestones: celebrate member achievements publicly (with permission)
- Win-back campaign: automated email/SMS sequence for members who stop coming before they cancel
- Referral programme: give existing members a reason to bring friends

If your average member stays for 8 months and you extend that to 11 months, you've effectively grown your business by 37% without acquiring a single new customer.

## Measure What Actually Matters

Most fitness studios track: total members, new sign-ups, class attendance. That's a start but it's not enough to make good marketing decisions.

Add to your dashboard:
- Cost per trial booking (by channel and campaign)
- Trial-to-membership conversion rate
- Average membership length
- Revenue per member
- Churn rate by cohort (when did members who joined in January leave vs. September joiners?)

With these numbers, you can calculate the real ROI of every marketing channel and make decisions based on lifetime value rather than just lead volume.
    `,
  },
  "google-business-profile-optimization-checklist": {
    title: "Google Business Profile 2026: The Complete Optimization Checklist",
    excerpt:
      "Everything you need to optimize your GBP for maximum visibility in the local map pack. Practical, step-by-step.",
    category: "Local SEO",
    date: "March 12, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&q=80",
    content: `
Google Business Profile (GBP) is the most underused free marketing tool available to local businesses. Most businesses set it up once and never return. The businesses that treat it as a living, active channel consistently outrank their competition in the local map pack — often without spending a penny on ads.

This checklist covers everything. Work through it once properly and you'll be ahead of 90% of your local competitors.

## Section 1: Basic Information

Start with the fundamentals. These need to be 100% correct and consistent with how your business appears everywhere else online (website, Yelp, Facebook, etc.).

- Business name matches your real-world name exactly (no keyword stuffing like "Mike's Plumbing — Best Plumber in Chicago")
- Primary category is as specific as possible (not just "Restaurant" but "Coffee Shop" or "Espresso Bar")
- Add all relevant secondary categories
- Address is correct and formatted consistently (Street vs St, Suite vs Ste)
- Phone number is local (not a toll-free number)
- Website URL is correct and goes to a relevant page
- Hours are current and complete, including holiday hours
- Service area is set correctly if you serve customers at their location

## Section 2: Business Description

You get 750 characters. Use them well.

- Naturally includes your primary keyword (e.g., "coffee shop in [neighborhood]")
- Describes what makes you different, not just what you do
- Mentions key services or specialties
- Includes your city/neighborhood naturally
- Does not include URLs, promotional language, or keyword stuffing
- Is written for humans first, search engines second

## Section 3: Services and Products

This section is chronically underused. Every service you add is another keyword signal to Google.

- Add every service you offer with a title and description
- Include the specific service name as customers would search for it (e.g., "Balayage" not just "Hair Colouring")
- Add products if applicable (coffee drinks, retail products, etc.)
- Include prices where possible — it builds trust and improves conversion

## Section 4: Photos and Videos

Businesses with photos get 42% more direction requests. This matters.

- Cover photo: high quality, represents your best work or space
- Logo: clear, correctly sized
- Interior photos: show the atmosphere (at least 5)
- Exterior photos: help customers find you (include signage, parking)
- Team photos: builds trust and humanises your business
- Work/product photos: before/after, food, services in action
- New photos added regularly (aim for weekly)
- No stock photos — authenticity wins

## Section 5: Reviews

Reviews are the single highest-impact factor for local pack ranking after proximity.

- Minimum 10 reviews to start ranking competitively
- Average rating 4.2+ (below this hurts conversion significantly)
- Recent reviews — recency matters as much as volume
- Reviews contain keywords naturally (customers mentioning your services and location)
- You respond to every review — positive AND negative
- Response time under 24 hours
- Active system for requesting reviews from happy customers

## Section 6: Google Posts

Posts show on your profile and signal active management to Google.

- At least one post per week
- Mix of post types: offers, events, updates, products
- Each post has a clear call-to-action
- Images are high quality and correctly sized
- Posts are timely and relevant (seasonal, promotional, newsworthy)

## Section 7: Q&A

Most businesses ignore this section completely. That's an opportunity.

- Seed your own Q&A with the questions customers actually ask
- Answer every question promptly
- Include natural keywords in your answers
- Monitor for and remove inappropriate or incorrect Q&A

## Section 8: Attributes

Attributes are the checkboxes that appear on your profile and in search filters. Getting these right helps you appear in filtered searches.

- Select all applicable service options (dine-in, takeaway, delivery, etc.)
- Add accessibility features if applicable
- Add payment methods accepted
- Add any relevant health and safety attributes
- For specific niches: add pet-friendly, outdoor seating, WiFi, etc.

## The Ongoing Maintenance Schedule

A one-time optimisation decays over time. Set up a recurring schedule:

Weekly: Add a Google Post, respond to any new reviews.

Monthly: Add fresh photos, check hours are current, review Q&A for new questions.

Quarterly: Full audit — check all information is accurate, review competitor profiles for new optimization opportunities, analyse your insights data.

## How to Measure Progress

GBP Insights (in your dashboard) shows:
- Search queries that led to your profile
- Impressions (how many times your profile appeared)
- Click-throughs (website clicks, calls, directions)
- Photo views

Track these monthly. A properly optimised profile should show steady improvement in impressions and actions over 3–6 months. If numbers are flat after 3 months of consistent effort, that's a signal to look at your citation consistency and on-page SEO, which are the next levers to pull.
    `,
  },
  "local-marketing-budget-guide": {
    title: "What Does a Good Local Marketing Budget Actually Look Like?",
    excerpt:
      "Honest breakdown of what local businesses should expect to spend on Google Ads, Meta Ads, and SEO — and what they'll get for it.",
    category: "Strategy",
    date: "March 5, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    content: `
One of the most common questions I get from local business owners is: "How much should I be spending on marketing?" It's a fair question and there's a lot of misleading information out there — agencies with minimums that don't make sense for small businesses, and advice built for national brands rather than local ones.

Here's an honest breakdown based on what actually works for local businesses in the coffee shop, salon, pet groomer, and fitness studio space.

## The Baseline: What Not to Do

Don't take a percentage of revenue as your starting point. The "spend 10% of revenue on marketing" rule is a generalisation built for established businesses. If you're a new coffee shop doing $15k/month, spending $1,500 on marketing might be exactly right or completely wrong depending on your stage, goals, and local competition.

Start from outcomes, not percentages.

## Google Ads: What to Expect at Each Budget Level

Google Ads for local businesses is highly dependent on your market's competition level. A hair salon in a small market pays very differently than one in central Manhattan.

$200–$300/month in ad spend: Viable for low-competition markets or very tight geo-targeting. You'll get data but optimisation is limited. Best used for hyper-specific campaigns (one service, tight radius).

$400–$700/month in ad spend: The sweet spot for most local businesses in medium-competition markets. Enough volume to generate meaningful data, test 2–3 ad groups, and see real results within 4–6 weeks.

$800–$1,500/month in ad spend: Appropriate for competitive urban markets or businesses running multi-service campaigns. At this level you can cover most high-intent searches in your area.

Management fee (what you pay an agency or freelancer): Add $300–$600/month on top of ad spend for a freelancer or small agency. Avoid agencies charging less than $250/month — they're not actually managing anything.

## Meta Ads: Lower Cost, Different Intent

Meta Ads (Facebook and Instagram) generally have lower cost per lead for local businesses than Google Ads, but the intent is different. Google captures people actively searching. Meta interrupts people who aren't looking but match your customer profile.

$250–$400/month in ad spend: Sufficient to run one core campaign with 2–3 creative variants. Expect 20–50 leads/month at this level for most local businesses.

$500–$800/month: Allows for proper testing — multiple audiences, multiple creative sets. This is where the algorithm has enough data to optimise effectively.

Meta Ads management: $250–$500/month for a freelancer managing ongoing campaigns.

## Local SEO: Front-Loaded Investment

Local SEO works differently from ads — it's a front-loaded investment with compounding returns, not an ongoing cost in the same way.

Initial setup (GBP optimisation, citation audit and build, on-page SEO): $500–$1,500 one-time, depending on scope and how much cleanup is needed.

Ongoing monthly maintenance: $200–$400/month for continued citation building, content updates, rank tracking, and monthly reporting.

Timeline: Expect meaningful results in 3–6 months, significant results in 6–12 months. It compounds — a business that's been doing consistent local SEO for 2 years has a significant moat over new competitors.

## The Full Stack: What a Serious Local Business Budget Looks Like

For a local business serious about growth — say a hair salon doing $30–$60k/month revenue — here's a realistic allocation:

Google Ads (ad spend): $500/month
Meta Ads (ad spend): $400/month
Freelancer/agency management: $600–$800/month
Local SEO maintenance: $300/month
Total: $1,800–$2,000/month

That's approximately 3–5% of revenue. For most profitable local businesses, this generates a positive ROI — the question is whether you're executing well.

## What to Prioritise if Budget is Limited

If you can only spend $500/month total, here's how I'd prioritise by business type.

For coffee shops and restaurants: Start with Google Business Profile optimisation (one-time) + $200 Google Ads. The GBP work is free traffic that compounds; Ads capture the immediate demand.

For hair salons and beauty studios: $300 Meta Ads + $200 GBP optimisation. Meta works especially well for visual service businesses.

For pet groomers: $250 Google Ads (high search intent) + GBP optimisation. Pet owners search with strong intent and Google captures that.

For fitness studios: $350 Meta Lead Ads. The trial class offer converts well as a lead ad, and it's the fastest way to fill a class calendar.

## The One Thing That Makes Everything Else Work Better

Analytics. If you don't have conversion tracking set up — knowing which channel and which campaign generated a phone call or booking — you're optimising blind.

A proper analytics setup (GA4, call tracking, conversion events) costs $300–$500 to set up correctly and pays for itself in the first month by showing you which spend is wasted. It's not optional — it's the foundation every other channel builds on.
    `,
  },
};

/** Converts **bold** and *italic* markdown inline markers to JSX */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const schema = articleSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://datalatte.pro/blog/${slug}`,
    datePublished: post.date,
    image: post.image,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero image */}
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <span className="inline-block bg-coffee-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {post.readTime}
          </span>
          <Link href="/blog" className="flex items-center gap-1 text-coffee-700 hover:underline ml-auto text-sm">
            <ArrowLeft size={14} /> All posts
          </Link>
        </div>

        {/* Content */}
        <div className="prose-datalatte">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{line.slice(3)}</h2>;
            }
            if (line.startsWith("### ")) {
              return <h3 key={i} className="text-xl font-semibold text-gray-800 mt-8 mb-3">{line.slice(4)}</h3>;
            }
            if (line.startsWith("- ")) {
              return <li key={i} className="text-gray-600 mb-2 ml-4">{renderInline(line.slice(2))}</li>;
            }
            if (line.match(/^\d+\. /)) {
              return <li key={i} className="text-gray-600 mb-2 ml-4">{renderInline(line.replace(/^\d+\. /, ""))}</li>;
            }
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-gray-600 leading-relaxed mb-4">{renderInline(line)}</p>;
          })}
        </div>

        {/* Author */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coffee-700 to-coffee-600 flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <div>
              <div className="font-semibold text-gray-900">DataLatte</div>
              <div className="text-sm text-gray-500">
                Freelance local marketing & analytics — for businesses that want real results.
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTABanner
        headline="Want this applied to your business?"
        sub="Let's review your current marketing setup together — free, no obligations."
      />
    </>
  );
}
