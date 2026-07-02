import type { AppData, LetterProgress } from '../types'
import { emptyProgress } from './storage'

function withLetter(
  data: AppData,
  letter: string,
  change: (p: LetterProgress) => LetterProgress,
): AppData {
  const key = letter.toUpperCase()
  const prev = data.progress[key] ?? emptyProgress(key)
  return {
    ...data,
    progress: { ...data.progress, [key]: change({ ...prev, lastStudiedAt: Date.now() }) },
  }
}

export function markIntroduced(data: AppData, letter: string): AppData {
  return withLetter(data, letter, (p) => ({ ...p, introduced: true }))
}

export function recordAnswer(data: AppData, letter: string, correct: boolean): AppData {
  return withLetter(data, letter, (p) =>
    correct ? { ...p, correct: p.correct + 1 } : { ...p, incorrect: p.incorrect + 1 },
  )
}

export function recordReplay(data: AppData, letter: string): AppData {
  return withLetter(data, letter, (p) => ({ ...p, replays: p.replays + 1 }))
}

export function markTraced(data: AppData, letter: string, lowercase: boolean): AppData {
  return withLetter(data, letter, (p) =>
    lowercase ? { ...p, tracedLower: true } : { ...p, tracedUpper: true },
  )
}
