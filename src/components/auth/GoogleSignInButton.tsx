"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { googleLogin } from "@/lib/api";

// Minimal shape of the global Google Identity Services API we use.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; width?: number; text?: string }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (token: string, user: { name: string; email?: string; phone?: string }) => void;
  onError: (message: string) => void;
}

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    async function handleCredential(response: { credential: string }) {
      const json = await googleLogin(response.credential);
      if (json.status) {
        onSuccess(json.token, json.user);
      } else {
        onError(json.message || "Unable to sign in with Google.");
      }
    }

    function render() {
      if (!window.google || !buttonRef.current || !clientId) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
      });
    }

    if (window.google) render();
    else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          render();
        }
      }, 100);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (!clientId) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div ref={buttonRef} className="mb-5 flex justify-center" />
    </>
  );
}
