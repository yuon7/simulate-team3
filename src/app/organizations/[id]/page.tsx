import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrganizationProfileContent } from "@/features/Organization/OrganizationProfileContent";
import { createClient } from "@/lib/supabase/server";

export default async function OrganizationProfilePage({ params }: { params: any }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      location: {
        include: { prefecture: true }
      },
      jobPostings: {
        include: {
          location: {
            include: { prefecture: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!organization) {
    notFound();
  }

  let logoUrl = null;
  if (organization.logoUrl) {
    const supabase = await createClient();
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(organization.logoUrl, 3600);
    logoUrl = data?.signedUrl || null;
  }

  const organizationWithSignedUrl = {
    ...organization,
    logoUrl: logoUrl || organization.logoUrl,
  };

  return <OrganizationProfileContent organization={organizationWithSignedUrl} />;
}
