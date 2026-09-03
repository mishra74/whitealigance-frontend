"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileCategoryNav.module.css";

// next.config.ts sets trailingSlash: true, so usePathname() returns a
// trailing slash while these hrefs are written without one — strip it on
// both sides before comparing (same helper as Header.tsx).
function stripTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

const CATEGORIES = [
  { label: "All", href: "/search?all=1" },
  { label: "Party Wear", href: "/party-wear" },
  { label: "Casual Wear", href: "/casual-wear" },
];

export default function MobileCategoryNav() {
  const pathname = usePathname();
  const current = stripTrailingSlash(pathname);

  return (
    <nav className={styles.nav} aria-label="Shop by category">
      {CATEGORIES.map((c) => {
        const targetPath = c.href.split("?")[0];
        const active = current === stripTrailingSlash(targetPath);
        return (
          <Link
            key={c.label}
            href={c.href}
            className={`${styles.chip} ${active ? styles.chipActive : ""}`}
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}
