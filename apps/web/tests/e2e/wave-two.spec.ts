import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";

const evidence = path.resolve(process.cwd(), "../../docs/04-delivery/evidence/wave-two");

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}\n${item.nodes.map((node) => node.target.join(" ")).join("\n")}`).join("\n\n")).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))).toEqual(expect.objectContaining({ document: await page.evaluate(() => window.innerWidth), body: expect.any(Number) }));
  expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBe(true);
}

test("project library supports search, filters, and a local create flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto("/ar/app/projects");
  await expect(page.getByRole("heading", { level: 1, name: "المشاريع" })).toBeVisible();
  const search = page.getByRole("textbox", { name: "ابحث في هذه المكتبة" });
  await search.fill("صوت العميل");
  await expect(page.getByRole("heading", { name: "صوت العميل" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "إطلاق الخدمة في السوق السعودي" })).toBeHidden();
  await search.clear();

  await page.getByRole("button", { name: "مشروع جديد" }).click();
  const dialog = page.getByRole("dialog", { name: "إنشاء مشروع" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox", { name: "اسم المشروع" }).fill("إطلاق الإمارات");
  await dialog.getByRole("textbox", { name: "النتيجة المطلوبة" }).fill("اختبار السوق قبل قرار الاستثمار");
  await dialog.getByLabel("مشروع فارغ", { exact: false }).check();
  await dialog.getByRole("button", { name: "إنشاء المشروع" }).click();
  await expect(page.getByRole("heading", { name: "إطلاق الإمارات" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("أُنشئ المشروع محليًا");
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "projects-created-ar.png"), fullPage: true });
});

test("project context links into the agent builder and its deterministic test bench", async ({ page }) => {
  await page.goto("/ar/app/projects/prj_saudi_launch");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("إطلاق الخدمة في السوق السعودي");
  await expect(page.getByText("تعريف واضح للنجاح قبل التفويض")).toBeVisible();
  await page.getByRole("link", { name: /باحث السوق/ }).click();
  await expect(page).toHaveURL(/\/ar\/app\/agents\/agt_market_researcher\/edit$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("باحث السوق");

  await page.getByRole("button", { name: /الأدوات/ }).click();
  const externalTool = page.getByRole("checkbox", { name: /إرسال ملخص للفريق/ });
  await expect(externalTool).not.toBeChecked();
  await externalTool.check();
  await expect(page.getByText("تغييرات غير محفوظة")).toBeVisible();

  await page.getByRole("button", { name: /الاختبار/ }).click();
  await page.getByRole("button", { name: "تشغيل آمن" }).click();
  await expect(page.getByText("اكتمل الاختبار دون آثار خارجية")).toBeVisible();
  await expect(page.getByText(/أعددت ملخصًا موثقًا/)).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "agent-builder-tested-ar.png"), fullPage: true });
});

test("flow editor exposes the approval node and safe test path into the run", async ({ page }) => {
  await page.goto("/ar/app/flows/flw_weekly_watch/edit");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("رصد المنافسين الأسبوعي");
  const approvalNode = page.locator(".flow-node--approval");
  await approvalNode.click();
  await expect(page.getByRole("heading", { name: "إعدادات العقدة" })).toBeVisible();
  await expect(page.getByText("سيتوقف التدفق هنا")).toBeVisible();

  await page.getByRole("button", { name: "اختبار التدفق" }).click();
  await expect(page.getByText("توقف بأمان عند بوابة الموافقة")).toBeVisible();
  const openRun = page.getByRole("link", { name: /فتح التشغيل/ });
  await expect(openRun).toBeVisible();
  await openRun.click();
  await expect(page).toHaveURL(/\/ar\/app\/runs\/run_weekly_watch$/);
  await expect(page.getByText("توقف آمن قبل الأثر الخارجي", { exact: true })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "flow-to-run-ar.png"), fullPage: true });
});

test("authorized approval completes only the scoped step and creates a downloadable receipt", async ({ page }) => {
  await page.goto("/ar/app/runs/run_weekly_watch");
  await page.getByRole("button", { name: "مراجعة والموافقة" }).click();
  const dialog = page.getByRole("dialog", { name: "تأكيد الموافقة" });
  await expect(dialog).toContainText("محاكاة Frontend فقط");
  await dialog.getByRole("textbox", { name: "سبب القرار" }).fill("راجعت المستلمين والمحتوى وسقف التكلفة");
  await dialog.getByRole("button", { name: "موافقة وتنفيذ" }).click();
  await expect(page.getByText("اكتمل التشغيل ضمن الموافقة")).toBeVisible();
  await expect(page.getByRole("heading", { name: "موافقة وتنفيذ موثقان" })).toBeVisible();
  await expect(page.getByText("راجعت المستلمين والمحتوى وسقف التكلفة")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "تنزيل JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("rcpt_run_weekly_watch.json");
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "approval-receipt-ar.png"), fullPage: true });
});

test("English route is LTR and a rejection records that no external effect occurred", async ({ page }) => {
  await page.goto("/en/app/runs/run_weekly_watch");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Weekly competitor watch");
  await page.getByRole("button", { name: "Reject" }).click();
  const dialog = page.getByRole("dialog", { name: "Confirm rejection" });
  await dialog.getByRole("textbox", { name: "Decision reason" }).fill("Recipient list needs an owner review");
  await dialog.getByRole("button", { name: "Reject and cancel" }).click();
  await expect(page.getByText("Request rejected and run cancelled")).toBeVisible();
  await expect(page.getByText("No external effect")).toBeVisible();
});

test("mobile operational surfaces avoid document-level overflow and remain accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/ar/app/projects",
    "/ar/app/agents/agt_market_researcher/edit",
    "/ar/app/flows/flw_weekly_watch/edit",
    "/ar/app/runs/run_weekly_watch",
  ]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
  await expectNoSeriousAccessibilityViolations(page);
  await page.screenshot({ path: path.join(evidence, "operations-mobile-ar.png"), fullPage: true });
});
