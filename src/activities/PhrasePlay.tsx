import { useEffect, useState } from 'react'
import { phraseById } from '../data/phrases'
import { sayKo, sayPhrase } from '../services/sound'
import { IconButton, Praise } from '../components/ui'

/** Short everyday expression: hear it, see the scene, repeat it. */
export function PhrasePlay(props: { phraseId: string; onNext: () => void }) {
  const phrase = phraseById(props.phraseId)
  const [tried, setTried] = useState(false)

  useEffect(() => {
    void sayPhrase(phrase)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase.id])

  return (
    <div className="screen" data-testid="phrase-play" data-phrase={phrase.id}>
      <p className="hint-line">💬 오늘의 한 마디</p>
      <button
        type="button"
        className="word-card phrase-card"
        data-testid="phrase-word"
        onClick={() => {
          setTried(true)
          void sayPhrase(phrase)
        }}
      >
        <span className="word-emoji" aria-hidden>
          {phrase.emoji}
        </span>
        <span className="phrase-text">{phrase.text}</span>
        <span className="phrase-ko">{phrase.ko}</span>
      </button>
      <div className="button-row">
        <IconButton
          icon="🔊"
          label="다시 듣기"
          onClick={() => {
            setTried(true)
            void sayPhrase(phrase)
          }}
        />
      </div>
      <p className="hint-line">🗣️ 듣고 큰 소리로 따라 말해 봐요</p>
      {tried && <Praise text="😊 좋아요!" />}
      <div className="button-row">
        <button
          type="button"
          className="action-button"
          data-testid="phrase-next"
          onClick={() => {
            void sayKo('great')
            props.onNext()
          }}
        >
          말했어요 ✅
        </button>
      </div>
    </div>
  )
}
