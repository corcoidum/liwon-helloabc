import { useState } from 'react'
import type { AppData, LessonStep } from '../types'
import { reviewQueue } from '../services/review'
import { Screen, ScreenTitle } from '../components/ui'
import { LessonRunner, type ApplyFn } from './LessonRunner'

/** Light review session built from the local review rules. */
export function ReviewScreen(props: { data: AppData; apply: ApplyFn; onBack: () => void }) {
  const [steps] = useState<LessonStep[] | null>(() => {
    const queue = reviewQueue(props.data.progress).slice(0, 3)
    if (queue.length === 0) return null
    const s: LessonStep[] = queue.map((letter) => ({ type: 'listen', letter }))
    s.push({ type: 'end' })
    return s
  })

  if (!steps) {
    return (
      <Screen testId="review-empty">
        <ScreenTitle icon="🔁" text="복습하기" />
        <p className="end-summary">지금은 복습할 것이 없어요! 🎉</p>
        <p className="hint-line">오늘의 학습을 먼저 해 보세요.</p>
        <div className="button-row">
          <button type="button" className="action-button" onClick={props.onBack}>
            🏠 처음으로
          </button>
        </div>
      </Screen>
    )
  }

  return (
    <LessonRunner data={props.data} apply={props.apply} onExit={props.onBack} steps={steps} />
  )
}
