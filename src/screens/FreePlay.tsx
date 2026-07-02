import { useState } from 'react'
import type { AppData } from '../types'
import { ALPHABET } from '../data/letters'
import { CHANTS } from '../data/chants'
import { introducedLetters } from '../services/session'
import { markTraced, recordAnswer } from '../services/progress'
import { TraceBoard } from '../activities/TraceBoard'
import { MatchCards } from '../activities/MatchCards'
import { SortGame } from '../activities/SortGame'
import { ChantPlay } from '../activities/ChantPlay'
import { Screen, ScreenTitle } from '../components/ui'
import type { ApplyFn } from './LessonRunner'

function BackRow(props: { onBack: () => void }) {
  return (
    <div className="button-row">
      <button type="button" className="action-button secondary" onClick={props.onBack}>
        🏠 처음으로
      </button>
    </div>
  )
}

/** Free tracing: pick any letter, uppercase or lowercase. */
export function TraceFree(props: { apply: ApplyFn; onBack: () => void }) {
  const [glyph, setGlyph] = useState<string | null>(null)
  const [lowercase, setLowercase] = useState(false)

  if (glyph) {
    return (
      <div>
        <TraceBoard
          glyph={lowercase ? glyph.toLowerCase() : glyph}
          onDone={(completed) => {
            if (completed) props.apply((d) => markTraced(d, glyph, lowercase))
            setGlyph(null)
          }}
        />
        <BackRow onBack={() => setGlyph(null)} />
      </div>
    )
  }

  return (
    <Screen testId="trace-free">
      <ScreenTitle icon="✍️" text="따라 쓰기" />
      <div className="button-row">
        <button
          type="button"
          className={`action-button ${lowercase ? 'secondary' : ''}`}
          onClick={() => setLowercase(false)}
        >
          ABC
        </button>
        <button
          type="button"
          className={`action-button ${lowercase ? '' : 'secondary'}`}
          onClick={() => setLowercase(true)}
        >
          abc
        </button>
      </div>
      <div className="letter-picker">
        {ALPHABET.map((l) => (
          <button key={l} type="button" onClick={() => setGlyph(l)}>
            {lowercase ? l.toLowerCase() : l}
          </button>
        ))}
      </div>
      <BackRow onBack={props.onBack} />
    </Screen>
  )
}

function playLetters(data: AppData, count: number): string[] {
  const learned = introducedLetters(data)
  const pool = learned.length >= count ? learned : ALPHABET
  return pool.slice(0, count)
}

/** Free matching game (letter ↔ picture). */
export function MatchFree(props: { data: AppData; apply: ApplyFn; onBack: () => void }) {
  const letters = playLetters(props.data, 3)
  return (
    <div>
      <MatchCards
        letters={letters}
        mode="word"
        onPair={(letter, correct) => props.apply((d) => recordAnswer(d, letter, correct))}
        onDone={props.onBack}
      />
    </div>
  )
}

/** Free sorting game (first sound → letter bucket). */
export function SortFree(props: { data: AppData; apply: ApplyFn; onBack: () => void }) {
  const [a, b] = playLetters(props.data, 2)
  return (
    <div>
      <SortGame
        letters={[a, b]}
        onAnswer={(letter, correct) => props.apply((d) => recordAnswer(d, letter, correct))}
        onDone={props.onBack}
      />
    </div>
  )
}

/** Chant menu: pick a short original chant. */
export function ChantFree(props: { onBack: () => void }) {
  const [chantId, setChantId] = useState<string | null>(null)
  if (chantId) return <ChantPlay chantId={chantId} onNext={() => setChantId(null)} />
  return (
    <Screen testId="chant-free">
      <ScreenTitle icon="🎵" text="챈트" />
      <div className="home-grid">
        {CHANTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="big-button big-button-soft"
            onClick={() => setChantId(c.id)}
          >
            <span className="big-button-icon" aria-hidden>
              🎶
            </span>
            <span className="big-button-label">{c.title}</span>
          </button>
        ))}
      </div>
      <BackRow onBack={props.onBack} />
    </Screen>
  )
}
