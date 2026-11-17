"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./IntroSplash.module.css";

/* Intro: the GUTVAIDYA wordmark builds itself letter by letter on sage,
   the "g" mark pops in, the tagline appears, then the whole screen lifts
   away like a curtain to reveal the hero. Plays on every page load (not on
   client-side navigation back to the home page), skippable, skipped for
   reduced motion. Pure CSS animation + timers, so it never depends on
   animation frames to finish. */

const DURATION_MS = 2200;
const LIFT_MS = 750;
const WORD = "GUTVAIDYA";

/* ── Tiny "intro finished" signal the hero waits on ── */
let played = false;
const listeners = new Set<() => void>();
function markDone() {
  if (played) return;
  played = true;
  listeners.forEach((fn) => fn());
}
export function introDone() {
  return played;
}
export function onIntroDone(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export default function IntroSplash() {
  const reduceMotion = useReducedMotion();
  // on → leaving (curtain lift) → off
  const [phase, setPhase] = useState<"off" | "on" | "leaving">(() => (played ? "off" : "on"));

  const dismiss = () => {
    markDone();
    setPhase((p) => (p === "on" ? "leaving" : p));
  };

  useEffect(() => {
    if (phase !== "on") return;
    if (reduceMotion) {
      const t = window.setTimeout(() => {
        markDone();
        setPhase("off");
      }, 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      markDone();
      setPhase((p) => (p === "on" ? "leaving" : p));
    }, DURATION_MS);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("off"), LIFT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "off") return null;

  return (
    <div
      className={`${styles.overlay} ${phase === "leaving" ? styles.leaving : ""}`}
      onClick={dismiss}
      role="presentation"
    >
      <div className={styles.inner}>
        <img src="/logo_transparent.png" alt="" className={styles.mark} width={219} height={237} />
        <h2 className={styles.word} aria-label="GutVaidya">
          {WORD.split("").map((ch, i) => (
            <span key={i} style={{ animationDelay: `${0.25 + i * 0.06}s` }} aria-hidden="true">
              {ch}
            </span>
          ))}
        </h2>
        <p className={styles.tag}>Heal your gut · Heal your life</p>
        <span className={styles.bar}>
          <span />
        </span>
      </div>

      <button
        type="button"
        className={styles.skip}
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
      >
        Skip
      </button>
    </div>
  );
}
