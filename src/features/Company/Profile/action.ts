"use server";

import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateCompanyProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get staff profile to find organization
  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId: user.id },
  });

  if (!staffProfile) {
    throw new Error("Staff profile not found");
  }

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const websiteUrl = formData.get("websiteUrl") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const description = formData.get("description") as string;
  const employeeCount = formData.get("employeeCount") ? parseInt(formData.get("employeeCount") as string) : null;
  const capital = formData.get("capital") as string;

  try {
    await prisma.organization.update({
      where: { id: staffProfile.organizationId },
      data: {
        name,
        industry,
        websiteUrl,
        logoUrl,
        description,
        employeeCount,
        capital,
      },
    });
  } catch (error) {
    console.error("Failed to update organization:", error);
    throw new Error("Failed to update profile");
  }

  revalidatePath("/company");
  redirect("/company");
}
