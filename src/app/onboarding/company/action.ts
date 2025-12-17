"use server";

import { createClient } from "@/lib/supabase/server";
import { PrismaClient, OrganizationType } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createCompanyProfile(prevState: any, formData: FormData) {
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
    return { error: "必須項目が入力されていません" };
  }

  // Ensure Prisma User exists and matches Supabase ID
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    // Check if a user with this email already exists but has a different ID (Stale data)
    const existingEmailUser = await prisma.user.findUnique({
        where: { email: user.email },
    });

    if (existingEmailUser) {
        console.warn(`User ID mismatch detected. Deleting stale user with ID: ${existingEmailUser.id}`);
        // Manually delete related profiles to avoid foreign key constraints
        // Check/Delete CandidateProfile
        await prisma.candidateProfile.deleteMany({
             where: { userId: existingEmailUser.id },
        });
        // Check/Delete StaffProfile
        await prisma.staffProfile.deleteMany({
             where: { userId: existingEmailUser.id },
        });
        
        // Delete the stale user
        await prisma.user.delete({
            where: { id: existingEmailUser.id },
        });
    }

    console.log("Creating new Prisma user synced from Supabase...");
    try {
        dbUser = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                passwordHash: "managed_by_supabase",
                role: "STAFF", 
            },
        });
    } catch (createError) {
        console.error("Failed to sync user:", createError);
        return { error: "ユーザー情報の同期に失敗しました" };
    }
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
  } catch (error: any) {
    console.error("Failed to create company profile details:", JSON.stringify(error, null, 2));
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
       return { error: "この組織名は既に登録されています" };
    }
    return { error: `プロフィールの作成に失敗しました: ${error.message}` };
  }

  redirect("/");
}
