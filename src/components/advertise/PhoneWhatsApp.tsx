import { MessageCircle, Phone } from "lucide-react";

const PHONE = "+48 503 589 781";

/** Phone + WhatsApp links. `dark` = on dark hero/CTA backgrounds, otherwise on light. */
export default function PhoneWhatsApp({ dark = true, className = "" }: { dark?: boolean; className?: string }) {
  const link = dark ? "text-white/90 hover:text-coffee-300" : "text-coffee-700 dark:text-coffee-300 hover:underline";
  return (
    <span className={`inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 ${className}`}>
      <a href="tel:+48503589781" className={`inline-flex items-center gap-1.5 font-medium ${link}`}>
        <Phone size={15} aria-hidden /> {PHONE}
      </a>
      <a href="https://wa.me/48503589781" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-medium ${link}`}>
        <MessageCircle size={15} aria-hidden /> WhatsApp
      </a>
    </span>
  );
}
