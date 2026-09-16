import Link from "next/link";

export default function StudioNotFound() {
  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-3xl text-ink">Draft not found</h1>
      <p className="mt-3 text-ink/65">That id is not in the studio file.</p>
      <Link href="/studio" className="btn-secondary mt-6 inline-flex">
        Back to dashboard
      </Link>
    </div>
  );
}
