"use client";

import { CaseStudyCard } from "@/components/case-study-card";
import { useStudioStore } from "@/store/studio-store";
import type { CaseStudy } from "@/lib/types";

export function FilteredCaseStudyList({ studies }: { studies: CaseStudy[] }) {
  const industry = useStudioStore((state) => state.industry);
  const stack = useStudioStore((state) => state.stack);

  const visible = studies.filter((study) => {
    const industryOk = industry === "all" || study.industry === industry;
    const stackOk = stack === "all" || study.stack.includes(stack);
    return industryOk && stackOk;
  });

  if (visible.length === 0) {
    return (
      <p className="rounded-2xl bg-white px-5 py-10 text-center text-ink/60 ring-1 ring-ink/10">
        No published case studies match those filters. They stay in Zustand when
        you open Studio.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {visible.map((study) => (
        <CaseStudyCard key={study.id} study={study} />
      ))}
    </div>
  );
}
