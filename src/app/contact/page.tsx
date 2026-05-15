import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Calendar, ArrowRight, Clock, CheckCircle2, MapPin } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Get a Free Marketing Audit",
  description:
    "Get in touch with DataLatte. Book a free marketing audit for your coffee shop, hair salon, pet grooming, or fitness business. Multiple contact options available.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Let's Talk
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Get your free
            <span className="text-coffee-300"> marketing audit</span>
          </h1>
          <p className="text-coffee-200 text-lg max-w-xl mx-auto">
            I'll review your current online presence and tell you honestly what's holding you back
            and what's worth focusing on first. No charge, no pressure.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send a message</h2>
            <p className="text-gray-500 mb-7 text-sm">
              I typically respond within one business day.
            </p>

            <ContactForm />
          </div>

          {/* Other options + what to expect */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Other ways to reach me</h2>

              <div className="space-y-4">
                <a
                  href="mailto:hi@datalatte.pro"
                  className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-coffee-300 hover:bg-coffee-50 transition-all group"
                >
                  <div className="w-11 h-11 bg-coffee-100 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-coffee-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-coffee-700 transition-colors">
                      Email
                    </div>
                    <div className="text-sm text-gray-500">hi@datalatte.pro</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-coffee-700 ml-auto transition-colors" />
                </a>

                <a
                  href="https://wa.me/48503589781"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-coffee-300 hover:bg-coffee-50 transition-all group"
                >
                  <div className="w-11 h-11 bg-coffee-100 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle size={20} className="text-coffee-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-coffee-700 transition-colors">
                      WhatsApp
                    </div>
                    <div className="text-sm text-gray-500">+48 503 589 781</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-coffee-700 ml-auto transition-colors" />
                </a>

                <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="w-11 h-11 bg-coffee-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-coffee-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Office</div>
                    <div className="text-sm text-gray-500">Bałtyk Business Square, Poznań, Poland</div>
                  </div>
                </div>

                <a
                  href="https://cal.com/datalatte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-coffee-400 hover:bg-coffee-50 transition-all group"
                >
                  <div className="w-11 h-11 bg-coffee-100 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-coffee-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-coffee-700 transition-colors">
                      Book a call (cal.com)
                    </div>
                    <div className="text-sm text-gray-500">30-minute intro or audit call</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-coffee-700 ml-auto transition-colors" />
                </a>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={17} className="text-coffee-600" />
                What happens after you reach out
              </h3>
              <ul className="space-y-3">
                {[
                  "I'll review your online presence before we talk (GBP, website, any existing ads)",
                  "We schedule a 30-minute call or I send you a written audit — whichever you prefer",
                  "I give you honest feedback: what's working, what's not, and what I'd prioritize",
                  "If it seems like a good fit, I'll share a clear proposal. No pressure, no hard sell.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-coffee-100 text-coffee-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Niches */}
            <div className="bg-coffee-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">I specialize in:</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Coffee Shops", href: "/for/coffee-shops", emoji: "☕" },
                  { label: "Hair & Beauty Salons", href: "/for/hair-salons", emoji: "✂️" },
                  { label: "Pet Groomers", href: "/for/pet-groomers", emoji: "🐾" },
                  { label: "Fitness Studios", href: "/for/fitness-studios", emoji: "🧘" },
                ].map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-coffee-700 transition-colors"
                  >
                    <CheckCircle2 size={13} className="text-coffee-500 shrink-0" />
                    {n.emoji} {n.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
