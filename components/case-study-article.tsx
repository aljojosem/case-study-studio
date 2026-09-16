import Link from "next/link";
import { CaseStudyImage } from "@/components/case-study-image";
import { buildCaseStudyView } from "@/lib/generate-case-study";
import { resultHeadline } from "@/lib/metrics";
import type { CaseStudy, ProblemPoint, ResultMetric } from "@/lib/types";

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

function ProblemPointIcon({ index }: { index: number }) {
  const className = "h-8 w-8 text-studio";
  const icons = [
    <svg key="docs" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
    <svg key="rocket" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M14 4c2.8 1.2 5 3.8 6 7-3.2 1-5.8 3.2-7 6l-4-4c2.8-1.2 4.8-3.2 5-9Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 15 5 19M8 9h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
    <svg key="gears" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="9" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 6v1.5M9 16.5V18M4.5 12H6M12 12h1.2M16 5.8V7M16 13v1.2M12.4 10H19" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
    <svg key="puzzle" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M8 8h3V6.5a1.5 1.5 0 1 1 3 0V8h3v3h1.5a1.5 1.5 0 1 1 0 3H17v3H8V8Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
    <svg key="mail" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
    <svg key="report" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 4h7l4 4v12H7V4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 4v4h4M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
  ];
  return icons[index % icons.length];
}

