import HomeCursor from "@/components/home/HomeCursor";
import HeroSection from "@/components/home/HeroSection";
import WhyWhiteSection from "@/components/home/WhyWhiteSection";
import MeaningOfWhiteSection from "@/components/home/MeaningOfWhiteSection";
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
      <WhyWhiteSection />
      <MeaningOfWhiteSection />
      <CollectionsSection />
      <PhilosophySection />
      <FilmSection />
      <InstagramGallery />
      <NewsletterSection />
    </>
  );
}
