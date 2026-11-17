"use client";

import { useEffect } from "react";

/* Entrance animations for every home-page section below the hero.
   As a section scrolls into view its blocks fade and rise in; lists and
   grids (cards, steps, reviews, FAQs, footer columns) come in one after
   another with a short stagger. One observer, CSS transitions only
   (.gv-reveal / .gv-in in globals.css).
   - Sections with data-no-reveal (hero, blend) keep their own animation.
   - Elements already animated by framer-motion (inline transform/opacity)
     are left alone so the two never fight.
   - Reduced motion: nothing is hidden, nothing moves.
   - Content is visible in the server HTML; it is only hidden once this runs,
     and only below the fold, so there is no flash and no hidden content
     without JavaScript. */

const STAGGER_MS = 90;
const MAX_STAGGER = 6;

function isAnimatedByFramer(el: HTMLElement) {
  return Boolean(el.style.transform || el.style.opacity);
}

function looksLikeList(el: HTMLElement) {
  if (el.children.length < 3) return false;
  const d = getComputedStyle(el).display;
  return d.includes("grid") || d.includes("flex");
}

export default function HomeReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const roots = Array.from(
      document.querySelectorAll<HTMLElement>("main section:not([data-no-reveal]), body footer")
    ).filter((s) => !s.closest("[data-no-reveal]") && !s.parentElement?.closest("main section"));

    const targets: HTMLElement[] = [];
    const add = (el: HTMLElement, delay: number) => {
      if (isAnimatedByFramer(el) || el.classList.contains("gv-reveal")) return;
      // Never hide what is already on screen when this runs.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      el.style.setProperty("--gv-d", `${delay}ms`);
      el.classList.add("gv-reveal");
      targets.push(el);
    };

    // Walk one level of plain wrappers, then reveal blocks; lists stagger.
    const visit = (parent: HTMLElement, depth: number) => {
      Array.from(parent.children).forEach((child) => {
        const el = child as HTMLElement;
        const pos = getComputedStyle(el).position;
        if (pos === "absolute" || pos === "fixed") return; // decorations
        if (looksLikeList(el)) {
          Array.from(el.children).forEach((item, i) => add(item as HTMLElement, Math.min(i, MAX_STAGGER) * STAGGER_MS));
        } else if (depth < 1 && el.children.length === 1 && el.firstElementChild) {
          visit(el, depth + 1);
        } else {
          add(el, 0);
        }
      });
    };
    roots.forEach((r) => visit(r, 0));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).classList.add("gv-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    targets.forEach((t) => io.observe(t));

    // Safety net: if the observer is ever delayed (background tab, old
    // browser), anything already scrolled into view is revealed on scroll.
    let pending = 0;
    const sweep = () => {
      pending = 0;
      const limit = window.innerHeight * 0.95;
      targets.forEach((t) => {
        if (!t.classList.contains("gv-in") && t.getBoundingClientRect().top < limit) t.classList.add("gv-in");
      });
    };
    const onScroll = () => {
      if (!pending) pending = window.setTimeout(sweep, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(pending);
      io.disconnect();
      targets.forEach((t) => t.classList.remove("gv-reveal", "gv-in"));
    };
  }, []);

  return null;
}
