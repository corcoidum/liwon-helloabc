import { describe, expect, it } from 'vitest'
import { ALPHABET, LETTERS, letterInfo } from '../data/letters'
import { WORDS, mainWord, wordsForLetter } from '../data/words'
import { CHANTS, chantForLetters } from '../data/chants'

describe('letters data', () => {
  it('covers all 26 letters with a sound', () => {
    expect(LETTERS).toHaveLength(26)
    expect(ALPHABET.join('')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    for (const l of LETTERS) expect(l.soundText.length).toBeGreaterThan(0)
  })

  it('throws on unknown letters', () => {
    expect(() => letterInfo('!')).toThrow()
  })
})

describe('words data', () => {
  it('has at least 50 familiar words', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(50)
  })

  it('has at least two words with an emoji for every letter', () => {
    for (const letter of ALPHABET) {
      const words = wordsForLetter(letter)
      expect(words.length, `words for ${letter}`).toBeGreaterThanOrEqual(2)
      for (const w of words) expect(w.emoji.length).toBeGreaterThan(0)
      expect(mainWord(letter).word.length).toBeGreaterThan(0)
    }
  })

  it('words match their letter (X may use ending-sound words)', () => {
    for (const w of WORDS) {
      if (w.letter === 'X') {
        expect(w.word.toLowerCase()).toContain('x')
      } else {
        expect(w.word[0].toLowerCase()).toBe(w.letter.toLowerCase())
      }
    }
  })
})

describe('chants data', () => {
  it('has at least 5 short original chants', () => {
    expect(CHANTS.length).toBeGreaterThanOrEqual(5)
    for (const chant of CHANTS) {
      expect(chant.lines.length).toBeGreaterThan(0)
      // Rough length guard so spoken time stays well under 20 seconds.
      const totalChars = chant.lines.join(' ').length
      expect(totalChars, chant.id).toBeLessThan(120)
    }
  })

  it('picks a letter-specific chant when available', () => {
    expect(chantForLetters(['A']).id).toBe('apple-ant')
    expect(chantForLetters(['Z']).id).toBe('abc-hello')
  })
})
