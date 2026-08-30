import HomeCursor from "@/components/home/HomeCursor";
import HeroSection from "@/components/home/HeroSection";
import CollectionsSection from "@/components/home/CollectionsSection";
// InstagramGallery is hidden until real brand photography replaces the
// placeholder lifestyle shots — re-add the import and <InstagramGallery />
// below once the client's genuine images are in place.
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <>
      <HomeCursor />
      <HeroSection />
      <CollectionsSection />
      <NewsletterSection />
    </>
  );
}
