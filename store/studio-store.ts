"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CaseStudyDraft } from "@/lib/types";

export const emptyDraft = (): CaseStudyDraft => ({
  id: "",
  title: "",
  slug: "",
  client: "",
  industry: "Insurance",
  summary: "",
  challenge: "",
  problemTitle: "",
  problemPoints: [
    { title: "", detail: "" },
    { title: "", detail: "" },
  ],
  solution: "",
  results: [
    { label: "", before: "", value: "" },
    { label: "", before: "", value: "" },
  ],
  quote: { text: "", by: "" },
  stack: [],
  seoKeywords: [],
  imageUrl: "",
  sourceNotes: "",
  template: "website",
  status: "draft",
});

type StudioState = {
  industry: string;
  stack: string;
  draft: CaseStudyDraft;
  setIndustry: (industry: string) => void;
  setStack: (stack: string) => void;
  setDraft: (draft: CaseStudyDraft) => void;
  patchDraft: (patch: Partial<CaseStudyDraft>) => void;
  resetDraft: () => void;
};

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      industry: "all",
      stack: "all",
      draft: emptyDraft(),
      setIndustry: (industry) => set({ industry }),
      setStack: (stack) => set({ stack }),
      setDraft: (draft) => set({ draft }),
      patchDraft: (patch) =>
        set((state) => ({ draft: { ...state.draft, ...patch } })),
      resetDraft: () => set({ draft: emptyDraft() }),
    }),
    { name: "case-study-studio" },
  ),
);
