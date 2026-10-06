"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  transform as interpolate,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Scroll-driven 3D Hero Motion:
   WebP frame sequence (240 frames) rendered smoothly on HTML5 Canvas,
   scrubbed by page scroll position with chapters & typography.
   ───────────────────────────────────────────────────────────── */

const HERO_SEQUENCE = {
  desktop: { path: "/hero/desktop/f_", frameCount: 240 },
  mobile: null as null | { path: string; frameCount: number },
  durationSec: 56.586,
  scrollLengthVh: 500, // 500vh provides smooth, natural scroll pacing
  // The generated pouch loses its label for frames ~45-57 (10.4-13.3s).
  // pouch-label.png is the labelled pouch cut from frame 44 (x 335, y 102,
  // 190x290 px of the 848x478 frame) with feathered edges; painted over that stretch.
  pouchOverlay: {
    src: "/hero/pouch-label.png" as string | null,
    rect: { x: 335 / 848, y: 102 / 478, w: 190 / 848, h: 290 / 478 },
    fromSec: 10.2,
    toSec: 13.4,
    fadeSec: 0.25,
  },
};

const BG = "#fdfdfb";
const PORTRAIT_BAND = { top: 0.08, height: 0.48, focalX: 0.55 };

type Chapter = {
  id: string;
  fromSec: number;
  toSec: number;
  badge?: string;
  title: string;
  body: string;
  cta?: boolean;
  isFinal?: boolean;
};

const CHAPTERS: Chapter[] = [
  {
    id: "intro",
    fromSec: 0,
    toSec: 8,
    badge: "100% Traditional Ayurvedic Mix",
    title: "Heal your gut, heal your life.",
    body: "GutVaidya Diet Powder is a wholesome meal replacement crafted with 36+ ancient grains, millets, organic nuts, and sacred herbs.",
    cta: true,
  },
  {
    id: "ingredients",
    fromSec: 9.5,
    toSec: 20,
    badge: "Sprouted Nutrition",
    title: "Ancient millets. Plant protein. Ayurvedic herbs.",
    body: "Handpicked grains, pulses, and digestive spices chosen specifically for how gently and nourishingly they sit in your gut.",
  },
  {
    id: "milling",
    fromSec: 21,
    toSec: 27,
    badge: "Pure & Traditional Craft",
    title: "Milled in small batches. Zero chemicals.",
    body: "No added sugar, no preservatives, no chemical additives, and zero artificial flavors. 100% unadulterated nature.",
  },
  {
    id: "spoon",
    fromSec: 28,
    toSec: 37,
    badge: "Effortless Preparation",
    title: "Two spoons a day.",
    body: "One serving goes straight into your glass or bowl for daily sustained vitality and digestive balance.",
  },
  {
    id: "water",
    fromSec: 38,
    toSec: 46,
    badge: "Instant Porridge",
    title: "Just add hot water or warm milk.",
    body: "An instant, nutrient-dense mix. Stir until smooth and enjoy it warm as a nourishing breakfast porridge.",
  },
  {
    id: "ritual",
    fromSec: 48.5,
    toSec: HERO_SEQUENCE.durationSec,
    badge: "Daily Vitality Ritual",
    title: "Your daily gut ritual.",
    body: "Experience light digestion, steady all-day energy, and holistic wellness with GutVaidya Health Mix.",
    cta: true,
    isFinal: true,
  },
];

const toProgress = (sec: number) => Math.min(1, Math.max(0, sec / HERO_SEQUENCE.durationSec));
const frameUrl = (path: string, i: number) => `${path}${String(i + 1).padStart(3, "0")}.webp`;

