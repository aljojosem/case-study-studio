import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
