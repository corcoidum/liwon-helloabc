/**
 * Thin wrapper around the Web Speech API.
 * - Never records or uploads audio.
 * - Fails silently when unsupported so the app keeps working (visual fallback).
 */

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let currentResolve: (() => void) | null = null

/** Speak text, cancelling any ongoing speech to avoid overlap. */
export function speak(text: string, lang = 'en-US', rate = 0.85): Promise<void> {
  if (!ttsSupported()) return Promise.resolve()
  window.speechSynthesis.cancel()
  if (currentResolve) {
    currentResolve()
    currentResolve = null
  }
  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = rate
    utter.pitch = 1.05
    currentResolve = resolve
    const done = () => {
      if (currentResolve === resolve) currentResolve = null
      resolve()
    }
    utter.onend = done
    utter.onerror = done
    window.speechSynthesis.speak(utter)
    // Safety net: some mobile browsers drop onend events.
    window.setTimeout(done, Math.max(2500, text.length * 220))
  })
}

export function speakEnglish(text: string): Promise<void> {
  return speak(text, 'en-US', 0.8)
}

/** Korean guidance for the child (short phrases only). */
export function speakKorean(text: string): Promise<void> {
  return speak(text, 'ko-KR', 0.95)
}

export function stopSpeaking(): void {
  if (ttsSupported()) window.speechSynthesis.cancel()
}

interface RecognitionLike {
  lang: string
  start: () => void
  stop: () => void
  onresult: ((e: unknown) => void) | null
  onend: (() => void) | null
  onerror: ((e: unknown) => void) | null
}

function recognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => RecognitionLike)
    | null
}

export function speechRecognitionSupported(): boolean {
  return recognitionCtor() !== null
}

/**
 * Listen briefly so the child can try speaking. We only detect that speech
 * happened — the result text is discarded and never scored, stored, or sent.
 */
export function listenOnce(timeoutMs = 5000): Promise<'spoke' | 'silent' | 'unavailable'> {
  const Ctor = recognitionCtor()
  if (!Ctor) return Promise.resolve('unavailable')
  return new Promise((resolve) => {
    let settled = false
    const finish = (result: 'spoke' | 'silent' | 'unavailable') => {
      if (settled) return
      settled = true
      try {
        rec.stop()
      } catch {
        // already stopped
      }
      resolve(result)
    }
    let rec: RecognitionLike
    try {
      rec = new Ctor()
    } catch {
      resolve('unavailable')
      return
    }
    rec.lang = 'en-US'
    rec.onresult = () => finish('spoke')
    rec.onend = () => finish('silent')
    rec.onerror = () => finish('unavailable')
    try {
      rec.start()
    } catch {
      finish('unavailable')
      return
    }
    window.setTimeout(() => finish('silent'), timeoutMs)
  })
}
