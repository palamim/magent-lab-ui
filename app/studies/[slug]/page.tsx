import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStudy, loadStudies, studySlug } from "@/lib/studies";
import { DISPLAY_DECIMALS } from "@/lib/display";
import {
  clusterBootstrapRows,
  kappaRows,
  majorityVoteAccuracyRows,
  sensitivityRows,
  specificityRows,
  splitHistogramRows,
} from "@/lib/chart-data";
import { Num } from "@/components/num";
import { MeasurableRateCell, ClusterBootstrapCell } from "@/components/stat-cell";
import { RateBarChart } from "@/components/rate-bar-chart";
import { SplitHistogramChart } from "@/components/split-histogram-chart";
import { KappaBarChart } from "@/components/kappa-bar-chart";
import { DivergentCellsExplorer } from "@/components/divergent-cells";
import { groupDivergentCells } from "@/lib/divergent-cells";
import { Figure, ChartPanel, TableCaption } from "@/components/figure";
import { ExternalLink } from "@/components/external-link";

export function generateStaticParams() {
  return loadStudies().map((study) => ({ slug: studySlug(study) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  return { title: study ? study.studyId : "Study not found" };
}

const CONTENTS = [
  { id: "hypothesis", label: "Hypothesis" },
  { id: "method", label: "Method" },
  { id: "dataset", label: "Dataset" },
  { id: "results", label: "Per-criterion results" },
  { id: "consistency", label: "Consistency" },
  { id: "divergent-cells", label: "Divergent cells" },
  { id: "conclusions", label: "Conclusions" },
  { id: "limitations", label: "Limitations" },
];

export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getStudy(slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      <Link
        href="/"
        className="font-sans text-xs text-zinc-500 hover:text-black"
      >
        ← Studies
      </Link>

      <h1 className="mt-4 font-mono text-xl font-semibold tracking-tight text-black">
        {study.studyId}
      </h1>
      <p className="mt-1 font-sans text-xs text-zinc-500">
        {study.generatedAt} · {study.subject.subjectKey} ({study.subject.model})
      </p>
      <p className="mt-1 font-sans text-xs text-zinc-500">
        Run in{" "}
        <ExternalLink
          href="https://github.com/palamim/magent-lab"
          className="underline underline-offset-2 hover:text-black"
        >
          magent-lab
        </ExternalLink>
      </p>

      <nav aria-label="Contents" className="mt-8 border-y border-black/10 py-4 font-sans">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Contents
        </p>
        <ol className="mt-2 space-y-1 text-sm text-zinc-700">
          {CONTENTS.map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="hover:underline">
                {i + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="hypothesis" className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          1. Hypothesis
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-800">
          {study.hypothesis.map((claim, i) => (
            <li key={i}>{claim}</li>
          ))}
        </ul>
      </section>

      <section id="method" className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          2. Method
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-800">
          {study.methodology}
        </p>
      </section>

      <section id="dataset" className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          3. Dataset
        </h2>
        <dl className="mt-3 flex gap-8 text-sm">
          <div>
            <dt className="font-sans text-xs text-zinc-500">Diffs</dt>
            <dd className="font-mono">
              <Num value={study.dataset.nDiffs} />
            </dd>
          </div>
          <div>
            <dt className="font-sans text-xs text-zinc-500">
              Replicates per diff
            </dt>
            <dd className="font-mono">
              <Num value={study.dataset.replicatesPerDiff} />
            </dd>
          </div>
        </dl>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/20 text-left font-sans text-xs uppercase tracking-wide text-zinc-500">
              <th className="py-2 pr-4 font-medium">Criterion</th>
              <th className="py-2 pr-4 font-medium">No</th>
              <th className="py-2 font-medium">Yes</th>
            </tr>
          </thead>
          <tbody>
            {study.dataset.classBalance.map((entry) => (
              <tr key={entry.criterion} className="border-b border-black/10">
                <td className="py-2 pr-4">{entry.criterion}</td>
                <td className="py-2 pr-4">
                  <Num value={entry.noCount} />
                </td>
                <td className="py-2">
                  <Num value={entry.yesCount} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2">
          <TableCaption
            number={1}
            title="Class balance, by criterion"
            note={
              <>
                No / Yes are the number of diffs whose expected
                (ground-truth) label is &quot;no&quot; or &quot;yes&quot; for
                that criterion — not the judge&apos;s output
              </>
            }
          />
        </div>
      </section>

      <section id="results" className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          4. Per-criterion results
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-800">
          Bars are the point estimate; whiskers are the confidence interval.
          A criterion with no bar is not measurable — the reason is labelled
          in its place, not shown as a zero-length bar. The table below (
          <a href="#table-2" className="underline underline-offset-2">
            Table 2
          </a>
          ) gives the exact figures behind every bar — the study export has
          full precision.
        </p>

        <Figure
          number={1}
          title="Per-criterion validity, by metric"
          note={<>all four share the same 0–1 scale and criterion order</>}
          wide
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <ChartPanel title="Majority-vote accuracy">
              <RateBarChart rows={majorityVoteAccuracyRows(study.validity.perCriterion)} />
            </ChartPanel>
            <ChartPanel
              title="Sensitivity"
              note={<>recall on expected-&quot;no&quot; (violation) diffs</>}
            >
              <RateBarChart rows={sensitivityRows(study.validity.perCriterion)} />
            </ChartPanel>
            <ChartPanel
              title="Specificity"
              note={<>recall on expected-&quot;yes&quot; (compliant) diffs</>}
            >
              <RateBarChart rows={specificityRows(study.validity.perCriterion)} />
            </ChartPanel>
            <ChartPanel
              title="Cluster-bootstrap agreement"
              note={<>treats replicates within a diff as clustered</>}
            >
              <RateBarChart rows={clusterBootstrapRows(study.validity.perCriterion)} />
            </ChartPanel>
          </div>
        </Figure>

        <div id="table-2" className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/20 text-left font-sans text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-2 pr-4 font-medium">Criterion</th>
                <th className="py-2 pr-4 font-medium">
                  Majority-vote accuracy
                </th>
                <th className="py-2 pr-4 font-medium">Sensitivity</th>
                <th className="py-2 pr-4 font-medium">Specificity</th>
                <th className="py-2 font-medium">
                  Cluster-bootstrap agreement
                </th>
              </tr>
            </thead>
            <tbody>
              {study.validity.perCriterion.map((row) => (
                <tr
                  key={row.criterion}
                  className="border-b border-black/10 align-top"
                >
                  <td className="py-3 pr-4">{row.criterion}</td>
                  <td className="py-3 pr-4">
                    <MeasurableRateCell rate={row.majorityVoteAccuracy} />
                  </td>
                  <td className="py-3 pr-4">
                    <MeasurableRateCell rate={row.sensitivity} />
                  </td>
                  <td className="py-3 pr-4">
                    <MeasurableRateCell rate={row.specificity} />
                  </td>
                  <td className="py-3">
                    <ClusterBootstrapCell agreement={row.clusterBootstrapAgreement} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <TableCaption
            number={2}
            title="Per-criterion results"
            note={
              <>
                Underlies all four panels of Figure 1. Each cell: point
                estimate, confidence interval in brackets, and n — the diffs
                it&apos;s computed over (nClusters for cluster-bootstrap
                agreement). Both this table and Figure 1 round to{" "}
                {DISPLAY_DECIMALS} decimal places for display; see the study
                export for full precision
              </>
            }
          />
        </div>
      </section>

      <section id="consistency" className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          5. Consistency
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-800">
          Each labeled diff was judged {study.dataset.replicatesPerDiff}{" "}
          times; a split label is the majority-minority breakdown of those
          replicate calls for a (diff, criterion) cell — e.g. &quot;4-1&quot;
          means 4 replicates agreed and 1 diverged.
        </p>

        <Figure
          number={2}
          title="Split histogram, across all (diff, criterion) cells"
          note={<>a &quot;5-0&quot; cell was unanimous; anything else split</>}
        >
          <SplitHistogramChart rows={splitHistogramRows(study.consistency.splitHistogram)} />
        </Figure>

        <Figure
          number={3}
          title="Self-agreement (kappa), by criterion"
          note={
            <>
              -1 marks perfect disagreement, 0 chance-level agreement, 1
              perfect agreement; a criterion with no bar has a degenerate
              marginal — the reason is labelled in its place
            </>
          }
        >
          <KappaBarChart rows={kappaRows(study.consistency.perCriterion)} />
        </Figure>

        <table className="mt-10 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/20 text-left font-sans text-xs uppercase tracking-wide text-zinc-500">
              <th className="py-2 pr-4 font-medium">Criterion</th>
              <th className="py-2 font-medium">Self-agreement (kappa)</th>
            </tr>
          </thead>
          <tbody>
            {study.consistency.perCriterion.map((row) => (
              <tr key={row.criterion} className="border-b border-black/10">
                <td className="py-2 pr-4">{row.criterion}</td>
                <td className="py-2">
                  {row.selfAgreementKappa === null ? (
                    <span className="text-xs text-zinc-600">
                      {row.reason}
                    </span>
                  ) : (
                    <Num
                      value={row.selfAgreementKappa}
                      decimals={DISPLAY_DECIMALS}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2">
          <TableCaption
            number={3}
            title="Self-agreement (kappa), by criterion"
            note={
              <>
                Underlies Figure 3. Chance-corrects the judge&apos;s
                replicate calls against its own marginal distribution for
                that criterion — a relative signal across criteria, not an
                absolute one; see{" "}
                <a href="#limitations" className="underline underline-offset-2">
                  Limitations
                </a>
                . Rounded to {DISPLAY_DECIMALS} decimal places for display
              </>
            }
          />
        </div>

        <p className="mt-6 text-sm leading-6 text-zinc-800">
          See{" "}
          <a href="#divergent-cells" className="underline underline-offset-2">
            § 6 Divergent cells
          </a>{" "}
          for the individual replicate reasoning behind these splits.
        </p>
      </section>

      <section id="divergent-cells" className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          6. Divergent cells
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-800">
          Every (diff, criterion) cell whose 5 replicates were{" "}
          <em>not</em> unanimous — unanimous (&quot;5-0&quot;) cells are
          excluded, so this is exactly the set of cells behind Figure 2&apos;s
          non-&quot;5-0&quot; bars. Grouped by criterion, in the same order as
          the figures above. Replicates are numbered [1]–[5] in the order
          stored, which is inferred from creation time, not an explicit
          index — see{" "}
          <a href="#limitations" className="underline underline-offset-2">
            Limitations
          </a>
          ; only that numbering, not any reported statistic, depends on it.
          A replicate whose answer diverges from the cell&apos;s expected
          (ground-truth) label is marked.
        </p>
        <DivergentCellsExplorer
          groups={groupDivergentCells(
            study.divergentCells,
            study.validity.perCriterion.map((row) => row.criterion),
          )}
        />
      </section>

      <section id="conclusions" className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          7. Conclusions
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-800">
          {study.conclusions.map((conclusion, i) => (
            <li key={i}>{conclusion}</li>
          ))}
        </ul>
      </section>

      <section id="limitations" className="mt-10 mb-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          8. Limitations
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-800">
          {study.limitations.map((limitation, i) => (
            <li key={i}>{limitation}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
