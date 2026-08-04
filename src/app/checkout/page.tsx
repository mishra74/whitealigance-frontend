"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/format";
import buttons from "@/styles/buttons.module.css";
import PaymentTabs from "@/components/checkout/PaymentTabs";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";

const FREE_SHIPPING_THRESHOLD = 5000;
const FLAT_SHIPPING = 150;

function generateOrderNumber() {
  return `WE24-${Date.now().toString().slice(-8)}`;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  function handlePlaceOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const num = generateOrderNumber();
    clear();
    setOrderNumber(num);
  }

  if (orderNumber) {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <OrderConfirmation orderNumber={orderNumber} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <div className="py-24 text-center text-warm-gray">
          <h1 className="mb-3 font-display text-[1.6rem] text-charcoal">
            Your cart is empty.
          </h1>
          <p className="mx-auto mb-8 max-w-[360px] text-[0.9rem]">
            Add something to your cart before checking out.
          </p>
          <Link href="/party-wear" className={`${buttons.btn} ${buttons.primary}`}>
            Explore Party Wear
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
      <h1 className="pt-8 pb-2.5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
        Checkout
      </h1>

      <div className="mb-1 rounded-none bg-ivory px-4 py-2.5 text-[0.75rem] text-muted-bronze">
        Sandbox / test mode — no real payment will be charged.
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-16 pt-6 pb-20 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-6 text-[0.82rem] text-warm-gray">
            Checking out as guest —{" "}
            <Link href="/login" className="text-soft-gold underline">
              log in instead
            </Link>
          </div>

          <div className="mb-11">
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-[1.15rem]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-[0.72rem] text-pearl-white">
                1
              </span>
              Contact
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
              <div>
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
            </div>
          </div>

          <div className="mb-11">
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-[1.15rem]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-[0.72rem] text-pearl-white">
                2
              </span>
              Shipping Address
            </h3>
            <div className="mb-5">
              <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
              />
            </div>
            <div className="mb-5">
              <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                Address
              </label>
              <input
                type="text"
                required
                className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
              />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  City
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
              <div>
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-[1.15rem]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-[0.72rem] text-pearl-white">
                3
              </span>
              Payment
            </h3>
            <PaymentTabs />
          </div>
        </div>

        <div className="h-fit bg-ivory p-8">
          <h3 className="mb-5 font-display text-[1.2rem]">Order Summary</h3>
          <div className="mb-4 max-h-[280px] overflow-y-auto">
            {items.map((line) => (
              <div key={`${line.sku}-${line.size}`} className="mb-4 flex gap-3 last:mb-0">
                <div className="w-14 shrink-0 bg-cream" style={{ aspectRatio: "3/4" }} />
                <div className="text-[0.85rem]">
                  <div>{line.title}</div>
                  <div className="text-warm-gray">
                    Size {line.size} · Qty {line.qty}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-warm-beige pt-4 text-[1.05rem] font-semibold text-charcoal">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <button
            type="submit"
            className={`${buttons.btn} ${buttons.primary} ${buttons.block} mt-6`}
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
