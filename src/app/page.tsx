import { listSubmissions } from "@/lib/repository";
import Link from "next/link";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{hint}</p>
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    moderation: "bg-slate-100 text-slate-700",
    community_reviewed: "bg-blue-100 text-blue-700",
    expert_reviewed: "bg-indigo-100 text-indigo-700",
    recommended: "bg-emerald-100 text-emerald-700",
    validated: "bg-teal-100 text-teal-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-700";
}

export default async function Home() {
  const submissions = await listSubmissions();
  const recommendedCount = submissions.filter(
    (item) => item.status === "recommended" || item.status === "validated"
  ).length;
  const formalReviews = submissions.reduce(
    (sum, item) => sum + item.formalReviewCount,
    0
  );

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          AI-native Reviewed Preprint Platform
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Open submission first, trust layer second, overlay journal last.
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          TrustLayer combines open repository publishing, structured community review,
          AI evidence scoring, and selective human recommendation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/submissions/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Submit Preprint
          </Link>
          <Link
            href="/submissions"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Explore Submissions
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Preprints"
          value={String(submissions.length)}
          hint="Living records with version traceability"
        />
        <StatCard
          label="Formal Reviews"
          value={String(formalReviews)}
          hint="Structured review objects, not just comments"
        />
        <StatCard
          label="Recommended/Validated"
          value={String(recommendedCount)}
          hint="Selective human certification layer"
        />
        <StatCard
          label="Avg AI Novelty"
          value={
            submissions.length
              ? String(
                  Math.round(
                    submissions.reduce((sum, item) => sum + item.aiNovelty, 0) /
                      submissions.length
                  )
                )
              : "0"
          }
          hint="Decision support score, not final judgment"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Latest Activity</h2>
          <Link href="/submissions" className="text-sm font-medium text-slate-700">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {submissions.slice(0, 5).map((submission) => (
            <Link
              key={submission.id}
              href={`/submissions/${submission.id}`}
              className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-400"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{submission.title}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                    submission.status
                  )}`}
                >
                  {submission.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {submission.domain} · v{submission.version} · {submission.reviewCount} reviews
              </p>
            </Link>
          ))}
          {submissions.length === 0 ? (
            <p className="text-sm text-slate-600">No submissions yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
