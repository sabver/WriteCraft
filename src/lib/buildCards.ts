// spec: 003-flashcard-ai-revision-display  plan §6
// Extracted from generate/page.tsx to allow unit testing.
import type { ReviewIssue, SceneType, Flashcard } from '@/lib/types'

export interface SessionDraft {
  sessionId: string
  scene: 'INTERVIEW' | 'DAILY'
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  issues: ReviewIssue[]
}

export type FlashcardInput = Omit<Flashcard, 'id' | 'createdAt' | 'interval' | 'easeFactor' | 'nextReviewDate'>

export function buildCards(draft: SessionDraft, mode: 'paragraph' | 'sentence'): FlashcardInput[] {
  const scene = draft.scene.toLowerCase() as SceneType
  if (mode === 'paragraph') {
    return [{
      sessionId: draft.sessionId,
      front: draft.sourceText,
      back: {
        userTranslation: draft.userTranslation,
        issues: draft.issues,
      },
      scene,
      context: draft.context,
    }]
  }
  return draft.issues.map(iss => ({
    sessionId: draft.sessionId,
    front: iss.original,
    back: {
      userTranslation: iss.original,
      issues: [iss],
    },
    scene,
    context: draft.context,
  }))
}
