"use client";

import { useEffect, useState } from "react";
import { CaseStudyArticle } from "@/components/case-study-article";
import { INDUSTRIES, DUMMY_IMAGES, STACK_OPTIONS } from "@/lib/constants";
import { parseKeywordList } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import { publishCaseStudy, saveCaseStudy } from "@/lib/actions";
import { emptyDraft, useStudioStore } from "@/store/studio-store";
import type { CaseStudy, CaseStudyDraft, CaseStudyStatus } from "@/lib/types";

function toPreview(draft: CaseStudyDraft): CaseStudy {
  return {
    ...draft,
    title: draft.title || "Untitled case study",
    client: draft.client || "Client",
    challenge: draft.challenge || "Describe the problem in two or three sentences.",
    solution: draft.solution || "Describe what 2Base shipped.",
    results: draft.results.filter((row) => row.label || row.value),
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
  const [keywordInput, setKeywordInput] = useState("");
  const [uploadPreview, setUploadPreview] = useState("");

  useEffect(() => {
    if (initial) {
      setDraft({
        ...initial,
        seoKeywords: initial.seoKeywords ?? [],
        quote: initial.quote ?? { text: "", by: "" },
        results:
          initial.results.length > 0
            ? initial.results
            : [
                { label: "", value: "" },
                { label: "", value: "" },
              ],
      });
      setKeywordInput((initial.seoKeywords ?? []).join(", "));
      setUploadPreview("");
      return;
    }

    const current = useStudioStore.getState().draft;
    if (current.id) {
      setDraft(emptyDraft());
      setKeywordInput("");
      setUploadPreview("");
      return;
    }

    setKeywordInput((current.seoKeywords ?? []).join(", "));
  }, [initial, setDraft]);

  function updateResult(index: number, key: "label" | "value", value: string) {
    const results = draft.results.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [key]: value } : row,
    );
    patchDraft({ results });
  }

  function toggleStack(item: string) {
    const stack = draft.stack.includes(item)
      ? draft.stack.filter((entry) => entry !== item)
      : [...draft.stack, item];
    patchDraft({ stack });
  }

  const hiddenFields = (
    <>
      <input type="hidden" name="id" value={draft.id} />
      <input type="hidden" name="results" value={JSON.stringify(draft.results)} />
      <input type="hidden" name="stack" value={draft.stack.join(",")} />
      <input type="hidden" name="status" value={draft.status} />
    </>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form
        className="space-y-5 rounded-2xl bg-white p-5 ring-1 ring-ink/10 md:p-6"
        encType="multipart/form-data"
      >
        {hiddenFields}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input
              name="title"
              value={draft.title}
              onChange={(event) => {
                const title = event.target.value;
                patchDraft({
                  title,
                  slug: draft.id ? draft.slug : slugify(title),
                });
              }}
              className="input"
              required
            />
          </Field>
          <Field label="Slug">
            <input
              name="slug"
              value={draft.slug}
              onChange={(event) => patchDraft({ slug: slugify(event.target.value) })}
              className="input"
            />
          </Field>
          <Field label="Client">
            <input
              name="client"
              value={draft.client}
              onChange={(event) => patchDraft({ client: event.target.value })}
              className="input"
              required
            />
          </Field>
          <Field label="Industry">
            <select
              name="industry"
              value={draft.industry}
              onChange={(event) => patchDraft({ industry: event.target.value })}
              className="input"
            >
              {INDUSTRIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink/50">
              Cover image
            </p>
            {(uploadPreview || draft.imageUrl) ? (
              <img
                src={uploadPreview || draft.imageUrl}
                alt=""
                className="mb-3 h-36 w-full rounded-xl object-cover ring-1 ring-ink/10"
              />
            ) : null}
            <input type="hidden" name="imageUrl" value={draft.imageUrl ?? ""} />
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
              <option value="">
                {draft.imageUrl &&
                !DUMMY_IMAGES.some((image) => image.src === draft.imageUrl)
                  ? "Using uploaded image"
                  : "Choose a dummy image"}
              </option>
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
              className="mt-3 block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-studio file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
            />
            <p className="mt-1 text-xs text-ink/50">
              Pick a dummy cover or upload a JPG, PNG, WebP, or GIF (max 4 MB).
              An upload is saved when you click Save or Publish.
            </p>
          </div>
        </div>

        <Field label="Challenge">
          <textarea
            name="challenge"
            value={draft.challenge}
            onChange={(event) => patchDraft({ challenge: event.target.value })}
            rows={4}
            className="input resize-y"
          />
        </Field>
        <Field label="Solution">
          <textarea
            name="solution"
            value={draft.solution}
            onChange={(event) => patchDraft({ solution: event.target.value })}
            rows={4}
            className="input resize-y"
          />
        </Field>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">
            Results
          </p>
          <div className="space-y-2">
            {draft.results.map((row, index) => (
              <div key={index} className="grid grid-cols-[1.4fr_1fr] gap-2">
                <input
                  value={row.label}
                  onChange={(event) => updateResult(index, "label", event.target.value)}
                  placeholder="Metric label"
                  className="input"
                />
                <input
                  value={row.value}
                  onChange={(event) => updateResult(index, "value", event.target.value)}
                  placeholder="−40%"
                  className="input"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              patchDraft({ results: [...draft.results, { label: "", value: "" }] })
            }
            className="mt-2 text-sm text-studio underline-offset-2 hover:underline"
          >
            Add metric
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Quote">
            <textarea
              name="quoteText"
              value={draft.quote?.text ?? ""}
              onChange={(event) =>
                patchDraft({
                  quote: { text: event.target.value, by: draft.quote?.by ?? "" },
                })
              }
              rows={3}
              className="input resize-y"
            />
          </Field>
          <Field label="Quote by">
            <input
              name="quoteBy"
              value={draft.quote?.by ?? ""}
              onChange={(event) =>
                patchDraft({
                  quote: { text: draft.quote?.text ?? "", by: event.target.value },
                })
              }
              className="input"
            />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">
            Stack
          </legend>
          <div className="flex flex-wrap gap-2">
            {STACK_OPTIONS.map((item) => {
              const on = draft.stack.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleStack(item)}
                  className={`rounded-full px-3 py-1 text-xs ring-1 ${
                    on
                      ? "bg-studio text-white ring-studio"
                      : "bg-paper text-ink/70 ring-ink/15"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Field label="SEO keywords">
          <textarea
            name="seoKeywords"
            value={keywordInput}
            onChange={(event) => {
              const value = event.target.value;
              setKeywordInput(value);
              patchDraft({ seoKeywords: parseKeywordList(value) });
            }}
            rows={3}
            className="input resize-y"
            placeholder="life insurance enquiry, CHIMS, National Life Group"
          />
          <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-ink/50">
            Comma-separated. These become this case study’s meta keywords after
            publish. Leave blank to fall back to title, client, industry, and stack.
          </span>
        </Field>

        <Field label="Status">
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
        </Field>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button formAction={saveCaseStudy} className="btn-secondary">
            Save
          </button>
          <button formAction={publishCaseStudy} className="btn-primary">
            Publish to website
          </button>
        </div>
        <p className="text-xs text-ink/50">
          Draft stays in Zustand if you open the public listing and come back.
        </p>
      </form>

      <div className="rounded-2xl bg-white p-5 ring-1 ring-ink/10 md:p-8">
        <p className="mb-6 text-xs font-medium uppercase tracking-wide text-ink/40">
          Live preview
        </p>
        <CaseStudyArticle study={toPreview(draft)} />
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink/50">
        {label}
      </span>
      {children}
    </label>
  );
}
