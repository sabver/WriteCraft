// spec: 001-database  AC-1.1, AC-1.2, AC-2.1–2.5
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// ─── Validation schemas ───────────────────────────────────────────────────────

const CreateSessionSchema = z.object({
  scene: z.enum(['INTERVIEW', 'DAILY']),
  context: z.record(z.string(), z.string()),
  sourceText: z.string().min(1),
  userTranslation: z.string().min(1),
  aiReference: z.string().min(1),
  issues: z.array(
    z.object({
      type: z.enum(['GRAMMAR', 'WORD_CHOICE', 'STRUCTURE']),
      title: z.string().min(1),
      original: z.string().min(1),
      revised: z.string().min(1),
      reason: z.string().min(1),
      severity: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      sortOrder: z.number().int().min(0),
    }),
  ),
})

// ─── POST /api/sessions ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = CreateSessionSchema.parse(body)

    const session = await prisma.translationSession.create({
      data: {
        scene: input.scene,
        context: input.context,
        sourceText: input.sourceText,
        userTranslation: input.userTranslation,
        aiReference: input.aiReference,
        issues: {
          createMany: {
            data: input.issues,
          },
        },
      },
      select: { id: true },
    })

    return NextResponse.json({ success: true, data: { id: session.id } }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues?.[0]?.message ?? error.message
      return NextResponse.json({ success: false, error: msg }, { status: 400 })
    }
    throw error
  }
}

// ─── GET /api/sessions ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const scene = searchParams.get('scene')
  const range = searchParams.get('range')
  const q = searchParams.get('q')

  // Build dynamic where clause
  const where: Record<string, unknown> = {}

  if (scene && scene !== 'all') {
    where.scene = scene.toUpperCase()
  }

  if (range && range !== 'all') {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : null
    if (days !== null) {
      where.createdAt = { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    }
  }

  if (q) {
    where.OR = [
      { sourceText: { contains: q, mode: 'insensitive' } },
      { userTranslation: { contains: q, mode: 'insensitive' } },
    ]
  }

  const sessions = await prisma.translationSession.findMany({
    where,
    include: { _count: { select: { issues: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const data = sessions.map((s) => ({
    id: s.id,
    scene: s.scene,
    context: s.context as Record<string, string>,
    sourceText: s.sourceText,
    userTranslation: s.userTranslation,
    issueCount: s._count.issues,
    createdAt: s.createdAt.toISOString(),
  }))

  return NextResponse.json({ success: true, data, meta: { total: data.length } })
}
