/*
  Warnings:

  - You are about to drop the column `name` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `prefectureCode` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prefectureId,city,street]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `level` to the `JobPostingSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefectureId` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('MUST', 'NICE');

-- DropIndex
DROP INDEX "public"."Location_prefectureCode_key";

-- AlterTable
ALTER TABLE "JobPostingSkill" DROP COLUMN "level",
ADD COLUMN     "level" "Level" NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "name",
DROP COLUMN "prefectureCode",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "prefectureId" INTEGER NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'guest',
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "Prefecture" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Prefecture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prefecture_code_key" ON "Prefecture"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Prefecture_name_key" ON "Prefecture"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_prefectureId_city_street_key" ON "Location"("prefectureId", "city", "street");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_prefectureId_fkey" FOREIGN KEY ("prefectureId") REFERENCES "Prefecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
