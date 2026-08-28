import type { Metadata } from "next";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export const metadata: Metadata = {
  title: "About | WHITE ELEGANCE 24",
  description:
    "WHITE ELEGANCE 24 is a luxury fashion label devoted exclusively to elegant white clothing for women — the story and what we stand for.",
};

const VALUES = [
  { title: "Purity", description: "Nothing added, nothing needed." },
  { title: "Confidence", description: "Worn by those who don't ask to be noticed." },
  { title: "Luxury", description: "Quiet, considered, unmistakable." },
  { title: "Grace", description: "Movement, not posture." },
  { title: "Strength", description: "Softness that doesn't apologize." },
  { title: "Timeless Beauty", description: "Never in season, never out of it." },
  { title: "Minimalism", description: "Less fabric. More presence." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex h-[56vh] min-h-[400px] items-center justify-center overflow-hidden text-center">
        <PlaceholderImage
          src="/assets/images/about/about-hero-atelier.png"
          alt="WHITE ELEGANCE 24"
          label="Brand portrait — founder or lifestyle shot"
          variant="warm2"
          className="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="relative z-[2] max-w-[760px] px-6 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-normal text-pearl-white">
          Devoted entirely to white — because confidence needs nothing else.
        </h1>
      </section>

      <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24">
          <div className="relative aspect-[4/5]">
            <PlaceholderImage
              src="/assets/images/about/about-our-story.png"
              alt="WHITE ELEGANCE 24"
              label="Founder or brand detail"
              variant="warm1"
              className="absolute inset-0"
            />
          </div>
          <div>
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
              Our Story
            </span>
            <h2 className="mt-3.5 font-display text-[clamp(1.8rem,3vw,2.4rem)] font-normal">
              Born from restraint.
            </h2>
            <p className="mt-4 max-w-[420px] text-warm-gray">
              WHITE ELEGANCE 24 began with a single question: what if a label
              removed every color but one? What was left was fabric, cut, and
              confidence — nothing to hide behind.
            </p>
          </div>
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24">
          <div className="relative aspect-[4/5] md:order-2">
            <PlaceholderImage
              src="/assets/images/about/about-atelier-detail.png"
              alt="Fabric detail"
              label="Fabric or fit detail shot"
              variant="warm3"
              className="absolute inset-0"
            />
          </div>
          <div className="md:order-1">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
              Our Standards
            </span>
            <h2 className="mt-3.5 font-display text-[clamp(1.8rem,3vw,2.4rem)] font-normal">
              Every piece, held to the same standard.
            </h2>
            <p className="mt-4 max-w-[420px] text-warm-gray">
              We work with trusted manufacturing partners and check every
              piece for fabric, fit, and finish before it earns the WHITE
              ELEGANCE 24 name.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-ivory py-24 text-center">
        <div className="mx-auto max-w-[1320px] px-14 max-[1100px]:px-8">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-bronze">
            What We Stand For
          </span>
          <h2 className="mt-3.5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
            Seven words. One color.
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.title}>
                <div className="mx-auto mb-4 h-px w-[60px] bg-soft-gold" />
                <h4 className="font-display text-[1.2rem]">{value.title}</h4>
                <p className="mt-2 text-[0.85rem] text-warm-gray">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
