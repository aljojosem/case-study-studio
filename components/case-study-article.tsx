import { CaseStudyImage } from "@/components/case-study-image";
import type { CaseStudy } from "@/lib/types";

function StackList({ study }: { study: CaseStudy }) {
  if (study.stack.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {study.stack.map((item) => (
        <li
          key={item}
          className="rounded-full bg-paper px-3 py-1 text-xs text-ink/70 ring-1 ring-ink/10"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function EditorialTemplate({ study }: { study: CaseStudy }) {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        {study.industry} · {study.client}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
        {study.title}
      </h1>
      {study.imageUrl ? (
        <CaseStudyImage
          study={study}
          className="mt-6 h-56 w-full rounded-2xl object-cover md:h-72"
        />
      ) : null}
      <div className="mt-5">
        <StackList study={study} />
      </div>
      <section className="mt-10 space-y-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
            Challenge
          </h2>
          <p className="mt-2 text-lg leading-8 text-ink/85">{study.challenge}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
            Solution
          </h2>
          <p className="mt-2 text-lg leading-8 text-ink/85">{study.solution}</p>
        </div>
      </section>
      {study.results.length > 0 ? (
        <dl className="mt-10 grid gap-3 sm:grid-cols-3">
          {study.results.map((result) => (
            <div
              key={`${result.label}-${result.value}`}
              className="rounded-2xl bg-paper px-4 py-5 ring-1 ring-ink/10"
            >
              <dt className="text-xs uppercase tracking-wide text-ink/50">
                {result.label}
              </dt>
              <dd className="mt-1 font-serif text-3xl text-ink">{result.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {study.quote?.text ? (
        <blockquote className="mt-10 border-l-2 border-accent pl-5">
          <p className="font-serif text-2xl leading-snug text-ink">
            “{study.quote.text}”
          </p>
          {study.quote.by ? (
            <footer className="mt-3 text-sm text-ink/55">{study.quote.by}</footer>
          ) : null}
        </blockquote>
      ) : null}
    </article>
  );
}

function WebsiteTemplate({ study }: { study: CaseStudy }) {
  return (
    <article className="overflow-hidden rounded-2xl ring-1 ring-ink/10">
      <header className="bg-studio px-6 py-10 text-white md:px-10 md:py-12">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
          2Base · {study.industry}
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
          {study.title}
        </h1>
        <p className="mt-3 text-sm text-white/75">{study.client}</p>
      </header>
      {study.imageUrl ? (
        <CaseStudyImage study={study} className="h-56 w-full object-cover md:h-72" />
      ) : null}
      {study.results.length > 0 ? (
        <dl className="grid gap-px bg-ink/10 sm:grid-cols-3">
          {study.results.map((result) => (
            <div
              key={`${result.label}-${result.value}`}
              className="bg-white px-5 py-6"
            >
              <dd className="font-serif text-3xl text-studio">{result.value}</dd>
              <dt className="mt-1 text-xs uppercase tracking-wide text-ink/50">
                {result.label}
              </dt>
            </div>
          ))}
        </dl>
      ) : null}
      <div className="grid gap-8 bg-white px-6 py-10 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Challenge
          </h2>
          <p className="mt-3 leading-7 text-ink/80">{study.challenge}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Solution
          </h2>
          <p className="mt-3 leading-7 text-ink/80">{study.solution}</p>
        </div>
      </div>
      {study.quote?.text ? (
        <div className="bg-paper px-6 py-8 md:px-10">
          <blockquote>
            <p className="font-serif text-xl leading-snug text-ink">
              “{study.quote.text}”
            </p>
            {study.quote.by ? (
              <footer className="mt-3 text-sm text-ink/55">{study.quote.by}</footer>
            ) : null}
          </blockquote>
        </div>
      ) : null}
      <div className="bg-white px-6 py-6 md:px-10">
        <StackList study={study} />
      </div>
    </article>
  );
}

function ImpactTemplate({ study }: { study: CaseStudy }) {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-studio">
        Impact · {study.client}
      </p>
      {study.results.length > 0 ? (
        <dl className="mt-6 space-y-5">
          {study.results.map((result) => (
            <div key={`${result.label}-${result.value}`}>
              <dd className="font-serif text-5xl leading-none text-accent md:text-6xl">
                {result.value}
              </dd>
              <dt className="mt-2 text-sm uppercase tracking-wide text-ink/50">
                {result.label}
              </dt>
            </div>
          ))}
        </dl>
      ) : null}
      <h1 className="mt-10 font-serif text-3xl leading-tight text-ink">
        {study.title}
      </h1>
      {study.imageUrl ? (
        <CaseStudyImage
          study={study}
          className="mt-6 h-52 w-full rounded-2xl object-cover"
        />
      ) : null}
      <p className="mt-2 text-sm text-ink/55">{study.industry}</p>
      <div className="mt-8 space-y-6 border-t border-ink/10 pt-8">
        <p className="leading-7 text-ink/80">{study.challenge}</p>
        <p className="leading-7 text-ink/80">{study.solution}</p>
      </div>
      {study.quote?.text ? (
        <p className="mt-8 text-sm italic text-ink/70">
          “{study.quote.text}”
          {study.quote.by ? ` — ${study.quote.by}` : ""}
        </p>
      ) : null}
      <div className="mt-8">
        <StackList study={study} />
      </div>
    </article>
  );
}

export function CaseStudyArticle({ study }: { study: CaseStudy }) {
  if (study.template === "website") {
    return <WebsiteTemplate study={study} />;
  }
  if (study.template === "impact") {
    return <ImpactTemplate study={study} />;
  }
  return <EditorialTemplate study={study} />;
}
