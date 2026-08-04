"use client";

import { useRef } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

export default function WhyWhiteSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      ref={ref}
      className="bg-ivory px-14 py-[180px] text-center max-[1100px]:px-8"
    >
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
        Why White
      </span>
      <p className="mx-auto my-6 max-w-[820px] font-display text-[clamp(2rem,5vw,3.6rem)] italic leading-[1.2] font-normal">
        White holds nothing back.
      </p>
      <p className="mx-auto max-w-[520px] text-[1.05rem] text-warm-gray">
        No print to hide behind, no color to distract. White asks a woman to
        stand exactly as she is — and that takes more confidence than any
        other shade.
      </p>
    </section>
  );
}
