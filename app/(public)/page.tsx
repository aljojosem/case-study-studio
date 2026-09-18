import type { Metadata } from "next";
import { HomeLanding } from "@/components/home-landing";
import { getPublishedCaseStudies } from "@/lib/queries";
import { DEFAULT_KEYWORDS, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} · 2Base website-ready case studies`,
  },
  description:
    "Publish finished 2Base delivery work as website-ready case studies. Insurance, healthcare, fintech, and retail stories written once, ready for the site.",
  keywords: DEFAULT_KEYWORDS,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const studies = await getPublishedCaseStudies();
  return <HomeLanding studies={studies} />;
}
