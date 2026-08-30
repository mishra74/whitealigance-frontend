"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import buttons from "@/styles/buttons.module.css";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useAddresses } from "@/lib/address-context";
import { apiGetOrders, type ApiOrder } from "@/lib/api";
import { formatINR } from "@/lib/format";
import ProfileSection from "@/components/account/ProfileSection";
import AddressBook from "@/components/account/AddressBook";

type View = "dashboard" | "profile" | "addresses" | "orders";
const INACTIVE_NAV = ["Returns"];

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

function OrderRow({ order }: { order: ApiOrder }) {
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="flex flex-wrap items-center justify-between gap-3 border-b border-cream py-4 text-[0.85rem] hover:bg-ivory"
    >
      <div>
        <div className="text-charcoal">{orderNumber(order.id)}</div>
        <div className="mt-1 text-warm-gray">
          {new Date(order.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <span className={`px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.08em] ${STATUS_CLASS[order.status]}`}>
        {STATUS_LABEL[order.status]}
      </span>
      <div className="text-charcoal">{formatINR(order.grand_total)}</div>
    </Link>
  );
}

function DashboardView({
  userName,
  orders,
  ordersLoading,
}: {
  userName: string;
  orders: ApiOrder[];
  ordersLoading: boolean;
}) {
  const { itemCount: wishlistCount } = useWishlist();
  const { addresses } = useAddresses();

  return (
    <div>
      <h1 className="mb-7 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-normal">
        Welcome back, {userName}
      </h1>

      <div className="mb-11 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-ivory p-6">
          <div className="font-display text-[1.8rem]">{orders.length}</div>
          <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.1em] text-muted-bronze">
            Orders Placed
          </div>
        </div>
        <div className="bg-ivory p-6">
          <div className="font-display text-[1.8rem]">{wishlistCount}</div>
          <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.1em] text-muted-bronze">
            Wishlist Items
          </div>
        </div>
        <div className="bg-ivory p-6">
          <div className="font-display text-[1.8rem]">{addresses.length}</div>
          <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.1em] text-muted-bronze">
            Saved Addresses
          </div>
        </div>
      </div>

      <h3 className="mb-3 font-display text-[1.2rem]">Recent Orders</h3>
      {ordersLoading ? (
        <div className="border-t border-cream py-12 text-center text-warm-gray">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="border-t border-cream py-12 text-center text-warm-gray">
          <p className="mb-6 text-[0.9rem]">No orders yet.</p>
          <Link href="/party-wear" className={`${buttons.btn} ${buttons.secondary}`}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="border-t border-cream">
          {orders.slice(0, 3).map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersView({ orders, ordersLoading }: { orders: ApiOrder[]; ordersLoading: boolean }) {
  return (
    <div>
      <h1 className="mb-7 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-normal">
        My Orders
      </h1>
      {ordersLoading ? (
        <div className="border-t border-cream py-12 text-center text-warm-gray">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="border-t border-cream py-12 text-center text-warm-gray">
          <p className="mb-6 text-[0.9rem]">You haven&apos;t placed any orders yet.</p>
          <Link href="/party-wear" className={`${buttons.btn} ${buttons.secondary}`}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="border-t border-cream">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  );
}

function AccountPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, logout } = useAuth();
  const [view, setView] = useState<View>(
    searchParams.get("view") === "orders" ? "orders" : "dashboard"
  );
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  useEffect(() => {
    if (!hydrated || !user) return;
    apiGetOrders().then(({ ok, json }) => {
      if (ok && json.status) setOrders(json.orders);
      setOrdersLoading(false);
    });
  }, [hydrated, user]);

  if (!hydrated || !user) return null;

  const navLinkClass = (active: boolean) =>
    `block w-full border-b border-cream py-3 text-left text-[0.78rem] tracking-[0.05em] ${
      active ? "font-semibold text-charcoal" : "text-warm-gray hover:text-charcoal"
    }`;

  return (
    <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-14 px-14 py-9 pb-20 max-[1100px]:px-8 md:grid-cols-[220px_1fr]">
      <aside>
        <button type="button" onClick={() => setView("dashboard")} className={navLinkClass(view === "dashboard")}>
          Dashboard
        </button>
        <button type="button" onClick={() => setView("orders")} className={navLinkClass(view === "orders")}>
          Orders
        </button>
        <button type="button" onClick={() => setView("profile")} className={navLinkClass(view === "profile")}>
          Profile
        </button>
        <button type="button" onClick={() => setView("addresses")} className={navLinkClass(view === "addresses")}>
          Addresses
        </button>
        {INACTIVE_NAV.map((label) => (
          <div
            key={label}
            className="block border-b border-cream py-3 text-[0.78rem] tracking-[0.05em] text-warm-gray/50"
            title="Not built yet"
          >
            {label}
          </div>
        ))}
        <Link
          href="/wishlist"
          className="block border-b border-cream py-3 text-[0.78rem] tracking-[0.05em] text-warm-gray hover:text-charcoal"
        >
          Wishlist
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="block w-full border-b border-cream py-3 text-left text-[0.78rem] tracking-[0.05em] text-warm-gray hover:text-charcoal"
        >
          Logout
        </button>
      </aside>

      {view === "dashboard" && (
        <DashboardView userName={user.name} orders={orders} ordersLoading={ordersLoading} />
      )}
      {view === "orders" && <OrdersView orders={orders} ordersLoading={ordersLoading} />}
      {view === "profile" && <ProfileSection />}
      {view === "addresses" && <AddressBook />}
    </div>
  );
}
