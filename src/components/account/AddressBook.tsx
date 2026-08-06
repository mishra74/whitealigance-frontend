"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useAddresses, type Address, type AddressInput } from "@/lib/address-context";
import buttons from "@/styles/buttons.module.css";
import AddressForm from "./AddressForm";

function AddressCard({
  address,
  onEdit,
}: {
  address: Address;
  onEdit: () => void;
}) {
  const { removeAddress, setDefaultAddress } = useAddresses();

  return (
    <div className="border border-cream p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="border border-warm-beige px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.1em] text-muted-bronze">
            {address.label}
          </span>
          {address.isDefault && (
            <span className="text-[0.62rem] uppercase tracking-[0.1em] text-soft-gold">
              Default
            </span>
          )}
        </div>
        <div className="flex items-center gap-3.5 text-warm-gray">
          <button type="button" onClick={onEdit} aria-label="Edit address" className="hover:text-charcoal">
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => removeAddress(address.id)}
            aria-label="Delete address"
            className="hover:text-charcoal"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="text-[0.9rem]">
        <div className="font-semibold text-charcoal">{address.fullName}</div>
        <div className="text-warm-gray">{address.phone}</div>
        <div className="mt-1.5 text-warm-gray">
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}
          <br />
          {address.city}, {address.state} — {address.pincode}
        </div>
      </div>

      {!address.isDefault && (
        <button
          type="button"
          onClick={() => setDefaultAddress(address.id)}
          className="mt-4 text-[0.72rem] uppercase tracking-[0.08em] text-soft-gold underline"
        >
          Set as default
        </button>
      )}
    </div>
  );
}

export default function AddressBook() {
  const { addresses, addAddress, updateAddress } = useAddresses();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const editingAddress = addresses.find((a) => a.id === editingId);

  function handleAdd(input: AddressInput) {
    addAddress(input);
    setAdding(false);
  }

  function handleEdit(input: AddressInput) {
    if (editingId) updateAddress(editingId, input);
    setEditingId(null);
  }

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-normal">
          Saved Addresses
        </h1>
        {!adding && !editingId && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={`${buttons.btn} ${buttons.secondary} flex items-center gap-2`}
          >
            <Plus size={14} /> Add New Address
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-8">
          <AddressForm onSubmit={handleAdd} onCancel={() => setAdding(false)} submitLabel="Add Address" />
        </div>
      )}

      {editingAddress && (
        <div className="mb-8">
          <AddressForm
            initial={editingAddress}
            onSubmit={handleEdit}
            onCancel={() => setEditingId(null)}
            submitLabel="Save Changes"
          />
        </div>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="border-t border-cream py-16 text-center text-warm-gray">
          <p className="text-[0.9rem]">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} onEdit={() => setEditingId(address.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
