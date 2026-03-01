-- CreateEnum
CREATE TYPE "SceneType" AS ENUM ('INTERVIEW', 'DAILY');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('GRAMMAR', 'WORD_CHOICE', 'STRUCTURE');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "FlashcardMode" AS ENUM ('PARAGRAPH', 'SENTENCE');

-- CreateTable
CREATE TABLE "TranslationSession" (
    "id" TEXT NOT NULL,
    "scene" "SceneType" NOT NULL,
    "context" JSONB NOT NULL,
    "sourceText" TEXT NOT NULL,
    "userTranslation" TEXT NOT NULL,
    "aiReference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewIssue" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "IssueType" NOT NULL,
    "title" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "revised" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "scene" "SceneType" NOT NULL,
    "context" JSONB NOT NULL,
    "mode" "FlashcardMode" NOT NULL,
    "front" TEXT NOT NULL,
    "backUserTranslation" TEXT NOT NULL,
    "backAiRevision" TEXT NOT NULL,
    "backFeedbackSummary" JSONB NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewLog" (
    "id" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "intervalBefore" INTEGER NOT NULL,
    "easeFactorBefore" DOUBLE PRECISION NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranslationSession_scene_idx" ON "TranslationSession"("scene");

-- CreateIndex
CREATE INDEX "TranslationSession_createdAt_idx" ON "TranslationSession"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ReviewIssue_sessionId_idx" ON "ReviewIssue"("sessionId");

-- CreateIndex
CREATE INDEX "Flashcard_nextReviewDate_idx" ON "Flashcard"("nextReviewDate");

-- CreateIndex
CREATE INDEX "Flashcard_sessionId_idx" ON "Flashcard"("sessionId");

-- CreateIndex
CREATE INDEX "ReviewLog_flashcardId_idx" ON "ReviewLog"("flashcardId");

-- AddForeignKey
ALTER TABLE "ReviewIssue" ADD CONSTRAINT "ReviewIssue_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TranslationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TranslationSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewLog" ADD CONSTRAINT "ReviewLog_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
