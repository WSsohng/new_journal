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
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
      />
    </label>
  );
}

export function ReviewForm({ submissionId }: Props) {
  const [state, action] = useActionState(createReviewAction, initialState);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <input type="hidden" name="submissionId" value={submissionId} />
      <div>
        <h3 className="text-base font-semibold">Add Open Review</h3>
        <p className="mt-1 text-sm text-slate-600">
          Reviews are transparent and linked to versioned records.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-800">Reviewer Name *</span>
          <input
            name="reviewerName"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-800">Expertise *</span>
          <input
            name="expertise"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            placeholder="e.g. Clinical ML"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-800">Review Type *</span>
        <select
          name="reviewType"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
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
        <span className="font-medium text-slate-800">Verdict *</span>
        <input
          name="verdict"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          placeholder="Short one-line judgment"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-800">Review Summary *</span>
        <textarea
          name="summary"
          required
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
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
