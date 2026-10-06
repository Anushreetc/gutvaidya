"use client";

import React from "react";

/* Shared section header: a small sans eyebrow over a serif headline.
   Keeps the serif for headlines only — everything else on the page is sans. */

export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left"} ${className}`}
    >
      {eyebrow && (
        <p
          className={`font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-primary-600 ${
            centered ? "" : ""
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="mt-3 font-serif text-[2.1rem] font-bold leading-[1.08] tracking-tight text-primary-950 sm:text-5xl"
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        {title}
      </h2>
      {body && (
        <p
          className={`mt-4 font-sans text-base leading-relaxed text-foreground/70 sm:text-lg ${
            centered ? "mx-auto max-w-2xl" : ""
          }`}
        >
          {body}
        </p>
      )}
    </div>
  );
}
