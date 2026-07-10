import type { WordItem } from '../types'
import wordsJson from './words.json'

/**
 * Familiar words for a 5-year-old, stored in words.json (shared with the
 * audio generation script). Every word has an emoji picture, so no licensed
 * images are needed. X uses ending-sound words (box, fox), the standard
 * approach in beginner phonics; every other word starts with its letter.
 */
export const WORDS: WordItem[] = wordsJson as WordItem[]

export function wordsForLetter(letter: string): WordItem[] {
  return WORDS.filter((w) => w.letter === letter.toUpperCase())
}

/** First word is the letter's main example word. */
export function mainWord(letter: string): WordItem {
  const list = wordsForLetter(letter)
  if (list.length === 0) throw new Error(`No words for letter: ${letter}`)
  return list[0]
}
