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
│   ├── rate-bar-chart.tsx         # "use client" — generic horizontal bar + CI whiskers, per criterion
│   └── figure.tsx                 # <Figure>/<TableCaption> — numbered, centered captions
├── data/
│   └── studies/                  # one committed JSON export per completed study
├── schemas/
│   └── judge-study-export.schema.json   # JSON Schema the exports conform to
├── lib/
│   ├── studies.ts                 # build-time loader: reads + validates data/studies/*.json
│   ├── chart-data.ts              # normalizes a validity metric into RateBarChart's row shape
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
  be — see `components/rate-bar-chart.tsx`'s `BarOrGapShape`), never
  a zero-length bar and never silently dropped from the axis.
- Never show a point estimate without its confidence interval and n.
- `limitations` renders in full on the study page itself — never
  folded into the shared site `<footer>`, never collapsed or behind a
  toggle by default. Where it sits among the other sections can
  change (currently: last, after Consistency); that it's always fully
  visible cannot.
- If the JSON lacks a field a component wants, the component adapts.
  Do not invent placeholder data, ever. `hypothesis` (array of claim
  strings) and `methodology` (prose) are authored by magent-lab and
  rendered as-is — the UI does not synthesize or reword them.
- Numerals are monospace and decimal-aligned (`components/num.tsx`),
  everywhere a number is displayed.
- Non-obvious notation gets a plain-language caption next to it (e.g.
  what `[low, high]` means, what `n=` counts, what a split label like
  "4-1" means, what the No/Yes columns in class balance count). Prefer
  quoting the schema's own `description` strings where one exists.
- Every table and figure is named and numbered — "Table N."/"Figure N."
  via `components/figure.tsx`, sequential in document order, captioned
  with what it shows and any figure-specific caveat. A caption that
  claims a precision/rounding behavior must match what the component
  actually does — cross-check `DISPLAY_DECIMALS` usage, don't assert
  "full precision" for anything rendered through `<Num decimals={...} />`.
- Static export only. No API routes, no server components fetching
  at runtime, no client-side data fetching.

## Design

Light theme only — no `dark:` variants, no `prefers-color-scheme`
handling. `app/globals.css` sets `color-scheme: light` explicitly.
This is a deliberate, revisit-before-changing decision, not an
oversight.

Typographic and minimal: no cards, no shadows, hairline borders only.

**Fonts** — a fixed three-family system, all loaded via `next/font/google`
in `app/layout.tsx` and wired to Tailwind's theme tokens in
`app/globals.css`: `--font-serif` (Source Serif 4) for body/long-form
copy — hypothesis, methodology, conclusions, limitations, replicate
reasoning — is the `<body>` default, no class needed. `--font-sans`
(Space Grotesk) is for headings and UI chrome — applied globally to
`h1`–`h6` via `@layer base`, and explicitly via `font-sans` on
non-heading chrome (nav, table `<thead>`, figure/table captions,
header, footer, byline). `--font-mono` (JetBrains Mono) is for
anything code-shaped — every numeral (`components/num.tsx`), diff
keys, chart axis ticks. When adding a new UI element, decide which of
the three it is before picking a class; don't leave it on the inherited
default without checking that's actually what it should be.

**Color** — still overwhelmingly zinc grayscale, but no longer
color-free: `--color-accent` and `--color-status-good` are defined in
`app/globals.css`'s `@theme inline` block. `--color-status-good` is
reserved for the index page's "completed" status dot
(`app/page.tsx`) — a status color, not a decoration; don't reuse it
for anything that isn't a state. Chart bars stay grayscale
(`fill="#d4d4d8"`) — color-coding a bar by its value would mean
inventing a threshold ("good"/"bad") that isn't in the export; see the
not-measurable handling below for why that's off the table. Any new
color use should be this deliberate and this narrow, not a general
license to add hue.

