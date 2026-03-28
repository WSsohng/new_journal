import { SubmissionForm } from "@/components/submission-form";

export default function NewSubmissionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Submit New Preprint</h1>
      <p className="text-sm text-slate-600">
        This is the repository layer. Each accepted upload starts at moderation,
        then moves through open review and recommendation.
      </p>
      <SubmissionForm />
    </div>
  );
}
