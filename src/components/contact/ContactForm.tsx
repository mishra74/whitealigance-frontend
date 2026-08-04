"use client";

import { useState, type FormEvent } from "react";
import buttons from "@/styles/buttons.module.css";

const CONTACT_EMAIL = "amruta.nilatkar.47@gmail.com";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = `Website inquiry from ${name}`;
    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
        />
      </div>
      <div className="mb-5">
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
          Message
        </label>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
        />
      </div>
      <button
        type="submit"
        className={`${buttons.btn} ${buttons.primary} ${buttons.block}`}
      >
        Send Message
      </button>
      {sent && (
        <p className="mt-3 text-[0.8rem] text-warm-gray">
          Opening your email app with this message ready to send to{" "}
          {CONTACT_EMAIL}.
        </p>
      )}
    </form>
  );
}
