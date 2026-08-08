import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import buttons from "@/styles/buttons.module.css";

export default function OrderConfirmation({
  orderNumber,
  paymentMethod,
}: {
  orderNumber: string;
  paymentMethod: "cod" | "online";
}) {
  return (
    <div className="mx-auto max-w-[480px] py-24 text-center">
      <CheckCircle2 size={44} strokeWidth={1} className="mx-auto mb-6 text-soft-gold" />
      <span className="mb-3.5 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
        {paymentMethod === "online" ? "Payment Received" : "Order Confirmed"}
      </span>
      <h1 className="mb-3 font-display text-[1.7rem]">
        {paymentMethod === "online" ? "Payment successful." : "Order placed."}
      </h1>
      <p className="mb-2 text-[0.9rem] text-warm-gray">
        Order <span className="text-charcoal">#{orderNumber}</span> has been
        confirmed.
      </p>
      <p className="mx-auto mb-8 max-w-[380px] text-[0.85rem] text-warm-gray">
        {paymentMethod === "online"
          ? "Your payment via Razorpay was successful. A confirmation has been recorded on your order."
          : "Please keep the exact amount ready — you'll pay in cash when your order arrives."}
      </p>
      <Link href="/" className={`${buttons.btn} ${buttons.primary}`}>
        Back to Home
      </Link>
    </div>
  );
}
