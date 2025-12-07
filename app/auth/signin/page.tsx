// app/auth/signin/page.tsx - REPLACE ENTIRE FILE
"use client";

import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleSignIn = () => {
    signIn("github", {
      redirectTo: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to the JobBoard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to post jobs or apply for Opportunities
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <button
            onClick={handleSignIn}
            type="button"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
          >
            <FaGithub className="h-6 w-6 mr-3" />
            <span>Continue with GitHub</span>
          </button>

          <div className="text-center text-xs text-gray-500 mt-4">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
