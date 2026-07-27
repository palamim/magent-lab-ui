# Lab site — non-negotiable rules

@AGENTS.md

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
