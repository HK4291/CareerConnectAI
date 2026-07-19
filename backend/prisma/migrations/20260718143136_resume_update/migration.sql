/*
  Warnings:

  - You are about to drop the column `candidateId` on the `resume_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `resume_analyses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resumeId]` on the table `resume_analyses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resumeId` to the `resume_analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `resume_analyses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'S3');

-- CreateEnum
CREATE TYPE "ResumeSyncStatus" AS ENUM ('SYNCED', 'PENDING', 'FAILED');

-- DropForeignKey
ALTER TABLE "resume_analyses" DROP CONSTRAINT "resume_analyses_candidateId_fkey";

-- DropIndex
DROP INDEX "resume_analyses_candidateId_idx";

-- AlterTable
ALTER TABLE "resume_analyses" DROP COLUMN "candidateId",
DROP COLUMN "resumeUrl",
ADD COLUMN     "parsedData" JSONB,
ADD COLUMN     "resumeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageProvider" "StorageProvider" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "syncStatus" "ResumeSyncStatus" NOT NULL DEFAULT 'SYNCED',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_versions" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resumes_candidateId_idx" ON "resumes"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "resume_versions_resumeId_version_key" ON "resume_versions"("resumeId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "resume_analyses_resumeId_key" ON "resume_analyses"("resumeId");

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_analyses" ADD CONSTRAINT "resume_analyses_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
