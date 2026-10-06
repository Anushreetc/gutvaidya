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

/* The band that sits directly under the hero: star rating, the ingredient
   icon rail, and the headline numbers. Every figure here comes from the
   product itself (36+ ingredients, 500 g pouch, FSSAI licence) or from the
   10,000+ families figure used across the site — nothing is invented. */

const ICONS = [
  { icon: Wheat, label: "36+ Grains" },
  { icon: Sprout, label: "Sprouted" },
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
  { value: "500g", label: "Pouch — about 2 spoons a day" },
];

export default function ProofBand() {
  return (
    <section aria-label="Why GutVaidya" className="border-y border-primary-100 bg-white">
      {/* Star rating strip */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-7 sm:flex-row sm:justify-center sm:gap-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent-gold text-accent-gold" />
          ))}
        </div>
        <p className="text-center font-sans text-sm font-semibold text-primary-900 sm:text-base">
          Loved by 10,000+ families across India
        </p>
        <span className="hidden h-4 w-px bg-primary-200 sm:block" aria-hidden="true" />
        <p className="text-center font-sans text-xs text-foreground/60 sm:text-sm">
          FSSAI Lic. No. {BUSINESS.fssaiLicense}
        </p>
      </div>

      {/* Ingredient icon rail */}
      <div className="border-t border-primary-100/70 bg-primary-50/40">
        <ul className="mx-auto grid max-w-7xl grid-cols-4 gap-x-2 gap-y-7 px-4 py-10 sm:px-6 lg:grid-cols-8 lg:px-8">
          {ICONS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-2.5 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary-200/70 bg-white shadow-sm">
                <Icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
              </span>
              <span className="font-sans text-[11px] font-semibold leading-tight text-primary-900 sm:text-xs">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Headline numbers */}
      <div className="border-t border-primary-100/70">
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
