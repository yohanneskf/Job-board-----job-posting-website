import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [applications, postedJobs] = await Promise.all([
    // application query
    prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: {
          include: {
            postedBy: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    }),
    // jobs query
    prisma.job.findMany({
      where: {
        postedById: session.user.id,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        postedAt: "desc",
      },
    }),
  ]);

  // Helper function for status badge styling
  const getStatusClasses = (status: "PENDING" | "ACCEPTED" | "REJECTED") => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700 ring-green-500/10";
      case "REJECTED":
        return "bg-red-100 text-red-700 ring-red-500/10";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700 ring-yellow-500/10";
    }
  };

  const getStatusIcon = (status: "PENDING" | "ACCEPTED" | "REJECTED") => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircleIcon className="h-4 w-4 mr-1" />;
      case "REJECTED":
        return <XCircleIcon className="h-4 w-4 mr-1" />;
      case "PENDING":
      default:
        return <MinusCircleIcon className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
        Your Dashboard
      </h1>

      {/* --- Main Dashboard Grid Layout (Side-by-Side on large screens) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- COLUMN 1: Posted Jobs (Employer View) --- */}
        <div className="lg:order-1">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Posted Jobs</h2>
            <Link
              href="/jobs/post"
              className="flex items-center text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 shadow-md"
            >
              <BriefcaseIcon className="w-5 h-5 mr-2" />
              Post New Job
            </Link>
          </div>

          <div className="space-y-4">
            {postedJobs.length === 0 ? (
              <p className="p-6 text-gray-500 bg-white rounded-lg shadow-sm">
                You haven't posted any jobs yet. Get started by clicking "Post
                New Job"!
              </p>
            ) : (
              postedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex justify-between items-start border border-gray-100"
                >
                  <div className="flex-grow space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-teal-600 transition duration-150">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className="text-md text-gray-600 font-medium">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span>{job.type}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(job.postedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3 pl-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-teal-100 text-teal-800 ring-2 ring-teal-500/10">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {job._count.applications} applications
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-teal-600 hover:text-teal-800 text-sm font-medium transition duration-150"
                    >
                      View Job & Applications
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- COLUMN 2: Your Applications (Job Seeker View) --- */}
        <div className="lg:order-2">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
            Your Applications
          </h2>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="p-6 text-gray-500 bg-white rounded-lg shadow-sm">
                You haven't applied to any jobs yet.{" "}
                <Link
                  href="/jobs"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Start browsing now!
                </Link>
              </p>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex justify-between items-start border border-gray-100"
                >
                  <div className="flex-grow space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-teal-600 transition duration-150">
                      <Link href={`/jobs/${application.job.id}`}>
                        {application.job.title}
                      </Link>
                    </h3>
                    <p className="text-md text-gray-600 font-medium">
                      {application.job.company}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{application.job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span>{application.job.type}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-teal-700 font-medium">
                          Applied{" "}
                          {formatDistanceToNow(
                            new Date(application.appliedAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3 pl-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ring-2 ${getStatusClasses(
                        application.status as
                          | "PENDING"
                          | "ACCEPTED"
                          | "REJECTED"
                      )}`}
                    >
                      {getStatusIcon(
                        application.status as
                          | "PENDING"
                          | "ACCEPTED"
                          | "REJECTED"
                      )}
                      {application.status}
                    </span>
                    <Link
                      href={`/jobs/${application.job.id}`}
                      className="text-teal-600 hover:text-teal-800 text-sm font-medium transition duration-150"
                    >
                      View Job Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* End of Main Dashboard Grid Layout */}
    </div>
  );
}
