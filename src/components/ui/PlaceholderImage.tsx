"use client";

import Image from "next/image";
import { useState } from "react";

export type PlaceholderVariant = "hero" | "warm1" | "warm2" | "warm3" | "dark";

const GRADIENTS: Record<PlaceholderVariant, string> = {
  hero:
    "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,248,235,.55), transparent 60%), linear-gradient(150deg, #EADFC7 0%, #D9C7AE 35%, #B8935A 70%, #8B6F47 100%)",
  warm1: "linear-gradient(160deg, var(--cream), var(--warm-beige))",
  warm2: "linear-gradient(200deg, var(--warm-beige), var(--champagne))",
  warm3: "linear-gradient(180deg, var(--ivory), var(--cream) 60%, var(--warm-beige))",
  dark: "linear-gradient(160deg, #3a352f, var(--charcoal))",
};

interface PlaceholderImageProps {
  /** Real asset URL. Omit to render the gradient placeholder. */
  src?: string;
  alt: string;
  /** Shown on the placeholder only — describes the shot still needed. */
  label: string;
  variant?: PlaceholderVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * Tailwind object-position utility classes (supports responsive
   * variants), e.g. "object-center max-[1100px]:object-[68%_center]" —
   * for photos where the subject isn't centered and a fixed center-crop
   * clips them out on narrow containers.
   */
  objectPosition?: string;
}

/**
 * Drop-in swap point for real photography/video (hero, Editorial Fashion
 * Film, Instagram Gallery — see CLAUDE.md "Still Open"). Pass `src` once an
 * asset exists; until then this renders the same gradient placeholders as
 * the HTML prototypes, labeled with what shot is needed.
 */
export default function PlaceholderImage({
  src,
  alt,
  label,
  variant = "warm1",
  className = "",
  sizes,
  priority,
  objectPosition,
}: PlaceholderImageProps) {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
        className={objectPosition ? `${className} ${objectPosition}` : className}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ background: GRADIENTS[variant] }}
      role="img"
      aria-label={alt}
    >
      <span className="absolute bottom-3.5 left-3.5 text-[0.62rem] uppercase tracking-[0.14em] text-white/70">
        {label}
      </span>
    </div>
  );
}
