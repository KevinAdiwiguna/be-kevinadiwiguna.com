/*
  Warnings:

  - Added the required column `ownerId` to the `experiences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "ownerId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
