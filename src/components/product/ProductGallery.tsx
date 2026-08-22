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
  const [mobileActive, setMobileActive] = useState(0);
  const [desktopActive, setDesktopActive] = useState(0);
  const active = images[desktopActive] ?? images[0];

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setMobileActive(index);
  }

  return (
    <>
      {/* Desktop — large active image plus a thumbnail strip for every
          photo the admin uploaded (angles, zooms, etc.). */}
      <div className="hidden md:block">
        <div className="relative aspect-[3/4]">
          <PlaceholderImage
            src={active?.url}
            alt={active?.altText ?? title}
            label={hasPhoto ? title : "Photo coming soon"}
            variant="warm2"
            className="absolute inset-0"
            priority
          />
        </div>

        {images.length > 1 && (
          <div className={styles.thumbRow}>
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setDesktopActive(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                aria-current={i === desktopActive}
                className={`${styles.thumb} ${
                  i === desktopActive ? styles.thumbActive : ""
                }`}
              >
                <PlaceholderImage
                  src={img.url}
                  alt={img.altText}
                  label={hasPhoto ? title : "Photo coming soon"}
                  variant="warm2"
                  className="absolute inset-0"
                />
              </button>
            ))}
          </div>
        )}
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
                className={`${styles.dot} ${i === mobileActive ? styles.dotActive : ""}`}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
