import { describe, expect, it } from 'vitest'
import { ALPHABET, LETTERS, letterInfo } from '../data/letters'
import { WORDS, mainWord, wordsForLetter } from '../data/words'
import { CHANTS, chantForLetters } from '../data/chants'
import { PHRASES, phraseById } from '../data/phrases'
import { FEEDBACK } from '../data/feedback'

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

  it('has unique audio-safe ids', () => {
    const ids = WORDS.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
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
      for (const line of chant.lines) expect(line.audio.length).toBeGreaterThan(0)
      // Rough length guard so spoken time stays well under 20 seconds.
      const totalChars = chant.lines.map((l) => l.text).join(' ').length
      expect(totalChars, chant.id).toBeLessThan(120)
    }
  })

  it('generates a chant for every letter', () => {
    for (const letter of ALPHABET) {
      const chant = chantForLetters([letter])
      expect(chant.id).toBe(`letter-${letter}`)
      expect(chant.lines[0].audio[0]).toBe(`letter-${letter}`)
    }
    expect(chantForLetters([]).id).toBe('abc-hello')
  })
})

describe('phrases and feedback data', () => {
  it('has at least 10 short expressions with emoji and Korean gloss', () => {
    expect(PHRASES.length).toBeGreaterThanOrEqual(10)
    for (const p of PHRASES) {
      expect(p.text.length).toBeGreaterThan(0)
      expect(p.ko.length).toBeGreaterThan(0)
      expect(p.emoji.length).toBeGreaterThan(0)
    }
    expect(phraseById('hello').text).toBe('Hello!')
    expect(() => phraseById('nope')).toThrow()
  })

  it('has warm Korean feedback lines', () => {
    expect(FEEDBACK['found-it']).toContain('딩동댕')
    expect(FEEDBACK['session-end']).toContain('다음에 또 만나요')
  })
})
