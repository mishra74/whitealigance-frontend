import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[840px] px-14 py-16 max-[1100px]:px-8 md:py-24">
      <div className="mb-10 text-[0.72rem] tracking-[0.03em] text-warm-gray">
        <Link href="/" className="hover:text-soft-gold">
          Home
        </Link>{" "}
        / {title}
      </div>

      <h1 className="mb-3 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
        {title}
      </h1>
      <p className="mb-10 text-[0.72rem] tracking-[0.03em] text-warm-gray">
        Last updated: {lastUpdated}
      </p>

      <div className="text-warm-gray [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-[1.2rem] [&_h3]:text-charcoal [&_h3]:first:mt-0 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_li]:leading-relaxed [&_em]:text-muted-bronze [&_strong]:text-charcoal">
        {children}
      </div>
    </div>
  );
}
