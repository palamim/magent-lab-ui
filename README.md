# magent-lab-ui

The publication site for [magent-lab](https://github.com/palamim/magent-lab) studies — an evaluation
harness for LLM judges. [magent-lab](https://github.com/palamim/magent-lab) runs the studies (versioned
grading criteria, regression tests against labeled fixtures, agreement
measured against human labels); this repo renders the results:
per-criterion validity and consistency, confidence intervals, divergent
judge calls, and the exact data behind every number.

Static export, deployed to Netlify. No servers, no database, nothing
to keep running.

## How it works

1. magent-lab exports a completed study as JSON matching
   [`schemas/judge-study-export.schema.json`](schemas/judge-study-export.schema.json).
2. That JSON and the schema are copied into this repo and committed
   under [`data/studies/`](data/studies) — see [Repo boundary](#repo-boundary).
3. At build time: types are generated from the schema, every study
   JSON is validated against it, and the build fails if any study
   doesn't conform. See [CLAUDE.md](CLAUDE.md) for the full data flow
   and the correctness rules every component follows.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

- `npm run build` — static export to `out/`
- `npm run generate:types` — regenerate types from the JSON Schema;
  run manually after editing `schemas/judge-study-export.schema.json`
- `npm run lint`

## Repo boundary

This repo is intentionally decoupled from magent-lab. Study JSON and
the JSON Schema are copied in and committed here, never read across
repos — Netlify builds this repo alone, so a cross-repo read would
fail in CI. Do not add a submodule, workspace link, or fetch step to
magent-lab.

## Conventions

See [CLAUDE.md](CLAUDE.md) for the repository layout, tech stack, data
flow, and the non-negotiable rules for how study data is displayed.
