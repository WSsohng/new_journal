import { listSubmissions } from "@/lib/repository";
import Link from "next/link";

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function SubmissionsPage() {
  const submissions = await listSubmissions();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Submissions</h1>
          <p className="mt-1 text-sm text-slate-600">
            Repository layer with AI evidence and open review metadata.
          </p>
        </div>
        <Link
          href="/submissions/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          New Submission
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Domain</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">AI Novelty</th>
              <th className="px-4 py-3 font-semibold">Formal Reviews</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <Link
                    href={`/submissions/${submission.id}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {submission.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{submission.domain}</td>
                <td className="px-4 py-3 text-slate-700">
                  {statusLabel(submission.status)}
                </td>
                <td className="px-4 py-3 text-slate-700">{submission.aiNovelty}</td>
                <td className="px-4 py-3 text-slate-700">
                  {submission.formalReviewCount}
                </td>
              </tr>
            ))}
            {submissions.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-slate-600" colSpan={5}>
                  No submissions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
