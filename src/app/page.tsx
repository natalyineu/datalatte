import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  BarChart3,
  Target,
  Search,
  Star,
  CheckCircle2,
  Zap,
  Bot,
  Mail,
  Globe,
  Share2,
} from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import BlogCard from "@/components/BlogCard";
import TestimonialCard from "@/components/TestimonialCard";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

export const metadata: Metadata = {
  title: {
    absolute: "DataLatte — Data-Driven Local Marketing for Small Businesses",
  },
  description:
    "Freelance marketing & analytics built for local SMBs. Google Ads, Meta Ads, local SEO, and Google Business Profile optimization — with real data behind every decision.",
};

const niches = [
  {
    title: "Coffee Shops",
    subtitle: "Restaurants & Cafés",
    href: "/for/coffee-shops",
    emoji: "☕",
    color: "from-coffee-700 to-coffee-900",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    kpis: ["Google Maps visibility", "Foot traffic from ads", "Online order growth"],
  },
  {
    title: "Hair & Beauty Salons",
    subtitle: "Barbershops & Spas",
    href: "/for/hair-salons",
    emoji: "✂️",
    color: "from-gray-700 to-gray-900",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    kpis: ["New booking requests", "Repeat client retention", "Review growth"],
  },
  {
    title: "Pet Groomers",
    subtitle: "Dog Walkers & Vets",
    href: "/for/pet-groomers",
    emoji: "🐾",
    color: "from-coffee-600 to-coffee-950",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    kpis: ["Map pack ranking", "Appointment bookings", "Local reach expansion"],
  },
  {
    title: "Fitness & Yoga Studios",
    subtitle: "Gyms & Personal Trainers",
    href: "/for/fitness-studios",
    emoji: "🧘",
    color: "from-gray-800 to-gray-950",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    kpis: ["Trial class sign-ups", "Membership conversions", "Cost per lead"],
  },
];

const services = [
  {
    icon: Target,
    title: "Google Ads",
    desc: "Show up when locals are actively searching for what you offer. Every dollar tracked.",
    href: "/services/google-ads",
    color: "text-coffee-700 bg-coffee-100",
  },
  {
    icon: TrendingUp,
    title: "Meta Ads",
    desc: "Reach your ideal local customer on Facebook & Instagram with scroll-stopping creative.",
    href: "/services/meta-ads",
    color: "text-coffee-600 bg-coffee-50",
  },
  {
    icon: MapPin,
    title: "Google Business Profile",
    desc: "Win the local map pack. More calls, directions, and clicks — from free organic traffic.",
    href: "/services/google-business-profile",
    color: "text-gray-700 bg-gray-100",
  },
  {
    icon: Search,
    title: "Local SEO",
    desc: "Rank for the searches that bring in real customers, not just traffic for vanity metrics.",
    href: "/services/local-seo",
    color: "text-coffee-800 bg-coffee-100",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    desc: "Know exactly what's working. Clear dashboards, plain English — no data overwhelm.",
    href: "/services/analytics",
    color: "text-gray-600 bg-gray-100",
  },
  {
    icon: Bot,
    title: "AI Agents & Automation",
    desc: "Instant lead follow-up, review replies, and booking reminders — running 24/7 without hiring anyone.",
    href: "/services/ai-agents",
    color: "text-coffee-700 bg-coffee-100",
  },
  {
    icon: Mail,
    title: "Email & SMS Marketing",
    desc: "Turn one-time visitors into loyal regulars. Your list is the highest-ROI channel you own.",
    href: "/services/email-sms",
    color: "text-gray-700 bg-gray-100",
  },
  {
    icon: Share2,
    title: "Social Media Management",
    desc: "Consistent content, real engagement, and a feed that turns followers into regulars.",
    href: "/services/social-media",
    color: "text-gray-700 bg-gray-100",
  },
  {
    icon: Globe,
    title: "Website & Landing Pages",
    desc: "Conversion-focused pages built to get you calls and bookings — not just look good.",
    href: "/services/website",
    color: "text-coffee-600 bg-coffee-50",
  },
];

