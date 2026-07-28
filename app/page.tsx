import Link from "next/link";
import { loadStudies, studySlug } from "@/lib/studies";

export default function Home() {
  const studies = loadStudies();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-black">
        Studies
      </h1>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10">
        <table className="text-sm">
          <thead>
            <tr className="text-left font-sans text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2 font-medium">Study</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Subject</th>
              <th className="px-4 py-2 font-medium">Diffs</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((study) => (
              <tr key={study.studyId} className="align-top">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link
                    href={`/studies/${studySlug(study)}`}
                    className="text-black underline underline-offset-2 hover:no-underline"
                  >
                    {study.studyId}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {study.generatedAt}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {study.subject.subjectKey}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {study.dataset.nDiffs}
                </td>
                <td className="px-4 py-3 font-sans text-zinc-700">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="inline-block size-1.5 rounded-full bg-status-good"
                    />
                    completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
