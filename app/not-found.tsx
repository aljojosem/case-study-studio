import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-ink/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-serif text-lg text-ink">
            Case Study Studio
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/case-studies" className="text-ink/70 hover:text-ink">
              Work
            </Link>
            <Link
              href="/studio"
              className="rounded-full bg-studio px-3 py-1.5 text-white"
            >
              Open studio
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-16">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          404
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
          That page is not in this app.
        </h1>
        <p className="mt-4 text-lg leading-8 text-ink/70">
          Case Study Studio lives on a few routes. Start from home, the public
          listing, or the studio dashboard.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Home
          </Link>
          <Link href="/case-studies" className="btn-secondary">
            Published work
          </Link>
          <Link href="/studio" className="btn-secondary">
            Open studio
          </Link>
        </div>
      </main>
    </div>
  );
}
