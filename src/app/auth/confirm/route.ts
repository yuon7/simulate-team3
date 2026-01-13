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
    try {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      error = exchangeError;
    } catch (err) {
      console.error("Auth Code Exchange Failed:", err);
      // Manually construct an error object if catch block behaves unexpectedly or redirects to error page
      error = {
        message: "Authentication failed. Please try logging in again.",
      };
    }
  } else {
    // No valid parameters found
    redirect("/notFoundTitle");
  }

  if (!error) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.email) {
      const { prisma } = await import("@/lib/prisma");
      const { UserRole } = await import("@prisma/client");

      const role =
        user.user_metadata.role === "STAFF"
          ? UserRole.STAFF
          : UserRole.CANDIDATE;

      console.log(`Confirming user ${user.email} with role ${role}`);

      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              passwordHash: "managed_by_supabase",
              role,
            },
          });
          console.log(`Created Prisma user for ${user.email}`);
        }
      } catch (dbError) {
        console.error("Failed to sync user with Prisma:", dbError);
        // Continue anyway, as the Supabase session is established
      }

      const redirectPath =
        role === UserRole.STAFF
          ? "/onboarding/company"
          : "/onboarding/candidate";

      console.log(`Redirecting confirmed user to ${redirectPath}`);
      redirect(redirectPath);
    }

    console.log("No user found after confirmation, redirecting to home");
    redirect(next);
  }

  // redirect the user to an error page with some instructions
  // Redirect to login with error details
  const errorMsg = error
    ? (error as any).message || "Verification failed"
    : "Verification failed";
  console.error("Verification Error:", errorMsg);
  redirect(
    `/auth/login?error=verification_failed&message=${encodeURIComponent(errorMsg)}`,
  );
}
