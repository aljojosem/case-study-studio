import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { CASE_STUDIES_TAG, PUBLIC_REVALIDATE_SECONDS } from "./constants";
import { getCaseStudyBySlug, readCaseStudies } from "./store";

/**
 * Public listing / detail — ISR.
 * revalidate: 60s is enough; case studies do not change per request.
 * Tag lets publish expire this cache on demand.
 */
export const getPublishedCaseStudies = unstable_cache(
  async () => {
    const items = await readCaseStudies();
    return items
      .filter((item) => item.status === "published")
      .map((item) => ({
        ...item,
        seoKeywords: item.seoKeywords ?? [],
        imageUrl: item.imageUrl,
      }));
  },
  ["published-case-studies"],
  { tags: [CASE_STUDIES_TAG], revalidate: PUBLIC_REVALIDATE_SECONDS },
);

export const getPublishedCaseStudy = unstable_cache(
  async (slug: string) => {
    const item = await getCaseStudyBySlug(slug);
    if (!item || item.status !== "published") return null;
    return {
      ...item,
      seoKeywords: item.seoKeywords ?? [],
      imageUrl: item.imageUrl,
    };
  },
  ["published-case-study"],
  { tags: [CASE_STUDIES_TAG], revalidate: PUBLIC_REVALIDATE_SECONDS },
);

export async function getPublishedSlugs() {
  const items = await readCaseStudies();
  return items
    .filter((item) => item.status === "published")
    .map((item) => item.slug);
}

/**
 * Studio dashboard — no-store / per request.
 * connection() opts the render into the request so draft counts stay live.
 */
export async function getStudioCaseStudies() {
  await connection();
  return readCaseStudies();
}

export async function getStudioCaseStudy(id: string) {
  await connection();
  const items = await readCaseStudies();
  return items.find((item) => item.id === id) ?? null;
}
