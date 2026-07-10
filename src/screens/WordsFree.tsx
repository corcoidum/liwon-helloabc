import { useState } from 'react'
import { WORDS } from '../data/words'
import { sayWord } from '../services/sound'
import { letterStyle } from '../utils/colors'
import { Screen, ScreenTitle } from '../components/ui'

const CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: 'animal', label: '동물', emoji: '🐾' },
  { id: 'food', label: '음식', emoji: '🍎' },
  { id: 'toy', label: '장난감', emoji: '🧸' },
  { id: 'vehicle', label: '탈것', emoji: '🚗' },
  { id: 'body', label: '몸', emoji: '🖐️' },
  { id: 'home', label: '집', emoji: '🏠' },
  { id: 'nature', label: '자연', emoji: '🌿' },
  { id: 'etc', label: '더 보기', emoji: '✨' },
]

const MAIN_IDS = CATEGORIES.slice(0, -1).map((c) => c.id)

/** Word playground: browse familiar words by category, tap to hear. */
export function WordsFree(props: { onBack: () => void }) {
  const [category, setCategory] = useState<string | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)

  if (category) {
    const words = WORDS.filter((w) =>
      category === 'etc' ? !MAIN_IDS.includes(w.category) : w.category === category,
    )
    const cat = CATEGORIES.find((c) => c.id === category)
    return (
      <Screen testId="words-list">
        <ScreenTitle icon={cat?.emoji ?? '✨'} text={cat?.label ?? '단어'} />
        <p className="hint-line">👆 그림을 누르면 소리가 나요</p>
        <div className="word-grid">
          {words.map((w) => (
            <button
              key={w.id}
              type="button"
              className={`word-card small ${playing === w.id ? 'playing' : ''}`}
              style={letterStyle(w.letter)}
              onClick={() => {
                setPlaying(w.id)
                void sayWord(w).finally(() => setPlaying((p) => (p === w.id ? null : p)))
              }}
            >
              <span className="word-emoji" aria-hidden>
                {w.emoji}
              </span>
              <span>{w.word}</span>
            </button>
          ))}
        </div>
        <div className="button-row">
          <button
            type="button"
            className="action-button secondary"
            onClick={() => setCategory(null)}
          >
            ⬅️ 다른 단어
          </button>
          <button type="button" className="action-button" onClick={props.onBack}>
            🏠 처음으로
          </button>
        </div>
      </Screen>
    )
  }

  return (
    <Screen testId="words-free">
      <ScreenTitle icon="🖼️" text="단어 구경" />
      <div className="home-grid">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className="big-button"
            onClick={() => setCategory(c.id)}
          >
            <span className="big-button-icon" aria-hidden>
              {c.emoji}
            </span>
            <span className="big-button-label">{c.label}</span>
          </button>
        ))}
      </div>
      <div className="button-row">
        <button type="button" className="action-button secondary" onClick={props.onBack}>
          🏠 처음으로
        </button>
      </div>
    </Screen>
  )
}
