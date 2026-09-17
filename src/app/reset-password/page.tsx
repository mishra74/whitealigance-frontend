"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import buttons from "@/styles/buttons.module.css";
import { apiResetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageInner />
    </Suspense>
  );
}

function ResetPasswordPageInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiResetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.status) {
        setDone(true);
      } else if (res.errors) {
        setError(Object.values(res.errors).flat().join(" "));
      } else {
        setError(res.message || "Unable to reset password.");
      }
    } catch {
      setError("Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const missingLink = !token || !email;

  return (
    <div className="grid min-h-[640px] max-[1100px]:grid-cols-1 grid-cols-2">
      <div className="relative hidden min-h-[280px] max-[1100px]:block max-[1100px]:h-[280px] lg:block">
        <PlaceholderImage
          src="/assets/images/auth/auth-split-portrait.png"
          alt="Woman in a flowing white dress"
          label="Brand portrait"
          variant="dark"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 flex items-end bg-black/25 p-14">
          <p className="max-w-[420px] font-display text-[1.6rem] italic text-pearl-white">
            &ldquo;White is not a color. It is confidence.&rdquo;
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-14">
        <div className="w-full max-w-[360px]">
          <h1 className="mb-6 font-display text-[1.6rem] text-charcoal">
            Set a new password
          </h1>

          {missingLink ? (
            <>
              <p className="text-[0.9rem] text-warm-gray">
                This password reset link is invalid. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className={`${buttons.btn} ${buttons.primary} ${buttons.block} mt-6`}
              >
                Request New Link
              </Link>
            </>
          ) : done ? (
            <>
              <p className="text-[0.9rem] text-warm-gray">
                Your password has been reset. You can now log in.
              </p>
              <Link
                href="/login"
                className={`${buttons.btn} ${buttons.primary} ${buttons.block} mt-6`}
              >
                Go to Log In
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={5}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${buttons.btn} ${buttons.primary} ${buttons.block}`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
