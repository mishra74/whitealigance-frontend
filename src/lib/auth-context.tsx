"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface MockUser {
  name: string;
  identifier: string; // phone or email, whatever they logged in/registered with
}

interface AuthContextValue {
  user: MockUser | null;
  hydrated: boolean;
  /** No real OTP is sent — this is a local-only demo session, not a backend login. */
  login: (identifier: string) => void;
  register: (name: string, email: string, phone: string, password: string, password_confirmation: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "we24-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // corrupt or inaccessible storage — start signed out
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, [user, hydrated]);

  const login = (identifier: string) => {
    const name = identifier.includes("@") ? identifier.split("@")[0] : "there";
    setUser({ name, identifier });
  };

  const register = (name: string, email: string, phone: string, password: string, password_confirmation: string) => {
    setUser({ name, identifier: email || phone });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, hydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
