import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";

const evidence = path.resolve(process.cwd(), "../../docs/04-delivery/evidence");

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
}

test("Arabic marketing surface communicates the product and passes the accessibility gate", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("من سؤال واحد");
  await expect(page.getByRole("link", { name: /ابدأ مساحة العمل/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "استكشف التجربة" })).toHaveAttribute("href", "/ar/preview");
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "wave-1-marketing-ar.png"), fullPage: true });
});

test("English locale preserves the route and flips direction", async ({ page }) => {
  await page.goto("/en/app/home");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Good morning");
  await expect(page.getByRole("link", { name: "Switch to Arabic" })).toHaveAttribute("href", "/ar/app/home");
});

test("Command center exposes active work, approval, and cost without dead navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ar/app/home");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("صباح العمل المنظّم");
  await expect(page.getByText("تحليل إشارات السوق والمنافسين")).toBeVisible();
  await expect(page.getByText("إرسال ملخص الرصد إلى فريق المشروع")).toBeVisible();
  const commandTrigger = page.getByRole("button", { name: "ابحث أو نفّذ أمرًا" });
  await commandTrigger.click();
  const commandInput = page.getByRole("dialog").getByRole("textbox", { name: "ابحث أو نفّذ أمرًا" });
  await expect(commandInput).toBeFocused();
  await commandInput.fill("المشاريع");
  await expect(page.getByRole("dialog").getByRole("link", { name: /المشاريع/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(commandTrigger).toBeFocused();
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "wave-1-command-center-ar.png"), fullPage: true });
});

test("Chat starter produces a deterministic streamed demo response", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 820 });
  await page.goto("/ar/app/chat");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ما الذي تريد إنجازه؟");
  await page.getByRole("button", { name: /حلّل سوقًا/ }).click();
  await expect(page.getByRole("textbox")).toHaveValue(/السوق السعودي/);
  await page.getByRole("button", { name: "إرسال" }).click();
  await expect(page.getByText("تشير المعطيات الأولية", { exact: false })).toBeVisible();
  await expect(page.getByText("مكتمل", { exact: true })).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText("$0.18", { exact: true })).toBeVisible();
  await page.screenshot({ path: path.join(evidence, "wave-1-chat-ar.png"), fullPage: true });
});

test("Mobile layouts avoid horizontal overflow and expose the complete navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: path.join(evidence, "wave-1-marketing-mobile-ar.png"), fullPage: true });

  await page.goto("/ar/app/home");
  await expect(page.getByRole("navigation", { name: "التنقل على الهاتف" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "wave-1-command-center-mobile-ar.png"), fullPage: true });

  await page.getByRole("navigation", { name: "التنقل على الهاتف" }).getByRole("button", { name: "المزيد" }).click();
  await expect(page.locator(".app-root")).toHaveAttribute("data-mobile-open", "true");
  await expect(page.getByRole("complementary", { name: "التنقل الرئيسي" })).toBeInViewport();
  await page.getByRole("button", { name: "إغلاق التنقل" }).click();
  await expect(page.locator(".app-root")).toHaveAttribute("data-mobile-open", "false");
});

test("Every public and app route renders in both directions without page errors", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const appRoutes = ["home", "chat", "projects", "agents", "flows", "knowledge", "models", "runs", "usage", "team", "settings"];

  for (const locale of ["ar", "en"] as const) {
    const marketingResponse = await page.goto(`/${locale}`);
    expect(marketingResponse?.ok()).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    for (const route of appRoutes) {
      const response = await page.goto(`/${locale}/app/${route}`);
      expect(response?.ok(), `${locale}/${route} should return 2xx`).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  }

  expect(pageErrors).toEqual([]);
});
