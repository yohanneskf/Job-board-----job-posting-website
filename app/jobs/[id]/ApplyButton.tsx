"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ApplyButton({ jobid }: { jobid: string }) {
  const { data: session } = useSession();

  // If not logged in, we can still show the button but it will redirect to login via the page logic
  // Or we can link to login.
  // The page logic handles auth redirect.

  return (
    <Link
      href={`/jobs/${jobid}/apply`}
      className="w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent rounded-md shadow-lg text-lg font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
    >
      Submit a Proposal
    </Link>
  );
}
