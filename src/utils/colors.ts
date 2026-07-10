import type { CSSProperties } from 'react'

/** Each letter gets its own pastel hue (golden-angle spacing → varied). */
export function letterHue(letter: string): number {
  const index = letter.toUpperCase().charCodeAt(0) - 65
  return Math.round((index * 137.5) % 360)
}

export function letterStyle(letter: string): CSSProperties {
  const h = letterHue(letter)
  return {
    background: `hsl(${h} 85% 94%)`,
    borderColor: `hsl(${h} 70% 72%)`,
    color: `hsl(${h} 60% 32%)`,
  }
}
