"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const FloatingCTA     = dynamic(() => import("@/components/FloatingCTA"),     { ssr: false });
const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"), { ssr: false });
const BackToTop       = dynamic(() => import("@/components/BackToTop"),       { ssr: false });
const AIChatWidget    = dynamic(() => import("@/components/AIChatWidget"),    { ssr: false });
const EventTracker    = dynamic(() => import("@/components/EventTracker"),    { ssr: false });

// The widgets are scroll/mouse driven, so their code is fetched on the first user action
// (or after 4 s) instead of competing with the page for bandwidth during load.
const WAKE_EVENTS = ["scroll", "pointerdown", "keydown", "touchstart", "mousemove"] as const;

export default function ClientWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wake = () => setReady(true);
    WAKE_EVENTS.forEach(e => window.addEventListener(e, wake, { once: true, passive: true }));
    const timer = window.setTimeout(wake, 4000);
    return () => {
      WAKE_EVENTS.forEach(e => window.removeEventListener(e, wake));
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <EventTracker />
      {ready && (
        <>
          <FloatingCTA />
          <ExitIntentPopup />
          <BackToTop />
          <AIChatWidget />
        </>
      )}
    </>
  );
}
