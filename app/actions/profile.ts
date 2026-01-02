"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const name = formData.get("name") as string;
  const role = formData.get("role") as string; // Check validation
  const title = formData.get("title") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;
  const hourlyRateRaw = formData.get("hourlyRate") as string;
  const skillsRaw = formData.get("skills") as string; // Comma separated

  const hourlyRate = hourlyRateRaw ? parseFloat(hourlyRateRaw) : null;

  // Process skills: split by comma, trim, filter empty
  const skillNames = skillsRaw
    ? skillsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Validate Role
  const validRoles = ["FREELANCER", "CLIENT"];
  const newRole = validRoles.includes(role) ? role : undefined;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    // Transaction to handle profile and skills
    await prisma.$transaction(async (tx) => {
      // 1. Update User basic info
      await tx.user.update({
        where: { id: user.id },
        data: {
          name,
          ...(newRole ? { role: newRole as any } : {}),
        },
      });

      // 2. Handle Skills
      // First, ensure all skills exist or are created
      const skillConnect = [];
      for (const skillName of skillNames) {
        // dynamic connectOrCreate logic
        // Since we can't easily doing connectOrCreate with array, we'll upsert them one by one or find them
        let skill = await tx.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await tx.skill.create({ data: { name: skillName } });
        }
        skillConnect.push({ id: skill.id });
      }

      // 3. Upsert Profile
      // We need to disconnect old skills and connect new ones if we want a full replace,
      // or just connect new ones. Usually "edit" implies "set to this state".
      // So we should disconnect all and connect the new list.

      // First get existing profile to know ID if it exists (for disconnect)
      const existingProfile = await tx.profile.findUnique({
        where: { userId: user.id },
        include: { skills: true },
      });

      if (existingProfile) {
        await tx.profile.update({
          where: { userId: user.id },
          data: {
            title,
            bio,
            location,
            portfolioUrl,
            hourlyRate,
            skills: {
              set: [], // Disconnect all
              connect: skillConnect,
            },
          },
        });
      } else {
        await tx.profile.create({
          data: {
            userId: user.id,
            title,
            bio,
            location,
            portfolioUrl,
            hourlyRate,
            skills: {
              connect: skillConnect,
            },
          },
        });
      }
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
  } catch (error) {
    console.error("Profile update error:", error);
    throw new Error("Failed to update profile");
  }

  redirect("/profile");
}
