import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import ProposalForm from "@/components/ProposalForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=/jobs/${(await params).id}/apply`);
  }

  // Check if already applied
  // Wait, params is a Promise now in Next.js 15 (implied by previous file reading)
  // but I should check user's version. The previous file reading of jobs/[id]/page.tsx showed types: params: Promise<{ id: string }>
  // So yes, await it.

  const jobId = (await params).id;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { postedBy: true },
  });

  if (!job) {
    notFound();
  }

  // Check if user already submitted a proposal
  const existingProposal = await prisma.proposal.findFirst({
    where: {
      jobId: jobId,
      userId: session.user.id,
    },
  });

  if (existingProposal) {
    // Maybe redirect to status page or show message
    // For now redirect to proposals
    redirect("/proposals");
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link
        href={`/jobs/${job.id}`}
        className="flex items-center text-teal-600 hover:text-teal-800 font-medium mb-6 transition"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Job Details
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-teal-50 px-8 py-6 border-b border-teal-100">
          <h1 className="text-2xl font-bold text-teal-900">
            Submit a Proposal
          </h1>
          <p className="text-teal-700 mt-1">
            Applying for: <span className="font-semibold">{job.title}</span>
          </p>
        </div>

        <div className="p-8">
          <ProposalForm jobId={job.id} jobBudget={job.budget} />
        </div>
      </div>
    </div>
  );
}
