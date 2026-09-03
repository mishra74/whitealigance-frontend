"use client";

import Link from "next/link";
import { X } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import buttons from "@/styles/buttons.module.css";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { formatINR } from "@/lib/format";
import { getProductByHandle } from "@/lib/products";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <div className="py-24 text-center text-warm-gray">
          <span className="mb-3.5 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
            Your Wishlist
          </span>
          <h1 className="mb-2 font-display text-[1.6rem] text-charcoal">
            Your wishlist is empty.
          </h1>
          <p className="mx-auto mb-8 max-w-[360px] text-[0.9rem]">
            Save pieces you love by tapping the heart on any product.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/party-wear" className={`${buttons.btn} ${buttons.primary}`}>
              Party Wear
            </Link>
            <Link href="/casual-wear" className={`${buttons.btn} ${buttons.secondary}`}>
              Casual Wear
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleMoveToCart(handle: string) {
    const product = await getProductByHandle(handle);
    if (!product) return;

    const variant = product.variants[0];
    addItem(
      {
        handle: product.handle,
        sku: variant.sku,
        title: product.title,
        size: variant.size,
        price: variant.price.amount,
        image: product.hasPhoto ? product.images[0]?.url ?? undefined : undefined,
        imageLabel: product.hasPhoto ? product.title : "Photo coming soon",
      },
      1
    );
    remove(handle);
    showToast("Product added to cart");
  }

  return (
    <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
      <h1 className="py-8 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
        Your Wishlist
      </h1>
      <div className="grid grid-cols-2 gap-6 pb-20 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((line) => (
          <div key={line.handle}>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Link href={`/product/${line.handle}`}>
                <PlaceholderImage
                  src={line.image}
                  alt={line.title}
                  label={line.imageLabel}
                  variant="warm1"
                  className="absolute inset-0"
                />
              </Link>
              <button
                type="button"
                aria-label={`Remove ${line.title} from wishlist`}
                onClick={() => remove(line.handle)}
                className="absolute top-3 right-3 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-pearl-white/85"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className="pt-3.5">
              <Link href={`/product/${line.handle}`} className="font-display text-base">
                {line.title}
              </Link>
              <div className="mt-1 mb-2.5 text-[0.82rem] text-muted-bronze">
                {formatINR(line.price)}
              </div>
              <button
                type="button"
                onClick={() => {
                  void handleMoveToCart(line.handle);
                }}
                className={`${buttons.btn} ${buttons.secondary} ${buttons.block}`}
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
