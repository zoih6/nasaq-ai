import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";

const evidence = path.resolve(process.cwd(), "../../docs/04-delivery/evidence/wave-three");

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}\n${item.nodes.map((node) => node.target.join(" ")).join("\n")}`).join("\n\n")).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(dimensions.html, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
}

test("knowledge sources move through a visible local indexing state and retrieval stays inspectable", async ({ page }) => {
  await page.goto("/ar/app/knowledge");
  await expect(page.getByRole("heading", { level: 1, name: "المعرفة" })).toBeVisible();
  await page.getByRole("button", { name: "إضافة مصدر" }).click();
  const dialog = page.getByRole("dialog", { name: "إضافة مصدر معرفة" });
  await dialog.getByRole("button", { name: "رابط" }).click();
  await dialog.getByRole("textbox", { name: "اسم واضح" }).fill("دليل السوق الجديد");
  await dialog.getByRole("textbox", { name: "الرابط" }).fill("https://example.com/market-guide");
  await dialog.getByRole("button", { name: "إضافة وبدء الفهرسة" }).click();
  await expect(page.getByText("أُضيف المصدر محليًا")).toBeVisible();
  await expect(page.getByText("دليل السوق الجديد")).toBeVisible();
  await expect(page.getByText("جاهز", { exact: true }).last()).toBeVisible({ timeout: 4_000 });

  await page.getByRole("link", { name: /فتح المجموعة/ }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("إطلاق السوق");
  await page.getByRole("button", { name: "اختبار الاسترجاع" }).click();
  await expect(page.getByText("٣ مقاطع مطابقة")).toBeVisible();
  await expect(page.getByText("لا استدعاء لنموذج خارجي")).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "knowledge-retrieval-tested-ar.png"), fullPage: true });
});

test("model selection compares cost, context, availability, and access before delegation", async ({ page }) => {
  await page.goto("/ar/app/models");
  await page.getByRole("checkbox", { name: "إضافة Clarity Pro إلى المقارنة" }).check();
  await page.getByRole("checkbox", { name: "إضافة Sprint Mini إلى المقارنة" }).check();
  await expect(page.getByText("2 نماذج محددة")).toBeVisible();
  await page.getByRole("button", { name: "مقارنة" }).click();
  const dialog = page.getByRole("dialog", { name: "مقارنة النماذج" });
  await expect(dialog).toContainText("Clarity Pro");
  await expect(dialog).toContainText("Sprint Mini");
  await expect(dialog).toContainText("تكلفة الإدخال");
  await expectNoSeriousAccessibilityViolations(page);
  await dialog.getByRole("button", { name: "إغلاق" }).first().click();
  await page.getByRole("link", { name: /تفاصيل النموذج/ }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Clarity Pro");
  await expect(page.getByText("لا انتقال", { exact: false })).toHaveCount(0);
});

test("tool and skill catalogs require visible permission and provenance review", async ({ page }) => {
  await page.goto("/ar/app/tools");
  const externalTool = page.locator(".tool-catalog-card").filter({ hasText: "إرسال ملخص" });
  await externalTool.getByRole("button", { name: "مراجعة وتوصيل" }).click();
  const toolDialog = page.getByRole("dialog", { name: "مراجعة صلاحيات الأداة" });
  await expect(toolDialog).toContainText("دائمًا قبل التنفيذ");
  await expect(toolDialog).toContainText("لن يُنشأ اتصال");
  await toolDialog.getByRole("button", { name: "توصيل تجريبي" }).click();
  await expect(page.getByText("وُصلت الأداة محليًا")).toBeVisible();

  await page.goto("/ar/app/skills");
  const needsReview = page.locator(".skill-catalog-list article").filter({ hasText: "ملاحظات الإصدار" });
  await needsReview.getByRole("button", { name: "مراجعة التفاصيل" }).click();
  const reviewDialog = page.getByRole("dialog", { name: "ملاحظات الإصدار" });
  await expect(reviewDialog.getByRole("button", { name: "تفعيل تجريبي" })).toBeDisabled();
  await expect(reviewDialog).toContainText("لا يمكن تفعيل المهارة قبل مراجعة المصدر");
  await reviewDialog.getByRole("button", { name: "إغلاق" }).first().click();
  const reviewed = page.locator(".skill-catalog-list article").filter({ hasText: "مراجعة المستند" });
  await reviewed.getByRole("button", { name: "مراجعة التفاصيل" }).click();
  await page.getByRole("dialog", { name: "مراجعة المستند" }).getByRole("button", { name: "تفعيل تجريبي" }).click();
  await expect(page.getByText("فُعّلت المهارة محليًا")).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
});

test("usage ledger preserves estimate, reservation, actual cost, payer, and run trace", async ({ page }) => {
  await page.goto("/ar/app/usage");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("الاستخدام والتكلفة");
  await page.locator(".usage-ledger__row").filter({ hasText: "رصد المنافسين الأسبوعي" }).click();
  const dialog = page.getByRole("dialog", { name: "رصد المنافسين الأسبوعي" });
  await expect(dialog).toContainText("تقدير");
  await expect(dialog).toContainText("حجز");
  await expect(dialog).toContainText("فعلي");
  await expect(dialog).toContainText("رصيد المنصة");
  await dialog.getByRole("button", { name: "إغلاق" }).last().click();
  await page.getByRole("link", { name: /إدارة الرصيد والميزانيات/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("الفوترة");
  await page.getByRole("button", { name: "تعبئة تجريبية" }).click();
  const topup = page.getByRole("dialog", { name: "تعبئة رصيد تجريبية" });
  await expect(topup).toContainText("لا تنفذ دفعة حقيقية");
  await topup.getByRole("button", { name: "$50" }).click();
  await topup.getByRole("button", { name: "محاكاة التعبئة" }).click();
  await expect(page.getByText("تمت محاكاة إضافة $50")).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
});

test("team invites and role changes stay explicit and simulated", async ({ page }) => {
  await page.goto("/ar/app/team");
  await page.getByRole("button", { name: "دعوة عضو" }).click();
  const dialog = page.getByRole("dialog", { name: /دعوة عضو إلى فريق أفق/ });
  await dialog.getByRole("textbox", { name: "البريد الإلكتروني" }).fill("new.member@example.com");
  await dialog.getByRole("combobox", { name: "الدور الأولي" }).selectOption("reviewer");
  await expect(dialog).toContainText("مراجعة المخرجات واتخاذ قرارات الموافقة");
  await dialog.getByRole("button", { name: "إنشاء دعوة تجريبية" }).click();
  await expect(page.getByText("new.member@example.com")).toBeVisible();
  await expect(page.getByText("أُنشئت دعوة محلية")).toBeVisible();
  await page.getByRole("combobox", { name: /دور مايا ناصر/ }).selectOption("reviewer");
  await expect(page.getByText("تغير الدور محليًا")).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "team-invite-ar.png"), fullPage: true });
});

test("settings make BYOK safety and workspace authority explicit", async ({ page }) => {
  await page.goto("/ar/app/settings");
  await page.getByRole("button", { name: /مفاتيح المزودين/ }).click();
  await expect(page.getByRole("heading", { name: "مفاتيح المزودين — BYOK" })).toBeVisible();
  await page.getByRole("button", { name: "إضافة مفتاح" }).click();
  const dialog = page.getByRole("dialog", { name: "إضافة مفتاح مزود" });
  await expect(dialog).toContainText("لا تدخل مفتاحًا حقيقيًا");
  await dialog.getByRole("combobox", { name: "المزود" }).selectOption({ label: "Vertex Lane" });
  await dialog.getByLabel("مفتاح API").fill("demo-value-not-a-real-key");
  await dialog.getByRole("button", { name: "اختبار وإضافة تجريبيًا" }).click();
  await expect(page.getByText("أضيفت بيانات اعتماد تجريبية")).toBeVisible();
  await expect(page.getByText("Vertex Lane API")).toBeVisible();
  await page.getByRole("button", { name: /مساحة العمل/ }).last().click();
  await expect(page.getByText("عدم التحول التلقائي بين الدافعين")).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
});

test("all new administration surfaces render in both directions and mobile pages do not overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const locale of ["ar", "en"] as const) {
    for (const route of ["knowledge", "models", "tools", "skills", "usage", "team", "settings", "billing", "models/routing"]) {
      const response = await page.goto(`/${locale}/app/${route}`);
      expect(response?.ok(), `${locale}/${route}`).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  }
  expect(errors).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["knowledge", "models", "tools", "skills", "usage", "team", "settings", "billing"]) {
    await page.goto(`/ar/app/${route}`);
    await expectNoHorizontalOverflow(page);
  }
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "admin-mobile-ar.png"), fullPage: true });
});
