# magent-lab-ui

@AGENTS.md

## What this is

magent-lab is an evaluation harness for LLM judges: versioned
grading criteria, regression tests that run a judge against labeled
fixtures, and agreement measured against human labels — self-consistency
(kappa), majority-vote accuracy, sensitivity/specificity, and
cluster-bootstrap agreement, each with its confidence interval.

**magent-lab-ui is where those studies get published.** magent-lab is
where the work happens — this repo is the research site that shows
the results: per-criterion breakdowns, graphs, divergent judge calls,
and the data behind every number. It is a standalone research
property, not portfolio chrome. A personal blog links to it, but the
blog and this site are unrelated — nothing here should be written or
designed to read as a portfolio piece.

## Tech stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS v4** for styling — typographic, minimal; no cards, no shadows
- **Ajv** (2020-12 draft) validates study JSON against the committed
  JSON Schema at build time
- **json-schema-to-typescript** generates TS types from that schema —
  types are never hand-written
- Static export (`output: "export"` in `next.config.ts`), deployed to
  **Netlify**

## Repository layout

```
magent-lab-ui/
├── app/
│   ├── layout.tsx          # root layout, fonts
│   ├── page.tsx             # study index — entry point, not a dashboard
│   └── globals.css
├── data/
│   └── studies/              # one committed JSON export per completed study
├── schemas/
│   └── judge-study-export.schema.json   # JSON Schema the exports conform to
├── lib/
│   ├── studies.ts            # build-time loader: reads + validates data/studies/*.json
│   └── generated/             # `npm run generate:types` output — gitignored, never hand-edit
├── public/
├── AGENTS.md                  # Next.js-version-specific agent instructions
└── CLAUDE.md                  # this file
```

## Data flow

magent-lab runs a study and exports it as JSON matching
`schemas/judge-study-export.schema.json`. That JSON and the schema
are copied into this repo and committed — see
[Repo boundary](#repo-boundary). From there, everything happens at
build time, nothing at runtime:

1. `npm run generate:types` runs `json-schema-to-typescript` over the
   schema, producing `lib/generated/study-export.ts`. Wired as
   `predev`/`prebuild`, so it's always regenerated before the app
   runs — run it manually after editing the schema.
2. `lib/studies.ts` reads every `data/studies/*.json`, validates each
   against the schema with Ajv, and **throws on any mismatch** —
   which fails `next build` / the static export. A study JSON that
   doesn't conform never reaches production.
3. Pages call `loadStudies()` directly (a plain build-time function
   call, not a fetch). `output: "export"` turns the result into a
   fully static site — no servers, no database, nothing to keep
   running.

## Development

- `npm run dev` — dev server (regenerates types first)
- `npm run build` — static export to `out/` (regenerates types first;
  fails the build on any study JSON that doesn't validate)
- `npm run generate:types` — regenerate `lib/generated/study-export.ts`
  from the schema; run manually whenever the schema changes
- `npm run lint`

## Data correctness rules

This site renders completed research studies. Correctness of
displayed numbers outranks everything else.

- Every displayed number comes from the study JSON. Never compute,
  round, reformat, or hardcode a statistic in a component.
- "not measurable" is a value, not missing data. Render it as the
  words "not measurable" with its reason. Never as 0, "—", "N/A",
  or a blank.
- Never show a point estimate without its confidence interval and n.
- `limitations` renders on the study page itself, above the fold —
  never in a footer, never collapsed by default.
- If the JSON lacks a field a component wants, the component adapts.
  Do not invent placeholder data, ever.
- Static export only. No API routes, no server components fetching
  at runtime, no client-side data fetching.

## Where this is headed

The index page is an entry point, not the destination — enough per
study (title, date, subject, n, status) to pick one, nothing more.
Depth belongs on the study page (not yet built): full validity and
consistency breakdowns, graphs of per-criterion rates with their
intervals, a divergent-cell explorer for where the judge disagreed
with itself or with ground truth, and `limitations` above the fold.
Prefer adding real depth to a study page over adding another summary
column to the index.

## Repo boundary

This repo is intentionally decoupled from magent-lab. Study JSON and
the JSON Schema are COPIED IN and committed, never read across repos.
Netlify builds this repo alone — a cross-repo read fails in CI.

Do not add a submodule, workspace link, or fetch step to magent-lab.
