import type { Chant } from '../types'
import chantsJson from './chants.json'
import { letterInfo, ALPHABET } from './letters'
import { mainWord } from './words'

/**
 * Base chants live in chants.json (original lines written for this app —
 * no licensed lyrics). Letter chants are generated from the letter/word
 * data so all 26 letters get a rhythm activity, reusing their audio clips.
 */
export const BASE_CHANTS: Chant[] = chantsJson

export function letterChant(letter: string): Chant {
  const L = letter.toUpperCase()
  const info = letterInfo(L)
  const word = mainWord(L)
  const line = {
    text: `${L}, ${info.soundText}, ${word.word}!`,
    audio: [`letter-${L}`, `sound-${L}`, `word-${word.id}`],
  }
  return {
    id: `letter-${L}`,
    title: `${L} 소리 챈트 ${word.emoji}`,
    lines: [line, line, { text: `${word.word}! ${word.emoji}`, audio: [`word-${word.id}`] }],
  }
}

export const CHANTS: Chant[] = [...BASE_CHANTS, ...ALPHABET.map(letterChant)]

export function chantById(id: string): Chant {
  const found = CHANTS.find((c) => c.id === id)
  if (!found) throw new Error(`Unknown chant: ${id}`)
  return found
}

/** Pick a chant for a session, preferring the first studied letter's chant. */
export function chantForLetters(letters: string[]): Chant {
  if (letters.length > 0) return letterChant(letters[0])
  return chantById('abc-hello')
}
