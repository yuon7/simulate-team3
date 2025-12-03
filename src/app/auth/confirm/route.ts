import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();
  let error = null;

  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    error = verifyError;
  } else if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code,
    );
    error = exchangeError;
  } else {
    // No valid parameters found
    redirect("/notFoundTitle");
  }

  if (!error) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.email) {
      const { PrismaClient, UserRole } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const role =
        user.user_metadata.role === "STAFF"
          ? UserRole.STAFF
          : UserRole.CANDIDATE;

      // Check if user already exists to avoid errors on re-confirmation
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id, // Sync Supabase ID with Prisma ID
              email: user.email,
              passwordHash: "managed_by_supabase", // Placeholder
              role: role,
            },
          });
        }
      } catch (error) {
        console.error("Failed to create user in Prisma:", error);
        // Optional: redirect to an error page or continue to allow login (if user exists)
      }

      // Redirect to appropriate onboarding page
      const redirectPath =
        role === UserRole.STAFF
          ? "/onboarding/company"
          : "/onboarding/candidate";
      redirect(redirectPath);
    }

    // Fallback redirect
    redirect(next);
  }

  // redirect the user to an error page with some instructions
  redirect("/notFoundTitle");
}
