"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Search, ShoppingBag, User, X } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Collections", mega: true as const },
  { label: "Party Wear", href: "/party-wear" },
  { label: "Casual Wear", href: "/casual-wear" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Party Wear", href: "/party-wear" },
  { label: "Casual Wear", href: "/casual-wear" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// next.config.ts sets trailingSlash: true, so usePathname() returns
// "/casual-wear/" while nav hrefs are written as "/casual-wear" — compare
// with trailing slashes stripped so "current page" detection actually matches.
function stripTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

const ICON_LINKS = [
  { label: "Search", href: "/search", Icon: Search },
  { label: "Wishlist", href: "/wishlist", Icon: Heart },
  { label: "Account", href: "/account", Icon: User },
  { label: "Cart", href: "/cart", Icon: ShoppingBag },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const solid = !isHome || scrolled;

  // Clicking a link to the page you're already on should just close the
  // dropdown/drawer — never a reload or a no-op navigation. Clicking a
  // different page closes it too (immediately, rather than waiting for the
  // pathname-change effect) and lets the normal navigation proceed.
  function handleNavLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setMegaOpen(false);
    setMobileOpen(false);
    if (stripTrailingSlash(pathname) === stripTrailingSlash(href)) {
      e.preventDefault();
    }
  }

  return (
    <>
      <header
        id="site-header"
        className={`${styles.header} ${!isHome ? styles.sticky : ""} ${
          solid ? styles.solid : ""
        }`}
      >
        <Link href="/" className={styles.logo}>
          <img
            src="/assets/images/Logo/we24-logo-mark.png"
            alt="White Elegance 24"
            className={styles.logoMark}
          />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) =>
            item.mega ? (
              <span
                key={item.label}
                className={styles.navLink}
                onClick={(e) => {
                  e.stopPropagation();
                  setMegaOpen((v) => !v);
                }}
                aria-haspopup="true"
                aria-expanded={megaOpen}
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navLink} ${
                  stripTrailingSlash(pathname) === stripTrailingSlash(item.href)
                    ? styles.navLinkActive
                    : ""
                }`}
                onClick={(e) => handleNavLinkClick(e, item.href)}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className={styles.icons}>
          {ICON_LINKS.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className={`${styles.icon} ${styles.iconLink}`}
              aria-label={label}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label === "Cart" && itemCount > 0 && (
                <span className={styles.cartBadge}>{itemCount}</span>
              )}
              {label === "Wishlist" && wishlistCount > 0 && (
                <span className={styles.cartBadge}>{wishlistCount}</span>
              )}
            </Link>
          ))}
          <button
            type="button"
            className={styles.hamburger}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        ref={megaRef}
        className={`${styles.mega} ${megaOpen ? styles.megaOpen : ""}`}
      >
        <Link
          href="/party-wear"
          className={styles.megaCard}
          onClick={(e) => handleNavLinkClick(e, "/party-wear")}
        >
          <PlaceholderImage
            src="/assets/images/collections/party-wear-hero.png"
            alt="Party Wear lookbook"
            label="Party Wear — lookbook"
            variant="warm2"
            className="absolute inset-0"
          />
          <span className={styles.megaCardLabel}>Party Wear</span>
        </Link>
        <Link
          href="/casual-wear"
          className={styles.megaCard}
          onClick={(e) => handleNavLinkClick(e, "/casual-wear")}
        >
          <PlaceholderImage
            src="/assets/images/collections/casual-wear-hero.png"
            alt="Casual Wear lookbook"
            label="Casual Wear — lookbook"
            variant="warm3"
            className="absolute inset-0"
          />
          <span className={styles.megaCardLabel}>Casual Wear</span>
        </Link>
      </div>

      <div
        className={`${styles.mobileNavBackdrop} ${mobileOpen ? styles.mobileNavBackdropOpen : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`}
      >
        <button
          type="button"
          className={styles.mobileClose}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          <X size={22} strokeWidth={1.5} />
        </button>
        {MOBILE_NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavLinkClick(e, item.href)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
