"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { PlaceholderVariant } from "@/components/ui/PlaceholderImage";
import { SORT_OPTIONS, sortProducts, type Product, type SortKey } from "@/lib/products";

const VARIANTS: PlaceholderVariant[] = ["warm1", "warm2", "warm3", "dark"];

export default function PartyWearEditorial({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortKey>("featured");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-cream py-7">
        <span className="text-[0.8rem] text-warm-gray">
          {products.length} pieces
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-transparent text-[0.75rem] uppercase tracking-[0.08em] text-warm-gray outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-7 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={VARIANTS[i % VARIANTS.length]}
          />
        ))}
      </div>
    </>
  );
}
