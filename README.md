# Case Study Studio

Next.js App Router app for the 2Base hackathon: turn a finished project into a website-ready case study.

## Run

```bash
cd "/Users/aljojose/Projects/case study studio"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Four screens

| Route | Render | Why |
|---|---|---|
| `/` | SSG | Marketing copy does not change per request |
| `/case-studies` and `/case-studies/[slug]` | ISR (`revalidate: 60`, tag `case-studies`) | Public site can lag a minute |
| `/studio` | SSR (`force-dynamic` + `connection()`) | Drafts and counts must be fresh |
| `/studio/new` and `/studio/[id]` | SSR shell + CSR builder | Only the form needs typing |

Publish calls `updateTag('case-studies')` so the public listing refreshes.

## Zustand

Industry/stack filters and the unsaved draft persist across public ↔ studio navigation (`localStorage` key `case-study-studio`).

## Seed data

`data/case-studies.json` — published, in-review, and draft records including the NLC/CHIMS producer-contract case study. Saves write back to this file (local demo only).

The left side is one dump of source text (today paste, later the knowledge base). There are no categorized problem/solution fields. The studio pulls title, problem, solution, numbers, and template on its own and shows the case study on the right.

## AI logs

Each branch gets `ai-logs/<branch>.md`. Cursor hooks append prompts and results automatically. Name branches like `yourname/short-task`, then commit that log file with your pull request. See `ai-logs/README.md`.
