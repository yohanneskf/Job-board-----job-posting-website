"use client";
import { FormEvent, useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function PostJobPage() {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [budgetType, setBudgetType] = useState<"FIXED" | "HOURLY">("FIXED");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    // Construct payload based on budget type
    const payload: any = {
      title: formData.get("title"),
      location: formData.get("location"),
      type: formData.get("type"),
      description: formData.get("description"),
      budgetType: budgetType,
    };

    if (budgetType === "FIXED") {
      const budgetVal = formData.get("budget");
      payload.budget = budgetVal ? parseFloat(budgetVal.toString()) : null;
    } else {
      const minVal = formData.get("minRate");
      const maxVal = formData.get("maxRate");
      payload.minRate = minVal ? parseFloat(minVal.toString()) : null;
      payload.maxRate = maxVal ? parseFloat(maxVal.toString()) : null;
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to post job due to server error."
        );
      }

      setSubmitStatus("success");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setErrorMessage(message);
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Post a Job</h1>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100">
        <p className="text-gray-600 mb-8 pb-4 border-b border-gray-100">
          Fill out the details below to publish your job listing immediately.
        </p>

        {submitStatus === "success" && (
          <div className="flex items-center p-4 mb-4 bg-green-50 rounded-md border border-green-200 text-green-700 font-medium">
            <CheckCircleIcon className="w-5 h-5 mr-3" />
            Job posted successfully! Redirecting to dashboard...
          </div>
        )}
        {submitStatus === "error" && (
          <div className="flex items-start p-4 mb-4 bg-red-50 rounded-md border border-red-200 text-red-700 font-medium">
            <XCircleIcon className="w-5 h-5 mr-3 mt-0.5" />
            <span className="grow">
              Submission failed: {errorMessage || "Please try again later."}
            </span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                placeholder="e.g., Senior Full-Stack Developer"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                placeholder="e.g., New York, NY or Remote"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                id="type"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 bg-white focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              >
                <option value="">Select a type</option>
                <option value="Full-time">Full Time</option>
                <option value="Part-time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            {/* Added Budget Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Budget Type
              </label>
              <div className="flex space-x-4 mt-2">
                <button
                  type="button"
                  onClick={() => setBudgetType("FIXED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    budgetType === "FIXED"
                      ? "bg-teal-50 border-teal-500 text-teal-700"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Fixed Price
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType("HOURLY")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    budgetType === "HOURLY"
                      ? "bg-teal-50 border-teal-500 text-teal-700"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Hourly Rate
                </button>
              </div>
            </div>
          </div>

          {/* Budget Input Fields Dynamic */}
          <div className="pt-4 border-t border-gray-100">
            {budgetType === "FIXED" ? (
              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Fixed Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  placeholder="e.g., 5000"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="minRate"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Min Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    name="minRate"
                    id="minRate"
                    placeholder="e.g., 20"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxRate"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Max Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    name="maxRate"
                    id="maxRate"
                    placeholder="e.g., 50"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              id="description"
              rows={8}
              required
              placeholder="Provide a detailed description of the role, responsibilities, and qualifications."
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
            ></textarea>
          </div>

          <div className="pt-5">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-xl text-lg font-bold text-white transition duration-150 ease-in-out ${
                loading
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              }`}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-3 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
