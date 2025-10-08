"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma/server";

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
    const errorMessages: { [key: string]: string } = {
      "Invalid login credentials":
        "メールアドレスまたはパスワードが間違っています。",
    };
    const errorMessage = errorMessages[error.message] || error.message;
    redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/todo", "layout");
  redirect("/todo");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error) {
    const errorMessages: { [key: string]: string } = {
      "User already registered": "このメールアドレスは既に登録されています。",
    };
    const errorMessage = errorMessages[error.message] || error.message;
    redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
  }
  // prismaに追加
  if (signUpData?.user) {
    try {
      await prisma.user.create({data: {
        email: data.email,
      },
    });
    } catch (err: any) {
      console.error("Prisma User 作成エラー:", err.message);
    }
  }

  if (signUpData?.user && signUpData.user.identities?.length === 0) {
    redirect(
      `/auth/login?error=${encodeURIComponent("このメールアドレスは既に登録されています。")}`
    );
  }

  redirect(`/auth/confirmSignup?email=${encodeURIComponent(data.email)}`);
}
