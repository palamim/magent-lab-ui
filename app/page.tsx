import { loadStudies } from "@/lib/studies";

export default function Home() {
  const studies = loadStudies();

  return (
    <div className="flex flex-1 justify-center bg-white dark:bg-black">
      <main className="w-full max-w-3xl px-6 py-16 sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Studies
        </h1>

        <table className="mt-10 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/20 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-white/20 dark:text-zinc-400">
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
                className="border-b border-black/10 align-top dark:border-white/10"
              >
                <td className="py-3 pr-4 font-mono text-xs text-black dark:text-zinc-50">
                  {study.studyId}
                </td>
                <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                  {study.generatedAt}
                </td>
                <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                  {study.subject.subjectKey}
                </td>
                <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                  {study.dataset.nDiffs}
                </td>
                <td className="py-3 text-zinc-700 dark:text-zinc-300">
                  completed
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
