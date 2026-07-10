import type { LetterInfo } from '../types'
import lettersJson from './letters.json'

/**
 * Letter metadata lives in letters.json (shared with the audio generation
 * script). soundText is a TTS-friendly approximation of each letter's most
 * common basic phonics sound, as used in beginner phonics.
 */
export const LETTERS: LetterInfo[] = lettersJson

export const ALPHABET = LETTERS.map((l) => l.letter)

export function letterInfo(letter: string): LetterInfo {
  const found = LETTERS.find((l) => l.letter === letter.toUpperCase())
  if (!found) throw new Error(`Unknown letter: ${letter}`)
  return found
}
