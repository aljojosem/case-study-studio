import type { ProblemPoint, ResultMetric } from "./types";

export function resultHasValue(result: ResultMetric) {
  return Boolean(
    result.label.trim() || result.value.trim() || (result.before ?? "").trim(),
  );
}

export function resultHeadline(result: ResultMetric) {
  const before = result.before?.trim();
  if (before && result.value.trim()) {
    return `${before} → ${result.value}`;
  }
  return result.value;
}

export function problemPointHasValue(point: ProblemPoint) {
  return Boolean(point.title.trim() || point.detail.trim());
}
