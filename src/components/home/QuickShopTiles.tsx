import Image from "next/image";
import Link from "next/link";
import { productImageSrc, type Product } from "@/lib/products";
import styles from "./QuickShopTiles.module.css";

interface Tile {
  label: string;
  href: string;
  src: string;
}

// Only real, working destinations — Party Wear/Casual Wear are the site's
// only two collections, and the New Arrivals/Bestsellers tiles use the
// actual newest/featured product's real photo rather than a static asset.
// "Shop by Category" and "Accessories" are deliberately omitted: neither
// has real category or product data behind it yet.
export default function QuickShopTiles({ products }: { products: Product[] }) {
  const newest = [...products].sort((a, b) => Number(b.id) - Number(a.id))[0];
  const bestseller = products.find((p) => p.tags.includes("featured"));

  const tiles: Tile[] = [
    {
      label: "Party Wear",
      href: "/party-wear",
      src: "/assets/images/collections/party-wear-hero.png",
    },
    {
      label: "Casual Wear",
      href: "/casual-wear",
      src: "/assets/images/collections/casual-wear-hero.png",
    },
    newest && {
      label: "New Arrivals",
      href: "/search?new=1",
      src: productImageSrc(newest) ?? "/images/placeholder.png",
    },
    bestseller && {
      label: "Bestsellers",
      href: "/search?featured=1",
      src: productImageSrc(bestseller) ?? "/images/placeholder.png",
    },
  ].filter((t): t is Tile => Boolean(t));

  if (tiles.length === 0) return null;

  return (
    <div className={styles.row}>
      {tiles.map((tile) => (
        <Link key={tile.label} href={tile.href} className={styles.tile}>
          <Image
            src={tile.src}
            alt={tile.label}
            fill
            sizes="140px"
            className={styles.tileImage}
          />
          <span className={styles.tileLabel}>{tile.label}</span>
        </Link>
      ))}
    </div>
  );
}
