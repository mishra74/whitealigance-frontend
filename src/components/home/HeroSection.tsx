"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./HeroSection.module.css";

const HEADLINE_WORDS = "White is not a Color. It is Confidence.".split(" ");
const POSTER_SRC = "/assets/images/hero/hero-poster.jpg";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaLayerRef = useRef<HTMLDivElement>(null);
  const mediaPanRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const [videoFailed, setVideoFailed] = useState(false);

  useMagneticButton(ctaRef);

  useGSAP(
    () => {
      gsap.to(`.${styles.char}`, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.02,
        delay: 0.3,
      });
      gsap.from([`.${styles.eyebrow}`, `.${styles.cta}`], {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.15,
      });

      // media layer: scroll parallax — the "near" layer, drifts against the fixed scrim/text
      gsap.to(mediaLayerRef.current, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // slow continuous breathing zoom, independent of scroll/mouse — keeps
      // the frame alive even before the viewer scrolls or moves the cursor
      gsap.to(videoRef.current, {
        scale: 1.08,
        duration: 18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // text + scrim dissolve in the second half of the scroll
      gsap.fromTo(
        [innerRef.current, scrimRef.current],
        { opacity: 1 },
        {
          opacity: 0,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "50% top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // mouse-tracked depth pan on the media layer, independent of scroll parallax
      const xTo = gsap.quickTo(mediaPanRef.current, "x", {
        duration: 0.8,
        ease: "power3",
      });
      const yTo = gsap.quickTo(mediaPanRef.current, "y", {
        duration: 0.8,
        ease: "power3",
      });
      const onMouseMove = (e: MouseEvent) => {
        const rect = sectionRef.current!.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(relX * -40);
        yTo(relY * -28);
      };
      sectionRef.current?.addEventListener("mousemove", onMouseMove);
      return () =>
        sectionRef.current?.removeEventListener("mousemove", onMouseMove);
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div ref={mediaLayerRef} className={styles.mediaLayer}>
        <div ref={mediaPanRef} className={styles.mediaPan}>
          {videoFailed ? (
            <PlaceholderImage
              src={POSTER_SRC}
              alt="Woman in a flowing silk dress in a sunlit courtyard"
              label="Hero film — still frame"
              variant="hero"
              className="absolute inset-0"
              priority
            />
          ) : (
            <video
              ref={(el) => {
                videoRef.current = el;
                // React's `muted` prop doesn't always set the underlying
                // property before the browser evaluates autoplay — set it
                // imperatively too, as early as possible, so this is never
                // audible even for a frame.
                if (el) {
                  el.muted = true;
                  el.defaultMuted = true;
                }
              }}
              className={styles.video}
              src="/assets/video/hero.mp4"
              poster={POSTER_SRC}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              onLoadedMetadata={(e) => {
                e.currentTarget.muted = true;
              }}
              onError={() => setVideoFailed(true)}
            />
          )}
        </div>
      </div>

      <div ref={scrimRef} className={styles.scrim} />

      <div ref={innerRef} className={styles.heroInner}>
        <span className={styles.eyebrow}>White Elegance 24</span>
        <h1 className={styles.headline}>
          {HEADLINE_WORDS.map((word, wi) => (
            <Fragment key={wi}>
              <span className={styles.word}>
                {word.split("").map((c, ci) => (
                  <span key={ci} className={styles.char}>
                    {c}
                  </span>
                ))}
              </span>
              {wi < HEADLINE_WORDS.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h1>
        <Link ref={ctaRef} href="#collections" className={styles.cta}>
          Explore the Collection
        </Link>
      </div>
      <div className={styles.scrollCue} />
    </section>
  );
}
