import type { Metadata } from "next";
import { INDUSTRIES, STACK_OPTIONS } from "./constants";
import type { CaseStudy } from "./types";

export const SITE_NAME = "Case Study Studio";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const DEFAULT_DESCRIPTION =
  "Turn finished 2Base projects into website-ready case studies for insurance, healthcare, fintech, and retail clients.";

export const DEFAULT_KEYWORDS = [
  "2Base",
  "2Base case studies",
  "software case study",
  "client success stories",
  "digital delivery",
  "website-ready case studies",
  "insurance software case study",
  "healthcare software case study",
  "fintech onboarding",
  "CHIMS",
  ...INDUSTRIES,
  ...STACK_OPTIONS,
];

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function parseKeywordList(raw: string) {
  const seen = new Set<string>();
  const keywords: string[] = [];
  for (const item of raw.split(/[,;\n]+/)) {
    const keyword = item.trim();
    const key = keyword.toLowerCase();
    if (!keyword || seen.has(key)) continue;
    seen.add(key);
    keywords.push(keyword);
  }
  return keywords;
}

export function fallbackCaseStudyKeywords(study: Pick<CaseStudy, "title" | "client" | "industry" | "stack">) {
  return parseKeywordList(
    [
      study.title,
      `${study.client} case study`,
      `${study.industry} software`,
      "2Base case study",
      "client success story",
      ...study.stack,
    ].join(", "),
  );
}

export function caseStudyKeywords(study: CaseStudy) {
  const custom = parseKeywordList((study.seoKeywords ?? []).join(", "));
  return custom.length > 0 ? custom : fallbackCaseStudyKeywords(study);
}

export function caseStudyDescription(study: CaseStudy) {
  const headline = study.results[0];
  const outcome = headline
    ? `${headline.value} ${headline.label}. `
    : "";
  const text = `${outcome}${study.challenge}`.replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export function caseStudyMetadata(study: CaseStudy): Metadata {
  const url = absoluteUrl(`/case-studies/${study.slug}`);
  const description = caseStudyDescription(study);
  const keywords = caseStudyKeywords(study);

  return {
    title: study.title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${study.title} · ${study.client}`,
      description,
      siteName: SITE_NAME,
      publishedTime: study.publishedAt,
      modifiedTime: study.updatedAt,
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description,
    },
  };
}

export function caseStudyJsonLd(study: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: study.title,
    description: caseStudyDescription(study),
    datePublished: study.publishedAt,
    dateModified: study.updatedAt,
    author: {
      "@type": "Organization",
      name: "2Base",
    },
    about: study.industry,
    keywords: caseStudyKeywords(study).join(", "),
    articleSection: study.industry,
    url: absoluteUrl(`/case-studies/${study.slug}`),
  };
}
