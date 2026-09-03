"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { getApiProducts } from "@/lib/api";
import { collectionHref, collectionLabel, type Product } from "@/lib/products";

type Chip = "Party Wear" | "Casual Wear" | "Under ₹5,000";
const CHIPS: Chip[] = ["Party Wear", "Casual Wear", "Under ₹5,000"];

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const params = useSearchParams();
  // Arriving from the mobile category nav's "All" chip (/search?all=1)
  // should show the full catalogue immediately, not the "start typing"
  // prompt — everything else about the page behaves exactly as before.
  const showAll = params.get("all") === "1";
  // "View all" from the homepage's New Arrivals / Bestsellers rails.
  const showNew = params.get("new") === "1";
  const showFeatured = params.get("featured") === "1";
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState<Chip | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setProducts(await getApiProducts());
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    const filtered = products.filter((p) => {
      if (showFeatured && !p.tags.includes("featured")) return false;
      if (activeChip === "Party Wear" && p.collection !== "party-wear") return false;
      if (activeChip === "Casual Wear" && p.collection !== "casual-wear") return false;
      if (activeChip === "Under ₹5,000" && (p.variants[0]?.price.amount ?? 0) >= 5000)
        return false;

      if (!q) return true;
      const haystack = `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });

    if (showNew) {
      return [...filtered].sort((a, b) => Number(b.id) - Number(a.id));
    }
    return filtered;
  }, [q, activeChip, products, showFeatured, showNew]);

  const matchedCollections = useMemo(() => {
    if (!q) return [];
    const cols: Array<"party-wear" | "casual-wear"> = ["party-wear", "casual-wear"];
    return cols.filter((c) => collectionLabel(c).toLowerCase().includes(q));
  }, [q]);

  const hasSearched =
    q.length > 0 || activeChip !== null || showAll || showNew || showFeatured;

  return (
    <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
      <div className="pt-16 pb-5 text-center">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
          Search
        </span>
        <div className="relative mx-auto mt-4 max-w-[560px]">
          <input
            type="text"
            autoFocus
            placeholder="Search dresses, gowns, tops…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b-2 border-charcoal bg-transparent py-3 pr-8 font-display text-[1.6rem] outline-none"
          />
          <SearchIcon
            size={20}
            strokeWidth={1.5}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-soft-gold"
          />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveChip((c) => (c === chip ? null : chip))}
              className={`border px-4 py-2 text-[0.76rem] ${
                activeChip === chip
                  ? "border-charcoal bg-charcoal text-pearl-white"
                  : "border-warm-beige"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] pt-9 pb-24">
        {loading ? (
          <p className="text-center text-[0.9rem] text-warm-gray">Loading…</p>
        ) : !hasSearched ? (
          <p className="text-center text-[0.9rem] text-warm-gray">
            Start typing, or pick a filter above, to search the collection.
          </p>
        ) : (
          <>
            {matchedCollections.length > 0 && (
              <div className="mb-10">
                <div className="mb-3.5 text-[0.68rem] uppercase tracking-[0.14em] text-muted-bronze">
                  Collections
                </div>
                {matchedCollections.map((c) => (
                  <Link
                    key={c}
                    href={collectionHref(c)}
                    className="block border-b border-cream py-3 text-[0.9rem] hover:text-soft-gold"
                  >
                    {collectionLabel(c)}
                  </Link>
                ))}
              </div>
            )}

            <div className="mb-3.5 text-[0.68rem] uppercase tracking-[0.14em] text-muted-bronze">
              Products {results.length > 0 && `(${results.length})`}
            </div>
            {results.length === 0 ? (
              <p className="py-12 text-center text-[0.9rem] text-warm-gray">
                No results for &ldquo;{query}&rdquo;. Try a different search or
                filter.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
