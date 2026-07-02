/**
 * Thin wrapper around the Web Speech API.
 * - Never records or uploads audio.
 * - Fails silently when unsupported so the app keeps working (visual fallback).
 *
 * Mobile quirks handled here:
 * - Browsers only allow speech started from a user gesture, so initSpeech()
 *   unlocks the engine on the very first tap anywhere in the app.
 * - Android Chrome drops utterances spoken immediately after cancel(), can
 *   get stuck in a paused state, and loads its voice list asynchronously.
 */

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let voices: SpeechSynthesisVoice[] = []

function loadVoices(): void {
  if (!ttsSupported()) return
  try {
    voices = window.speechSynthesis.getVoices?.() ?? []
  } catch {
    voices = []
  }
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (voices.length === 0) loadVoices()
  const norm = (l: string) => l.replace('_', '-').toLowerCase()
  const target = norm(lang)
  const prefix = target.slice(0, 2)
  return (
    voices.find((v) => norm(v.lang) === target && v.localService) ??
    voices.find((v) => norm(v.lang) === target) ??
    voices.find((v) => norm(v.lang).startsWith(prefix)) ??
    null
  )
}

let initialized = false

/**
 * Call once at startup. Loads voices and unlocks audio on the first tap:
 * mobile browsers only allow speech that starts inside a user gesture, so
 * we speak a silent utterance synchronously in the first pointer event.
 */
export function initSpeech(): void {
  if (initialized || !ttsSupported()) return
  initialized = true
  loadVoices()
  try {
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
  } catch {
    // older engines without addEventListener on speechSynthesis
  }
  const unlock = () => {
    try {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      window.speechSynthesis.speak(u)
    } catch {
      // best effort — replay buttons still work from direct gestures
    }
  }
  window.addEventListener('pointerdown', unlock, { once: true, capture: true })
}

/** Speak text, cancelling any ongoing speech to avoid overlap. */
export function speak(text: string, lang = 'en-US', rate = 0.85): Promise<void> {
  if (!ttsSupported()) return Promise.resolve()
  const synth = window.speechSynthesis
  return new Promise((resolve) => {
    let settled = false
    const done = () => {
      if (!settled) {
        settled = true
        resolve()
      }
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = rate
    utter.pitch = 1.05
    const voice = pickVoice(lang)
    if (voice) utter.voice = voice
    utter.onend = done
    utter.onerror = done
    const start = () => {
      try {
        // Android Chrome can be stuck in a paused state; resume is a no-op otherwise.
        synth.resume?.()
        synth.speak(utter)
      } catch {
        done()
        return
      }
      // Safety net: some mobile browsers drop onend events.
      window.setTimeout(done, Math.max(3000, text.length * 250))
    }
    if (synth.speaking || synth.pending) {
      synth.cancel()
      // Speaking immediately after cancel() silently drops the utterance
      // on Android Chrome — give the engine a beat to settle.
      window.setTimeout(start, 80)
    } else {
      start()
    }
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
  if (!ttsSupported()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    // ignore
  }
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
