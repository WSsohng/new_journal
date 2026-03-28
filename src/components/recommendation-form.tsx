"use client";

import { useActionState } from "react";
import { ActionState, upsertRecommendationAction } from "@/app/actions";
import { FormSubmitButton } from "@/components/form-submit-button";

const initialState: ActionState = {};

type Props = {
  submissionId: string;
};

export function RecommendationForm({ submissionId }: Props) {
  const [state, action] = useActionState(upsertRecommendationAction, initialState);

  return (
    <form action={action} className="nature-card space-y-4 rounded-sm p-5">
      <input type="hidden" name="submissionId" value={submissionId} />
      <div>
        <h3 className="text-2xl text-[#222]">Overlay Recommendation</h3>
        <p className="mt-1 text-sm text-[#585858]">
          Human recommendation layer for trust signaling and certification.
        </p>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Committee Name *</span>
        <input
          name="committeeName"
          required
          className="nature-input w-full rounded-sm px-3 py-2"
          placeholder="e.g. Biomedical Validation Board"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Label *</span>
        <select
          name="label"
          defaultValue="recommended"
          className="nature-input w-full rounded-sm px-3 py-2"
        >
          <option value="recommended">Recommended</option>
          <option value="validated">Validated</option>
          <option value="major_concerns">Major Concerns</option>
        </select>
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Rationale *</span>
        <textarea
          name="rationale"
          required
          rows={4}
          className="nature-input w-full rounded-sm px-3 py-2"
          placeholder="Explain consensus and critical caveats."
        />
      </label>

      {state.error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <FormSubmitButton
        idleText="Update Recommendation"
        pendingText="Updating..."
      />
    </form>
  );
}
