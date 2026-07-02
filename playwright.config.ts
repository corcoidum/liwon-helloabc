import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4173',
    ...devices['Pixel 5'], // 393px-wide mobile viewport, touch enabled
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
