"use server";

import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createCandidateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/auth/login");
  }

  const name = formData.get("name") as string;
  const gender = formData.get("gender") as string;
  const age = parseInt(formData.get("age") as string);
  const bio = formData.get("bio") as string;

  // Validation (Simple)
  if (!name || !gender || isNaN(age)) {
    // In a real app, return errors to the form
    throw new Error("Missing required fields");
  }

  try {
    // Transaction to update User and create CandidateProfile
    await prisma.$transaction(async (tx) => {
      // 1. Update User name (or create if missing - handling sync issues)
      await tx.user.upsert({
        where: { id: user.id },
        update: { name },
        create: {
          id: user.id,
          email: user.email!,
          name,
          role: "CANDIDATE", // Default/Assumption - validated by onboarding path usually
          passwordHash: "managed_by_supabase",
        },
      });

      // 2. Create CandidateProfile
      // Note: Skills and Locations are omitted for this initial implementation
      // to keep it simple. They can be added in a separate step or enhanced later.
      await tx.candidateProfile.create({
        data: {
          userId: user.id,
          gender,
          age,
          bio,
        },
      });
    });
  } catch (error) {
    console.error("Failed to create candidate profile:", error);
    throw new Error("Failed to create profile");
  }

  redirect("/");
}
