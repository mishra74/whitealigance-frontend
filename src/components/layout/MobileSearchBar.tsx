"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import styles from "./MobileSearchBar.module.css";

export default function MobileSearchBar() {
  return (
    <Link href="/search" className={styles.bar}>
      <Search size={16} strokeWidth={1.5} className={styles.icon} />
      <span className={styles.placeholder}>Search dresses, collections &amp; styles</span>
    </Link>
  );
}
