"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiGetOrder, type ApiOrder, type ApiOrderItem } from "@/lib/api";
import { formatINR } from "@/lib/format";
import buttons from "@/styles/buttons.module.css";

const STATUS_LABEL: Record<ApiOrder["status"], string> = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_CLASS: Record<ApiOrder["status"], string> = {
  pending: "bg-champagne text-muted-bronze",
  shipped: "bg-warm-beige text-charcoal",
  delivered: "bg-charcoal text-pearl-white",
  cancelled: "bg-red-100 text-red-600",
};

function orderNumber(id: number): string {
  return "WE24-" + String(id).padStart(8, "0");
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailPageInner />
    </Suspense>
  );
}

function OrderDetailPageInner() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { user, hydrated } = useAuth();
  const justPlaced = searchParams.get("new") === "1";

  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error" }
    | { status: "ready"; order: ApiOrder; items: ApiOrderItem[] }
  >({ status: "loading" });

  useEffect(() => {
    if (hydrated && !user) {
      router.replace(`/login?redirect=/account/orders/${params.id}`);
    }
  }, [hydrated, user, router, params.id]);

  useEffect(() => {
    if (!hydrated || !user) return;

    let cancelled = false;

    apiGetOrder(params.id).then(({ ok, json }) => {
      if (cancelled) return;
      if (ok && json.status) {
        setState({ status: "ready", order: json.order, items: json.items });
      } else {
        setState({ status: "error" });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hydrated, user, params.id]);

  if (!hydrated || !user || state.status === "loading") {
    return (
      <div className="mx-auto max-w-[1320px] px-14 py-24 text-center text-warm-gray max-[1100px]:px-8">
        Loading order…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <div className="py-24 text-center text-warm-gray">
          <h1 className="mb-3 font-display text-[1.6rem] text-charcoal">
            We couldn&apos;t find that order.
          </h1>
          <p className="mx-auto mb-8 max-w-[380px] text-[0.9rem]">
            It may not exist, or it may belong to a different account.
          </p>
          <Link href="/account?view=orders" className={`${buttons.btn} ${buttons.primary}`}>
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const { order, items } = state;

  return (
    <div className="mx-auto max-w-[900px] px-14 pb-20 max-[1100px]:px-8">
      {justPlaced && (
        <div className="mt-8 flex items-center gap-3 border border-soft-gold/40 bg-ivory px-6 py-5">
          <CheckCircle2 size={22} strokeWidth={1.5} className="shrink-0 text-soft-gold" />
          <p className="text-[0.85rem] text-charcoal">
            {order.payment_method === "online"
              ? "Payment successful — your order has been placed."
              : "Your order has been placed. Pay in cash when it arrives."}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-8 pb-2.5">
        <div>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
            Order {orderNumber(order.id)}
          </span>
          <h1 className="mt-2 font-display text-[clamp(1.5rem,3vw,2rem)] font-normal">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h1>
        </div>
        <span
          className={`px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.08em] ${STATUS_CLASS[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
            Shipping Address
          </h3>
          <div className="text-[0.9rem] text-charcoal">
            <div>{order.first_name} {order.last_name}</div>
            <div className="mt-1 text-warm-gray">
              {order.address}
              {order.apartment ? `, ${order.apartment}` : ""}, {order.city}, {order.state} — {order.zip}
            </div>
            <div className="mt-1 text-warm-gray">{order.mobile}</div>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
            Payment
          </h3>
          <div className="text-[0.9rem] text-charcoal">
            {order.payment_method === "online" ? "Online (Razorpay)" : "Cash on Delivery"}
            {" — "}
            {order.payment_status === "paid" ? "Paid" : "Not Paid"}
          </div>
        </div>
      </div>

      <div className="mt-11">
        <h3 className="mb-4 text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
          Items
        </h3>
        <div className="border-t border-cream">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-cream py-4 text-[0.9rem]">
              <div>
                <div className="text-charcoal">{item.name}</div>
                <div className="mt-1 text-warm-gray">
                  {item.size ? `Size ${item.size} · ` : ""}Qty {item.qty}
                </div>
              </div>
              <div className="text-charcoal">{formatINR(item.total)}</div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-[320px] sm:ml-auto sm:mr-0">
          <div className="mb-2.5 flex justify-between text-[0.9rem] text-warm-gray">
            <span>Subtotal</span>
            <span>{formatINR(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="mb-2.5 flex justify-between text-[0.9rem] text-warm-gray">
              <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
              <span>−{formatINR(order.discount)}</span>
            </div>
          )}
          <div className="mb-2.5 flex justify-between text-[0.9rem] text-warm-gray">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-warm-beige pt-4 text-[1.05rem] font-semibold text-charcoal">
            <span>Total</span>
            <span>{formatINR(order.grand_total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <Link href="/account?view=orders" className={`${buttons.btn} ${buttons.secondary}`}>
          Back to My Orders
        </Link>
        <Link href="/" className={`${buttons.btn} ${buttons.primary}`}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
