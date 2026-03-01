-- spec: 003-flashcard-ai-revision-display  plan §2.2
-- Replace backAiRevision (String) and backFeedbackSummary (Json string[])
-- with backIssues (Json ReviewIssue[]) on the Flashcard table.
-- Existing rows receive backIssues = '[]' (legacy graceful degradation).

ALTER TABLE "Flashcard" DROP COLUMN "backAiRevision";
ALTER TABLE "Flashcard" DROP COLUMN "backFeedbackSummary";
ALTER TABLE "Flashcard" ADD COLUMN "backIssues" JSONB NOT NULL DEFAULT '[]';
