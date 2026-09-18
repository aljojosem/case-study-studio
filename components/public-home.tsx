import Link from "next/link";
import { CaseStudyCard } from "@/components/case-study-card";
import { INDUSTRIES } from "@/lib/constants";
import { resultHeadline } from "@/lib/metrics";
import type { CaseStudy } from "@/lib/types";

const INDUSTRY_COPY: Record<(typeof INDUSTRIES)[number], string> = {
  Insurance:
    "Producer contracts, enquiries, and carrier rules without the email pile.",
  Healthcare:
    "Field intake and coding queues that work on a phone in a corridor.",
  FinTech: "KYC and onboarding checklists instead of PDF packs.",
  Retail: "Store-level stock in one national view by Monday evening.",
  "Public sector": "Licensing and requests that leave the shared inbox.",
};

const STEPS = [
  {
    title: "Capture the inputs",
    body: "Problem, solution, numbers, and stack come in as separate fields. The studio categorizes those inputs into a case-study view.",
  },
  {
    title: "Studio drafts the story",
    body: "Problem, solution, and numbers land in a case-study view. You choose the template; the facts stay the same.",
  },
  {
    title: "Publish to the site",
    body: "The public listing, filters, and SEO pages stay website-ready. Write once, then ship it to Work.",
  },
];

function featuredStudies(studies: CaseStudy[]) {
  const sorted = [...studies].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  const picked: CaseStudy[] = [];
  const seen = new Set<string>();

  for (const study of sorted) {
    if (seen.has(study.industry)) continue;
    seen.add(study.industry);
    picked.push(study);
    if (picked.length === 3) return picked;
  }

  for (const study of sorted) {
    if (picked.includes(study)) continue;
    picked.push(study);
    if (picked.length === 3) break;
  }

  return picked;
}

function FeaturedStory({ study }: { study: CaseStudy }) {
  const headline = study.results[0];

  return (
    <article className="rounded-2xl bg-white p-6 ring-1 ring-ink/10 md:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Latest story
      </p>
      <p className="mt-3 text-sm text-ink/55">
        {study.industry} · {study.client}
      </p>
      <h2 className="mt-2 font-serif text-2xl leading-snug text-ink md:text-3xl">
        {study.title}
      </h2>
      {headline ? (
        <p className="mt-5 text-sm leading-6 text-ink/80">
          <span className="font-semibold text-ink">
            {resultHeadline(headline)}
          </span>{" "}
          {headline.label}
        </p>
      ) : null}
      <Link
        href={`/case-studies/${study.slug}`}
        className="mt-6 inline-flex text-sm font-semibold text-studio hover:text-accent"
      >
        Read the story
      </Link>
    </article>
  );
}

export function PublicHome({ studies }: { studies: CaseStudy[] }) {
  const featured = featuredStudies(studies);
  const latest = featured[0];

  return (
    <div>
      <section className="mx-auto w-full max-w-5xl px-5 py-10 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
              2Base · website proof
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-6xl">
              Finished work, written once, ready for the site.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">
              Capture the finished project as categorized inputs — problem,
              solution, numbers, and stack. The studio turns those sections
              into a website-ready case-study view.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/case-studies" className="btn-primary">
                Published work
              </Link>
              <Link href="/studio" className="btn-secondary">
                Open studio
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <li
                  key={industry}
                  className="rounded-full bg-white px-3 py-1 text-xs text-ink/70 ring-1 ring-ink/10"
                >
                  {industry}
                </li>
              ))}
            </ul>
          </div>
          {latest ? <FeaturedStory study={latest} /> : null}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/60">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Public listing
            </p>
            <p className="mt-2 font-serif text-xl text-ink">Filter the work</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Browse published stories by industry or stack on the public site.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Templates
            </p>
            <p className="mt-2 font-serif text-xl text-ink">Three layouts</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Website, editorial, or impact — same facts, different page shape.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Studio
            </p>
            <p className="mt-2 font-serif text-xl text-ink">Draft to publish</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Write the story once in Studio, then ship it to Work.
            </p>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section
          id="work"
          className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
                Selected work
              </p>
              <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
                Delivery stories on the public site
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="text-sm font-semibold text-studio hover:text-accent"
            >
              All published work
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        </section>
      ) : null}

      <section
        id="industries"
        className="border-t border-ink/10 bg-white/40"
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Industries
          </p>
          <h2 className="mt-2 max-w-2xl font-serif text-3xl text-ink md:text-4xl">
            The same studio pattern, across regulated work
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((industry) => (
              <li key={industry}>
                <Link
                  href="/case-studies"
                  className="block h-full rounded-2xl bg-white p-5 ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:ring-accent/40"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-accent">
                    {industry}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    {INDUSTRY_COPY[industry]}
                  </p>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/case-studies"
                className="block h-full rounded-2xl bg-studio p-5 text-white transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                  All work
                </p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Browse the published listing and filter by industry or stack.
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16"
      >
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          How it works
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
          From finished project to public page
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl bg-white p-5 ring-1 ring-ink/10"
            >
              <p className="font-serif text-2xl text-studio">{index + 1}</p>
              <h3 className="mt-3 font-serif text-xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-12 md:pb-16">
        <div className="rounded-2xl bg-studio px-6 py-10 text-white md:px-10 md:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
            2Base studio
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight md:text-4xl">
            Ready to turn a finished project into a public story?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
            Open the studio, fill the categorized inputs, and publish when the
            numbers are in. The public site keeps the same paper, ink, and
            accent pattern.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center rounded-full bg-white px-[1.15rem] py-[0.65rem] text-[0.95rem] font-semibold text-studio"
            >
              Open studio
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center rounded-full px-[1.15rem] py-[0.65rem] text-[0.95rem] font-semibold text-white ring-1 ring-white/35"
            >
              Published work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
