export type SubmissionStatus =
  | "moderation"
  | "community_reviewed"
  | "expert_reviewed"
  | "recommended"
  | "validated";

export type RecommendationLabel =
  | "recommended"
  | "validated"
  | "major_concerns";

export type ReviewType = "comment" | "formal";

export type Submission = {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  status: SubmissionStatus;
  version: number;
  authorName: string;
  authorOrcid?: string;
  aiNovelty: number;
  aiRigor: number;
  aiReproducibility: number;
  aiTranslation: number;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
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
  createdAt: string;
};

export type Recommendation = {
  id: string;
  submissionId: string;
  label: RecommendationLabel;
  rationale: string;
  committeeName: string;
  createdAt: string;
  updatedAt: string;
};

export type SubmissionSummary = Submission & {
  reviewCount: number;
  formalReviewCount: number;
  recommendationLabel?: RecommendationLabel;
};
