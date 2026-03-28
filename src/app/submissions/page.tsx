import { listSubmissions } from "@/lib/repository";
import Link from "next/link";

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function SubmissionsPage() {
  const submissions = await listSubmissions();

  return (
    <div className="space-y-6">
      <div className="nature-card border-t-4 border-t-[var(--nature-blue)] p-6">
        <div>
          <p className="nature-kicker">Explore content</p>
          <h1 className="mt-2 text-4xl text-[#222]">All Submissions</h1>
          <p className="mt-2 text-[16px] text-[#474747]">
            Repository layer with AI evidence and open review metadata.
          </p>
        </div>
        <Link
          href="/submissions/new"
          className="nature-button-primary mt-4 inline-block rounded-sm px-4 py-2 text-sm font-semibold no-underline"
        >
          New Submission
        </Link>
      </div>

      <div className="nature-card overflow-hidden rounded-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#f7f7f7] text-[#525252]">
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
              <tr key={submission.id} className="border-t nature-divider">
                <td className="px-4 py-3">
                  <Link
                    href={`/submissions/${submission.id}`}
                    className="font-medium text-[#222] no-underline hover:underline"
                  >
                    {submission.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#444]">{submission.domain}</td>
                <td className="px-4 py-3 text-[#444]">
                  {statusLabel(submission.status)}
                </td>
                <td className="px-4 py-3 text-[#444]">{submission.aiNovelty}</td>
                <td className="px-4 py-3 text-[#444]">
                  {submission.formalReviewCount}
                </td>
              </tr>
            ))}
            {submissions.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-[#666]" colSpan={5}>
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
