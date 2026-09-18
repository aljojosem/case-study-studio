import Link from "next/link";
import { INDUSTRIES } from "@/lib/constants";
import { IndustryLink } from "@/components/industry-link";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-12 md:grid-cols-4 md:py-14">
        <div className="md:col-span-2">
          <p className="font-serif text-lg text-ink">Case Study Studio</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink/60">
            2Base website proof. Finished delivery work, written once, ready
            for the public site.
          </p>
        </div>
        <div>
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
              <Link href="/studio" className="text-ink/70 hover:text-ink">
                Studio
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Industries
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {INDUSTRIES.map((industry) => (
              <li key={industry}>
                <IndustryLink
                  industry={industry}
                  className="text-ink/70 hover:text-ink"
                >
                  {industry}
                </IndustryLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <p className="mx-auto w-full max-w-5xl px-5 py-4 text-xs text-ink/50">
          © {year} 2Base. Case Study Studio.
        </p>
      </div>
    </footer>
  );
}
