import { useState } from 'react'
import type { AppData } from '../types'
import { ALPHABET } from '../data/letters'
import { reviewQueue } from '../services/review'
import { Screen, ScreenTitle } from '../components/ui'

/** Parent-only dashboard: progress, difficult items, settings, data reset. */
export function ParentArea(props: {
  data: AppData
  onSettings: (change: Partial<AppData['settings']>) => void
  onReset: () => void
  onBack: () => void
}) {
  const { data } = props
  const [confirming, setConfirming] = useState(false)

  const learned = ALPHABET.filter((l) => data.progress[l]?.introduced)
  const difficult = Object.values(data.progress)
    .filter((p) => p.introduced && p.incorrect >= 2)
    .sort((a, b) => b.incorrect - a.incorrect)
    .map((p) => `${p.letter} (${p.incorrect}회 틀림)`)
  const queue = reviewQueue(data.progress).slice(0, 6)
  const totalMinutes = Math.round(
    data.studyLog.reduce((sum, e) => sum + e.seconds, 0) / 60,
  )

  return (
    <Screen testId="parent-area">
      <ScreenTitle icon="👨‍👩‍👧" text="부모 메뉴" />

      <section className="parent-section" data-testid="parent-progress">
        <h2>전체 진도: {learned.length} / 26 글자</h2>
        <div className="progress-letters">
          {ALPHABET.map((l) => (
            <span
              key={l}
              className={`progress-chip ${data.progress[l]?.introduced ? 'learned' : ''}`}
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      <section className="parent-section">
        <h2>학습 기록</h2>
        <p>학습한 날: {data.studyLog.length}일</p>
        <p>총 학습 시간: 약 {totalMinutes}분</p>
        <p>
          최근 학습일:{' '}
          {data.studyLog.length > 0 ? data.studyLog[data.studyLog.length - 1].date : '아직 없음'}
        </p>
      </section>

      <section className="parent-section" data-testid="parent-review">
        <h2>복습이 필요한 글자</h2>
        {queue.length === 0 ? (
          <p>지금은 없습니다.</p>
        ) : (
          <ul>
            {queue.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        )}
        <h2>자주 틀리는 글자</h2>
        {difficult.length === 0 ? (
          <p>지금은 없습니다.</p>
        ) : (
          <ul>
            {difficult.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="parent-section">
        <h2>설정</h2>
        <label>
          하루 학습 시간
          <select
            value={data.settings.sessionMinutes}
            onChange={(e) => props.onSettings({ sessionMinutes: Number(e.target.value) })}
          >
            <option value={5}>5분</option>
            <option value={8}>8분</option>
            <option value={10}>10분</option>
          </select>
        </label>
        <label>
          마이크 (따라 말하기)
          <input
            type="checkbox"
            checked={data.settings.micEnabled}
            onChange={(e) => props.onSettings({ micEnabled: e.target.checked })}
            style={{ width: 28, height: 28 }}
          />
        </label>
      </section>

      <section className="parent-section">
        <h2>개인정보</h2>
        <p>
          모든 학습 기록은 이 기기에만 저장됩니다. 로그인, 광고, 분석 도구가 없으며 음성은
          녹음·저장·전송되지 않습니다.
        </p>
        {!confirming ? (
          <button
            type="button"
            className="action-button secondary"
            data-testid="reset-data"
            onClick={() => setConfirming(true)}
          >
            🗑️ 학습 기록 모두 지우기
          </button>
        ) : (
          <div className="button-row">
            <button
              type="button"
              className="action-button"
              data-testid="reset-confirm"
              onClick={() => {
                setConfirming(false)
                props.onReset()
              }}
            >
              정말 지울게요
            </button>
            <button
              type="button"
              className="action-button secondary"
              onClick={() => setConfirming(false)}
            >
              취소
            </button>
          </div>
        )}
      </section>

      <div className="button-row">
        <button
          type="button"
          className="action-button"
          data-testid="parent-back"
          onClick={props.onBack}
        >
          🏠 처음으로
        </button>
      </div>
    </Screen>
  )
}
