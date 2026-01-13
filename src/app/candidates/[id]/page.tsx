import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CandidateProfileContent } from "@/features/Candidate/CandidateProfileContent";

export default async function CandidateProfilePage({ params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const candidate = await prisma.candidateProfile.findUnique({
    where: { userId: id },
    include: {
      user: true,
      userSkills: {
        include: { skill: true }
      },
      desiredLocations: {
        include: {
          location: {
            include: { prefecture: true }
          }
        }
      },
      desiredJob: true,
    }
  });

  if (!candidate) {
    notFound();
  }

  let avatarUrl = null;
  if (candidate.user.avatarUrl) {
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(candidate.user.avatarUrl, 3600);
    avatarUrl = data?.signedUrl || null;
  }

  // Determine if current user can message this candidate
  let applicationId = null;
  if (currentUser) {
    const staff = await prisma.staffProfile.findUnique({
      where: { userId: currentUser.id },
    });

    if (staff) {
      const application = await prisma.application.findFirst({
        where: {
          candidateId: id,
          jobPosting: {
            organizationId: staff.organizationId,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      applicationId = (application as any)?.id || null;
    }
  }

  return (
    <CandidateProfileContent 
      candidate={candidate} 
      avatarUrl={avatarUrl} 
      applicationId={applicationId} 
      currentUserId={currentUser?.id || null}
    />
  );
}
