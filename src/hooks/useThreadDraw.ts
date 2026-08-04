import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * "thread-draw" primitive (component-library.html #06): the signature
 * hairline draws in from 0 to full width. 1.4s, ease-fabric.
 */
export function useThreadDraw(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(ref.current, {
        width: 0,
        duration: 1.4,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref }
  );
}
