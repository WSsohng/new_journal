import { mockRecommendations, mockReviews, mockSubmissions } from "@/lib/mock-data";
import { getSupabaseClient } from "@/lib/supabase";
import {
  Recommendation,
  RecommendationLabel,
  Review,
  ReviewType,
  Submission,
  SubmissionStatus,
  SubmissionSummary,
} from "@/lib/types";

type CreateSubmissionInput = {
  title: string;
  abstract: string;
  domain: string;
  authorName: string;
  authorOrcid?: string;
};

type CreateReviewInput = {
  submissionId: string;
  reviewerName: string;
  expertise: string;
  reviewType: ReviewType;
  novelty: number;
  rigor: number;
  reproducibility: number;
  impact: number;
  verdict: string;
  summary: string;
};

type UpsertRecommendationInput = {
  submissionId: string;
  label: RecommendationLabel;
  rationale: string;
  committeeName: string;
};

type SubmissionRow = {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  status: SubmissionStatus;
  version: number;
  author_name: string;
  author_orcid: string | null;
  ai_novelty: number;
  ai_rigor: number;
  ai_reproducibility: number;
  ai_translation: number;
  created_at: string;
  updated_at: string;
};

type ReviewRow = {
  id: string;
  submission_id: string;
  reviewer_name: string;
  expertise: string;
  review_type: ReviewType;
  novelty: number;
  rigor: number;
  reproducibility: number;
  impact: number;
  verdict: string;
  summary: string;
  created_at: string;
};

type RecommendationRow = {
  id: string;
  submission_id: string;
  label: RecommendationLabel;
  rationale: string;
  committee_name: string;
  created_at: string;
  updated_at: string;
};

function ensureSupabaseConfigured() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return supabase;
}

function mapSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    title: row.title,
    abstract: row.abstract,
    domain: row.domain,
    status: row.status,
    version: row.version,
    authorName: row.author_name,
    authorOrcid: row.author_orcid ?? undefined,
    aiNovelty: row.ai_novelty,
    aiRigor: row.ai_rigor,
    aiReproducibility: row.ai_reproducibility,
    aiTranslation: row.ai_translation,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    submissionId: row.submission_id,
    reviewerName: row.reviewer_name,
    expertise: row.expertise,
    reviewType: row.review_type,
    novelty: row.novelty,
    rigor: row.rigor,
    reproducibility: row.reproducibility,
    impact: row.impact,
    verdict: row.verdict,
    summary: row.summary,
    createdAt: row.created_at,
  };
}

