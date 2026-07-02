import { useRef, useState } from 'react'
import type { AppData, LessonStep } from '../types'
import { buildSession, choiceOptions } from '../services/session'
import {
  markIntroduced,
  markTraced,
  recordAnswer,
  recordReplay,
} from '../services/progress'
import { addStudySeconds } from '../services/storage'
import { LetterIntro } from '../activities/LetterIntro'
import { ListenChoose } from '../activities/ListenChoose'
import { TraceBoard } from '../activities/TraceBoard'
import { MatchCards } from '../activities/MatchCards'
import { SortGame } from '../activities/SortGame'
import { SpeakAlong } from '../activities/SpeakAlong'
import { ChantPlay } from '../activities/ChantPlay'
import { EndScreen } from './EndScreen'

export type ApplyFn = (change: (d: AppData) => AppData) => void

/** Runs one lesson step-by-step; ends firmly when the daily time is up. */
export function LessonRunner(props: {
  data: AppData
  apply: ApplyFn
  onExit: () => void
  steps?: LessonStep[]
}) {
  const [steps] = useState<LessonStep[]>(() => props.steps ?? buildSession(props.data))
  const [index, setIndex] = useState(0)
  const [traceLower, setTraceLower] = useState(false)
  const startRef = useRef(Date.now())

  const step: LessonStep = steps[Math.min(index, steps.length - 1)] ?? { type: 'end' }
  const newLetters = steps
    .filter((s): s is Extract<LessonStep, { type: 'intro' }> => s.type === 'intro')
    .map((s) => s.letter)

  const elapsedSeconds = () => Math.round((Date.now() - startRef.current) / 1000)

  const advance = () => {
    setTraceLower(false)
    const overTime = elapsedSeconds() > props.data.settings.sessionMinutes * 60
    setIndex((i) => (overTime ? steps.length - 1 : Math.min(i + 1, steps.length - 1)))
  }

  const finish = () => {
    const seconds = elapsedSeconds()
    props.apply((d) => addStudySeconds(d, seconds))
    props.onExit()
  }

  switch (step.type) {
    case 'intro':
      return (
        <LetterIntro
          letter={step.letter}
          onReplay={() => props.apply((d) => recordReplay(d, step.letter))}
          onNext={() => {
            props.apply((d) => markIntroduced(d, step.letter))
            advance()
          }}
        />
      )
    case 'listen':
      return (
        <ListenChoose
          letter={step.letter}
          data={props.data}
          makeOptions={(answer) => choiceOptions(answer, props.data)}
          onAnswer={(correct) => props.apply((d) => recordAnswer(d, step.letter, correct))}
          onReplay={() => props.apply((d) => recordReplay(d, step.letter))}
          onNext={advance}
        />
      )
    case 'trace': {
      const lower = traceLower
      return (
        <TraceBoard
          glyph={lower ? step.letter.toLowerCase() : step.letter}
          onDone={(completed) => {
            if (completed) props.apply((d) => markTraced(d, step.letter, lower))
            if (!lower) setTraceLower(true)
            else advance()
          }}
        />
      )
    }
    case 'match':
      return (
        <MatchCards
          letters={step.letters}
          mode="case"
          onPair={(letter, correct) => props.apply((d) => recordAnswer(d, letter, correct))}
          onDone={advance}
        />
      )
    case 'sort':
      return (
        <SortGame
          letters={[step.letters[0], step.letters[1]]}
          onAnswer={(letter, correct) => props.apply((d) => recordAnswer(d, letter, correct))}
          onDone={advance}
        />
      )
    case 'speak':
      return (
        <SpeakAlong
          letter={step.letter}
          micEnabled={props.data.settings.micEnabled}
          onNext={advance}
        />
      )
    case 'chant':
      return <ChantPlay chantId={step.chantId} onNext={advance} />
    case 'end':
      return <EndScreen newLetters={newLetters} onHome={finish} />
  }
}
