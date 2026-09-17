"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import buttons from "@/styles/buttons.module.css";
import {
  apiForgotPassword,
  apiForgotPasswordOtp,
  apiResetPasswordOtp,
} from "@/lib/api";

type Mode = "link" | "code";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("link");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Code mode has a second step (enter the code + new password) once the
  // code has been requested for this email.
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [resetDone, setResetDone] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setSent(false);
    setResetDone(false);
    setError("");
  }

  async function handleRequestLink(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiForgotPassword(email);
      if (res.status) {
        setSent(true);
      } else {
        setError(res.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiForgotPasswordOtp(email);
      if (res.status) {
        setSent(true);
      } else {
        setError(res.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiResetPasswordOtp({
        email,
        otp,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.status) {
        setResetDone(true);
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
            Reset your password
          </h1>

          {resetDone ? (
            <>
              <p className="text-[0.9rem] text-warm-gray">
                Your password has been reset. You can now log in.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className={`${buttons.btn} ${buttons.primary} ${buttons.block} mt-6`}
              >
                Go to Log In
              </button>
            </>
          ) : (
            <>
              <div className="mb-7 flex border-b border-cream">
                <button
                  type="button"
                  onClick={() => switchMode("link")}
                  className={`border-b-2 px-0 py-3.5 mr-6 text-[0.7rem] uppercase tracking-[0.12em] ${
                    mode === "link"
                      ? "border-soft-gold text-charcoal"
                      : "border-transparent text-warm-gray"
                  }`}
                >
                  Reset via Link
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("code")}
                  className={`border-b-2 px-0 py-3.5 text-[0.7rem] uppercase tracking-[0.12em] ${
                    mode === "code"
                      ? "border-soft-gold text-charcoal"
                      : "border-transparent text-warm-gray"
                  }`}
                >
                  Reset via Code
                </button>
              </div>

              {mode === "link" ? (
                sent ? (
                  <p className="text-[0.9rem] text-warm-gray">
                    If an account exists for <strong>{email}</strong>,
                    we&apos;ve sent a link to reset your password. It expires
                    in 60 minutes.
                  </p>
                ) : (
                  <>
                    <p className="mb-6 text-[0.9rem] text-warm-gray">
                      Enter the email on your account and we&apos;ll send you
                      a link to reset your password.
                    </p>

                    <form onSubmit={handleRequestLink}>
                      <div className="mb-6">
                        <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                          placeholder="Enter your email"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`${buttons.btn} ${buttons.primary} ${buttons.block}`}
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                      </button>

                      {error && (
                        <p className="mt-4 text-sm text-red-500">{error}</p>
                      )}
                    </form>
                  </>
                )
              ) : !sent ? (
                <>
                  <p className="mb-6 text-[0.9rem] text-warm-gray">
                    Enter the email on your account and we&apos;ll email you a
                    6-digit code to reset your password.
                  </p>

                  <form onSubmit={handleRequestCode}>
                    <div className="mb-6">
                      <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                        placeholder="Enter your email"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`${buttons.btn} ${buttons.primary} ${buttons.block}`}
                    >
                      {loading ? "Sending..." : "Send Code"}
                    </button>

                    {error && (
                      <p className="mt-4 text-sm text-red-500">{error}</p>
                    )}
                  </form>
                </>
              ) : (
                <>
                  <p className="mb-6 text-[0.9rem] text-warm-gray">
                    We&apos;ve emailed a 6-digit code to{" "}
                    <strong>{email}</strong>. Enter it below with your new
                    password. The code expires in 10 minutes.
                  </p>

                  <form onSubmit={handleSubmitCode}>
                    <div className="mb-4">
                      <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                        6-Digit Code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] tracking-[0.3em] outline-none focus:border-soft-gold"
                        placeholder="123456"
                      />
                    </div>

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
                        onChange={(e) =>
                          setPasswordConfirmation(e.target.value)
                        }
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

                    {error && (
                      <p className="mt-4 text-sm text-red-500">{error}</p>
                    )}
                  </form>

                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-4 text-[0.75rem] text-muted-bronze hover:text-soft-gold"
                  >
                    Didn&apos;t get a code? Send again
                  </button>
                </>
              )}
            </>
          )}

          <Link
            href="/login"
            className="mt-6 block text-[0.75rem] text-muted-bronze hover:text-soft-gold"
          >
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
