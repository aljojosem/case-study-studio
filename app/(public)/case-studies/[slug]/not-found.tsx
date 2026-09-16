import Link from "next/link";

export default function CaseStudyNotFound() {
  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-3xl text-ink">Not published</h1>
      <p className="mt-3 text-ink/65">
        That slug is not on the public site. Drafts live in Studio until someone
        publishes them.
      </p>
      <Link href="/case-studies" className="btn-secondary mt-6 inline-flex">
        Back to work
      </Link>
    </div>
  );
}
