import { test, expect, type Page } from '@playwright/test'

/**
 * Full child flow: home → lesson (intro, listen, trace ×2 letters) →
 * matching game → speaking → chant → end → progress persisted →
 * refresh → parent area shows progress and review items.
 */

async function scribbleOnCanvas(page: Page) {
  const canvas = page.getByTestId('trace-board').locator('canvas')
  const box = await canvas.boundingBox()
  if (!box) throw new Error('trace canvas not visible')
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2
  await page.mouse.move(cx - 60, cy - 80)
  await page.mouse.down()
  for (const [dx, dy] of [
    [0, 60],
    [30, 60],
    [60, -20],
    [-40, 40],
    [80, 0],
  ]) {
    await page.mouse.move(cx + dx, cy + dy, { steps: 8 })
  }
  await page.mouse.up()
  await expect(page.getByTestId('trace-done')).toBeEnabled()
  await page.getByTestId('trace-done').click()
}

async function solveListen(page: Page) {
  const wrap = page.getByTestId('listen-choose')
  await expect(wrap).toBeVisible()
  const answer = await wrap.getAttribute('data-answer')
  await page.locator(`.choice-card[data-letter="${answer}"]`).click()
  await page.getByTestId('listen-next').click()
}

async function learnLetter(page: Page, letter: string) {
  const intro = page.getByTestId('letter-intro')
  await expect(intro).toBeVisible()
  await expect(intro).toHaveAttribute('data-letter', letter)
  await page.getByTestId('intro-replay').click() // replay audio (다시 듣기)
  await page.getByTestId('intro-next').click()
  await solveListen(page)
  // uppercase then lowercase tracing
  await expect(page.getByTestId('trace-board')).toHaveAttribute('data-glyph', letter)
  await scribbleOnCanvas(page)
  await expect(page.getByTestId('trace-board')).toHaveAttribute(
    'data-glyph',
    letter.toLowerCase(),
  )
  await scribbleOnCanvas(page)
}

test('first daily lesson end-to-end with persistence and parent view', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('home-screen')).toBeVisible()

  // Start today's lesson
  await page.getByTestId('go-lesson').click()
  await learnLetter(page, 'A')
  await learnLetter(page, 'B')

  // Matching game: uppercase ↔ lowercase for A and B
  await expect(page.getByTestId('match-cards')).toBeVisible()
  for (const pair of ['A', 'B']) {
    const cards = page.locator(`.match-card[data-pair="${pair}"]`)
    await cards.nth(0).click()
    await cards.nth(1).click()
  }
  await page.getByTestId('match-next').click()

  // Speaking (fallback-friendly) and chant
  await expect(page.getByTestId('speak-along')).toBeVisible()
  await page.getByTestId('speak-word').click()
  await page.getByTestId('speak-next').click()
  await expect(page.getByTestId('chant-play')).toBeVisible()
  await page.getByTestId('chant-next').click()

  // Clear ending, no auto-continue
  await expect(page.getByTestId('end-screen')).toBeVisible()
  await expect(page.getByTestId('end-letters')).toContainText('A, B')
  await page.getByTestId('end-home').click()
  await expect(page.getByTestId('home-screen')).toBeVisible()

  // Progress persisted locally
  const stored = await page.evaluate(() => localStorage.getItem('hello-abc-data-v1'))
  expect(stored).toBeTruthy()
  const data = JSON.parse(stored!)
  expect(data.progress.A.introduced).toBe(true)
  expect(data.progress.B.introduced).toBe(true)
  expect(data.studyLog.length).toBeGreaterThan(0)

  // Survives refresh
  await page.reload()
  await expect(page.getByTestId('home-screen')).toBeVisible()

  // Parent area via long press
  const hold = page.getByTestId('parent-hold')
  const box = await hold.boundingBox()
  if (!box) throw new Error('parent hold button not visible')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(1500)
  await page.mouse.up()
  await expect(page.getByTestId('parent-area')).toBeVisible()
  await expect(page.getByTestId('parent-progress')).toContainText('2 / 26')
  // replayed letters appear as review suggestions
  await expect(page.getByTestId('parent-review')).toContainText('A')
  await page.getByTestId('parent-back').click()
  await expect(page.getByTestId('home-screen')).toBeVisible()
})

test('layout fits a 360px-wide screen without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('/')
  await expect(page.getByTestId('home-screen')).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(overflow).toBe(false)
  // Main touch targets stay at least 48px tall
  const box = await page.getByTestId('go-lesson').boundingBox()
  expect(box && box.height >= 48).toBe(true)
})

test('review screen offers items after mistakes', async ({ page }) => {
  await page.goto('/')
  // Seed a struggling letter directly in local storage (partial data is
  // merged with defaults by loadData)
  await page.evaluate(() => {
    localStorage.setItem(
      'hello-abc-data-v1',
      JSON.stringify({
        progress: {
          A: {
            letter: 'A',
            introduced: true,
            correct: 0,
            incorrect: 2,
            replays: 0,
            tracedUpper: true,
            tracedLower: true,
            lastStudiedAt: Date.now(),
          },
        },
        settings: { sessionMinutes: 8, micEnabled: true },
        studyLog: [],
      }),
    )
  })
  await page.reload()
  await page.getByTestId('go-review').click()
  const wrap = page.getByTestId('listen-choose')
  await expect(wrap).toBeVisible()
  await expect(wrap).toHaveAttribute('data-answer', 'A')
})
