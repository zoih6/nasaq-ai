import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";

const evidence = path.resolve(process.cwd(), "../../docs/04-delivery/evidence");

async function expectNoSeriousAccessibilityViolations(page: Page) {
  // axe-core's injected runner is unstable in Playwright WebKit; Chromium and Firefox
  // provide the WCAG gate while WebKit remains an interaction, layout, and overflow gate.
  if (page.context().browser()?.browserType().name() === "webkit") return;
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}\n${item.nodes.map((node) => node.target.join(" ")).join("\n")}`).join("\n\n")).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(dimensions.html, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
}

test("Arabic landing presents the universal promise instead of an operations product", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("كل ما تريد أن");
  await expect(page.getByText("منصة ذكاء اصطناعي تتشكل حولك", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "ابدأ بطريقتك" }).first()).toHaveAttribute("href", "/ar/app/home");
  await expect(page.getByRole("link", { name: /شاهد التجربة/ })).toHaveAttribute("href", "#interactive-demo");
  await expect(page.getByText("لا تحتاج أن تكون خبيرًا لتستفيد من الذكاء الاصطناعي.", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoSeriousAccessibilityViolations(page);
  if (browserName === "chromium") await page.screenshot({ path: path.join(evidence, "universal-landing-ar.png"), fullPage: true });
});

test("adaptive home changes goals, explains personalization, and persists choices locally", async ({ page, browserName }) => {
  await page.addInitScript(() => window.localStorage.removeItem("nasaq.universal.goals"));
  await page.goto("/ar/app/home");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("مرحبًا، ماذا تريد أن تنجز؟");
  await expect(page.getByText("لأنك اخترت التعلّم والبحث والاستكشاف.", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "خصّص تجربتي" }).click();
  const dialog = page.getByRole("dialog", { name: "ما الذي تريد أن يساعدك فيه نَسَق؟" });
  await expect(dialog).toContainText("اختر أهدافًا لا مهنة");
  await expect(dialog.getByRole("button", { name: /تعلّم بعمق/ })).toHaveAttribute("aria-pressed", "true");
  await dialog.getByRole("button", { name: /اكتب وصمّم/ }).click();
  await dialog.getByRole("button", { name: /استكشف واكتشف/ }).click();
  await dialog.getByRole("button", { name: "احفظ تجربتي" }).click();

  await expect(page.locator(".adaptive-goals-bar")).toContainText("أنشئ");
  await expect(page.locator(".adaptive-goals-bar")).not.toContainText("استكشف");
  const stored = await page.evaluate(() => window.localStorage.getItem("nasaq.universal.goals"));
  expect(stored).toContain("create");
  expect(stored).not.toContain("explore");
  await expectNoSeriousAccessibilityViolations(page);
  if (browserName === "chromium") await page.screenshot({ path: path.join(evidence, "universal-home-personalized-ar.png"), fullPage: true });
});

test("central composer adapts its direction and opens the appropriate service", async ({ page }) => {
  await page.goto("/ar/app/home");
  await page.getByRole("tab", { name: "تعلّم" }).click();
  const composer = page.locator(".adaptive-task-composer textarea");
  await expect(composer).toHaveAttribute("placeholder", /ما الموضوع الذي تريد أن تفهمه/);
  await composer.fill("أريد فهم أساسيات الاحتمالات بمثال بسيط");
  await page.getByRole("button", { name: "ابدأ" }).click();
  const ready = page.locator(".adaptive-ready");
  await expect(ready).toContainText("مسار تعلّم شخصي", { timeout: 8_000 });
  await expect(ready.getByRole("link", { name: /افتح المساحة/ })).toHaveAttribute("href", "/ar/app/learn");
});

test("a service uses guided or fast modes and produces an explicitly simulated outcome", async ({ page }) => {
  await page.goto("/ar/app/research");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ابحث ووثّق");
  await expect(page.getByText("لا خدمة خارجية تعمل في هذا النموذج.", { exact: false })).toBeVisible();
  await page.getByRole("tab", { name: /سريع/ }).click();
  await expect(page.getByRole("tab", { name: /سريع/ })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: /ابحث في الدراسات الحديثة/ }).click();
  await expect(page.locator(".service-prompt-area textarea")).toHaveValue("ابحث في الدراسات الحديثة");
  await page.getByRole("button", { name: "ابدأ الآن" }).click();
  await expect(page.getByText("المساحة جاهزة", { exact: true })).toBeVisible({ timeout: 8_000 });
  await expect(page.getByRole("heading", { name: "خطة بحث قابلة للتوجيه" })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
});

test("library supports search, filters, and a visual list mode", async ({ page }) => {
  await page.goto("/ar/app/library");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("مكتبتي");
  const search = page.getByRole("textbox", { name: "ابحث في العناوين والمحتوى…" });
  await search.fill("الطاقة");
  await expect(page.getByRole("heading", { name: "مستقبل الطاقة المتجددة" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "أساسيات علم البيانات" })).toBeHidden();
  await search.clear();
  await page.getByRole("button", { name: "برمجة", exact: true }).click();
  await expect(page.getByRole("heading", { name: "تطبيق نادي القراءة" })).toBeVisible();
  await expect(page.locator(".universal-library-item")).toHaveCount(1);
  await page.getByRole("button", { name: "List" }).click();
  await expect(page.locator(".universal-library-grid")).toHaveClass(/is-list/);
  await expectNoSeriousAccessibilityViolations(page);
});

test("English experience is complete LTR content, not an Arabic shell", async ({ page }) => {
  await page.goto("/en/app/home");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hello, what would you like to accomplish?");
  await expect(page.getByRole("link", { name: /Learn deeply/ })).toHaveAttribute("href", "/en/app/learn");
  await page.getByRole("link", { name: "Switch to Arabic" }).click();
  await expect(page).toHaveURL(/\/ar\/app\/home$/);
});

test("mobile landing and home remain contained and expose the adaptive navigation", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoSeriousAccessibilityViolations(page);
  if (browserName === "chromium") await page.screenshot({ path: path.join(evidence, "universal-landing-mobile-ar.png"), fullPage: true });

  await page.goto("/ar/app/home");
  const mobileNav = page.getByRole("navigation", { name: "التنقل على الهاتف" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "لك" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "أنشئ" })).toHaveAttribute("href", "/ar/app/create");
  await expectNoHorizontalOverflow(page);
  await expectNoSeriousAccessibilityViolations(page);

  await page.getByRole("button", { name: "فتح القائمة" }).click();
  await expect(page.getByRole("complementary", { name: "التنقل الرئيسي" })).toBeInViewport();
  await page.locator(".universal-shell-close").click();
  await expectNoHorizontalOverflow(page);
});
