import type { Metadata } from "next";
import { CacheNote } from "@/components/cache-note";
import { JsonLd } from "@/components/json-ld";
import { PublicHome } from "@/components/public-home";
import { getPublishedCaseStudies } from "@/lib/queries";
import { DEFAULT_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} · 2Base website-ready case studies`,
  },
  description:
    "Publish finished 2Base delivery work as website-ready case studies. Insurance, healthcare, fintech, and retail stories written once, ready for the site.",
  keywords: DEFAULT_KEYWORDS,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const studies = await getPublishedCaseStudies();

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description:
                "Turn finished 2Base projects into website-ready case studies.",
              publisher: { "@type": "Organization", name: "2Base" },
            },
            {
              "@type": "Organization",
              name: "2Base",
              url: SITE_URL,
              description:
                "Digital delivery for insurance, healthcare, fintech, retail, and public sector teams.",
            },
          ],
        }}
      />
      <PublicHome studies={studies} />
      <div className="mx-auto w-full max-w-5xl px-5 pb-10">
        <CacheNote mode="isr">
          Featured work is the published list. Publish in Studio calls
          updateTag(&apos;case-studies&apos;).
        </CacheNote>
      </div>
    </div>
  );
}
