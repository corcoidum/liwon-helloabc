import type { Phrase } from '../types'
import phrasesJson from './phrases.json'

/** Short everyday expressions (Stage 5), stored in phrases.json. */
export const PHRASES: Phrase[] = phrasesJson

export function phraseById(id: string): Phrase {
  const found = PHRASES.find((p) => p.id === id)
  if (!found) throw new Error(`Unknown phrase: ${id}`)
  return found
}
