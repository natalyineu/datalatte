import type { Metadata } from "next";
import Link from "next/link";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "AI Agents & Automation for Local Businesses",
  description:
    "AI-powered agents and automation for local businesses. Automate lead follow-up, review replies, appointment reminders, and customer Q&A — so you never miss a hot lead again.",
};

export default function AIAgentsPage() {
  return (
    <>
      {/* Tool promo banner */}
      <div className="bg-coffee-50 border-b border-coffee-100 py-3 px-4 text-center text-sm">
        <span className="text-gray-600">Want to explore AI agents yourself? </span>
        <Link href="/tools/ai-agent-builder" className="font-semibold text-coffee-700 hover:underline">
          Try our free AI Agent Builder →
        </Link>
      </div>
      <ServicePage
      service="AI Agents & Automation"
      tagline="Let AI handle the repetitive stuff. You focus on running the business."
      description="Most small businesses lose leads not because of bad marketing, but because nobody followed up fast enough. AI agents handle your lead responses, review replies, appointment reminders, and FAQ answers — instantly, 24/7, without hiring anyone."
      icon="🤖"
      accentClass="bg-gradient-to-br from-gray-900 to-coffee-900"
      whatItIs="AI agents are software systems that act on your behalf — automatically responding to leads, answering common questions, following up on missed calls, replying to reviews, and nurturing prospects through your booking funnel. Think of it like having a very fast, always-on assistant who never forgets to follow up. For local businesses, the biggest opportunities are: (1) instant lead response — the first business to reply wins, and AI can reply in under 60 seconds at 2am; (2) automated review responses — keeping your GBP active and showing prospects you care; (3) booking reminders — reducing no-shows by 30–50%; (4) website chat — answering the 'do you take walk-ins?' and 'what's your price for a balayage?' questions that otherwise go unanswered. These aren't science-fiction tools — they're accessible, practical, and already being used by forward-thinking small businesses in every niche."
      howItWorks={[
        {
          step: "01",
          title: "Workflow audit",
          desc: "I map out where leads are dropping off, where follow-up is slow, and where you're spending time answering the same questions repeatedly. That becomes the automation roadmap.",
        },
        {
          step: "02",
          title: "Tool selection",
          desc: "I recommend the right tools for your budget and tech comfort level — from simple no-code platforms (GoHighLevel, ManyChat, Zapier) to more custom AI agent setups using OpenAI or Claude APIs.",
        },
        {
          step: "03",
          title: "Agent build & training",
          desc: "I build and configure your agents: train them on your FAQs, services, pricing, and tone of voice. They should sound like you — not like a robot.",
        },
        {
          step: "04",
          title: "Integration",
          desc: "Connect agents to your existing tools: your booking software, CRM, Google Business Profile, website chat, Facebook Messenger, or SMS platform.",
        },
        {
          step: "05",
          title: "Test, refine & hand off",
          desc: "We run test scenarios, refine responses, and I hand you a system you can manage yourself — with clear documentation on how to update it as your business evolves.",
        },
      ]}
      included={[
        "Lead workflow audit and automation mapping",
        "AI chatbot for website (FAQ + lead capture)",
        "Automated lead follow-up sequences (SMS/email)",
        "Review response automation (Google, Facebook)",
        "Appointment reminder sequences (reduces no-shows)",
        "Missed call text-back automation",
        "Tone-of-voice training so responses sound human",
        "Integration with your booking system or CRM",
        "Plain-English documentation so you can manage it",
        "30-day post-launch support and refinements",
      ]}
      notIncluded={[
        "Full custom software development (I use no-code/low-code tools)",
        "Ongoing monthly management (I build and hand off)",
        "Enterprise-scale CRM buildouts",
        "AI-generated ad creative or content writing pipelines (separate scope)",
      ]}
      bestFor={[
        "Businesses losing leads because follow-up is slow or inconsistent",
        "Owners spending hours answering the same questions by phone or DM",
        "Any business with a no-show problem for appointments",
        "Coffee shops, salons, and studios with high inbound message volume",
        "Businesses that want to compete with bigger players without hiring",
        "Anyone who's ever said 'I missed that lead because I was busy with a client'",
      ]}
      faqs={[
        {
          q: "Will it sound robotic and turn customers off?",
          a: "Only if it's built badly. I train agents on your specific tone, common phrasings, and business personality. The goal is responses that feel warm and on-brand — customers often can't tell the difference for simple FAQ interactions.",
        },
        {
          q: "What tools do you use?",
          a: "It depends on your needs and budget. For most local businesses I use GoHighLevel, ManyChat, or Zapier for automations, and OpenAI/Claude APIs for more conversational agents. I'll recommend what makes sense for your setup — no overengineering.",
        },
        {
          q: "Do I need a CRM for this to work?",
          a: "Not necessarily. Some automations (website chat, review replies, missed call text-back) work standalone. A CRM helps if you want full lead tracking, but we can start simple and expand.",
        },
        {
          q: "What happens when someone asks something the AI doesn't know?",
          a: "The agent is trained to gracefully hand off to you — sending you a notification and telling the customer you'll be in touch shortly. Nothing falls through the cracks.",
        },
        {
          q: "Is this expensive to run month-to-month?",
          a: "Most setups run on $50–$150/month in tool costs after my one-time build fee. For most businesses that's a fraction of what you'd pay a part-time admin — and this works 24/7.",
        },
      ]}
      relatedLinks={[
        { label: "🤖 Free AI Agent Builder Tool", href: "/tools/ai-agent-builder" },
        { label: "Analytics & Reporting", href: "/services/analytics" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "Email & SMS Marketing", href: "/services/email-sms" },
        { label: "Website & Landing Pages", href: "/services/website" },
      ]}
    />
    </>
  );
}
