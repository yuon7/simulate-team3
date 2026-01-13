-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_jobPostingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobPostingSkill" DROP CONSTRAINT "JobPostingSkill_jobPostingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MatchingScore" DROP CONSTRAINT "MatchingScore_jobPostingId_fkey";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPostingSkill" ADD CONSTRAINT "JobPostingSkill_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingScore" ADD CONSTRAINT "MatchingScore_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
