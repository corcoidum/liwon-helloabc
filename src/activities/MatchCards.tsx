import { useMemo, useState } from 'react'
import { mainWord } from '../data/words'
import { shuffle } from '../services/session'
import { speakEnglish, speakKorean } from '../services/speech'
import { Praise } from '../components/ui'

interface Card {
  id: string
  pair: string
  face: string
  done: boolean
}

export type MatchMode = 'case' | 'word'

export function buildCards(letters: string[], mode: MatchMode): Card[] {
  const cards: Card[] = []
  for (const letter of letters) {
    cards.push({ id: `${letter}-a`, pair: letter, face: letter, done: false })
    cards.push({
      id: `${letter}-b`,
      pair: letter,
      face: mode === 'case' ? letter.toLowerCase() : mainWord(letter).emoji,
      done: false,
    })
  }
  return cards
}

/** Play: tap two cards to match uppercase↔lowercase or letter↔picture. */
export function MatchCards(props: {
  letters: string[]
  mode: MatchMode
  onPair?: (letter: string, correct: boolean) => void
  onDone: () => void
}) {
  const [cards, setCards] = useState<Card[]>(() =>
    shuffle(buildCards(props.letters, props.mode)),
  )
  const [selected, setSelected] = useState<string | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const allDone = useMemo(() => cards.every((c) => c.done), [cards])

  const tap = (card: Card) => {
    if (card.done || allDone) return
    void speakEnglish(props.mode === 'word' && card.face !== card.pair ? mainWord(card.pair).word : card.pair)
    if (selected === null) {
      setSelected(card.id)
      setHint(null)
      return
    }
    if (selected === card.id) return
    const first = cards.find((c) => c.id === selected)
    if (!first) return
    if (first.pair === card.pair) {
      setCards((prev) =>
        prev.map((c) => (c.pair === card.pair ? { ...c, done: true } : c)),
      )
      props.onPair?.(card.pair, true)
      void speakKorean('짝을 찾았어요!')
    } else {
      setHint('괜찮아요, 다시 찾아봐요')
      props.onPair?.(first.pair, false)
    }
    setSelected(null)
  }

  return (
    <div className="screen" data-testid="match-cards">
      <p className="hint-line">🃏 같은 짝을 찾아 눌러요</p>
      <div className="card-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`match-card ${card.done ? 'done' : ''} ${selected === card.id ? 'selected' : ''}`}
            data-pair={card.pair}
            onClick={() => tap(card)}
          >
            {card.face}
          </button>
        ))}
      </div>
      {hint && !allDone && <p className="hint-line">{hint}</p>}
      {allDone && <Praise text="🎉 짝을 모두 찾았어요!" />}
      {allDone && (
        <div className="button-row">
          <button
            type="button"
            className="action-button"
            data-testid="match-next"
            onClick={props.onDone}
          >
            다음 ➡️
          </button>
        </div>
      )}
    </div>
  )
}
