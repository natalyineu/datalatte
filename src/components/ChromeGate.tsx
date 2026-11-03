"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isPl } from "@/lib/i18n";

/** Hides the English site chrome (header, footer, widgets) on Polish pages, which bring their own. */
export default function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return isPl(pathname) ? null : <>{children}</>;
}
