// Contract: GET /api/flashcards/due
// spec: 003-flashcard-ai-revision-display  plan §4.2

// ─── Response (200) ───────────────────────────────────────────────────────────

interface GetFlashcardsDueResponse {
  success: true
  data: Array<{
    id: string
    sessionId: string
    scene: 'INTERVIEW' | 'DAILY'
    context: Record<string, string>
    mode: 'PARAGRAPH' | 'SENTENCE'
    front: string
    back: {
      userTranslation: string
      /** Full issue objects — replaces aiRevision + feedbackSummary */
      issues: Array<{
        id: string
        type: 'grammar' | 'word-choice' | 'structure'
        title: string
        original: string
        revised: string
        reason: string
        severity: 'high' | 'medium' | 'low'
      }>
    }
    interval: number
    easeFactor: number
    repetitions: number
    nextReviewDate: string  // ISO 8601
    createdAt: string       // ISO 8601
  }>
}
