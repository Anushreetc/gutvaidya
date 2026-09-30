import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS, POLICY_LINKS } from "@/lib/business";

interface PolicyPageProps {
  title: string;
  intro: string;
  path: string;
  children: React.ReactNode;
}

// Shared shell for the legal/policy pages
export default function PolicyPage({ title, intro, path, children }: PolicyPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfb]">
      <Navbar />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap gap-2 mb-8" aria-label="Store policies">
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  link.href === path
                    ? "bg-primary-700 text-white border-primary-700"
                    : "border-primary-200 text-primary-800 hover:bg-primary-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <article className="bg-white rounded-3xl border border-primary-100 p-6 sm:p-10 shadow-sm">
            <h1 className="text-3xl font-serif font-bold text-primary-900">{title}</h1>
            <p className="text-xs text-foreground/50 mt-2">Last updated: {BUSINESS.policiesLastUpdated}</p>
            <p className="text-sm text-foreground/70 leading-relaxed mt-5">{intro}</p>

            <div className="mt-8 space-y-8 text-sm text-foreground/80 leading-relaxed [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-lg [&_h2]:text-primary-900 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_p+p]:mt-2 [&_a]:text-primary-700 [&_a]:font-semibold [&_a:hover]:underline">
              {children}
            </div>

            <section className="mt-10 p-5 rounded-2xl bg-primary-50/60 border border-primary-100 text-sm">
              <h2 className="font-serif font-bold text-base text-primary-900 mb-2">Contact &amp; Grievance Officer</h2>
              <p className="text-foreground/70">
                For questions or complaints about this policy or your order, contact our grievance officer. We
                acknowledge complaints within 48 hours and aim to resolve them within 30 days.
              </p>
              <ul className="mt-3 space-y-1 text-foreground/80">
                <li>
                  Email: <a href={`mailto:${BUSINESS.supportEmail}`} className="font-semibold text-primary-700">{BUSINESS.supportEmail}</a>
                </li>
                <li>
                  Phone: <a href={BUSINESS.supportPhoneHref} className="font-semibold text-primary-700">{BUSINESS.supportPhone}</a> ({BUSINESS.supportHours})
                </li>
                <li>FSSAI Lic. No. {BUSINESS.fssaiLicense}</li>
              </ul>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
