"use client";

import { useRef } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { useMaskReveal } from "@/hooks/useMaskReveal";

const TILES = [
  "insta-01-courtyard.png",
  "insta-02-staircase.png",
  "insta-03-archway.png",
  "insta-04-terrace.png",
  "insta-05-fabric-detail.png",
  "insta-06-hallway.png",
  "insta-07-doorframe.png",
  "insta-08-window-silhouette.png",
];

function InstaTile({ file, index }: { file: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useMaskReveal(ref);

  return (
    <div className="group relative aspect-square cursor-pointer overflow-hidden">
      <div ref={ref} className="absolute inset-0">
        <PlaceholderImage
          src={`/assets/images/instagram/${file}`}
          alt={`Instagram post ${index + 1}`}
          label="Lifestyle photography"
          variant="warm1"
          className="absolute inset-0 transition-transform duration-500 ease-fabric group-hover:scale-110"
        />
      </div>
    </div>
  );
}

export default function InstagramGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section ref={sectionRef} className="bg-ivory px-14 py-[180px] max-[1100px]:px-8">
      <div className="mx-auto max-w-[640px] text-center">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
          Follow the Story
        </span>
        <h2 className="mt-[18px] font-display text-[clamp(2rem,4vw,3.2rem)] font-normal tracking-[-0.01em]">
          @whiteelegance24
        </h2>
        <div className="mx-auto mt-[18px] h-px w-[60px] bg-soft-gold" />
      </div>

      <div className="mt-14 grid grid-cols-2 gap-0.5 sm:grid-cols-4">
        {TILES.map((file, i) => (
          <InstaTile key={file} file={file} index={i} />
        ))}
      </div>
    </section>
  );
}
