"use client";

import Link from "next/link";
import buttons from "@/styles/buttons.module.css";
import { useCart } from "@/lib/cart-context";
import CartLineItem from "@/components/cart/CartLineItem";
import CartSummary from "@/components/cart/CartSummary";
import FreeShippingProgress from "@/components/cart/FreeShippingProgress";
import EmptyCart from "@/components/cart/EmptyCart";

export default function CartPage() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
      <h1 className="pt-8 pb-2.5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
        Your Cart
      </h1>

      <FreeShippingProgress subtotal={subtotal} />

      <div className="grid grid-cols-1 gap-16 pt-6 pb-20 lg:grid-cols-[1fr_380px]">
        <div>
          {items.map((line) => (
            <CartLineItem key={`${line.sku}-${line.size}`} line={line} />
          ))}
          <Link
            href="/party-wear"
            className={`${buttons.btn} ${buttons.secondary} mt-7 inline-block`}
          >
            ← Continue Shopping
          </Link>
        </div>

        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
