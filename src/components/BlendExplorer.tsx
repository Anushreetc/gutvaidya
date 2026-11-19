"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Bean, Flame, Leaf, Sprout, Wheat } from "lucide-react";
import styles from "./BlendExplorer.module.css";

/* "Goodness in the Blend": a scroll-driven journey.
   A white path crosses the section with five stops (one per ingredient
   group). The section stays pinned; each scroll gesture moves the pouch to
   the next (or previous) stop in a smooth 2.4s glide; the path behind it
   fills green. At each stop the group's card rises
   above it and the group's ingredient names float in around the pouch.
   The stop markers on the path are the only controls (they scroll to that
   stop).
   All wording comes from the original ingredients section. */

type Group = {
  key: string;
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  text: string;
  items: string[];
  aside: string;
};

const GROUPS: Group[] = [
  {
    key: "millets",
    title: "Millets",
    icon: Wheat,
    text: "Gluten-free, highly alkaline and rich in prebiotic fibers that feed beneficial gut bacteria and ease digestion.",
    items: ["Ragi", "Foxtail", "Barnyard", "Kodo", "Browntop"],
    aside: "ancient grains for gut strength",
  },
  {
    key: "protein",
    title: "Plant Based Protein",
    icon: Bean,
    text: "Split pulses that provide essential amino acids, processed to be light and easy to assimilate without causing gas.",
    items: ["Green Gram", "Black Gram", "Chana", "Toor", "Soyabean"],
    aside: "digestible protein for tissue repair",
  },
  {
    key: "herbs",
    title: "Natural Herbs",
    icon: Leaf,
    text: "Therapeutic herbs that help heal the mucosal lining, reduce stress-induced gut issues and balance the microbiome.",
    items: ["Ashwagandha", "Shatavari", "Mulethi", "Brahmi", "Moringa"],
    aside: "Ayurvedic adaptogens",
  },
  {
    key: "seeds",
    title: "Seeds",
    icon: Sprout,
    text: "Omega-3 fatty acids and soluble mucilage that lubricate the digestive tract and maintain healthy transit times.",
    items: ["Flaxseed", "Sesame Seeds"],
    aside: "lubricants & fiber powerhouses",
  },
  {
    key: "spices",
    title: "Spices",
    icon: Flame,
    text: "Carminative spices that improve nutrient absorption and relieve gas, bloating and acidity.",
    items: ["Jeera", "Saunf", "Ajwain"],
    aside: "kindling the digestive fire (Agni)",
  },
];

// Path in a 1200×300 box; it starts and ends off-screen so the pouch can
// leave on the right and come back on the left.
const PATH = "M -140 210 C 20 210, 110 110, 240 118 S 430 255, 600 215 S 820 85, 960 112 S 1150 230, 1340 205";
const VB_W = 1200;
const VB_H = 300;
const STOPS = [0.165, 0.335, 0.5, 0.665, 0.835]; // progress (0–1) along the path
const PATH_TOP = 44; // the path band starts at 44% of the stage height
// Header height (matches --nav-h in globals.css: 68px, 60px on phones)
const NAV_H = 68;

/* Scroll is split into five equal steps, one per stop. One wheel/trackpad
   gesture = one step: the page jumps to that step (invisible, the screen is
   pinned) and the pouch glides there on its own timed ease, so the move is
   always smooth no matter how hard the visitor scrolled. Scrollbar drags,
   keys and phone swipes land in a step the same way. */
const STEPS = STOPS.length;
const MOVE_S = 2.4; // seconds per glide between stops
const GLIDE_EASE = [0.65, 0, 0.35, 1] as const;
const GESTURE_GAP_MS = 220; // a new gesture needs this much wheel silence
// Scroll position (0–1) at the middle of each step
const STOP_SCROLL = STOPS.map((_, i) => (i + 0.5) / STEPS);
const stepFor = (p: number) => Math.min(STEPS - 1, Math.max(0, Math.floor(p * STEPS)));

