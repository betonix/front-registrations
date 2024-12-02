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

test("should create a new admission", async ({ page }) => {
  await page.goto("/");

  const newUserButton = page.locator("button", { hasText: "Nova Admissão" });
  await newUserButton.click();

  await expect(page).toHaveURL("/#/new-user");

  await page.fill('input[placeholder="Digite o nome"]', "João da Silva");
  await page.fill(
    'input[placeholder="Digite um e-mail válido"]',
    "joao.silva@example.com"
  );
  await page.fill('input[placeholder="Digite um CPF válido"]', "09680316416");
  await page.fill('input[type="date"]', "2024-12-15");

  const submitButton = page.locator("button", { hasText: "Cadastrar" });
  await submitButton.click();

  await expect(
    page.locator('.Toastify:has-text("Usuário cadastrado com sucesso!")')
  ).toBeTruthy();

  await expect(page).toHaveURL("/#/dashboard");

  const newAdmission = page.locator("text=João da Silva");
  await expect(newAdmission).toBeTruthy();
});
