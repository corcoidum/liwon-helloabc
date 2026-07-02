import { useEffect } from 'react'
import { letterInfo } from '../data/letters'
import { mainWord } from '../data/words'
import { speakEnglish, speakKorean } from '../services/speech'
import { IconButton } from '../components/ui'

/** See → Hear: show the letter pair, its name, its sound, and a word. */
export function LetterIntro(props: {
  letter: string
  onReplay: () => void
  onNext: () => void
}) {
  const info = letterInfo(props.letter)
  const word = mainWord(props.letter)

  const sayAll = async () => {
    await speakEnglish(props.letter)
    await speakEnglish(info.soundText)
    await speakEnglish(word.word)
  }

  useEffect(() => {
    void sayAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.letter])

  return (
    <div className="screen" data-testid="letter-intro" data-letter={props.letter}>
      <div className="letter-hero">
        <span>{props.letter}</span>
        <span className="lower">{props.letter.toLowerCase()}</span>
      </div>
      <button
        type="button"
        className="word-card"
        data-testid="intro-word"
        onClick={() => {
          props.onReplay()
          void speakEnglish(word.word)
        }}
      >
        <span className="word-emoji" aria-hidden>
          {word.emoji}
        </span>
        <span>{word.word}</span>
      </button>
      <div className="button-row">
        <IconButton
          icon="🔊"
          label="다시 듣기"
          testId="intro-replay"
          onClick={() => {
            props.onReplay()
            void sayAll()
          }}
        />
      </div>
      <p className="hint-line">🗣️ 소리를 듣고 따라 말해 봐요</p>
      <div className="button-row">
        <button
          type="button"
          className="action-button"
          data-testid="intro-next"
          onClick={() => {
            void speakKorean('잘했어요!')
            props.onNext()
          }}
        >
          다음 ➡️
        </button>
      </div>
    </div>
  )
}
