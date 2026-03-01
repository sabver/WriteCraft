// spec: 001-database  AC-5.1, AC-5.2, AC-5.3
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { applyRating } from '@/lib/sm2'

// ─── Validation schema ────────────────────────────────────────────────────────

const RateSchema = z.object({
  rating: z.number().int().min(0).max(5),
})

// ─── PATCH /api/flashcards/[id]/rate ─────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { rating } = RateSchema.parse(body)

    const card = await prisma.flashcard.findUnique({ where: { id } })
    if (!card) {
      return NextResponse.json({ success: false, error: 'Flashcard not found' }, { status: 404 })
    }

    const sm2 = applyRating(rating, card.interval, card.easeFactor, card.repetitions)

    const updated = await prisma.$transaction(async (tx) => {
      await tx.reviewLog.create({
        data: {
          flashcardId: id,
          rating,
          intervalBefore: card.interval,
          easeFactorBefore: card.easeFactor,
        },
      })
      return tx.flashcard.update({
        where: { id },
        data: {
          interval: sm2.interval,
          easeFactor: sm2.easeFactor,
          repetitions: sm2.repetitions,
          nextReviewDate: sm2.nextReviewDate,
        },
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        interval: updated.interval,
        easeFactor: updated.easeFactor,
        repetitions: updated.repetitions,
        nextReviewDate: updated.nextReviewDate.toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues?.[0]?.message ?? error.message
      return NextResponse.json({ success: false, error: msg }, { status: 400 })
    }
    throw error
  }
}
