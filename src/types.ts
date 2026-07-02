export interface WordItem {
  word: string
  emoji: string
  /** Uppercase first letter, e.g. 'A' */
  letter: string
  category:
    | 'animal'
    | 'food'
    | 'color'
    | 'number'
    | 'family'
    | 'body'
    | 'vehicle'
    | 'nature'
    | 'toy'
    | 'home'
}

export interface LetterInfo {
  /** Uppercase letter, e.g. 'A' */
  letter: string
  /** TTS-friendly approximation of the basic phonics sound, e.g. 'buh' */
  soundText: string
}

export interface Chant {
  id: string
  title: string
  /** Short original lines spoken in sequence; total under 20 seconds */
  lines: string[]
}

export interface LetterProgress {
  letter: string
  introduced: boolean
  correct: number
  incorrect: number
  /** How many times the child replayed this letter's audio */
  replays: number
  tracedUpper: boolean
  tracedLower: boolean
  lastStudiedAt: number | null
}

export interface Settings {
  sessionMinutes: number
  micEnabled: boolean
}

export interface StudyLogEntry {
  /** ISO date, e.g. '2026-07-02' */
  date: string
  seconds: number
}

export interface AppData {
  progress: Record<string, LetterProgress>
  settings: Settings
  studyLog: StudyLogEntry[]
}

export type LessonStep =
  | { type: 'intro'; letter: string }
  | { type: 'listen'; letter: string }
  | { type: 'trace'; letter: string; lowercase: boolean }
  | { type: 'match'; letters: string[] }
  | { type: 'sort'; letters: string[] }
  | { type: 'speak'; letter: string }
  | { type: 'chant'; chantId: string }
  | { type: 'end' }
