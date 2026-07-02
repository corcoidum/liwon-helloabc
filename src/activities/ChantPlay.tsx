import { useEffect, useRef, useState } from 'react'
import { chantById } from '../data/chants'
import { speakEnglish, stopSpeaking } from '../services/speech'
import { Praise } from '../components/ui'

/** Rhythm: a short original chant, each line highlighted as it plays. */
export function ChantPlay(props: { chantId: string; onNext: () => void }) {
  const chant = chantById(props.chantId)
  const [activeLine, setActiveLine] = useState(-1)
  const [played, setPlayed] = useState(false)
  const playingRef = useRef(false)

  const play = async () => {
    if (playingRef.current) return
    playingRef.current = true
    for (let i = 0; i < chant.lines.length; i++) {
      setActiveLine(i)
      await speakEnglish(chant.lines[i])
    }
    setActiveLine(-1)
    setPlayed(true)
    playingRef.current = false
  }

  useEffect(() => {
    void play()
    return () => {
      playingRef.current = false
      stopSpeaking()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chantId])

  return (
    <div className="screen" data-testid="chant-play">
      <p className="hint-line">🎵 {chant.title} — 함께 말해 봐요</p>
      {chant.lines.map((line, i) => (
        <p key={i} className={`chant-line ${i === activeLine ? 'active' : ''}`}>
          {line}
        </p>
      ))}
      {played && <Praise text="🎉 신나게 했어요!" />}
      <div className="button-row">
        <button type="button" className="action-button secondary" onClick={() => void play()}>
          🔁 한 번 더
        </button>
        <button
          type="button"
          className="action-button"
          data-testid="chant-next"
          onClick={props.onNext}
        >
          다음 ➡️
        </button>
      </div>
    </div>
  )
}
