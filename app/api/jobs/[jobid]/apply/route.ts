import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobid: string }> }
) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const { jobid } = await params;
    const job = await prisma.job.findUnique({
      where: { id: jobid },
    });
    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobid,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return new NextResponse("You already have applied for this job", {
        status: 404,
      });
    }

    const application = await prisma.application.create({
      data: {
        jobId: jobid,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
