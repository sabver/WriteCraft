// spec: 001-database  AC-1.3, AC-3.2, AC-6.1
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const session = await prisma.translationSession.findUniqueOrThrow({
      where: { id },
      include: {
        issues: { orderBy: { sortOrder: 'asc' } },
        flashcards: { select: { id: true } },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        scene: session.scene,
        context: session.context as Record<string, string>,
        sourceText: session.sourceText,
        userTranslation: session.userTranslation,
        aiReference: session.aiReference,
        createdAt: session.createdAt.toISOString(),
        issues: session.issues,
        flashcardIds: session.flashcards.map((f) => f.id),
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 })
  }
}
