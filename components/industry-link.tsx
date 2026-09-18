"use client";

import Link from "next/link";
import { useStudioStore } from "@/store/studio-store";

type IndustryLinkProps = {
  industry: string;
  className?: string;
  children: React.ReactNode;
};

export function IndustryLink({ industry, className, children }: IndustryLinkProps) {
  const setIndustry = useStudioStore((state) => state.setIndustry);
  const setStack = useStudioStore((state) => state.setStack);

  return (
    <Link
      href="/case-studies"
      className={className}
      onClick={() => {
        setIndustry(industry);
        setStack("all");
      }}
    >
      {children}
    </Link>
  );
}
