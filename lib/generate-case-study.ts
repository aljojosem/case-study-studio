import { problemPointHasValue, resultHasValue, resultHeadline } from "./metrics";
import type { CaseStudy, CaseStudyDraft, ProblemPoint, ResultMetric } from "./types";

const MIN_COPY = 80;

type FactInput = Pick<
  CaseStudy,
  "title" | "client" | "industry" | "stack" | "results"
> &
  Partial<
    Pick<
      CaseStudy,
      "summary" | "challenge" | "solution" | "problemTitle" | "problemPoints" | "template"
    >
  >;

const INDUSTRY_PROBLEMS: Record<string, ProblemPoint[]> = {
  Insurance: [
    {
      title: "Manual Processes for all User Types",
      detail:
        "Staff, agents, and administrators relied on time-consuming manual actions at every stage.",
    },
    {
      title: "Inefficient and Disconnected Workflows",
      detail:
        "The lack of centralized coordination caused delays, redundancies, and frequent errors.",
    },
    {
      title: "High Cost Per Transaction",
      detail:
        "Manual operations required more staff time, increasing the cost of processing each contract.",
    },
    {
      title: "No Integration with Carrier-Specific Rules",
      detail:
        "Contract variations by carrier had to be managed manually, increasing the risk of non-compliance.",
    },
    {
      title: "Contracts Delivered via Static Email",
      detail:
        "Finalized contracts were shared through email attachments with no real-time tracking or audit trail.",
    },
    {
      title: "Limited Visibility and Reporting",
      detail:
        "Lack of real-time dashboards made it hard to track contract status, agent progress, or spot compliance issues early.",
    },
  ],
  Healthcare: [
    {
      title: "Paper and photo intake",
      detail:
        "Clinicians captured forms on phones and emailed them, so missing fields came back days later.",
    },
    {
      title: "Disconnected coding review",
      detail:
        "Coding sat in a separate queue with no live status for the field team.",
    },
    {
      title: "High cost per submission",
      detail:
        "Each incomplete packet meant another round of staff time before the claim could move.",
    },
    {
      title: "No shared source of truth",
      detail:
        "Ops could not see who owned a case or whether it was waiting on the clinic or on 2Base.",
    },
    {
      title: "Weak audit trail",
      detail:
        "Updates travelled by email, so compliance checks were slow and easy to miss.",
    },
    {
      title: "Limited reporting",
      detail:
        "Leaders could not see turnaround, drop-off, or where work was stuck.",
    },
  ],
  FinTech: [
    {
      title: "Manual identity checks",
      detail:
        "Onboarding teams re-keyed documents and chased missing KYC fields by hand.",
    },
    {
      title: "Drop-off in the funnel",
      detail:
        "Applicants left when the process felt slow, opaque, or repeated the same questions.",
    },
    {
      title: "High cost per onboarding",
      detail:
        "Each extra review cycle increased the cost of bringing a customer live.",
    },
    {
      title: "Rules living in inboxes",
      detail:
        "Product and compliance rules were not encoded, so exceptions piled up.",
    },
    {
      title: "Status only in Slack",
      detail:
        "Nobody had a live view of who was waiting on the bank, the applicant, or ops.",
    },
    {
      title: "Thin reporting",
      detail:
        "Conversion and time-to-live were hard to prove without a structured record.",
    },
  ],
  Retail: [
    {
      title: "Stock truth in spreadsheets",
      detail:
        "Counts lived in files that went stale as soon as the shop floor moved.",
    },
    {
      title: "Disconnected store and warehouse",
      detail:
        "Reorders and transfers needed phone calls because systems did not share state.",
    },
    {
      title: "High cost of exceptions",
      detail:
        "Every mismatch meant staff time before an order could ship.",
    },
    {
      title: "No live inventory rules",
      detail:
        "Location and product rules were applied by memory, not by the system.",
    },
    {
      title: "Updates by email",
      detail:
        "Purchase and transfer notes travelled as attachments with no audit trail.",
    },
    {
      title: "Limited operational reporting",
      detail:
        "Shrink, delays, and stock-outs were visible too late to act.",
    },
  ],
  "Public sector": [
    {
      title: "Paper-heavy intake",
      detail:
        "Licensing and permits still moved as packets, so staff re-typed the same facts.",
    },
    {
      title: "Disconnected handoffs",
      detail:
        "Departments could not see who owned a request or what was blocking it.",
    },
    {
      title: "High cost per case",
      detail:
        "Each chase and rework increased the cost of a single application.",
    },
    {
      title: "Rules applied by hand",
      detail:
        "Eligibility and document rules varied by case and were hard to prove.",
    },
    {
      title: "Status only by phone",
      detail:
        "Applicants and staff had no live view of progress.",
    },
    {
      title: "Limited reporting",
      detail:
        "Leaders could not see backlog, SLA risk, or where cases stalled.",
    },
  ],
};

function filled(text: string | undefined, min = 1) {
  return (text ?? "").trim().length >= min;
}

function industryOf(study: FactInput) {
  return study.industry.trim() || "Insurance";
}

