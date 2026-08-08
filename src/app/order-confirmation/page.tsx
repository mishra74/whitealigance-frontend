"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { getApiOrderConfirmation, type OrderConfirmationSummary } from "@/lib/api";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import buttons from "@/styles/buttons.module.css";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationPageInner />
    </Suspense>
  );
}

function OrderConfirmationPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clear } = useCart();

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [order, setOrder] = useState<OrderConfirmationSummary | null>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }

    getApiOrderConfirmation(orderId).then((summary) => {
      if (summary && summary.payment_status === "paid") {
        setOrder(summary);
        setStatus("ready");
        clear();
      } else {
        setStatus("error");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-[1320px] px-14 py-24 text-center text-warm-gray max-[1100px]:px-8">
        Confirming your payment…
      </div>
    );
  }

  if (status === "error" || !order) {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <div className="py-24 text-center text-warm-gray">
          <h1 className="mb-3 font-display text-[1.6rem] text-charcoal">
            We couldn&apos;t confirm that payment.
          </h1>
          <p className="mx-auto mb-8 max-w-[380px] text-[0.9rem]">
            If money was deducted, it will be refunded automatically if the
            order wasn&apos;t placed. Please check your account orders or
            contact us if you&apos;re unsure.
          </p>
          <Link href="/" className={`${buttons.btn} ${buttons.primary}`}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
      <OrderConfirmation orderNumber={order.order_number} paymentMethod="online" />
    </div>
  );
}
