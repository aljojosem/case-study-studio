import Link from "next/link";
import { INDUSTRIES } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white/70">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-10 md:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.8fr))]">
        <div>
          <p className="font-serif text-lg text-ink">Case Study Studio</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink/60">
            2Base website-ready case studies for insurance, healthcare,
            fintech, retail, and public sector delivery.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Site
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-ink/70 hover:text-ink">
                Home
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="text-ink/70 hover:text-ink">
                Published work
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="text-ink/70 hover:text-ink">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/studio" className="text-ink/70 hover:text-ink">
                Open studio
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Industries">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Industries
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {INDUSTRIES.map((industry) => (
              <li key={industry}>
                <Link href="/case-studies" className="text-ink/70 hover:text-ink">
                  {industry}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-ink/10">
        <p className="mx-auto w-full max-w-5xl px-5 py-4 text-xs text-ink/50">
          © 2026 2Base. Case studies written once, ready for the site.
        </p>
      </div>
    </footer>
  );
}
