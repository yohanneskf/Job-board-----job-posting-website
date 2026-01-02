"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitProposal(jobId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const coverLetter = formData.get("coverLetter") as string;
  const bidAmountRaw = formData.get("bidAmount") as string;
  const duration = formData.get("duration") as string;

  const bidAmount = parseFloat(bidAmountRaw);

  if (!coverLetter || !bidAmount) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.proposal.create({
      data: {
        jobId,
        userId: session.user.id,
        coverLetter,
        bidAmount,
        duration,
        status: "PENDING",
      },
    });

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/proposals");
  } catch (error) {
    console.error("Proposal submission error:", error);
    throw new Error("Failed to submit proposal");
  }

  redirect("/proposals");
}
