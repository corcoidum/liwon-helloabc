import { describe, expect, it } from 'vitest'
import { reviewQueue, reviewScore, needsReview } from '../services/review'
import { emptyProgress } from '../services/storage'
import type { LetterProgress } from '../types'

const NOW = Date.parse('2026-07-02T12:00:00Z')
const DAY = 24 * 60 * 60 * 1000

function p(letter: string, extra: Partial<LetterProgress> = {}): LetterProgress {
  return {
    ...emptyProgress(letter),
    introduced: true,
    tracedUpper: true,
    tracedLower: true,
    lastStudiedAt: NOW,
    ...extra,
  }
}

describe('review rules', () => {
  it('ignores letters that were never introduced', () => {
    const fresh = emptyProgress('Z')
    expect(needsReview(fresh, NOW)).toBe(false)
    expect(reviewScore(fresh, NOW)).toBe(0)
  })

  it('puts recently incorrect letters first', () => {
    const queue = reviewQueue(
      {
        A: p('A', { incorrect: 3 }),
        B: p('B', { replays: 2 }),
        C: p('C'),
      },
      NOW,
    )
    expect(queue[0]).toBe('A')
    expect(queue).toContain('B')
    expect(queue).not.toContain('C')
  })

  it('flags incomplete tracing and stale letters', () => {
    const untraced = p('D', { tracedLower: false })
    const stale = p('E', { lastStudiedAt: NOW - 5 * DAY })
    expect(needsReview(untraced, NOW)).toBe(true)
    expect(needsReview(stale, NOW)).toBe(true)
    expect(reviewScore(stale, NOW)).toBe(5)
  })

  it('caps the staleness contribution', () => {
    const veryStale = p('F', { lastStudiedAt: NOW - 100 * DAY })
    expect(reviewScore(veryStale, NOW)).toBe(10)
  })
})
