// spec: 001-database  AC-3.1, AC-4.1–4.3, AC-5.1–5.3
import type { Flashcard } from '@/lib/types'

// ─── Save flashcards ──────────────────────────────────────────────────────────

export async function saveFlashcards(
  cards: Omit<Flashcard, 'id' | 'createdAt' | 'interval' | 'easeFactor' | 'nextReviewDate'>[],
): Promise<void> {
  if (cards.length === 0) return
  const first = cards[0]

  const body = {
    sessionId: first.sessionId,
    mode: 'PARAGRAPH' as const,
    scene: first.scene.toUpperCase() as 'INTERVIEW' | 'DAILY',
    context: first.context,
    cards: cards.map((c) => ({
      front: c.front,
      backUserTranslation: c.back.userTranslation,
      backAiRevision: c.back.aiRevision,
      backFeedbackSummary: c.back.feedbackSummary,
    })),
  }

  const res = await fetch('/api/flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' })) as { error?: string }
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
}

// ─── Get due flashcards ───────────────────────────────────────────────────────

type ApiFlashcard = Omit<Flashcard, 'scene'> & { scene: 'INTERVIEW' | 'DAILY' }

export async function getDueFlashcards(): Promise<Flashcard[]> {
  const res = await fetch('/api/flashcards/due')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json() as { data: ApiFlashcard[] }
  return json.data.map((c) => ({
    ...c,
    scene: c.scene.toLowerCase() as 'interview' | 'daily',
  }))
}

// ─── Rate a flashcard ─────────────────────────────────────────────────────────

export async function updateFlashcard(id: string, rating: number): Promise<void> {
  const res = await fetch(`/api/flashcards/${id}/rate`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
