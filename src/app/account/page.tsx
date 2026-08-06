"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import buttons from "@/styles/buttons.module.css";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useAddresses } from "@/lib/address-context";
import ProfileSection from "@/components/account/ProfileSection";
import AddressBook from "@/components/account/AddressBook";

type View = "dashboard" | "profile" | "addresses";
const INACTIVE_NAV = ["Orders", "Returns"];

function DashboardView({ userName }: { userName: string }) {
  const { itemCount: wishlistCount } = useWishlist();
  const { addresses } = useAddresses();

  return (
    <div>
      <h1 className="mb-7 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-normal">
        Welcome back, {userName}
      </h1>

      <div className="mb-11 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-ivory p-6">
          <div className="font-display text-[1.8rem]">0</div>
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
      <div className="border-t border-cream py-12 text-center text-warm-gray">
        <p className="mb-6 text-[0.9rem]">
          No orders yet — checkout is running in sandbox mode until a live
          payment gateway is connected.
        </p>
        <Link href="/party-wear" className={`${buttons.btn} ${buttons.secondary}`}>
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, hydrated, logout } = useAuth();
  const [view, setView] = useState<View>("dashboard");

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

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

      {view === "dashboard" && <DashboardView userName={user.name} />}
      {view === "profile" && <ProfileSection />}
      {view === "addresses" && <AddressBook />}
    </div>
  );
}
