"use client";

import { useState } from "react";

export default function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);

  return (
    <div className="mb-8 border border-cream p-4">
      <label
        htmlFor="pincode"
        className="text-[0.68rem] uppercase tracking-[0.1em] text-warm-gray"
      >
        Check Delivery
      </label>
      <br />
      <input
        id="pincode"
        type="text"
        inputMode="numeric"
        placeholder="Enter pincode"
        value={pincode}
        onChange={(e) => {
          setPincode(e.target.value);
          setChecked(false);
        }}
        className="mr-2.5 border-b border-warm-beige bg-transparent px-0.5 py-1.5 text-[0.85rem] outline-none"
      />
      <button
        type="button"
        onClick={() => setChecked(true)}
        disabled={!pincode}
        className="text-[0.75rem] text-soft-gold disabled:opacity-40"
      >
        Check
      </button>
      {checked && (
        <p className="mt-2.5 text-[0.8rem] text-warm-gray">
          Live delivery estimates aren&apos;t available online yet — message
          us on WhatsApp (+91 89768 39119) with your pincode to confirm.
        </p>
      )}
    </div>
  );
}
