import type { CaseStudy } from "@/lib/types";

export function CaseStudyArticle({ study }: { study: CaseStudy }) {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        {study.industry} · {study.client}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
        {study.title}
      </h1>
      {study.stack.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <li
              key={item}
              className="rounded-full bg-paper px-3 py-1 text-xs text-ink/70 ring-1 ring-ink/10"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}

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
