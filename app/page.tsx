import Link from "next/link";
import { loadStudies, studySlug } from "@/lib/studies";

export default function Home() {
  const studies = loadStudies();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-black">
        Studies
      </h1>

      <table className="mt-10 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/20 text-left font-sans text-xs uppercase tracking-wide text-zinc-500">
            <th className="py-2 pr-4 font-medium">Study</th>
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Subject</th>
            <th className="py-2 pr-4 font-medium">Diffs</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {studies.map((study) => (
            <tr
              key={study.studyId}
              className="border-b border-black/10 align-top"
            >
              <td className="py-3 pr-4 font-mono text-xs">
                <Link
                  href={`/studies/${studySlug(study)}`}
                  className="text-black underline underline-offset-2 hover:no-underline"
                >
                  {study.studyId}
                </Link>
              </td>
              <td className="py-3 pr-4 text-zinc-700">{study.generatedAt}</td>
              <td className="py-3 pr-4 text-zinc-700">
                {study.subject.subjectKey}
              </td>
              <td className="py-3 pr-4 text-zinc-700">
                {study.dataset.nDiffs}
              </td>
              <td className="py-3 font-sans text-zinc-700">
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
    </>
  );
}
