import type { Metadata } from "next";
import Link from "next/link";
import { CacheNote } from "@/components/cache-note";
import { JsonLd } from "@/components/json-ld";
import { DEFAULT_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} · 2Base website-ready case studies`,
  },
  description:
    "Publish finished 2Base delivery work as website-ready case studies. Insurance, healthcare, fintech, and retail stories written once, ready for the site.",
  keywords: DEFAULT_KEYWORDS,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 md:py-14">
      <div className="max-w-2xl">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description:
            "Turn finished 2Base projects into website-ready case studies.",
          publisher: { "@type": "Organization", name: "2Base" },
        }}
      />
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        2Base · website proof
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-6xl">
        Finished work, written once, ready for the site.
      </h1>
      <p className="mt-5 text-lg leading-8 text-ink/70">
        Drop the finished project as one block of source text. The studio
        pulls problem, solution, and numbers into a case-study view. Later
        that dump will come from the knowledge base — still without
        categorized inputs.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/case-studies" className="btn-primary">
          Published work
        </Link>
        <Link href="/studio" className="btn-secondary">
          Open studio
        </Link>
      </div>
      <CacheNote mode="ssg">
        This page is built at build time. Nothing here changes per request.
      </CacheNote>
      </div>
    </div>
  );
}
