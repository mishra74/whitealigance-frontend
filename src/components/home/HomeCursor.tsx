"use client";

import { useEffect, useRef } from "react";
import styles from "./HomeCursor.module.css";

const INTERACTIVE_SELECTOR = 'a, button, [role="button"]';

/** Homepage-only custom cursor — never mounted on other pages. */
export default function HomeCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.body.classList.add("cursor-none");

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
        dot.classList.add(styles.grow);
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
        dot.classList.remove(styles.grow);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      document.body.classList.remove("cursor-none");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  return <div ref={dotRef} className={styles.cursor} />;
}
