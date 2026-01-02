import prisma from "@/prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import ApplyButton from "./ApplyButton";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline"; // Added icons

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const jobid = (await params).id;
  const job = await prisma.job.findUnique({
    where: { id: jobid },
    include: { postedBy: true },
  });

  if (!job) {
    notFound();
  }

  const {
    title,
    location,
    type,
    budget,
    budgetType,
    minRate,
    maxRate,
    description,
    postedBy,
    postedAt,
  } = job;

  const getBudgetDisplay = () => {
    if (budgetType === "FIXED") {
      return budget ? `$${budget}` : "Fixed Price";
    }
    if (budgetType === "HOURLY") {
      if (minRate && maxRate) return `$${minRate} - $${maxRate}/hr`;
      if (minRate) return `$${minRate}/hr+`;
      if (maxRate) return `Up to $${maxRate}/hr`;
      return "Hourly Rate";
    }
    return "Negotiable";
  };

  return (
    <div className="max-w-5xl mx-auto py-8 sm:px-6 lg:px-8">
      <Link
        href="/jobs"
        className="flex items-center text-teal-600 hover:text-teal-700 font-medium mb-6 transition duration-150"
      >
        &larr; Back to Jobs
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
              {title}
            </h1>
            <p className="text-xl text-gray-600 font-semibold mb-4">
              {/* Fallback to User Name as 'Client' */}
              Client: {postedBy.name || "Verified Client"}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
              {location && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full">
                  <MapPinIcon className="h-4 w-4 text-teal-600" />
                  <span>{location}</span>
                </span>
              )}
              {type && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full">
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>{type}</span>
                </span>
              )}

              <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>{getBudgetDisplay()}</span>
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
              Job Description
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
              How to Apply
            </h2>
            <p className="text-gray-700">
              Click the apply button on the right to start your application
              through our platform.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-8 pt-6 lg:pt-0 space-y-6">
          <div className="sticky top-20">
            <ApplyButton jobid={job.id} />
          </div>

          <div className="text-sm space-y-2 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Job Details</h3>

            <div className="flex items-center space-x-2 text-gray-600">
              <UserIcon className="h-5 w-5 text-teal-600" />
              <span>
                Posted By <span className="font-medium">{postedBy.name}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <ClockIcon className="h-5 w-5 text-teal-600" />
              <span>
                Posted{" "}
                {formatDistanceToNow(new Date(postedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
