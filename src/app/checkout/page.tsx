"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useAddresses, type AddressInput } from "@/lib/address-context";
import { apiPlaceOrder } from "@/lib/api";
import { formatINR } from "@/lib/format";
import buttons from "@/styles/buttons.module.css";
import PaymentTabs from "@/components/checkout/PaymentTabs";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import AddressForm from "@/components/account/AddressForm";

const FREE_SHIPPING_THRESHOLD = 5000;
// Matches the real ShippingCharge row for India in the database (₹50) — the
// order endpoint is the source of truth; this is only a pre-submit estimate.
const FLAT_SHIPPING = 50;

const inputClass =
  "w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold";
const labelClass =
  "mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray";

type ShippingSelection =
  | { type: "saved"; addressId: string }
  | { type: "inline"; address: AddressInput };

function ShippingAddressSection({
  onChange,
}: {
  onChange: (selection: ShippingSelection | null) => void;
}) {
  const { user, hydrated } = useAuth();
  const { addresses, defaultAddress, addAddress } = useAddresses();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Addresses load asynchronously from the API, so defaultAddress isn't
  // available on first render — select it once it arrives.
  useEffect(() => {
    if (selectedId || !defaultAddress) return;
    setSelectedId(defaultAddress.id);
    onChange({ type: "saved", addressId: defaultAddress.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress]);
  const [guestAddress, setGuestAddress] = useState<AddressInput>({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loggedIn = hydrated && !!user;

  function selectAddress(id: string) {
    setSelectedId(id);
    onChange({ type: "saved", addressId: id });
  }

  function updateGuestAddress(patch: Partial<AddressInput>) {
    const next = { ...guestAddress, ...patch };
    setGuestAddress(next);
    onChange({ type: "inline", address: next });
  }

  if (!loggedIn) {
    // Guest checkout — no address book to pick from, just the plain fields.
    return (
      <div className="mb-5 grid grid-cols-1 gap-5">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            required
            value={guestAddress.fullName}
            onChange={(e) => updateGuestAddress({ fullName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Address Line 1</label>
          <input
            type="text"
            required
            value={guestAddress.line1}
            onChange={(e) => updateGuestAddress({ line1: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Address Line 2 (optional)</label>
          <input
            type="text"
            value={guestAddress.line2}
            onChange={(e) => updateGuestAddress({ line2: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              required
              value={guestAddress.city}
              onChange={(e) => updateGuestAddress({ city: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              required
              value={guestAddress.state}
              onChange={(e) => updateGuestAddress({ state: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Pincode</label>
            <input
              type="text"
              required
              inputMode="numeric"
              value={guestAddress.pincode}
              onChange={(e) => updateGuestAddress({ pincode: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    );
  }

  if (addingNew || addresses.length === 0) {
    return (
      <>
        <AddressForm
          asForm={false}
          disabled={savingAddress}
          submitLabel={savingAddress ? "Saving…" : "Use This Address"}
          onSubmit={async (input) => {
            setAddressError(null);
            setSavingAddress(true);
            try {
              const saved = await addAddress(input, addresses.length === 0);
              selectAddress(saved.id);
              setAddingNew(false);
            } catch (e) {
              setAddressError(e instanceof Error ? e.message : "Unable to save address.");
            } finally {
              setSavingAddress(false);
            }
          }}
          onCancel={() => setAddingNew(false)}
        />
        {addressError && <p className="mt-3 text-[0.8rem] text-red-500">{addressError}</p>}
      </>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <button
            key={address.id}
            type="button"
            onClick={() => selectAddress(address.id)}
            className={`border p-5 text-left text-[0.85rem] ${
              selectedId === address.id ? "border-charcoal" : "border-warm-beige"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="border border-warm-beige px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-muted-bronze">
                {address.label}
              </span>
              {address.isDefault && (
                <span className="text-[0.6rem] uppercase tracking-[0.1em] text-soft-gold">Default</span>
              )}
            </div>
            <div className="font-semibold text-charcoal">{address.fullName}</div>
            <div className="text-warm-gray">{address.phone}</div>
            <div className="mt-1 text-warm-gray">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} — {address.pincode}
            </div>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setAddingNew(true)}
        className="mt-4 text-[0.72rem] uppercase tracking-[0.08em] text-soft-gold underline"
      >
        + Add New Address
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, couponCode, couponDiscount, clear } = useCart();
  const { user, hydrated } = useAuth();

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [shipping, setShipping] = useState<ShippingSelection | null>(null);

  // user loads asynchronously after hydration, so the useState initializers
  // above can't see it yet — sync once it becomes available.
  useEffect(() => {
    if (!hydrated || !user) return;
    setContactEmail((prev) => prev || user.email || "");
    setContactPhone((prev) => prev || user.phone || "");
  }, [hydrated, user]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    grandTotal: number;
  } | null>(null);

  async function handlePlaceOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!shipping) {
      setSubmitError("Please add a shipping address before placing your order.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const { ok, json } = await apiPlaceOrder({
      contact_email: contactEmail,
      contact_phone: contactPhone,
      ...(shipping.type === "saved"
        ? { address_id: shipping.addressId }
        : { shipping: shipping.address }),
      items: items.map((line) => ({ sku: line.sku, qty: line.qty })),
      coupon_code: couponCode ?? undefined,
    });

    setSubmitting(false);

    if (ok && json.status) {
      clear();
      setConfirmedOrder({ orderNumber: json.order_number, grandTotal: json.grand_total });
    } else {
      setSubmitError(
        json.message ||
          (json.errors ? Object.values(json.errors).flat().join(" ") : null) ||
          "Something went wrong placing your order. Please try again."
      );
    }
  }

  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <OrderConfirmation orderNumber={confirmedOrder.orderNumber} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <div className="py-24 text-center text-warm-gray">
          <h1 className="mb-3 font-display text-[1.6rem] text-charcoal">
            Your cart is empty.
          </h1>
          <p className="mx-auto mb-8 max-w-[360px] text-[0.9rem]">
            Add something to your cart before checking out.
          </p>
          <Link href="/party-wear" className={`${buttons.btn} ${buttons.primary}`}>
            Explore Party Wear
          </Link>
        </div>
      </div>
    );
  }

  const afterDiscount = Math.max(0, subtotal - couponDiscount);
  const shippingCost = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = afterDiscount + shippingCost;

  return (
    <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
      <h1 className="pt-8 pb-2.5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
        Checkout
      </h1>

      <div className="mb-1 rounded-none bg-ivory px-4 py-2.5 text-[0.75rem] text-muted-bronze">
        Sandbox / test mode — no real payment will be charged.
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-16 pt-6 pb-20 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-6 text-[0.82rem] text-warm-gray">
            {hydrated && user ? (
              `Checking out as ${user.name}`
            ) : (
              <>
                Checking out as guest —{" "}
                <Link href="/login" className="text-soft-gold underline">
                  log in instead
                </Link>
              </>
            )}
          </div>

          <div className="mb-11">
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-[1.15rem]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-[0.72rem] text-pearl-white">
                1
              </span>
              Contact
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
              <div>
                <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-warm-gray">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full border-b border-warm-beige bg-transparent px-0.5 py-2.5 text-[0.95rem] outline-none focus:border-soft-gold"
                />
              </div>
            </div>
          </div>

          <div className="mb-11">
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-[1.15rem]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-[0.72rem] text-pearl-white">
                2
              </span>
              Shipping Address
            </h3>
            <ShippingAddressSection onChange={setShipping} />
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2.5 font-display text-[1.15rem]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-[0.72rem] text-pearl-white">
                3
              </span>
              Payment
            </h3>
            <PaymentTabs />
          </div>
        </div>

        <div className="h-fit bg-ivory p-8">
          <h3 className="mb-5 font-display text-[1.2rem]">Order Summary</h3>
          <div className="mb-4 max-h-[280px] overflow-y-auto">
            {items.map((line) => (
              <div key={`${line.sku}-${line.size}`} className="mb-4 flex gap-3 last:mb-0">
                <div className="w-14 shrink-0 bg-cream" style={{ aspectRatio: "3/4" }} />
                <div className="text-[0.85rem]">
                  <div>{line.title}</div>
                  <div className="text-warm-gray">
                    Size {line.size} · Qty {line.qty}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
              <span>Discount ({couponCode})</span>
              <span>−{formatINR(couponDiscount)}</span>
            </div>
          )}
          <div className="mb-3.5 flex justify-between text-[0.9rem] text-warm-gray">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "Free" : formatINR(shippingCost)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-warm-beige pt-4 text-[1.05rem] font-semibold text-charcoal">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>

          {submitError && (
            <p className="mt-4 text-[0.8rem] text-red-500">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`${buttons.btn} ${buttons.primary} ${buttons.block} mt-6 disabled:opacity-60`}
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
