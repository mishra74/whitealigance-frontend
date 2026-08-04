import { formatINR } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 5000;

export default function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="mb-5 max-w-[420px]">
      <div className="mb-1.5 text-[0.78rem] text-warm-gray">
        {remaining > 0
          ? `Add ${formatINR(remaining)} more for free shipping`
          : "You've unlocked free shipping"}
      </div>
      <div className="h-1 bg-cream">
        <div
          className="h-full bg-soft-gold transition-[width] duration-500 ease-fabric"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
