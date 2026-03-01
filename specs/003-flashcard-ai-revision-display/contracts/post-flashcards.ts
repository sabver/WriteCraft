// Contract: POST /api/flashcards
// spec: 003-flashcard-ai-revision-display  plan §4.1

// ─── Request Body ─────────────────────────────────────────────────────────────

export interface PostFlashcardsRequest {
  sessionId: string
  mode: 'PARAGRAPH' | 'SENTENCE'
  scene: 'INTERVIEW' | 'DAILY'
  context: Record<string, string>
  cards: Array<{
    front: string
    backUserTranslation: string
    /** Full issue objects — replaces backAiRevision + backFeedbackSummary */
    backIssues: Array<{
      id: string
      type: 'grammar' | 'word-choice' | 'structure'
      title: string
      original: string
      revised: string
      reason: string
      severity: 'high' | 'medium' | 'low'
    }>
  }>
}

// ─── Response (201) ───────────────────────────────────────────────────────────

export interface PostFlashcardsResponse {
  success: true
  data: { ids: string[] }
}

// ─── Response (400) ───────────────────────────────────────────────────────────

export interface PostFlashcardsError {
  success: false
  error: string
}
