"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { apiGetWishlist, apiToggleWishlist, apiRemoveWishlist } from "./api";

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
  const { user, hydrated: authHydrated } = useAuth();
  const [items, setItems] = useState<WishlistLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Guests: hydrate from localStorage. Logged-in users: the backend is authoritative.
  useEffect(() => {
    if (!authHydrated) return;

    if (user) {
      apiGetWishlist().then(({ ok, json }) => {
        if (ok && json.status) setItems(json.items);
        setHydrated(true);
      });
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupt or inaccessible storage — start with an empty wishlist
    }
    setHydrated(true);
  }, [authHydrated, user]);

  useEffect(() => {
    if (!hydrated || user) return; // only persist locally for guests
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated, user]);

  const isWishlisted = (handle: string) => items.some((i) => i.handle === handle);

  const toggle = (line: WishlistLine) => {
    if (user) {
      const alreadyIn = isWishlisted(line.handle);
      setItems((prev) =>
        alreadyIn ? prev.filter((i) => i.handle !== line.handle) : [...prev, line]
      );
      apiToggleWishlist(line.handle).then(({ ok, json }) => {
        if (!ok || !json.status) {
          // revert on failure
          setItems((prev) =>
            alreadyIn
              ? [...prev, line]
              : prev.filter((i) => i.handle !== line.handle)
          );
        }
      });
      return;
    }

    setItems((prev) =>
      prev.some((i) => i.handle === line.handle)
        ? prev.filter((i) => i.handle !== line.handle)
        : [...prev, line]
    );
  };

  const remove = (handle: string) => {
    setItems((prev) => prev.filter((i) => i.handle !== handle));
    if (user) apiRemoveWishlist(handle);
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
