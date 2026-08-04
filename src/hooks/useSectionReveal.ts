import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * "fade-up-stagger" primitive (component-library.html #06): section content
 * fades up with a 0.12s stagger as it enters the viewport. 900ms, power3.out.
 */
export function useSectionReveal(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!scopeRef.current) return;
      gsap.from(scopeRef.current.children, {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: scopeRef.current, start: "top 75%" },
      });
    },
    { scope: scopeRef }
  );
}
