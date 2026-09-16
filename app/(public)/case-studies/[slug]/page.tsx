import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CacheNote } from "@/components/cache-note";
import { CaseStudyArticle } from "@/components/case-study-article";
import { JsonLd } from "@/components/json-ld";
import { getPublishedCaseStudy, getPublishedSlugs } from "@/lib/queries";
import { caseStudyJsonLd, caseStudyMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getPublishedCaseStudy(slug);
  if (!study) {
    return {
      title: "Case study",
      robots: { index: false, follow: false },
    };
  }
  return caseStudyMetadata(study);
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getPublishedCaseStudy(slug);

  if (!study) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 md:py-14">
      <JsonLd data={caseStudyJsonLd(study)} />
      <div className="rounded-2xl bg-white px-5 py-8 ring-1 ring-ink/10 md:px-8 md:py-10">
        <CaseStudyArticle study={study} />
      </div>
      <CacheNote mode="isr">
        Built for known slugs at build time via generateStaticParams. Refresh
        window is 60s, or immediately after publish.
      </CacheNote>
    </div>
  );
}
