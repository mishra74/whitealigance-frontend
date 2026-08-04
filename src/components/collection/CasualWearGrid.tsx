"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { PlaceholderVariant } from "@/components/ui/PlaceholderImage";
import {
  SORT_OPTIONS,
  sortProducts,
  type Product,
  type SortKey,
} from "@/lib/products";

const VARIANTS: PlaceholderVariant[] = [
  "warm1",
  "warm2",
  "warm3",
  "dark",
];

export default function CasualWearGrid({
  products: initialProducts,
}: {
  products?: Product[];
}) {
  const [sort, setSort] = useState<SortKey>("featured");

  const products = useMemo(() => initialProducts ?? [], [initialProducts]);
  const sorted = useMemo(
    () => sortProducts(products, sort),
    [products, sort]
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-[0.8rem] text-warm-gray">
          {products.length} pieces
        </span>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-transparent text-[0.75rem] uppercase tracking-[0.06em] text-warm-gray outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
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