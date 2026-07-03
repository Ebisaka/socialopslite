CREATE TABLE "MetricSnapshot" (
    "id" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subscriberCount" INTEGER,
    "viewCount" BIGINT,
    "videoCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetricSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MetricSnapshot_socialAccountId_date_key" ON "MetricSnapshot"("socialAccountId", "date");

CREATE INDEX "MetricSnapshot_socialAccountId_date_idx" ON "MetricSnapshot"("socialAccountId", "date");

CREATE INDEX "MetricSnapshot_platform_date_idx" ON "MetricSnapshot"("platform", "date");

ALTER TABLE "MetricSnapshot" ADD CONSTRAINT "MetricSnapshot_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
