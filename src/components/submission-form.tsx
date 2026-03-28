"use client";

import { useActionState } from "react";
import { ActionState, createSubmissionAction } from "@/app/actions";
import { FormSubmitButton } from "@/components/form-submit-button";

const initialState: ActionState = {};

export function SubmissionForm() {
  const [state, action] = useActionState(createSubmissionAction, initialState);

  return (
    <form action={action} className="nature-card space-y-4 rounded-sm p-6">
      <div>
        <h2 className="text-2xl text-[#222]">New Preprint Submission</h2>
        <p className="mt-1 text-sm text-[#585858]">
          Free submission with moderation-first workflow and transparent AI score initialization.
        </p>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Title *</span>
        <input
          name="title"
          required
          className="nature-input w-full rounded-sm px-3 py-2"
          placeholder="Paper title"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">Abstract *</span>
        <textarea
          name="abstract"
          required
          rows={7}
          className="nature-input w-full rounded-sm px-3 py-2"
          placeholder="Describe your claim, evidence, and key limitations."
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-[#303030]">Domain *</span>
          <input
            name="domain"
            required
            className="nature-input w-full rounded-sm px-3 py-2"
            placeholder="e.g. Biomedical AI"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium text-[#303030]">Author Name *</span>
          <input
            name="authorName"
            required
            className="nature-input w-full rounded-sm px-3 py-2"
            placeholder="Full name"
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-[#303030]">ORCID</span>
        <input
          name="authorOrcid"
          className="nature-input w-full rounded-sm px-3 py-2"
          placeholder="0000-0000-0000-0000"
        />
      </label>

      {state.error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <FormSubmitButton idleText="Submit Preprint" pendingText="Submitting..." />
    </form>
  );
}
