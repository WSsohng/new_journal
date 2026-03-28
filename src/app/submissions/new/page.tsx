import { SubmissionForm } from "@/components/submission-form";

export default function NewSubmissionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <p className="nature-kicker">Publish with us</p>
      <h1 className="text-4xl text-[#222]">Submit New Preprint</h1>
      <p className="text-[16px] text-[#4b4b4b]">
        This is the repository layer. Each accepted upload starts at moderation,
        then moves through open review and recommendation.
      </p>
      <SubmissionForm />
    </div>
  );
}
