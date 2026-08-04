import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import buttons from "@/styles/buttons.module.css";

export default function EmptyCart() {
  return (
    <div className="py-24 text-center text-warm-gray">
      <ShoppingBag size={40} strokeWidth={1} className="mx-auto mb-6 text-warm-beige" />
      <span className="mb-3.5 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
        Your Cart
      </span>
      <h1 className="mb-2 font-display text-[1.6rem] text-charcoal">
        Your cart is empty.
      </h1>
      <p className="mx-auto mb-8 max-w-[360px] text-[0.9rem]">
        Nothing added yet. Explore the collections and find something worth
        keeping.
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
  );
}
