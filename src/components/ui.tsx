import { useEffect, useState, type ReactNode } from 'react'

export function BigButton(props: {
  icon: string
  label: string
  onClick: () => void
  testId?: string
  tone?: 'main' | 'soft'
}) {
  return (
    <button
      type="button"
      className={`big-button ${props.tone === 'soft' ? 'big-button-soft' : ''}`}
      onClick={props.onClick}
      data-testid={props.testId}
    >
      <span className="big-button-icon" aria-hidden>
        {props.icon}
      </span>
      <span className="big-button-label">{props.label}</span>
    </button>
  )
}

export function IconButton(props: {
  icon: string
  label: string
  onClick: () => void
  testId?: string
}) {
  return (
    <button
      type="button"
      className="icon-button"
      onClick={props.onClick}
      aria-label={props.label}
      data-testid={props.testId}
    >
      {props.icon}
    </button>
  )
}

/** Gentle praise line — no loud effects, no negative feedback anywhere. */
export function Praise(props: { text: string }) {
  return (
    <p className="praise" role="status">
      {props.text}
    </p>
  )
}

export function ScreenTitle(props: { icon: string; text: string }) {
  return (
    <h1 className="screen-title">
      <span aria-hidden>{props.icon}</span> {props.text}
    </h1>
  )
}

export function OfflineBanner() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  if (online) return null
  return <div className="offline-banner">📴 오프라인이에요 — 학습은 계속할 수 있어요</div>
}

export function Screen(props: { children: ReactNode; testId?: string }) {
  return (
    <div className="screen" data-testid={props.testId}>
      {props.children}
    </div>
  )
}

/** A button that must be held down (parents only) before it activates. */
export function LongPressButton(props: {
  label: string
  holdMs?: number
  onLongPress: () => void
  testId?: string
}) {
  const holdMs = props.holdMs ?? 1200
  const [holding, setHolding] = useState(false)

  useEffect(() => {
    if (!holding) return
    const t = window.setTimeout(() => {
      setHolding(false)
      props.onLongPress()
    }, holdMs)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holding, holdMs])

  return (
    <button
      type="button"
      className={`long-press-button ${holding ? 'holding' : ''}`}
      onPointerDown={() => setHolding(true)}
      onPointerUp={() => setHolding(false)}
      onPointerLeave={() => setHolding(false)}
      onContextMenu={(e) => e.preventDefault()}
      data-testid={props.testId}
    >
      {props.label}
    </button>
  )
}
