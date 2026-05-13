import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, Zap, BarChart3 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "About — Local Marketing Freelancer",
  description:
    "The story behind DataLatte. A freelance marketer with a data obsession helping local businesses grow with honest, transparent, results-focused marketing.",
};

const values = [
  {
    icon: BarChart3,
    title: "Data over hunches",
    desc: "Every recommendation I make is backed by something measurable. I won't suggest spending on a channel unless I can show you why — and how we'll track results.",
  },
  {
    icon: Heart,
    title: "Honest by default",
    desc: "I'll tell you if I think something won't work for your business. No overselling, no lock-in contracts, no inflated promises. Small business owners deserve straight talk.",
  },
  {
    icon: Zap,
    title: "Focus on what moves the needle",
    desc: "There are a thousand things you could work on. I focus on the 2–3 things that will actually drive meaningful results for your specific business at this stage.",
  },
  {
    icon: CheckCircle2,
    title: "Niche expertise, not generalism",
    desc: "I work with four types of local businesses deeply, not forty types superficially. That focus means I bring real pattern recognition, not a copy-paste agency playbook.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            The Person Behind the Data
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Hi — I'm the one who will actually
            <br />
            <span className="text-coffee-300">work on your marketing</span>
          </h1>
          <p className="text-coffee-200 text-lg max-w-2xl mx-auto">
            No account managers. No handoffs. Just one person who knows your business,
            cares about your results, and won't stop optimizing until the numbers make sense.
          </p>
        </div>
      </section>

      {/* Story */}
      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="relative flex flex-col items-center lg:items-start">
            {/* Portrait frame */}
            <div className="relative inline-block">
              <Image
                src="/images/founder.png"
                alt="Nataliia — founder of DataLatte"
                width={320}
                height={320}
                className="rounded-full object-cover shadow-2xl ring-4 ring-coffee-100"
                style={{ width: 320, height: 320, objectFit: "cover" }}
                priority
              />
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-full border-2 border-dashed border-coffee-200 -z-10" />
            </div>
            {/* Badge */}
            <div className="mt-6 bg-coffee-800 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg border border-coffee-600 inline-flex items-center gap-2">
              ☕ Powered by actual lattes
            </div>
          </div>

          <div>
            <span className="section-label">My Story</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              From spreadsheets to real impact
              <span className="gradient-text"> for real businesses</span>
            </h2>

            <div className="space-y-5 text-gray-600 leading-relaxed">
              <p>
                I'm a marketing and analytics freelancer with a background in data and a love
                for local businesses — the kind that make neighborhoods feel like home.
                Coffee shops where the barista knows your name. Salons where you leave
                feeling like yourself. Studios where you find your community.
              </p>
              <p>
                I'm not a giant agency. I don't have a wall of client logos or a portfolio of
                Fortune 500 case studies. I'm building DataLatte from the ground up, starting
                with the four niches I know best and care about most.
              </p>
              <p>
                What I bring is a deep understanding of local marketing mechanics — how Google
                actually ranks local businesses, how to build Meta ad campaigns that convert,
                and how to set up analytics so you can actually see what's working. I come from
                a data background, which means I approach marketing differently from most:
                every decision is testable, every result is measurable.
              </p>
              <p>
                I'm also not from the US originally, which means I've had to learn these
                markets deliberately — not by assumption. I find that actually makes me
                more thorough.
              </p>
              <p className="font-medium text-gray-800">
                If you want someone who will treat your marketing budget like their own money,
                obsess over your analytics, and give you honest advice even when it's not what
                you want to hear — that's what DataLatte is about.
              </p>
            </div>

            <Link href="/contact" className="btn-primary mt-8">
              Let's work together <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">How I Work</span>
          <h2 className="section-title">
            Values that shape
            <span className="gradient-text"> every engagement</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((v) => (
            <div key={v.title} className="card p-6 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-coffee-100 flex items-center justify-center shrink-0">
                <v.icon size={20} className="text-coffee-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* What to expect */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Working Together</span>
            <h2 className="section-title">What to expect</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "Transparency over performance theater",
                desc: "I'll share what's working and what's not — including when something I tried didn't land. Marketing is iterative. Pretending otherwise wastes your money.",
              },
              {
                title: "Direct communication",
                desc: "No endless email chains or account manager telephone games. You work directly with me. I respond fast and keep you in the loop without drowning you in updates.",
              },
              {
                title: "No lock-in by default",
                desc: "I prefer month-to-month or 3-month engagements to start. If you don't see value, you shouldn't feel trapped. The goal is to earn your continued business.",
              },
              {
                title: "Your success is my portfolio",
                desc: "I'm early in building DataLatte's reputation. Every client result matters enormously to me — not just because it's right, but because it's how this business grows.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-coffee-50 rounded-xl p-5">
                <CheckCircle2 size={20} className="text-coffee-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Sound like someone you want to work with?"
        sub="Start with a free audit. No obligations, just honest feedback on your current marketing."
      />
    </>
  );
}
