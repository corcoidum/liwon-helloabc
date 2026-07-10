import { useEffect, useMemo, useState } from 'react'
import type { AppData } from '../types'
import { sayKo, sayLetterName, sayLetterSound, soundAvailable } from '../services/sound'
import { letterStyle } from '../utils/colors'
import { IconButton, Praise } from '../components/ui'

/** Hear → Touch: play a letter's name and sound, child taps the right card. */
export function ListenChoose(props: {
  letter: string
  data: AppData
  makeOptions: (answer: string) => string[]
  onAnswer: (correct: boolean) => void
  onReplay: () => void
  onNext: () => void
}) {
  const answer = props.letter
  const options = useMemo(
    () => props.makeOptions(answer),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answer],
  )
  const [solved, setSolved] = useState(false)
  const [hint, setHint] = useState<string | null>(null)

  const playPrompt = async () => {
    await sayLetterName(answer)
    await sayLetterSound(answer)
  }

  useEffect(() => {
    setSolved(false)
    setHint(null)
    void playPrompt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  const choose = (letter: string) => {
    if (solved) return
    if (letter === answer) {
      setSolved(true)
      setHint(null)
      props.onAnswer(true)
      void sayKo('found-it')
    } else {
      setHint('괜찮아요, 한 번 더 들어볼까요?')
      props.onAnswer(false)
      void playPrompt()
    }
  }

  return (
    <div className="screen" data-testid="listen-choose" data-answer={answer}>
      <p className="hint-line">👂 소리를 듣고 글자를 찾아요</p>
      {!soundAvailable() && (
        // No audio at all: fall back to same-letter matching
        <div className="letter-hero" data-testid="visual-hint" style={letterStyle(answer)}>
          <span>{answer}</span>
          <span className="lower">{answer.toLowerCase()}</span>
        </div>
      )}
      <div className="button-row">
        <IconButton
          icon="🔊"
          label="다시 듣기"
          testId="listen-replay"
          onClick={() => {
            props.onReplay()
            void playPrompt()
          }}
        />
      </div>
      <div className="choice-row">
        {options.map((letter) => (
          <button
            key={letter}
            type="button"
            className={`choice-card ${solved && letter === answer ? 'correct' : ''}`}
            data-letter={letter}
            style={letterStyle(letter)}
            onClick={() => choose(letter)}
          >
            {letter}
            {letter.toLowerCase()}
          </button>
        ))}
      </div>
      {hint && <p className="hint-line">{hint}</p>}
      {solved && <Praise text="🎉 잘 찾았어요!" />}
      {solved && (
        <div className="button-row">
          <button
            type="button"
            className="action-button"
            data-testid="listen-next"
            onClick={props.onNext}
          >
            다음 ➡️
          </button>
        </div>
      )}
    </div>
  )
}
