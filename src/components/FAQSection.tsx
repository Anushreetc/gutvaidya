"use client";

import React from "react";
import { Plus } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { BUSINESS } from "@/lib/business";

/* FAQ accordion. Every answer is drawn from the shipping and refund policies
   or the product copy already on the site, so the two stay in step. */

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How do I prepare it?",
    a: (
      <>
        Two spoons into a glass or bowl, then add hot water or warm milk and stir
        until smooth. It thickens into a porridge as it sits, so add a little more
        liquid if you prefer it thinner.
      </>
    ),
  },
  {
    q: "What is actually in the mix?",
    a: (
      <>
        36+ ingredients: sprouted whole grains and ancient millets, pulses for plant
        protein, nuts and seeds, and Ayurvedic herbs and digestive spices. There is
        no added sugar, no preservatives, no chemical additives and no artificial
        flavours.
      </>
    ),
  },
  {
    q: "When is the best time to drink it?",
    a: (
      <>
        Most families use it as breakfast or as an evening meal replacement. One
        serving a day is enough to start; it is a whole-food mix rather than a
        supplement, so there is no fixed dose.
      </>
    ),
  },
  {
    q: "Is it safe for children and older adults?",
    a: (
      <>
        It is a food made from grains, pulses, nuts and spices, and families use it
        across age groups. Because it contains nuts and dairy-free grains, check the
        ingredient list for allergies first. If you are pregnant, managing a medical
        condition or giving it to an infant, speak to your doctor.
      </>
    ),
  },
  {
    q: "How long does delivery take?",
    a: (
      <>
        Orders are packed and dispatched within 1–2 business days (not on Sundays or
        public holidays). Delivery usually takes a further 3–7 business days
        depending on your location, and remote areas may take longer.
      </>
    ),
  },
  {
    q: "Do you offer free shipping?",
    a: (
      <>
        Yes — orders over ₹{BUSINESS.freeShippingThreshold} ship free. Below that, a
        flat ₹{BUSINESS.standardShippingFee} shipping fee applies at checkout.
      </>
    ),
  },
  {
    q: "What if I want to return an order?",
    a: (
      <>
        Approved refunds are initiated within 2 business days and go back to your
        original payment method through Razorpay. Depending on your bank, it takes a
        further 5–7 business days to appear. Full details are on our{" "}
        <a
          href="/refund-policy"
          className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
        >
          refund policy
        </a>{" "}
        page.
      </>
    ),
  },
  {
    q: "Is GutVaidya licensed?",
    a: (
      <>
        Yes. GutVaidya is manufactured under FSSAI Licence No.{" "}
        {BUSINESS.fssaiLicense}. For anything else, reach us at{" "}
        <a
          href={`mailto:${BUSINESS.supportEmail}`}
          className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
        >
          {BUSINESS.supportEmail}
        </a>{" "}
        or {BUSINESS.supportPhone}, {BUSINESS.supportHours}.
      </>
    ),
  },
];

export default function FAQSection() {
  return (
    <section id="faq" aria-label="Frequently asked questions" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Questions"
          title="Everything you might be wondering"
          body="If your question isn't here, write to us and a real person will answer."
        />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-primary-100 border-y border-primary-100">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary-700">
                <span className="font-sans text-base font-semibold text-primary-950 sm:text-lg">
                  {q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-50/70 transition-transform duration-300 group-open:rotate-45"
                >
                  <Plus className="h-4 w-4 text-primary-700" />
                </span>
              </summary>
              <p className="pb-6 pr-14 font-sans text-sm leading-relaxed text-foreground/70 sm:text-base">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
