"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import styles from "./MeaningOfWhiteSection.module.css";

const MEANINGS = [
  { word: "Purity", sub: "Nothing added, nothing needed." },
  { word: "Confidence", sub: "Worn by those who don't ask to be noticed." },
  { word: "Luxury", sub: "Quiet, considered, unmistakable." },
  { word: "Grace", sub: "Movement, not posture." },
  { word: "Strength", sub: "Softness that doesn't apologize." },
  { word: "Timeless Beauty", sub: "Never in season, never out of it." },
  { word: "Minimalism", sub: "Less fabric. More presence." },
];

// "fabric-thread" primitive (component-library.html), redesigned for a
// single compact frame: one soft hairline drifting gently behind the grid —
// a slow idle sway (same easing language as the hero's continuous zoom),
// not a scroll-driven journey through stacked blocks.
const POINT_COUNT = 5;
const BASE_Y = [50, 41, 56, 39, 50];
const AMPLITUDE = 7;
const VIEW_WIDTH = 1000;

function buildThreadPath(ys: number[]): string {
  const step = VIEW_WIDTH / (POINT_COUNT - 1);
  let d = `M 0 ${ys[0]}`;
  let prevX = 0;
  let prevY = ys[0];
  for (let i = 1; i < POINT_COUNT; i++) {
    const x = step * i;
    const y = ys[i];
    const midX = prevX + (x - prevX) / 2;
    d += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
    prevX = x;
    prevY = y;
  }
  return d;
}

export default function MeaningOfWhiteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const threadPathRef = useRef<SVGPathElement>(null);

  useSectionReveal(innerRef);

  useGSAP(
    () => {
      const sway = { t: 0 };
      const rebuild = () => {
        if (!threadPathRef.current) return;
        const ys = BASE_Y.map(
          (base, i) => base + Math.sin(sway.t * Math.PI * 2 + i * 1.1) * AMPLITUDE
        );
        threadPathRef.current.setAttribute("d", buildThreadPath(ys));
      };
      rebuild();

      gsap.to(sway, {
        t: 1,
        duration: 14,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onUpdate: rebuild,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-pearl-white px-14 py-[180px] text-center max-[1100px]:px-8"
    >
      <svg
        className={styles.thread}
        viewBox={`0 0 ${VIEW_WIDTH} 100`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={threadPathRef}
          className={styles.threadPath}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div ref={innerRef} className="relative z-[1]">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
          The Meaning of White
        </span>
        <p className="mx-auto mt-6 mb-2 max-w-[720px] font-display text-[clamp(2rem,4.6vw,3.4rem)] font-normal italic leading-[1.2]">
          Seven words. One color.
        </p>

        <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {MEANINGS.map((meaning) => (
            <div key={meaning.word}>
              <div className="mx-auto mb-4 h-px w-[60px] bg-soft-gold" />
              <h3 className="font-display text-[1.35rem] font-normal">{meaning.word}</h3>
              <p className="mt-2 text-[0.85rem] text-warm-gray italic">{meaning.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
