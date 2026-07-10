import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom has no Web Speech API — install a fast fake so speak() resolves.
class FakeUtterance {
  text: string
  lang = ''
  rate = 1
  pitch = 1
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(text: string) {
    this.text = text
  }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: FakeUtterance,
})

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    cancel: vi.fn(),
    speak: (u: FakeUtterance) => {
      setTimeout(() => u.onend?.(), 0)
    },
  },
})

// jsdom cannot play media — a quiet stub makes playFile() fall back to the
// fake TTS above without "not implemented" noise in test output.
class FakeAudio {
  src: string
  onended: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(src: string) {
    this.src = src
  }
  play(): undefined {
    return undefined
  }
  pause(): void {}
}

Object.defineProperty(window, 'Audio', { writable: true, value: FakeAudio })

beforeEach(() => {
  localStorage.clear()
})
