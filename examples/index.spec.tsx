import { test, expect } from "@playwright/test";

test("basic", async ({ page }) => {
  await page.goto("/");

  const button = page.locator("button");
  const display = page.locator("h1");

  await button.click();

  await expect(await display.textContent()).toBe("1");

  await button.click();

  await expect(await display.textContent()).toBe("2");
});
