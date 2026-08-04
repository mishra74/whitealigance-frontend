"use client";

import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useCart, type CartLine } from "@/lib/cart-context";
import { formatINR } from "@/lib/format";

export default function CartLineItem({ line }: { line: CartLine }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="grid grid-cols-[90px_1fr_auto] items-center gap-5 border-b border-cream py-6">
      <Link href={`/product/${line.handle}`} className="relative aspect-[3/4]">
        <PlaceholderImage
          src={line.image}
          alt={line.title}
          label={line.imageLabel}
          variant="warm1"
          className="absolute inset-0"
        />
      </Link>
      <div>
        <Link href={`/product/${line.handle}`} className="mb-1 block font-display text-[1.05rem]">
          {line.title}
        </Link>
        <div className="mb-2.5 text-[0.8rem] text-warm-gray">Size {line.size}</div>
        <div className="flex w-fit items-center border border-warm-beige">
          <button
            type="button"
            aria-label={`Decrease quantity of ${line.title}`}
            onClick={() => updateQty(line.sku, line.size, line.qty - 1)}
            className="flex h-9 w-9 items-center justify-center text-base"
          >
            −
          </button>
          <span className="w-8 text-center text-[0.9rem]">{line.qty}</span>
          <button
            type="button"
            aria-label={`Increase quantity of ${line.title}`}
            onClick={() => updateQty(line.sku, line.size, line.qty + 1)}
            className="flex h-9 w-9 items-center justify-center text-base"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => removeItem(line.sku, line.size)}
          className="mt-2 inline-block text-[0.7rem] text-muted-bronze underline"
        >
          Remove
        </button>
      </div>
      <div className="text-right font-semibold">{formatINR(line.price * line.qty)}</div>
    </div>
  );
}