const whyCards = [
  {
    icon: Zap,
    title: "Actually data-driven",
    desc: "Every campaign decision is backed by numbers, not gut feelings. You'll see exactly what you're paying for.",
  },
  {
    icon: CheckCircle2,
    title: "Niche-specific playbooks",
    desc: "Coffee shops and yoga studios have very different funnels. I don't use copy-paste strategies.",
  },
  {
    icon: Star,
    title: "Honest, transparent work",
    desc: "No long-term lock-ins, no smoke and mirrors. Just clear goals, clear results, and real communication.",
  },
];


const testimonials = [
  {
    quote:
      "Within 6 weeks our Google Business Profile impressions doubled and we started getting calls from people who'd never heard of us. The reporting actually made sense for once.",
    author: "Sarah M.",
    role: "Owner, The Daily Grind Coffee Co.",
    rating: 5,
  },
  {
    quote:
      "I'd wasted money on two different agencies before. DataLatte showed me exactly where my ad budget was going and cut my cost per booking in half.",
    author: "Priya K.",
    role: "Owner, Studio Flow Yoga",
    rating: 5,
  },
  {
    quote:
      "Honest, responsive, and actually explains things in plain language. Feels like working with someone who genuinely cares about my business.",
    author: "Marcus T.",
    role: "Owner, Paws & Polish Grooming",
    rating: 5,
  },
];

