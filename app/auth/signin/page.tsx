"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

export default function SignInPage() {
  const handleSignIn = (provider: string) => {
    signIn(provider, {
      redirectTo: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link
            href={"/"}
            className="flex items-center justify-center space-x-2 text-teal-600 hover:text-teal-800 transition mb-6"
          >
            <BriefcaseIcon className="size-10" />
            <span className="text-3xl font-extrabold tracking-tight text-gray-900">
              Work<span className="text-teal-600">Hive</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your WorkHive dashboard
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="space-y-4">
            <button
              onClick={() => handleSignIn("google")}
              type="button"
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              <FaGoogle className="h-5 w-5 mr-3 text-red-500" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSignIn("github")}
              type="button"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              <FaGithub className="h-5 w-5 mr-3" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-100">
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
