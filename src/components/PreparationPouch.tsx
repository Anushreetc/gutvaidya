"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import styles from "./PreparationPouch.module.css";

/* The hero pouch "arrives" in the preparation section: it drops in from above
   along a dotted trail as the section scrolls into view, then rests beside the
   heading. Absolutely positioned, so the section's size never changes. */
export default function PreparationPouch() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 45%"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  const y = useTransform(p, [0, 1], [-320, 0]);
  const x = useTransform(p, [0, 1], [-160, 0]);
  const rotate = useTransform(p, [0, 0.7, 1], [-24, 8, -6]);
  const opacity = useTransform(p, [0, 0.25], [0, 1]);
  const trail = useTransform(p, [0.1, 1], [0, 1]);
  const scoopOpacity = useTransform(p, [0.85, 1], [0, 1]);

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <svg className={styles.trail} viewBox="0 0 220 360" fill="none">
        <motion.path
          d="M10 0 C 40 120, 200 140, 150 330"
          stroke="#c9a46a"
          strokeWidth="2"
          strokeDasharray="2 9"
          strokeLinecap="round"
          style={reduceMotion ? undefined : { pathLength: trail }}
        />
      </svg>

      <motion.div className={styles.pouch} style={reduceMotion ? undefined : { x, y, rotate, opacity }}>
        <img src="/cinematic/pouch-studio-sm.webp" alt="" width={380} height={500} loading="lazy" />
        <span className={styles.shadow} />
      </motion.div>

      <motion.span className={styles.note} style={reduceMotion ? undefined : { opacity: scoopOpacity }}>
        1 scoop · 25g · 2 min
      </motion.span>
    </div>
  );
}
