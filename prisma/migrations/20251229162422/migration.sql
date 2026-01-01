/*
  Warnings:

  - You are about to drop the `dashboard_routes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions_dashboard_routes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rbac_routes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dashboard_routes" DROP CONSTRAINT "dashboard_routes_parentId_fkey";

-- DropForeignKey
ALTER TABLE "permissions_dashboard_routes" DROP CONSTRAINT "permissions_dashboard_routes_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "permissions_dashboard_routes" DROP CONSTRAINT "permissions_dashboard_routes_routeId_fkey";

-- DropTable
DROP TABLE "dashboard_routes";

-- DropTable
DROP TABLE "permissions_dashboard_routes";

-- DropTable
DROP TABLE "rbac_routes";
