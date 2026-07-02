import type { AppData, LetterProgress, Settings } from '../types'
import { ALPHABET } from '../data/letters'

const STORAGE_KEY = 'hello-abc-data-v1'

export const DEFAULT_SETTINGS: Settings = {
  sessionMinutes: 8,
  micEnabled: true,
}

export function emptyProgress(letter: string): LetterProgress {
  return {
    letter,
    introduced: false,
    correct: 0,
    incorrect: 0,
    replays: 0,
    tracedUpper: false,
    tracedLower: false,
    lastStudiedAt: null,
  }
}

export function defaultData(): AppData {
  const progress: Record<string, LetterProgress> = {}
  for (const l of ALPHABET) progress[l] = emptyProgress(l)
  return { progress, settings: { ...DEFAULT_SETTINGS }, studyLog: [] }
}

// If localStorage is unavailable (private mode, quota), fall back to
// in-memory data so the app keeps running for the current visit.
let memoryFallback: AppData | null = null

export function loadData(): AppData {
  if (memoryFallback) return memoryFallback
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw) as Partial<AppData>
    const base = defaultData()
    return {
      progress: { ...base.progress, ...(parsed.progress ?? {}) },
      settings: { ...base.settings, ...(parsed.settings ?? {}) },
      studyLog: Array.isArray(parsed.studyLog) ? parsed.studyLog : [],
    }
  } catch {
    memoryFallback = defaultData()
    return memoryFallback
  }
}

export function saveData(data: AppData): void {
  if (memoryFallback) {
    memoryFallback = data
    return
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    memoryFallback = data
  }
}

export function resetData(): AppData {
  memoryFallback = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    memoryFallback = defaultData()
  }
  return defaultData()
}

export function todayString(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addStudySeconds(data: AppData, seconds: number, now = new Date()): AppData {
  const date = todayString(now)
  const log = [...data.studyLog]
  const idx = log.findIndex((e) => e.date === date)
  if (idx >= 0) log[idx] = { ...log[idx], seconds: log[idx].seconds + seconds }
  else log.push({ date, seconds })
  return { ...data, studyLog: log }
}
