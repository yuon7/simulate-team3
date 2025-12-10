"use server";

import { createClient } from "@/lib/supabase/server";
import { PrismaClient, OrganizationType } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createCompanyProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/auth/login");
  }

  const orgName = formData.get("orgName") as string;
  const orgType = formData.get("orgType") as OrganizationType;
  const prefectureId = parseInt(formData.get("prefectureId") as string);
  const city = formData.get("city") as string;
  const department = formData.get("department") as string;
  const title = formData.get("title") as string;

  // Validation
  if (!orgName || !orgType || isNaN(prefectureId) || !city) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create or Find Location (Simplified: assuming creation for now)
      // In a real app, you might want to reuse locations more carefully
      const location = await tx.location.create({
        data: {
          prefectureId,
          city,
          street: "", // Optional in form, default empty
        },
      });

      // 2. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: orgName,
          organizationType: orgType,
          locationId: location.id,
        },
      });

      // 3. Create StaffProfile
      await tx.staffProfile.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          department,
          title,
        },
      });
    });
  } catch (error) {
    console.error("Failed to create company profile:", error);
    throw new Error("Failed to create profile");
  }

  redirect("/");
}
