import { CacheNote } from "@/components/cache-note";
import { CaseStudyBuilder } from "@/components/case-study-builder";

export const metadata = {
  title: "New draft",
};

export default function NewCaseStudyPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-ink">New case study</h1>
      <CaseStudyBuilder />
      <CacheNote mode="csr">
        Only the form and preview are client components. The studio chrome is a
        server layout.
      </CacheNote>
    </div>
  );
}
