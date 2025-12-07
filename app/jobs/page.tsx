import prisma from "@/prisma/client";
import Link from "next/link";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, type, location } = await searchParams;
  const query = q as string | undefined;
  const searchtype = type as string | undefined;
  const searchlocation = location as string | undefined;
  console.log("Search Params:", { q, type, location });

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
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
    // Outer Container: Centers content with max width and padding, matching RootLayout
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Bar Container */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        {/* Page Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Find Jobs
        </h1>

        {/* Search Form (CSS reused from previous step) */}
        <form
          action=""
          className="flex flex-col sm:flex-row gap-4 items-stretch"
        >
          {/* Search Input (Query) */}
          <input
            type="text"
            name="q"
            placeholder="Search jobs by title or company..."
            className="w-full sm:flex-1 border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition duration-150"
          />

          {/* Select (Job Type) */}
          <select
            name="type"
            className="w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-3 px-4 bg-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition duration-150"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>

          {/* Location Input */}
          <input
            type="text"
            name="location"
            placeholder="Location (City, State, Remote)"
            className="w-full sm:flex-1 border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-teal-500 focus:border-teal-500 transition duration-150"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
          >
            Search
          </button>
        </form>
      </div>

      {/* Job Listings Results */}
      <div className="space-y-6">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md">
            No jobs found matching your criteria.
          </p>
        ) : (
          jobs.map((job) => (
            // Individual Job Card
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                {/* Job Details Section (Left/Top) */}
                <div className="flex-grow">
                  {/* Title and Company */}
                  <Link href={`/jobs/${job.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 hover:text-teal-600 transition duration-150">
                      {job.title}
                    </h2>
                  </Link>
                  <p className="text-md text-gray-600 font-medium mb-2">
                    {job.company}
                  </p>

                  {/* Location and Type Badges */}
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                      {job.location}
                    </span>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-medium">
                      {job.type}
                    </span>
                  </div>

                  {/* Description Snippet */}
                  {/* Note: Added a simple truncation for clean display */}
                  <p className="text-gray-500 mt-3 text-sm line-clamp-2">
                    {job.description.substring(0, 150)}...
                  </p>
                </div>

                {/* Right Column/Action Section */}
                <div className="sm:ml-6 mt-4 sm:mt-0 flex flex-col items-start sm:items-end space-y-3">
                  {/* Salary */}
                  {job.salary && (
                    <span className="text-lg font-bold text-green-700">
                      {job.salary}
                    </span>
                  )}

                  {/* View Details Button */}
                  <Link
                    href={`/jobs/${job.id}`}
                    className="w-full sm:w-auto text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Footer/Meta Info */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                <span>
                  Posted by{" "}
                  <span className="font-semibold">{job.postedBy.name}</span>
                </span>
                {/* You might add job.postedAt here if you need to display the date */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
