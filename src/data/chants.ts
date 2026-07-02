import type { Chant } from '../types'

/**
 * Original short chants written for this app (no licensed lyrics).
 * Each chant is a handful of short lines spoken rhythmically by TTS,
 * finishing in well under 20 seconds.
 */
export const CHANTS: Chant[] = [
  {
    id: 'abc-hello',
    title: 'A B C 인사 챈트',
    lines: ['A, B, C!', 'Hello, hello!', 'A, B, C!', 'Clap, clap, clap!'],
  },
  {
    id: 'apple-ant',
    title: 'A 소리 챈트',
    lines: ['A, a, apple!', 'A, a, ant!', 'A, a, a!'],
  },
  {
    id: 'ball-bear',
    title: 'B 소리 챈트',
    lines: ['B, b, ball!', 'B, b, bear!', 'B, b, b!'],
  },
  {
    id: 'cat-car',
    title: 'C 소리 챈트',
    lines: ['C, c, cat!', 'C, c, car!', 'C, c, c!'],
  },
  {
    id: 'one-two-three',
    title: '숫자 챈트',
    lines: ['One, two, three!', 'Jump, jump, jump!', 'One, two, three!', 'Smile!'],
  },
  {
    id: 'bye-bye',
    title: '마무리 챈트',
    lines: ['Bye, bye, letters!', 'See you soon!', 'Bye, bye!'],
  },
]

export function chantById(id: string): Chant {
  const found = CHANTS.find((c) => c.id === id)
  if (!found) throw new Error(`Unknown chant: ${id}`)
  return found
}

/** Pick a chant for a session, preferring one that features a studied letter. */
export function chantForLetters(letters: string[]): Chant {
  const byLetter: Record<string, string> = {
    A: 'apple-ant',
    B: 'ball-bear',
    C: 'cat-car',
  }
  for (const l of letters) {
    const id = byLetter[l.toUpperCase()]
    if (id) return chantById(id)
  }
  return chantById('abc-hello')
}
