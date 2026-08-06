"use client";

import { useState, type FormEvent } from "react";
import type { AddressInput, AddressLabel } from "@/lib/address-context";
import buttons from "@/styles/buttons.module.css";

const LABELS: AddressLabel[] = ["Home", "Work", "Other"];

const inputClass =
  "w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold";
const labelClass =
  "mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray";

interface AddressFormProps {
  initial?: AddressInput;
  onSubmit: (input: AddressInput) => void;
  onCancel: () => void;
  submitLabel?: string;
  /** Set false when nesting inside another <form> (e.g. Checkout) — nested forms are invalid HTML. */
  asForm?: boolean;
  disabled?: boolean;
}

export default function AddressForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Address",
  asForm = true,
  disabled = false,
}: AddressFormProps) {
  const [label, setLabel] = useState<AddressLabel>(initial?.label ?? "Home");
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [line1, setLine1] = useState(initial?.line1 ?? "");
  const [line2, setLine2] = useState(initial?.line2 ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [state, setState] = useState(initial?.state ?? "");
  const [pincode, setPincode] = useState(initial?.pincode ?? "");

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!fullName || !phone || !line1 || !city || !state || !pincode) return;
    onSubmit({
      label,
      fullName,
      phone,
      line1,
      line2: line2 || undefined,
      city,
      state,
      pincode,
    });
  }

  const Wrapper = asForm ? "form" : "div";

  return (
    <Wrapper
      onSubmit={asForm ? handleSubmit : undefined}
      className="border border-cream bg-ivory/40 p-6"
    >
      <div className="mb-5">
        <label className={labelClass}>Label</label>
        <div className="grid grid-cols-3 gap-2">
          {LABELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLabel(l)}
              className={`border px-1.5 py-3 text-center text-[0.7rem] uppercase tracking-[0.04em] ${
                label === l
                  ? "border-charcoal bg-charcoal text-pearl-white"
                  : "border-warm-beige"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-5">
        <label className={labelClass}>Address Line 1</label>
        <input
          type="text"
          required
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="mb-5">
        <label className={labelClass}>Address Line 2 (optional)</label>
        <input
          type="text"
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input
            type="text"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Pincode</label>
          <input
            type="text"
            required
            inputMode="numeric"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type={asForm ? "submit" : "button"}
          onClick={asForm ? undefined : () => handleSubmit()}
          disabled={disabled}
          className={`${buttons.btn} ${buttons.primary} disabled:opacity-60`}
        >
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={disabled} className={`${buttons.btn} ${buttons.secondary}`}>
          Cancel
        </button>
      </div>
    </Wrapper>
  );
}
