import { notFound } from "next/navigation";
import { RecommendationForm } from "@/components/recommendation-form";
import { ReviewForm } from "@/components/review-form";
import { getSubmissionById } from "@/lib/repository";

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="nature-card rounded-sm bg-[#f9fcff] px-3 py-2">
      <p className="nature-kicker">
        {label}
      </p>
      <p className="text-lg font-semibold text-[#222]">{value}</p>
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
      <section className="nature-card border-t-4 border-t-[var(--nature-blue)] p-6">
        <p className="nature-kicker">
          {submission.domain} · {statusText(submission.status)} · v{submission.version}
        </p>
        <h1 className="mt-2 text-4xl text-[#222]">{submission.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-[16px] leading-7 text-[#444]">{submission.abstract}</p>
        <p className="mt-4 text-sm text-[#666]">
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

      <section className="nature-card p-6">
        <h2 className="text-3xl text-[#222]">Open Reviews ({reviews.length})</h2>
        <div className="mt-4 space-y-3">
          {reviews.map((review) => (
            <article key={review.id} className="nature-card rounded-sm p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#222]">
                  {review.reviewerName} · {review.expertise}
                </p>
                <span className="rounded-full bg-[#f3f3f3] px-2.5 py-1 text-xs font-semibold text-[#4a4a4a]">
                  {review.reviewType}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#3f3f3f]">{review.verdict}</p>
              <p className="mt-2 text-sm text-[#575757]">{review.summary}</p>
              <p className="mt-3 text-xs text-[#6d6d6d]">
                Novelty {review.novelty}/5 · Rigor {review.rigor}/5 · Repro{" "}
                {review.reproducibility}/5 · Impact {review.impact}/5
              </p>
            </article>
          ))}
          {reviews.length === 0 ? (
            <p className="text-sm text-[#666]">No reviews yet.</p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ReviewForm submissionId={submission.id} />
        <div className="space-y-4">
          {recommendation ? (
            <div className="nature-card rounded-sm border-l-4 border-l-[#1a5a96] bg-[var(--nature-tint)] p-5">
              <p className="nature-kicker text-[#1a5a96]">
                Current Label
              </p>
              <p className="mt-2 text-lg font-semibold text-[#1d4f7f]">
                {recommendation.label}
              </p>
              <p className="mt-2 text-sm text-[#1f4d78]">{recommendation.rationale}</p>
              <p className="mt-2 text-xs text-[#2b5f8f]">
                By {recommendation.committeeName}
              </p>
            </div>
          ) : (
            <div className="nature-card rounded-sm p-5 text-sm text-[#666]">
              No recommendation yet. Use the form below to set overlay status.
            </div>
          )}
          <RecommendationForm submissionId={submission.id} />
        </div>
      </section>
    </div>
  );
}
