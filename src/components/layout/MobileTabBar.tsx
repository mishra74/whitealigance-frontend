"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  LayoutGrid,
  Search,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import styles from "./MobileTabBar.module.css";

interface Tab {
  label: string;
  href?: string;
  Icon: LucideIcon;
}

const TABS: Tab[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Collections", Icon: LayoutGrid },
  { label: "Search", href: "/search", Icon: Search },
  { label: "Wishlist", href: "/wishlist", Icon: Heart },
  { label: "Cart", href: "/cart", Icon: ShoppingBag },
  { label: "Account", href: "/account", Icon: User },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCollectionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!collectionsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setCollectionsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCollectionsOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [collectionsOpen]);

  const collectionsActive = pathname === "/party-wear" || pathname === "/casual-wear";

  return (
    <>
      <div
        className={`${styles.backdrop} ${collectionsOpen ? styles.backdropOpen : ""}`}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        className={`${styles.sheet} ${collectionsOpen ? styles.sheetOpen : ""}`}
      >
        <span className={styles.sheetTitle}>Shop by Collection</span>
        <Link href="/party-wear" className={styles.sheetLink}>
          Party Wear
        </Link>
        <Link href="/casual-wear" className={styles.sheetLink}>
          Casual Wear
        </Link>
      </div>

      <nav className={styles.bar} aria-label="Mobile">
        {TABS.map(({ label, href, Icon }) => {
          if (!href) {
            return (
              <button
                key={label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCollectionsOpen((v) => !v);
                }}
                className={`${styles.tab} ${
                  collectionsActive || collectionsOpen ? styles.tabActive : ""
                }`}
                aria-haspopup="true"
                aria-expanded={collectionsOpen}
              >
                <span className={styles.iconWrap}>
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <span className={styles.label}>{label}</span>
              </button>
            );
          }

          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <span className={styles.iconWrap}>
                <Icon size={20} strokeWidth={1.5} />
                {label === "Cart" && itemCount > 0 && (
                  <span className={styles.badge}>{itemCount}</span>
                )}
                {label === "Wishlist" && wishlistCount > 0 && (
                  <span className={styles.badge}>{wishlistCount}</span>
                )}
              </span>
              <span className={styles.label}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
