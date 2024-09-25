import { test, expect } from "@playwright/test";

test("counter", async ({ page }) => {
  await page.goto("/");

  const container = page.locator(".counter");
  const button = container.locator("button").first();
  const display = container.locator("h1").first();

  await button.click();

  await expect(await display.textContent()).toBe("1");

  await button.click();

  await expect(await display.textContent()).toBe("2");
});

test("counter-local-storage", async ({ page }) => {
  await page.goto("/");

  const container = page.locator(".counter-local-storage");
  const button = container.locator("button").first();
  const display = container.locator("h1").first();

  await button.click();

  await expect(await display.textContent()).toBe("1");

  await page.reload();

  await button.click();

  await expect(await display.textContent()).toBe("2");
});

test("monolith-store", async ({ page }) => {
  await page.goto("/");

  const container = page.locator(".monolith-store");
  const btnX = container.locator("button").nth(0);
  const btnY = container.locator("button").nth(1);
  const total = container.locator("h3").nth(1);

  await btnX.click();
  await btnY.click();

  await expect(await btnX.textContent()).toContain("2");
  await expect(await btnY.textContent()).toContain("3");
  await expect(await total.textContent()).toContain("5");
});
