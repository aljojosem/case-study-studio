import Link from "next/link";
import { CacheNote } from "@/components/cache-note";
import { CaseStudyCard } from "@/components/case-study-card";
import { IndustryLink } from "@/components/industry-link";
import { JsonLd } from "@/components/json-ld";
import { INDUSTRIES } from "@/lib/constants";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { CaseStudy } from "@/lib/types";

const STEPS = [
  {
    n: "01",
    title: "Drop the finished work",
    body: "Paste one block of source text. No categorized problem or solution fields — later that dump can come from the knowledge base.",
  },
  {
    n: "02",
    title: "Studio writes the story",
    body: "Title, problem, solution, numbers, and template are pulled into a case-study view you can still edit.",
  },
  {
    n: "03",
    title: "Publish to the site",
    body: "The public listing and article stay website-ready. Insurance, healthcare, fintech, retail, and public-sector work in one place.",
  },
] as const;

const INDUSTRY_COPY: Record<(typeof INDUSTRIES)[number], string> = {
  Insurance: "Producer contracts, enquiry handoff, and carrier operations.",
  Healthcare: "Clinical corridors, intake, and staff-facing workflows.",
  FinTech: "KYC, onboarding, and regulated desk work.",
  Retail: "Stock, store operations, and fulfilment stories.",
  "Public sector": "Licensing counters and citizen-facing services.",
};

export function HomeLanding({ studies }: { studies: CaseStudy[] }) {
  const lead = studies[0];
  const featured = studies.slice(1, 4);
  const industriesServed = new Set(studies.map((study) => study.industry)).size;

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description:
            "Turn finished 2Base projects into website-ready case studies.",
          publisher: { "@type": "Organization", name: "2Base", url: SITE_URL },
        }}
      />

      <section className="border-b border-ink/10 bg-white/50">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 px-5 py-12 md:grid-cols-[1.15fr_0.85fr] md:py-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
              2Base · website proof
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-6xl">
              Finished work, written once, ready for the site.
            </h1>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Case Study Studio turns a completed 2Base delivery into a public
              case study. One source dump in. A website-ready story out — for
              insurance, healthcare, fintech, retail, and the public sector.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/case-studies" className="btn-primary">
                Published work
              </Link>
              <Link href="/studio" className="btn-secondary">
                Open studio
              </Link>
            </div>
          </div>
          {lead ? (
            <CaseStudyCard study={lead} />
          ) : (
            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink/10">
              <p className="text-sm text-ink/60">
                Published stories will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-label="Proof points" className="border-b border-ink/10 bg-white">
        <dl className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4 md:py-10">
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Published
            </dt>
            <dd className="mt-2 font-serif text-3xl text-ink">{studies.length}</dd>
            <dd className="mt-1 text-sm text-ink/55">Public case studies</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Sectors
            </dt>
            <dd className="mt-2 font-serif text-3xl text-ink">
              {industriesServed || INDUSTRIES.length}
            </dd>
            <dd className="mt-1 text-sm text-ink/55">Industries on the site</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Input
            </dt>
            <dd className="mt-2 font-serif text-3xl text-ink">1</dd>
            <dd className="mt-1 text-sm text-ink/55">Source dump, not forms</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Output
            </dt>
            <dd className="mt-2 font-serif text-3xl text-ink">Site</dd>
            <dd className="mt-1 text-sm text-ink/55">Ready to publish</dd>
          </div>
        </dl>
      </section>

      {featured.length > 0 ? (
        <section className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
                Selected work
              </p>
              <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
                Recent case studies
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="text-sm font-semibold text-studio hover:text-ink"
            >
              View all work
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-y border-ink/10 bg-white/50">
        <div className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            How it works
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
            From source dump to public page
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="rounded-2xl bg-white p-6 ring-1 ring-ink/10"
              >
                <p className="font-mono text-xs uppercase tracking-wide text-accent">
                  {step.n}
                </p>
                <h3 className="mt-3 font-serif text-xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          Industries
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
          Built for regulated delivery
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <li key={industry}>
              <IndustryLink
                industry={industry}
                className="group flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:ring-accent/40"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  Sector
                </p>
                <h3 className="mt-2 font-serif text-2xl text-ink group-hover:text-studio">
                  {industry}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">
                  {INDUSTRY_COPY[industry]}
                </p>
              </IndustryLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-studio text-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/60">
              Studio
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
              Have a finished project? Write the case study once.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-studio"
            >
              Open studio
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:ring-white"
            >
              Browse work
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-5 pb-6">
        <CacheNote mode="ssg">
          This page is built at build time. Featured work is read from the
          published case-studies cache.
        </CacheNote>
      </div>
    </div>
  );
}
