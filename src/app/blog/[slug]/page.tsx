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
  "what-is-the-3-3-3-rule-in-marketing": {
    title: "What Is the 3-3-3 Rule in Marketing? A Simple Guide for Local Businesses",
    excerpt:
      "The 3-3-3 rule breaks every customer interaction into three stages: 3 seconds to capture attention, 3 minutes to build interest, and 3 steps to convert. Here's how to apply it.",
    category: "Strategy",
    date: "May 14, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    content: `
The **3-3-3 rule in marketing** is a practical framework that breaks every customer interaction into three timed stages: **3 seconds** to capture attention, **3 minutes** to build interest, and **3 steps** to complete a conversion. It applies whether you're running Google Ads, sending an email campaign, or posting on Instagram.

Since "What is the 3-3-3 rule in marketing?" is one of the most searched questions local business owners ask without finding a clear answer — here's the definitive breakdown, with examples for coffee shops, salons, pet groomers, and fitness studios.

## The 3-3-3 Rule: Quick Summary

The framework rests on three realities about attention and decision-making:

1. **3 seconds to stop**: In any digital environment, you have a 3-second window before someone scrolls past. After that, they're gone.
2. **3 minutes to hold**: Once you've stopped someone, you have roughly 3 minutes of earned attention to build enough interest to justify action.
3. **3 steps to convert**: When someone is ready to act, a conversion path with more than 3 steps will lose a large percentage before they finish.

Each stage has its own tactics — and getting any one wrong breaks the chain.

## Stage 1: 3 Seconds to Capture Attention

Think of everything your potential customer sees before they decide to engage as competing for those first three seconds. This covers:

- The headline of your Google Ad (read in under 2 seconds on a results page)
- The first frame of your Facebook or Instagram video
- Your email subject line (scanned in under 3 seconds)
- Your Google Business Profile listing (your primary photo and star rating are evaluated almost instantly)

**What wins attention in 3 seconds:**
- A specific number ("37 new bookings in one month")
- A question that targets a real frustration ("Why is your salon half-empty on Mondays?")
- A hyperlocal detail ("Manchester coffee shops: your highest-ROI marketing move")
- An unexpected before/after visual

**What loses attention in 3 seconds:**
- Your logo and business name with no context
- Generic adjectives: "professional", "quality", "experienced"
- A stock photo that could belong to any business in any city
- A subject line that tries to be clever instead of specific

The discipline this forces is harsh and useful: if you can't explain the value you offer in the first 8 words, the positioning work isn't done yet.

## Stage 2: 3 Minutes to Build Interest

Once you've earned the click, the tap, or the open, you have roughly 3 minutes before attention fades. Industry data supports this: the average landing page session is 2–3 minutes, the average email read time is around 2.5 minutes, and video watch time on Facebook and Instagram drops sharply after 3 minutes.

In 3 minutes you can cover roughly 600–800 words of copy or a short-form video. Here's how to structure that time:

### The 3-minute content structure

1. **Open with the problem** (30–60 seconds): Describe the situation your customer is in, in their words. "You're spending £400/month on Facebook Ads and getting two enquiries." They should feel understood before they hear about your solution.

2. **Introduce the solution** (60–90 seconds): Lead with the outcome, not your features. "Local salons using micro-influencer partnerships are getting 15–30 new booking enquiries per campaign at zero ad spend." Give them a result to believe in.

3. **Establish credibility** (60 seconds): One specific piece of social proof. A before/after. A real client result. A data point from direct experience. Not five testimonials — one story, told well.

The mistake most local businesses make here is spending all 3 minutes talking about themselves. "We've been in business for 14 years and pride ourselves on quality service" is not credibility in the 3-minute window. It's noise.

## Stage 3: 3 Steps to Convert

You've stopped the scroll. You've built interest. Now they're ready to act — and this is where most local business websites destroy the conversion.

The 3-step rule is simple: your conversion path should require no more than 3 actions from "I'm ready" to "Done."

**Bad conversion path (7 steps):**

1. See Google Ad
2. Land on homepage
3. Navigate to Services page
4. Click Contact in the nav
5. Fill contact form with 8 fields
6. Check email for confirmation
7. Reply to confirm appointment

**Good conversion path (3 steps):**

1. See Google Ad
2. Land on focused page with embedded booking widget
3. Book and receive instant confirmation

Every additional step loses 20–30% of potential conversions. Not because people don't want what you offer — because friction at the decision moment destroys intent.

**The 3-step model by business type:**

- Coffee shops: Google Maps → Your profile → Get directions or Website
- Hair salons: Ad or Instagram → Booking page → Confirm appointment
- Pet groomers: Google Search → Ad → Call (call extensions can reduce this to 2)
- Fitness studios: Facebook Lead Ad → 3-field form → Trial class confirmation

## Applying 3-3-3 to Specific Marketing Channels

### Google Ads

**3 seconds**: Your headline must mirror the search intent word-for-word. "Hair Salon Edinburgh" beats "Premium Hair Services in Edinburgh's West End". Match the query first, then differentiate.

**3 minutes**: Your landing page. One headline, one offer, one CTA. No navigation bar. No multiple service options. Remove every element that doesn't lead directly to the conversion action.

**3 steps**: Search → Ad click → Landing page → Call or book.

### Email Marketing

**3 seconds**: Subject line. 6–8 words. One specific benefit or direct question. Avoid: "Spring Newsletter — Check Out What's New". Use: "How to add 10 bookings this Tuesday".

**3 minutes**: Email body. 400–600 words maximum. One main idea. One CTA. Anyone who wants more can click through to your article or landing page.

**3 steps**: Open → Read → Click CTA → Land on one focused page.

### Social Media (Organic)

**3 seconds**: Hook in the first line of your caption or the first video frame. Instagram hides captions after line 2 — make the first two lines count completely.

**3 minutes**: Your content must be completeable in 3 minutes. A 7-minute Reel loses most viewers. A long caption that takes 5 minutes to read loses most readers. Respect the attention budget.

**3 steps**: See post → Engage → Follow link in bio → Land on your offer page.

## Common Misunderstandings About the 3-3-3 Rule

**Not the 3-2-2 Facebook Ads method**: The 3-2-2 method is a split-testing structure — 3 creatives × 2 audiences × 2 campaign objectives. It's about ad set architecture, not attention timing.

**Not the rule of 7**: The rule of 7 says customers need 7 brand touchpoints before buying. The 3-3-3 rule operates within a single interaction, not across a campaign timeline. Both are useful — they answer different questions.

**Not a content calendar ratio**: Some marketers use "3-3-3" informally to mean 3 educational : 3 entertaining : 3 promotional posts per month. That's a content mix guideline, not the attention framework described here.

## Your 5-Day 3-3-3 Audit

Want to test this framework without rebuilding your entire marketing?

- **Day 1**: Rewrite your top Google Ad headline to lead with a pain point or specific number in the first 5 words
- **Day 2**: Remove all navigation from your main landing page — one headline, one offer, one CTA only
- **Day 3**: Review your last 5 emails. Did each have exactly one CTA? Did the subject line communicate specific value?
- **Day 4**: Count the steps in your booking or enquiry process. If it's more than 3, cut one.
- **Day 5**: Look at your most recent social post. Would someone pause on it within 3 seconds? Rewrite the first line if not.

Most local businesses find at least one stage where they're losing customers to friction. Fixing a single step in the conversion path consistently generates more revenue than adding a new marketing channel.

## Frequently Asked Questions

### What is the 3-3-3 rule in marketing?

The 3-3-3 rule in marketing is a framework: you have 3 seconds to capture attention, 3 minutes to build interest, and 3 action steps to convert a potential customer. It applies to Google Ads, email, social media, and landing pages.

### Does the 3-3-3 rule work for small local businesses?

Yes — local businesses often benefit more from the 3-3-3 framework than large brands. Small ad budgets punish wasted attention. Tightening your hook and removing friction from your conversion path has immediate, measurable impact on Google Ads and Meta campaigns.

### How is the 3-3-3 rule different from the rule of 7?

The rule of 7 describes how many touchpoints a customer needs before purchasing (7 brand encounters). The 3-3-3 rule describes what must happen within a single interaction. They work together: use the rule of 7 to plan your overall channel mix, and the 3-3-3 rule to optimise each individual touchpoint.

### What is the 3-2-2 method in Facebook ads?

The 3-2-2 Facebook ads method is a structured testing framework: run 3 creative versions against 2 audience segments using 2 campaign objectives. It's an A/B testing approach designed to find your best-performing ad combination.

### How do I apply the 3-3-3 rule to email marketing?

For email: invest the 3 seconds in your subject line (6–8 words, one specific benefit), use the 3 minutes on a 400–600 word email body with a single message and one CTA, and ensure the 3 conversion steps are: open email → read → click to a focused landing page.
    `,
  },
  "influencer-marketing-for-hair-salons": {
    title: "Influencer Marketing for Salons: How to Get Clients Through Beauty Creators in 2026",
    excerpt:
      "Influencer marketing for salons is up 650% in search interest. Here's the complete strategy: how to find local creators, what to offer, what content to request, and how to track results.",
    category: "Hair Salons",
    date: "May 14, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
    content: `
Searches for "influencer marketing for salons" have increased over **650%** in the past 12 months — making it one of the fastest-growing marketing strategies for local hair and beauty businesses. Yet most salon owners either assume it's only for large brands, or they've attempted it once with the wrong creator and got nothing.

This guide covers the full strategy: finding the right local beauty creators, structuring the deal, briefing the content, and tracking what actually drives bookings. Done well, micro-influencer partnerships generate 15–40 new booking enquiries per campaign at zero or minimal cost.

## Why Influencer Marketing Works So Well for Salons

Hair and beauty services are inherently visual, personal, and trust-dependent. Choosing a new salon means trusting a stranger with your appearance — and that trust is much easier to build through a real person's recommendation than through any paid ad.

When a local creator with 8,000 followers posts her balayage reveal and tags your salon, her audience trusts that endorsement in a way they'll never trust your Facebook ad.

Three factors make this especially powerful for salons right now:

1. **Visual platforms are perfect for hair content**: Before/after transformations are the highest-engagement format on both Instagram Reels and TikTok. Hair reveals get saved, shared, and commented on at rates most content never achieves.

2. **Micro-influencers outperform macro-influencers for local conversion**: A creator with 7,000 genuinely local followers drives more bookings than a national influencer with 500,000 spread across the country. Local concentration is the value, not raw follower count.

3. **The space is still underpriced**: Most local salons haven't adopted this yet. Creators willing to work with local businesses are affordable, often open to service trade partnerships, and genuinely interested in producing beauty content.

## Choosing the Right Type of Creator

Before reaching out to anyone, decide which tier makes sense for your current goals and budget:

### Nano-influencers (1,000–10,000 followers)

- Typically local, often personally known by many followers
- Engagement rates of 5–10% (vs 1–2% for large accounts)
- Usually happy to work in exchange for free services alone
- Best for: organic word-of-mouth amplification, local awareness, content that looks authentic rather than sponsored

### Micro-influencers (10,000–50,000 followers)

- More polished content, more consistent posting schedule
- May expect a small fee (£75–£250) plus complimentary services
- Best for: launching a new service, seasonal promotions, reaching adjacent audiences
- The sweet spot for most independent salons

### Mid-tier influencers (50,000–500,000 followers)

- Typically have formal rate cards or management
- Rarely cost-effective for local service businesses
- Exception: if they're genuinely based in your city and post heavily local content

The most common mistake salons make is targeting the biggest local account they can find. A beauty creator with 80,000 followers may have built much of that audience outside your city — particularly if they gained momentum on TikTok. Always verify audience location data before committing to a paid partnership.

## How to Find Local Beauty Creators

You don't need an agency or influencer platform to start. These methods work immediately:

### Method 1: Instagram Hashtag and Location Search

Search your city name combined with hair and beauty terms: #manchesterhair, #londonsalon, #edinburghbeauty, #birminghamhairstylist. Browse both the Top and Recent tabs. Click through profiles appearing in multiple location results. Look for genuine engagement — real comment conversations, not just emoji chains.

### Method 2: Your Own Tagged Posts

Check who's already tagging your salon. A customer with 800 followers who posts genuine enthusiasm about your work is a nano-influencer partner ready to activate. They already trust you — they just need an invitation.

### Method 3: Competitor Tagged Posts

Look at posts that tag your top local competitors. Creators who post about other salons in your area are already comfortable with this type of content and understand how it works.

### Method 4: TikTok Local Search

Search "[your city] hair" or "[your city] haircut" on TikTok, sorted by most recent. Creators who consistently appear in local hair content are exactly who you want for your first campaign.

## Structuring the Deal

There are three main formats for salon influencer partnerships:

### Trade Partnership (Free Services for Content)

You provide: one service (cut, colour, or treatment) at its market value.

They provide: one Instagram post plus Stories, or one TikTok video.

This works well with nano and micro-influencers who genuinely love beauty content. Your cost is the service at cost price — materials plus 1–2 hours of a stylist's time. The return can be 5–25 new booking enquiries when the creator has real local reach.

Even for trade deals, use a simple written agreement. Specify: what content will be created, the posting timeline, that your account will be tagged, and that the partnership will be disclosed (required by advertising standards in the UK, US, and most English-speaking markets).

### Paid Partnership

Micro-influencers with 15,000+ genuinely local and engaged followers can command £150–£450 per sponsored post, plus a complimentary service. This is reasonable when their engagement is authentic.

Calculate the rough return: a £200 partnership that generates 10 new bookings at an average value of £90 each = £900 revenue from a £200 spend. Most paid advertising can't reliably match that ratio.

### Ongoing Ambassador Relationship

Instead of single posts, offer a monthly service credit (£60–£120) in exchange for a commitment to post once or twice each month. This creates consistent, compounding visibility and builds a long-term brand association.

Ambassador arrangements work particularly well for salons building a signature aesthetic — lived-in colour, precision cuts, bridal work. If your ambassador consistently shows that specific style on her own hair, you come to own that position in your local market.

## Briefing the Content

Left entirely to the creator, you'll get content that performs well for their audience but may not drive bookings for you. You need content that achieves both.

**Formats that drive salon bookings:**

**The transformation reveal**: Before → process → after. This is the highest-performing format for salon content on Reels and TikTok. The reveal moment generates saves and shares at a rate other content rarely matches. The caption should include your salon name, location tag, and a prompt to book.

**The "I've been coming here for X months" post**: Long-term trust-building content. The creator shows her consistent results and recommends your salon as her go-to. Works especially well in Stories where it feels personal rather than promotional.

**The "what I asked for vs. what I got" format**: A relatable, often humorous take where both versions are positive. This format trends regularly on TikTok and generates strong comment engagement from people asking where to book.

**Requirements to specify in your brief:**

- Your salon account tagged in both the post caption and the visual
- Your location tagged (so the post appears in local geo searches)
- The specific service and/or stylist name mentioned
- A clear CTA: "Link in bio to book" or your booking platform name
- Partnership disclosure: #ad, #gifted, or #sponsored as required
- You receive the content to repost within 48 hours of it going live

## Tracking What Actually Drives Bookings

Unlike paid ads, influencer campaigns don't give you a dashboard. But you can measure results with reasonable confidence:

**Booking source tracking**: Add "How did you hear about us?" to your booking form or ask at checkout. A spike in "Instagram" or "TikTok" responses in the week after a campaign is directly attributable.

**Instagram Insights**: Check your profile visits for the posting week vs. the week before. A 40–80% increase is a meaningful signal of reach.

**Custom booking link**: If your booking system supports UTM parameters, create a creator-specific link for their bio. You'll see exactly how many bookings came through their referral.

**Follower growth rate**: New followers on posting day vs. your average. Not the primary goal, but a useful measure of reach and audience response.

Accept that some attribution will be imperfect. A person might see a creator's post, save it, then book two weeks later. Or they'll google your salon name after seeing it tagged. Influencer campaigns have a halo effect on organic search and word-of-mouth that doesn't show up cleanly in any single metric.

## Mistakes That Sink Salon Influencer Campaigns

**Choosing by follower count alone**: Engagement rate and local audience concentration matter far more than total followers. An account with 6,000 followers at 8% engagement drives more local bookings than one with 40,000 at 0.9%.

**No written agreement**: Even for trade deals, a one-page summary of what each party will provide protects both sides. Rare, but creators who take the free service and never post are hard to pursue without documentation.

**One post and done**: A single post builds awareness but rarely builds sufficient trust to drive bookings in volume. Target partnerships that produce 3–6 pieces of content minimum — either in one agreement or through an ongoing relationship.

**Ignoring the comment section**: When an influencer's followers ask "where did you get this done?" in the comments, that's where the actual booking conversions happen. Monitor those threads and ensure your salon details are visible.

**Mismatched values and aesthetic**: A creator who posts about international travel, luxury brands, and high-end lifestyle has a different audience than one who posts about local gems and small businesses. Match the creator's aesthetic and values to your salon's positioning.

## Scaling What Works

Once you've run 2–3 campaigns and found a creator or content format that reliably drives bookings:

- Establish 3–5 concurrent ambassador relationships, rotating to cover slow periods
- Align influencer posting dates with your quietest booking windows (typically midweek, post-summer, January)
- Build a library of creator content to repost as organic social proof on your own accounts
- Consider promoting the best posts as paid Facebook or Instagram ads — with the creator's permission. User-generated content consistently outperforms professional ad creative for local service businesses

The end goal is a self-sustaining social proof engine: a steady flow of real people posting real results from your salon, creating the kind of trust that no advertising budget alone can replicate.

## Frequently Asked Questions

### What is influencer marketing for hair salons?

Influencer marketing for salons means partnering with local social media creators — typically on Instagram or TikTok — to promote your services to their audience. The creator posts content (usually a hair transformation) showing their experience at your salon, tagging your business and exposing you to their local following.

### How much does influencer marketing cost for a salon?

For nano-influencers (under 10,000 followers), the typical cost is one complimentary service at your cost price. Micro-influencers (10,000–50,000 followers) may charge £100–£350 plus a free service. Ongoing ambassador arrangements typically run £50–£120/month in service credit in exchange for regular content.

### How do I find influencers for my hair salon?

Search Instagram hashtags combining your city and hair terms (#manchesterhair, #londonsalon), browse posts that tag competitors, and search TikTok for local hair content sorted by recent. Look for creators with 1,000–30,000 genuinely local followers and engagement rates above 4%.

### What content should I ask an influencer to create for my salon?

A transformation post (before and after), a Stories sequence showing the appointment process, and a caption mentioning your location with a booking CTA. Require partnership disclosure (#ad or #gifted) and the ability to repost the content on your own channels.

### Does influencer marketing work for independent salons?

Yes — often more effectively than for large chains. Independent salons benefit from the authenticity that personal recommendations carry, and micro-influencer partnerships are proportionally cheaper and more geographically targeted than most paid advertising options.
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