/* Load frames in progressive passes for instant responsiveness */
function loadOrder(count: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  for (let step = 16; step >= 1; step = Math.floor(step / 2)) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(count - 1)) order.push(count - 1);
  return order;
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const pouchRef = useRef<HTMLImageElement | null>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const seq =
    isPortrait && HERO_SEQUENCE.mobile ? HERO_SEQUENCE.mobile : HERO_SEQUENCE.desktop;
  const bandMode = isPortrait && !HERO_SEQUENCE.mobile;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ── Canvas Drawing Loop ── */
  const draw = useCallback(() => {
    rafRef.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const frames = framesRef.current;
    if (!frames.length) return;
    const p = reduceMotion ? 1 : progressRef.current;
    const target = Math.round(p * (frames.length - 1));

    // Use the nearest frame that has loaded
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < frames.length && !img; d++) {
      img = frames[target - d] ?? frames[target + d] ?? null;
    }
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    let dw: number, dh: number, dx: number, dy: number;
    if (bandMode) {
      dh = ch * PORTRAIT_BAND.height;
      dw = (dh * iw) / ih;
      if (dw < cw) {
        dw = cw;
        dh = (cw * ih) / iw;
      }
      dx = Math.min(0, Math.max(cw - dw, cw / 2 - PORTRAIT_BAND.focalX * dw));
      dy = ch * PORTRAIT_BAND.top;
    } else {
      const s = Math.max(cw / iw, ch / ih);
      dw = iw * s;
      dh = ih * s;
      dx = (cw - dw) / 2;
      dy = (ch - dh) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);

    // Real pouch overlay if defined
    const po = HERO_SEQUENCE.pouchOverlay;
    const pouch = pouchRef.current;
    if (pouch) {
      const t = p * HERO_SEQUENCE.durationSec;
      const a = Math.min(
        (t - po.fromSec) / po.fadeSec,
        (po.toSec - t) / po.fadeSec,
        1
      );
      if (a > 0) {
        ctx.globalAlpha = a;
        ctx.drawImage(
          pouch,
          dx + po.rect.x * dw,
          dy + po.rect.y * dh,
          po.rect.w * dw,
          po.rect.h * dh
        );
        ctx.globalAlpha = 1;
      }
    }

    // Soft gradient transitions in portrait band mode
    if (bandMode) {
      const fade = dh * 0.18;
      const top = ctx.createLinearGradient(0, dy, 0, dy + fade);
      top.addColorStop(0, BG);
      top.addColorStop(1, "rgba(253,253,251,0)");
      ctx.fillStyle = top;
      ctx.fillRect(0, dy, cw, fade);
      const bottom = ctx.createLinearGradient(0, dy + dh - fade, 0, dy + dh);
      bottom.addColorStop(0, "rgba(253,253,251,0)");
      bottom.addColorStop(1, BG);
      ctx.fillStyle = bottom;
      ctx.fillRect(0, dy + dh - fade, cw, fade + 1);
    }
  }, [bandMode, reduceMotion]);

  const requestDraw = useCallback(() => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  /* ── Orientation Listener ── */
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── Canvas Auto-Resize with High-DPI Support ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      requestDraw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [requestDraw]);

  /* ── Progressive Frame Loading ── */
  useEffect(() => {
    let cancelled = false;
    const frames: (HTMLImageElement | null)[] = new Array(seq.frameCount).fill(null);
    framesRef.current = frames;

    const order = reduceMotion ? [seq.frameCount - 1] : loadOrder(seq.frameCount);
    let next = 0;
    const PARALLEL = 6;

    const loadNext = () => {
      if (cancelled || next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(seq.path, i);
      img.onload = () => {
        if (cancelled) return;
        frames[i] = img;
        requestDraw();
        loadNext();
      };
      img.onerror = loadNext;
    };
    for (let k = 0; k < PARALLEL; k++) loadNext();

    return () => {
      cancelled = true;
    };
  }, [seq.path, seq.frameCount, reduceMotion, requestDraw]);

  /* ── Pouch Overlay Image ── */
  useEffect(() => {
    const src = HERO_SEQUENCE.pouchOverlay.src;
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      pouchRef.current = img;
      requestDraw();
    };
  }, [requestDraw]);

  /* ── Scroll Progress & Chapter Tracker ── */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    requestDraw();
    const t = v * HERO_SEQUENCE.durationSec;
    let idx = 0;
    CHAPTERS.forEach((c, i) => {
      if (t >= c.fromSec - 1) idx = i;
    });
    setActiveChapter((prev) => (prev === idx ? prev : idx));
  });

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const p = toProgress(CHAPTERS[i].fromSec + (i === 0 ? 0 : 1.2));
    window.scrollTo({ top: top + p * scrollable, behavior: "smooth" });
  };

  /* ── Reduced Motion Fallback ── */
  if (reduceMotion) {
    return (
      <section ref={sectionRef} id="home" className="relative h-[100svh] min-h-[560px]" style={{ background: BG }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <Scrim bandMode={bandMode} />
        <TextLayer bandMode={bandMode}>
          <ChapterSlot visible>
            <ChapterCopy chapter={CHAPTERS[0]} headingLevel={1} />
          </ChapterSlot>
        </TextLayer>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="GutVaidya 3D Journey"
      className="relative"
      style={{ height: `${HERO_SEQUENCE.scrollLengthVh}vh`, background: BG }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Preloaded initial frame for instant paint */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameUrl(HERO_SEQUENCE.desktop.path, 0)}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover portrait:top-[8svh] portrait:bottom-auto portrait:h-[48svh] portrait:object-[55%_50%]"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <Scrim bandMode={bandMode} />

        <TextLayer bandMode={bandMode}>
          {CHAPTERS.map((c, i) => (
            <ScrollChapter key={c.id} chapter={c} index={i} progress={scrollYProgress} />
          ))}
        </TextLayer>

        {/* Chapter Rail Navigation Dots */}
        <nav
          aria-label="Hero chapters"
          className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3.5 sm:flex landscape:flex"
        >
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={c.title}
              aria-current={i === activeChapter ? "step" : undefined}
              className="group flex h-6 w-6 items-center justify-center rounded-full outline-none transition-transform hover:scale-125 focus-visible:ring-2 focus-visible:ring-primary-700"
            >
              <span
                className="block rounded-full transition-all duration-300 shadow-sm"
                style={{
                  width: 6,
                  height: i === activeChapter ? 24 : 6,
                  background: i === activeChapter ? "#1f4f16" : "rgba(31,79,22,0.3)",
                }}
              />
            </button>
          ))}
        </nav>

        <ScrollHint progress={scrollYProgress} />
      </div>
    </section>
  );
}

