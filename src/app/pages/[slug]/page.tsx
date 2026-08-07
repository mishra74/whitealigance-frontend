import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApiPage } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getApiPage(slug);
  if (!page) return {};
  return {
    title: `${page.name} | WHITE ELEGANCE 24`,
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getApiPage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-[840px] px-14 py-16 max-[1100px]:px-8 md:py-24">
      <div className="mb-10 text-[0.72rem] tracking-[0.03em] text-warm-gray">
        <Link href="/" className="hover:text-soft-gold">
          Home
        </Link>{" "}
        / {page.name}
      </div>

      <h1 className="mb-10 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal">
        {page.name}
      </h1>

      {/*
        Admin-authored content only (edited via the Laravel admin panel, not
        user-submitted), so rendering it directly is consistent with the
        trust level of any CMS — same reasoning as rendering it in the
        Blade admin views.
      */}
      <div
        className="text-warm-gray [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-[1.2rem] [&_h3]:text-charcoal [&_h3]:first:mt-0 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_em]:text-muted-bronze"
        dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
      />
    </div>
  );
}
