import type { ChantLine, Phrase, WordItem } from '../types'
import { letterInfo } from '../data/letters'
import { FEEDBACK, type FeedbackId } from '../data/feedback'
import { playFile, stopFile } from './audio'
import { speakEnglish, speakKorean, stopSpeaking, ttsSupported } from './speech'

/**
 * One place to make the app talk. Bundled audio clips play first (work in
 * every browser and offline); browser TTS is only a fallback for clips
 * that fail to load. Nothing is ever recorded.
 */

export function soundAvailable(): boolean {
  return typeof Audio !== 'undefined' || ttsSupported()
}

export function stopAll(): void {
  stopFile()
  stopSpeaking()
}

async function say(clip: string, fallbackText: string, lang: 'en' | 'ko'): Promise<void> {
  stopSpeaking()
  const played = await playFile(`audio/${clip}.wav`)
  if (!played) {
    await (lang === 'en' ? speakEnglish(fallbackText) : speakKorean(fallbackText))
  }
}

export function sayLetterName(letter: string): Promise<void> {
  const L = letter.toUpperCase()
  return say(`letter-${L}`, L, 'en')
}

export function sayLetterSound(letter: string): Promise<void> {
  const L = letter.toUpperCase()
  return say(`sound-${L}`, letterInfo(L).soundText, 'en')
}

export function sayWord(word: WordItem): Promise<void> {
  return say(`word-${word.id}`, word.word, 'en')
}

export function sayPhrase(phrase: Phrase): Promise<void> {
  return say(`phrase-${phrase.id}`, phrase.text, 'en')
}

export function sayKo(id: FeedbackId): Promise<void> {
  return say(`ko-${id}`, FEEDBACK[id], 'ko')
}

/** Play a chant line: its clips in order, or one TTS reading as fallback. */
export async function sayLine(line: ChantLine): Promise<void> {
  stopSpeaking()
  for (const clip of line.audio) {
    const played = await playFile(`audio/${clip}.wav`)
    if (!played) {
      await speakEnglish(line.text)
      return
    }
  }
}
