"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function ApplyButton({ jobid }: { jobid: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationStatus, setApplicationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleApply = async () => {
    if (status === "loading") return; // Prevent double-click while loading session

    if (!session) {
      // Redirects user to sign-in page if not authenticated
      router.push("/auth/signin");
      return;
    }

    setErrorMessage("");
    setApplicationStatus("idle");

    try {
      const response = await fetch(`/api/jobs/${jobid}/apply`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Application failed due to a server error."
        );
      }

      setApplicationStatus("success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to apply for the job";
      setErrorMessage(message);
      setApplicationStatus("error");
    }
  };

  // --- RENDERING STATES ---

  if (status === "loading") {
    return (
      <button
        className="w-full sm:w-auto py-3 px-6 rounded-md text-base font-medium text-gray-700 bg-gray-200 cursor-not-allowed"
        disabled
      >
        Loading Session...
      </button>
    );
  }

  if (applicationStatus === "success") {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
        <p className="text-lg font-semibold text-green-700 mb-2">
          Application submitted successfully! 🎉
        </p>
        <Link
          href={"/dashboard"}
          className="text-sm text-teal-600 hover:text-teal-800 font-medium transition duration-150"
        >
          View your application on the Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleApply}
        // Primary Teal Button Styling
        className={`w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent rounded-md shadow-lg text-lg font-bold text-white transition duration-150 ease-in-out 
          ${
            applicationStatus === "idle"
              ? "bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              : "bg-teal-400 cursor-wait" // Slightly lighter/disabled feel while request is ongoing
          }`}
        disabled={applicationStatus === "error"}
      >
        {applicationStatus === "idle"
          ? "Apply for this position"
          : "Submitting..."}
      </button>

      {applicationStatus === "error" && (
        <p className="mt-3 text-red-600 text-sm font-medium p-2 bg-red-100 rounded">
          {errorMessage}
        </p>
      )}
    </>
  );
}
