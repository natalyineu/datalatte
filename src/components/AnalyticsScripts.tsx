"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isPl } from "@/lib/i18n";

const GA = "G-M4L8HJGRCH";
export const CONSENT_KEY = "dl-consent";

/** Microsoft Clarity and Google Analytics 4. English pages: unchanged behaviour. Polish pages (EU): load only after the visitor accepts cookies. */
export default function AnalyticsScripts() {
  const pathname = usePathname();
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const read = () => { try { setGranted(localStorage.getItem(CONSENT_KEY) === "granted"); } catch { setGranted(false); } };
    read();
    window.addEventListener("dl-consent-change", read);
    return () => window.removeEventListener("dl-consent-change", read);
  }, []);

  if (isPl(pathname) && !granted) return null;

  return (
    <>
      <Script id="clarity-init" strategy="lazyOnload">
        {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xf9zebr32b");`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="lazyOnload">
        {`// Do not count headless/automated browsers (the bulk of "Direct" traffic)
if (navigator.webdriver || /HeadlessChrome|PhantomJS|bot|crawl|spider/i.test(navigator.userAgent)) { window['ga-disable-${GA}'] = true; }
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA}');`}
      </Script>
    </>
  );
}
