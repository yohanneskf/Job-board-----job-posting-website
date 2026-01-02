import prisma from "@/prisma/client";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, type, location } = await searchParams;
  const query = q as string | undefined;
  const searchtype = type as string | undefined;
  const searchlocation = location as string | undefined;

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        type
          ? {
              type: { equals: searchtype },
            }
          : {},
        searchlocation
          ? {
              location: { contains: searchlocation, mode: "insensitive" },
            }
          : {},
      ],
    },
    orderBy: {
      postedAt: "desc",
    },
    include: {
      postedBy: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Find Jobs
        </h1>

        <form className="flex flex-col sm:flex-row gap-4 items-stretch">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search jobs by title..."
            className="w-full sm:flex-1 border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition duration-150"
          />

          <select
            name="type"
            defaultValue={searchtype}
            className="w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-3 px-4 bg-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition duration-150"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>

          <input
            type="text"
            name="location"
            defaultValue={searchlocation}
            placeholder="Location (City, State, Remote)"
            className="w-full sm:flex-1 border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition duration-150"
          />

          <button
            type="submit"
            className="w-full sm:w-auto flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
          >
            Search
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md">
            No jobs found matching your criteria.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex-grow">
                  <Link href={`/jobs/${job.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 hover:text-teal-600 transition duration-150">
                      {job.title}
                    </h2>
                  </Link>
                  <p className="text-md text-gray-600 font-medium mb-2">
                    {job.postedBy.name}
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm">
                    {job.location && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{job.location}</span>
                      </span>
                    )}
                    {job.type && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-medium">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span>{job.type}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-gray-500 mt-3 text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="sm:ml-6 mt-4 sm:mt-0 flex flex-col items-start sm:items-end space-y-3 min-w-[140px]">
                  <span className="flex items-center space-x-1 text-lg font-bold text-green-700">
                    <CurrencyDollarIcon className="h-5 w-5" />
                    <span>
                      {job.budgetType === "FIXED"
                        ? job.budget
                          ? `$${job.budget}`
                          : "Fixed"
                        : "Hourly"}
                    </span>
                  </span>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="w-full sm:w-auto text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                <span>
                  Posted by{" "}
                  <span className="font-semibold">
                    {job.postedBy.name || "Client"}
                  </span>
                </span>
                <span>{job.postedAt.toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
