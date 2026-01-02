import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/ProfileEditForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function EditProfilePage() {
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
    // Should verify session logic, but for now redirect
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/profile"
          className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium transition"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Edit Your Profile
        </h1>

        {/* Pass pure data to client component */}
        <ProfileEditForm user={user} profile={user.profile} />
      </div>
    </div>
  );
}
