import { BigButton, LongPressButton, OfflineBanner, Screen, ScreenTitle } from '../components/ui'

export type HomeTarget =
  | 'lesson'
  | 'trace'
  | 'match'
  | 'sort'
  | 'chant'
  | 'review'
  | 'parent'

/** One clear action per tile: big icon, short label, wide touch area. */
export function Home(props: { onGo: (target: HomeTarget) => void }) {
  return (
    <Screen testId="home-screen">
      <ScreenTitle icon="🐻" text="헬로 ABC" />
      <OfflineBanner />
      <div className="home-grid">
        <BigButton
          icon="🌞"
          label="오늘의 학습"
          testId="go-lesson"
          onClick={() => props.onGo('lesson')}
        />
        <BigButton
          icon="✍️"
          label="따라 쓰기"
          testId="go-trace"
          tone="soft"
          onClick={() => props.onGo('trace')}
        />
        <BigButton
          icon="🃏"
          label="카드 놀이"
          testId="go-match"
          tone="soft"
          onClick={() => props.onGo('match')}
        />
        <BigButton
          icon="🧺"
          label="분류 놀이"
          testId="go-sort"
          tone="soft"
          onClick={() => props.onGo('sort')}
        />
        <BigButton
          icon="🎵"
          label="챈트"
          testId="go-chant"
          tone="soft"
          onClick={() => props.onGo('chant')}
        />
        <BigButton
          icon="🔁"
          label="복습하기"
          testId="go-review"
          tone="soft"
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