export default function BlendExplorer() {
  const reduceMotion = useReducedMotion();
  const m = !reduceMotion;
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });

  const [stop, setStop] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [pathLen, setPathLen] = useState(0);
  const [stopPts, setStopPts] = useState<{ x: number; y: number }[]>([]);

  // Pouch position along the path; starts just off the left edge.
  const prog = useMotionValue(0.02);
  const target = useRef(-1);
  const glide = useRef<ReturnType<typeof animate> | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: [`start ${NAV_H}px`, "end end"] });

  const moveTo = useCallback(
    (i: number) => {
      if (i === target.current) return;
      target.current = i;
      setStop(i);
      setArrived(false);
      glide.current?.stop();
      if (!m) {
        prog.set(STOPS[i]);
        setArrived(true);
        return;
      }
      glide.current = animate(prog, STOPS[i], { duration: MOVE_S, ease: GLIDE_EASE });
      glide.current.then(() => {
        if (target.current === i) setArrived(true);
      });
    },
    [m, prog]
  );

  // First time the section comes into view the pouch glides in to stop 1.
  useEffect(() => {
    if (!inView || target.current !== -1) return;
    const t = window.setTimeout(() => moveTo(stepFor(scrollYProgress.get())), 0);
    return () => window.clearTimeout(t);
  }, [inView, moveTo, scrollYProgress]);

  // Any scroll that lands in a different step glides the pouch there.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (target.current === -1) return;
    const s = stepFor(p);
    if (s !== target.current) moveTo(s);
  });

  // One wheel / trackpad gesture = one stop while the section is pinned.
  useEffect(() => {
    if (!m) return;
    let lockUntil = 0;
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const sec = sectionRef.current;
      if (!sec || Math.abs(e.deltaY) < 2) return;
      const r = sec.getBoundingClientRect();
      const pinned = r.top <= NAV_H + 2 && r.bottom >= window.innerHeight - 2;
      if (!pinned) return;
      const cur = target.current < 0 ? stepFor(scrollYProgress.get()) : target.current;
      const next = cur + (e.deltaY > 0 ? 1 : -1);
      if (next < 0 || next >= STEPS) return; // past the ends: scroll the page normally
      e.preventDefault();
      const now = performance.now();
      const sameGesture = now - lastWheel < GESTURE_GAP_MS;
      lastWheel = now;
      if (now < lockUntil || sameGesture) return;
      lockUntil = now + MOVE_S * 1000 * 0.85;
      const top = r.top + window.scrollY - NAV_H;
      const runway = sec.offsetHeight - (window.innerHeight - NAV_H);
      window.scrollTo({ top: top + runway * STOP_SCROLL[next], behavior: "instant" });
      moveTo(next);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [m, moveTo, scrollYProgress]);

  // Measure the path once it is in the DOM (deferred, not a sync setState)
  // and store where each stop sits, so render never reads the DOM.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const p = pathRef.current;
      if (!p) return;
      const len = p.getTotalLength();
      setStopPts(
        STOPS.map((s) => {
          const pt = p.getPointAtLength(s * len);
          return { x: (pt.x / VB_W) * 100, y: PATH_TOP + (pt.y / VB_H) * (100 - PATH_TOP) };
        })
      );
      setPathLen(len);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // Point on the path (in % of the stage) for a progress value
  const pointAt = useCallback(
    (t: number) => {
      const p = pathRef.current;
      if (!p || !pathLen) return { x: 0, y: 0 };
      const pt = p.getPointAtLength(Math.max(0, Math.min(1, t)) * pathLen);
      return { x: (pt.x / VB_W) * 100, y: PATH_TOP + (pt.y / VB_H) * (100 - PATH_TOP) };
    },
    [pathLen]
  );

  const pouchLeft = useTransform(prog, (t) => `${pointAt(t).x}%`);
  const pouchTop = useTransform(prog, (t) => `${pointAt(t).y}%`);
  const trail = useTransform(prog, (t) => Math.max(0, Math.min(1, t)));
  // The card rides along above the pouch, kept on screen at both ends.
  const cardLeft = useTransform(prog, (t) => `${Math.min(Math.max(pointAt(t).x, 22), 78)}%`);

  /* Clicking a stop scrolls the page to that stop's dwell point */
  /* Clicking a stop jumps to its step (the screen is pinned, so the jump is
     invisible) and the pouch glides there. */
  const goTo = useCallback(
    (i: number) => {
      const sec = sectionRef.current;
      if (!sec) return;
      const top = sec.getBoundingClientRect().top + window.scrollY - NAV_H;
      const scrollable = sec.offsetHeight - (window.innerHeight - NAV_H);
      window.scrollTo({ top: top + scrollable * STOP_SCROLL[i], behavior: "instant" });
      moveTo(i);
    },
    [moveTo]
  );

  const g = GROUPS[stop];
  const Icon = g.icon;

  return (
    <section ref={sectionRef} className={styles.section} id="blend-story" data-no-reveal>
      <div className={styles.pin}>
      <header className={styles.head}>
        <span className={styles.kicker}>A pantry of possibilities</span>
        <h2 className={styles.h2}>
          Goodness in <span>the Blend.</span>
        </h2>
        <span className={styles.headNote}>36+ sprouted natural ingredients</span>
      </header>

      <div className={styles.stage}>
        {/* Path and trail */}
        <svg
          className={styles.pathSvg}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          style={{ top: `${PATH_TOP}%`, height: `${100 - PATH_TOP}%` }}
          aria-hidden="true"
        >
          <path ref={pathRef} d={PATH} className={styles.pathBase} />
          <motion.path d={PATH} className={styles.pathTrail} style={{ pathLength: trail }} />
        </svg>

        {/* Card: follows the pouch, rises above the current stop */}
        <motion.div className={styles.cardSlot} style={{ left: cardLeft }}>
          <span className={styles.bigNum} aria-hidden="true">
            {String(stop + 1).padStart(2, "0")}
          </span>
          <AnimatePresence mode="wait">
            {arrived && (
              <motion.article
                key={g.key}
                className={styles.card}
                initial={m ? { opacity: 0, y: 26, scale: 0.96 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={m ? { opacity: 0, y: -12, transition: { duration: 0.25 } } : undefined}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                aria-live="polite"
              >
                <span className={styles.cardIcon}>
                  <Icon size={22} strokeWidth={1.9} />
                </span>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{g.title}</h3>
                  <p className={styles.cardText}>{g.text}</p>
                  <span className={styles.aside}>{g.aside}</span>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stop markers: the only controls */}
        {pathLen > 0 &&
          GROUPS.map((grp, i) => {
            const p = stopPts[i];
            const StopIcon = grp.icon;
            const passed = i < stop || (i === stop && arrived);
            return (
              <button
                key={grp.key}
                type="button"
                className={`${styles.stopBtn} ${passed ? styles.stopPassed : ""} ${i === stop ? styles.stopActive : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onClick={() => goTo(i)}
                aria-label={`Go to ${grp.title}`}
                aria-pressed={i === stop}
              >
                <span className={styles.stopDot}>
                  <StopIcon size={15} strokeWidth={2} />
                </span>
                <span className={styles.stopLabel}>{grp.title}</span>
              </button>
            );
          })}

        {/* The travelling pouch, with the group's ingredients floating around it */}
        {pathLen > 0 && (
          <motion.div className={styles.traveller} style={{ left: pouchLeft, top: pouchTop }} aria-hidden="true">
            <motion.img
              src="/cinematic/pouch-studio.webp"
              alt=""
              width={558}
              height={734}
              className={styles.pouch}
              animate={{ rotate: arrived ? -4 : 9, y: arrived ? 0 : -14 }}
              transition={{ type: "spring", stiffness: 80, damping: 12 }}
            />
            <AnimatePresence>
              {arrived &&
                g.items.map((name, i) => {
                  // alternate left / right of the pouch, stacked down its sides
                  const side = i % 2 === 0 ? -1 : 1;
                  const row = Math.floor(i / 2);
                  return (
                    <motion.span
                      key={`${g.key}-${name}`}
                      className={styles.floatChip}
                      style={{
                        left: side < 0 ? "auto" : "104%",
                        right: side < 0 ? "104%" : "auto",
                        top: `${14 + row * 24 + (side > 0 ? 10 : 0)}%`,
                      }}
                      initial={m ? { opacity: 0, scale: 0.4 } : false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 + i * 0.08 }}
                    >
                      {name}
                    </motion.span>
                  );
                })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      </div>
    </section>
  );
}
