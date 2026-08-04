"use client";

import { useRef, useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
  images: { url: string; altText: string }[];
  title: string;
  hasPhoto: boolean;
}

export default function ProductGallery({
  images,
  title,
  hasPhoto,
}: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const primary = images[0];

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(index);
  }

  return (
    <>
      {/* Desktop — unchanged: single primary image, no gallery UI. */}
      <div className="relative hidden aspect-[3/4] md:block">
        <PlaceholderImage
          src={primary?.url}
          alt={primary?.altText ?? title}
          label={hasPhoto ? title : "Photo coming soon"}
          variant="warm2"
          className="absolute inset-0"
          priority
        />
      </div>

      {/* Mobile — swipeable carousel across every product photo. */}
      <div className="relative md:hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className={styles.track}
        >
          {(images.length > 0 ? images : [undefined]).map((img, i) => (
            <div key={img?.url ?? "placeholder"} className={styles.slide}>
              <PlaceholderImage
                src={img?.url}
                alt={img?.altText ?? title}
                label={hasPhoto ? title : "Photo coming soon"}
                variant="warm2"
                className="absolute inset-0"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((img, i) => (
              <span
                key={img.url}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
