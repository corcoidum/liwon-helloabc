import type { LetterProgress } from '../types'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Simple local review rules (no AI):
 * - recently incorrect items first
 * - letters replayed many times
 * - letters whose tracing was never completed
 * - letters not studied recently
 */
export function reviewScore(p: LetterProgress, now: number): number {
  if (!p.introduced) return 0
  let score = 0
  score += p.incorrect * 5
  score += Math.min(p.replays, 5) * 2
  if (!p.tracedUpper || !p.tracedLower) score += 3
  if (p.lastStudiedAt !== null) {
    const days = Math.floor((now - p.lastStudiedAt) / DAY_MS)
    score += Math.min(days, 10)
  }
  return score
}

export function needsReview(p: LetterProgress, now: number): boolean {
  return p.introduced && reviewScore(p, now) > 0
}

/** Letters ordered by review priority, highest first. */
export function reviewQueue(
  progress: Record<string, LetterProgress>,
  now = Date.now(),
): string[] {
  return Object.values(progress)
    .filter((p) => needsReview(p, now))
    .sort((a, b) => reviewScore(b, now) - reviewScore(a, now))
    .map((p) => p.letter)
}
