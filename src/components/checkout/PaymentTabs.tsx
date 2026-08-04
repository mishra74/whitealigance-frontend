"use client";

import { useState } from "react";

const METHODS = ["UPI", "Cards", "EMI", "Wallets", "COD"] as const;
type Method = (typeof METHODS)[number];

export default function PaymentTabs() {
  const [method, setMethod] = useState<Method>("UPI");

  return (
    <div>
      <div className="mb-5 grid grid-cols-5 gap-2">
        {METHODS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`border px-1.5 py-3.5 text-center text-[0.7rem] uppercase tracking-[0.04em] ${
              method === m
                ? "border-charcoal bg-charcoal text-pearl-white"
                : "border-warm-beige"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {method === "UPI" && (
        <div className="mb-5">
          <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
            UPI ID
          </label>
          <input
            type="text"
            required
            placeholder="yourname@upi"
            className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
          />
        </div>
      )}
      {method === "COD" && (
        <p className="mb-5 text-[0.85rem] text-warm-gray">
          Pay in cash when your order arrives.
        </p>
      )}
      {(method === "Cards" || method === "EMI" || method === "Wallets") && (
        <p className="mb-5 text-[0.85rem] text-warm-gray">
          {method} isn&apos;t connected to a live payment gateway yet — this
          checkout is running in sandbox/test mode. Choose UPI or COD to try
          the full flow.
        </p>
      )}

      <p className="text-[0.72rem] text-muted-bronze">
        Sandbox mode — no real payment is processed and no card or bank
        details are collected here.
      </p>
    </div>
  );
}
