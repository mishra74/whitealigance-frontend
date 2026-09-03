"use client";

import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import buttons from "@/styles/buttons.module.css";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useToast } from "@/lib/toast-context";
import { formatINR } from "@/lib/format";
import type { ProductVariant } from "../../../products";
import styles from "./AddToCartControls.module.css";

interface AddToCartControlsProps {
  handle: string;
  title: string;
  variants: ProductVariant[];
  image?: string;
  imageLabel: string;
}

export default function AddToCartControls({
  handle,
  title,
  variants,
  image,
  imageLabel,
}: AddToCartControlsProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  // A single "Free Size" variant (no sizes configured for this product)
  // needs no selector; once any size is configured, normalize() always
  // pads to the full S/M/L/XL/XXL/XXXL row (6 variants).
  const showSizeSelector = variants.length > 1;
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    // Sized products start with nothing chosen — the customer must
    // actively pick a size. An unsized product has only one real
    // option, so there's nothing to make them choose.
    showSizeSelector ? undefined : variants[0]?.size
  );
  const [sizeError, setSizeError] = useState(false);
  const selectedVariant = showSizeSelector
    ? variants.find((v) => v.size === selectedSize)
    : variants[0];
  // Price doesn't vary by size in this system, so the sticky bar can show
  // it even before a size is chosen — falls back to the first variant.
  const displayPrice = (selectedVariant ?? variants[0])?.price.amount ?? 0;
  const maxQty = selectedVariant?.inventoryQuantity ?? undefined;
  const wishlisted = isWishlisted(handle);
  const addToCartRef = useRef<HTMLButtonElement>(null);
  useMagneticButton(addToCartRef);

  function handleAddToCart() {
    if (showSizeSelector && (!selectedVariant || !selectedVariant.available)) {
      setSizeError(true);
      return;
    }
    if (!selectedVariant) return;

    addItem(
      {
        handle,
        sku: selectedVariant.sku,
        title,
        size: selectedVariant.size,
        price: selectedVariant.price.amount,
        image,
        imageLabel,
      },
      qty
    );
    setAdded(true);
    showToast("Product added to cart");
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      {showSizeSelector && (
        <div className="mb-5">
          <span className="mb-2.5 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
            Select Size
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = v.size === selectedSize;
              return (
                <button
                  key={v.size}
                  type="button"
                  disabled={!v.available}
                  onClick={() => {
                    setSelectedSize(v.size);
                    setSizeError(false);
                    setQty(1);
                  }}
                  aria-pressed={isSelected}
                  className={`flex h-[42px] min-w-[42px] items-center justify-center border px-3.5 text-[0.8rem] transition-colors ${
                    isSelected
                      ? "border-charcoal bg-charcoal text-pearl-white"
                      : v.available
                        ? "border-warm-beige bg-pearl-white text-charcoal hover:border-charcoal"
                        : "cursor-not-allowed border-warm-beige bg-pearl-white text-warm-gray line-through opacity-50"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
          {sizeError && (
            <p className="mt-2 text-[0.78rem] text-red-500">
              Please select a size.
            </p>
          )}
        </div>
      )}

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
            disabled={maxQty !== undefined && qty >= maxQty}
            onClick={() => setQty((q) => (maxQty !== undefined ? Math.min(maxQty, q + 1) : q + 1))}
            className="flex h-9 w-9 items-center justify-center text-base disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          ref={addToCartRef}
          type="button"
          data-sku={selectedVariant?.sku}
          onClick={handleAddToCart}
          className={`${buttons.btn} ${buttons.primary} relative flex-1 text-center`}
        >
          {added ? "Added" : "Add to Cart"}
        </button>

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist({ handle, title, price: displayPrice, image, imageLabel })}
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
          <span className={styles.stickyPrice}>
            {formatINR(displayPrice * qty)}
          </span>
        </div>
        <button
          type="button"
          data-sku={selectedVariant?.sku}
          onClick={handleAddToCart}
          className={`${buttons.btn} ${buttons.primary} ${styles.stickyButton}`}
        >
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </>
  );
}
