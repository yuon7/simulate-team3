"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(data);

  if (error || !user) {
    redirect("/auth/login?error=invalid_credentials");
  }

  // Sync with Prisma
  const { prisma } = await import("@/lib/prisma"); // Dynamically import to avoid edge issues if any

  try {
    let existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { candidate: true, staff: true },
    });

    if (!existingUser) {
const seededUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });
      if (seededUser) {
        console.log(`Matching seeded user found for ${user.email}. Syncing IDs...`);
        await prisma.$transaction(async (tx) => {
          const staff = await tx.staffProfile.findUnique({ where: { userId: seededUser.id } });
          const candidate = await tx.candidateProfile.findUnique({ where: { userId: seededUser.id } });
          await tx.user.delete({ where: { id: seededUser.id } });
          
          existingUser = await tx.user.create({
            data: {
              id: user.id,
              email: user.email!,
              passwordHash: seededUser.passwordHash,
              role: seededUser.role,
              name: seededUser.name,
            },
            include: { candidate: true, staff: true },
          });
          if (staff) {
            await tx.staffProfile.create({
              data: {
                userId: user.id,
                organizationId: staff.organizationId,
                department: staff.department ?? null,
                title: staff.title ?? null,
              }
            });
          }
          if (candidate) {
            await tx.candidateProfile.create({
              data: {
                userId: user.id,
                bio: candidate.bio ?? null,
                gender: candidate.gender,
                age: candidate.age,
              }
            });
          }
        }) as any;
      } else {
        // User signed up but didn't complete /auth/confirm flow properly (or side-stepped)
        // Create user from metadata
        const roleStr = user.user_metadata.role;
        let role: "CANDIDATE" | "STAFF" = "CANDIDATE";
        if (roleStr === "STAFF") role = "STAFF";
        existingUser = (await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            passwordHash: "managed_by_supabase",
            role,
          },
          include: { candidate: true, staff: true },
        })) as any;
        // Redirect to onboarding
        revalidatePath("/", "layout");
        redirect(
          role === "STAFF" ? "/onboarding/company" : "/onboarding/candidate",
        );
      }

    if (!existingUser) {
       redirect("/auth/login?error=sync_failed");
    }

    // User exists, but verify profile
    // If they have no profile, send them to onboarding
    if (existingUser.role === "CANDIDATE" && !existingUser.candidate) {
      redirect("/onboarding/candidate");
    } else if (existingUser.role === "STAFF" && !existingUser.staff) {
      redirect("/onboarding/company");
    }
  } catch (error) {
    console.error("Login Sync Error:", error);
    // If redirect was thrown, re-throw it
    if (isRedirectError(error)) throw error;
    // Otherwise implies DB error, let them thru or error?
    // Let's create user anyway if possible or fallback
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// Helper to check for redirect error (Next.js internals)
function isRedirectError(error: any) {
  return (
    error &&
    typeof error === "object" &&
    error.digest?.startsWith("NEXT_REDIRECT")
  );
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/confirm`,
      data: {
        role: formData.get("role") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // Redirect back to signup with error and role
    const role = data.options.data.role;
    redirect(
      `/auth/signup?role=${role}&error=exists&message=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  redirect(`/auth/confirmSignup?email=${encodeURIComponent(data.email)}`);
}