function getLatestPosts(count = 3) {
  const dir = path.join(process.cwd(), "content/blog");
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".mdx"))
    .map(file => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return { slug: file.replace(".mdx",""), title: String(data.title ?? ""), description: String(data.description ?? ""), category: String(data.category ?? ""), date: String(data.date ?? ""), readTime: String(data.readTime ?? "5 min read"), image: String(data.image ?? "") };
    })
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export default function HomePage() {
  const latestPosts = getLatestPosts();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-coffee-400 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse" />
                Data-Driven Local Marketing
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                Digital Marketing for
                <br />
                <span className="text-coffee-300">Local Businesses,</span>
                <br />
                Done Right
              </h1>
              <p className="text-coffee-200 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                Google Ads, Meta Ads, local SEO and marketing automation for coffee shops,
                hair salons, pet groomers, fitness studios — and growing brands at any scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-coffee-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Get a Free Marketing Audit
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  See how it works
                </Link>
              </div>

              {/* Mini trust signals */}
              <div className="flex items-center gap-5 mt-10">
                <div className="flex -space-x-2">
                  {["☕", "✂️", "🐾", "🧘"].map((e, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm"
                    >
                      {e}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-coffee-200">
                  Built for <strong className="text-white">local businesses</strong> across 4 niches
                </p>
              </div>
            </div>

            {/* Right — floating dashboard card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold">Your Marketing Dashboard</span>
                    <span className="text-coffee-300 text-xs font-medium bg-coffee-300/20 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>

                  {/* Fake chart bars */}
                  <div className="flex items-end gap-2 h-28 mb-4">
                    {[40, 55, 45, 70, 60, 80, 75, 90, 85, 100, 95, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-coffee-700 to-coffee-400 opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Impressions", value: "12.4K", change: "+34%" },
                      { label: "Clicks", value: "847", change: "+21%" },
                      { label: "Conversions", value: "63", change: "+48%" },
                    ].map((s) => (
                      <div key={s.label} className="stat-card">
                        <div className="text-white font-bold">{s.value}</div>
                        <div className="text-gray-400 text-xs">{s.label}</div>
                        <div className="text-coffee-300 text-xs font-medium">{s.change}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-coffee-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-coffee-600 animate-float">
                  ☕ +38% new customers this month
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: 10, suffix: "+", label: "Years experience" },
            { value: 50, suffix: "+", label: "Guides published" },
            { value: 15, suffix: "+", label: "Ad platforms" },
            { value: 100, suffix: "%", label: "Data-driven" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-coffee-700">
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Niches */}
      <SectionWrapper className="bg-gray-50">
        <ScrollReveal>
        <div className="text-center mb-12">
          <span className="section-label">Industries We Serve</span>
          <h2 className="section-title">
            Marketing built for{" "}
            <span className="gradient-text">your niche</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-2xl mx-auto">
            Generic marketing advice is everywhere. I specialize in four local business types
            and know the exact levers that move the needle for each one.
          </p>
        </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {niches.map((niche, i) => (
            <ScrollReveal key={niche.href} delay={i * 0.1} direction="up">
            <Link
              href={niche.href}
              className="niche-card h-72 group block"
            >
              <Image
                src={niche.image}
                alt={niche.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${niche.color} opacity-70 group-hover:opacity-80 transition-opacity`} />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="text-3xl mb-2">{niche.emoji}</div>
                <h3 className="text-white font-bold text-lg leading-tight">{niche.title}</h3>
                <p className="text-white/70 text-sm mb-3">{niche.subtitle}</p>
                <ul className="space-y-1">
                  {niche.kpis.map((kpi) => (
                    <li key={kpi} className="flex items-center gap-1.5 text-xs text-white/80">
                      <CheckCircle2 size={11} className="text-coffee-300 shrink-0" />
                      {kpi}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-1 text-white text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={13} />
                </div>
              </div>
            </Link>
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>

      {/* Services */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">What I Do</span>
          <h2 className="section-title">
            Full-funnel local marketing —{" "}
            <span className="gradient-text">no fluff</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            From getting found on Google Maps to converting that interest into paying customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <ScrollReveal key={svc.href} delay={i * 0.07} direction="up">
            <Link
              href={svc.href}
              className="card p-6 group hover:-translate-y-1 transition-transform duration-200 block h-full"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${svc.color}`}>
                <svc.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-coffee-700 transition-colors">
                {svc.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{svc.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-coffee-700 group-hover:gap-2 transition-all">
                Explore <ArrowRight size={13} />
              </span>
            </Link>
            </ScrollReveal>
          ))}

          {/* Catchall card */}
          <div className="card p-6 bg-gradient-to-br from-coffee-700 to-coffee-900 text-white">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Zap size={22} className="text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">Not sure what you need?</h3>
            <p className="text-coffee-200 text-sm leading-relaxed mb-5">
              Let's talk through your goals. I'll tell you honestly which channels make sense
              for your business right now.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 bg-white text-coffee-900 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-coffee-100 transition-colors"
            >
              Start the conversation <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Why DataLatte */}
      <SectionWrapper id="how-it-works" className="bg-coffee-50">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label">Why DataLatte</span>
            <h2 className="section-title mb-6">
              Marketing that's as{" "}
              <span className="text-coffee-700">warm as your latte</span>,
              as sharp as your data
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              I'm not a big agency. I'm a one-person shop with deep expertise in local marketing
              and a genuine obsession with analytics. That means you get my full attention —
              not handed off to a junior account manager.
            </p>

            <div className="space-y-6">
              {whyCards.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-coffee-100 flex items-center justify-center shrink-0">
                    <item.icon size={19} className="text-coffee-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-outline mt-8">
              About me & my approach
            </Link>
          </div>

          {/* Process steps */}
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Free audit",
                desc: "I look at your current presence — Google Ads, GBP, website, social — and tell you exactly what's holding you back.",
              },
              {
                step: "02",
                title: "Strategy call",
                desc: "We talk through priorities. I give you a clear plan with expected outcomes, not promises I can't keep.",
              },
              {
                step: "03",
                title: "Build & launch",
                desc: "I set up campaigns, optimize your profiles, and create the assets. Fast execution, no endless approval loops.",
              },
              {
                step: "04",
                title: "Measure & improve",
                desc: "You get a dashboard you can actually read. Every month we review what's working and double down.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="flex gap-4 bg-white rounded-xl p-5 border border-coffee-100 hover:border-coffee-200 transition-colors"
              >
                <div className="text-2xl font-bold text-coffee-200 font-display shrink-0 w-10">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Client Stories</span>
          <h2 className="section-title">
            Real results,{" "}
            <span className="gradient-text">real businesses</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-lg mx-auto">
            What clients say after working with DataLatte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.author} delay={i * 0.12}>
              <TestimonialCard {...t} />
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>

      {/* Blog */}
      <SectionWrapper className="bg-gray-50">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label">From the Blog</span>
            <h2 className="text-3xl font-bold text-gray-900">
              Local marketing,{" "}
              <span className="gradient-text">explained plainly</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-1.5 text-coffee-700 font-semibold hover:gap-3 transition-all text-sm"
          >
            All posts <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} title={post.title} excerpt={post.description} slug={post.slug} category={post.category} date={new Date(post.date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})} rawDate={new Date(post.date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})} readTime={post.readTime} image={post.image} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/blog" className="btn-outline">
            View all posts
          </Link>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <CTABanner />
    </>
  );
}
