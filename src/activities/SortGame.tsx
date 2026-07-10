import { useEffect, useMemo, useState } from 'react'
import { wordsForLetter } from '../data/words'
import { shuffle } from '../services/session'
import { sayKo, sayWord } from '../services/sound'
import { letterStyle } from '../utils/colors'
import { Praise } from '../components/ui'
import type { WordItem } from '../types'

/** Play: hear a word, tap the bucket of its first letter (touch, no drag). */
export function SortGame(props: {
  letters: [string, string]
  onAnswer?: (letter: string, correct: boolean) => void
  onDone: () => void
}) {
  const items = useMemo<WordItem[]>(
    () =>
      shuffle([
        ...wordsForLetter(props.letters[0]).slice(0, 2),
        ...wordsForLetter(props.letters[1]).slice(0, 2),
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.letters[0], props.letters[1]],
  )
  const [index, setIndex] = useState(0)
  const [hint, setHint] = useState<string | null>(null)
  const current = items[index]
  const finished = index >= items.length

  useEffect(() => {
    if (current) void sayWord(current)
  }, [current])

  const pick = (letter: string) => {
    if (finished || !current) return
    const correct = current.letter === letter
    props.onAnswer?.(current.letter, correct)
    if (correct) {
      setHint(null)
      void sayKo('correct')
      setIndex((i) => i + 1)
    } else {
      setHint('괜찮아요, 첫소리를 다시 들어봐요')
      void sayWord(current)
    }
  }

  return (
    <div className="screen" data-testid="sort-game">
      <p className="hint-line">🧺 첫소리에 맞는 글자 바구니를 눌러요</p>
      {!finished && current && (
        <button type="button" className="word-card" onClick={() => void sayWord(current)}>
          <span className="word-emoji" aria-hidden>
            {current.emoji}
          </span>
          <span>🔊 다시 듣기</span>
        </button>
      )}
      {!finished && (
        <div className="bucket-row">
          {props.letters.map((letter) => (
            <button
              key={letter}
              type="button"
              className="bucket"
              data-bucket={letter}
              style={letterStyle(letter)}
              onClick={() => pick(letter)}
            >
              {letter}
              {letter.toLowerCase()}
            </button>
          ))}
        </div>
      )}
      {hint && !finished && <p className="hint-line">{hint}</p>}
      {finished && <Praise text="🎉 모두 나눴어요!" />}
      {finished && (
        <div className="button-row">
          <button
            type="button"
            className="action-button"
            data-testid="sort-next"
            onClick={props.onDone}
          >
            다음 ➡️
          </button>
        </div>
      )}
    </div>
  )
}
