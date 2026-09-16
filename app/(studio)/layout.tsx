import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-studio text-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/60">
              2Base studio
            </p>
            <Link href="/studio" className="font-serif text-lg">
              Case studies
            </Link>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/case-studies" className="text-white/80 hover:text-white">
              Public site
            </Link>
            <Link
              href="/studio/new"
              className="rounded-full bg-white px-3 py-1.5 text-studio"
            >
              New draft
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
