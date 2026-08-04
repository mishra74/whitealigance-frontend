import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * "mask-reveal" primitive (component-library.html #06): images scale in
 * from 1.06 to 1.0 as they enter the viewport. 900ms, ease-fabric. Apply to
 * an `overflow-hidden` parent so the scale doesn't spill past its bounds.
 */
export function useMaskReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(ref.current, {
        scale: 1.06,
        duration: 0.9,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref }
  );
}
