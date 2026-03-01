// spec: 001-database  AC-7.1
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ─── GET /api/flashcards/count ───────────────────────────────────────────────

export async function GET(_request: NextRequest) {
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const count = await prisma.flashcard.count({
    where: { nextReviewDate: { lte: endOfToday } },
  })

  return NextResponse.json({ count })
}
