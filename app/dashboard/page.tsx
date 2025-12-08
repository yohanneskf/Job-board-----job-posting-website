import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h2>Posted Job</h2>
          <Link href="/jobs/post">Post New Jobs</Link>
        </div>
      </div>
    </div>
  );
}
