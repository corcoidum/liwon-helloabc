import { describe, expect, it } from 'vitest'
import { buildSession, choiceOptions, nextNewLetters } from '../services/session'
import { defaultData } from '../services/storage'
import { markIntroduced, recordAnswer } from '../services/progress'

describe('session builder', () => {
  it('introduces at most two new letters, starting with A and B', () => {
    const data = defaultData()
    expect(nextNewLetters(data)).toEqual(['A', 'B'])
    const steps = buildSession(data)
    const intros = steps.filter((s) => s.type === 'intro')
    expect(intros).toEqual([
      { type: 'intro', letter: 'A' },
      { type: 'intro', letter: 'B' },
    ])
  })

  it('follows intro → listen → trace for each new letter and ends clearly', () => {
    const steps = buildSession(defaultData())
    const types = steps.map((s) => s.type)
    expect(types.slice(0, 3)).toEqual(['intro', 'listen', 'trace'])
    expect(types[types.length - 1]).toBe('end')
    expect(types).toContain('chant')
    expect(types).toContain('speak')
  })

  it('puts review of struggling letters before new content', () => {
    let data = defaultData()
    data = markIntroduced(data, 'A')
    data = recordAnswer(data, 'A', false)
    const steps = buildSession(data)
    expect(steps[0]).toEqual({ type: 'listen', letter: 'A' })
    // next new letters skip A
    const intros = steps.filter((s) => s.type === 'intro').map((s) => s.letter)
    expect(intros).toEqual(['B', 'C'])
  })

  it('offers two choices at first, three once six letters are learned', () => {
    const rng = () => 0.4
    const fresh = defaultData()
    expect(choiceOptions('A', fresh, rng)).toHaveLength(2)
    let data = defaultData()
    for (const l of ['A', 'B', 'C', 'D', 'E', 'F']) data = markIntroduced(data, l)
    const options = choiceOptions('A', data, rng)
    expect(options).toHaveLength(3)
    expect(options).toContain('A')
    expect(new Set(options).size).toBe(options.length)
  })
})
