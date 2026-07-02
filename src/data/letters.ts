import type { LetterInfo } from '../types'

/**
 * Letter metadata, separate from UI code.
 * soundText is a TTS-friendly approximation of each letter's most common
 * basic phonics sound (short vowels, hard c/g), as used in beginner phonics.
 */
export const LETTERS: LetterInfo[] = [
  { letter: 'A', soundText: 'a' },
  { letter: 'B', soundText: 'buh' },
  { letter: 'C', soundText: 'kuh' },
  { letter: 'D', soundText: 'duh' },
  { letter: 'E', soundText: 'eh' },
  { letter: 'F', soundText: 'ff' },
  { letter: 'G', soundText: 'guh' },
  { letter: 'H', soundText: 'hh' },
  { letter: 'I', soundText: 'ih' },
  { letter: 'J', soundText: 'juh' },
  { letter: 'K', soundText: 'kuh' },
  { letter: 'L', soundText: 'll' },
  { letter: 'M', soundText: 'mm' },
  { letter: 'N', soundText: 'nn' },
  { letter: 'O', soundText: 'o' },
  { letter: 'P', soundText: 'puh' },
  { letter: 'Q', soundText: 'kwuh' },
  { letter: 'R', soundText: 'rr' },
  { letter: 'S', soundText: 'ss' },
  { letter: 'T', soundText: 'tuh' },
  { letter: 'U', soundText: 'uh' },
  { letter: 'V', soundText: 'vv' },
  { letter: 'W', soundText: 'wuh' },
  { letter: 'X', soundText: 'ks' },
  { letter: 'Y', soundText: 'yuh' },
  { letter: 'Z', soundText: 'zz' },
]

export const ALPHABET = LETTERS.map((l) => l.letter)

export function letterInfo(letter: string): LetterInfo {
  const found = LETTERS.find((l) => l.letter === letter.toUpperCase())
  if (!found) throw new Error(`Unknown letter: ${letter}`)
  return found
}
