"use client";

import { useRef } from "react";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useThreadDraw } from "@/hooks/useThreadDraw";
import { useMaskReveal } from "@/hooks/useMaskReveal";
import styles from "./CollectionsSection.module.css";

function CollectionCard({
  href,
  eyebrow,
  title,
  tagline,
  variant,
  src,
  objectPosition,
}: {
  href: string;
  eyebrow: string;
  title: string;
  tagline: string;
  variant: "warm2" | "warm3";
  src?: string;
  objectPosition?: string;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  useMaskReveal(imgRef);

  return (
    <Link href={href} className={styles.card}>
      <div ref={imgRef} className={`${styles.imgWrap} absolute inset-0`}>
        <PlaceholderImage
          src={src}
          alt={title}
          label={title}
          variant={variant}
          className="absolute inset-0"
          objectPosition={objectPosition}
        />
      </div>
      <div className={styles.content}>
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-pearl-white/85">
          {eyebrow}
        </span>
        <h3>{title}</h3>
        <span className={styles.link}>{tagline}</span>
      </div>
    </Link>
  );
}

export default function CollectionsSection() {
  const threadRef = useRef<HTMLDivElement>(null);
  useThreadDraw(threadRef);

  return (
    <div id="collections">
      <div className="mx-auto max-w-[640px] px-6 pt-[180px] pb-16 text-center">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
          Shop
        </span>
        <h2 className="mt-[18px] font-display text-[clamp(2rem,4vw,3.2rem)] font-normal tracking-[-0.01em]">
          Discover the Collections
        </h2>
        <div ref={threadRef} className="mx-auto mt-[18px] h-px w-[60px] bg-soft-gold" />
      </div>

      <div className={styles.collections}>
        <CollectionCard
          href="/party-wear"
          eyebrow="01"
          title="Party Wear"
          tagline="For the room that turns when you enter"
          variant="warm2"
          src="/assets/images/collections/party-wear-hero.png"
        />
        <CollectionCard
          href="/casual-wear"
          eyebrow="02"
          title="Casual Wear"
          tagline="For every day worth dressing well for"
          variant="warm3"
          src="/assets/images/collections/casual-wear-hero.png"
          objectPosition="object-center max-[1100px]:object-[68%_center]"
        />
      </div>
    </div>
  );
}
