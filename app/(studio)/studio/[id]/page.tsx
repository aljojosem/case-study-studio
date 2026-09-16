import { notFound } from "next/navigation";
import { CacheNote } from "@/components/cache-note";
import { CaseStudyBuilder } from "@/components/case-study-builder";
import { getStudioCaseStudy } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getStudioCaseStudy(id);
  return { title: study?.title ?? "Draft" };
}

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getStudioCaseStudy(id);

  if (!study) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-ink">{study.title}</h1>
      <CaseStudyBuilder initial={study} />
      <CacheNote mode="ssr">
        The record loads on the server each visit. Typing stays in a child
        client island plus Zustand.
      </CacheNote>
    </div>
  );
}
