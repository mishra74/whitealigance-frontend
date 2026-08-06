"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import buttons from "@/styles/buttons.module.css";
import { useAuth } from "@/lib/auth-context";
import { signup, login } from "@/lib/api";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { user, hydrated, setSession } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (hydrated && user) router.replace("/account");
  }, [hydrated, user, router]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setErrors("");

    try {
      const res = await login({
        email: loginEmail,
        password: loginPassword,
      });

      if (res.status) {
        setSession(res.token, res.user ?? { name: loginEmail, email: loginEmail });
        router.push("/account");
      } else {
        setErrors(res.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setErrors("Unable to login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      const res = await signup({
        name,
        email: registerEmail,
        phone,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.status) {
        setSession(res.token, res.user ?? { name, email: registerEmail, phone });
        router.push("/account");
      } else if (res.errors) {
        setErrors(JSON.stringify(res.errors));
      } else {
        setErrors(res.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      setErrors("Unable to register.");
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
          {googleClientId && (
            <>
              <GoogleSignInButton
                onSuccess={(token, user) => {
                  setSession(token, user);
                  router.push("/account");
                }}
                onError={(message) => setErrors(message)}
              />

              <div className="mb-7 flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                <span className="h-px flex-1 bg-cream" />
                or
                <span className="h-px flex-1 bg-cream" />
              </div>
            </>
          )}

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
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${buttons.btn} ${buttons.primary} ${buttons.block}`}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              {errors && (
                <p className="mt-4 text-sm text-red-500">{errors}</p>
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
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
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
              <div className="mb-4">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Confirm Password
                </label>

                <input
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
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
            Checkout is running in sandbox mode until a live payment gateway
            is connected — your account itself is real.
          </p>
        </div>
      </div>
    </div>
  );
}
