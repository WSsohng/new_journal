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
    <div className="nature-card rounded-sm p-4">
      <p className="nature-kicker">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[#222]">{value}</p>
      <p className="mt-1 text-xs text-[var(--nature-muted)]">{hint}</p>
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    moderation: "bg-[#f3f3f3] text-[#444]",
    community_reviewed: "bg-[#ebf6ff] text-[#1a5a96]",
    expert_reviewed: "bg-[#f1eefc] text-[#4a3f8a]",
    recommended: "bg-[#ebf9ee] text-[#166534]",
    validated: "bg-[#e8f7f6] text-[#0f766e]",
  };
  return map[status] ?? "bg-[#f3f3f3] text-[#444]";
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
      <section className="nature-card border-t-4 border-t-[var(--nature-blue)] p-6">
        <p className="nature-kicker">
          AI-native Reviewed Preprint Platform
        </p>
        <h1 className="mt-4 text-4xl text-[#222] sm:text-5xl">
          Open submission first, trust layer second, overlay journal last.
        </h1>
        <p className="mt-3 max-w-3xl text-[17px] leading-7 text-[#404040]">
          TrustLayer combines open repository publishing, structured community review,
          AI evidence scoring, and selective human recommendation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/submissions/new"
            className="nature-button-primary rounded-sm px-4 py-2 text-sm font-semibold no-underline"
          >
            Submit Preprint
          </Link>
          <Link
            href="/submissions"
            className="nature-button-secondary rounded-sm px-4 py-2 text-sm font-semibold no-underline"
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

      <section className="nature-card rounded-sm p-6">
        <div className="mb-4 flex items-center justify-between gap-4 border-b nature-divider pb-3">
          <h2 className="text-3xl text-[#222]">Latest Activity</h2>
          <Link href="/submissions" className="text-sm font-semibold no-underline">
            View all
          </Link>
        </div>
        <div className="divide-y nature-divider">
          {submissions.slice(0, 5).map((submission) => (
            <Link
              key={submission.id}
              href={`/submissions/${submission.id}`}
              className="block py-4 no-underline"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xl text-[#222]">{submission.title}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                    submission.status
                  )}`}
                >
                  {submission.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#4a4a4a]">
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
