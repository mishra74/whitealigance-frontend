"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface WishlistLine {
  handle: string;
  title: string;
  price: number;
  image?: string;
  imageLabel: string;
}

interface WishlistContextValue {
  items: WishlistLine[];
  itemCount: number;
  isWishlisted: (handle: string) => boolean;
  toggle: (line: WishlistLine) => void;
  remove: (handle: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "we24-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupt or inaccessible storage — start with an empty wishlist
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const isWishlisted = (handle: string) => items.some((i) => i.handle === handle);

  const toggle = (line: WishlistLine) => {
    setItems((prev) =>
      prev.some((i) => i.handle === line.handle)
        ? prev.filter((i) => i.handle !== line.handle)
        : [...prev, line]
    );
  };

  const remove = (handle: string) => {
    setItems((prev) => prev.filter((i) => i.handle !== handle));
  };

  const itemCount = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{ items, itemCount, isWishlisted, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
