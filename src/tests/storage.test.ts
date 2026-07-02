import { describe, expect, it } from 'vitest'
import {
  addStudySeconds,
  defaultData,
  loadData,
  resetData,
  saveData,
  todayString,
} from '../services/storage'
import { markIntroduced, markTraced, recordAnswer, recordReplay } from '../services/progress'

describe('storage', () => {
  it('round-trips data through localStorage', () => {
    let data = defaultData()
    data = markIntroduced(data, 'A')
    data = recordAnswer(data, 'A', false)
    data = recordReplay(data, 'A')
    data = markTraced(data, 'A', false)
    saveData(data)

    const loaded = loadData()
    expect(loaded.progress.A.introduced).toBe(true)
    expect(loaded.progress.A.incorrect).toBe(1)
    expect(loaded.progress.A.replays).toBe(1)
    expect(loaded.progress.A.tracedUpper).toBe(true)
    expect(loaded.progress.A.tracedLower).toBe(false)
  })

  it('returns defaults when nothing is stored', () => {
    const data = loadData()
    expect(data.progress.A.introduced).toBe(false)
    expect(data.settings.sessionMinutes).toBe(8)
    expect(data.studyLog).toEqual([])
  })

  it('survives corrupted storage', () => {
    localStorage.setItem('hello-abc-data-v1', '{not json')
    const data = loadData()
    expect(data.progress.Z.introduced).toBe(false)
  })

  it('resets all data', () => {
    saveData(markIntroduced(defaultData(), 'A'))
    const data = resetData()
    expect(data.progress.A.introduced).toBe(false)
    expect(localStorage.getItem('hello-abc-data-v1')).toBeNull()
  })

  it('accumulates study time per day', () => {
    const now = new Date('2026-07-02T10:00:00')
    let data = defaultData()
    data = addStudySeconds(data, 120, now)
    data = addStudySeconds(data, 60, now)
    expect(data.studyLog).toEqual([{ date: todayString(now), seconds: 180 }])
  })
})
