-- CreateEnum
CREATE TYPE "ResumeParseStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "parseStatus" "ResumeParseStatus" NOT NULL DEFAULT 'PENDING';
