"use client";

import dynamic from "next/dynamic";

const FloatingCTA     = dynamic(() => import("@/components/FloatingCTA"),     { ssr: false });
const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"), { ssr: false });
const BackToTop       = dynamic(() => import("@/components/BackToTop"),       { ssr: false });
const AIChatWidget    = dynamic(() => import("@/components/AIChatWidget"),    { ssr: false });

export default function ClientWidgets() {
  return (
    <>
      <FloatingCTA />
      <ExitIntentPopup />
      <BackToTop />
      <AIChatWidget />
    </>
  );
}
