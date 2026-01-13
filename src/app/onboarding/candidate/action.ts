"use server";

import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createCandidateProfile(prevState: any, formData: FormData) {
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
  const prefectureId = formData.get("prefectureId") as string;
  const city = formData.get("city") as string;
  const avatarFile = formData.get("avatar") as File | null;

  // Validation
  if (!name || !gender || isNaN(age)) {
    return { error: "必須項目が入力されていません" };
  }

  try {
    let avatarUrl = null;

    // Upload avatar if provided
    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) {
        console.error("Avatar upload error:", uploadError);
        return { error: "画像のアップロードに失敗しました" };
      }
      
      avatarUrl = fileName;
    }

    // Transaction to update User and create CandidateProfile
    await prisma.$transaction(async (tx) => {
      // 1. Update User name and avatar
      await tx.user.upsert({
        where: { id: user.id },
        update: { 
          name,
          ...(avatarUrl && { avatarUrl }),
        },
        create: {
          id: user.id,
          email: user.email!,
          name,
          role: "CANDIDATE",
          passwordHash: "managed_by_supabase",
          ...(avatarUrl && { avatarUrl }),
        },
      });

      // 2. Create CandidateProfile
      await tx.candidateProfile.create({
        data: {
          userId: user.id,
          gender,
          age,
          bio,
        },
      });

      // 3. Create birthplace location if provided
      if (prefectureId && city) {
        const location = await tx.location.upsert({
          where: {
            prefectureId_city_street: {
              prefectureId: parseInt(prefectureId),
              city,
              street: "",
            },
          },
          update: {},
          create: {
            prefectureId: parseInt(prefectureId),
            city,
            street: "",
          },
        });

        // Link as desired location (you might want a separate birthplace field)
        await tx.desiredLocation.create({
          data: {
            candidateId: user.id,
            locationId: location.id,
          },
        });
      }
    });
  } catch (error) {
    console.error("Failed to create candidate profile:", error);
    return { error: "プロフィールの作成に失敗しました" };
  }

  redirect("/");
}
