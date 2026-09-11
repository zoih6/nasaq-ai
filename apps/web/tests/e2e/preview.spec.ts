import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";

const evidence = path.resolve(process.cwd(), "../../docs/04-delivery/evidence");

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
}

async function captureEvidence(page: Page, filename: string) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const skipLink = document.querySelector<HTMLElement>(".skip-link");
    if (skipLink) skipLink.style.visibility = "hidden";
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: path.join(evidence, filename), fullPage: true });
  await page.evaluate(() => document.querySelector<HTMLElement>(".skip-link")?.style.removeProperty("visibility"));
}

test("professional Arabic preview moves from chat to a controlled approval receipt", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/ar/preview");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("شاهد طريقة العمل");
  await expect(page.getByText("لا اتصال خارجي", { exact: true }).first()).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  await captureEvidence(page, "professional-preview-chat-ar.png");

  await page.getByRole("button", { name: "مراجعة مستند" }).click();
  await expect(page.getByText("مراجعة اتفاقية الشراكة", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: /حوّل المهمة إلى وكيل/ }).click();
  await expect(page.getByRole("heading", { name: "وكيل باحث مضبوط قبل التشغيل" })).toBeVisible();
  await page.getByRole("button", { name: /اعتمد الخطة وحوّلها إلى تدفق/ }).click();
  await expect(page.getByRole("heading", { name: "تدفق قابل للتكرار والمراقبة" })).toBeVisible();

  await page.getByRole("button", { name: "شغّل المعاينة" }).click();
  await expect(page.locator(".preview-approval-inline")).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText("$0.96", { exact: true })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  await captureEvidence(page, "professional-preview-flow-approval-ar.png");

  await page.getByRole("button", { name: "أبقِ الإجراء متوقفًا" }).click();
  await expect(page.getByText("متوقف بأمان", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "إعادة المعاينة" }).first().click();
  await expect(page.getByRole("button", { name: "شغّل المعاينة" })).toBeVisible();
  await page.getByRole("button", { name: "شغّل المعاينة" }).click();
  await expect(page.locator(".preview-approval-inline")).toBeVisible({ timeout: 8_000 });
  await page.getByRole("button", { name: "موافقة تجريبية" }).click();
  await expect(page.getByText("اكتمل بأمان", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("$1.12", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("preview stage tabs support arrow-key navigation and preserve locale routes", async ({ page }) => {
  await page.goto("/en/preview");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  const chatTab = page.getByRole("tab", { name: /Chat/ });
  const agentTab = page.getByRole("tab", { name: /Agent/ });
  await chatTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(agentTab).toBeFocused();
  await expect(agentTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("link", { name: "Switch to Arabic" })).toHaveAttribute("href", "/ar/preview");
  await expectNoSeriousAccessibilityViolations(page);
});

test("professional preview remains readable and contained on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/preview");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole("tab", { name: /المحادثة/ })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  await captureEvidence(page, "professional-preview-mobile-ar.png");
});
