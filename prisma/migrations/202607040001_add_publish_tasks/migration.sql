-- CreateTable
CREATE TABLE "PublishTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "contentType" TEXT NOT NULL DEFAULT 'video',
    "publishMode" TEXT NOT NULL DEFAULT 'scheduled',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "scheduledAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'queued',
    "mediaFileName" TEXT,
    "coverFileName" TEXT,
    "youtubeVideoId" TEXT,
    "youtubeUrl" TEXT,
    "errorMessage" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublishTask_userId_status_createdAt_idx" ON "PublishTask"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "PublishTask_socialAccountId_createdAt_idx" ON "PublishTask"("socialAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "PublishTask_platform_status_idx" ON "PublishTask"("platform", "status");

-- AddForeignKey
ALTER TABLE "PublishTask" ADD CONSTRAINT "PublishTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishTask" ADD CONSTRAINT "PublishTask_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
