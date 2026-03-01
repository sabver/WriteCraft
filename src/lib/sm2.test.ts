// spec: 001-database  AC-5.2, AC-5.3
import { describe, it, expect } from 'vitest'
import { applyRating } from './sm2'

describe('applyRating', () => {
  // T1: failed card — resets reps and interval
  it('rating=0: resets interval to 1 and repetitions to 0', () => {
    const result = applyRating(0, 6, 2.5, 3)
    expect(result.interval).toBe(1)
    expect(result.repetitions).toBe(0)
    expect(result.easeFactor).toBeCloseTo(2.5)
  })

  // T2: borderline pass (rating=3)
  it('rating=3: interval advances to 6 on second review, ease decreases', () => {
    const result = applyRating(3, 1, 2.5, 1)
    expect(result.interval).toBe(6)
    expect(result.repetitions).toBe(2)
    expect(result.easeFactor).toBeCloseTo(2.36, 1)
  })

  // T3: good (rating=4) — interval = round(prev * ease)
  it('rating=4: interval = round(prevInterval * easeFactor)', () => {
    const result = applyRating(4, 6, 2.5, 2)
    expect(result.interval).toBe(Math.round(6 * 2.5))
    expect(result.repetitions).toBe(3)
    expect(result.easeFactor).toBeCloseTo(2.5)
  })

  // T4: perfect (rating=5) — ease increases by 0.1
  it('rating=5: easeFactor increases by 0.1', () => {
    const result = applyRating(5, 6, 2.5, 2)
    expect(result.interval).toBe(Math.round(6 * 2.5))
    expect(result.repetitions).toBe(3)
    expect(result.easeFactor).toBeCloseTo(2.6)
  })

  // T5: ease clamp — never drops below 1.3
  it('repeated rating=3 does not let easeFactor fall below 1.3', () => {
    let ef = 1.31
    let interval = 1
    let reps = 1
    // Apply rating=3 many times to drive ease down
    for (let i = 0; i < 20; i++) {
      const r = applyRating(3, interval, ef, reps)
      ef = r.easeFactor
      interval = r.interval
      reps = r.repetitions
    }
    expect(ef).toBeGreaterThanOrEqual(1.3)
  })

  // T6: first review (reps=0) — interval should be 1
  it('rating=5 on first review (reps=0): interval=1', () => {
    const result = applyRating(5, 0, 2.5, 0)
    expect(result.interval).toBe(1)
    expect(result.repetitions).toBe(1)
  })

  // T7: nextReviewDate = today + interval days
  it('nextReviewDate is today + interval days', () => {
    const before = Date.now()
    const result = applyRating(4, 6, 2.5, 2)
    const after = Date.now()

    const expectedMs = result.interval * 24 * 60 * 60 * 1000
    const reviewTime = result.nextReviewDate.getTime()

    expect(reviewTime).toBeGreaterThanOrEqual(before + expectedMs - 1000)
    expect(reviewTime).toBeLessThanOrEqual(after + expectedMs + 1000)
  })
})
