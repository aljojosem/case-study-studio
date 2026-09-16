import Link from "next/link";
import { CaseStudyImage } from "@/components/case-study-image";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const headline = study.results[0];

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:ring-accent/40"
    >
      {study.imageUrl ? (
        <CaseStudyImage
          study={study}
          className="h-40 w-full object-cover"
        />
      ) : null}
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          {study.industry}
        </p>
        <h2 className="mt-2 font-serif text-2xl leading-snug text-ink group-hover:text-studio">
          {study.title}
        </h2>
        <p className="mt-2 text-sm text-ink/60">{study.client}</p>
        {headline ? (
          <p className="mt-4 text-sm text-ink/80">
            <span className="font-semibold text-ink">{headline.value}</span>{" "}
            {headline.label}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
