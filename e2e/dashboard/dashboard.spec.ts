import { test, expect } from "@playwright/test";

test("should display the dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Caju Front Teste");

  const title = page.locator("h1");
  await expect(title).toHaveText("Caju Front Teste");
});

test("navigate to new user page", async ({ page }) => {
  await page.goto("/");
  const newUserButton = page.locator("button", { hasText: "Nova Admissão" });
  await newUserButton.click();

  await expect(page).toHaveURL("/#/new-user");
});
