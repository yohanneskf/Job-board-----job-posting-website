"use client";
import Link from "next/link";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    // Note: I've updated the callbackUrl to just '/login' for simplicity,
    // based on your previous examples, but '/auth/signin' is fine too.
    await signOut({ callbackUrl: "/login" });
  };

  return (
    // ADDED: fixed top-0 w-full z-10
    <nav className="fixed top-0 w-full z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href={"/"}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-800"
            >
              <BriefcaseIcon className="size-6" />
              <h1 className="text-xl font-bold tracking-wide">Job Board</h1>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            <Link
              href={"/jobs"}
              className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Jobs
            </Link>

            {session ? (
              <>
                <Link
                  href={"/jobs/post"}
                  className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Post a Job
                </Link>
                <Link
                  href={"/dashboard"}
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  LogOut
                </button>
              </>
            ) : (
              <Link
                href={"/auth/signin"}
                className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                LogIn
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
