import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductRailSection({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="px-14 py-10 max-[1100px]:px-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-charcoal">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-[0.78rem] text-muted-bronze hover:text-soft-gold"
        >
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
