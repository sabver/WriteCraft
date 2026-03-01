// spec: 001-database  AC-4.1–4.3
// spec: 003-flashcard-ai-revision-display  plan §4.2
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ReviewIssue } from '@/lib/types'

// ─── GET /api/flashcards/due ─────────────────────────────────────────────────

export async function GET(_request: NextRequest) {
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const cards = await prisma.flashcard.findMany({
    where: { nextReviewDate: { lte: endOfToday } },
    orderBy: [{ repetitions: 'asc' }, { createdAt: 'asc' }],
  })

  const data = cards.map((c) => ({
    id: c.id,
    sessionId: c.sessionId,
    scene: c.scene,
    context: c.context,
    mode: c.mode,
    front: c.front,
    back: {
      userTranslation: c.backUserTranslation,
      issues: c.backIssues as unknown as ReviewIssue[],
    },
    interval: c.interval,
    easeFactor: c.easeFactor,
    repetitions: c.repetitions,
    nextReviewDate: c.nextReviewDate.toISOString(),
    createdAt: c.createdAt.toISOString(),
  }))

  return NextResponse.json({ success: true, data })
}
