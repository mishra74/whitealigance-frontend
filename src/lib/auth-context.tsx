"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/** Shape is whatever the backend's `user` object contains — only name is guaranteed. */
export interface AuthUser {
  name: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  /** Called after a real login/signup response from the backend. */
  setSession: (token: string, user: AuthUser) => void;
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "email" | "phone">>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem(USER_KEY);
      const rawToken = window.localStorage.getItem(TOKEN_KEY);
      if (rawUser && rawToken) {
        setUser(JSON.parse(rawUser));
        setToken(rawToken);
      }
    } catch {
      // corrupt or inaccessible storage — start signed out
    }
    setHydrated(true);
  }, []);

  const setSession = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    window.localStorage.setItem(TOKEN_KEY, newToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const updateProfile = (patch: Partial<Pick<AuthUser, "name" | "email" | "phone">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      window.localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, hydrated, setSession, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
