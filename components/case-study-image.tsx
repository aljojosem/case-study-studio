import type { CaseStudy } from "@/lib/types";

export function CaseStudyImage({
  study,
  className,
}: {
  study: Pick<CaseStudy, "title" | "imageUrl">;
  className?: string;
}) {
  if (!study.imageUrl) return null;

  return (
    <img
      src={study.imageUrl}
      alt={study.title}
      className={className}
    />
  );
}
