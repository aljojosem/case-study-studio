"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CASE_STUDIES_TAG } from "./constants";
import { parseKeywordList } from "./seo";
import { slugify } from "./slug";
import { upsertCaseStudy } from "./store";
import type { CaseStudyDraft, CaseStudyStatus, ResultMetric } from "./types";

function parseResults(raw: string): ResultMetric[] {
  try {
    const parsed = JSON.parse(raw) as ResultMetric[];
    return parsed.filter((row) => row.label.trim() || row.value.trim());
  } catch {
    return [];
  }
}

function parseStack(raw: string) {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function draftFromForm(formData: FormData): CaseStudyDraft {
  const title = String(formData.get("title") ?? "").trim();
  const slugSource = String(formData.get("slug") ?? title);
  const quoteText = String(formData.get("quoteText") ?? "").trim();
  const quoteBy = String(formData.get("quoteBy") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as CaseStudyStatus;

  return {
    id: String(formData.get("id") ?? ""),
    title,
    slug: slugify(slugSource) || slugify(title) || `case-${Date.now()}`,
    client: String(formData.get("client") ?? "").trim(),
    industry: String(formData.get("industry") ?? "Insurance"),
    challenge: String(formData.get("challenge") ?? "").trim(),
    solution: String(formData.get("solution") ?? "").trim(),
    results: parseResults(String(formData.get("results") ?? "[]")),
    quote: quoteText ? { text: quoteText, by: quoteBy } : undefined,
    stack: parseStack(String(formData.get("stack") ?? "")),
    seoKeywords: parseKeywordList(String(formData.get("seoKeywords") ?? "")),
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || undefined,
    status,
  };
}

function refreshPublicCache(status: CaseStudyStatus) {
  if (status === "published") {
    updateTag(CASE_STUDIES_TAG);
  }
}

export async function saveCaseStudy(formData: FormData) {
  const draft = draftFromForm(formData);
  if (!draft.title || !draft.client) {
    throw new Error("Title and client are required.");
  }

  const saved = await upsertCaseStudy(draft);
  refreshPublicCache(saved.status);
  redirect(`/studio/${saved.id}`);
}

export async function publishCaseStudy(formData: FormData) {
  const draft = draftFromForm(formData);
  draft.status = "published";
  if (!draft.title || !draft.client) {
    throw new Error("Title and client are required before publish.");
  }

  const saved = await upsertCaseStudy(draft);
  updateTag(CASE_STUDIES_TAG);
  redirect(`/case-studies/${saved.slug}`);
}
