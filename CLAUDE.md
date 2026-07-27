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
- **Recharts** for charts — a chart is a Client Component (`"use client"`)
  that receives already-loaded study data as props from its server
  page; Client Components are prerendered to static HTML same as
  anything else under `output: "export"`. A chart never fetches
  anything itself.
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
│   ├── layout.tsx              # root layout: fonts, SiteHeader/SiteFooter, metadata
│   ├── page.tsx                 # study index — entry point, not a dashboard
│   ├── globals.css              # light theme only, no dark: variants
│   └── studies/[slug]/page.tsx  # study detail page, one per study.studyId
├── components/
│   ├── site-header.tsx / site-footer.tsx
│   ├── num.tsx                   # monospace numeral, decimal-aligned, optional display rounding
│   ├── stat-cell.tsx             # renders a MeasurableRate / ClusterBootstrapAgreement cell
│   └── agreement-chart.tsx        # "use client" — horizontal bar + CI whiskers, per criterion
├── data/
│   └── studies/                  # one committed JSON export per completed study
├── schemas/
│   └── judge-study-export.schema.json   # JSON Schema the exports conform to
├── lib/
│   ├── studies.ts                 # build-time loader: reads + validates data/studies/*.json
│   ├── study-text.ts              # derives Method prose from a study's own fields
│   ├── display.ts                  # DISPLAY_DECIMALS — the one shared display-rounding constant
│   └── generated/                  # `npm run generate:types` output — gitignored, never hand-edit
├── public/
├── AGENTS.md                       # Next.js-version-specific agent instructions
└── CLAUDE.md                       # this file
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

- Every displayed number comes from the study JSON. Never compute a
  statistic that isn't already a field in the export — no derived
  metrics, no client-side math.
- Full precision from the JSON is the source of truth, always. Display
  rounding is allowed **only** where explicitly opted in via
  `<Num decimals={DISPLAY_DECIMALS} />` (`lib/display.ts` — currently
  3dp, used by the per-criterion results table and the self-agreement
  kappa table) — never silently, never as a one-off hardcoded number,
  and the underlying value is never mutated, only its rendered string.
  When in doubt, show full precision (bare `<Num value={...} />`).
- "not measurable" is a value, not missing data. Render it as the
  words "not measurable" with its reason. Never as 0, "—", "N/A",
  or a blank. This applies to charts too: a not-measurable criterion
  is a labelled gap (the reason rendered as text where the mark would
  be — see `components/agreement-chart.tsx`'s `BarOrGapShape`), never
  a zero-length bar and never silently dropped from the axis.
- Never show a point estimate without its confidence interval and n.
- `limitations` renders in full on the study page itself — never
  folded into the shared site `<footer>`, never collapsed or behind a
  toggle by default. Where it sits among the other sections can
  change (currently: last, after Consistency); that it's always fully
  visible cannot.
- If the JSON lacks a field a component wants, the component adapts.
  Do not invent placeholder data, ever. Method prose (`lib/study-text.ts`)
  is the one exception: it's assembled from existing fields as
  factual prose, not free text. Hypothesis has no source field at
  all — it renders "not provided by this export" until magent-lab's
  export adds one; don't write hypothesis text by hand.
- Numerals are monospace and decimal-aligned (`components/num.tsx`),
  everywhere a number is displayed.
- Non-obvious notation gets a plain-language caption next to it (e.g.
  what `[low, high]` means, what `n=` counts, what a split label like
  "4-1" means, what the No/Yes columns in class balance count). Prefer
  quoting the schema's own `description` strings where one exists.
- Static export only. No API routes, no server components fetching
  at runtime, no client-side data fetching.

## Design

Light theme only — no `dark:` variants, no `prefers-color-scheme`
handling. `app/globals.css` sets `color-scheme: light` explicitly.
This is a deliberate, revisit-before-changing decision, not an
oversight.

Typographic and minimal: no cards, no shadows, hairline borders only.

## Where this is headed

The index page is an entry point, not the destination — enough per
study (title, date, subject, n, status) to pick one, nothing more.
Depth belongs on the study page: hypothesis, method, dataset,
per-criterion results, consistency, and limitations are built. One
chart exists — majority-vote accuracy per criterion, horizontal bar
with CI whiskers (`components/agreement-chart.tsx`) — added
deliberately scoped to that one metric; sensitivity, specificity, and
cluster-bootstrap agreement are still table-only. Don't add more
charts speculatively — each one is a real design decision (see the
not-measurable handling above) and should be a deliberate ask, not a
drive-by addition. Still missing: a divergent-cell explorer for where
the judge disagreed with itself or with ground truth. Prefer adding
real depth to a study page over adding another summary column to the
index.

## Repo boundary

This repo is intentionally decoupled from magent-lab. Study JSON and
the JSON Schema are COPIED IN and committed, never read across repos.
Netlify builds this repo alone — a cross-repo read fails in CI.

Do not add a submodule, workspace link, or fetch step to magent-lab.
