"use client";

import React from "react";
import { ArrowRight, Check, X } from "lucide-react";
import SectionHeading from "./SectionHeading";

/* "A shelf of separate ingredients, or one pouch" — the same side-by-side
   framing Ka'Chava uses, built from what actually goes into the mix. */

const SEPARATELY = [
  "Ragi, foxtail & barnyard millets",
  "Pulses for plant protein",
  "Almonds, cashews & groundnuts",
  "Flax, sesame & pumpkin seeds",
  "Ashwagandha & digestive herbs",
  "Cardamom, ajwain & jeera",
  "Sprouting, drying & roasting",
  "Milling and blending each batch",
];

const BADGES = [
  "No Added Sugar",
  "No Preservatives",
  "No Chemical Additives",
  "No Artificial Flavours",
  "100% Natural",
  "FSSAI Licensed",
];

export default function ComparisonSection() {
  return (
    <section
      aria-label="What goes into GutVaidya"
      className="bg-primary-50/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="One Pouch, Not a Shopping List"
          title="36+ ingredients. Two spoons."
          body="Sourcing, sprouting, roasting and milling each of these at home takes a full day. We do it in small batches so your morning takes two minutes."
        />

        <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
          {/* Doing it yourself */}
          <div className="rounded-3xl border border-primary-200/60 bg-white/70 p-7 sm:p-9">
            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-foreground/50">
              On your own
            </h3>
            <ul className="mt-6 space-y-3.5">
              {SEPARATELY.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                    <X className="h-3 w-3 text-foreground/50" aria-hidden="true" />
                  </span>
                  <span className="font-sans text-sm text-foreground/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex items-center justify-center lg:px-2"
            aria-hidden="true"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white shadow-sm">
              <ArrowRight className="h-5 w-5 rotate-90 text-primary-700 lg:rotate-0" />
            </span>
          </div>

          {/* The pouch */}
          <div className="rounded-3xl bg-primary-800 p-7 text-white shadow-lg sm:p-9">
            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-accent-gold-light">
              With GutVaidya
            </h3>
            <p className="mt-6 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              One 500&nbsp;g pouch.
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-white/75">
              Everything above, already sprouted, roasted and milled together. Two
              spoons into hot water or warm milk, stirred smooth.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Ready in about two minutes",
                "Same blend in every scoop",
                "Milled in small batches",
                "Nothing added to make it keep",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-gold/25">
                    <Check className="h-3 w-3 text-accent-gold-light" aria-hidden="true" />
                  </span>
                  <span className="font-sans text-sm text-white/85">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-sans text-sm font-bold text-primary-800 transition-all hover:scale-105 active:scale-95"
            >
              Shop GutVaidya
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Trust badge strip */}
        <ul className="mt-14 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {BADGES.map((b) => (
            <li
              key={b}
              className="rounded-full border border-primary-200/70 bg-white px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-primary-800 sm:text-xs"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
