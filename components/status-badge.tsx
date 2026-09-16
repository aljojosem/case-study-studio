import type { CaseStudyStatus } from "@/lib/types";

const styles: Record<CaseStudyStatus, string> = {
  draft: "bg-paper text-ink/70 ring-ink/15",
  review: "bg-amber-50 text-amber-900 ring-amber-200",
  published: "bg-emerald-50 text-emerald-900 ring-emerald-200",
};

export function StatusBadge({ status }: { status: CaseStudyStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
