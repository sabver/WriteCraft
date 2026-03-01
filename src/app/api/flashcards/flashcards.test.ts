// spec: 001-database  AC-3.1, AC-3.3, AC-3.4, AC-4.1–4.3, AC-5.1–5.3, AC-7.1
import { describe, it, expect, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { POST } from './route'
import { GET as getDue } from './due/route'
import { GET as getCount } from './count/route'
import { PATCH as rate } from './[id]/rate/route'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost'

async function createSessionInDB() {
  return prisma.translationSession.create({
    data: {
      scene: 'INTERVIEW',
      context: { jobDescription: 'Engineer' },
      sourceText: 'Tell me about yourself.',
      userTranslation: '自己紹介してください。',
      aiReference: 'Please tell me about yourself.',
    },
    select: { id: true },
  })
}

async function createSessionWithFlashcard(
  nextReviewDate: Date,
  overrides: Partial<{ repetitions: number; easeFactor: number; interval: number }> = {},
) {
  const session = await createSessionInDB()
  const flashcard = await prisma.flashcard.create({
    data: {
      sessionId: session.id,
      scene: 'INTERVIEW',
      context: { jobDescription: 'Engineer' },
      mode: 'PARAGRAPH',
      front: 'Tell me about yourself.',
      backUserTranslation: '自己紹介してください。',
      backAiRevision: 'Please tell me about yourself.',
      backFeedbackSummary: ['Good job'],
      nextReviewDate,
      ...overrides,
    },
  })
  return { sessionId: session.id, flashcardId: flashcard.id }
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(async () => {
  await prisma.translationSession.deleteMany()
})

// ─── POST /api/flashcards ─────────────────────────────────────────────────────

describe('POST /api/flashcards', () => {
  it('PARAGRAPH mode: saves 1 card and returns 201 with ids', async () => {
    const session = await createSessionInDB()
    const req = new NextRequest(`${BASE_URL}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        mode: 'PARAGRAPH',
        scene: 'INTERVIEW',
        context: { jobDescription: 'Engineer' },
        cards: [
          {
            front: 'Tell me about yourself.',
            backUserTranslation: '自己紹介',
            backAiRevision: 'Please tell me about yourself.',
            backFeedbackSummary: ['Good'],
          },
        ],
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.ids).toHaveLength(1)
    expect(typeof body.data.ids[0]).toBe('string')
  })

  it('SENTENCE mode with 3 cards: saves all and returns 3 ids', async () => {
    const session = await createSessionInDB()
    const cards = Array.from({ length: 3 }, (_, i) => ({
      front: `Sentence ${i + 1}`,
      backUserTranslation: `翻訳 ${i + 1}`,
      backAiRevision: `Revision ${i + 1}`,
      backFeedbackSummary: [],
    }))
    const req = new NextRequest(`${BASE_URL}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        mode: 'SENTENCE',
        scene: 'INTERVIEW',
        context: {},
        cards,
      }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(body.data.ids).toHaveLength(3)
  })

  it('saves cards with correct SM-2 defaults (interval=1, easeFactor=2.5, repetitions=0)', async () => {
    const session = await createSessionInDB()
    const req = new NextRequest(`${BASE_URL}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        mode: 'PARAGRAPH',
        scene: 'INTERVIEW',
        context: {},
        cards: [
          { front: 'Q', backUserTranslation: 'A', backAiRevision: 'B', backFeedbackSummary: [] },
        ],
      }),
    })
    const res = await POST(req)
    const { data: { ids } } = await res.json()
    const card = await prisma.flashcard.findUniqueOrThrow({ where: { id: ids[0] } })
    expect(card.interval).toBe(1)
    expect(card.easeFactor).toBe(2.5)
    expect(card.repetitions).toBe(0)
  })

  it('nextReviewDate is <= now (cards are immediately due)', async () => {
    const session = await createSessionInDB()
    const req = new NextRequest(`${BASE_URL}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        mode: 'PARAGRAPH',
        scene: 'INTERVIEW',
        context: {},
        cards: [
          { front: 'Q', backUserTranslation: 'A', backAiRevision: 'B', backFeedbackSummary: [] },
        ],
      }),
    })
    const now = Date.now()
    const res = await POST(req)
    const { data: { ids } } = await res.json()
    const card = await prisma.flashcard.findUniqueOrThrow({ where: { id: ids[0] } })
    expect(card.nextReviewDate.getTime()).toBeLessThanOrEqual(now + 1000) // 1 s tolerance
  })

  it('returns 400 when sessionId is missing', async () => {
    const req = new NextRequest(`${BASE_URL}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'PARAGRAPH', scene: 'INTERVIEW', context: {}, cards: [] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  it('returns 400 when sessionId does not exist in DB', async () => {
    const req = new NextRequest(`${BASE_URL}/api/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'nonexistent-session-id',
        mode: 'PARAGRAPH',
        scene: 'INTERVIEW',
        context: {},
        cards: [
          { front: 'Q', backUserTranslation: 'A', backAiRevision: 'B', backFeedbackSummary: [] },
        ],
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})

// ─── GET /api/flashcards/due ──────────────────────────────────────────────────

describe('GET /api/flashcards/due', () => {
  it('returns card with nextReviewDate in the past', async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await createSessionWithFlashcard(yesterday)
    const req = new NextRequest(`${BASE_URL}/api/flashcards/due`)
    const res = await getDue(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data).toHaveLength(1)
  })

  it('does NOT return card with nextReviewDate tomorrow', async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await createSessionWithFlashcard(tomorrow)
    const req = new NextRequest(`${BASE_URL}/api/flashcards/due`)
    const body = await (await getDue(req)).json()
    expect(body.data).toHaveLength(0)
  })

  it('orders new cards (repetitions=0) before reviewed cards (repetitions=2)', async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await createSessionWithFlashcard(yesterday, { repetitions: 2 })
    await createSessionWithFlashcard(yesterday, { repetitions: 0 })
    const req = new NextRequest(`${BASE_URL}/api/flashcards/due`)
    const body = await (await getDue(req)).json()
    expect(body.data).toHaveLength(2)
    expect(body.data[0].repetitions).toBe(0)
    expect(body.data[1].repetitions).toBe(2)
  })

  it('returns empty array (not an error) when no cards are due', async () => {
    const req = new NextRequest(`${BASE_URL}/api/flashcards/due`)
    const res = await getDue(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual([])
  })
})

