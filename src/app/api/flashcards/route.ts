// spec: 001-database  AC-3.1, AC-3.3, AC-3.4
// spec: 003-flashcard-ai-revision-display  plan §4.1
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// ─── Validation schema ────────────────────────────────────────────────────────

const issueSchema = z.object({
  id: z.string(),
  type: z.enum(['grammar', 'word-choice', 'structure']),
  title: z.string(),
  original: z.string(),
  revised: z.string(),
  reason: z.string(),
  severity: z.enum(['high', 'medium', 'low']),
})

const SaveFlashcardsSchema = z.object({
  sessionId: z.string().min(1),
  mode: z.enum(['PARAGRAPH', 'SENTENCE']),
  scene: z.enum(['INTERVIEW', 'DAILY']),
  context: z.record(z.string(), z.string()),
  cards: z.array(
    z.object({
      front: z.string().min(1),
      backUserTranslation: z.string(),
      backIssues: z.array(issueSchema).default([]),
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
            backIssues: card.backIssues,
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
