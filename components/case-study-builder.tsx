"use client";

import { useEffect, useRef, useState } from "react";
import { CaseStudyArticle } from "@/components/case-study-article";
import { DUMMY_IMAGES } from "@/lib/constants";
import {
  applyCategorizedNotes,
  notesFromDraft,
} from "@/lib/categorize-notes";
import { problemPointHasValue, resultHasValue } from "@/lib/metrics";
import { publishCaseStudy, saveCaseStudy } from "@/lib/actions";
import { emptyDraft, useStudioStore } from "@/store/studio-store";
import type { CaseStudy, CaseStudyDraft, CaseStudyStatus } from "@/lib/types";

function toPreview(draft: CaseStudyDraft): CaseStudy {
  return {
    ...draft,
    title: draft.title || "Untitled case study",
    client: draft.client || "Client",
    challenge: draft.challenge || "",
    problemTitle: draft.problemTitle,
    problemPoints: (draft.problemPoints ?? []).filter(problemPointHasValue),
    solution: draft.solution || "",
    results: draft.results.filter(resultHasValue),
    quote: draft.quote?.text ? draft.quote : undefined,
    updatedAt: new Date().toISOString(),
  };
}

export function CaseStudyBuilder({
  initial,
}: {
  initial?: CaseStudy | null;
}) {
  const draft = useStudioStore((state) => state.draft);
  const setDraft = useStudioStore((state) => state.setDraft);
  const patchDraft = useStudioStore((state) => state.patchDraft);
  const [uploadPreview, setUploadPreview] = useState("");
  const [notes, setNotes] = useState("");
  const skipParse = useRef(true);

  useEffect(() => {
    skipParse.current = true;
    if (initial) {
      const next: CaseStudyDraft = {
        ...initial,
        summary: initial.summary ?? "",
        seoKeywords: initial.seoKeywords ?? [],
        quote: initial.quote ?? { text: "", by: "" },
        template: initial.template ?? "website",
        sourceNotes: initial.sourceNotes ?? "",
        problemTitle: initial.problemTitle ?? "",
        problemPoints: initial.problemPoints ?? [],
        results: initial.results.map((row) => ({
          ...row,
          before: row.before ?? "",
        })),
      };
      setDraft(next);
      setNotes(notesFromDraft(next));
      setUploadPreview("");
      return;
    }

    const current = useStudioStore.getState().draft;
    if (current.id) {
      setDraft(emptyDraft());
      setNotes("");
      setUploadPreview("");
      return;
    }

    setNotes(current.sourceNotes || "");
  }, [initial, setDraft]);

  useEffect(() => {
    if (skipParse.current) {
      skipParse.current = false;
      return;
    }
    if (!notes.trim()) return;
    const timer = window.setTimeout(() => {
      const current = useStudioStore.getState().draft;
      setDraft(
        applyCategorizedNotes({ ...current, sourceNotes: notes }, notes),
      );
    }, 400);
    return () => window.clearTimeout(timer);
  }, [notes, setDraft]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2 xl:gap-10">
      <form
        className="space-y-5 rounded-2xl bg-white p-5 ring-1 ring-ink/10 md:p-8"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={draft.id} />
        <input type="hidden" name="title" value={draft.title} />
        <input type="hidden" name="slug" value={draft.slug} />
        <input type="hidden" name="client" value={draft.client} />
        <input type="hidden" name="industry" value={draft.industry} />
        <input type="hidden" name="summary" value={draft.summary ?? ""} />
        <input type="hidden" name="challenge" value={draft.challenge} />
        <input type="hidden" name="problemTitle" value={draft.problemTitle ?? ""} />
        <input type="hidden" name="solution" value={draft.solution} />
        <input type="hidden" name="quoteText" value={draft.quote?.text ?? ""} />
        <input type="hidden" name="quoteBy" value={draft.quote?.by ?? ""} />
        <input
          type="hidden"
          name="seoKeywords"
          value={(draft.seoKeywords ?? []).join(", ")}
        />
        <input type="hidden" name="results" value={JSON.stringify(draft.results)} />
        <input
          type="hidden"
          name="problemPoints"
          value={JSON.stringify(draft.problemPoints ?? [])}
        />
        <input type="hidden" name="stack" value={draft.stack.join(",")} />
        <input type="hidden" name="template" value={draft.template ?? "website"} />
        <input type="hidden" name="status" value={draft.status} />
        <input type="hidden" name="imageUrl" value={draft.imageUrl ?? ""} />

        <p className="text-base leading-8 text-ink/75">
          Put the whole project record in the box below as one block of text —
          notes, paragraphs, numbers, and image links mixed together. There are
          no problem, solution, or metric fields to fill. The studio reads this
          dump and pulls those sections on its own for the case study on the
          right. Today you paste it here; later this same box will be filled
          from the knowledge base, still without categorized inputs.
        </p>

        <textarea
          name="sourceNotes"
          value={notes}
          onChange={(event) => {
            const value = event.target.value;
            setNotes(value);
            patchDraft({ sourceNotes: value });
          }}
          rows={22}
          className="input resize-y text-base leading-7"
          placeholder="Paste the raw delivery record here. The studio will find the problem, solution, numbers, and the rest."
        />

        {(uploadPreview || draft.imageUrl) ? (
          <img
            src={uploadPreview || draft.imageUrl}
            alt=""
            className="h-40 w-full rounded-xl object-cover ring-1 ring-ink/10"
          />
        ) : null}
        <select
          value={
            DUMMY_IMAGES.some((image) => image.src === (draft.imageUrl ?? ""))
              ? draft.imageUrl
              : ""
          }
          onChange={(event) => {
            setUploadPreview("");
            patchDraft({ imageUrl: event.target.value });
          }}
          className="input"
        >
          <option value="">Optional image — or mention one in the dump</option>
          {DUMMY_IMAGES.map((image) => (
            <option key={image.src} value={image.src}>
              {image.label}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setUploadPreview(file ? URL.createObjectURL(file) : "");
          }}
          className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-studio file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={draft.status}
            onChange={(event) =>
              patchDraft({ status: event.target.value as CaseStudyStatus })
            }
            className="input max-w-xs"
          >
            <option value="draft">Draft</option>
            <option value="review">In review</option>
            <option value="published">Published</option>
          </select>
          <button formAction={saveCaseStudy} className="btn-secondary">
            Save
          </button>
          <button formAction={publishCaseStudy} className="btn-primary">
            Publish to website
          </button>
        </div>
      </form>

      <div className="rounded-2xl bg-white p-5 ring-1 ring-ink/10 md:p-8 lg:sticky lg:top-6 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
        <p className="mb-6 text-xs font-medium uppercase tracking-wide text-ink/40">
          Case study view — problem, solution, and numbers pulled from the dump
        </p>
        <CaseStudyArticle study={toPreview(draft)} preview />
      </div>
    </div>
  );
}
