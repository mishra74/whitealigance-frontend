"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

const ITEMS = [
  { title: "Fabric", description: "Sourced for how it moves, not just how it looks." },
  { title: "Tailoring", description: "Cut close to the body, cut for real women." },
  { title: "Comfort", description: "Luxury you forget you're wearing." },
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef);

  useGSAP(
    () => {
      gsap.to(imgRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-pearl-white px-14 py-[180px] max-[1100px]:px-8">
      <div className="grid gap-24 md:grid-cols-2 md:items-center">
        <div className="relative h-[520px] overflow-hidden">
          <div ref={imgRef} className="absolute inset-0">
            <PlaceholderImage
              src="/assets/images/homepage/philosophy-atelier-detail.png"
              alt="Atelier tailoring detail"
              label="Atelier — tailoring detail"
              variant="warm1"
              className="absolute inset-0"
            />
          </div>
        </div>
        <div>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
            Philosophy
          </span>
          <h2 className="mb-11 mt-[18px] font-display text-[clamp(1.8rem,3vw,2.4rem)] font-normal tracking-[-0.01em]">
            Crafted, not manufactured.
          </h2>
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`flex gap-5 ${i === ITEMS.length - 1 ? "" : "mb-11"}`}
            >
              <div className="mt-3.5 h-px w-[34px] shrink-0 bg-soft-gold" />
              <div>
                <h4 className="mb-2 font-display text-[1.3rem]">{item.title}</h4>
                <p className="max-w-[360px] text-[0.95rem] text-warm-gray">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
