-- CreateTable
CREATE TABLE "rate_limits" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT,
    "ip" TEXT,
    "action" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_limits_userId_idx" ON "rate_limits"("userId");

-- CreateIndex
CREATE INDEX "rate_limits_ip_idx" ON "rate_limits"("ip");

-- CreateIndex
CREATE INDEX "rate_limits_action_idx" ON "rate_limits"("action");

-- AddForeignKey
ALTER TABLE "rate_limits" ADD CONSTRAINT "rate_limits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
