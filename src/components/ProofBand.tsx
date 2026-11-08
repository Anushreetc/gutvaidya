"use client";

import React from "react";
import {
  Ban,
  Droplets,
  Flame,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Sprout,
  Star,
  Wheat,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";

/* 
   Sleek, minimal Proof & Trust Band:
   - Refined trust bar with ratings, FSSAI logo, vegetarian emblem & clinical purity
   - Clean circular ingredient icon rail (spacious, lightweight, no bulky cards)
   - Headline numbers with verified pack specifications
*/

const ICONS = [
  { icon: Wheat, label: "36+ Grains" },
  { icon: Sprout, label: "100% Sprouted" },
  { icon: Leaf, label: "Plant Protein" },
  { icon: Droplets, label: "Prebiotic Fiber" },
  { icon: Flame, label: "Digestive Spices" },
  { icon: HeartPulse, label: "Ayurvedic Herbs" },
  { icon: Ban, label: "No Added Sugar" },
  { icon: ShieldCheck, label: "FSSAI Licensed" },
];

const STATS = [
  { value: "36+", label: "Grains, millets, nuts & herbs in every scoop" },
  { value: "10,000+", label: "Families nourished across India" },
  { value: "0g", label: "Added sugar, ever" },
  { value: "500g", label: "20 servings (1 scoop / 25g daily)" },
];

export default function ProofBand() {
  return (
    <section aria-label="Why GutVaidya" className="border-y border-base-400/60 bg-base-50">
      {/* Sleek Trust & Quality Certification Bar */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
        {/* Star Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent-gold text-accent-gold" />
            ))}
          </div>
          <p className="font-sans text-xs font-semibold text-primary-900 sm:text-sm">
            Loved by 10,000+ families across India
          </p>
        </div>

        <span className="hidden h-4 w-px bg-primary-200/80 sm:block" aria-hidden="true" />

        {/* FSSAI with Logo */}
        <div className="flex items-center gap-2">
          <img src="/FSSAI_logo.png" alt="FSSAI" className="h-4.5 w-auto object-contain" />
          <span className="font-sans text-xs font-medium text-foreground/75">
            Lic. No. {BUSINESS.fssaiLicense}
          </span>
        </div>

        <span className="hidden h-4 w-px bg-primary-200/80 md:block" aria-hidden="true" />

        {/* 100% Vegetarian Mark */}
        <div className="flex items-center gap-1.5">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-xs border border-emerald-700 bg-white p-0.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
          </span>
          <span className="font-sans text-xs font-medium text-emerald-900">
            100% Vegetarian
          </span>
        </div>

        <span className="hidden h-4 w-px bg-primary-200/80 lg:block" aria-hidden="true" />

        {/* Purity Guarantee */}
        <p className="hidden font-sans text-xs font-medium text-foreground/70 lg:block">
          Clinically Tested • Zero Preservatives
        </p>
      </div>

      {/* Ingredient & Benefit Icon Rail (Minimal circular badges) */}
      <div className="border-t border-base-400/50 bg-base-200/70">
        <ul className="mx-auto grid max-w-7xl grid-cols-4 gap-x-3 gap-y-7 px-4 py-9 sm:px-6 lg:grid-cols-8 lg:px-8">
          {ICONS.map(({ icon: Icon, label }) => (
            <li key={label} className="group flex flex-col items-center gap-2.5 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-base-400/70 bg-base-50 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:border-primary-400">
                <Icon className="h-6 w-6 text-primary-700 transition-colors group-hover:text-primary-900" aria-hidden="true" />
              </span>
              <span className="font-sans text-[11px] font-semibold leading-tight text-primary-900 sm:text-xs">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Headline Numbers */}
      <div className="border-t border-base-400/50">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.value} className="px-2 text-center lg:px-6">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-sans text-4xl font-bold tracking-tight text-primary-700 sm:text-5xl">
                  {s.value}
                </span>
                <span className="mt-2 block font-sans text-xs leading-snug text-foreground/65 sm:text-sm">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
