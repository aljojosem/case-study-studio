import { DUMMY_IMAGES, INDUSTRIES, STACK_OPTIONS } from "./constants";
import { buildCaseStudyView } from "./generate-case-study";
import { problemPointHasValue, resultHasValue } from "./metrics";
import { parseKeywordList } from "./seo";
import { slugify } from "./slug";
import type {
  CaseStudyDraft,
  CaseStudyTemplate,
  ProblemPoint,
  ResultMetric,
} from "./types";

const EXTRA_STACK = ["NIPR", "OCR", "PostgreSQL", "Docker", "PHP", "Node.js"];

const HEADING_MAP: Record<string, string> = {
  title: "title",
  client: "client",
  customer: "client",
  industry: "industry",
  summary: "summary",
  overview: "summary",
  subtitle: "summary",
  problem: "challenge",
  challenge: "challenge",
  "the problem": "challenge",
  solution: "solution",
  "our solution": "solution",
  "what we shipped": "solution",
  result: "results",
  results: "results",
  "the result": "results",
  outcome: "results",
  outcomes: "results",
  metrics: "results",
  impact: "results",
  integrations: "stack",
  stack: "stack",
  tech: "stack",
  technology: "stack",
  quote: "quote",
  testimonial: "quote",
};

type SectionKey =
  | "title"
  | "client"
  | "industry"
  | "summary"
  | "challenge"
  | "solution"
  | "results"
  | "stack"
  | "quote"
  | "body";

