"use client";

import { useFormStatus } from "react-dom";
import { submitProposal } from "@/app/actions/proposal";
import { CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/outline";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      {pending ? "Submitting..." : "Submit Proposal"}
    </button>
  );
}

export default function ProposalForm({
  jobId,
  jobBudget,
}: {
  jobId: string;
  jobBudget?: number | null;
}) {
  const submitWithId = submitProposal.bind(null, jobId);

  return (
    <form action={submitWithId} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bid Amount ($)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="bidAmount"
            step="0.01"
            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-teal-500 focus:ring-teal-500 py-3 border"
            placeholder="0.00"
            defaultValue={jobBudget || ""}
            required
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">USD</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estimated Duration
        </label>
        <div className="relative">
          <ClockIcon className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="duration"
            placeholder="e.g. 2 weeks, 1 month"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500 py-3 border"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter
        </label>
        <textarea
          name="coverLetter"
          rows={6}
          className="block w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 border p-3"
          placeholder="Describe why you are the best fit for this job..."
          required
        />
      </div>

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
