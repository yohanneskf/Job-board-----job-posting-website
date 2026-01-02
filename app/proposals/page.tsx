import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function ProposalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return <div>User not found</div>;

  const isClient = user.role === "CLIENT";

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {isClient ? "Proposals Received" : "My Proposals"}
      </h1>

      {isClient ? (
        <ClientProposals userId={user.id} />
      ) : (
        <FreelancerProposals userId={user.id} />
      )}
    </div>
  );
}

async function FreelancerProposals({ userId }: { userId: string }) {
  const proposals = await prisma.proposal.findMany({
    where: { userId },
    include: {
      job: {
        select: {
          title: true,
          id: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No proposals
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't submitted any proposals yet.
        </p>
        <div className="mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <ul role="list" className="divide-y divide-gray-100">
        {proposals.map((proposal) => (
          <li key={proposal.id} className="p-6 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Link
                  href={`/jobs/${proposal.jobId}`}
                  className="text-lg font-bold text-teal-600 hover:text-teal-800"
                >
                  {proposal.job.title}
                </Link>
                <span className="mt-1 text-sm text-gray-500">
                  Submitted{" "}
                  {formatDistanceToNow(proposal.createdAt, { addSuffix: true })}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-gray-900">
                  ${proposal.bidAmount}
                </span>
                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                ${
                                  proposal.status === "ACCEPTED"
                                    ? "bg-green-100 text-green-800"
                                    : proposal.status === "REJECTED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                >
                  {proposal.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function ClientProposals({ userId }: { userId: string }) {
  const jobsWithProposals = await prisma.job.findMany({
    where: {
      postedById: userId,
      proposals: { some: {} }, // Only jobs with proposals
    },
    include: {
      proposals: {
        include: {
          user: true, // The freelancer
        },
      },
    },
    orderBy: { postedAt: "desc" },
  });

  if (jobsWithProposals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">No proposals received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {jobsWithProposals.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
            <Link
              href={`/jobs/${job.id}`}
              className="text-sm text-teal-600 hover:text-teal-800"
            >
              View Job
            </Link>
          </div>
          <ul role="list" className="divide-y divide-gray-100">
            {job.proposals.map((proposal) => (
              <li key={proposal.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-gray-900">
                      {proposal.user.name || proposal.user.email}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {proposal.coverLetter}
                    </p>
                    <span className="mt-2 text-xs text-gray-400">
                      {formatDistanceToNow(proposal.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end ml-4 min-w-[100px]">
                    <span className="text-xl font-bold text-gray-900">
                      ${proposal.bidAmount}
                    </span>
                    <span className="text-sm text-gray-500 mb-2">
                      {proposal.duration}
                    </span>

                    {/* Access buttons could go here (Accept/Reject) */}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                     ${
                                       proposal.status === "ACCEPTED"
                                         ? "bg-green-100 text-green-800"
                                         : proposal.status === "REJECTED"
                                         ? "bg-red-100 text-red-800"
                                         : "bg-yellow-100 text-yellow-800"
                                     }`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
