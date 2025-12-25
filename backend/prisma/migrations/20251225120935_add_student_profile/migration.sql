/*
  Warnings:

  - You are about to drop the column `address` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `englishProficiency` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `gpa` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `passportNumber` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `previousEducation` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `referenceContact` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `ranking` on the `School` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD', 'DIPLOMA');

-- CreateEnum
CREATE TYPE "EnglishLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'NATIVE');

-- DropIndex
DROP INDEX "School_country_idx";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "dateOfBirth",
DROP COLUMN "englishProficiency",
DROP COLUMN "gpa",
DROP COLUMN "nationality",
DROP COLUMN "passportNumber",
DROP COLUMN "postalCode",
DROP COLUMN "previousEducation",
DROP COLUMN "referenceContact",
ADD COLUMN     "additionalInfo" TEXT;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "logoUrl",
DROP COLUMN "ranking",
ADD COLUMN     "logo" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "address" TEXT,
    "educationLevel" "EducationLevel",
    "currentInstitution" TEXT,
    "major" TEXT,
    "gpa" TEXT,
    "englishLevel" "EnglishLevel",
    "workExperience" TEXT,
    "personalStatement" TEXT,
    "profileCompletionPercentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "StudentProfile_userId_idx" ON "StudentProfile"("userId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
