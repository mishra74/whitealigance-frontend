"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import buttons from "@/styles/buttons.module.css";
import { useAuth } from "@/lib/auth-context";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { user, hydrated, login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (hydrated && user) router.replace("/account");
  }, [hydrated, user, router]);

  function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setOtpSent(true);
  }

  function handleVerify(e: FormEvent) {
    e.preventDefault();
    login(identifier);
    router.push("/account");
  }

  function handleRegister(e: FormEvent) {
    e.preventDefault();
    register(name, email, phone);
    router.push("/account");
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
          <div className="mb-8 flex border-b border-cream">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`border-b-2 px-0 py-3.5 mr-6 text-[0.7rem] uppercase tracking-[0.12em] ${
                tab === "login"
                  ? "border-soft-gold text-charcoal"
                  : "border-transparent text-warm-gray"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`border-b-2 px-0 py-3.5 text-[0.7rem] uppercase tracking-[0.12em] ${
                tab === "register"
                  ? "border-soft-gold text-charcoal"
                  : "border-transparent text-warm-gray"
              }`}
            >
              Register
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={otpSent ? handleVerify : handleSendOtp}>
              <div className="mb-3.5">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Phone or Email
                </label>
                <input
                  type="text"
                  required
                  disabled={otpSent}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold disabled:opacity-60"
                />
              </div>

              {otpSent && (
                <>
                  <p className="mb-3.5 text-[0.78rem] text-warm-gray">
                    No live SMS gateway is connected yet — enter any 4 digits
                    to continue in demo mode.
                  </p>
                  <div className="mb-5 flex gap-2.5">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        required
                        value={digit}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 1);
                          setOtp((prev) => prev.map((d, idx) => (idx === i ? v : d)));
                        }}
                        className="h-[52px] w-11 border border-warm-beige text-center text-[1.1rem] outline-none focus:border-soft-gold"
                      />
                    ))}
                  </div>
                </>
              )}

              <button
                type="submit"
                className={`${buttons.btn} ${buttons.primary} ${buttons.block}`}
              >
                {otpSent ? "Verify & Log In" : "Send OTP"}
              </button>
              {otpSent && (
                <div className="mt-4 flex justify-between text-[0.78rem]">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-soft-gold"
                  >
                    Change number
                  </button>
                  <button type="button" className="text-soft-gold">
                    Resend OTP
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-3.5">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
              <div className="mb-3.5">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
              <button
                type="submit"
                className={`${buttons.btn} ${buttons.primary} ${buttons.block}`}
              >
                Create Account
              </button>
            </form>
          )}

          <p className="mt-6 text-[0.72rem] text-muted-bronze">
            Demo account only — stored in this browser, not on a live
            backend yet.
          </p>
        </div>
      </div>
    </div>
  );
}
