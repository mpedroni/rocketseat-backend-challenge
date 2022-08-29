/*
  Warnings:

  - You are about to drop the column `challengeId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryUrl` on the `Submission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_challengeId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "challengeId",
DROP COLUMN "repositoryUrl",
ADD COLUMN     "challenge_id" TEXT,
ADD COLUMN     "repository_url" TEXT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
