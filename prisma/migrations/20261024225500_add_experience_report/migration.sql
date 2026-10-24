-- CreateTable
CREATE TABLE "ExperienceReport" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "reporterHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExperienceReport_experienceId_idx" ON "ExperienceReport"("experienceId");

-- CreateIndex
CREATE INDEX "ExperienceReport_status_idx" ON "ExperienceReport"("status");

-- AddForeignKey
ALTER TABLE "ExperienceReport" ADD CONSTRAINT "ExperienceReport_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
