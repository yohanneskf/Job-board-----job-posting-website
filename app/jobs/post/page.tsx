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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      company: formData.get("company"),
      location: formData.get("location"),
      type: formData.get("type"),
      description: formData.get("description"),
      salary: formData.get("salary"),
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to post job due to server error."
        );
      }

      setSubmitStatus("success");
      // Redirect after a short delay to allow user to see success message
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

      {/* Form Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100">
        <p className="text-gray-600 mb-8 pb-4 border-b border-gray-100">
          Fill out the details below to publish your job listing immediately.
        </p>

        {/* Submission Status Messages */}
        {submitStatus === "success" && (
          <div className="flex items-center p-4 mb-4 bg-green-50 rounded-md border border-green-200 text-green-700 font-medium">
            <CheckCircleIcon className="w-5 h-5 mr-3" />
            Job posted successfully! Redirecting to dashboard...
          </div>
        )}
        {submitStatus === "error" && (
          <div className="flex items-start p-4 mb-4 bg-red-50 rounded-md border border-red-200 text-red-700 font-medium">
            <XCircleIcon className="w-5 h-5 mr-3 mt-0.5" />
            <span className="flex-grow">
              Submission failed: {errorMessage || "Please try again later."}
            </span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Group 1: Core Details (Title, Company, Location) */}
          <div className="space-y-6">
            {/* Job Title */}
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

            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                id="company"
                required
                placeholder="e.g., Tech Innovations Inc."
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              />
            </div>

            {/* Location */}
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
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Salary (optional) */}
            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Salary (optional)
              </label>
              <input
                type="text"
                name="salary"
                id="salary"
                placeholder="e.g., $80,000 - $100,000"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
              />
            </div>
          </div>

          {/* Group 3: Description (Full Width) */}
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

          {/* Submit Button */}
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
