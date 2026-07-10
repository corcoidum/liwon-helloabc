import { useState } from 'react'
import { PHRASES } from '../data/phrases'
import { sayPhrase } from '../services/sound'
import { Screen, ScreenTitle } from '../components/ui'

/** Expression playground: tap a scene, hear the phrase, say it out loud. */
export function PhraseFree(props: { onBack: () => void }) {
  const [playing, setPlaying] = useState<string | null>(null)

  return (
    <Screen testId="phrase-free">
      <ScreenTitle icon="💬" text="말놀이" />
      <p className="hint-line">👆 누르고, 듣고, 따라 말해 봐요</p>
      <div className="phrase-list">
        {PHRASES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`word-card phrase-card ${playing === p.id ? 'playing' : ''}`}
            onClick={() => {
              setPlaying(p.id)
              void sayPhrase(p).finally(() => setPlaying((cur) => (cur === p.id ? null : cur)))
            }}
          >
            <span className="word-emoji" aria-hidden>
              {p.emoji}
            </span>
            <span className="phrase-text">{p.text}</span>
            <span className="phrase-ko">{p.ko}</span>
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
