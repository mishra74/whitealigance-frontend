"use client";

import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import buttons from "@/styles/buttons.module.css";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatINR } from "@/lib/format";
import styles from "./AddToCartControls.module.css";

interface AddToCartControlsProps {
  handle: string;
  sku: string;
  title: string;
  size: string;
  price: number;
  image?: string;
  imageLabel: string;
}

export default function AddToCartControls({
  handle,
  sku,
  title,
  size,
  price,
  image,
  imageLabel,
}: AddToCartControlsProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(handle);
  const addToCartRef = useRef<HTMLButtonElement>(null);
  useMagneticButton(addToCartRef);

  function handleAddToCart() {
    addItem({ handle, sku, title, size, price, image, imageLabel }, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <div className="mb-7 flex items-center gap-3">
        <div className="flex w-fit items-center border border-warm-beige">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-base"
          >
            −
          </button>
          <span className="w-8 text-center text-[0.9rem]">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center text-base"
          >
            +
          </button>
        </div>

        <button
          ref={addToCartRef}
          type="button"
          data-sku={sku}
          onClick={handleAddToCart}
          className={`${buttons.btn} ${buttons.primary} relative flex-1 text-center`}
        >
          {added ? "Added" : "Add to Cart"}
        </button>

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist({ handle, title, price, image, imageLabel })}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center border border-warm-beige"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            fill={wishlisted ? "currentColor" : "none"}
            className={wishlisted ? "text-soft-gold" : undefined}
          />
        </button>
      </div>

      {/* Mobile only — stays reachable while scrolling through product info. */}
      <div className={styles.stickySpacer} aria-hidden="true" />
      <div className={styles.stickyBar}>
        <div className={styles.stickyInfo}>
          <span className={styles.stickyTitle}>{title}</span>
          <span className={styles.stickyPrice}>{formatINR(price * qty)}</span>
        </div>
        <button
          type="button"
          data-sku={sku}
          onClick={handleAddToCart}
          className={`${buttons.btn} ${buttons.primary} ${styles.stickyButton}`}
        >
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </>
  );
}
