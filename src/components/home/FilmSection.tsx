"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useMaskReveal } from "@/hooks/useMaskReveal";

export default function FilmSection() {
  const imgRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useMaskReveal(imgRef);

  useEffect(() => {
    if (modalOpen) {
      bgVideoRef.current?.pause();
      modalVideoRef.current?.play().catch(() => {});
    } else {
      bgVideoRef.current?.play().catch(() => {});
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  return (
    <section className="relative flex h-[88vh] min-h-[520px] items-center justify-center overflow-hidden">
      <div ref={imgRef} className="absolute inset-0">
        {videoFailed ? (
          <PlaceholderImage
            alt="Editorial fashion film"
            label="Editorial film — music only, no dialogue"
            variant="dark"
            className="absolute inset-0"
          />
        ) : (
          <video
            ref={(el) => {
              bgVideoRef.current = el;
              if (el) {
                el.muted = true;
                el.defaultMuted = true;
              }
            }}
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/video/editorial-film.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          />
        )}
      </div>
      <div className="absolute inset-0 z-[1] bg-[rgba(20,17,14,0.35)]" />
      <div className="relative z-[2] text-center text-pearl-white">
        <button
          type="button"
          aria-label="Watch the film"
          onClick={() => setModalOpen(true)}
          className="mx-auto mb-6.5 flex h-[78px] w-[78px] items-center justify-center rounded-full border border-pearl-white/70 transition-all duration-[400ms] ease-fabric hover:scale-110 hover:bg-pearl-white/[0.12]"
        >
          <Play size={22} strokeWidth={1.5} className="ml-1" />
        </button>
        <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-normal">
          Watch the Film
        </h3>
        <p className="mt-2.5 text-[0.85rem] tracking-[0.04em] opacity-75">
          A short film. No dialogue. Just white, in motion.
        </p>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/90 p-6">
          <button
            type="button"
            aria-label="Close film"
            onClick={() => setModalOpen(false)}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-pearl-white/50 text-pearl-white"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
          <video
            ref={modalVideoRef}
            className="max-h-full max-w-full"
            src="/assets/video/editorial-film.mp4"
            controls
            playsInline
          />
        </div>
      )}
    </section>
  );
}
