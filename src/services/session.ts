import type { AppData, LessonStep } from '../types'
import { ALPHABET } from '../data/letters'
import { chantForLetters } from '../data/chants'
import { PHRASES } from '../data/phrases'
import { reviewQueue } from './review'

export const MAX_NEW_LETTERS_PER_SESSION = 2

export function introducedLetters(data: AppData): string[] {
  return ALPHABET.filter((l) => data.progress[l]?.introduced)
}

export function nextNewLetters(data: AppData, count = MAX_NEW_LETTERS_PER_SESSION): string[] {
  return ALPHABET.filter((l) => !data.progress[l]?.introduced).slice(0, count)
}

/**
 * Builds one daily lesson: short review → up to two new letters
 * (see/hear → listen-and-choose → trace) → a game → a chant → clear end.
 */
export function buildSession(data: AppData, now = Date.now()): LessonStep[] {
  const steps: LessonStep[] = []

  const review = reviewQueue(data.progress, now).slice(0, 2)
  for (const letter of review) steps.push({ type: 'listen', letter })

  const fresh = nextNewLetters(data)
  for (const letter of fresh) {
    steps.push({ type: 'intro', letter })
    steps.push({ type: 'listen', letter })
    steps.push({ type: 'trace', letter, lowercase: false })
  }

  const known = [...review, ...fresh]
  const pool = known.length >= 2 ? known : uniqueFill(known, introducedLetters(data))

  if (pool.length >= 2) {
    // Alternate match / sort by how far the child has progressed.
    const gameIndex = introducedLetters(data).length + fresh.length
    steps.push(
      gameIndex % 2 === 0
        ? { type: 'match', letters: pool.slice(0, 3) }
        : { type: 'sort', letters: pool.slice(0, 2) },
    )
  }

  if (known.length > 0) steps.push({ type: 'speak', letter: known[0] })
  // One short everyday expression per session, rotating with progress
  const phrase = PHRASES[introducedLetters(data).length % PHRASES.length]
  steps.push({ type: 'phrase', phraseId: phrase.id })
  steps.push({ type: 'chant', chantId: chantForLetters(known).id })
  steps.push({ type: 'end' })
  return steps
}

function uniqueFill(base: string[], extra: string[]): string[] {
  const out = [...base]
  for (const l of extra) {
    if (!out.includes(l)) out.push(l)
    if (out.length >= 3) break
  }
  return out
}

/** Options for a listen-and-choose question: the answer plus decoys. */
export function choiceOptions(
  answer: string,
  data: AppData,
  rng: () => number = Math.random,
): string[] {
  const learned = introducedLetters(data).filter((l) => l !== answer)
  const decoyPool = learned.length > 0 ? learned : ALPHABET.filter((l) => l !== answer)
  // Start with 2 choices; grow to 3 once the child has learned more letters.
  const decoyCount = introducedLetters(data).length >= 6 ? 2 : 1
  const decoys = shuffle(decoyPool, rng).slice(0, decoyCount)
  return shuffle([answer, ...decoys], rng)
}

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
