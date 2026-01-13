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
        let existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!existingUser) {
          // Check if a user with this email was pre-seeded with a random ID
          const seededUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (seededUser) {
            console.log(
              `Matching seeded user found for ${user.email}. Syncing IDs...`,
            );

            // Re-create user with the correct Supabase ID, transferring role and name
            // Note: Since we use Prisma Client and the ID is the PK, we need to handle it carefully.
            // A simple way is to delete the seeded one and create the new one,
            // but we need to preserve relations (like StaffProfile).

            await prisma.$transaction(async (tx) => {
              // Extract relations before deleting
              const staff = await tx.staffProfile.findUnique({
                where: { userId: seededUser.id },
              });
              const candidate = await tx.candidateProfile.findUnique({
                where: { userId: seededUser.id },
              });

              await tx.user.delete({ where: { id: seededUser.id } });

              await tx.user.create({
                data: {
                  id: user.id,
                  email: user.email!,
                  passwordHash: seededUser.passwordHash,
                  role: seededUser.role,
                  name: seededUser.name,
                },
              });

              if (staff) {
                await tx.staffProfile.create({
                  data: {
                    userId: user.id,
                    organizationId: staff.organizationId,
                    department: staff.department ?? null,
                    title: staff.title ?? null,
                  },
                });
              }
              if (candidate) {
                await tx.candidateProfile.create({
                  data: {
                    userId: user.id,
                    bio: candidate.bio ?? null,
                    gender: candidate.gender,
                    age: candidate.age,
                    // Note: UserSkills might need more complex migration if we use it heavily
                  },
                });
              }
            });
            console.log(`Successfully claimed seeded user for ${user.email}`);
          } else {
            await prisma.user.create({
              data: {
                id: user.id,
                email: user.email,
                passwordHash: "managed_by_supabase",
                role,
              },
            });
            console.log(`Created new Prisma user for ${user.email}`);
          }
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
