"use client";

import { useFormStatus } from "react-dom";
import { updateProfile } from "@/app/actions/profile";

import { User, Profile, Skill } from "@/lib/generated/prisma/client";

type ProfileWithSkills = Profile & { skills: Skill[] };

interface ProfileEditFormProps {
  user: User;
  profile: ProfileWithSkills | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export default function ProfileEditForm({
  user,
  profile,
}: ProfileEditFormProps) {
  const defaultSkills = profile?.skills.map((s) => s.name).join(", ") || "";

  return (
    <form action={updateProfile} className="space-y-6">
      <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 mb-6">
        <label className="block text-sm font-bold text-teal-800 mb-2">
          Your Role
        </label>
        <div className="flex items-center space-x-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="FREELANCER"
              defaultChecked={user.role === "FREELANCER"}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700 font-medium">
              Freelancer (Looking for work)
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="CLIENT"
              defaultChecked={user.role === "CLIENT"}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700 font-medium">
              Client (Hiring)
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user.name || ""}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={profile?.title || ""}
            placeholder="e.g. Senior Full Stack Developer"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            defaultValue={profile?.location || ""}
            placeholder="e.g. New York, USA"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate ($/hr)
          </label>
          <input
            type="number"
            name="hourlyRate"
            defaultValue={profile?.hourlyRate || ""}
            step="0.01"
            min="0"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          rows={5}
          defaultValue={profile?.bio || ""}
          placeholder="Tell us about your experience and expertise..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Portfolio URL
        </label>
        <input
          type="url"
          name="portfolioUrl"
          defaultValue={profile?.portfolioUrl || ""}
          placeholder="https://yourportfolio.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills (comma separated)
        </label>
        <input
          type="text"
          name="skills"
          defaultValue={defaultSkills}
          placeholder="React, Node.js, TypeScript, Design"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple skills with commas.
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
