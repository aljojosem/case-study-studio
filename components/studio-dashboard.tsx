"use client";

import Link from "next/link";
import { CaseStudyImage } from "@/components/case-study-image";
import { StatusBadge } from "@/components/status-badge";
import { INDUSTRIES } from "@/lib/constants";
import { useStudioStore } from "@/store/studio-store";
import type { CaseStudy } from "@/lib/types";

export function StudioDashboard({ studies }: { studies: CaseStudy[] }) {
  const industry = useStudioStore((state) => state.industry);
  const setIndustry = useStudioStore((state) => state.setIndustry);
  const draftTitle = useStudioStore((state) => state.draft.title);

  const visible =
    industry === "all"
      ? studies
      : studies.filter((study) => study.industry === industry);

  const published = studies.filter((item) => item.status === "published").length;
  const review = studies.filter((item) => item.status === "review").length;
  const drafts = studies.filter((item) => item.status === "draft").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Published" value={published} />
        <Stat label="In review" value={review} />
        <Stat label="Drafts" value={drafts} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex w-full max-w-xs flex-col gap-1 text-xs font-medium uppercase tracking-wide text-ink/50">
          Filter by industry
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm font-normal normal-case text-ink"
          >
            <option value="all">All industries</option>
            {INDUSTRIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        {draftTitle ? (
          <p className="text-sm text-ink/60">
            Unsaved draft in Zustand:{" "}
            <span className="text-ink">{draftTitle}</span>
          </p>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-white px-5 py-12 text-center text-ink/60 ring-1 ring-ink/10">
          No case studies match that filter.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((study) => (
            <li key={study.id}>
              <Link
                href={`/studio/${study.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:ring-studio/30"
              >
                {study.imageUrl ? (
                  <CaseStudyImage
                    study={study}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-paper text-xs uppercase tracking-wide text-ink/40">
                    No image
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-accent">
                      {study.industry}
                    </p>
                    <StatusBadge status={study.status} />
                  </div>
                  <h2 className="font-serif text-xl leading-snug text-ink group-hover:text-studio">
                    {study.title}
                  </h2>
                  <p className="text-sm text-ink/65">{study.client}</p>
                  <p className="mt-auto text-xs text-ink/45">
                    Updated{" "}
                    {new Date(study.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-ink/10">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}
