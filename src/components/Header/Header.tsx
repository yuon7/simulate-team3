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
    const dbUser = (await prisma.user.findUnique({
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
    }
  }

  return (
    <header className={headerSectionStyles.header}>
      <HeaderContent user={userDetail} avatarUrl={signedAvatarUrl} />
    </header>
  );
}
