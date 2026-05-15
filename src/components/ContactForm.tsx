"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/xqenvpwv", { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (res.ok) {
        setStatus("success");
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "generate_lead", { event_category: "contact_form" });
        }
      } else { setStatus("error"); }
    } catch { setStatus("error"); }
  }

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message sent! ☕</h3>
        <p className="text-gray-500">I will review your details and get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Your name</label>
          <input type="text" id="name" name="name" placeholder="Jane Smith" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input type="email" id="email" name="email" placeholder="jane@yourbusiness.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm" required />
        </div>
      </div>
      <div>
        <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1.5">Your business name</label>
        <input type="text" id="business" name="business" placeholder="The Morning Grind Cafe" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm" />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">Business type</label>
        <select id="type" name="type" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm bg-white text-gray-700">
          <option value="">Select your niche</option>
          <option value="coffee">Coffee Shop / Cafe / Restaurant</option>
          <option value="salon">Hair Salon / Barbershop / Beauty Studio</option>
          <option value="grooming">Pet Groomer / Dog Walker / Pet Care</option>
          <option value="fitness">Fitness Studio / Gym / Yoga / Personal Trainer</option>
          <option value="medium">Growing / Mid-size Business</option>
          <option value="enterprise">Enterprise / Agency</option>
          <option value="other">Other local business</option>
        </select>
      </div>
      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1.5">What are you most interested in?</label>
        <select id="interest" name="interest" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm bg-white text-gray-700">
          <option value="">Select a service</option>
          <option value="google-ads">Google Ads</option>
          <option value="meta-ads">Meta Ads (Facebook / Instagram)</option>
          <option value="tiktok-ads">TikTok Ads</option>
          <option value="programmatic">Programmatic Advertising</option>
          <option value="gbp">Google Business Profile</option>
          <option value="seo">Local SEO</option>
          <option value="analytics">Analytics and Reporting</option>
          <option value="audit">Free audit - not sure yet</option>
          <option value="everything">Full marketing strategy</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Tell me about your current situation</label>
        <textarea id="message" name="message" rows={5} placeholder="What is your biggest marketing challenge right now? What have you tried? What results are you hoping for?" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none transition text-sm resize-none" />
      </div>
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60">
        {status === "loading" ? "Sending..." : "Request My Free Audit"}
        {status !== "loading" && <ArrowRight size={17} />}
      </button>
      {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again or email hi@datalatte.pro directly.</p>}
      <p className="text-xs text-gray-400 text-center">No spam, ever. Your info stays with me and is used only to respond to your inquiry.</p>
    </form>
  );
}
