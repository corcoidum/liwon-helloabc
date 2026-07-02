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

beforeEach(() => {
  localStorage.clear()
})
