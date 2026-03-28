"use client";

import { useFormStatus } from "react-dom";

type Props = {
  idleText: string;
  pendingText: string;
};

export function FormSubmitButton({ idleText, pendingText }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
    >
      {pending ? pendingText : idleText}
    </button>
  );
}
