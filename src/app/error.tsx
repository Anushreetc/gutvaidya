"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary-900">Something went wrong</h1>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Sorry, this page didn&apos;t load properly. Please try again. If you were paying for an order and aren&apos;t sure
            it went through, check your email or contact us before paying again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => retry()}
              className="px-6 py-3 rounded-full bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm"
            >
              Try Again
            </button>
            <Link href="/" className="px-6 py-3 rounded-full border border-primary-200 text-primary-800 font-bold text-sm hover:bg-primary-50">
              Go to Home
            </Link>
          </div>
          <p className="text-xs text-foreground/50">
            Need help? {BUSINESS.supportEmail} · {BUSINESS.supportPhone}
            {error.digest ? <span className="block mt-1 font-mono">Reference: {error.digest}</span> : null}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
