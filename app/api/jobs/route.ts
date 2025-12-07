import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const data = await request.json();
    const jobs = await prisma.job.create({
      data: {
        ...data,
        postedById: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "Job posted successfully", jobs },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting job:", error);
    return NextResponse.json(
      { message: "Failed to post job" },
      { status: 500 }
    );
  }
}
