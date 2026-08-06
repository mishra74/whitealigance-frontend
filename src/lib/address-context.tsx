"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AddressLabel = "Home" | "Work" | "Other";

export interface Address {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type AddressInput = Omit<Address, "id" | "isDefault">;

interface AddressContextValue {
  addresses: Address[];
  defaultAddress: Address | undefined;
  addAddress: (input: AddressInput, makeDefault?: boolean) => Address;
  updateAddress: (id: string, patch: Partial<AddressInput>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextValue | null>(null);

const STORAGE_KEY = "we24-addresses";

function generateId() {
  return `addr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setAddresses(JSON.parse(raw));
    } catch {
      // corrupt or inaccessible storage — start with no saved addresses
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  const addAddress = (input: AddressInput, makeDefault?: boolean) => {
    const address: Address = { ...input, id: generateId(), isDefault: false };
    setAddresses((prev) => {
      const shouldBeDefault = makeDefault || prev.length === 0;
      address.isDefault = shouldBeDefault;
      return shouldBeDefault
        ? [...prev.map((a) => ({ ...a, isDefault: false })), address]
        : [...prev, address];
    });
    return address;
  };

  const updateAddress = (id: string, patch: Partial<AddressInput>) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => {
      const removed = prev.find((a) => a.id === id);
      const rest = prev.filter((a) => a.id !== id);
      if (removed?.isDefault && rest.length > 0) {
        return rest.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a));
      }
      return rest;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <AddressContext.Provider
      value={{ addresses, defaultAddress, addAddress, updateAddress, removeAddress, setDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses must be used within an AddressProvider");
  return ctx;
}
