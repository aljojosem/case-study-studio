import type { Metadata } from "next";
import { CacheNote } from "@/components/cache-note";
import { FilteredCaseStudyList } from "@/components/filtered-case-study-list";
import { JsonLd } from "@/components/json-ld";
import { ListingFilters } from "@/components/listing-filters";
import { INDUSTRIES, STACK_OPTIONS } from "@/lib/constants";
import { getPublishedCaseStudies } from "@/lib/queries";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Published case studies",
  description:
    "Public 2Base case studies across insurance, healthcare, fintech, and retail. Filter by industry or stack.",
  keywords: [
    "published case studies",
    "2Base work",
    "client success stories",
    ...INDUSTRIES,
    ...STACK_OPTIONS,
  ],
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: `Published case studies · ${SITE_NAME}`,
    description:
      "Website-ready 2Base delivery stories for insurance, healthcare, fintech, and retail.",
    url: "/case-studies",
  },
};

export default async function CaseStudiesPage() {
  const studies = await getPublishedCaseStudies();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 md:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Published 2Base case studies",
          url: `${SITE_URL}/case-studies`,
          about: "Insurance, healthcare, fintech, and retail software delivery",
        }}
      />
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Published
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Case studies</h1>
      <p className="mt-3 max-w-2xl text-ink/65">
        Public 2Base case studies across insurance, healthcare, fintech, and
        retail. Filters are a client island; the page itself is ISR.
      </p>
      <div className="mt-8 space-y-6">
        <ListingFilters />
        <FilteredCaseStudyList studies={studies} />
      </div>
      <CacheNote mode="isr">
        Cached published list. Publish in Studio calls updateTag(&apos;case-studies&apos;).
      </CacheNote>
    </div>
  );
}
