"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gtag } from "@/lib/gtag";

/**
 * Site-wide behaviour tracking without touching individual components:
 *  - scroll depth 25 / 50 / 75 % (GA4 already reports 90 % as "scroll")
 *  - clicks on the booking link (Google Calendar), email, phone, /contact and service links
 * /free-audit clicks are tracked per component (free_audit_clicked), not here.
 */
export default function EventTracker() {
  const pathname = usePathname();

  // Scroll depth, once per page view
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const mark of [25, 50, 75] as const) {
        if (pct >= mark && !fired.has(mark)) {
          fired.add(mark);
          gtag.scrollDepth(mark, pathname);
        }
      }
      if (fired.size === 3) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Delegated link clicks
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!a || !href) return;
      const src = a.getAttribute("data-track-source");
      if (src) { gtag.freeAuditClicked(src); return; } // server-rendered CTAs opt in with data-track-source
      if (href.startsWith("mailto:")) gtag.emailLinkClicked(pathname);
      else if (href.startsWith("tel:")) gtag.phoneLinkClicked(pathname);
      else if (href.includes("calendar.app.google") || href.includes("calendly.com")) gtag.bookCallClicked(pathname);
      else if (href === "/contact" || href.startsWith("/contact?") || href.startsWith("/contact#"))
        gtag.contactCtaClicked(pathname, (a.textContent || "").trim().slice(0, 40));
      else if (href.startsWith("/services/") && pathname.startsWith("/blog/"))
        gtag.serviceLinkClicked(pathname, href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
