import { auth } from "@/auth";
import prisma from "@/prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  UserCircleIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  PencilSquareIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: {
        include: {
          skills: true,
        },
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const { profile, role } = user;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header / Cover */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 h-32 sm:h-48 relative">
          <div className="absolute top-4 right-4">
            <Link
              href="/profile/edit"
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-sm transition duration-200"
            >
              <PencilSquareIcon className="h-5 w-5" />
              <span className="font-medium">Edit Profile</span>
            </Link>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                />
              ) : (
                <UserCircleIcon className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white shadow-lg text-gray-300 bg-white" />
              )}
              <span className="absolute bottom-2 right-2 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide border-2 border-white">
                {role}
              </span>
            </div>
          </div>

          <div className="mt-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 font-medium">
              {profile?.title || "No title set"}
            </p>
            {profile?.location && (
              <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Bio & Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-xl border border-gray-100">
                  {profile?.bio || "No bio added yet."}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Portfolio
                </h3>
                {profile?.portfolioUrl ? (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-md transition duration-200 group"
                  >
                    <div className="p-2 bg-teal-50 rounded-full mr-4 group-hover:bg-teal-100 transition">
                      <BriefcaseIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-teal-700">
                        View Portfolio
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-xs sm:max-w-sm">
                        {profile.portfolioUrl}
                      </p>
                    </div>
                  </a>
                ) : (
                  <p className="text-gray-500 italic">
                    No portfolio link added.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Stats & Skills */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-teal-600" />
                      <span>Hourly Rate</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {profile?.hourlyRate
                        ? `$${profile.hourlyRate}/hr`
                        : "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-md border border-teal-100"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    No skills listed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
