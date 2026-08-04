"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

const CONTACT_EMAIL = "amruta.nilatkar.47@gmail.com";

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "Newsletter signup"
    )}&body=${encodeURIComponent(`Please add this email to the list: ${email}`)}`;
    setSent(true);
  }

  return (
    <section
      ref={sectionRef}
      className="bg-charcoal px-14 py-[180px] text-center text-pearl-white max-[1100px]:px-8"
    >
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-soft-gold">
        Stay Close
      </span>
      <h2 className="mt-[18px] font-display text-[clamp(2rem,4vw,3.2rem)] font-normal tracking-[-0.01em] text-pearl-white">
        Be the first to know.
      </h2>
      <p className="mx-auto my-4 max-w-[420px] text-pearl-white/70">
        New arrivals, early access, nothing else.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-[420px] border-b border-pearl-white/40"
      >
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent px-1 py-3.5 text-[0.95rem] text-pearl-white outline-none placeholder:text-pearl-white/45"
        />
        <button
          type="submit"
          className="px-1 py-3.5 text-[0.7rem] uppercase tracking-[0.14em] text-soft-gold"
        >
          Subscribe
        </button>
      </form>
      {sent && (
        <p className="mt-3 text-[0.8rem] text-pearl-white/70">
          Opening your email app so we can add {email} to the list.
        </p>
      )}
    </section>
  );
}
