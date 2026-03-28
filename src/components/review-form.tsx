"use client";

import { useActionState } from "react";
import { ActionState, createReviewAction } from "@/app/actions";
import { FormSubmitButton } from "@/components/form-submit-button";

const initialState: ActionState = {};

type Props = {
  submissionId: string;
};

function ScoreField({ name, label }: { name: string; label: string }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <input
        type="number"
        min={1}
        max={5}
        name={name}
        required
        className="nature-input w-full rounded-sm px-3 py-2"
      />
    </label>
  );
}

export function ReviewForm({ submissionId }: Props) {
  const [state, action] = useActionState(createReviewAction, initialState);

  return (
    <form action={action} className="nature-card space-y-4 rounded-sm p-5">
      <input type="hidden" name="submissionId" value={submissionId} />
      <div>
        <h3 className="text-2xl text-[#222]">Add Open Review</h3>
        <p className="mt-1 text-sm text-[#585858]">
          Reviews are transparent and linked to versioned records.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-[#303030]">Reviewer Name *</span>
          <input
            name="reviewerName"
            required
            className="nature-input w-full rounded-sm px-3 py-2"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-[#303030]">Expertise *</span>
          <input
            name="expertise"
            required
            className="nature-input w-full rounded-sm px-3 py-2"
            placeholder="e.g. Clinical ML"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Review Type *</span>
        <select
          name="reviewType"
          required
          className="nature-input w-full rounded-sm px-3 py-2"
          defaultValue="formal"
        >
          <option value="formal">Formal Review</option>
          <option value="comment">Comment</option>
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <ScoreField name="novelty" label="Novelty (1-5)" />
        <ScoreField name="rigor" label="Method Rigor (1-5)" />
        <ScoreField name="reproducibility" label="Reproducibility (1-5)" />
        <ScoreField name="impact" label="Impact (1-5)" />
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Verdict *</span>
        <input
          name="verdict"
          required
          className="nature-input w-full rounded-sm px-3 py-2"
          placeholder="Short one-line judgment"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Review Summary *</span>
        <textarea
          name="summary"
          required
          rows={5}
          className="nature-input w-full rounded-sm px-3 py-2"
        />
      </label>

      {state.error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <FormSubmitButton idleText="Publish Review" pendingText="Publishing..." />
    </form>
  );
}