// ─── GET /api/flashcards/count ────────────────────────────────────────────────

describe('GET /api/flashcards/count', () => {
  it('returns { count: 2 } when 2 cards are due', async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await createSessionWithFlashcard(yesterday)
    await createSessionWithFlashcard(yesterday)
    const req = new NextRequest(`${BASE_URL}/api/flashcards/count`)
    const res = await getCount(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.count).toBe(2)
  })

  it('returns { count: 0 } when no cards are due', async () => {
    const req = new NextRequest(`${BASE_URL}/api/flashcards/count`)
    const body = await (await getCount(req)).json()
    expect(body.count).toBe(0)
  })
})

// ─── PATCH /api/flashcards/[id]/rate ─────────────────────────────────────────

describe('PATCH /api/flashcards/[id]/rate', () => {
  it('rating 5: increments repetitions, increases easeFactor, updates nextReviewDate', async () => {
    const now = new Date()
    const { flashcardId } = await createSessionWithFlashcard(now)
    const req = new NextRequest(`${BASE_URL}/api/flashcards/${flashcardId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5 }),
    })
    const res = await rate(req, { params: Promise.resolve({ id: flashcardId }) })
    expect(res.status).toBe(200)
    const card = await prisma.flashcard.findUniqueOrThrow({ where: { id: flashcardId } })
    expect(card.repetitions).toBe(1)
    expect(card.easeFactor).toBeCloseTo(2.6, 5)
    // nextReviewDate should be in the future (interval=1 → tomorrow)
    expect(card.nextReviewDate.getTime()).toBeGreaterThan(now.getTime())
  })

  it('rating 0: resets repetitions to 0, interval to 1, easeFactor unchanged', async () => {
    const now = new Date()
    const { flashcardId } = await createSessionWithFlashcard(now, {
      repetitions: 3,
      interval: 15,
      easeFactor: 2.5,
    })
    const req = new NextRequest(`${BASE_URL}/api/flashcards/${flashcardId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 0 }),
    })
    await rate(req, { params: Promise.resolve({ id: flashcardId }) })
    const card = await prisma.flashcard.findUniqueOrThrow({ where: { id: flashcardId } })
    expect(card.repetitions).toBe(0)
    expect(card.interval).toBe(1)
    expect(card.easeFactor).toBeCloseTo(2.5, 5)
  })

  it('creates a ReviewLog entry with correct intervalBefore and easeFactorBefore', async () => {
    const now = new Date()
    const { flashcardId } = await createSessionWithFlashcard(now, {
      interval: 6,
      easeFactor: 2.5,
      repetitions: 2,
    })
    const req = new NextRequest(`${BASE_URL}/api/flashcards/${flashcardId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 4 }),
    })
    await rate(req, { params: Promise.resolve({ id: flashcardId }) })
    const logs = await prisma.reviewLog.findMany({ where: { flashcardId } })
    expect(logs).toHaveLength(1)
    expect(logs[0].rating).toBe(4)
    expect(logs[0].intervalBefore).toBe(6)
    expect(logs[0].easeFactorBefore).toBeCloseTo(2.5, 5)
  })

  it('easeFactor never goes below 1.3 after a low rating', async () => {
    const now = new Date()
    const { flashcardId } = await createSessionWithFlashcard(now, {
      easeFactor: 1.3,
      repetitions: 5,
      interval: 10,
    })
    const req = new NextRequest(`${BASE_URL}/api/flashcards/${flashcardId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 3 }),
    })
    await rate(req, { params: Promise.resolve({ id: flashcardId }) })
    const card = await prisma.flashcard.findUniqueOrThrow({ where: { id: flashcardId } })
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3)
  })

  it('returns 400 when rating is out of range (> 5)', async () => {
    const now = new Date()
    const { flashcardId } = await createSessionWithFlashcard(now)
    const req = new NextRequest(`${BASE_URL}/api/flashcards/${flashcardId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 6 }),
    })
    const res = await rate(req, { params: Promise.resolve({ id: flashcardId }) })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  it('returns 400 when rating is a non-integer', async () => {
    const now = new Date()
    const { flashcardId } = await createSessionWithFlashcard(now)
    const req = new NextRequest(`${BASE_URL}/api/flashcards/${flashcardId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 3.5 }),
    })
    const res = await rate(req, { params: Promise.resolve({ id: flashcardId }) })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  it('returns 404 when card id does not exist', async () => {
    const req = new NextRequest(`${BASE_URL}/api/flashcards/nonexistent-id/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 3 }),
    })
    const res = await rate(req, { params: Promise.resolve({ id: 'nonexistent-id' }) })
    expect(res.status).toBe(404)
  })
})
