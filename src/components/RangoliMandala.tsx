"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./RangoliMandala.module.css";

/* Rangoli mandala: 36 = 6 rings × 6 petals, one petal per ingredient.
   Each ring is one ingredient group with its own line-drawn glyph.
   Phases (driven by the hero's loop timer):
     draw  – petals draw themselves ring by ring, centre outwards, while the
             centre counter ticks up to 36 and names the group being drawn
     hold  – the finished mandala turns slowly
     fold  – petals fold inward, outer rings first, like a lotus closing
     bloom / pouch – a cream lotus opens behind the pouch (pouch drawn by the hero)
     out   – everything fades before the next loop */

export type MandalaPhase = "draw" | "hold" | "fold" | "bloom" | "pouch" | "out";

const C = 200; // viewBox centre (400 × 400)

// Groups from the product description / ingredient list (data/products.json)
const RINGS = [
  { name: "Millets", glyph: "grain", r: 34, h: 34 },
  { name: "Pulses", glyph: "pod", r: 62, h: 34 },
  { name: "Herbs", glyph: "leaf", r: 91, h: 36 },
  { name: "Seeds", glyph: "seed", r: 120, h: 36 },
  { name: "Spices", glyph: "flame", r: 147, h: 30 },
  { name: "Nuts", glyph: "nut", r: 163, h: 18 },
] as const;

// Small line glyphs, drawn in a ±8 box pointing "up" (outwards)
const GLYPHS: Record<string, string> = {
  grain: "M0 -8 C4 -4 4 4 0 8 C-4 4 -4 -4 0 -8 Z M0 -6 L0 6 M0 -2 L-2.5 -4 M0 2 L2.5 0",
  pod: "M-7 4 C-5 -7 5 -7 7 4 C3 1 -3 1 -7 4 Z M-3.2 0.5 a1.4 1.4 0 1 0 0.01 0 M0 -1.4 a1.4 1.4 0 1 0 0.01 0 M3.2 0.5 a1.4 1.4 0 1 0 0.01 0",
  leaf: "M0 8 C-7 2 -6 -6 0 -8 C6 -6 7 2 0 8 Z M0 7 L0 -6 M0 2 L-3 -1 M0 -1 L3 -4",
  seed: "M0 -8 C5.5 -1 4.5 6 0 6.5 C-4.5 6 -5.5 -1 0 -8 Z M-1.5 2 C-1 0 0 -2 0 -4",
  flame: "M0 8 C-6 6 -6 -1 0 -8 C1 -4 6 -2 5 3 C4 6.5 2 8 0 8 Z M0 7 C-2 5 -2 2 0 0",
  nut: "M0 -8 C6 -5 6 4 0 8 C-6 4 -6 -5 0 -8 Z M0 -5 C2.5 -1 2.5 2 0 5",
};

type Petal = { ring: number; idx: number; angle: number; d: string; glyph: string; gScale: number; order: number };

const PETALS: Petal[] = RINGS.flatMap((ring, ri) => {
  const r0 = ring.r - ring.h / 2;
  const r1 = ring.r + ring.h / 2;
  // half-width: wide enough that the six petals of a ring nearly touch
  const w = Math.min(ring.r * 0.5, 44);
  // Pointed teardrop petal in local coordinates, tip pointing outwards
  const d = [
    `M 0 ${-r0}`,
    `C ${w} ${-(r0 + ring.h * 0.2)}, ${w * 0.62} ${-(r1 - ring.h * 0.12)}, 0 ${-r1}`,
    `C ${-w * 0.62} ${-(r1 - ring.h * 0.12)}, ${-w} ${-(r0 + ring.h * 0.2)}, 0 ${-r0}`,
    "Z",
  ].join(" ");
  const offset = ri % 2 === 0 ? 0 : 30; // alternate rings interleave
  return Array.from({ length: 6 }, (_, i) => ({
    ring: ri,
    idx: i,
    angle: offset + i * 60,
    d,
    glyph: GLYPHS[ring.glyph],
    gScale: Math.min(1.5, Math.max(0.9, w / 16)),
    order: ri * 6 + i,
  }));
});

const DRAW_STEP = 0.085; // seconds between petals while drawing

type Props = { phase: MandalaPhase; cycle: number; drawMs: number };

