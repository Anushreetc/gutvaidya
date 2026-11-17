"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/types/ecommerce";
import styles from "./HeroShowcase.module.css";
import { introDone, onIntroDone } from "./IntroSplash";

/* ─────────────────────────────────────────────────────────────
   Hero: exactly one screen tall, everything sized to fit.
   Left: a looping ring scene
     1. ingredient names pop onto the white ring, clockwise
     2. they swirl into the centre
     3. a soft white flash
     4. the pouch appears with its stat bubbles, floats, then fades
     … and the loop starts again.
   Right: headline, copy and buy button (static after their entrance).
   Bottom: the curved marquee band.
   ───────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

// Ingredient names exactly as listed in the original ingredients section.
const OUTER = ["Ragi", "Foxtail", "Barnyard", "Kodo", "Browntop", "Green Gram", "Black Gram", "Chana", "Toor", "Soyabean", "Red Rice", "Dalia"];
const INNER = ["Jeera", "Saunf", "Ajwain", "Flaxseed", "Sesame", "Ashwagandha", "Shatavari", "Mulethi", "Moringa", "Brahmi"];
const RING_R = 44; // ring radius, % of the stage
const INNER_R = 29;

type Chip = { name: string; x: number; y: number; delay: number; inner: boolean };
const CHIPS: Chip[] = [
  ...OUTER.map((name, i) => {
    const a = ((-90 + (i * 360) / OUTER.length) * Math.PI) / 180;
    return { name, x: 50 + RING_R * Math.cos(a), y: 50 + RING_R * Math.sin(a), delay: i * 0.08, inner: false };
  }),
  ...INNER.map((name, i) => {
    const a = ((-72 + (i * 360) / INNER.length) * Math.PI) / 180;
    return { name, x: 50 + INNER_R * Math.cos(a), y: 50 + INNER_R * Math.sin(a), delay: 1 + i * 0.08, inner: true };
  }),
];

// Bubbles sit on the ring's left arc while the pouch is shown.
const BUBBLES = [
  { angle: 132, value: "36+", label: "ingredients" },
  { angle: 180, value: "22g", label: "plant protein" },
  { angle: 228, value: "Zero", label: "added sugar" },
];

// Loop timings (ms)
type Phase = "fill" | "gather" | "flash" | "pouch" | "out";
const PHASES: { phase: Phase; ms: number }[] = [
  { phase: "fill", ms: 2600 },
  { phase: "gather", ms: 800 },
  { phase: "flash", ms: 450 },
  { phase: "pouch", ms: 4600 },
  { phase: "out", ms: 700 },
];

// Wording from the product's own benefit list (data/products.json)
const MARQUEE = "36+ SPROUTED NATURAL INGREDIENTS · ZERO ADDED SUGAR · NO PRESERVATIVES · RICH IN PREBIOTIC FIBER · GENTLE ON SENSITIVE STOMACHS · ";

type Props = {
  product: Product;
  onAddToCart: () => void;
};

export default function HeroShowcase({ product, onAddToCart }: Props) {
  const reduceMotion = useReducedMotion();
  const m = !reduceMotion;
  const [ready, setReady] = useState(() => introDone());
  useEffect(() => {
    if (ready) return;
    return onIntroDone(() => setReady(true));
  }, [ready]);
  const show = ready || !m;

  /* ── Ring loop (timer driven, so it never stalls on animation frames) ── */
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const phase: Phase = m ? PHASES[step].phase : "pouch";
  useEffect(() => {
    if (!m || !show) return;
    const t = window.setTimeout(() => {
      const next = (step + 1) % PHASES.length;
      if (next === 0) setCycle((c) => c + 1);
      setStep(next);
    }, PHASES[step].ms);
    return () => window.clearTimeout(t);
  }, [step, m, show]);

  const chipsVisible = phase === "fill" || phase === "gather";
  const pouchVisible = phase === "pouch" || !m;

  /* Pointer: the pouch leans towards the cursor */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 16 });
  const sy = useSpring(py, { stiffness: 60, damping: 16 });
  const leanX = useTransform(sx, [-1, 1], [-12, 12]);
  const leanY = useTransform(sy, [-1, 1], [-8, 8]);
  const leanR = useTransform(sx, [-1, 1], [-4, 4]);
  const onPointerMove = (e: React.PointerEvent) => {
    if (!m || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const soldOut = product.stock_quantity <= 0;
  const enter = (delay: number, from: Record<string, number | string> = { opacity: 0, y: 24 }) => ({
    initial: m ? from : false,
    animate: show ? { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 } : undefined,
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section
      className={styles.hero}
      data-no-reveal
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      aria-label="GutVaidya Diet Powder"
    >
      <div className={styles.grid}>
        {/* ── Stage: the looping ring scene ── */}
        <div className={styles.stage} aria-hidden="true">
          <motion.svg
            className={styles.ring}
            viewBox="0 0 100 100"
            initial={m ? { opacity: 0, scale: 0.6, rotate: -40 } : false}
            animate={show ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <circle cx="50" cy="50" r={RING_R} className={styles.ringMain} />
            <circle cx="50" cy="50" r={RING_R - 6} className={styles.ringDash} />
          </motion.svg>

          {/* 1–2. Ingredient chips: pop onto the ring, then swirl into the centre */}
          {m && show && (
            <AnimatePresence>
              {chipsVisible &&
                CHIPS.map((c) => (
                  <motion.span
                    key={`${cycle}-${c.name}`}
                    className={`${styles.chip} ${c.inner ? styles.chipInner : ""}`}
                    initial={{ left: `${c.x}%`, top: `${c.y}%`, opacity: 0, scale: 0.3 }}
                    animate={
                      phase === "gather"
                        ? { left: "50%", top: "50%", opacity: 0, scale: 0.2, rotate: 160 }
                        : { left: `${c.x}%`, top: `${c.y}%`, opacity: 1, scale: 1, rotate: 0 }
                    }
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={
                      phase === "gather"
                        ? { duration: 0.75, ease: [0.55, 0, 0.75, 0.3], delay: c.delay * 0.12 }
                        : { type: "spring", stiffness: 320, damping: 18, delay: c.delay }
                    }
                  >
                    {c.name}
                  </motion.span>
                ))}
            </AnimatePresence>
          )}

          {/* 3. Flash */}
          <span className={`${styles.flash} ${phase === "flash" ? styles.flashOn : ""}`} />

          {/* 4. Pouch + bubbles */}
          <AnimatePresence>
            {show && pouchVisible && (
              <motion.div
                key={`pouch-${cycle}`}
                className={styles.pouchWrap}
                style={m ? { x: leanX, y: leanY, rotate: leanR } : undefined}
                initial={m ? { opacity: 0, scale: 0.55 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.6, ease: "easeIn" } }}
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
              >
                <img
                  src="/cinematic/pouch-studio.webp"
                  alt=""
                  width={558}
                  height={734}
                  className={styles.pouch}
                  fetchPriority="high"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {show &&
              pouchVisible &&
              BUBBLES.map((b, i) => {
                const a = (b.angle * Math.PI) / 180;
                return (
                  <motion.div
                    key={`${cycle}-${b.label}`}
                    className={styles.bubble}
                    style={{ left: `${50 + RING_R * Math.cos(a)}%`, top: `${50 + RING_R * Math.sin(a)}%` }}
                    initial={m ? { opacity: 0, scale: 0 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.35 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.35 + i * 0.15 }}
                  >
                    <strong>{b.value}</strong>
                    <span>{b.label}</span>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* Hand-drawn notes (wording from the original site) */}
          <motion.div className={`${styles.note} ${styles.noteTop}`} {...enter(1.25, { opacity: 0, y: 10 })}>
            <span>100% traditional<br />Ayurvedic mix</span>
            <svg viewBox="0 0 90 70" className={styles.arrow}>
              <motion.path
                d="M8 6 C 40 4, 72 18, 70 52 M 58 42 L 70 54 L 80 40"
                initial={m ? { pathLength: 0 } : false}
                animate={show ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.9, ease: "easeInOut", delay: 1.4 }}
              />
            </svg>
          </motion.div>

          <motion.div className={`${styles.note} ${styles.noteBottom}`} {...enter(1.5, { opacity: 0, y: 10 })}>
            <svg viewBox="0 0 90 60" className={styles.arrow}>
              <motion.path
                d="M84 50 C 60 56, 22 48, 14 14 M 6 26 L 14 12 L 26 22"
                initial={m ? { pathLength: 0 } : false}
                animate={show ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.9, ease: "easeInOut", delay: 1.65 }}
              />
            </svg>
            <span>ready in about two minutes</span>
          </motion.div>
        </div>

        {/* ── Copy ── */}
        <div className={styles.copy}>
          <motion.span className={styles.kicker} {...enter(0.35, { opacity: 0, y: 12 })}>
            Ayurvedic diet powder · meal replacement
          </motion.span>

          <h1 className={styles.title}>
            {["HEAL YOUR GUT.", "HEAL YOUR LIFE."].map((line, li) => (
              <span key={line} className={`${styles.line} ${li === 1 ? styles.lineLight : ""}`}>
                {line.split(" ").map((w, wi) => (
                  <span key={wi} className={styles.wordMask}>
                    <motion.span
                      initial={m ? { y: "110%" } : false}
                      animate={show ? { y: "0%" } : undefined}
                      transition={{ duration: 0.75, ease: EASE, delay: 0.45 + li * 0.18 + wi * 0.07 }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p className={styles.body} {...enter(0.9)}>
            Crafted with over 36 sprouted grains, ancient millets, organic nuts and sacred Ayurvedic herbs.
            Easy to digest, supports gut microbiome balance and gives sustained natural energy, without
            artificial sweeteners or chemical preservatives.
          </motion.p>

          <motion.div className={styles.ctaRow} {...enter(1.05)}>
            <button type="button" className={styles.buy} onClick={onAddToCart} disabled={soldOut}>
              <span className={styles.buyIcon}>
                <ArrowUpRight size={18} strokeWidth={2.2} />
              </span>
              {soldOut ? "Out of stock" : "Buy now"}
              {!soldOut && <span className={styles.buyPrice}>₹{product.price}</span>}
            </button>
            <a className={styles.ghost} href="#preparation">
              How to prepare
            </a>
          </motion.div>

          <motion.div className={styles.rating} {...enter(1.2)}>
            <span className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            4.9 / 5.0 · 500+ happy customers
          </motion.div>
        </div>
      </div>

      {/* ── Curved marquee band ── */}
      <motion.div
        className={styles.marqueeWrap}
        initial={m ? { y: 120, opacity: 0 } : false}
        animate={show ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: EASE, delay: 0.6 }}
        aria-hidden="true"
      >
        <CurvedMarquee text={MARQUEE} run={m && show} />
      </motion.div>
    </section>
  );
}

/* Thick arched band with text running along it. The text is repeated and
   its startOffset is shifted by exactly one repeat per loop, so it never
   jumps. */
function CurvedMarquee({ text, run }: { text: string; run: boolean }) {
  const textRef = useRef<SVGTextPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const tp = textRef.current;
    const meas = measureRef.current;
    if (!tp || !meas || !run) return;
    const unit = meas.getComputedTextLength();
    if (!unit) return;
    let raf = 0;
    let offset = 0;
    let last = performance.now();
    const speed = 70; // px per second along the curve
    const tick = (now: number) => {
      offset -= ((now - last) / 1000) * speed;
      last = now;
      if (offset <= -unit) offset += unit;
      tp.setAttribute("startOffset", String(offset));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  return (
    <svg className={styles.marquee} viewBox="0 0 1440 190" preserveAspectRatio="xMidYMax slice">
      <defs>
        <path id="gv-arc" d="M -260 196 Q 720 -46 1700 196" />
      </defs>
      <use href="#gv-arc" className={styles.band} />
      <text className={styles.bandText} dy="15">
        <textPath ref={textRef} href="#gv-arc" startOffset="0">
          {text.repeat(5)}
        </textPath>
      </text>
      {/* hidden: measures one repeat so the loop is seamless */}
      <text ref={measureRef} className={`${styles.bandText} ${styles.measure}`}>
        {text}
      </text>
    </svg>
  );
}
