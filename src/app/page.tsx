import HomeCursor from "@/components/home/HomeCursor";
import HeroSection from "@/components/home/HeroSection";
import CollectionsSection from "@/components/home/CollectionsSection";
import PhilosophySection from "@/components/home/PhilosophySection";
import FilmSection from "@/components/home/FilmSection";
import InstagramGallery from "@/components/home/InstagramGallery";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <>
      <HomeCursor />
      <HeroSection />
      <CollectionsSection />
      <PhilosophySection />
      <FilmSection />
      <InstagramGallery />
      <NewsletterSection />
    </>
  );
}
