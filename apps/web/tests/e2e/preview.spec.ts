import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(dimensions.html, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
}

test("legacy preview links preserve locale and enter the adaptive home", async ({ page }) => {
  await page.goto("/ar/preview");
  await expect(page).toHaveURL(/\/ar\/app\/home$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("مرحبًا، ماذا تريد أن تنجز؟");

  await page.goto("/en/preview");
  await expect(page).toHaveURL(/\/en\/app\/home$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hello, what would you like to accomplish?");
});

test("global command palette opens from the keyboard and searches the new information architecture", async ({ page }) => {
  await page.goto("/ar/app/home");
  await page.locator(".universal-shell-search").click();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog", { name: /ابحث في نَسَق/ });
  await expect(dialog).toBeVisible();
  const search = dialog.getByRole("textbox", { name: "انتقل إلى خدمة، عمل، أو إعداد" });
  await expect(search).toBeFocused();
  await search.fill("تعلّم");
  const result = dialog.getByRole("link", { name: /تعلّم/ }).first();
  await expect(result).toHaveAttribute("href", "/ar/app/learn");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expectNoSeriousAccessibilityViolations(page);
});

test("every universal route renders in both directions without browser errors or horizontal overflow", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const routes = ["home", "chat", "learn", "research", "create", "code", "analyze", "explore", "library"];

  for (const locale of ["ar", "en"] as const) {
    for (const route of routes) {
      const response = await page.goto(`/${locale}/app/${route}`);
      expect(response?.ok(), `${locale}/${route} should return 2xx`).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
      await expectNoHorizontalOverflow(page);
    }
  }
  expect(pageErrors).toEqual([]);
});
