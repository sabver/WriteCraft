// spec: 001-database  AC-1.1–1.3, AC-2.1–2.5, AC-6.1
import { describe, it, expect, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { POST, GET } from './route'
import { GET as getById } from './[id]/route'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost'

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    scene: 'INTERVIEW',
    context: { jobDescription: 'Engineer', companyBackground: 'Tech', questionType: 'Behavioral' },
    sourceText: 'Tell me about yourself.',
    userTranslation: '私について話してください。',
    aiReference: 'Please tell me about yourself.',
    issues: [
      {
        type: 'GRAMMAR',
        title: 'Particle misuse',
        original: '私について',
        revised: '私自身について',
        reason: 'より自然な表現',
        severity: 'LOW',
        sortOrder: 1,
      },
    ],
    ...overrides,
  }
}

async function createSessionViaPost(body = makeSession()) {
  const req = new NextRequest(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return POST(req)
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(async () => {
  await prisma.translationSession.deleteMany()
})

// ─── POST /api/sessions ───────────────────────────────────────────────────────

describe('POST /api/sessions', () => {
  it('creates a session and returns 201 with id', async () => {
    const res = await createSessionViaPost()
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(typeof body.data.id).toBe('string')
  })

  it('persists issues linked to the session', async () => {
    const res = await createSessionViaPost()
    const { data } = await res.json()

    const issues = await prisma.reviewIssue.findMany({ where: { sessionId: data.id } })
    expect(issues).toHaveLength(1)
    expect(issues[0].type).toBe('GRAMMAR')
    expect(issues[0].sortOrder).toBe(1)
  })

  it('returns 400 when sourceText is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = { ...makeSession() }
    delete body.sourceText
    const res = await createSessionViaPost(body)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 when scene is invalid', async () => {
    const res = await createSessionViaPost(makeSession({ scene: 'INVALID' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})

// ─── GET /api/sessions ────────────────────────────────────────────────────────

describe('GET /api/sessions', () => {
  it('returns empty list with meta when no sessions exist', async () => {
    const req = new NextRequest(`${BASE_URL}/api/sessions`)
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data).toEqual([])
    expect(body.meta.total).toBe(0)
  })

  it('returns sessions newest-first', async () => {
    await createSessionViaPost()
    await createSessionViaPost(makeSession({ sourceText: 'Second session' }))

    const req = new NextRequest(`${BASE_URL}/api/sessions`)
    const res = await GET(req)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.data[0].sourceText).toBe('Second session')
  })

  it('includes issueCount in each list item', async () => {
    await createSessionViaPost()
    const req = new NextRequest(`${BASE_URL}/api/sessions`)
    const body = await (await GET(req)).json()
    expect(body.data[0].issueCount).toBe(1)
  })

  it('filters by ?scene=INTERVIEW', async () => {
    await createSessionViaPost(makeSession({ scene: 'INTERVIEW' }))
    await createSessionViaPost(makeSession({ scene: 'DAILY' }))

    const req = new NextRequest(`${BASE_URL}/api/sessions?scene=INTERVIEW`)
    const body = await (await GET(req)).json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].scene).toBe('INTERVIEW')
  })

  it('filters by ?range=7d (excludes old records)', async () => {
    // Create one recent session via API
    await createSessionViaPost()

    // Insert an old session directly via prisma
    await prisma.translationSession.create({
      data: {
        scene: 'DAILY',
        context: {},
        sourceText: 'Old entry',
        userTranslation: 'Old',
        aiReference: 'Old',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
    })

    const req = new NextRequest(`${BASE_URL}/api/sessions?range=7d`)
    const body = await (await GET(req)).json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].sourceText).toBe('Tell me about yourself.')
  })

  it('filters by ?q= keyword (case-insensitive)', async () => {
    await createSessionViaPost(makeSession({ sourceText: 'introduce yourself' }))
    await createSessionViaPost(makeSession({ sourceText: 'describe your experience' }))

    const req = new NextRequest(`${BASE_URL}/api/sessions?q=INTRODUCE`)
    const body = await (await GET(req)).json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].sourceText).toBe('introduce yourself')
  })
})

// ─── GET /api/sessions/[id] ───────────────────────────────────────────────────

describe('GET /api/sessions/[id]', () => {
  it('returns full session detail with ordered issues', async () => {
    const postRes = await createSessionViaPost()
    const { data: { id } } = await postRes.json()

    const req = new NextRequest(`${BASE_URL}/api/sessions/${id}`)
    const res = await getById(req, { params: Promise.resolve({ id }) })
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.id).toBe(id)
    expect(body.data.issues).toHaveLength(1)
    expect(body.data.issues[0].type).toBe('GRAMMAR')
  })

  it('returns flashcardIds as empty array when no flashcards', async () => {
    const { data: { id } } = await (await createSessionViaPost()).json()
    const req = new NextRequest(`${BASE_URL}/api/sessions/${id}`)
    const body = await (await getById(req, { params: Promise.resolve({ id }) })).json()
    expect(body.data.flashcardIds).toEqual([])
  })

  it('returns 404 when id does not exist', async () => {
    const req = new NextRequest(`${BASE_URL}/api/sessions/nonexistent-id`)
    const res = await getById(req, { params: Promise.resolve({ id: 'nonexistent-id' }) })
    expect(res.status).toBe(404)
  })
})
