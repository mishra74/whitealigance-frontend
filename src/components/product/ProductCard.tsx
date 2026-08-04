import Link from "next/link";
import PlaceholderImage, {
  type PlaceholderVariant,
} from "@/components/ui/PlaceholderImage";
import WishlistButton from "@/components/product/WishlistButton";
import { formatPrice, productImageSrc, type Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  variant?: PlaceholderVariant;
}

export default function ProductCard({
  product,
  variant = "warm1",
}: ProductCardProps) {
  const imageUrl = productImageSrc(product) ?? "/images/placeholder.png";

  return (
    <Link href={`/product/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden">
        <PlaceholderImage
          src={imageUrl}
          alt={product.images[0]?.altText ?? product.title}
          label={product.hasPhoto ? product.title : "Photo coming soon"}
          variant={variant}
          className="absolute inset-0 transition-transform duration-500 ease-fabric group-hover:scale-105"
        />

        <WishlistButton
          line={{
            handle: product.handle,
            title: product.title,
            price: product.variants[0]?.price.amount ?? 0,
            image: imageUrl,
            imageLabel: product.title,
          }}
        />

        <span className="absolute inset-x-2.5 bottom-2.5 z-10 translate-y-2 bg-charcoal py-2.5 text-center text-[0.66rem] uppercase tracking-[0.12em] text-pearl-white opacity-0 transition-all duration-300 ease-fabric group-hover:translate-y-0 group-hover:opacity-100">
          Quick Add
        </span>
      </div>

      <div className="pt-3.5">
        <div className="font-display text-base">{product.title}</div>
        <div className="mt-1 text-[0.82rem] text-muted-bronze">
          {formatPrice(product)}
        </div>
      </div>
    </Link>
  );
}