function ProblemPoints({ points }: { points: ProblemPoint[] }) {
  if (points.length === 0) return null;
  return (
    <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {points.map((point, index) => (
        <li key={`${point.title}-${point.detail}`}>
          <ProblemPointIcon index={index} />
          <h3 className="mt-3 text-sm font-semibold text-ink">{point.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">{point.detail}</p>
        </li>
      ))}
    </ul>
  );
}

function resultKey(result: ResultMetric) {
  return `${result.label}-${result.before ?? ""}-${result.value}`;
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
      {study.summary ? (
        <p className="mt-4 text-lg leading-8 text-ink/70">{study.summary}</p>
      ) : null}
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
          {study.problemTitle ? (
            <p className="mt-3 font-serif text-2xl leading-snug text-ink">
              {study.problemTitle}
            </p>
          ) : null}
          <p className="mt-2 text-lg leading-8 text-ink/85">{study.challenge}</p>
          <ProblemPoints points={study.problemPoints ?? []} />
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
              key={resultKey(result)}
              className="rounded-2xl bg-paper px-4 py-5 ring-1 ring-ink/10"
            >
              <dt className="text-xs uppercase tracking-wide text-ink/50">
                {result.label}
              </dt>
              {result.before ? (
                <dd className="mt-1 text-sm text-ink/45">
                  Was {result.before}
                </dd>
              ) : null}
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

function WebsiteTemplate({
  study,
  preview = false,
}: {
  study: CaseStudy;
  preview?: boolean;
}) {
  const heroMetrics = study.results.slice(0, 3);
  const outcomeMetrics = study.results.filter((result) => result.before?.trim());
  const resultRows = outcomeMetrics.length > 0 ? outcomeMetrics : study.results;
  const pad = preview ? "py-6" : "py-8 md:py-10";

  return (
    <article className="bg-white text-ink">
      <header className={`grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] ${pad}`}>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            2Base · {study.industry} · {study.client}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
            {study.title}
          </h1>
          {study.summary ? (
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70 md:text-base">
              {study.summary}
            </p>
          ) : null}
          {heroMetrics.length > 0 ? (
            <dl className="mt-8 grid gap-5 sm:grid-cols-3">
              {heroMetrics.map((result) => (
                <div key={resultKey(result)}>
                  <dd className="text-sm font-semibold text-studio md:text-base">
                    {resultHeadline(result)}
                  </dd>
                  <dt className="mt-2 text-xs leading-5 text-ink/55">
                    {result.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {study.imageUrl ? (
          <CaseStudyImage
            study={study}
            className="h-52 w-full rounded-2xl object-cover md:h-72"
          />
        ) : null}
      </header>

      {study.challenge || (study.problemPoints ?? []).length > 0 ? (
        <section className={`border-t border-ink/10 ${pad}`}>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            The Problem
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">
            {study.problemTitle || "What was slowing the work down"}
          </h2>
          {study.challenge ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/70 md:text-base">
              {study.challenge}
            </p>
          ) : null}
          <ProblemPoints points={study.problemPoints ?? []} />
        </section>
      ) : null}

      {study.solution ? (
        <section className={`border-t border-ink/10 ${pad}`}>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Our Solution
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">
            What we shipped
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/70 md:text-base">
            {study.solution}
          </p>
        </section>
      ) : null}

      {study.stack.length > 0 ? (
        <section className={`border-t border-ink/10 ${pad}`}>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Integrations
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight">
            Connected to the systems that power the workflow
          </h2>
          <div className="mt-6">
            <StackList study={study} />
          </div>
        </section>
      ) : null}

      {resultRows.length > 0 ? (
        <section className={`border-t border-ink/10 ${pad}`}>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            The Result
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">
            Numbers the work actually moved
          </h2>
          <dl className="mt-6 rounded-2xl bg-paper p-5 ring-1 ring-ink/10 md:p-6">
            {resultRows.map((result, index) => (
              <div
                key={resultKey(result)}
                className={`py-4 ${
                  index < resultRows.length - 1 ? "border-b border-ink/10" : "pb-0"
                } ${index === 0 ? "pt-0" : ""}`}
              >
                <dt className="text-xs uppercase tracking-wide text-ink/45">
                  {result.label}
                </dt>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-ink/40">
                      Was
                    </p>
                    <dd className="mt-1 font-serif text-2xl md:text-3xl">
                      {result.before || "—"}
                    </dd>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wide text-ink/40">
                      Now
                    </p>
                    <dd className="mt-1 font-serif text-2xl text-studio md:text-3xl">
                      {result.value}
                    </dd>
                  </div>
                </div>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {study.quote?.text ? (
        <blockquote className={`border-t border-ink/10 ${pad}`}>
          <p className="font-serif text-xl leading-snug md:text-2xl">
            “{study.quote.text}”
          </p>
          {study.quote.by ? (
            <footer className="mt-3 text-sm text-ink/55">{study.quote.by}</footer>
          ) : null}
        </blockquote>
      ) : null}

      {!preview ? (
        <section className={`border-t border-ink/10 ${pad} text-center`}>
          <p className="text-ink/70">
            Ready to explore what this could look like for your team?
          </p>
          <Link href="/studio" className="btn-primary mt-5">
            Open studio
          </Link>
        </section>
      ) : null}
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
            <div key={resultKey(result)}>
              {result.before ? (
                <p className="text-xs uppercase tracking-wide text-ink/40">
                  Was {result.before}
                </p>
              ) : null}
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
      {study.summary ? (
        <p className="mt-4 leading-7 text-ink/70">{study.summary}</p>
      ) : null}
      {study.imageUrl ? (
        <CaseStudyImage
          study={study}
          className="mt-6 h-52 w-full rounded-2xl object-cover"
        />
      ) : null}
      <p className="mt-2 text-sm text-ink/55">{study.industry}</p>
      <div className="mt-8 space-y-6 border-t border-ink/10 pt-8">
        {study.problemTitle ? (
          <p className="font-serif text-2xl leading-snug text-ink">
            {study.problemTitle}
          </p>
        ) : null}
        <p className="leading-7 text-ink/80">{study.challenge}</p>
        <ProblemPoints points={study.problemPoints ?? []} />
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

export function CaseStudyArticle({
  study,
  preview = false,
}: {
  study: CaseStudy;
  preview?: boolean;
}) {
  const view = buildCaseStudyView(study);
  if (view.template === "website") {
    return <WebsiteTemplate study={view} preview={preview} />;
  }
  if (view.template === "impact") {
    return <ImpactTemplate study={view} />;
  }
  return <EditorialTemplate study={view} />;
}
