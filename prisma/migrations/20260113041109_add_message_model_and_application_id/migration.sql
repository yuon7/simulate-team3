/*
  Warnings:

  - The primary key for the `Application` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[candidateId,jobPostingId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Application" DROP CONSTRAINT "Application_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Application_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_candidateId_jobPostingId_key" ON "Application"("candidateId", "jobPostingId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
