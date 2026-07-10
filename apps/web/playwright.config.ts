import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "pnpm --filter @collabe-md/server dev",
      url: "http://localhost:3001/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: {
        DATABASE_URL:
          process.env.DATABASE_URL ??
          "postgresql://collabe:collabe@localhost:5433/collabe_md",
        CORS_ORIGIN: "http://localhost:5173",
        WS_PORT: "3002",
      },
    },
    {
      command: "pnpm --filter @collabe-md/web dev",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
