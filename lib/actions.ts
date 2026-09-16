"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CASE_STUDIES_TAG } from "./constants";
import { parseKeywordList } from "./seo";
import { slugify } from "./slug";
import { upsertCaseStudy } from "./store";
import { saveUploadedImage } from "./upload";
import { applyCategorizedNotes } from "./categorize-notes";
import { buildCaseStudyView } from "./generate-case-study";
import { problemPointHasValue, resultHasValue } from "./metrics";
import type {
  CaseStudyDraft,
  CaseStudyStatus,
  CaseStudyTemplate,
  ProblemPoint,
  ResultMetric,
} from "./types";

function parseResults(raw: string): ResultMetric[] {
  try {
    const parsed = JSON.parse(raw) as ResultMetric[];
    return parsed.filter(resultHasValue);
  } catch {
    return [];
  }
}

function parseProblemPoints(raw: string): ProblemPoint[] {
  try {
    const parsed = JSON.parse(raw) as ProblemPoint[];
    return parsed.filter(problemPointHasValue);
  } catch {
    return [];
  }
}

function parseTemplate(raw: string): CaseStudyTemplate {
  if (raw === "website" || raw === "impact" || raw === "editorial") {
    return raw;
  }
  return "editorial";
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
    summary: String(formData.get("summary") ?? "").trim() || undefined,
    challenge: String(formData.get("challenge") ?? "").trim(),
    problemTitle: String(formData.get("problemTitle") ?? "").trim() || undefined,
    problemPoints: parseProblemPoints(String(formData.get("problemPoints") ?? "[]")),
    solution: String(formData.get("solution") ?? "").trim(),
    results: parseResults(String(formData.get("results") ?? "[]")),
    quote: quoteText ? { text: quoteText, by: quoteBy } : undefined,
    stack: parseStack(String(formData.get("stack") ?? "")),
    seoKeywords: parseKeywordList(String(formData.get("seoKeywords") ?? "")),
    imageUrl: undefined,
    sourceNotes: String(formData.get("sourceNotes") ?? "").trim() || undefined,
    template: parseTemplate(String(formData.get("template") ?? "editorial")),
    status,
  };
}

function withGeneratedView(draft: CaseStudyDraft): CaseStudyDraft {
  const view = buildCaseStudyView({
    ...draft,
    updatedAt: new Date().toISOString(),
  });
  return {
    ...draft,
    summary: view.summary,
    problemTitle: view.problemTitle,
    challenge: view.challenge,
    problemPoints: view.problemPoints,
    solution: view.solution,
    template: view.template,
  };
}

async function withCoverImage(draft: CaseStudyDraft, formData: FormData) {
  const uploaded = formData.get("image");
  if (uploaded instanceof File && uploaded.size > 0) {
    draft.imageUrl = await saveUploadedImage(uploaded);
    return draft;
  }
  draft.imageUrl = String(formData.get("imageUrl") ?? "").trim() || undefined;
  return draft;
}

function refreshPublicCache(status: CaseStudyStatus) {
  if (status === "published") {
    updateTag(CASE_STUDIES_TAG);
  }
}

export async function saveCaseStudy(formData: FormData) {
  let draft = await withCoverImage(draftFromForm(formData), formData);
  if (draft.sourceNotes) {
    draft = applyCategorizedNotes(draft, draft.sourceNotes);
  } else {
    draft = withGeneratedView(draft);
  }
  if (!draft.title || !draft.client) {
    throw new Error("Title and client are required.");
  }

  const saved = await upsertCaseStudy(draft);
  refreshPublicCache(saved.status);
  redirect(`/studio/${saved.id}`);
}

export async function publishCaseStudy(formData: FormData) {
  let draft = await withCoverImage(draftFromForm(formData), formData);
  if (draft.sourceNotes) {
    draft = applyCategorizedNotes(draft, draft.sourceNotes);
  } else {
    draft = withGeneratedView(draft);
  }
  draft.status = "published";
  if (!draft.title || !draft.client) {
    throw new Error("Title and client are required before publish.");
  }

  const saved = await upsertCaseStudy(draft);
  updateTag(CASE_STUDIES_TAG);
  redirect(`/case-studies/${saved.slug}`);
}
