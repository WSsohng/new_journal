import { Recommendation, Review, Submission } from "@/lib/types";

export const mockSubmissions: Submission[] = [
  {
    id: "s1",
    title:
      "Diffusion Model for Low-resource Clinical Signal Reconstruction with Public Audit Trails",
    abstract:
      "We propose a living-paper workflow where model updates are versioned and all review artifacts remain citable. The method focuses on noisy bedside signals and includes code-level reproducibility metadata.",
    domain: "Biomedical AI",
    status: "community_reviewed",
    version: 2,
    authorName: "Mina Park",
    authorOrcid: "0000-0002-1287-4421",
    aiNovelty: 78,
    aiRigor: 72,
    aiReproducibility: 84,
    aiTranslation: 81,
    createdAt: "2026-03-15T08:30:00.000Z",
    updatedAt: "2026-03-25T02:10:00.000Z",
  },
  {
    id: "s2",
    title:
      "Open Materials Graph for Fast Electrolyte Discovery: Claim-to-evidence Alignment Report",
    abstract:
      "This work introduces a graph-backed benchmark for electrolyte screening and includes machine-readable claim cards. The paper is connected to a transparent rebuttal and review timeline.",
    domain: "Materials Science",
    status: "recommended",
    version: 1,
    authorName: "Jiyoung Lee",
    aiNovelty: 86,
    aiRigor: 88,
    aiReproducibility: 67,
    aiTranslation: 90,
    createdAt: "2026-03-10T01:15:00.000Z",
    updatedAt: "2026-03-22T11:44:00.000Z",
  },
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    submissionId: "s1",
    reviewerName: "Dr. Han",
    expertise: "Clinical ML",
    reviewType: "formal",
    novelty: 4,
    rigor: 3,
    reproducibility: 5,
    impact: 4,
    verdict: "Promising with moderate methodological risk",
    summary:
      "Excellent transparency profile. Please expand failure analysis for edge-case arrhythmia windows.",
    createdAt: "2026-03-18T05:00:00.000Z",
  },
  {
    id: "r2",
    submissionId: "s1",
    reviewerName: "Sora Kim",
    expertise: "Signal Processing",
    reviewType: "comment",
    novelty: 4,
    rigor: 3,
    reproducibility: 4,
    impact: 3,
    verdict: "Needs additional baseline comparison",
    summary:
      "Would like to see one classic non-neural baseline and data split details clarified.",
    createdAt: "2026-03-19T10:20:00.000Z",
  },
  {
    id: "r3",
    submissionId: "s2",
    reviewerName: "Prof. Duarte",
    expertise: "Electrochemistry",
    reviewType: "formal",
    novelty: 5,
    rigor: 4,
    reproducibility: 3,
    impact: 5,
    verdict: "Strong recommend with code audit follow-up",
    summary:
      "High value for the field. Reproducibility score can improve once full preprocessing scripts are released.",
    createdAt: "2026-03-20T09:45:00.000Z",
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "rc1",
    submissionId: "s2",
    label: "recommended",
    rationale:
      "High consensus on practical impact and novelty with transparent limitations.",
    committeeName: "Energy Systems Recommenders",
    createdAt: "2026-03-23T03:00:00.000Z",
    updatedAt: "2026-03-23T03:00:00.000Z",
  },
];
