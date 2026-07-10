import { BigButton, LongPressButton, OfflineBanner, Screen } from '../components/ui'

export type HomeTarget =
  | 'lesson'
  | 'trace'
  | 'words'
  | 'phrases'
  | 'match'
  | 'sort'
  | 'chant'
  | 'review'
  | 'parent'

/** One clear action per tile: big icon, short label, wide touch area. */
export function Home(props: { onGo: (target: HomeTarget) => void }) {
  return (
    <Screen testId="home-screen">
      <header className="home-header">
        <span className="home-mascot float-gently" aria-hidden>
          🐻
        </span>
        <h1 className="home-title">헬로 ABC</h1>
        <p className="home-sub">오늘도 같이 놀자!</p>
      </header>
      <OfflineBanner />
      <button
        type="button"
        className="hero-button"
        data-testid="go-lesson"
        onClick={() => props.onGo('lesson')}
      >
        <span className="hero-icon" aria-hidden>
          🌞
        </span>
        <span>오늘의 학습</span>
      </button>
      <div className="home-grid">
        <BigButton
          icon="✍️"
          label="따라 쓰기"
          testId="go-trace"
          onClick={() => props.onGo('trace')}
        />
        <BigButton
          icon="🖼️"
          label="단어 구경"
          testId="go-words"
          onClick={() => props.onGo('words')}
        />
        <BigButton
          icon="💬"
          label="말놀이"
          testId="go-phrases"
          onClick={() => props.onGo('phrases')}
        />
        <BigButton
          icon="🃏"
          label="카드 놀이"
          testId="go-match"
          onClick={() => props.onGo('match')}
        />
        <BigButton
          icon="🧺"
          label="분류 놀이"
          testId="go-sort"
          onClick={() => props.onGo('sort')}
        />
        <BigButton icon="🎵" label="챈트" testId="go-chant" onClick={() => props.onGo('chant')} />
        <BigButton
          icon="🔁"
          label="복습하기"
          testId="go-review"
          onClick={() => props.onGo('review')}
        />
      </div>
      <div className="button-row" style={{ marginTop: 'auto' }}>
        <LongPressButton
          label="👨‍👩‍👧 부모님만: 꾹 눌러 주세요"
          testId="parent-hold"
          onLongPress={() => props.onGo('parent')}
        />
      </div>
    </Screen>
  )
}
