import type { Metadata } from "next";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: April 2026</p>

        <div className="prose-datalatte space-y-6 text-gray-600">
          <p>
            DataLatte ("we", "our", "us") is committed to protecting your privacy.
            This policy explains how we collect and use information when you visit datalatte.pro.
          </p>

          <h2>Information we collect</h2>
          <p>
            We collect information you provide directly — such as your name, email, and business
            details when you submit a contact form. We also collect anonymous analytics data
            through Google Analytics to understand how our site is used.
          </p>

          <h2>How we use your information</h2>
          <p>
            We use contact form data solely to respond to your inquiry and provide the services
            you request. We do not sell your information to third parties.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies for analytics purposes (Google Analytics). You may disable cookies
            in your browser settings without affecting site functionality.
          </p>

          <h2>Contact</h2>
          <p>
            Questions? Email us at{" "}
            <a href="mailto:hi@datalatte.pro" className="text-coffee-700 underline">
              hi@datalatte.pro
            </a>
            .
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