/* ── Layout & Typography Layers ── */

function Scrim({ bandMode }: { bandMode: boolean }) {
  if (bandMode) return null;
  return (
    <>
      {/* Below lg the copy covers more of the frame, so the scrim reaches further */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] lg:hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(253,253,251,0.96) 0%, rgba(253,253,251,0.88) 45%, rgba(253,253,251,0.5) 60%, rgba(253,253,251,0) 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(253,253,251,0.96) 0%, rgba(253,253,251,0.85) 28%, rgba(253,253,251,0.4) 42%, rgba(253,253,251,0) 52%)",
        }}
      />
    </>
  );
}

function TextLayer({ bandMode, children }: { bandMode: boolean; children: React.ReactNode }) {
  return bandMode ? (
    <div
      className="absolute inset-x-0 bottom-0 z-10 px-6"
      style={{ top: `calc(${(PORTRAIT_BAND.top + PORTRAIT_BAND.height) * 100}svh + 1.25rem)` }}
    >
      <div className="relative h-full">{children}</div>
    </div>
  ) : (
    <div className="absolute inset-x-0 bottom-0 top-12 z-10 mx-auto flex max-w-7xl items-center px-6 sm:top-13 lg:px-12">
      <div className="relative h-full w-full max-w-[36rem] short:max-w-[28rem]">{children}</div>
    </div>
  );
}

function ScrollChapter({
  chapter,
  index,
  progress,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
}) {
  const fade = 0.012;
  const start = toProgress(chapter.fromSec);
  const end = toProgress(chapter.toSec);

  const input = chapter.isFinal
    ? [start, start + fade, 1]
    : index === 0
      ? [0, end - fade, end]
      : [start, start + fade, end - fade, end];
  const opacityOut = chapter.isFinal ? [0, 1, 1] : index === 0 ? [1, 1, 0] : [0, 1, 1, 0];
  const yOut = chapter.isFinal ? [16, 0, 0] : index === 0 ? [0, 0, -16] : [16, 0, 0, -16];

  const toOpacity = interpolate(input, opacityOut);
  const toY = interpolate(input, yOut);
  const opacity = useTransform(progress, (v) => toOpacity(v));
  const y = useTransform(progress, (v) => toY(v));
  const [visible, setVisible] = useState(index === 0);
  useMotionValueEvent(opacity, "change", (v) => setVisible(v > 0.05));

  return (
    <ChapterSlot visible={visible}>
      <motion.div style={{ opacity, y }}>
        <ChapterCopy chapter={chapter} headingLevel={index === 0 ? 1 : 2} />
      </motion.div>
    </ChapterSlot>
  );
}

function ChapterSlot({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-x-0 top-0 landscape:top-1/2 landscape:-translate-y-1/2"
      aria-hidden={!visible}
      inert={!visible}
    >
      {children}
    </div>
  );
}

function ChapterCopy({ chapter, headingLevel }: { chapter: Chapter; headingLevel: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="space-y-4 compact:space-y-3 short:space-y-2.5">
      {chapter.badge && (
        <span className="compact:hidden short:hidden inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-100/90 text-primary-800 text-xs font-semibold uppercase tracking-wider border border-primary-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
          {chapter.badge}
        </span>
      )}

      <Heading
        className="font-serif font-bold leading-[1.08] text-primary-950 text-[2.2rem] sm:text-5xl lg:text-[3.5rem] compact:text-[2rem] short:text-[2rem] tracking-tight"
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        {chapter.title}
      </Heading>

      <p className="max-w-[30rem] text-base leading-relaxed text-foreground/80 sm:text-lg compact:text-[0.95rem] short:text-[0.95rem] font-sans">
        {chapter.body}
      </p>

      {chapter.cta && (
        <div className="pt-3 compact:pt-1 short:pt-1 flex flex-wrap items-center gap-3.5">
          <a
            href="#products"
            className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-7 py-3.5 compact:px-5 compact:py-3 short:px-5 short:py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-800 hover:scale-105 active:scale-95"
          >
            Shop GutVaidya
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          {!chapter.isFinal && (
            <a
              href="#ingredients"
              className="inline-flex items-center rounded-full border border-primary-700/25 bg-white/80 px-7 py-3.5 compact:px-5 compact:py-3 short:px-5 short:py-3 max-[399px]:portrait:hidden text-sm font-bold text-primary-800 backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-sm"
            >
              See what’s inside
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const toOpacity = interpolate([0, 0.025], [1, 0]);
  const opacity = useTransform(progress, (v) => toOpacity(v));
  return (
    <motion.div
      style={{ opacity }}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex portrait:hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium text-primary-800/70"
    >
      Scroll to explore the 3D journey
      <span className="block h-8 w-px overflow-hidden bg-primary-800/20">
        <motion.span
          className="block h-3 w-px bg-primary-700"
          animate={{ y: [-12, 32] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.div>
  );
}
