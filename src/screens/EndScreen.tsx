import { useEffect } from 'react'
import { speakKorean } from '../services/speech'
import { Screen } from '../components/ui'

/**
 * Clear, calm session ending: one sticker, a short summary, no push to
 * continue. More learning is only reachable by starting again from home.
 */
export function EndScreen(props: { newLetters: string[]; onHome: () => void }) {
  useEffect(() => {
    void speakKorean('오늘 영어 놀이는 여기까지예요. 다음에 또 만나요!')
  }, [])

  return (
    <Screen testId="end-screen">
      <p className="end-sticker" aria-hidden>
        🐻⭐
      </p>
      <p className="end-summary">참 잘했어요!</p>
      {props.newLetters.length > 0 && (
        <p className="end-summary" data-testid="end-letters">
          오늘 배운 글자: {props.newLetters.join(', ')}
        </p>
      )}
      <p className="hint-line">오늘 영어 놀이는 여기까지예요. 다음에 또 만나요! 👋</p>
      <div className="button-row">
        <button
          type="button"
          className="action-button"
          data-testid="end-home"
          onClick={props.onHome}
        >
          🏠 처음으로
        </button>
      </div>
    </Screen>
  )
}
