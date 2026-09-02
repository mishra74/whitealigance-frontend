import HomeCursor from "@/components/home/HomeCursor";
import HeroSection from "@/components/home/HeroSection";
// InstagramGallery is hidden until real brand photography replaces the
// placeholder lifestyle shots — re-add the import and <InstagramGallery />
// below once the client's genuine images are in place.

export default function Home() {
  return (
    <>
      <HomeCursor />
      <HeroSection />
    </>
  );
}
