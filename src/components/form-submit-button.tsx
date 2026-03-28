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
      className="nature-button-primary rounded-sm px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingText : idleText}
    </button>
  );
}