function headingKey(line: string): SectionKey | null {
  const cleaned = line
    .replace(/^#{1,6}\s*/, "")
    .replace(/[:：]\s*$/, "")
    .trim()
    .toLowerCase();
  return (HEADING_MAP[cleaned] as SectionKey | undefined) ?? null;
}

function labeledValue(line: string): { key: SectionKey; value: string } | null {
  const match = line.match(
    /^(title|client|customer|industry|summary|overview|challenge|problem|solution|quote by|quote|stack|integrations?)\s*[:\-–]\s*(.+)$/i,
  );
  if (!match) return null;
  const raw = match[1].toLowerCase();
  const key =
    raw === "customer"
      ? "client"
      : raw === "overview"
        ? "summary"
        : raw === "problem"
          ? "challenge"
          : raw.startsWith("integration")
            ? "stack"
            : raw === "quote by"
              ? "quote"
              : (HEADING_MAP[raw] as SectionKey | undefined);
  if (!key) return null;
  return { key, value: match[2].trim() };
}

export function extractMetrics(text: string): ResultMetric[] {
  const metrics: ResultMetric[] = [];
  const seen = new Set<string>();

  function add(label: string, before: string, value: string) {
    const item = {
      label: label.replace(/\s+/g, " ").trim() || "Result",
      before: before.replace(/\s+/g, " ").trim(),
      value: value.replace(/\s+/g, " ").trim(),
    };
    if (!item.value) return;
    const key = `${item.label}|${item.before}|${item.value}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    metrics.push(item);
  }

  const wasNow =
    /(?:^|\n)\s*(?:[-*•]\s*)?([^\n:]{3,80}?)\s*(?:\n\s*)?was\s+([^\n]+?)\s+now\s+([^\n]+)/gi;
  for (const match of text.matchAll(wasNow)) {
    add(match[1], match[2], match[3]);
  }

  const arrow =
    /(?:^|\n)\s*(?:[-*•]\s*)?([^\n→\-]{3,80}?)\s*(?:→|->| to )\s*([^\n]+)/gi;
  for (const match of text.matchAll(arrow)) {
    const left = match[1].trim();
    const right = match[2].trim();
    const split = left.match(/^(.+?)\s+(\d[\w+.,%]*\s*[a-z%+]*)$/i);
    if (split) add(split[1], split[2], right);
    else if (/\d/.test(left) && /\d/.test(right)) add("Result", left, right);
    else add(left, "", right);
  }

  const reduced =
    /(\d[\w+.,%]*)\s*(staff|people|hours?|days?|weeks?)?\s*(?:reduced to|down to|cut to)\s*(\d[\w+.,%]*)/gi;
  for (const match of text.matchAll(reduced)) {
    add("Reduced volume", `${match[1]} ${match[2] ?? ""}`.trim(), match[3]);
  }

  return metrics.filter(resultHasValue);
}

function extractProblemPoints(text: string): ProblemPoint[] {
  const points: ProblemPoint[] = [];
  const lines = text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•\d.)]+\s*/, "").trim())
    .filter(Boolean);

  for (const line of lines) {
    if (headingKey(line) || labeledValue(line)) continue;
    const split = line.match(/^(.{8,70}?)(?:[:\-–—]| {2,})(.+)$/);
    if (split && /[A-Za-z]/.test(split[2])) {
      points.push({ title: split[1].trim(), detail: split[2].trim() });
      continue;
    }
    if (line.length <= 70 && /[A-Z]/.test(line[0]) && !/[.!?]$/.test(line)) {
      points.push({ title: line, detail: "" });
    }
  }

  const merged: ProblemPoint[] = [];
  for (const point of points) {
    const prev = merged[merged.length - 1];
    if (prev && !prev.detail && point.title.length > 70) {
      prev.detail = point.title;
      continue;
    }
    if (prev && !prev.detail && point.detail && point.title.length > 70) {
      prev.detail = `${point.title} ${point.detail}`.trim();
      continue;
    }
    merged.push(point);
  }
  return merged.filter(problemPointHasValue).slice(0, 8);
}

function extractQuote(text: string) {
  const match = text.match(/[“"]([^”"]{12,})[”"]\s*(?:[—–\-]\s*|,\s*)([^.\n]{2,80})/);
  if (!match) return undefined;
  return { text: match[1].trim(), by: match[2].trim() };
}

function extractIndustry(text: string) {
  const lower = text.toLowerCase();
  if (
    /insurance|carrier|producer|underwrit|chims|nlc|life insurance|contracting/.test(
      lower,
    )
  ) {
    return "Insurance";
  }
  if (/health|clinic|hospital|claims|patient/.test(lower)) return "Healthcare";
  if (/fintech|kyc|bank|onboarding|payment/.test(lower)) return "FinTech";
  if (/retail|store|inventory|sku|warehouse/.test(lower)) return "Retail";
  if (/public sector|licensing|permit|government|council/.test(lower)) {
    return "Public sector";
  }
  return INDUSTRIES.find((item) => lower.includes(item.toLowerCase()));
}

function extractStack(text: string) {
  const haystack = text.toLowerCase();
  const found: string[] = [];
  for (const item of [...STACK_OPTIONS, ...EXTRA_STACK]) {
    if (haystack.includes(item.toLowerCase()) && !found.includes(item)) {
      found.push(item);
    }
  }
  return found;
}

function extractImage(text: string) {
  const markdown = text.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (markdown) return markdown[1].trim();
  const url = text.match(/https?:\/\/\S+\.(?:jpg|jpeg|png|webp|gif)/i);
  if (url) return url[0];
  const local = text.match(/\/(?:images|uploads)\/[\w.-]+\.(?:jpg|jpeg|png|webp|gif)/i);
  if (local) return local[0];
  const lower = text.toLowerCase();
  const mapped = DUMMY_IMAGES.find((image) =>
    lower.includes(image.label.toLowerCase().split(" ")[0]),
  );
  if (/broker|contract|meeting|tablet/.test(lower)) {
    return "/images/broker-appointments.jpg";
  }
  if (/insurance|nlg|nlc|chims/.test(lower)) return "/images/nlg-enquiry.jpg";
  return mapped?.src;
}

function extractClient(text: string) {
  const labeled = text.match(
    /(?:client|customer|company|for)\s*[:\-]\s*([A-Z][\w&.,' ]{2,60})/,
  );
  if (labeled) return labeled[1].trim();
  const known = text.match(
    /National Life Group|NEXT LEVEL CONTRACTING|City of Riverside|Meridian Life/i,
  );
  return known?.[0];
}

function firstParagraph(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .find((block) => block.length > 40 && !headingKey(block.split("\n")[0]));
}

function pickTemplate(results: ResultMetric[], challenge: string): CaseStudyTemplate {
  const scored = results.filter((row) => row.before?.trim()).length;
  if (scored >= 3) return "website";
  if (scored >= 1 && challenge.length < 140) return "impact";
  if (challenge.length > 400 && scored === 0) return "editorial";
  return "website";
}

function splitSections(raw: string) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const buckets: Record<SectionKey, string[]> = {
    title: [],
    client: [],
    industry: [],
    summary: [],
    challenge: [],
    solution: [],
    results: [],
    stack: [],
    quote: [],
    body: [],
  };
  let current: SectionKey = "body";

  for (const line of lines) {
    const labeled = labeledValue(line.trim());
    if (labeled) {
      buckets[labeled.key].push(labeled.value);
      current = labeled.key === "results" ? "results" : labeled.key;
      continue;
    }
    const heading = headingKey(line.trim());
    if (heading) {
      current = heading;
      continue;
    }
    buckets[current].push(line);
  }

  const join = (key: SectionKey) => buckets[key].join("\n").trim();
  return { buckets, join };
}

export function categorizeNotes(raw: string): Partial<CaseStudyDraft> {
  const text = raw.trim();
  if (!text) return {};

  const { join } = splitSections(text);
  const body = join("body");
  const challengeText = join("challenge") || "";
  const solutionText = join("solution") || "";
  const resultText = `${join("results")}\n${text}`;
  const titleLine =
    join("title").split("\n")[0]?.trim() ||
    text
      .split("\n")
      .map((line) => line.replace(/^#\s*/, "").trim())
      .find((line) => line.length > 8 && line.length < 120 && !labeledValue(line));

  const summary =
    join("summary").replace(/\s+/g, " ").trim() ||
    firstParagraph(body) ||
    firstParagraph(challengeText);

  const results = extractMetrics(resultText);
  const problemPoints = extractProblemPoints(join("challenge") || body);
  const quote = extractQuote(`${join("quote")}\n${text}`);
  const challenge =
    challengeText.replace(/\s+/g, " ").trim() ||
    (problemPoints.length === 0 ? firstParagraph(text) : challengeText.trim());
  const solution = solutionText.replace(/\s+/g, " ").trim();

  return {
    title: titleLine,
    client: join("client").split("\n")[0]?.trim() || extractClient(text),
    industry: join("industry").split("\n")[0]?.trim() || extractIndustry(text),
    summary,
    challenge,
    problemTitle:
      challengeText
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line.length > 12 && line.length < 90 && !/[.]$/.test(line)) ||
      undefined,
    problemPoints,
    solution,
    results: results.length > 0 ? results : undefined,
    quote,
    stack: extractStack(`${join("stack")}\n${text}`),
    imageUrl: extractImage(text),
    seoKeywords: parseKeywordList(
      [titleLine, extractClient(text), extractIndustry(text), ...extractStack(text)].join(
        ", ",
      ),
    ),
    template: pickTemplate(results, challenge ?? ""),
    sourceNotes: text,
  };
}

function compact<T extends Record<string, unknown>>(input: T): Partial<T> {
  const next: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value == null) continue;
    if (typeof value === "string" && !value.trim()) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    (next as Record<string, unknown>)[key] = value;
  }
  return next;
}

export function applyCategorizedNotes(
  draft: CaseStudyDraft,
  notes: string,
): CaseStudyDraft {
  const parsed = compact(categorizeNotes(notes));
  const merged: CaseStudyDraft = {
    ...draft,
    ...parsed,
    sourceNotes: notes,
    title: String(parsed.title || draft.title || "Untitled case study").trim(),
    client: String(parsed.client || draft.client || "Client").trim(),
    industry: String(parsed.industry || draft.industry || "Insurance"),
    results:
      parsed.results && parsed.results.length > 0
        ? parsed.results
        : draft.results,
    problemPoints:
      parsed.problemPoints && parsed.problemPoints.length > 0
        ? parsed.problemPoints
        : draft.problemPoints,
    stack:
      parsed.stack && parsed.stack.length > 0 ? parsed.stack : draft.stack,
    quote: parsed.quote?.text ? parsed.quote : draft.quote,
    template: parsed.template || draft.template || "website",
  };

  if (!draft.id || !merged.slug) {
    merged.slug = slugify(merged.title) || merged.slug;
  }

  const view = buildCaseStudyView({
    ...merged,
    updatedAt: new Date().toISOString(),
  });

  return {
    ...merged,
    summary: view.summary,
    problemTitle: view.problemTitle,
    challenge: view.challenge,
    problemPoints: view.problemPoints,
    solution: view.solution,
    template: view.template,
  };
}

export function notesFromDraft(draft: CaseStudyDraft) {
  if (draft.sourceNotes?.trim()) return draft.sourceNotes;
  const lines = [
    draft.title,
    draft.client ? `Client: ${draft.client}` : "",
    draft.industry ? `Industry: ${draft.industry}` : "",
    draft.summary,
    draft.challenge ? `The Problem\n${draft.problemTitle ?? ""}\n${draft.challenge}` : "",
    (draft.problemPoints ?? [])
      .filter(problemPointHasValue)
      .map((point) => `- ${point.title}: ${point.detail}`)
      .join("\n"),
    draft.solution ? `Our Solution\n${draft.solution}` : "",
    draft.results
      .filter(resultHasValue)
      .map((row) =>
        row.before
          ? `${row.label}: ${row.before} → ${row.value}`
          : `${row.label}: ${row.value}`,
      )
      .join("\n"),
    draft.stack.length ? `Integrations: ${draft.stack.join(", ")}` : "",
    draft.quote?.text
      ? `“${draft.quote.text}”${draft.quote.by ? ` — ${draft.quote.by}` : ""}`
      : "",
  ];
  return lines.filter(Boolean).join("\n\n");
}
