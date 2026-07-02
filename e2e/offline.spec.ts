import { test, expect } from '@playwright/test'

test('core app works offline after the first load', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByTestId('home-screen')).toBeVisible()

  // Wait for the service worker to be active, then reload so it controls the page.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await expect(page.getByTestId('home-screen')).toBeVisible()

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByTestId('home-screen')).toBeVisible()
  await expect(page.getByText(/오프라인이에요/)).toBeVisible()

  // Learning still works offline: open the free tracing screen
  await page.getByTestId('go-trace').click()
  await expect(page.getByTestId('trace-free')).toBeVisible()

  await context.setOffline(false)
})
