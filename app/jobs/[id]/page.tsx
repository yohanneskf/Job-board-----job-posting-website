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
    // Renamed 'jobs' to 'job' for clarity
    where: { id: jobid },
    include: { postedBy: true },
  });

  if (!job) {
    notFound();
  }

  // Destructure for cleaner access
  const {
    title,
    company,
    location,
    type,
    salary,
    description,
    postedBy,
    postedAt,
  } = job;

  return (
    // Outer Container: Max width container for content
    <div className="max-w-5xl mx-auto py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/jobs"
        className="flex items-center text-teal-600 hover:text-teal-700 font-medium mb-6 transition duration-150"
      >
        &larr; Back to Jobs
      </Link>

      {/* Main Job Content Grid/Layout */}
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Job Details & Description (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Header Section */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
              {title}
            </h1>
            <p className="text-xl text-gray-600 font-semibold mb-4">
              {company}
            </p>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
              <span className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full">
                <MapPinIcon className="h-4 w-4 text-teal-600" />
                <span>{location}</span>
              </span>
              <span className="flex items-center space-x-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full">
                <BriefcaseIcon className="h-4 w-4" />
                <span>{type}</span>
              </span>
              {salary && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{salary}</span>
                </span>
              )}
            </div>
          </div>

          {/* Job Description Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
              Job Description
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {/* Using dangerouslySetInnerHTML if description is formatted HTML, otherwise simply {description} */}
              {description}
            </div>
          </div>

          {/* How to Apply Section (Placeholder for clarity, can use job.howToApply if available) */}
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

        {/* RIGHT COLUMN: Action Bar & Metadata (1/3 width) */}
        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-8 pt-6 lg:pt-0 space-y-6">
          {/* Apply Button */}
          <div className="sticky top-20">
            {/* Note: sticky top-20 helps the button stay visible as user scrolls description */}
            <ApplyButton jobid={job.id} />
          </div>

          {/* Posting Metadata */}
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