function mapRecommendation(row: RecommendationRow): Recommendation {
  return {
    id: row.id,
    submissionId: row.submission_id,
    label: row.label,
    rationale: row.rationale,
    committeeName: row.committee_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function withMockSummary(submissions: Submission[]): SubmissionSummary[] {
  return submissions.map((submission) => {
    const relatedReviews = mockReviews.filter(
      (review) => review.submissionId === submission.id
    );
    const recommendation = mockRecommendations.find(
      (rec) => rec.submissionId === submission.id
    );
    return {
      ...submission,
      reviewCount: relatedReviews.length,
      formalReviewCount: relatedReviews.filter((r) => r.reviewType === "formal")
        .length,
      recommendationLabel: recommendation?.label,
    };
  });
}

export async function listSubmissions(): Promise<SubmissionSummary[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return withMockSummary(mockSubmissions);
  }

  const [{ data: submissionRows, error: submissionError }, { data: reviewRows }, { data: recommendationRows }] =
    await Promise.all([
      supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("reviews").select("submission_id, review_type"),
      supabase.from("recommendations").select("submission_id, label"),
    ]);

  if (submissionError) {
    throw new Error(submissionError.message);
  }

  const reviewCountMap = new Map<string, { total: number; formal: number }>();
  ((reviewRows as Array<Pick<ReviewRow, "submission_id" | "review_type">>) ?? []).forEach(
    (row) => {
      const prev = reviewCountMap.get(row.submission_id) ?? { total: 0, formal: 0 };
      reviewCountMap.set(row.submission_id, {
        total: prev.total + 1,
        formal: prev.formal + (row.review_type === "formal" ? 1 : 0),
      });
    }
  );

  const recommendationMap = new Map<string, RecommendationLabel>();
  ((recommendationRows as Array<Pick<RecommendationRow, "submission_id" | "label">>) ?? []).forEach(
    (row) => recommendationMap.set(row.submission_id, row.label)
  );

  return ((submissionRows as SubmissionRow[]) ?? []).map((row) => {
    const mapped = mapSubmission(row);
    const counts = reviewCountMap.get(row.id) ?? { total: 0, formal: 0 };
    return {
      ...mapped,
      reviewCount: counts.total,
      formalReviewCount: counts.formal,
      recommendationLabel: recommendationMap.get(row.id),
    };
  });
}

export async function getSubmissionById(
  id: string
): Promise<{ submission: Submission; reviews: Review[]; recommendation?: Recommendation } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const submission = mockSubmissions.find((item) => item.id === id);
    if (!submission) {
      return null;
    }
    return {
      submission,
      reviews: mockReviews.filter((item) => item.submissionId === id),
      recommendation: mockRecommendations.find((item) => item.submissionId === id),
    };
  }

  const [{ data: submissionRow, error: submissionError }, { data: reviewRows, error: reviewError }, { data: recommendationRow, error: recommendationError }] =
    await Promise.all([
      supabase.from("submissions").select("*").eq("id", id).single(),
      supabase
        .from("reviews")
        .select("*")
        .eq("submission_id", id)
        .order("created_at", { ascending: false }),
      supabase.from("recommendations").select("*").eq("submission_id", id).maybeSingle(),
    ]);

  if (submissionError) {
    if (submissionError.code === "PGRST116") {
      return null;
    }
    throw new Error(submissionError.message);
  }
  if (reviewError) {
    throw new Error(reviewError.message);
  }
  if (recommendationError) {
    throw new Error(recommendationError.message);
  }

  return {
    submission: mapSubmission(submissionRow as SubmissionRow),
    reviews: ((reviewRows as ReviewRow[]) ?? []).map(mapReview),
    recommendation: recommendationRow
      ? mapRecommendation(recommendationRow as RecommendationRow)
      : undefined,
  };
}

export async function createSubmission(input: CreateSubmissionInput): Promise<Submission> {
  const supabase = ensureSupabaseConfigured();

  const now = new Date().toISOString();
  const aiNovelty = Math.min(
    95,
    55 + Math.floor((input.title.length + input.abstract.length) % 40)
  );
  const aiRigor = Math.min(92, 45 + Math.floor(input.abstract.length % 48));
  const aiReproducibility = Math.min(
    90,
    50 + Math.floor((input.abstract.match(/code|data|protocol/gi)?.length ?? 0) * 12)
  );
  const aiTranslation = Math.min(
    90,
    45 + Math.floor((input.domain.length + input.title.split(" ").length) % 50)
  );

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      title: input.title,
      abstract: input.abstract,
      domain: input.domain,
      status: "moderation",
      version: 1,
      author_name: input.authorName,
      author_orcid: input.authorOrcid || null,
      ai_novelty: aiNovelty,
      ai_rigor: aiRigor,
      ai_reproducibility: aiReproducibility,
      ai_translation: aiTranslation,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSubmission(data as SubmissionRow);
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const supabase = ensureSupabaseConfigured();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      submission_id: input.submissionId,
      reviewer_name: input.reviewerName,
      expertise: input.expertise,
      review_type: input.reviewType,
      novelty: input.novelty,
      rigor: input.rigor,
      reproducibility: input.reproducibility,
      impact: input.impact,
      verdict: input.verdict,
      summary: input.summary,
      created_at: now,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapReview(data as ReviewRow);
}

export async function upsertRecommendation(
  input: UpsertRecommendationInput
): Promise<Recommendation> {
  const supabase = ensureSupabaseConfigured();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("recommendations")
    .upsert(
      {
        submission_id: input.submissionId,
        label: input.label,
        rationale: input.rationale,
        committee_name: input.committeeName,
        updated_at: now,
      },
      { onConflict: "submission_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const targetStatus: SubmissionStatus =
    input.label === "validated"
      ? "validated"
      : input.label === "recommended"
      ? "recommended"
      : "expert_reviewed";

  const { error: updateError } = await supabase
    .from("submissions")
    .update({ status: targetStatus, updated_at: now })
    .eq("id", input.submissionId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return mapRecommendation(data as RecommendationRow);
}
