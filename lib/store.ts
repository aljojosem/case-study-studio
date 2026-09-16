import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { CaseStudy, CaseStudyDraft } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "case-studies.json");

async function ensureDataFile() {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
}

function normalize(item: CaseStudy): CaseStudy {
  return {
    ...item,
    seoKeywords: Array.isArray(item.seoKeywords) ? item.seoKeywords : [],
  };
}

export async function readCaseStudies(): Promise<CaseStudy[]> {
  await ensureDataFile();
  const raw = await readFile(DATA_PATH, "utf8");
  return (JSON.parse(raw) as CaseStudy[]).map(normalize);
}

async function writeCaseStudies(items: CaseStudy[]) {
  await ensureDataFile();
  await writeFile(DATA_PATH, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

export async function getCaseStudyById(id: string) {
  const items = await readCaseStudies();
  return items.find((item) => item.id === id) ?? null;
}

export async function getCaseStudyBySlug(slug: string) {
  const items = await readCaseStudies();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function upsertCaseStudy(input: CaseStudyDraft): Promise<CaseStudy> {
  const items = await readCaseStudies();
  const now = new Date().toISOString();
  const id = input.id || randomUUID();
  const existing = items.find((item) => item.id === id);
  const next: CaseStudy = {
    ...input,
    id,
    seoKeywords: input.seoKeywords ?? [],
    publishedAt:
      input.status === "published"
        ? input.publishedAt || existing?.publishedAt || now
        : existing?.publishedAt,
    updatedAt: now,
  };

  const index = items.findIndex((item) => item.id === id);
  if (index >= 0) {
    items[index] = next;
  } else {
    items.unshift(next);
  }

  await writeCaseStudies(items);
  return next;
}
