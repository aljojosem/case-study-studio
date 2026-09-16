"use client";

export default function CaseStudiesError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
    <div className="rounded-2xl bg-white p-8 ring-1 ring-ink/10">
      <h1 className="font-serif text-2xl text-ink">Could not load work</h1>
      <p className="mt-2 text-ink/65">The public listing failed to render.</p>
      <button type="button" onClick={reset} className="btn-secondary mt-5">
        Try again
      </button>
    </div>
    </div>
  );
}
