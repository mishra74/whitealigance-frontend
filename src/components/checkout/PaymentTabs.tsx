"use client";

export type PaymentMethod = "online" | "cod";

export default function PaymentTabs({
  method,
  onChange,
}: {
  method: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange("online")}
          className={`border px-1.5 py-3.5 text-center text-[0.7rem] uppercase tracking-[0.04em] ${
            method === "online"
              ? "border-charcoal bg-charcoal text-pearl-white"
              : "border-warm-beige"
          }`}
        >
          Online Payment
        </button>
        <button
          type="button"
          onClick={() => onChange("cod")}
          className={`border px-1.5 py-3.5 text-center text-[0.7rem] uppercase tracking-[0.04em] ${
            method === "cod"
              ? "border-charcoal bg-charcoal text-pearl-white"
              : "border-warm-beige"
          }`}
        >
          Cash on Delivery
        </button>
      </div>

      {method === "online" ? (
        <p className="mb-5 text-[0.85rem] text-warm-gray">
          A secure Razorpay payment window will open — UPI, cards,
          netbanking, and wallets are all supported.
        </p>
      ) : (
        <p className="mb-5 text-[0.85rem] text-warm-gray">
          Pay in cash when your order arrives.
        </p>
      )}
    </div>
  );
}
