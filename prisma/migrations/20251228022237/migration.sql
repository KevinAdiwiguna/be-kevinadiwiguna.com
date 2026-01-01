-- CreateTable
CREATE TABLE "rbac_routes" (
    "id" BIGSERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "permission" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rbac_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_routes" (
    "id" BIGSERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "label" TEXT,
    "icon" TEXT,
    "parentId" BIGINT,
    "order" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions_dashboard_routes" (
    "permissionId" BIGINT NOT NULL,
    "routeId" BIGINT NOT NULL,

    CONSTRAINT "permissions_dashboard_routes_pkey" PRIMARY KEY ("permissionId","routeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "rbac_routes_path_key" ON "rbac_routes"("path");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_routes_path_key" ON "dashboard_routes"("path");

-- AddForeignKey
ALTER TABLE "dashboard_routes" ADD CONSTRAINT "dashboard_routes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "dashboard_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions_dashboard_routes" ADD CONSTRAINT "permissions_dashboard_routes_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions_dashboard_routes" ADD CONSTRAINT "permissions_dashboard_routes_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "dashboard_routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
