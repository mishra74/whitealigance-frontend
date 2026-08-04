import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import buttons from "@/styles/buttons.module.css";

export default function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="mx-auto max-w-[480px] py-24 text-center">
      <CheckCircle2 size={44} strokeWidth={1} className="mx-auto mb-6 text-soft-gold" />
      <span className="mb-3.5 block text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
        Sandbox Order — Test Mode
      </span>
      <h1 className="mb-3 font-display text-[1.7rem]">Order placed.</h1>
      <p className="mb-2 text-[0.9rem] text-warm-gray">
        Test order <span className="text-charcoal">#{orderNumber}</span> was
        recorded in this browser only.
      </p>
      <p className="mx-auto mb-8 max-w-[380px] text-[0.85rem] text-warm-gray">
        No real payment was processed and no order was created on any
        backend — checkout is running in sandbox mode until a live payment
        gateway is connected.
      </p>
      <Link href="/" className={`${buttons.btn} ${buttons.primary}`}>
        Back to Home
      </Link>
    </div>
  );
}
