import { defineConfig, devices } from "@playwright/test";

const crossBrowser = process.env.PLAYWRIGHT_CROSS_BROWSER === "1";
// Constrained sandboxes (≈2 GB, small /dev/shm) need these Chromium flags, or
// the renderer crashes mid-journey. CI keeps the default launch behaviour.
const lowMemory = process.env.PLAYWRIGHT_LOW_MEMORY === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...(lowMemory
      ? {
          launchOptions: {
            args: [
              "--disable-dev-shm-usage",
              "--disable-gpu",
              "--no-sandbox",
              "--disable-extensions",
              // One renderer process with a small JS heap keeps the browser
              // inside the sandbox memory budget instead of crashing mid-journey.
              "--single-process",
              "--no-zygote",
              "--js-flags=--max-old-space-size=256",
            ],
          },
          navigationTimeout: 60_000,
        }
      : {}),
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    ...(crossBrowser
      ? [
          { name: "firefox", use: { ...devices["Desktop Firefox"] } },
          { name: "webkit", use: { ...devices["Desktop Safari"] } },
        ]
      : []),
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000/ar",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
