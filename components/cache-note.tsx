type CacheNoteProps = {
  mode: "ssg" | "isr" | "ssr" | "csr";
  children: string;
};

const labels = {
  ssg: "SSG",
  isr: "ISR · revalidate 60s · tag case-studies",
  ssr: "SSR · no-store",
  csr: "CSR island",
};

export function CacheNote({ mode, children }: CacheNoteProps) {
  return (
    <p className="mt-10 border-t border-ink/10 pt-4 text-xs leading-5 text-ink/55">
      <span className="mr-2 font-mono uppercase tracking-wide text-accent">
        {labels[mode]}
      </span>
      {children}
    </p>
  );
}
