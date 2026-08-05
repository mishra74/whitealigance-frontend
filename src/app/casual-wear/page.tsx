import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import CasualWearGrid from "@/components/collection/CasualWearGrid";
import { getApiProductsByCollection } from "@/lib/api";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Casual Wear | WHITE ELEGANCE 24",
  description:
    "The Casual Wear collection from WHITE ELEGANCE 24 — everyday dresses, co-ords and separates in elegant white.",
};

export default async function CasualWearPage() {
  const products = await getApiProductsByCollection("casual-wear");

  return (
    <>
      <section className="relative flex h-[64vh] min-h-[420px] items-end overflow-hidden">
        <PlaceholderImage
          src="/assets/images/collections/casual-wear-hero.png"
          alt="Casual Wear collection"
          label="Casual Wear — editorial banner"
          variant="warm3"
          className="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-[2] px-14 pb-12 text-pearl-white">
          <span className="text-[0.72rem] uppercase tracking-[0.22em] text-pearl-white/85">
            Collection
          </span>
          <h1 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-normal">
            Casual Wear
          </h1>
          <p className="mt-2 max-w-[420px] text-[0.95rem] text-pearl-white/85">
            For every day worth dressing well for.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-14 pb-20 max-[1100px]:px-8">
        <div className="py-6 text-[0.72rem] tracking-[0.03em] text-warm-gray">
          <Link href="/" className="hover:text-soft-gold">
            Home
          </Link>{" "}
          / Casual Wear
        </div>

        <CasualWearGrid products={products} />
      </div>
    </>
  );
}
