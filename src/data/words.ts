import type { WordItem } from '../types'

/**
 * Familiar words for a 5-year-old, separate from UI code.
 * Every word starts with its letter's basic sound and has an emoji picture,
 * so no licensed images are needed. At least two words per letter.
 */
export const WORDS: WordItem[] = [
  { word: 'apple', emoji: '🍎', letter: 'A', category: 'food' },
  { word: 'ant', emoji: '🐜', letter: 'A', category: 'animal' },
  { word: 'arm', emoji: '💪', letter: 'A', category: 'body' },
  { word: 'ball', emoji: '⚽', letter: 'B', category: 'toy' },
  { word: 'banana', emoji: '🍌', letter: 'B', category: 'food' },
  { word: 'bear', emoji: '🐻', letter: 'B', category: 'animal' },
  { word: 'cat', emoji: '🐱', letter: 'C', category: 'animal' },
  { word: 'car', emoji: '🚗', letter: 'C', category: 'vehicle' },
  { word: 'cake', emoji: '🎂', letter: 'C', category: 'food' },
  { word: 'dog', emoji: '🐶', letter: 'D', category: 'animal' },
  { word: 'duck', emoji: '🦆', letter: 'D', category: 'animal' },
  { word: 'door', emoji: '🚪', letter: 'D', category: 'home' },
  { word: 'egg', emoji: '🥚', letter: 'E', category: 'food' },
  { word: 'elephant', emoji: '🐘', letter: 'E', category: 'animal' },
  { word: 'ear', emoji: '👂', letter: 'E', category: 'body' },
  { word: 'fish', emoji: '🐟', letter: 'F', category: 'animal' },
  { word: 'frog', emoji: '🐸', letter: 'F', category: 'animal' },
  { word: 'flower', emoji: '🌸', letter: 'F', category: 'nature' },
  { word: 'goat', emoji: '🐐', letter: 'G', category: 'animal' },
  { word: 'grapes', emoji: '🍇', letter: 'G', category: 'food' },
  { word: 'hat', emoji: '🎩', letter: 'H', category: 'toy' },
  { word: 'hand', emoji: '✋', letter: 'H', category: 'body' },
  { word: 'house', emoji: '🏠', letter: 'H', category: 'home' },
  { word: 'ice cream', emoji: '🍦', letter: 'I', category: 'food' },
  { word: 'insect', emoji: '🐞', letter: 'I', category: 'animal' },
  { word: 'juice', emoji: '🧃', letter: 'J', category: 'food' },
  { word: 'jam', emoji: '🍓', letter: 'J', category: 'food' },
  { word: 'kite', emoji: '🪁', letter: 'K', category: 'toy' },
  { word: 'key', emoji: '🔑', letter: 'K', category: 'home' },
  { word: 'lion', emoji: '🦁', letter: 'L', category: 'animal' },
  { word: 'leg', emoji: '🦵', letter: 'L', category: 'body' },
  { word: 'lemon', emoji: '🍋', letter: 'L', category: 'food' },
  { word: 'moon', emoji: '🌙', letter: 'M', category: 'nature' },
  { word: 'milk', emoji: '🥛', letter: 'M', category: 'food' },
  { word: 'mouse', emoji: '🐭', letter: 'M', category: 'animal' },
  { word: 'nose', emoji: '👃', letter: 'N', category: 'body' },
  { word: 'nest', emoji: '🪺', letter: 'N', category: 'nature' },
  { word: 'octopus', emoji: '🐙', letter: 'O', category: 'animal' },
  { word: 'orange', emoji: '🍊', letter: 'O', category: 'food' },
  { word: 'pig', emoji: '🐷', letter: 'P', category: 'animal' },
  { word: 'pizza', emoji: '🍕', letter: 'P', category: 'food' },
  { word: 'plane', emoji: '✈️', letter: 'P', category: 'vehicle' },
  { word: 'queen', emoji: '👑', letter: 'Q', category: 'family' },
  { word: 'quiet', emoji: '🤫', letter: 'Q', category: 'body' },
  { word: 'rabbit', emoji: '🐰', letter: 'R', category: 'animal' },
  { word: 'rain', emoji: '🌧️', letter: 'R', category: 'nature' },
  { word: 'red', emoji: '🔴', letter: 'R', category: 'color' },
  { word: 'sun', emoji: '☀️', letter: 'S', category: 'nature' },
  { word: 'sock', emoji: '🧦', letter: 'S', category: 'home' },
  { word: 'star', emoji: '⭐', letter: 'S', category: 'nature' },
  { word: 'tiger', emoji: '🐯', letter: 'T', category: 'animal' },
  { word: 'train', emoji: '🚂', letter: 'T', category: 'vehicle' },
  { word: 'tomato', emoji: '🍅', letter: 'T', category: 'food' },
  { word: 'umbrella', emoji: '☂️', letter: 'U', category: 'home' },
  { word: 'up', emoji: '⬆️', letter: 'U', category: 'nature' },
  { word: 'violin', emoji: '🎻', letter: 'V', category: 'toy' },
  { word: 'van', emoji: '🚐', letter: 'V', category: 'vehicle' },
  { word: 'water', emoji: '💧', letter: 'W', category: 'nature' },
  { word: 'watermelon', emoji: '🍉', letter: 'W', category: 'food' },
  { word: 'box', emoji: '📦', letter: 'X', category: 'home' },
  { word: 'fox', emoji: '🦊', letter: 'X', category: 'animal' },
  { word: 'yellow', emoji: '🟡', letter: 'Y', category: 'color' },
  { word: 'yo-yo', emoji: '🪀', letter: 'Y', category: 'toy' },
  { word: 'zebra', emoji: '🦓', letter: 'Z', category: 'animal' },
  { word: 'zoo', emoji: '🐒', letter: 'Z', category: 'animal' },
]

export function wordsForLetter(letter: string): WordItem[] {
  return WORDS.filter((w) => w.letter === letter.toUpperCase())
}

/** First word is the letter's main example word. */
export function mainWord(letter: string): WordItem {
  const list = wordsForLetter(letter)
  if (list.length === 0) throw new Error(`No words for letter: ${letter}`)
  return list[0]
}
