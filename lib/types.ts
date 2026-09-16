export type CaseStudyStatus = "draft" | "review" | "published";
export type CaseStudyTemplate = "editorial" | "website" | "impact";

export type ResultMetric = {
  label: string;
  value: string;
  before?: string;
};

export type ProblemPoint = {
  title: string;
  detail: string;
};

export type CaseStudyQuote = {
  text: string;
  by: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  summary?: string;
  challenge: string;
  problemTitle?: string;
  problemPoints?: ProblemPoint[];
  solution: string;
  results: ResultMetric[];
  quote?: CaseStudyQuote;
  stack: string[];
  seoKeywords: string[];
  imageUrl?: string;
  sourceNotes?: string;
  template?: CaseStudyTemplate;
  status: CaseStudyStatus;
  publishedAt?: string;
  updatedAt: string;
};

export type CaseStudyDraft = Omit<CaseStudy, "updatedAt" | "publishedAt"> & {
  publishedAt?: string;
};
