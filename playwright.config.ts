import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  retries: 1,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
