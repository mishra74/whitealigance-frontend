"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import {
  apiGetAddresses,
  apiAddAddress,
  apiUpdateAddress,
  apiDeleteAddress,
  apiSetDefaultAddress,
} from "./api";

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
  hydrated: boolean;
  addAddress: (input: AddressInput, makeDefault?: boolean) => Promise<Address>;
  updateAddress: (id: string, patch: AddressInput) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextValue | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user, hydrated: authHydrated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Addresses only exist for real accounts — nothing to load for guests.
  useEffect(() => {
    if (!authHydrated) return;
    if (!user) {
      setAddresses([]);
      setHydrated(true);
      return;
    }
    apiGetAddresses().then(({ ok, json }) => {
      if (ok && json.status) setAddresses(json.addresses);
      setHydrated(true);
    });
  }, [authHydrated, user]);

  const addAddress = async (input: AddressInput, makeDefault?: boolean): Promise<Address> => {
    // Awaits the real server response (rather than returning an optimistic
    // local object) so callers — like checkout submitting an order right
    // after adding an address — always have a real, valid address id.
    const { ok, json } = await apiAddAddress(input, makeDefault ?? addresses.length === 0);

    if (!ok || !json.status) {
      throw new Error(json.message || "Unable to save address.");
    }

    setAddresses((prev) => {
      const shouldBeDefault = json.address.isDefault;
      return shouldBeDefault
        ? [...prev.map((a) => ({ ...a, isDefault: false })), json.address]
        : [...prev, json.address];
    });

    return json.address;
  };

  const updateAddress = (id: string, patch: AddressInput) => {
    const previous = addresses;
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

    apiUpdateAddress(id, patch).then(({ ok, json }) => {
      if (ok && json.status) {
        setAddresses((prev) => prev.map((a) => (a.id === id ? json.address : a)));
      } else {
        setAddresses(previous);
      }
    });
  };

  const removeAddress = (id: string) => {
    const previous = addresses;
    setAddresses((prev) => {
      const removed = prev.find((a) => a.id === id);
      const rest = prev.filter((a) => a.id !== id);
      if (removed?.isDefault && rest.length > 0) {
        return rest.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a));
      }
      return rest;
    });

    apiDeleteAddress(id).then(({ ok }) => {
      if (!ok) setAddresses(previous);
    });
  };

  const setDefaultAddress = (id: string) => {
    const previous = addresses;
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

    apiSetDefaultAddress(id).then(({ ok }) => {
      if (!ok) setAddresses(previous);
    });
  };

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <AddressContext.Provider
      value={{ addresses, defaultAddress, hydrated, addAddress, updateAddress, removeAddress, setDefaultAddress }}
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
