"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import buttons from "@/styles/buttons.module.css";

const inputClass =
  "w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold disabled:opacity-60";
const labelClass =
  "mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray";

export default function ProfileSection() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleCancel() {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setEditing(false);
  }

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-normal">
          Profile
        </h1>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`${buttons.btn} ${buttons.secondary}`}
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-[440px]">
        <div className="mb-5">
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            required
            disabled={!editing}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="mb-5">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            disabled={!editing}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="mb-6">
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            disabled={!editing}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        {editing && (
          <div className="flex gap-3">
            <button type="submit" className={`${buttons.btn} ${buttons.primary}`}>
              Save Changes
            </button>
            <button type="button" onClick={handleCancel} className={`${buttons.btn} ${buttons.secondary}`}>
              Cancel
            </button>
          </div>
        )}
        {saved && !editing && (
          <p className="text-[0.78rem] text-soft-gold">Profile updated.</p>
        )}
      </form>
    </div>
  );
}
