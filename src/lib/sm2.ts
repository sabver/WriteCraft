// SM-2 spaced repetition algorithm — pure, side-effect-free
// spec: 001-database  AC-5.2, AC-5.3

export interface SM2Result {
  interval: number
  easeFactor: number
  repetitions: number
  nextReviewDate: Date
}

/**
 * Apply a rating (0–5) to the current SM-2 card state and return the
 * updated scheduling values.
 *
 * Rules:
 * - rating 0–2: reset (interval=1, repetitions=0, easeFactor unchanged)
 * - rating ≥3:
 *     easeFactor += 0.1 − (5−q) × (0.08 + (5−q) × 0.02)   (min 1.3)
 *     reps=0 → interval=1
 *     reps=1 → interval=6
 *     reps≥2 → interval = round(prevInterval × newEaseFactor)
 *     repetitions += 1
 */
export function applyRating(
  rating: number,
  prevInterval: number,
  prevEaseFactor: number,
  prevRepetitions: number,
): SM2Result {
  let interval: number
  let easeFactor = prevEaseFactor
  let repetitions: number

  if (rating >= 3) {
    // Interval uses prevEaseFactor (calculated before ease update — mirrors original SM-2)
    if (prevRepetitions === 0) {
      interval = 1
    } else if (prevRepetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(prevInterval * prevEaseFactor)
    }

    const q = rating
    easeFactor = Math.max(
      1.3,
      prevEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
    )
    repetitions = prevRepetitions + 1
  } else {
    // Failed — reset
    interval = 1
    repetitions = 0
  }

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return { interval, easeFactor, repetitions, nextReviewDate }
}
