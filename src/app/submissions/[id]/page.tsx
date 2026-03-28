import { notFound } from "next/navigation";
import { RecommendationForm } from "@/components/recommendation-form";
import { ReviewForm } from "@/components/review-form";
import { getSubmissionById } from "@/lib/repository";

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function statusText(status: string) {
  return status.replaceAll("_", " ");
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getSubmissionById(id);

  if (!detail) {
    notFound();
  }

  const { submission, reviews, recommendation } = detail;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {submission.domain} · {statusText(submission.status)} · v{submission.version}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{submission.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-slate-700">{submission.abstract}</p>
        <p className="mt-4 text-sm text-slate-600">
          Author: {submission.authorName}
          {submission.authorOrcid ? ` (${submission.authorOrcid})` : ""}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ScorePill label="AI Novelty" value={submission.aiNovelty} />
          <ScorePill label="AI Rigor" value={submission.aiRigor} />
          <ScorePill
            label="AI Reproducibility"
            value={submission.aiReproducibility}
          />
          <ScorePill label="AI Translation" value={submission.aiTranslation} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Open Reviews ({reviews.length})</h2>
        <div className="mt-4 space-y-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">
                  {review.reviewerName} · {review.expertise}
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {review.reviewType}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{review.verdict}</p>
              <p className="mt-2 text-sm text-slate-600">{review.summary}</p>
              <p className="mt-3 text-xs text-slate-500">
                Novelty {review.novelty}/5 · Rigor {review.rigor}/5 · Repro{" "}
                {review.reproducibility}/5 · Impact {review.impact}/5
              </p>
            </article>
          ))}
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-600">No reviews yet.</p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReviewForm submissionId={submission.id} />
        <div className="space-y-4">
          {recommendation ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Current Label
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-800">
                {recommendation.label}
              </p>
              <p className="mt-2 text-sm text-emerald-900">{recommendation.rationale}</p>
              <p className="mt-2 text-xs text-emerald-700">
                By {recommendation.committeeName}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              No recommendation yet. Use the form below to set overlay status.
            </div>
          )}
          <RecommendationForm submissionId={submission.id} />
        </div>
      </section>
    </div>
  );
}
