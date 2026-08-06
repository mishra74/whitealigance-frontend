"use client";

import { useState, type FormEvent } from "react";
import buttons from "@/styles/buttons.module.css";
import { apiSendContact } from "@/lib/api";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const { ok, json } = await apiSendContact({
      name,
      email,
      subject: `Website inquiry from ${name}`,
      message,
    });

    setSending(false);

    if (ok && json.status) {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setError(
        json.errors
          ? Object.values(json.errors).flat().join(" ")
          : "Something went wrong sending your message. Please try again."
      );
    }
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
        disabled={sending}
        className={`${buttons.btn} ${buttons.primary} ${buttons.block} disabled:opacity-60`}
      >
        {sending ? "Sending…" : "Send Message"}
      </button>
      {sent && (
        <p className="mt-3 text-[0.8rem] text-warm-gray">
          Thanks for reaching out — we&apos;ll get back to you soon.
        </p>
      )}
      {error && <p className="mt-3 text-[0.8rem] text-red-500">{error}</p>}
    </form>
  );
}
