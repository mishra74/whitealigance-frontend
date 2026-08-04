"use client";

import { Heart } from "lucide-react";
import { useWishlist, type WishlistLine } from "@/lib/wishlist-context";

export default function WishlistButton({ line }: { line: WishlistLine }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(line.handle);

  return (
    <button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(line);
      }}
      className="absolute top-3 right-3 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-pearl-white/85"
    >
      <Heart
        size={14}
        strokeWidth={1.5}
        fill={wishlisted ? "currentColor" : "none"}
        className={wishlisted ? "text-soft-gold" : undefined}
      />
    </button>
  );
}
