export type CaseStudyStatus = "draft" | "review" | "published";

export type ResultMetric = {
  label: string;
  value: string;
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
  challenge: string;
  solution: string;
  results: ResultMetric[];
  quote?: CaseStudyQuote;
  stack: string[];
  seoKeywords: string[];
  imageUrl?: string;
  status: CaseStudyStatus;
  publishedAt?: string;
  updatedAt: string;
};

export type CaseStudyDraft = Omit<CaseStudy, "updatedAt" | "publishedAt"> & {
  publishedAt?: string;
};
