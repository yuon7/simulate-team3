"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/auth/login?error=invalid_credentials");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/confirm`,
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