function clientName(study: FactInput) {
  return study.client.trim() || "the client";
}

function usableResults(study: FactInput): ResultMetric[] {
  return (study.results ?? []).filter(resultHasValue);
}

function metricPoints(results: ResultMetric[]): ProblemPoint[] {
  return results
    .filter((row) => row.before?.trim())
    .slice(0, 4)
    .map((row) => ({
      title: `${row.label} could not keep up`,
      detail: `The baseline sat at ${row.before}. The work only moved once it reached ${row.value}.`,
    }));
}

function industryPoints(industry: string): ProblemPoint[] {
  return INDUSTRY_PROBLEMS[industry] ?? INDUSTRY_PROBLEMS.Insurance;
}

function generateSummary(study: FactInput) {
  const headline = usableResults(study)[0];
  const outcome = headline ? ` Headline result: ${resultHeadline(headline)}.` : "";
  return `A 2Base delivery for ${clientName(study)} in ${industryOf(study).toLowerCase()}. ${study.title.replace(/\.$/, "")}.${outcome}`;
}

function generateProblemTitle(study: FactInput) {
  return `The hidden cost of outdated ${industryOf(study).toLowerCase()} workflows`;
}

function generateChallenge(study: FactInput) {
  const name = clientName(study);
  const metrics = usableResults(study)
    .filter((row) => row.before?.trim())
    .slice(0, 3)
    .map((row) => `${row.label.toLowerCase()} at ${row.before}`)
    .join(", ");
  const metricLine = metrics
    ? ` Before the rebuild, ${metrics}.`
    : " Manual handoffs, static files, and no live status were slowing the work.";
  return `${name} was spending too much staff time on ${industryOf(study).toLowerCase()} operations that still ran on email, documents, and disconnected queues.${metricLine} The process could not keep pace with volume, and there was no single place to see ownership, exceptions, or audit history.`;
}

function generateSolution(study: FactInput) {
  const name = clientName(study);
  const stack = study.stack.filter(Boolean);
  const stackLine =
    stack.length > 0
      ? ` The delivery used ${stack.join(", ")}.`
      : "";
  const metrics = usableResults(study)
    .filter((row) => row.value.trim())
    .slice(0, 3)
    .map((row) => resultHeadline(row))
    .join("; ");
  const metricLine = metrics ? ` Measured movement included ${metrics}.` : "";
  return `2Base shipped a structured workspace for ${name} so intake, rules, status, and delivery live in one system instead of inboxes.${stackLine}${metricLine} The case study view is generated from those delivery facts — not a pixel copy of another website.`;
}

function generateProblemPoints(study: FactInput): ProblemPoint[] {
  const fromMetrics = metricPoints(usableResults(study));
  const fromIndustry = industryPoints(industryOf(study));
  const merged: ProblemPoint[] = [];
  const seen = new Set<string>();
  for (const point of [...fromMetrics, ...fromIndustry]) {
    const key = point.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(point);
    if (merged.length === 6) break;
  }
  return merged;
}

export function generateNarrative(study: FactInput) {
  return {
    summary: generateSummary(study),
    problemTitle: generateProblemTitle(study),
    challenge: generateChallenge(study),
    problemPoints: generateProblemPoints(study),
    solution: generateSolution(study),
    template: study.template ?? ("website" as const),
  };
}

/** Fill any missing case-study copy from facts (metrics, client, industry, stack). */
export function buildCaseStudyView(
  study: CaseStudy | (CaseStudyDraft & { updatedAt?: string }),
): CaseStudy {
  const generated = generateNarrative(study);
  const authoredPoints = (study.problemPoints ?? []).filter(problemPointHasValue);

  return {
    id: study.id,
    title: study.title || "Untitled case study",
    slug: study.slug,
    client: study.client || "Client",
    industry: study.industry || "Insurance",
    summary: filled(study.summary) ? study.summary : generated.summary,
    challenge: filled(study.challenge, MIN_COPY)
      ? study.challenge
      : generated.challenge,
    problemTitle: filled(study.problemTitle)
      ? study.problemTitle
      : generated.problemTitle,
    problemPoints:
      authoredPoints.length >= 3 ? authoredPoints : generated.problemPoints,
    solution: filled(study.solution, MIN_COPY)
      ? study.solution
      : generated.solution,
    results: usableResults(study),
    quote: study.quote?.text ? study.quote : undefined,
    stack: study.stack ?? [],
    seoKeywords: study.seoKeywords ?? [],
    imageUrl: study.imageUrl,
    template: study.template ?? "website",
    status: study.status,
    publishedAt: study.publishedAt,
    updatedAt: study.updatedAt ?? new Date().toISOString(),
  };
}

export function applyGeneratedNarrative(draft: CaseStudyDraft): CaseStudyDraft {
  const generated = generateNarrative(draft);
  return {
    ...draft,
    summary: generated.summary,
    problemTitle: generated.problemTitle,
    challenge: generated.challenge,
    problemPoints: generated.problemPoints,
    solution: generated.solution,
    template: draft.template || "website",
  };
}
