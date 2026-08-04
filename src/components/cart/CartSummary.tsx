"use client";

import { useState } from "react";
import Link from "next/link";
import buttons from "@/styles/buttons.module.css";
import { formatINR } from "@/lib/format";

const GIFT_WRAP_FEE = 150;

export default function CartSummary({ subtotal }: { subtotal: number }) {
  const [giftWrap, setGiftWrap] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const total = subtotal + (giftWrap ? GIFT_WRAP_FEE : 0);

  return (
    <div className="bg-ivory p-8">
      <h3 className="mb-5 font-display text-[1.2rem]">Order Summary</h3>

      <div className="mb-5 flex items-center gap-2.5 text-[0.85rem]">
        <input
          type="checkbox"
          id="giftwrap"
          checked={giftWrap}
          onChange={(e) => setGiftWrap(e.target.checked)}
        />
        <label htmlFor="giftwrap">Add gift wrap (+{formatINR(GIFT_WRAP_FEE)})</label>
      </div>

      <div className="my-5 flex gap-2">
        <input
          type="text"
          placeholder="Coupon code"
          value={coupon}
          onChange={(e) => {
            setCoupon(e.target.value);
            setCouponMessage(null);
          }}
          className="min-w-0 flex-1 border-b border-warm-beige bg-transparent px-0.5 py-2 outline-none"
        />
        <button
          type="button"
          disabled={!coupon}
          onClick={() =>
            setCouponMessage("Coupon codes aren't available yet — check back soon.")
          }
          className={`${buttons.btn} ${buttons.secondary} px-4.5 py-2.5 disabled:opacity-40`}
        >
          Apply
        </button>
      </div>
      {couponMessage && (
        <p className="mb-5 -mt-3 text-[0.78rem] text-warm-gray">{couponMessage}</p>
      )}

      <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
        <span>Subtotal</span>
        <span>{formatINR(subtotal)}</span>
      </div>
      {giftWrap && (
        <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
          <span>Gift wrap</span>
          <span>{formatINR(GIFT_WRAP_FEE)}</span>
        </div>
      )}
      <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="mt-1.5 flex justify-between border-t border-warm-beige pt-4 text-[1.05rem] font-semibold text-charcoal">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </div>

      <Link
        href="/checkout"
        className={`${buttons.btn} ${buttons.primary} ${buttons.block} mt-6`}
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
