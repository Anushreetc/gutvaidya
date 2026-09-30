"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

const CONSENT_KEY = "gv_cookie_consent";
type Consent = "accepted" | "declined" | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

// Analytics and marketing pixels load only after the visitor accepts (DPDP Act).
// If no analytics IDs are configured, nothing is shown or loaded.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setConsent(value);
  };

  if (!gaId && !metaPixelId) return null;

  if (ready && consent === null) {
    return (
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed inset-x-0 bottom-0 z-[60] p-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary-900 text-white/90 shadow-2xl border border-primary-700 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
          <p className="text-xs leading-relaxed flex-1">
            We use cookies to keep you signed in and your cart working. With your permission we&apos;d also like to use
            analytics cookies to understand how visitors use our site.{" "}
            <Link href="/privacy-policy" className="underline font-semibold text-accent-gold">
              Privacy Policy
            </Link>
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => choose("declined")}
              className="px-4 py-2 rounded-full border border-white/30 text-xs font-bold hover:bg-white/10"
            >
              Decline
            </button>
            <button
              onClick={() => choose("accepted")}
              className="px-4 py-2 rounded-full bg-accent-gold text-primary-900 text-xs font-bold hover:opacity-90"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (consent !== "accepted") return null;

  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}

// Global helper to track e-commerce events safely
export function trackEcommerceEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined") {
    if ((window as any).gtag) {
      (window as any).gtag("event", eventName, params);
    }
    if ((window as any).fbq) {
      (window as any).fbq("track", eventName, params);
    }
  }
}
