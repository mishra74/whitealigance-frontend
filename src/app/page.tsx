import HomeCursor from "@/components/home/HomeCursor";
import HeroSection from "@/components/home/HeroSection";
import QuickShopTiles from "@/components/home/QuickShopTiles";
import ProductRailSection from "@/components/home/ProductRailSection";
// InstagramGallery is hidden until real brand photography replaces the
// placeholder lifestyle shots — re-add the import and <InstagramGallery />
// below once the client's genuine images are in place.
import { getApiProducts } from "@/lib/api";

export default async function Home() {
  const products = await getApiProducts();
  const newArrivals = [...products]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 8);
  const bestsellers = products
    .filter((p) => p.tags.includes("featured"))
    .slice(0, 8);

  return (
    <>
      <HomeCursor />
      <HeroSection />
      <QuickShopTiles products={products} />
      <ProductRailSection
        title="New Arrivals"
        viewAllHref="/search?new=1"
        products={newArrivals}
      />
      <ProductRailSection
        title="Bestsellers"
        viewAllHref="/search?featured=1"
        products={bestsellers}
      />
    </>
  );
}
