"use client";

import { INDUSTRIES, STACK_OPTIONS } from "@/lib/constants";
import { useStudioStore } from "@/store/studio-store";

export function ListingFilters() {
  const industry = useStudioStore((state) => state.industry);
  const stack = useStudioStore((state) => state.stack);
  const setIndustry = useStudioStore((state) => state.setIndustry);
  const setStack = useStudioStore((state) => state.setStack);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="flex flex-1 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-ink/50">
        Industry
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
      <label className="flex flex-1 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-ink/50">
        Stack
        <select
          value={stack}
          onChange={(event) => setStack(event.target.value)}
          className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm font-normal normal-case text-ink"
        >
          <option value="all">All stack</option>
          {STACK_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
