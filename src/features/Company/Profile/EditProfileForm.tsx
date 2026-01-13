import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { EditProfileFormClient } from "./EditProfileFormClient";

export async function EditProfileForm() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const prisma = new PrismaClient();
  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId: user.id },
    include: {
      organization: {
        include: {
          location: true,
        },
      },
    },
  });

  if (!staffProfile || !staffProfile.organization) {
    return <div>組織情報が見つかりません</div>;
  }

  const { organization } = staffProfile;

  // Get signed URL if logoUrl exists
  let signedLogoUrl = null;
  if (organization.logoUrl) {
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(organization.logoUrl, 60 * 60);
    signedLogoUrl = data?.signedUrl;
  }

  return (
    <EditProfileFormClient 
      organization={organization as any} 
      initialLogoUrl={signedLogoUrl}
    />
  );
}
