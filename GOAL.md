# Goal

Build a mobile-first PWA for a 5-year-old who knows only a few English letters. Teach through seeing, listening, speaking, tracing, matching, and review.

Use this 5–10 minute flow: **See → Hear → Touch → Speak → Trace → Play → Review**

## Curriculum

- Uppercase A–Z and lowercase a–z; letter names and basic phonics
- Uppercase/lowercase matching; first-sound recognition
- 50+ familiar words; touch tracing
- Listening, matching, sorting, and short speaking practice
- Review of difficult items; no more than two new letters per session

## Scope

React, TypeScript, Vite, PWA, local storage, Web Speech API, Canvas/SVG, Vitest, Playwright.
Runs in a mobile browser, installs as a PWA, works offline after first load, stores progress only on-device.
**Keep learning content in JSON/TypeScript data files separate from UI code.**

No login, server DB, ads, payments, analytics, external links, social sharing, personal-data collection, rankings, streaks, endless play, negative feedback, or unlicensed media.

## Core Features

- Daily lesson: short review → 1–2 new letters → listening → tracing → matching/sorting → clear end screen
- Tap to hear letter name, sound, and word; listen-and-choose; case matching; sound/word–picture matching; first-sound sorting; A–Z/a–z touch tracing; original chants under 20s; optional speaking with listen-and-repeat fallback; never score pronunciation
- Review priority (local rules): incorrect items, replayed letters, incomplete tracing, stale items
- Parent area behind long press: study time, progress, missed items, review suggestions, settings, data reset

## UX

Mobile portrait first, 360px width, 48px+ touch targets, one main action per screen, images/icons/audio over text, no color-only signals, no harsh error effects, calm animation.

## Success Criteria

A–Z/a–z lessons, all audio, all activities, and speech fallback work; progress survives refresh; errors enter review; sessions end in 5–10 minutes; parents can view progress and reset data; core features work offline; no personal data leaves the device; lint/typecheck/test/build pass; README covers setup, testing, deployment.
