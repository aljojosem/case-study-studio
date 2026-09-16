export default function CaseStudiesLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-ink/10" />
      <div className="h-4 w-72 rounded bg-ink/10" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 rounded-2xl bg-ink/10" />
        <div className="h-40 rounded-2xl bg-ink/10" />
      </div>
    </div>
  );
}
