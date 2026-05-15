import type { Metadata } from "next";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <SectionWrapper>
      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: May 2026</p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing datalatte.pro or engaging DataLatte for services, you agree to these Terms of Service.
          If you do not agree, please do not use this website or our services.
        </p>

        <h2>2. Services</h2>
        <p>
          DataLatte provides digital marketing consulting and managed services including Google Ads, Meta Ads,
          SEO, programmatic advertising, analytics, and related services. Specific terms, deliverables, and
          pricing are agreed in individual service agreements or proposals.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on this website — including text, images, and code — is the property of DataLatte.
          You may not reproduce or redistribute it without written permission. Work product created for
          clients is owned by the client upon full payment.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          DataLatte provides marketing services in good faith but cannot guarantee specific results such as
          ad performance, rankings, or revenue. We are not liable for decisions made based on our recommendations
          or for third-party platform changes (Google, Meta, etc.) that affect campaign performance.
        </p>

        <h2>5. Payment</h2>
        <p>
          Payment terms are specified in individual service agreements. Unpaid invoices beyond 30 days may
          result in service suspension. All fees are non-refundable unless otherwise agreed in writing.
        </p>

        <h2>6. Confidentiality</h2>
        <p>
          We treat all client data, business information, and campaign performance as confidential and will
          not share it with third parties without your consent, except where required by law.
        </p>

        <h2>7. Termination</h2>
        <p>
          Either party may terminate a service engagement with 30 days written notice unless otherwise
          specified in a service agreement. Outstanding invoices remain due upon termination.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms are governed by the laws of Poland. Any disputes will be resolved in the courts of
          Poznań, Poland.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about these terms? Email us at{" "}
          <a href="mailto:hi@datalatte.pro" className="text-coffee-700 hover:underline">
            hi@datalatte.pro
          </a>
          .
        </p>
      </div>
    </SectionWrapper>
  );
}
