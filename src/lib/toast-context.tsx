"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";

interface ToastState {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const DISPLAY_MS = 2600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const showToast = useCallback((message: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    idRef.current += 1;
    setToast({ id: idRef.current, message });
    timeoutRef.current = setTimeout(() => setToast(null), DISPLAY_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-[88px] z-[700] flex justify-center max-[1100px]:top-[78px]"
        aria-live="polite"
      >
        {toast && (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 bg-charcoal px-5 py-3.5 text-[0.82rem] text-pearl-white shadow-[0_12px_32px_rgba(20,17,14,0.28)] animate-[toast-in_0.4s_ease-out]"
          >
            <Check size={16} strokeWidth={2} className="text-soft-gold" />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
