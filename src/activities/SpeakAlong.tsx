import { useEffect, useState } from 'react'
import { mainWord } from '../data/words'
import {
  listenOnce,
  speakEnglish,
  speakKorean,
  speechRecognitionSupported,
} from '../services/speech'
import { IconButton, Praise } from '../components/ui'

/**
 * Speak: listen and repeat. If speech recognition is available and enabled
 * we only detect that the child tried — nothing is scored, stored, or sent.
 * Otherwise we fall back to listen-and-repeat with a self-report button.
 */
export function SpeakAlong(props: {
  letter: string
  micEnabled: boolean
  onNext: () => void
}) {
  const word = mainWord(props.letter)
  const canListen = props.micEnabled && speechRecognitionSupported()
  const [listening, setListening] = useState(false)
  const [praise, setPraise] = useState<string | null>(null)

  useEffect(() => {
    void speakEnglish(word.word)
  }, [word.word])

  const tryListen = async () => {
    if (listening) return
    setListening(true)
    setPraise(null)
    void speakKorean('따라 말해 보세요')
    const result = await listenOnce()
    setListening(false)
    // Trying is what counts — every outcome gets a warm response.
    if (result === 'spoke') setPraise('🎉 멋지게 따라 했어요!')
    else setPraise('😊 좋아요! 한 번 더 들어볼까요?')
  }

  return (
    <div className="screen" data-testid="speak-along">
      <p className="hint-line">🗣️ 듣고 따라 말해 봐요</p>
      <button
        type="button"
        className="word-card"
        data-testid="speak-word"
        onClick={() => void speakEnglish(word.word)}
      >
        <span className="word-emoji" aria-hidden>
          {word.emoji}
        </span>
        <span>{word.word}</span>
      </button>
      <div className="button-row">
        <IconButton icon="🔊" label="다시 듣기" onClick={() => void speakEnglish(word.word)} />
        {canListen && (
          <IconButton
            icon={listening ? '👂' : '🎤'}
            label="말해 보기"
            testId="speak-mic"
            onClick={() => void tryListen()}
          />
        )}
      </div>
      {!canListen && <p className="hint-line">소리를 듣고 큰 소리로 따라 말해 봐요</p>}
      {praise && <Praise text={praise} />}
      <div className="button-row">
        <button
          type="button"
          className="action-button"
          data-testid="speak-next"
          onClick={() => {
            void speakKorean('참 잘했어요!')
            props.onNext()
          }}
        >
          말했어요 ✅
        </button>
      </div>
    </div>
  )
}
