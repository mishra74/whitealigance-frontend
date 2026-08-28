import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartControls from "@/components/product/AddToCartControls";
import DeliveryCheck from "@/components/product/DeliveryCheck";
import Accordion from "@/components/product/Accordion";
import { getApiProducts, getApiProductWithSimilar } from "@/lib/api";
import {
  collectionHref,
  collectionLabel,
  formatPrice,
  productEyebrow,
  productImageSrc,
  productImageSrcs,
  type Product,
} from "@/lib/products";
export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  const products = await getApiProducts();
  return products.map((p: { handle: string }) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const result = await getApiProductWithSimilar(handle);
  if (!result) return {};
  return {
    title: `${result.product.title} | WHITE ELEGANCE 24`,
    description: result.product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const result = await getApiProductWithSimilar(handle);
  if (!result) notFound();
  const { product, similar } = result;

  return (
    <div className="mx-auto max-w-[1320px] px-14 pb-20 max-[1100px]:px-8">
      <div className="py-6 text-[0.72rem] tracking-[0.03em] text-warm-gray">
        <Link href="/" className="hover:text-soft-gold">
          Home
        </Link>{" "}
        /{" "}
        <Link
          href={collectionHref(product.collection)}
          className="hover:text-soft-gold"
        >
          {collectionLabel(product.collection)}
        </Link>{" "}
        / {product.title}
      </div>

      <div className="grid gap-12 pb-16 md:grid-cols-2 md:gap-16">
        <ProductGallery
          images={productImageSrcs(product)}
          title={product.title}
          hasPhoto={product.hasPhoto}
        />

        <div>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
            {productEyebrow(product, collectionLabel(product.collection))} ·{" "}
            {collectionLabel(product.collection)}
          </span>
          <h1 className="mt-2.5 font-display text-[clamp(1.8rem,3vw,2.4rem)] font-normal">
            {product.title}
          </h1>
          <div className="mt-2 mb-5 text-[1.1rem] text-muted-bronze">
            {formatPrice(product)}
          </div>

          <AddToCartControls
            handle={product.handle}
            title={product.title}
            variants={product.variants}
            image={productImageSrc(product)}
            imageLabel={product.hasPhoto ? product.title : "Photo coming soon"}
          />

          <DeliveryCheck />

          <Accordion
            items={[
              { title: "Description", content: <p>{product.description}</p> },
              {
                title: "Fabric & Care",
                content: (
                  <p>
                    Fabric composition and care instructions for this piece
                    are being finalized. As a general rule for our white
                    pieces: dry clean recommended, avoid direct bleach and
                    prolonged sun exposure.
                  </p>
                ),
              },
              {
                title: "Shipping & Returns",
                content: (
                  <p>
                    Free shipping over ₹5,000. 7-day exchange window on
                    unworn pieces with tags attached.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </div>

      {similar.length > 0 && (
        <div className="pb-16">
          <h2 className="mb-6 font-display text-[clamp(1.4rem,2.5vw,1.8rem)] font-normal">
            Similar Products
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((p: Product, i: number) => (
              <ProductCard
                key={p.id}
                product={p}
                variant={(["warm1", "warm3", "dark", "warm2"] as const)[i % 4]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