export default function RangoliMandala({ phase, cycle, drawMs }: Props) {
  // Centre counter: ticks 0 → 36 in step with the petals being drawn
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (phase !== "draw") return;
    const start = performance.now();
    const perPetal = Math.min(DRAW_STEP * 1000, (drawMs - 400) / 36);
    const id = window.setInterval(() => {
      const n = Math.min(36, Math.floor((performance.now() - start) / perPetal) + 1);
      setCount(n);
      if (n >= 36) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [phase, cycle, drawMs]);

  const drawing = phase === "draw" || phase === "hold";
  const folded = phase === "fold";
  const showMandala = drawing || folded;
  const showLotus = phase === "bloom" || phase === "pouch";
  const shown = phase === "draw" ? count : 36;
  const groupName = RINGS[Math.min(RINGS.length - 1, Math.floor(Math.max(0, shown - 1) / 6))].name;

  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* Slow, continuous turn of the whole drawing */}
      <svg className={styles.svg} viewBox="0 0 400 400">
        {/* faint guide circles */}
        <g className={styles.guides}>
          {RINGS.map((r) => (
            <circle key={r.name} cx={C} cy={C} r={r.r} />
          ))}
        </g>

        <AnimatePresence>
          {showMandala && (
            /* Fold: the whole drawing shrinks and turns around its own centre
               (its box is symmetric, so framer's default centre origin is the
               mandala centre) while each petal un-draws, outer rings first. */
            <motion.g
              key={`mandala-${cycle}`}
              initial={{ scale: 1, rotate: 0, opacity: 1 }}
              animate={folded ? { scale: 0.12, rotate: 75, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={folded ? { duration: 1, ease: [0.55, 0, 0.75, 0.3], delay: 0.15 } : { duration: 0 }}
            >
              <g className={styles.spin}>
                {/* a drawn circle at the inner edge of each ring ties the rings together */}
                {RINGS.map((r, ri) => (
                  <motion.circle
                    key={`ring-${r.name}`}
                    cx={C}
                    cy={C}
                    r={r.r - r.h / 2}
                    className={styles.ringLine}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: folded ? 0 : 1 }}
                    transition={{ duration: folded ? 0.4 : 0.6, ease: "easeInOut", delay: folded ? 0 : ri * 6 * DRAW_STEP }}
                  />
                ))}
                {PETALS.map((p) => {
                  const drawDelay = p.order * DRAW_STEP;
                  const foldDelay = (RINGS.length - 1 - p.ring) * 0.07 + p.idx * 0.012;
                  return (
                    <g key={`${p.ring}-${p.idx}`} transform={`translate(${C} ${C}) rotate(${p.angle})`}>
                      <motion.path
                        d={p.d}
                        className={`${styles.petal} ${p.ring % 2 ? styles.petalAlt : ""}`}
                        initial={{ pathLength: 0, fillOpacity: 0 }}
                        animate={folded ? { pathLength: 0, fillOpacity: 0 } : { pathLength: 1, fillOpacity: 1 }}
                        transition={
                          folded
                            ? { duration: 0.5, ease: "easeIn", delay: foldDelay }
                            : {
                                pathLength: { duration: 0.55, ease: "easeInOut", delay: drawDelay },
                                fillOpacity: { duration: 0.5, delay: drawDelay + 0.35 },
                              }
                        }
                      />
                      <motion.path
                        d={p.glyph}
                        className={styles.glyph}
                        transform={`translate(0 ${-RINGS[p.ring].r}) scale(${p.gScale})`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={folded ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
                        transition={
                          folded
                            ? { duration: 0.35, delay: foldDelay }
                            : { duration: 0.5, ease: "easeOut", delay: drawDelay + 0.25 }
                        }
                      />
                      {/* dot accent beyond the petal tip, rangoli style */}
                      <motion.circle
                        cx={0}
                        cy={-(RINGS[p.ring].r + RINGS[p.ring].h / 2 + 5)}
                        r={p.ring === RINGS.length - 1 ? 2.6 : 1.8}
                        className={styles.dot}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: folded ? 0 : 1 }}
                        transition={{ duration: 0.3, delay: folded ? foldDelay : drawDelay + 0.45 }}
                      />
                    </g>
                  );
                })}
              </g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Cream lotus that blooms behind the pouch */}
        <AnimatePresence>
          {showLotus && (
            <motion.g
              key={`lotus-${cycle}`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i} transform={`translate(${C} ${C}) rotate(${i * 45 + 22.5})`}>
                  <motion.path
                    d="M 0 -6 C 46 -40, 40 -118, 0 -150 C -40 -118, -46 -40, 0 -6 Z"
                    className={styles.lotus}
                    style={{ originX: 0.5, originY: 1 }}
                    initial={{ scale: 0, rotate: -35 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 70, damping: 13, delay: i * 0.04 }}
                  />
                </g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Centre counter while the mandala is drawn */}
      <AnimatePresence>
        {drawing && (
          <motion.div
            key={`count-${cycle}`}
            className={styles.counter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4 }}
          >
            <strong>{shown}</strong>
            <span>{shown >= 36 ? "ingredients" : groupName}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
