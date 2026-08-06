"use client";

import { useState } from "react";
import Link from "next/link";
import buttons from "@/styles/buttons.module.css";
import { formatINR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

const GIFT_WRAP_FEE = 150;

export default function CartSummary({ subtotal }: { subtotal: number }) {
  const { couponCode, couponDiscount, applyCoupon, removeCoupon } = useCart();
  const [giftWrap, setGiftWrap] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const total = subtotal + (giftWrap ? GIFT_WRAP_FEE : 0) - couponDiscount;

  async function handleApply() {
    setApplying(true);
    setCouponMessage(null);
    const result = await applyCoupon(coupon);
    setApplying(false);
    if (result.ok) {
      setCouponMessage(`Coupon applied — ${formatINR(couponDiscount)} off.`);
    } else {
      setCouponMessage(result.message ?? "Invalid discount coupon.");
    }
  }

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

      {couponCode ? (
        <div className="my-5 flex items-center justify-between text-[0.85rem]">
          <span>
            Coupon <strong className="text-charcoal">{couponCode}</strong> applied
          </span>
          <button
            type="button"
            onClick={() => {
              removeCoupon();
              setCoupon("");
              setCouponMessage(null);
            }}
            className="text-[0.72rem] uppercase tracking-[0.08em] text-soft-gold underline"
          >
            Remove
          </button>
        </div>
      ) : (
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
            disabled={!coupon || applying}
            onClick={handleApply}
            className={`${buttons.btn} ${buttons.secondary} px-4.5 py-2.5 disabled:opacity-40`}
          >
            {applying ? "Checking…" : "Apply"}
          </button>
        </div>
      )}
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
      {couponDiscount > 0 && (
        <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
          <span>Discount</span>
          <span>−{formatINR(couponDiscount)}</span>
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
