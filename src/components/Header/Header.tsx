import { HeaderContent } from "../../features/Header/HeaderContent";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import headerSectionStyles from "./Header.module.css";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userDetail = null;
  let signedAvatarUrl = null;

  if (user) {
    let dbUser = (await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        role: true,
        avatarUrl: true,
        name: true,
        email: true,
        staff: {
          include: {
            organization: {
              select: { logoUrl: true },
            },
          },
        },
      },
    })) as any;

    // Fallback: If user exists in Supabase but not in Prisma with that ID, 
    // try to match by email (for pre-seeded mock users)
    if (!dbUser && user.email) {
      console.log(`User ${user.email} not found by ID in Prisma. Attempting email match...`);
      const seededUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (seededUser) {
        console.log(`Found seeded user for ${user.email}. Syncing IDs in Header...`);
        try {
          await prisma.$transaction(async (tx) => {
            const staff = await tx.staffProfile.findUnique({ where: { userId: seededUser.id } });
            const candidate = await tx.candidateProfile.findUnique({ where: { userId: seededUser.id } });

            await tx.user.delete({ where: { id: seededUser.id } });
            
            await tx.user.create({
              data: {
                id: user.id,
                email: user.email!,
                passwordHash: seededUser.passwordHash,
                role: seededUser.role,
                name: seededUser.name,
              }
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
          });
          
          // Re-fetch dbUser after sync
          dbUser = (await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              role: true,
              avatarUrl: true,
              name: true,
              email: true,
              staff: {
                include: {
                  organization: {
                    select: { logoUrl: true },
                  },
                },
              },
            },
          })) as any;
          console.log(`Successfully synced seeded user ${user.email} in Header.`);
        } catch (syncError) {
          console.error("Failed to sync seeded user in Header:", syncError);
        }
      }
    }

    if (dbUser) {
      userDetail = {
        ...user,
        role: dbUser.role,
        name: dbUser.name,
      };

      const effectiveAvatarUrl =
        dbUser.avatarUrl || dbUser.staff?.organization?.logoUrl;

      if (effectiveAvatarUrl) {
        const { data } = await supabase.storage
          .from("avatars")
          .createSignedUrl(effectiveAvatarUrl, 3600); // 1 hour validity
        signedAvatarUrl = data?.signedUrl || null;
      }
    } else {
      // Final fallback: Use Supabase info if Prisma still missing
      userDetail = {
        ...user,
        role: user.user_metadata.role || "CANDIDATE",
        name: user.user_metadata.full_name || user.email?.split('@')[0],
      };
    }
  }

  return (
    <header className={headerSectionStyles.header}>
      <HeaderContent user={userDetail} avatarUrl={signedAvatarUrl} />
    </header>
  );
}
