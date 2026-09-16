"use client";

import Link from "next/link";
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

  return (
    <div className="space-y-5">
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
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        {draftTitle ? (
          <p className="text-sm text-ink/60">
            Unsaved draft in Zustand: <span className="text-ink">{draftTitle}</span>
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
        <div className="hidden grid-cols-[1.4fr_1fr_0.7fr_0.8fr] gap-3 border-b border-ink/10 px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink/45 md:grid">
          <span>Title</span>
          <span>Client</span>
          <span>Status</span>
          <span>Updated</span>
        </div>
        <ul className="divide-y divide-ink/10">
          {visible.map((study) => (
            <li key={study.id}>
              <Link
                href={`/studio/${study.id}`}
                className="grid gap-1 px-5 py-4 transition hover:bg-paper/70 md:grid-cols-[1.4fr_1fr_0.7fr_0.8fr] md:items-center md:gap-3"
              >
                <span className="font-medium text-ink">{study.title}</span>
                <span className="text-sm text-ink/65">{study.client}</span>
                <StatusBadge status={study.status} />
                <span className="text-sm text-ink/50">
                  {new Date(study.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
