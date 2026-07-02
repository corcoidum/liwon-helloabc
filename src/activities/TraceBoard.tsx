import { useEffect, useRef, useState } from 'react'
import { speakKorean } from '../services/speech'
import { Praise } from '../components/ui'

const SIZE = 320
const HIT_RADIUS = 26
const PASS_RATIO = 0.5

interface TargetPoint {
  x: number
  y: number
  hit: boolean
}

/**
 * Sample the letter glyph into target points so we can measure coverage
 * without hand-authoring stroke paths for all 52 letters. Tolerance is
 * intentionally generous — we reward trying, not perfect handwriting.
 */
export function sampleGlyphPoints(
  ctx: CanvasRenderingContext2D,
  glyph: string,
  size: number,
): TargetPoint[] {
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = '#000'
  ctx.font = `bold ${Math.floor(size * 0.72)}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(glyph, size / 2, size / 2)
  const image = ctx.getImageData(0, 0, size, size)
  const points: TargetPoint[] = []
  const step = 14
  for (let y = step / 2; y < size; y += step) {
    for (let x = step / 2; x < size; x += step) {
      const alpha = image.data[(Math.floor(y) * size + Math.floor(x)) * 4 + 3]
      if (alpha > 100) points.push({ x, y, hit: false })
    }
  }
  return points
}

export function coverage(points: TargetPoint[]): number {
  if (points.length === 0) return 0
  return points.filter((p) => p.hit).length / points.length
}

/** Trace: the child draws over a large gray letter with a finger. */
export function TraceBoard(props: {
  glyph: string
  onDone: (completed: boolean) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<TargetPoint[]>([])
  const drawingRef = useRef(false)
  const lastRef = useRef<{ x: number; y: number } | null>(null)
  const [drew, setDrew] = useState(false)
  const [passed, setPassed] = useState(false)

  const repaint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, SIZE, SIZE)
    // Guide letter
    ctx.fillStyle = '#e7dccd'
    ctx.font = `bold ${Math.floor(SIZE * 0.72)}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(props.glyph, SIZE / 2, SIZE / 2)
    // Start dot: first target point (top-left-most)
    const start = pointsRef.current[0]
    if (start) {
      ctx.fillStyle = '#16a34a'
      ctx.beginPath()
      ctx.arc(start.x, start.y, 10, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    try {
      pointsRef.current = sampleGlyphPoints(ctx, props.glyph, SIZE)
    } catch {
      pointsRef.current = []
    }
    setDrew(false)
    setPassed(false)
    repaint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.glyph])

  const markHits = (x: number, y: number) => {
    for (const p of pointsRef.current) {
      if (!p.hit && (p.x - x) ** 2 + (p.y - y) ** 2 <= HIT_RADIUS ** 2) p.hit = true
    }
  }

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    }
  }

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Not available in some environments (e.g. jsdom); drawing still works.
    }
    drawingRef.current = true
    lastRef.current = pointerPos(e)
    setDrew(true)
  }

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const pos = pointerPos(e)
    const last = lastRef.current ?? pos
    if (ctx) {
      ctx.strokeStyle = '#f97316'
      ctx.lineWidth = 22
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    markHits(pos.x, pos.y)
    lastRef.current = pos
    if (!passed && coverage(pointsRef.current) >= PASS_RATIO) setPassed(true)
  }

  const onUp = () => {
    drawingRef.current = false
    lastRef.current = null
  }

  const clear = () => {
    for (const p of pointsRef.current) p.hit = false
    setDrew(false)
    setPassed(false)
    repaint()
  }

  return (
    <div className="screen" data-testid="trace-board" data-glyph={props.glyph}>
      <p className="hint-line">✍️ 초록 점부터 손가락으로 따라 써 봐요</p>
      <div className="trace-wrap">
        <canvas
          ref={canvasRef}
          className="trace-canvas"
          width={SIZE}
          height={SIZE}
          style={{ width: 'min(90vw, 320px)', height: 'min(90vw, 320px)' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </div>
      {passed && <Praise text="✨ 멋지게 썼어요!" />}
      <div className="button-row">
        <button type="button" className="action-button secondary" onClick={clear}>
          🧽 다시 쓰기
        </button>
        <button
          type="button"
          className="action-button"
          data-testid="trace-done"
          disabled={!drew}
          onClick={() => {
            void speakKorean(passed ? '멋지게 썼어요!' : '잘 해봤어요!')
            props.onDone(passed)
          }}
        >
          다 썼어요 ✅
        </button>
      </div>
    </div>
  )
}