The study page reads as a research document, not a dashboard: a
numbered Contents nav up top linking to every numbered section, each
`<h2>` prefixed with its section number, and every table/figure named,
numbered, and captioned (see the correctness rules above). Figures
are centered in a narrower column than the full-width tables and
body text — that contrast is deliberate, it's what visually marks
something as a figure. The one exception is a `wide` figure (see
Figure 1 below) — pass `wide` to `<Figure>` when its content is itself
a multi-column grid that needs the full content width, not the
narrower centered column.

In `rate-bar-chart.tsx`, the CI whisker (`stroke="#18181b"`, near-black)
renders on top of the bar (Recharts paints `<ErrorBar>` after the bar
rectangles), but the whisker's near-side segment sits *inside* the
bar's horizontal extent. If the bar fill is the same near-black as the
whisker, that segment reads as invisible — same color painted over
itself. The bar must stay a visibly lighter gray (`fill="#d4d4d8"`)
so the whisker is legible on both sides of the point estimate, not
just where it extends past the bar into open space.

**magent-lab vs. magent-lab-ui** — the footer (`components/site-footer.tsx`)
is the one place that explains the split: studies run in
[magent-lab](https://github.com/palamim/magent-lab) (the evaluation
harness), this repo only holds the committed export, the schema, and
the UI. Don't blur that distinction elsewhere. The study page itself
additionally links to magent-lab directly (under the byline, "Run in
magent-lab") so a reader doesn't have to reach the footer to find
where an experiment actually ran.

## Where this is headed

The index page is an entry point, not the destination — enough per
study (title, date, subject, n, status) to pick one, nothing more.
Depth belongs on the study page: hypothesis, method, dataset (Table 1),
per-criterion results (Figure 1 plus Table 2), consistency (Figures
2–3 plus Table 3), a divergent-cell explorer, conclusions, and
limitations are built, numbered, and cross-linked via the Contents nav.
Figure 1 is a `wide` figure: a 2×2 grid (`ChartPanel` from
`components/figure.tsx`) of all four validity metrics — majority-vote
accuracy, sensitivity, specificity, cluster-bootstrap agreement — each
panel its own titled horizontal bar with CI whiskers, built on the
shared `components/rate-bar-chart.tsx` + `lib/chart-data.ts`, one
shared figure caption underneath instead of four separate ones. Figures
2–3 cover consistency: a split-histogram column chart
(`components/split-histogram-chart.tsx`) and a zero-baseline kappa bar
chart (`components/kappa-bar-chart.tsx`, no whiskers — kappa has no CI
in the schema). Both rate and kappa bars share label-wrapping, the
not-measurable/degenerate gap treatment, and the bar shape via
`components/chart-primitives.tsx` — extend that file rather than
re-forking the logic into a third chart. Don't add more charts
speculatively — each one is a real design decision (see the
not-measurable handling above) and should be a deliberate ask, not a
drive-by addition. `components/divergent-cells.tsx` renders every
non-unanimous (diff, criterion) cell — grouped by criterion (order from
`lib/divergent-cells.ts`'s `groupDivergentCells`), one collapsed native
`<details>` per cell, replicates numbered [1]–[5] inside. Collapsed by
default is deliberate — unlike `limitations`, nothing pins this section
open; the whole point is browse-then-drill-in, not a wall of reasoning
text. A replicate whose `actual` differs from the cell's `groundTruth`
is marked in bold type weight, not color — see Color above on why bar
color-coding is off the table; a per-replicate flag reads differently
(it's a direct field comparison, not an invented threshold) but still
defaults to weight over hue here for consistency with the rest of the
page. Prefer adding real depth to a study page over adding another
summary column to the index.

## Repo boundary

This repo is intentionally decoupled from magent-lab. Study JSON and
the JSON Schema are COPIED IN and committed, never read across repos.
Netlify builds this repo alone — a cross-repo read fails in CI.

Do not add a submodule, workspace link, or fetch step to magent-lab.
