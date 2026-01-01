/*
  Warnings:

  - You are about to drop the column `permission` on the `rbac_routes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rbac_routes" DROP COLUMN "permission",
ADD COLUMN     "permissions" TEXT[];
