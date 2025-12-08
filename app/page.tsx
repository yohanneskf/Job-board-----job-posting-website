import Link from "next/link";
import prisma from "@/prisma/client";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/auth"; // <-- New: Import server-side auth function

import {
  BriefcaseIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const FEATURED_JOBS_LIMIT = 6;

export default async function HomePage() {
  const session = await auth();
  const postJobHref = session?.user ? "/jobs/post" : "/auth/signin";

  const featuredJobs = await prisma.job.findMany({
    orderBy: {
      postedAt: "desc",
    },
    take: FEATURED_JOBS_LIMIT,
    include: {
      postedBy: true,
    },
  });

  return (
    <div className="bg-white">
      <section className="py-20 lg:py-32 bg-teal-600/5 border-b border-teal-100 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 transition-all duration-700">
            Find Your <span className="text-teal-600">Dream Job</span> Today
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-100">
            Explore thousands of verified job listings and opportunities posted
            by top companies. Sign in to apply or post your first job in
            minutes.
          </p>

          <div className="flex justify-center space-x-4 transition-all duration-700 delay-200">
            <Link
              href="/jobs"
              className="px-8 py-3 text-lg font-bold text-white bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
            >
              Browse All Jobs
            </Link>

            <Link
              href={postJobHref}
              className="px-8 py-3 text-lg font-bold text-teal-700 bg-white border border-teal-600 rounded-full shadow-lg hover:bg-teal-50 transition duration-300 transform hover:scale-105"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔥 Latest Opportunities
          </h2>

          {featuredJobs.length === 0 ? (
            <p className="p-10 text-center text-gray-500 bg-white rounded-lg shadow-sm">
              No recent jobs available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-teal-600 transition duration-150 line-clamp-2">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-md text-gray-600 font-medium">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4 text-teal-600" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BriefcaseIcon className="h-4 w-4 text-teal-600" />
                        <span>{job.type}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(job.postedAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex items-center text-teal-600 hover:text-teal-800 font-semibold"
                    >
                      Details
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/jobs"
              className="text-lg font-semibold text-teal-600 hover:text-teal-800 transition duration-150 inline-flex items-center group"
            >
              View all jobs
              <ArrowRightIcon className="w-5 h-5 ml-2 transition duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-teal-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to hire the best talent?
          </h2>
          <p className="text-lg text-teal-200 mb-8">
            Post your opening and connect with thousands of qualified
            candidates.
          </p>
          <Link
            href={postJobHref} // <-- Uses dynamic href
            className="inline-flex items-center bg-white text-teal-700 text-lg font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Start Posting
          </Link>
        </div>
      </section>

      <footer className="py-8 bg-gray-100 border-t border-gray-200 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Job Board. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
