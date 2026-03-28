"use server";

import { redirect } from "next/navigation";
import {
  createReview,
  createSubmission,
  upsertRecommendation,
} from "@/lib/repository";
import { RecommendationLabel, ReviewType } from "@/lib/types";

export type ActionState = { error?: string };

const initialState: ActionState = {};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readScore(formData: FormData, key: string) {
  const parsed = Number(readString(formData, key));
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    throw new Error(`${key} must be a value between 1 and 5.`);
  }
  return parsed;
}

export async function createSubmissionAction(
  prevState: ActionState = initialState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  try {
    const title = readString(formData, "title");
    const abstract = readString(formData, "abstract");
    const domain = readString(formData, "domain");
    const authorName = readString(formData, "authorName");
    const authorOrcid = readString(formData, "authorOrcid");

    if (!title || !abstract || !domain || !authorName) {
      return { error: "Please fill all required fields." };
    }

    const created = await createSubmission({
      title,
      abstract,
      domain,
      authorName,
      authorOrcid: authorOrcid || undefined,
    });

    redirect(`/submissions/${created.id}?created=1`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create submission.",
    };
  }
}

export async function createReviewAction(
  prevState: ActionState = initialState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  try {
    const submissionId = readString(formData, "submissionId");
    const reviewerName = readString(formData, "reviewerName");
    const expertise = readString(formData, "expertise");
    const reviewType = readString(formData, "reviewType") as ReviewType;
    const verdict = readString(formData, "verdict");
    const summary = readString(formData, "summary");

    if (!submissionId || !reviewerName || !expertise || !verdict || !summary) {
      return { error: "Please fill all required fields." };
    }
    if (reviewType !== "comment" && reviewType !== "formal") {
      return { error: "Invalid review type." };
    }

    await createReview({
      submissionId,
      reviewerName,
      expertise,
      reviewType,
      novelty: readScore(formData, "novelty"),
      rigor: readScore(formData, "rigor"),
      reproducibility: readScore(formData, "reproducibility"),
      impact: readScore(formData, "impact"),
      verdict,
      summary,
    });

    redirect(`/submissions/${submissionId}?reviewed=1`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create review.",
    };
  }
}

export async function upsertRecommendationAction(
  prevState: ActionState = initialState,
  formData: FormData
): Promise<ActionState> {
  void prevState;
  try {
    const submissionId = readString(formData, "submissionId");
    const committeeName = readString(formData, "committeeName");
    const label = readString(formData, "label") as RecommendationLabel;
    const rationale = readString(formData, "rationale");

    if (!submissionId || !committeeName || !rationale) {
      return { error: "Please fill all required fields." };
    }

    if (
      label !== "recommended" &&
      label !== "validated" &&
      label !== "major_concerns"
    ) {
      return { error: "Invalid recommendation label." };
    }

    await upsertRecommendation({
      submissionId,
      committeeName,
      label,
      rationale,
    });

    redirect(`/submissions/${submissionId}?recommended=1`);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update recommendation status.",
    };
  }
}
