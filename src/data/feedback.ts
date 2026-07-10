import feedbackJson from './feedback.json'

/**
 * Short Korean guidance lines (warm, never negative), stored in
 * feedback.json so the audio generation script records each one.
 */
export type FeedbackId =
  | 'good-job'
  | 'great'
  | 'found-it'
  | 'try-again'
  | 'nice-writing'
  | 'good-try'
  | 'found-pair'
  | 'correct'
  | 'repeat-after'
  | 'session-end'

export const FEEDBACK: Record<FeedbackId, string> = Object.fromEntries(
  feedbackJson.map((f) => [f.id, f.text]),
) as Record<FeedbackId, string>
