// spec: 001-database  AC-3.1, AC-3.3, AC-3.4
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// ─── Validation schema ────────────────────────────────────────────────────────

const SaveFlashcardsSchema = z.object({
  sessionId: z.string().min(1),
  mode: z.enum(['PARAGRAPH', 'SENTENCE']),
  scene: z.enum(['INTERVIEW', 'DAILY']),
  context: z.record(z.string(), z.string()),
  cards: z.array(
    z.object({
      front: z.string().min(1),
      backUserTranslation: z.string(),
      backAiRevision: z.string(),
      backFeedbackSummary: z.array(z.string()),
    }),
  ),
})

// ─── POST /api/flashcards ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = SaveFlashcardsSchema.parse(body)

    // Verify session exists
    const session = await prisma.translationSession.findUnique({
      where: { id: input.sessionId },
      select: { id: true },
    })
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 400 },
      )
    }

    // Create cards one-by-one in a transaction to get back all ids
    // (createMany does not return ids for PostgreSQL)
    const now = new Date()
    const ids = await prisma.$transaction(
      input.cards.map((card) =>
        prisma.flashcard.create({
          data: {
            sessionId: input.sessionId,
            scene: input.scene,
            context: input.context,
            mode: input.mode,
            front: card.front,
            backUserTranslation: card.backUserTranslation,
            backAiRevision: card.backAiRevision,
            backFeedbackSummary: card.backFeedbackSummary,
            // SM-2 defaults  [spec: AC-3.1]
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
            nextReviewDate: now,
          },
          select: { id: true },
        }),
      ),
    )

    return NextResponse.json(
      { success: true, data: { ids: ids.map((r) => r.id) } },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues?.[0]?.message ?? error.message
      return NextResponse.json({ success: false, error: msg }, { status: 400 })
    }
    throw error
  }
}
