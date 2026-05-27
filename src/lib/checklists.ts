export type ChecklistDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type ChecklistCategory = "SEO" | "Ads" | "Social" | "Website" | "Email" | "Niche";

export interface ChecklistSection {
  title: string;
  items: string[];
}

export interface Checklist {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: ChecklistCategory;
  timeEstimate: string;
  difficulty: ChecklistDifficulty;
  sections: ChecklistSection[];
}

export const checklists: Checklist[] = [
  {
    slug: "google-business-profile",
    title: "Google Business Profile Optimization Checklist",
    description:
      "Fully optimize your GBP listing to dominate local search results and Google Maps. Every item here directly impacts your local pack ranking.",
    icon: "☕",
    category: "SEO",
    timeEstimate: "45 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "Profile Completeness",
        items: [
          "Claim and verify your Google Business Profile listing (postcard, phone, or email)",
          "Set your exact business name — match it precisely to your signage and website",
          "Choose your primary category (e.g., 'Coffee Shop', 'Hair Salon') — this is the most important ranking factor",
          "Add all relevant secondary categories (e.g., 'Café', 'Espresso Bar')",
          "Enter your exact business address matching USPS standards",
          "Set your precise service area if you serve customers at their location",
          "Add your local phone number (not a toll-free number)",
          "Link to your website homepage or a dedicated landing page",
        ],
      },
      {
        title: "Business Description & Attributes",
        items: [
          "Write a 250-word business description that naturally includes your top 3 keywords",
          "Include your city name and neighborhood in the description",
          "Mention your unique selling proposition (e.g., specialty coffee, award-winning stylists)",
          "Enable all applicable attributes (e.g., 'Women-led', 'Veteran-owned', 'Black-owned', 'Outdoor seating')",
          "Add accessibility attributes (wheelchair accessible, restrooms, parking)",
          "Set 'From the business' highlights — choose options that differentiate you",
          "Add your founding year in the 'Opening date' field",
        ],
      },
      {
        title: "Photos & Visual Content",
        items: [
          "Upload a high-resolution logo (250×250 px minimum, square format)",
          "Upload a compelling cover photo (1080×608 px) showing your storefront or interior",
          "Add at least 10 photos of your interior, exterior, products, and team",
          "Upload photos with natural lighting — avoid heavily filtered images",
          "Add a 30-second interior and exterior video walkthrough",
          "Post photos regularly (at least 1–2 new photos per week)",
          "Tag your photos with location data (geotagged images boost local signals)",
        ],
      },
      {
        title: "Posts, Reviews & Q&A",
        items: [
          "Publish a Google Post every week (offers, events, or updates — 150–300 words)",
          "Set up automated review request emails/SMS after every transaction",
          "Respond to every Google review within 24 hours — positive and negative",
          "Use keywords naturally in your responses to reviews",
          "Seed your Q&A section with the top 5 questions your customers ask most",
          "Answer all customer questions in the Q&A section within 48 hours",
          "Add your menu or services list directly in GBP using the Products/Services section",
          "Enable messaging and respond within 2 hours to maintain your response badge",
        ],
      },
    ],
  },

  {
    slug: "local-seo-audit",
    title: "Local SEO Audit Checklist",
    description:
      "Run a comprehensive local SEO audit to identify gaps and opportunities. Use this quarterly to maintain and grow your local search rankings.",
    icon: "📍",
    category: "SEO",
    timeEstimate: "60 min",
    difficulty: "Intermediate",
    sections: [
      {
        title: "NAP Consistency & Citations",
        items: [
          "Verify your Name, Address, and Phone (NAP) is identical across all online listings",
          "Audit citations on Yelp, Bing Places, Apple Maps, Facebook, and YellowPages",
          "Submit your business to the top 50 local citation sites using BrightLocal or Whitespark",
          "Remove or correct any duplicate listings found on Google, Yelp, or directories",
          "Ensure your address format is consistent (e.g., 'St' vs 'Street') everywhere",
          "Check that your website footer, contact page, and header all match your GBP listing",
        ],
      },
      {
        title: "On-Page Local SEO",
        items: [
          "Include your city + service keyword in your homepage H1 (e.g., 'Hair Salon in Austin, TX')",
          "Add your full address in text on the Contact page (not just an image)",
          "Embed a Google Maps widget on your Contact page",
          "Create location-specific landing pages if you serve multiple cities",
          "Add LocalBusiness schema markup to your homepage (name, address, phone, hours, geo coordinates)",
          "Include your city and state in your page titles and meta descriptions",
          "Add 'Near me' content naturally into your service descriptions",
          "Internally link from every blog post to your primary service page",
        ],
      },
      {
        title: "Technical Local SEO",
        items: [
          "Test your site speed — aim for under 3 seconds on mobile (use PageSpeed Insights)",
          "Ensure your site is fully mobile-responsive and passes Google's Mobile-Friendly Test",
          "Verify your XML sitemap is submitted to Google Search Console",
          "Check for crawl errors in Google Search Console > Coverage report",
          "Fix all broken internal and external links (use Screaming Frog or Ahrefs)",
          "Add hreflang tags if you serve both US and international customers",
          "Ensure your robots.txt is not blocking important pages",
          "Implement HTTPS across your entire site — no mixed content warnings",
        ],
      },
      {
        title: "Reviews & Reputation",
        items: [
          "Count your current Google reviews and compare to top 3 local competitors",
          "Calculate your average star rating (aim for 4.5+ to be competitive)",
          "Check review velocity — are you getting at least 4–5 new reviews per month?",
          "Audit your reviews on Yelp, Facebook, TripAdvisor, and industry-specific platforms",
          "Identify your most common review keywords — use them in your page content",
          "Set up Google Alerts for your business name to monitor new mentions",
          "Respond publicly to all negative reviews with empathy and a resolution offer",
          "Build a dedicated 'Reviews' or 'Testimonials' page on your website",
        ],
      },
    ],
  },

  {
    slug: "google-ads-setup",
    title: "Google Ads Setup Checklist for Local Businesses",
    description:
      "Launch a high-performing Google Ads campaign for your local business. Covers account setup, targeting, ad copy, bidding, and tracking — step by step.",
    icon: "🎯",
    category: "Ads",
    timeEstimate: "90 min",
    difficulty: "Intermediate",
    sections: [
      {
        title: "Account & Campaign Setup",
        items: [
          "Create a Google Ads account linked to your Google Business Profile and Analytics",
          "Set your billing threshold and payment method before launching",
          "Choose 'Search' campaign type — avoid Smart campaigns when starting out",
          "Set campaign goal to 'Leads' or 'Website traffic' based on your objective",
          "Enable 'Search Network' only — uncheck Display Network for focused reach",
          "Set your geographic targeting to a 5–15 mile radius around your location",
          "Set your bid strategy to 'Maximize Clicks' initially, then switch to Target CPA after 30 conversions",
          "Set a daily budget — start at $10–$30/day to gather data safely",
        ],
      },
      {
        title: "Keyword Research & Strategy",
        items: [
          "Use Google Keyword Planner to find local keywords (include city name in queries)",
          "Build a list of 20–30 keywords — include '[service] near me', '[service] in [city]' variations",
          "Organize keywords into tight ad groups (max 10–15 keywords per group)",
          "Add exact match and phrase match keywords — avoid broad match until you're experienced",
          "Build a negative keyword list (e.g., 'free', 'DIY', 'jobs', 'salary', 'how to')",
          "Add competitor brand names as separate ad group (optional — check policy)",
        ],
      },
      {
        title: "Ad Copy & Extensions",
        items: [
          "Write 3 responsive search ad headlines per ad group (15 options, each under 30 characters)",
          "Include your city name and primary keyword in at least 2 headlines",
          "Write a clear value proposition headline (e.g., '5-Star Reviews · Open 7 Days')",
          "Add a strong call-to-action headline (e.g., 'Book Online Today', 'Call for a Free Quote')",
          "Write 4 description lines — include benefits, trust signals, and your USP",
          "Add all 6 asset extensions: Sitelinks, Callouts, Call, Location, Image, Structured Snippets",
          "Set your final URL to a relevant landing page — not just your homepage",
        ],
      },
      {
        title: "Conversion Tracking & Launch",
        items: [
          "Install Google Ads conversion tracking tag via Google Tag Manager",
          "Track phone calls as conversions (Google forwarding number OR on-site call tracking)",
          "Track form submissions as conversions (thank-you page URL trigger)",
          "Import Google Analytics goals into Google Ads as secondary conversions",
          "Set up audience lists (website visitors, customer match) for future retargeting",
          "Schedule ads to run only during your business hours + 2 hours before close",
          "Enable ad rotation: 'Optimize — prefer best-performing ads'",
          "Review the Search Terms report weekly and add negatives continuously",
        ],
      },
    ],
  },

  {
    slug: "meta-ads-setup",
    title: "Meta/Facebook Ads Setup Checklist",
    description:
      "Build and launch a Meta Ads campaign that drives real customers to your local business. Covers pixel setup, audiences, creatives, and campaign structure.",
    icon: "📱",
    category: "Ads",
    timeEstimate: "75 min",
    difficulty: "Intermediate",
    sections: [
      {
        title: "Account & Pixel Setup",
        items: [
          "Create a Meta Business Manager account at business.facebook.com",
          "Add your Facebook Page and Instagram account to Business Manager",
          "Create an Ad Account and set your time zone and currency correctly",
          "Install the Meta Pixel on your website via the Events Manager",
          "Set up Conversions API (CAPI) server-side events for iOS 14+ accuracy",
          "Verify your domain in Business Manager (required for pixel event tracking)",
          "Configure standard events: PageView, ViewContent, Lead, Purchase",
          "Test events with the Pixel Helper Chrome extension before going live",
        ],
      },
      {
        title: "Audience Targeting",
        items: [
          "Create a geo-targeted custom audience: 5–10 mile radius around your business",
          "Build a Custom Audience from your customer email list (minimum 1,000 emails)",
          "Create a 1% Lookalike Audience from your customer email list",
          "Create retargeting audiences: website visitors (30 days), video viewers (25%+), IG engagers",
          "Define your interest-based cold audience — layer interests, behaviors, and demographics",
          "Set age and gender targeting based on your actual customer demographics",
          "Exclude your existing customers from cold prospecting campaigns",
        ],
      },
      {
        title: "Creative & Ad Copy",
        items: [
          "Design 3 creative variations per ad set (test image vs. video vs. carousel)",
          "Use 1080×1080 images for Feed and 1080×1920 for Stories/Reels",
          "Lead with your strongest hook in the first 3 seconds of video ads",
          "Write primary text that leads with a pain point or desire (not a feature)",
          "Include social proof (e.g., '500+ 5-star reviews in [City]')",
          "Add a clear, specific CTA button matching your objective (e.g., 'Book Now', 'Get Offer')",
          "Test UGC-style (user-generated content) creatives against polished branded content",
          "Refresh creatives every 4–6 weeks to avoid ad fatigue",
        ],
      },
      {
        title: "Campaign Structure & Launch",
        items: [
          "Use the Campaign Budget Optimization (CBO) structure for efficient spend distribution",
          "Set campaign objective to 'Leads' or 'Conversions' (not Reach or Traffic)",
          "Launch with 3 ad sets: cold interest targeting, lookalike audience, retargeting",
          "Set a minimum $10/day per ad set to exit the learning phase within 7 days",
          "Set your attribution window to '7-day click, 1-day view' for most campaigns",
          "Schedule your ads to run 24/7 initially — optimize dayparting after 30 days of data",
          "Monitor frequency — pause or refresh creatives when frequency exceeds 3.5",
          "Review Cost per Lead, CTR, and ROAS weekly for the first 60 days",
        ],
      },
    ],
  },

  {
    slug: "website-cro",
    title: "Website Conversion Rate Optimization Checklist",
    description:
      "Turn more website visitors into paying customers. This CRO checklist covers every element of a high-converting local business website.",
    icon: "🖥️",
    category: "Website",
    timeEstimate: "60 min",
    difficulty: "Intermediate",
    sections: [
      {
        title: "Homepage & First Impression",
        items: [
          "State what you do and where in the above-the-fold hero section (within 5 seconds of landing)",
          "Include your city/area name in the main H1 heading",
          "Show your phone number prominently in the top navigation bar — click-to-call on mobile",
          "Display a primary CTA button above the fold ('Book Now', 'Get a Free Quote', 'Call Us')",
          "Show trust signals above the fold: star rating, review count, or years in business",
          "Load your homepage above-the-fold content in under 2 seconds on mobile",
          "Ensure your logo links back to the homepage",
          "Remove all carousels/sliders — they reduce conversions on local business sites",
        ],
      },
      {
        title: "Trust & Social Proof",
        items: [
          "Display your Google star rating prominently (widget or static badge with review count)",
          "Add 3–5 text testimonials with the reviewer's first name, photo, and neighborhood",
          "Include a 'Before and After' section if relevant to your service (salons, cleaners, etc.)",
          "Show any media mentions, awards, or certifications with logos",
          "Display your BBB rating, industry memberships, or professional certifications",
          "Add a Google Maps embed showing your location on the Contact page",
          "Include a 'Meet the Team' or 'About the Owner' section with real photos",
        ],
      },
      {
        title: "Calls to Action & Lead Capture",
        items: [
          "Have a visible CTA button in every section (not just the hero)",
          "Use a sticky header on mobile with your phone number and a CTA button",
          "Add a contact form on every service page — not just the Contact page",
          "Keep contact forms short: Name, Phone/Email, and Message only (3 fields max converts best)",
          "Add a live chat widget (Tidio, Intercom, or Facebook Messenger plugin)",
          "Create an exit-intent popup with a special offer for first-time visitors",
          "Add a floating 'Book Now' or 'Call Us' button fixed to the bottom of mobile screens",
        ],
      },
      {
        title: "Mobile Experience & Speed",
        items: [
          "Test your site on iPhone and Android — all buttons and forms must work perfectly",
          "Ensure all tap targets are at least 44×44 px (thumbs can't tap tiny buttons)",
          "Compress all images — use WebP format and lazy loading for images below the fold",
          "Eliminate render-blocking scripts — defer non-critical JavaScript",
          "Score 85+ on Google PageSpeed Insights for mobile",
          "Ensure your booking or contact form works without errors on mobile browsers",
          "Test your site on 3G connection speed — it must still be usable",
          "Verify all phone numbers are formatted as clickable tel: links on mobile",
        ],
      },
    ],
  },

  {
    slug: "email-marketing",
    title: "Email Marketing Setup Checklist",
    description:
      "Build and launch an email marketing system that turns one-time customers into regulars. Everything from list building to automation sequences.",
    icon: "✉️",
    category: "Email",
    timeEstimate: "90 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "List Building & Platform Setup",
        items: [
          "Choose an email platform: Klaviyo (ecommerce), Mailchimp (beginners), or ActiveCampaign (advanced)",
          "Connect your email platform to your website and POS system",
          "Add a signup form to your homepage, footer, and blog sidebar",
          "Create a lead magnet to incentivize signups (e.g., '10% off your first visit', 'Free guide', 'Monthly giveaway entry')",
          "Import your existing customer list and segment by purchase history",
          "Set up double opt-in to keep your list clean and compliant (CAN-SPAM / GDPR)",
          "Add your business address and unsubscribe link to every email template (legally required)",
          "Set up a branded sending domain (yourname@yourbusiness.com) — not Gmail or Yahoo",
        ],
      },
      {
        title: "Automated Email Sequences",
        items: [
          "Create a welcome sequence: 3 emails over 7 days introducing your brand, story, and best offer",
          "Build a post-purchase/visit follow-up email: send 24 hours after service with a review request link",
          "Set up a win-back campaign: email customers who haven't visited in 60 days with a special offer",
          "Create a birthday email with a discount (collect birthdays on your signup form)",
          "Build an abandoned booking reminder: email within 2 hours of incomplete booking/inquiry",
          "Set up a referral program email: reward customers who refer friends with a discount",
          "Create a VIP tier welcome email when customers hit a purchase threshold",
        ],
      },
      {
        title: "Campaigns & Optimization",
        items: [
          "Send a monthly newsletter (first Tuesday or Thursday achieves best open rates for local businesses)",
          "Segment campaigns by customer type: new, regular, lapsed, VIP",
          "A/B test subject lines on every campaign — minimum 20% list size per variant",
          "Aim for 35%+ open rate for local business emails (industry average is 21%)",
          "Monitor click-through rate (CTR) — aim for 3%+ per campaign",
          "Review unsubscribe rate — if above 0.5%, your content is misaligned with audience expectations",
          "Use preview text (the gray line under the subject line) — always write it intentionally",
          "Include one primary CTA per email — don't ask subscribers to do 3 different things",
          "Send a seasonal campaign for every major holiday relevant to your business",
          "Track revenue per email sent — this is the most important metric for local businesses",
        ],
      },
    ],
  },

  {
    slug: "social-media-content",
    title: "Social Media Content Strategy Checklist",
    description:
      "Build a sustainable social media content system that grows your following and drives real foot traffic. No guesswork — just a clear, repeatable framework.",
    icon: "📸",
    category: "Social",
    timeEstimate: "60 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "Profile & Brand Setup",
        items: [
          "Optimize your Instagram bio: what you do + who you serve + your city + CTA (link in bio)",
          "Use your exact business name as your Instagram handle (no random numbers or underscores)",
          "Add your address and contact info to your Facebook Page — this helps local search",
          "Set up a Linktree or similar link-in-bio tool with links to booking, website, and contact",
          "Use consistent profile photos across all platforms — your logo or a professional headshot",
          "Claim your Facebook username (facebook.com/yourbusinessname) for easy sharing",
          "Connect Instagram to Facebook so posts can be shared simultaneously",
          "Add a 'Book Now' or 'Contact' button to your Facebook Page",
        ],
      },
      {
        title: "Content Planning & Creation",
        items: [
          "Build a content calendar: plan 4 weeks of posts in advance on a Google Sheet or Notion",
          "Use the 80/20 rule: 80% value/entertainment content, 20% promotional",
          "Batch-create content: shoot 30 photos and 5 videos in one 2-hour session each month",
          "Plan content pillars: rotate between Behind-the-Scenes, Educational, Customer Spotlights, and Offers",
          "Shoot all photos with natural light — position your subject facing a window",
          "Always capture video in vertical format (9:16) for Reels and TikTok",
          "Use location tags and local hashtags on every post (e.g., #ChicagoHairSalon)",
          "Repurpose every piece of content: one video → Reel, Story, TikTok, YouTube Short",
          "Post Instagram Reels 3–4× per week for maximum organic reach",
          "Use the Carousel format for educational content — carousels get saved more than static posts",
        ],
      },
      {
        title: "Engagement & Growth",
        items: [
          "Reply to every comment on your posts within 2 hours of posting",
          "Respond to every DM within 24 hours — use Quick Replies for common questions",
          "Engage with 10–15 local accounts daily (like and leave genuine comments) to grow reach",
          "Tag your location in every post and Story",
          "Feature customers in your content (with permission) — this drives word-of-mouth",
          "Run a monthly giveaway (e.g., 'Win a free [service]') — require a follow and tag to enter",
          "Track weekly: follower growth, post reach, Story views, DMs, and website link clicks",
          "Review your top 5 performing posts monthly and create more content in that style",
        ],
      },
    ],
  },

  {
    slug: "coffee-shop-marketing",
    title: "Coffee Shop Marketing Checklist",
    description:
      "The complete marketing playbook for independent coffee shops and cafés. Covers every channel you need to win regulars, rank on Google Maps, and stand out from chains.",
    icon: "☕",
    category: "Niche",
    timeEstimate: "90 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "Local Presence & Discoverability",
        items: [
          "Claim and fully optimize your Google Business Profile (see GBP checklist for details)",
          "Add your café to Yelp, TripAdvisor, Foursquare, and OpenTable (if you serve food)",
          "Ensure your café is listed on Google Maps with accurate hours, seating, and Wi-Fi attributes",
          "Submit to local neighborhood directories and 'best coffee in [city]' roundup sites",
          "Partner with a local food blogger for a feature post (offer a free tasting in exchange)",
          "Get listed on apps like Yelp, Google Maps, and Apple Maps with your specialty drink menu",
        ],
      },
      {
        title: "In-Store & Loyalty Marketing",
        items: [
          "Launch a digital loyalty program (Stamp Me, Loyalty Lion, or a simple punch card via app)",
          "Set up a table tent or counter card with a QR code to your loyalty program signup",
          "Create a 'secret menu' item shared only with loyalty members — drives sign-ups and social sharing",
          "Train staff to ask for first-time customers' names and email at the point of purchase",
          "Design a seasonal menu with a limited-time item that creates urgency and social buzz",
          "Create a branded coffee cup sleeve or bag with your Instagram handle and a hashtag",
          "Set up a 'pay it forward' board — it drives social shares and community goodwill",
        ],
      },
      {
        title: "Social Media & Content",
        items: [
          "Post a daily 'coffee of the day' or 'barista special' Story on Instagram each morning",
          "Create a branded hashtag (#YourCoffeeShopName) and feature it prominently in-store",
          "Partner with local micro-influencers (1,000–20,000 followers) for monthly café visits",
          "Post Reels of latte art, pour-over process, or barista training — these get massive reach",
          "Feature your regulars on your Instagram — 'Customer Spotlight' posts drive loyalty and shares",
          "Run a 'Tag us for 10% off your next drink' campaign — incentivizes UGC creation",
          "Host monthly events: live music nights, open mic, trivia, or coffee tastings",
        ],
      },
      {
        title: "Paid Ads & Email",
        items: [
          "Run Google Ads targeting '[coffee shop near me]' and '[best café in [city]]' keywords",
          "Run Meta Ads to people within a 2-mile radius with interest in coffee, remote work, or local businesses",
          "Collect emails at checkout and send a monthly newsletter: new menu items, events, and a loyalty offer",
          "Retarget website visitors with Meta Ads featuring your most Instagrammable drinks",
          "Create a 'refer a friend' program: give $2 credit when a friend signs up for loyalty",
          "Run Google Maps ads ('Local campaigns') to appear at the top of Google Maps searches",
        ],
      },
    ],
  },

  {
    slug: "hair-salon-marketing",
    title: "Hair Salon Marketing Checklist",
    description:
      "A complete marketing system for hair salons, barbershops, and beauty studios. Fill your appointment book, reduce no-shows, and build a loyal clientele.",
    icon: "💇",
    category: "Niche",
    timeEstimate: "90 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "Online Presence & Booking",
        items: [
          "Set up online booking with Vagaro, Square Appointments, or Fresha — embed it on your website",
          "Add a 'Book Now' button directly on your Google Business Profile",
          "Ensure your GBP shows all services, pricing, and stylist photos",
          "Create an Instagram portfolio page: every service has its own 'Saved' Story Highlight (Cuts, Color, Blowouts, etc.)",
          "Add your salon to StyleSeat, Booksy, Vagaro marketplace, and Yelp with current availability",
          "Respond to every new review on Google and Yelp within 24 hours",
          "Add a real-time availability widget to your website so clients can book without calling",
        ],
      },
      {
        title: "Client Retention & Rebooking",
        items: [
          "Send an automated rebooking reminder 3 weeks after a client's appointment",
          "Send a confirmation text 48 hours before every appointment with a cancel/reschedule link",
          "Send a 'how does your hair look?' follow-up 5 days after a color or chemical service",
          "Create a client card system — track each client's color formula, cut preferences, and allergies",
          "Launch a referral program: give clients a $15 credit for every new client they refer",
          "Offer a 'package deal' (e.g., 3 blowouts for the price of 2) to increase rebooking rate",
          "Build a VIP program for clients who visit 6+ times per year — exclusive perks and early access to new stylists",
        ],
      },
      {
        title: "Social Media & Content",
        items: [
          "Post before/after transformation photos with permission — these are your highest-converting content",
          "Film 15-second Reels of color reveals, cut transformations, or styling tips",
          "Share stylist spotlights: 'Meet [Name] — she specializes in [service]'",
          "Create 'Hair Tips' carousel posts: '5 mistakes that damage colored hair'",
          "Use trending audio on Reels — it significantly increases algorithmic reach",
          "Run a 'Free blowout' contest: follow + tag a friend to win",
          "Collaborate with a local makeup artist or esthetician for cross-promotional content",
        ],
      },
      {
        title: "Paid Advertising & Local SEO",
        items: [
          "Run Google Ads targeting '[hair salon in {city}]', '[balayage near me]', '[best haircut {city}]'",
          "Target a 5-mile radius on Meta Ads — show before/after photos with a 'Book Now' CTA",
          "Retarget people who visited your booking page but didn't complete a booking",
          "Build a 'new mover' targeting campaign on Facebook — people who just moved to your area need a new salon",
          "Create a Google Ads campaign specifically for 'wedding hair' and 'bridal party' searches",
          "Write a blog post: 'Best Hair Salons in [City] — How to Choose' (include yourself and optimize for local search)",
          "Get featured in local 'best of' lists by reaching out to local city magazines and blogs",
        ],
      },
    ],
  },

  {
    slug: "reputation-management",
    title: "Online Reputation Management Checklist",
    description:
      "Proactively build, monitor, and protect your online reputation. For local businesses, reputation is revenue — this checklist gives you a system to manage it.",
    icon: "⭐",
    category: "SEO",
    timeEstimate: "45 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "Review Generation",
        items: [
          "Ask for a Google review verbally at the end of every positive customer interaction",
          "Send an automated review request SMS within 1 hour of service completion",
          "Create a short review link using Google's Place ID (g.page/[yourbusiness]/review)",
          "Print QR codes linking to your review page and place them at checkout, on receipts, and at tables",
          "Add a 'Leave us a review' link to your email signature and post-service emails",
          "Train all staff to ask for reviews after positive interactions — make it a standard part of checkout",
          "Set a team target: 4 new Google reviews per week — track it at your weekly team meetings",
          "Never incentivize reviews with discounts or gifts — it violates Google's policies",
        ],
      },
      {
        title: "Review Monitoring & Response",
        items: [
          "Set up Google Alerts for your business name, owner name, and common misspellings",
          "Use a reputation tool (BirdEye, Podium, or Grade.us) to monitor all platforms in one dashboard",
          "Respond to every Google review within 24 hours — no exceptions",
          "Respond to every Yelp review — Yelp ranks businesses that engage with reviews higher",
          "For negative reviews: acknowledge, apologize, take it offline (share your phone/email)",
          "Never argue with a reviewer publicly — potential customers read your responses",
          "Flag fake reviews using Google's reporting process — document your evidence",
          "Reply to positive reviews by name: 'Thanks [Name]! We love seeing you every [day].'",
        ],
      },
      {
        title: "Brand Protection & Growth",
        items: [
          "Claim your business name on every major social platform — even if you don't plan to use it",
          "Monitor Yelp, TripAdvisor, Facebook, Angi, HomeAdvisor, Thumbtack, and BBB monthly",
          "Create a 'Social Proof' page on your website featuring your best reviews",
          "Add review schema markup to your website to show star ratings in Google search results",
          "Proactively share your best reviews as social media posts (with permission)",
          "Build a portfolio page with case studies, transformations, or project photos",
          "Respond to all Google Q&A questions to show engagement and control the narrative",
          "Create a crisis response plan: what to do if a major negative review goes viral",
          "Track your Net Promoter Score (NPS) quarterly by surveying customers post-service",
          "Publish a 'Why our customers love us' page that aggregates your best social proof",
        ],
      },
    ],
  },
  {
    slug: "pet-groomer-marketing",
    title: "Pet Groomer Marketing Checklist",
    description:
      "A complete marketing checklist for pet grooming businesses. Build a loyal client base, fill your schedule, and stand out in your local area.",
    icon: "🐾",
    category: "Niche",
    timeEstimate: "60 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "Google & Local Visibility",
        items: [
          "Claim and fully complete your Google Business Profile with every service listed (breed-specific grooming, nail trims, baths, etc.)",
          "Add at least 30 photos: before/after grooms, your grooming station, staff with animals, happy pets",
          "Enable the 'Booking' button on GBP and link it directly to your scheduling system",
          "List every breed you work with in your GBP services — pet owners search by breed",
          "Collect 50+ Google reviews with a specific ask: 'Mention [pet name] and the service'",
          "Add 'pet groomer near me', '[breed] groomer [city]', and 'mobile pet grooming [city]' as keyword targets",
          "Get listed on Yelp, Nextdoor, PetBacker, Rover (for visibility), and local pet directories",
        ],
      },
      {
        title: "Website & Online Booking",
        items: [
          "Your homepage headline should mention your city and top service: 'Professional Dog Grooming in [City]'",
          "Create individual service pages for each grooming service with pricing and photos",
          "Embed your booking calendar on the homepage — minimize clicks to book",
          "Add a 'New Client Special' offer prominently on the homepage",
          "Create a breed gallery showing before/after photos for popular breeds you serve",
          "Include a 'Meet the Groomers' page with bios and certifications",
          "Add a FAQ page addressing: How long does grooming take? What products do you use? Do you take aggressive dogs?",
        ],
      },
      {
        title: "Social Media & Community",
        items: [
          "Post a before/after groom photo every day you're open — these are your highest-performing posts",
          "Create a 'Pet of the Month' feature tagging the owners — they share it with their entire network",
          "Join every local Facebook group for pet owners and introduce yourself (no spam — add value first)",
          "Partner with local vets, dog trainers, and pet stores for referral arrangements",
          "Run a 'Fluffy Friday' contest where followers share pet photos for a free groom prize",
          "Post grooming tips on TikTok and Instagram Reels — 'Signs your dog needs a groom now'",
          "Create a loyalty card: 'Buy 9 grooms, get the 10th free' — digital or physical",
        ],
      },
      {
        title: "Client Retention & Upsells",
        items: [
          "Send automated appointment reminders 48 hours and 2 hours before each groom",
          "Send a rebooking reminder 6–8 weeks after each visit based on breed grooming frequency",
          "Offer a 'Puppy's First Groom' package with a photo and a certificate — parents share this everywhere",
          "Upsell add-on services at checkout: teeth brushing, de-shedding treatment, paw balm",
          "Create a monthly 'Grooming Club' subscription: unlimited baths + one full groom per month",
          "Ask every happy client for a referral: 'We'd love to meet another pet like [pet name]'",
          "Send a holiday card to every active client — handwritten notes create raving fans",
        ],
      },
    ],
  },

  {
    slug: "fitness-studio-marketing",
    title: "Fitness Studio Marketing Checklist",
    description:
      "Grow your gym, yoga studio, or personal training business with this step-by-step marketing checklist. Attract members, reduce churn, and fill every class.",
    icon: "🏋️",
    category: "Niche",
    timeEstimate: "60 min",
    difficulty: "Intermediate",
    sections: [
      {
        title: "Local Discovery & SEO",
        items: [
          "Complete your Google Business Profile with every class type, amenity, and membership option listed",
          "Add photos of every area: floor, equipment, changing rooms, classes in action, exterior",
          "Get to 100+ Google reviews — studios with 4.7+ and 100+ reviews dominate local results",
          "Create landing pages for each class: 'Yoga Classes in [City]', 'CrossFit [City]', 'Personal Training [City]'",
          "Target 'gym near me', '[class type] near me', and '[fitness goal] trainer [city]' keywords",
          "List on ClassPass, Mindbody, Yelp, Groupon (for visibility), and local wellness directories",
          "Run a 'New Year New You' seasonal campaign targeting gym-switchers in January and September",
        ],
      },
      {
        title: "Member Acquisition",
        items: [
          "Offer a 7-day or 14-day free trial — lower the barrier to the first visit",
          "Create a 'Bring a Friend Free' week every quarter — your members are your best salespeople",
          "Run Facebook and Instagram ads targeting people within 5 miles who are interested in fitness",
          "Use Google Ads for high-intent searches: 'join a gym [city]', 'personal trainer near me'",
          "Partner with local nutritionists, chiropractors, and physiotherapists for cross-referrals",
          "Offer a corporate wellness package to local businesses — one deal can bring 20+ members",
          "Run a 6-week transformation challenge — charge a small entry fee, award prizes, generate huge buzz",
        ],
      },
      {
        title: "Content & Community",
        items: [
          "Post workout videos, member spotlights, and transformation stories 5x per week on Instagram",
          "Create a private Facebook group for members — community is your #1 retention tool",
          "Go live on Instagram for a free 15-min workout weekly — builds audience and shows your coaches",
          "Share member transformations (with permission) — these are your most powerful social proof",
          "Create a YouTube channel with full-length workouts — ranks in search and builds authority",
          "Start a 30-day challenge on social media with a daily prompt — drives daily engagement",
          "Host a free outdoor workout monthly — great for community building and local press",
        ],
      },
      {
        title: "Retention & Revenue",
        items: [
          "Call every new member after their first week — this alone reduces 30-day churn by 40%",
          "Send a win-back campaign to anyone who hasn't visited in 3 weeks",
          "Offer annual memberships at a 15–20% discount — improves cash flow and locks in commitment",
          "Sell personal training packages, nutrition coaching, and merchandise as upsells",
          "Create a tiered membership: Basic (classes only), Pro (classes + PT session), VIP (unlimited everything)",
          "Track monthly retention rate — if it drops below 85%, investigate immediately",
          "Survey churned members within 7 days of cancellation — their feedback is gold",
        ],
      },
    ],
  },

  {
    slug: "restaurant-marketing",
    title: "Restaurant Marketing Checklist",
    description:
      "Fill more seats, drive more orders, and build a loyal dining community. This checklist covers every marketing channel that matters for restaurants.",
    icon: "🍽️",
    category: "Niche",
    timeEstimate: "75 min",
    difficulty: "Intermediate",
    sections: [
      {
        title: "Google & Local Search",
        items: [
          "Claim and fully complete your Google Business Profile including menu, hours, dine-in/takeout/delivery options",
          "Add professional food photos — restaurants with 100+ photos get 3x more direction requests",
          "Enable Google Food Ordering if available in your area — free incremental orders",
          "Keep your hours updated especially for holidays and special events",
          "Respond to every Google review within 4 hours — Google tracks engagement speed",
          "Get listed on Yelp, TripAdvisor, OpenTable, Resy, and local food blogs",
          "Target: '[cuisine] restaurant [city]', 'best [cuisine] near me', 'restaurants open now [city]'",
        ],
      },
      {
        title: "Online Ordering & Delivery",
        items: [
          "Set up commission-free online ordering on your website (use Square, Toast, or Owner.com)",
          "List on DoorDash, Uber Eats, and Grubhub for discovery — but push customers toward direct ordering",
          "Offer a 10% discount for direct orders vs. third-party orders — print this on your menus",
          "Include a 'Order Direct and Save' flyer in every delivery bag from third-party platforms",
          "Create a family meal bundle and a 'date night for two' bundle — these drive higher average order values",
          "Run a 'Free delivery on orders over $X' promotion every weekend to boost order volume",
          "Build an email list from online orders — these customers are your most loyal repeat buyers",
        ],
      },
      {
        title: "Social Media & Content",
        items: [
          "Post a high-quality photo or Reel of every new menu item on Instagram the day it launches",
          "Go behind the scenes: show your chefs, prep process, ingredient sourcing — people love authenticity",
          "Run a weekly 'staff pick' — each week a team member recommends their favorite dish",
          "Partner with local food influencers for a comp meal in exchange for an honest post",
          "Create a TikTok account showing satisfying food prep videos — these get millions of views",
          "Run a 'tag us in your meal' UGC campaign — reshare every tagged post to your stories",
          "Announce specials and events on social media with 48-hour notice to build anticipation",
        ],
      },
      {
        title: "Loyalty & Retention",
        items: [
          "Implement a digital loyalty program (Stamp Me, Belly, or Square Loyalty) — not paper punch cards",
          "Offer a birthday reward — free dessert, appetizer, or discount — collect birthdays at signup",
          "Create a VIP email list for your most loyal customers — give them early access to specials",
          "Run a 'locals discount' program — residents of your ZIP code get a standing 10% off",
          "Host a monthly themed dinner night (wine pairing, trivia night, chef's table) — drives repeat visits",
          "Send an email newsletter weekly with specials, new items, and behind-the-scenes stories",
          "Track your average visit frequency per customer — your goal is to increase it by 1 visit per quarter",
        ],
      },
    ],
  },

  {
    slug: "dentist-marketing",
    title: "Dental Practice Marketing Checklist",
    description:
      "Attract new patients, reduce no-shows, and build a practice known for trust and quality. The complete marketing checklist for dentists and dental clinics.",
    icon: "🦷",
    category: "Niche",
    timeEstimate: "60 min",
    difficulty: "Intermediate",
    sections: [
      {
        title: "Local SEO & Google Presence",
        items: [
          "Claim your Google Business Profile and select 'Dentist' as your primary category",
          "Add specialist categories: Orthodontist, Cosmetic Dentist, Pediatric Dentist (if applicable)",
          "Add every service: cleaning, whitening, implants, Invisalign, veneers, emergency dentistry",
          "Add photos of your reception, treatment rooms, staff, and before/after cases (with patient consent)",
          "Get listed on Healthgrades, Zocdoc, US News, WebMD, and Vitals — these rank for dentist searches",
          "Target: 'dentist near me', 'emergency dentist [city]', 'dental implants [city]', 'family dentist [city]'",
          "Build location pages for every city and neighborhood you serve",
        ],
      },
      {
        title: "Website & Patient Acquisition",
        items: [
          "Display your top services above the fold with a clear 'Book Appointment' button",
          "Add an online booking widget — 60% of patients prefer to book online vs. calling",
          "Create service pages for high-value procedures: implants, Invisalign, veneers, whitening",
          "Add before/after photo gallery for cosmetic procedures (with patient consent and HIPAA compliance)",
          "Display accepted insurance plans prominently — patients filter by insurance first",
          "Add a live chat or chatbot for after-hours appointment requests",
          "Publish 'New Patient Special' offer (e.g. $99 cleaning + X-ray) as a lead magnet",
        ],
      },
      {
        title: "Reviews & Reputation",
        items: [
          "Ask every patient for a Google review at checkout — train your front desk team",
          "Use a HIPAA-compliant review platform (Birdeye, Weave, or Swell) for automated review requests",
          "Respond to every review mentioning you're happy to discuss any concerns privately",
          "Never mention treatment details in review responses — HIPAA compliance is critical",
          "Aim for 200+ Google reviews — dental practices with 4.7+ and 200+ reviews dominate their area",
          "Share 5-star reviews on social media as text graphics (no patient photos without written consent)",
          "Display review badges on your website homepage and service pages",
        ],
      },
      {
        title: "Retention & Reactivation",
        items: [
          "Send automated recall reminders at 3, 6, and 12 months after each visit via SMS and email",
          "Call lapsed patients (no visit in 18+ months) personally — your receptionists should have a script",
          "Offer a 'family plan' that bundles checkups for 2 adults + 2 children at a discount",
          "Create a patient referral program: 'Refer a friend, get a $50 credit toward your next visit'",
          "Send a birthday message with a special offer for a whitening or cosmetic consultation",
          "Offer flexible payment plans (CareCredit, Sunbit) — cost is the #1 reason patients skip treatment",
          "Survey patients annually with a 3-question NPS survey — act on every piece of feedback",
        ],
      },
    ],
  },

  {
    slug: "cleaning-service-marketing",
    title: "Cleaning Service Marketing Checklist",
    description:
      "Win more recurring clients, dominate local search, and build a cleaning business that runs on referrals. The complete checklist for residential and commercial cleaners.",
    icon: "🏠",
    category: "Niche",
    timeEstimate: "50 min",
    difficulty: "Beginner",
    sections: [
      {
        title: "Local Search & Google",
        items: [
          "Claim your GBP with category 'House Cleaning Service' or 'Commercial Cleaning Service'",
          "List every service: regular cleaning, deep cleaning, move-in/out, post-construction, office cleaning",
          "Add your service area explicitly — GBP lets you list every city and neighborhood you cover",
          "Add photos of clean results, your team in uniform, your equipment, and your branded vehicle",
          "Get listed on Thumbtack, Angi, HomeAdvisor, TaskRabbit, and Nextdoor for leads",
          "Target keywords: 'house cleaning [city]', 'maid service near me', 'deep cleaning [city]'",
          "Collect 5 Google reviews per week — this is the fastest path to #1 in your area",
        ],
      },
      {
        title: "Pricing & Lead Generation",
        items: [
          "Add an instant quote calculator to your website — it's your #1 conversion driver",
          "Create a 'First Clean Special' (e.g. 20% off) — lower the barrier to the first booking",
          "Build separate landing pages for each service type targeting specific search intent",
          "Add a live chat widget for instant quote requests — speed to response wins the booking",
          "Run Google Local Services Ads (GLSA) — these appear above regular ads with a 'Google Guaranteed' badge",
          "Send direct mail postcards to neighborhoods after completing a job in the area",
          "Partner with real estate agents — every home sale is a move-in/move-out clean opportunity",
        ],
      },
      {
        title: "Retention & Recurring Revenue",
        items: [
          "Offer weekly, biweekly, and monthly subscription plans at 10–15% discount vs. one-time cleans",
          "Send a 'how was your clean?' text within 2 hours of every job completion",
          "Create a referral program: 'Refer a neighbor, both of you get $25 off'",
          "Leave a branded thank-you card after every clean with a review request QR code",
          "Upsell add-ons at booking: inside oven cleaning, inside fridge, window cleaning, laundry folding",
          "Send a 'Spring Deep Clean' and 'Holiday Preparation Clean' email campaign each season",
          "Track client retention monthly — losing a recurring client costs 5x more than keeping them",
        ],
      },
    ],
  },

  {
    slug: "real-estate-marketing",
    title: "Real Estate Agent Marketing Checklist",
    description:
      "Generate more listings, win more buyers, and build a personal brand that dominates your local market. The complete marketing checklist for real estate agents.",
    icon: "🏡",
    category: "Niche",
    timeEstimate: "75 min",
    difficulty: "Advanced",
    sections: [
      {
        title: "Personal Brand & Online Presence",
        items: [
          "Create a personal agent website (not just your brokerage page) with your niche and farm area front and center",
          "Claim your Google Business Profile as a 'Real Estate Agent' with your direct contact info",
          "Complete your Zillow Premier Agent, Realtor.com, and Homes.com profiles with 100% completion",
          "Get client reviews on Google, Zillow, and Realtor.com after every closed transaction",
          "Build a 'neighborhood expert' content hub: blog posts about schools, local events, market stats",
          "Record a 60-second video introduction — pin it to your website, Google profile, and social media",
          "Create a professional headshot and consistent brand colors/fonts across all platforms",
        ],
      },
      {
        title: "Lead Generation",
        items: [
          "Run Facebook and Instagram ads targeting homeowners aged 35–65 within your farm area",
          "Use Google Ads for buyer intent: 'homes for sale [city]', '[neighborhood] real estate agent'",
          "Create a free 'Home Valuation' landing page — this is your highest-converting lead magnet",
          "Run a 'Just Listed / Just Sold' postcard campaign within 0.5 miles of every transaction",
          "Build a referral network: mortgage brokers, divorce attorneys, estate attorneys, financial planners",
          "Host a free 'First-Time Homebuyer Workshop' quarterly — generates 10–20 qualified leads per event",
          "Door-knock your farm area with a market report — 1 in 50 opens into a listing conversation",
        ],
      },
      {
        title: "Listings Marketing",
        items: [
          "Hire a professional photographer for every listing — non-negotiable",
          "Create a property-specific landing page with a virtual tour, floor plan, and neighborhood guide",
          "Post every listing as an Instagram Reel walkthrough — these get 5x more reach than photos",
          "Run Facebook ads to a 10-mile radius around every listing the day it goes live",
          "Email your database of buyers every new listing before it hits the MLS",
          "Create a '48-hour exclusive preview' for your buyer clients — makes them feel VIP",
          "Send a printed 'Just Listed' flyer to 500 neighbors — neighbors refer buyers who want to live near them",
        ],
      },
      {
        title: "Database & Referral Marketing",
        items: [
          "Segment your CRM into: active buyers, active sellers, past clients, sphere of influence",
          "Send a monthly market report email to your entire database — position yourself as the local expert",
          "Call every past client on their 'home anniversary' — most agents never do this",
          "Send handwritten thank-you notes after every closing and every referral received",
          "Host an annual client appreciation event (BBQ, wine tasting, movie night) — your referral engine",
          "Set a 'touch' goal: every person in your database hears from you at least 12 times per year",
          "Track your referral conversion rate — 80% of business should come from referrals within 3 years",
        ],
      },
    ],
  },
];

export function getChecklist(slug: string): Checklist | undefined {
  return checklists.find((c) => c.slug === slug);
}

export function getTotalItems(checklist: Checklist): number {
  return checklist.sections.reduce((sum, section) => sum + section.items.length, 0);
}
