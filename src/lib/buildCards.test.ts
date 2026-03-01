// spec: 003-flashcard-ai-revision-display  plan §9.1
// TDD RED phase — these tests describe the NEW issues[] shape and must FAIL
// until T-09 rewrites the buildCards implementation.
import { describe, it, expect } from 'vitest'
import { buildCards } from './buildCards'
import type { SessionDraft } from './buildCards'
import type { ReviewIssue } from './types'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const issue1: ReviewIssue = {
  id: 'i1',
  type: 'grammar',
  title: 'Missing article',
  original: 'I am engineer',
  revised: 'I am an engineer',
  reason: 'Countable nouns require an article.',
  severity: 'medium',
}

const issue2: ReviewIssue = {
  id: 'i2',
  type: 'word-choice',
  title: 'Informal phrasing',
  original: 'I wanna work here',
  revised: 'I would like to work here',
  reason: '"Wanna" is too informal for an interview.',
  severity: 'high',
}

const baseDraft: SessionDraft = {
  sessionId: 'sess-1',
  scene: 'INTERVIEW',
  context: { jobDescription: 'Engineer' },
  sourceText: 'Tell me about yourself.',
  userTranslation: 'I am engineer',
  issues: [issue1, issue2],
}

// ─── PARAGRAPH mode ───────────────────────────────────────────────────────────

describe('buildCards — paragraph mode', () => {
  it('produces exactly 1 card', () => {
    const cards = buildCards(baseDraft, 'paragraph')
    expect(cards).toHaveLength(1)
  })

  it('front is the sourceText', () => {
    const [card] = buildCards(baseDraft, 'paragraph')
    expect(card.front).toBe(baseDraft.sourceText)
  })

  it('back.userTranslation is the full draft userTranslation', () => {
    const [card] = buildCards(baseDraft, 'paragraph')
    expect(card.back.userTranslation).toBe(baseDraft.userTranslation)
  })

  it('back.issues contains ALL draft issues (not just the first)', () => {
    const [card] = buildCards(baseDraft, 'paragraph')
    expect(card.back.issues).toEqual(baseDraft.issues)
  })

  it('back.issues has 2 elements when draft has 2 issues', () => {
    const [card] = buildCards(baseDraft, 'paragraph')
    expect(card.back.issues).toHaveLength(2)
  })

  it('zero issues: returns 1 card with back.issues = []', () => {
    const draft: SessionDraft = { ...baseDraft, issues: [] }
    const cards = buildCards(draft, 'paragraph')
    expect(cards).toHaveLength(1)
    expect(cards[0].back.issues).toEqual([])
  })
})

// ─── SENTENCE mode ────────────────────────────────────────────────────────────

describe('buildCards — sentence mode', () => {
  it('produces one card per issue', () => {
    const cards = buildCards(baseDraft, 'sentence')
    expect(cards).toHaveLength(2)
  })

  it('each card front is the issue original text', () => {
    const cards = buildCards(baseDraft, 'sentence')
    expect(cards[0].front).toBe(issue1.original)
    expect(cards[1].front).toBe(issue2.original)
  })

  it('each card back.userTranslation is the issue original text', () => {
    const cards = buildCards(baseDraft, 'sentence')
    expect(cards[0].back.userTranslation).toBe(issue1.original)
  })

  it('each card back.issues is a single-element array with that issue', () => {
    const cards = buildCards(baseDraft, 'sentence')
    expect(cards[0].back.issues).toEqual([issue1])
    expect(cards[1].back.issues).toEqual([issue2])
  })

  it('zero issues: returns empty array', () => {
    const draft: SessionDraft = { ...baseDraft, issues: [] }
    const cards = buildCards(draft, 'sentence')
    expect(cards).toHaveLength(0)
  })
})
