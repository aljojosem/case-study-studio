import { CacheNote } from "@/components/cache-note";
import { StudioDashboard } from "@/components/studio-dashboard";
import { getStudioCaseStudies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Studio",
};

export default async function StudioPage() {
  const studies = await getStudioCaseStudies();
  const open = studies.filter((item) => item.status !== "published").length;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl text-ink">Dashboard</h1>
          <p className="mt-2 text-ink/65">
            {studies.length} records · {open} still in draft or review. Rendered
            on the server for every request.
          </p>
        </div>
      </div>
      <StudioDashboard studies={studies} />
      <CacheNote mode="ssr">
        getStudioCaseStudies() calls connection() so this is never served from
        the published-page cache.
      </CacheNote>
    </div>
  );
}
