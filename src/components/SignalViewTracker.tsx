"use client";

import { useEffect } from "react";
import { gtag } from "@/lib/gtag";

export default function SignalViewTracker({
  category,
  impact,
  slug,
}: {
  category: string;
  impact: string;
  slug: string;
}) {
  useEffect(() => {
    gtag.radarSignalViewed(category, impact, slug);
  }, [category, impact, slug]);

  return null;
}
