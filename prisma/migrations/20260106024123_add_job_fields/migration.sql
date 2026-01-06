/*
  Warnings:

  - Added the required column `proficiency` to the `JobPostingSkill` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `level` on the `JobPostingSkill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `proficiency` to the `UserSkill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('MUST', 'NICE');

-- CreateEnum
CREATE TYPE "SkillProficiency" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN     "employmentType" TEXT NOT NULL DEFAULT '正社員',
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "JobPostingSkill" ADD COLUMN     "proficiency" "SkillProficiency" NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "SkillLevel" NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "capital" TEXT,
ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "foundedDate" TIMESTAMP(3),
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- AlterTable
ALTER TABLE "UserSkill" ADD COLUMN     "proficiency" "SkillProficiency" NOT NULL;

-- DropEnum
DROP TYPE "public"."Level";
