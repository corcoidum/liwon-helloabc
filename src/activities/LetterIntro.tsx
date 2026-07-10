import { useEffect } from 'react'
import { mainWord } from '../data/words'
import { sayKo, sayLetterName, sayLetterSound, sayWord } from '../services/sound'
import { letterStyle } from '../utils/colors'
import { IconButton } from '../components/ui'

/** See → Hear: show the letter pair, its name, its sound, and a word. */
export function LetterIntro(props: {
  letter: string
  onReplay: () => void
  onNext: () => void
}) {
  const word = mainWord(props.letter)

  const sayAll = async () => {
    await sayLetterName(props.letter)
    await sayLetterSound(props.letter)
    await sayWord(word)
  }

  useEffect(() => {
    void sayAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.letter])

  return (
    <div className="screen" data-testid="letter-intro" data-letter={props.letter}>
      <div className="letter-hero float-gently" style={letterStyle(props.letter)}>
        <span>{props.letter}</span>
        <span className="lower">{props.letter.toLowerCase()}</span>
      </div>
      <button
        type="button"
        className="word-card"
        data-testid="intro-word"
        onClick={() => {
          props.onReplay()
          void sayWord(word)
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
            void sayKo('good-job')
            props.onNext()
          }}
        >
          다음 ➡️
        </button>
      </div>
    </div>
  )
}
