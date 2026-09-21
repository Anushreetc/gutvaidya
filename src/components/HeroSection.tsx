"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Stars, Sparkles } from "lucide-react";

const slides = [
  {
    image: "/gutvaidya_banner1.png",
    eyebrow: "Good Food = Good Health",
    title: "Nature’s best ingredients selected for best creature",
    description:
      "Nourish your body with GutVaidya Health Mix. Specially crafted to bring a simple, balanced, and premium rhythm to your daily wellness routine.",
    ctaPrimary: "Shop GutVaidya",
    ctaSecondary: "Explore Ingredients",
    ctaSecondaryHref: "#products",
  },
  {
    image: "/gutvaidya_banner2.png",
    eyebrow: "Rooted in Wholesome Care",
    title: "Traditional Wellness for Your Entire Family",
    description:
      "Two spoons daily provides the perfect balance of gut health support, steady energy levels, and natural immunity boosters.",
    ctaPrimary: "Shop Products",
    ctaSecondary: "View Recipes",
    ctaSecondaryHref: "#recipe",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section
      id="home"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "75vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* ── Background image slideshow ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Next.js Image with fill — parent MUST have explicit position+dimensions */}
            <Image
              src={slide.image}
              alt={`GutVaidya banner ${current + 1}`}
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "top center" }}
              sizes="100vw"
            />

            {/* Dark gradient overlays for readability */}
            <div
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 52%, rgba(0,0,0,0.08) 100%)",
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background:
                  "linear-gradient(to top, rgba(10,27,7,0.60) 0%, transparent 55%)",
                zIndex: 2,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Foreground content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "3.5rem 1.5rem",
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div className="max-w-2xl text-white space-y-6">

          {/* Eyebrow badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`eyebrow-${current}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.20)",
                color: "#e5cca8",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {slide.eyebrow}
            </motion.div>
          </AnimatePresence>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${current}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${current}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              {slide.description}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${current}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all shadow-lg"
                style={{ background: "#c39b62", color: "#fff" }}
              >
                {slide.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={slide.ctaSecondaryHref}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                }}
              >
                {slide.ctaSecondary}
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-6 pt-8 text-xs sm:text-sm"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5" style={{ color: "#c39b62" }} />
              <span>Trusted by 1,00,000+ Happy Families</span>
            </div>
            <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.22)" }} />
            <div className="flex items-center gap-1.5">
              <Stars className="w-5 h-5" style={{ color: "#c39b62", fill: "#c39b62" }} />
              <span>4.8/5 Rating</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Slide indicator dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: index === current ? "32px" : "14px",
              height: "14px",
              borderRadius: "999px",
              background: index === current ? "#c39b62" : "rgba(255,255,255,0.40)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
