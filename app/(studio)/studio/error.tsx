"use client";

export default function StudioError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-8 ring-1 ring-ink/10">
      <h1 className="font-serif text-2xl text-ink">Studio failed to load</h1>
      <p className="mt-2 text-ink/65">The live dashboard could not render.</p>
      <button type="button" onClick={reset} className="btn-secondary mt-5">
        Try again
      </button>
    </div>
  );
}
