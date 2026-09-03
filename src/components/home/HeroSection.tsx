"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./HeroSection.module.css";

const HEADLINE_WORDS = "White is not a Color. It is Confidence.".split(" ");
const POSTER_SRC = "/assets/images/hero/hero-poster.jpg";

// Carousel runs on every breakpoint — swipe on touch, dots + arrows (arrows
// are desktop-only, see HeroSection.module.css) elsewhere. Slide 0 is the
// site's primary brand tagline; slides 1-2 reuse the real Party Wear /
// Casual Wear collection photography and taglines already used elsewhere
// on the site — nothing invented.
const AUTO_ADVANCE_MS = 6000;
const SLIDE_COUNT = 3;
const SWIPE_THRESHOLD_PX = 40;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaLayerRef = useRef<HTMLDivElement>(null);
  const mediaPanRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const partyCtaRef = useRef<HTMLAnchorElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const casualCtaRef = useRef<HTMLAnchorElement>(null);

  const [videoFailed, setVideoFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useMagneticButton(ctaRef);
  useMagneticButton(partyCtaRef);
  useMagneticButton(casualCtaRef);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SLIDE_COUNT);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // Re-armed on every manual navigation too (activeIndex dependency), so a
    // manual click/swipe always gets a full fresh interval rather than
    // firing again right away.
  }, [paused, activeIndex]);

  function goTo(index: number) {
    // Clear the pending auto-advance synchronously, in the same tick as the
    // click itself — otherwise a timer that's already due to fire can land
    // right after a manual click (both call setActiveIndex) and immediately
    // undo it. The effect above still re-arms a fresh interval once this
    // state update re-renders.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
    setPaused(true);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    setPaused(false);
    if (startX === null) return;

    const deltaX = e.changedTouches[0].clientX - startX;
    if (deltaX > SWIPE_THRESHOLD_PX) {
      goTo(activeIndex - 1);
    } else if (deltaX < -SWIPE_THRESHOLD_PX) {
      goTo(activeIndex + 1);
    }
  }

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
    <section
      ref={sectionRef}
      className={styles.hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={mediaLayerRef} className={styles.mediaLayer}>
        <div ref={mediaPanRef} className={styles.mediaPan}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${activeIndex * (100 / SLIDE_COUNT)}%)` }}
          >
            <div className={styles.trackSlide}>
              {videoFailed ? (
                <PlaceholderImage
                  src={POSTER_SRC}
                  alt="Woman in a flowing silk dress in a sunlit courtyard"
                  label="Hero film — still frame"
                  variant="hero"
                  className="absolute inset-0"
                  objectPosition="object-[center_20%]"
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

            <div className={styles.trackSlide}>
              <Image
                src="/assets/images/collections/party-wear-hero.png"
                alt="Party Wear collection"
                fill
                sizes="100vw"
                className={`${styles.video} object-[center_25%]`}
              />
            </div>

            <div className={styles.trackSlide}>
              <Image
                src="/assets/images/collections/casual-wear-hero.png"
                alt="Casual Wear collection"
                fill
                sizes="100vw"
                className={`${styles.video} object-[68%_25%]`}
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={scrimRef} className={styles.scrim} />

      <div ref={innerRef} className={styles.heroInner}>
        <div
          className={styles.slideText}
          data-active={activeIndex === 0}
          aria-hidden={activeIndex !== 0}
        >
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
          <Link
            ref={ctaRef}
            href="/party-wear"
            className={styles.cta}
            tabIndex={activeIndex === 0 ? 0 : -1}
          >
            Explore the Collection
          </Link>
        </div>

        <div
          className={styles.slideText}
          data-active={activeIndex === 1}
          aria-hidden={activeIndex !== 1}
        >
          <span className={styles.eyebrow}>Party Wear</span>
          <h1 className={styles.headlinePlain}>
            For the room that turns when you enter
          </h1>
          <Link
            ref={partyCtaRef}
            href="/party-wear"
            className={styles.cta}
            tabIndex={activeIndex === 1 ? 0 : -1}
          >
            Shop Party Wear
          </Link>
        </div>

        <div
          className={styles.slideText}
          data-active={activeIndex === 2}
          aria-hidden={activeIndex !== 2}
        >
          <span className={styles.eyebrow}>Casual Wear</span>
          <h1 className={styles.headlinePlain}>
            For every day worth dressing well for
          </h1>
          <Link
            ref={casualCtaRef}
            href="/casual-wear"
            className={styles.cta}
            tabIndex={activeIndex === 2 ? 0 : -1}
          >
            Shop Casual Wear
          </Link>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowPrev}`}
        aria-label="Previous slide"
        onClick={() => goTo(activeIndex - 1)}
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowNext}`}
        aria-label="Next slide"
        onClick={() => goTo(activeIndex + 1)}
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      <div className={styles.dots} role="tablist" aria-label="Hero slides">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={`Show slide ${i + 1}`}
            className={`${styles.dot} ${activeIndex === i ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className={styles.scrollCue} />
    </section>
  );
}
