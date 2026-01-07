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

  const { data: { user }, error } = await supabase.auth.signInWithPassword(data);

  if (error || !user) {
    redirect("/auth/login?error=invalid_credentials");
  }

  // Sync with Prisma
  const { prisma } = await import("@/lib/prisma"); // Dynamically import to avoid edge issues if any
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { candidate: true, staff: true }, 
    });

    if (!existingUser) {
      // User signed up but didn't complete /auth/confirm flow properly (or side-stepped)
      // Create user from metadata
      const roleStr = user.user_metadata.role;
      let role: "CANDIDATE" | "STAFF" = "CANDIDATE";
      
      if (roleStr === "STAFF") role = "STAFF";

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          passwordHash: "managed_by_supabase",
          role: role,
        },
      });

      // Redirect to onboarding
      revalidatePath("/", "layout");
      redirect(role === "STAFF" ? "/onboarding/company" : "/onboarding/candidate");
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
  return error && typeof error === 'object' && error.digest?.startsWith('NEXT_REDIRECT');
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
