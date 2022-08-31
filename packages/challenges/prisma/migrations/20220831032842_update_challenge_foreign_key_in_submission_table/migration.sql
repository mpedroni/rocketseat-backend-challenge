/*
  Warnings:

  - You are about to drop the column `challenge_id` on the `Submission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_challenge_id_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "challenge_id",
ADD COLUMN     "challengeId" TEXT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
