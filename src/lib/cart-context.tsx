"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiApplyCoupon } from "./api";

export interface CartLine {
  /** sku + size uniquely identifies a line; same product in a different size is a separate line. */
  sku: string;
  handle: string;
  title: string;
  size: string;
  price: number;
  image?: string;
  imageLabel: string;
  qty: number;
}

interface CartContextValue {
  items: CartLine[];
  subtotal: number;
  itemCount: number;
  addItem: (line: Omit<CartLine, "qty">, qty?: number) => void;
  updateQty: (sku: string, size: string, qty: number) => void;
  removeItem: (sku: string, size: string) => void;
  clear: () => void;
  couponCode: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message?: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "we24-cart";

function lineKey(sku: string, size: string) {
  return `${sku}__${size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupt or inaccessible storage — start from an empty cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (line: Omit<CartLine, "qty">, qty = 1) => {
    setItems((prev) => {
      const key = lineKey(line.sku, line.size);
      const existing = prev.find((i) => lineKey(i.sku, i.size) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i.sku, i.size) === key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...line, qty }];
    });
  };

  const updateQty = (sku: string, size: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        lineKey(i.sku, i.size) === lineKey(sku, size)
          ? { ...i, qty: Math.max(1, qty) }
          : i
      )
    );
  };

  const removeItem = (sku: string, size: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i.sku, i.size) !== lineKey(sku, size)));
  };

  const clear = () => {
    setItems([]);
    setCouponCode(null);
    setCouponDiscount(0);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const applyCoupon = async (code: string) => {
    const { ok, json } = await apiApplyCoupon(code, subtotal);
    if (ok && json.status) {
      setCouponCode(json.code);
      setCouponDiscount(json.discount);
      return { ok: true };
    }
    return { ok: false, message: json.message ?? "Invalid discount coupon." };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        addItem,
        updateQty,
        removeItem,
        clear,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
