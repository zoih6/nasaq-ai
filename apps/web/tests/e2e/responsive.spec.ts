import { expect, test, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const viewports = [
  { name: "small phone", width: 320, height: 568 },
  { name: "phone", width: 360, height: 800 },
  { name: "modern phone", width: 390, height: 844 },
  { name: "large phone", width: 412, height: 915 },
  { name: "portrait tablet", width: 768, height: 1024 },
  { name: "large tablet", width: 820, height: 1180 },
  { name: "landscape tablet", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 720 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide desktop", width: 1920, height: 1080 },
] as const;

async function expectNoOverflow(page: Page, label: string) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.html, `${label}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body, `${label}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport);
}

async function expectInsideViewport(locator: Locator, label: string) {
  const box = await locator.boundingBox();
  expect(box, `${label} should have a box`).not.toBeNull();
  const viewport = locator.page().viewportSize();
  expect(viewport).not.toBeNull();
  expect(box!.x, `${label} starts outside the viewport`).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width, `${label} ends outside the viewport`).toBeLessThanOrEqual(viewport!.width + 1);
}

async function expectMinimumTouchTargets(locator: Locator, label: string) {
  const count = await locator.count();
  expect(count, `${label} should find at least one target`).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const target = locator.nth(index);
    if (!(await target.isVisible())) continue;
    const box = await target.boundingBox();
    expect(box, `${label} target ${index}`).not.toBeNull();
    expect(box!.width, `${label} target ${index}: ${JSON.stringify(box)}`).toBeGreaterThanOrEqual(44);
    expect(box!.height, `${label} target ${index}: ${JSON.stringify(box)}`).toBeGreaterThanOrEqual(44);
  }
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
  // axe-core's injected runner is unstable in Playwright WebKit; Chromium and Firefox
  // provide the WCAG gate while WebKit remains an interaction, layout, and overflow gate.
  if (page.context().browser()?.browserType().name() === "webkit") return;
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}\n${item.nodes.map((node) => node.target.join(" ")).join("\n")}`).join("\n\n")).toEqual([]);
}

for (const viewport of viewports) {
  test(`marketing and adaptive home reflow at ${viewport.name} (${viewport.width}×${viewport.height})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/ar", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoOverflow(page, `${viewport.name} marketing`);
    await expectInsideViewport(page.locator(".universal-nav"), `${viewport.name} navigation`);
    await expectInsideViewport(page.locator(".universal-demo-card"), `${viewport.name} demo`);

    await page.goto("/ar/app/home", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoOverflow(page, `${viewport.name} home`);
    await expectInsideViewport(page.locator(".adaptive-home__hero"), `${viewport.name} home hero`);
    await expectInsideViewport(page.locator(".adaptive-task-card"), `${viewport.name} composer`);
  });
}

test("layout reflows at the 200% zoom equivalent of a 1280px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto("/ar");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoOverflow(page, "200% zoom marketing");
  await expectInsideViewport(page.locator(".universal-demo-card"), "200% zoom demo");

  await page.goto("/ar/app/research");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoOverflow(page, "200% zoom service");
  // Research now renders its own domain workspace; its brief surface is the
  // composer this gate protects (the legacy .service-prompt-area only exists
  // on the prototype services).
  await expectInsideViewport(page.getByTestId("u2-research-brief"), "200% zoom brief");
});

test("shell switches between full sidebar, compact rail, and mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ar/app/home");
  const shell = page.locator(".universal-app-shell");
  const sidebar = page.locator(".universal-shell-sidebar");
  const main = page.locator(".universal-shell-main");
  const mobileNav = page.getByRole("navigation", { name: "التنقل على الهاتف" });
  await expect(sidebar).toBeVisible();
  expect((await sidebar.boundingBox())!.width).toBeGreaterThan(200);
  await expect(page.locator(".universal-shell-link b").first()).toHaveCSS("opacity", "1");
  await expect(mobileNav).toBeHidden();

  await page.getByRole("button", { name: "طي القائمة" }).click();
  await expect(sidebar).toHaveCSS("width", "76px");
  await expect(page.locator(".universal-shell-link b").first()).toHaveCSS("display", "none");
  await page.getByRole("button", { name: "توسيع القائمة" }).click();
  await expect(sidebar).toHaveCSS("width", "248px");

  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(sidebar).toHaveCSS("width", "76px");
  expect((await sidebar.boundingBox())!.width).toBeLessThanOrEqual(80);
  expect(parseFloat(await main.evaluate((element) => getComputedStyle(element).marginInlineStart))).toBeLessThanOrEqual(80);
  await expect(page.locator(".universal-shell-link b").first()).toHaveCSS("display", "none");
  await expect(mobileNav).toBeHidden();

  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(mobileNav).toBeVisible();
  await expect(sidebar).toBeHidden();
  await page.getByRole("button", { name: "فتح القائمة" }).click();
  await expect(shell).toHaveAttribute("data-mobile-open", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(sidebar).toBeVisible();
  await expect(sidebar).toBeInViewport();

  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(shell).toHaveAttribute("data-mobile-open", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("primary phone interactions meet the 44px touch target", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/ar");
  await expectMinimumTouchTargets(page.locator(".luma-brand,.luma-locale,.universal-menu-button"), "marketing navigation");

  await page.goto("/ar/app/home");
  const targets = page.locator([
    ".adaptive-personalize",
    ".adaptive-goals-bar button",
    ".adaptive-task-modes button",
    ".adaptive-task-composer__actions button",
    ".universal-shell-mobile-nav a",
  ].join(","));
  await expectMinimumTouchTargets(targets, "adaptive home");

  await page.locator(".universal-shell-search").click();
  await expectMinimumTouchTargets(page.locator(".universal-command__input button"), "command palette");
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "فتح القائمة" }).click();
  await page.getByRole("button", { name: "أدوات متقدمة" }).click();
  await expectMinimumTouchTargets(page.locator(".universal-shell-advanced-list a,.universal-shell-close"), "mobile drawer");
  await page.locator(".universal-shell-close").click();
  await expect(page.locator(".universal-shell-sidebar")).toBeHidden();
  await expectNoSeriousAccessibilityViolations(page);
});

test("phone dialogs become contained bottom sheets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/app/home");

  await page.getByRole("button", { name: "خصّص تجربتي" }).click();
  const goalsDialog = page.getByRole("dialog", { name: "ما الذي تريد أن يساعدك فيه نَسَق؟" });
  const goalsBox = await goalsDialog.boundingBox();
  expect(goalsBox).not.toBeNull();
  expect(goalsBox!.x).toBeCloseTo(0, 0);
  expect(goalsBox!.width).toBeCloseTo(390, 0);
  expect(goalsBox!.y + goalsBox!.height).toBeCloseTo(844, 0);

  // A shortened visual viewport approximates the on-screen keyboard opening.
  await page.setViewportSize({ width: 390, height: 568 });
  const compactGoalsBox = await goalsDialog.boundingBox();
  expect(compactGoalsBox).not.toBeNull();
  expect(compactGoalsBox!.y).toBeGreaterThanOrEqual(0);
  expect(compactGoalsBox!.y + compactGoalsBox!.height).toBeLessThanOrEqual(568);
  await page.keyboard.press("Escape");

  await page.locator(".universal-shell-search").click();
  const commandDialog = page.getByRole("dialog", { name: /ابحث في نَسَق/ });
  const commandBox = await commandDialog.boundingBox();
  expect(commandBox).not.toBeNull();
  expect(commandBox!.x).toBeCloseTo(0, 0);
  expect(commandBox!.width).toBeCloseTo(390, 0);
  expect(commandBox!.y + commandBox!.height).toBeCloseTo(568, 0);
  await expectNoSeriousAccessibilityViolations(page);
});

test("English, Arabic, and reduced motion preserve their contracts", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 820, height: 1180 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/en/app/home");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hello, what would you like to accomplish?");
  const transitionDuration = await page.locator(".adaptive-service-tile").first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(transitionDuration).toMatch(/1e-05s|0\.00001s|0\.01ms/);
  await expectNoOverflow(page, "English reduced-motion tablet");

  await page.goto("/ar/app/research");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ابحث ووثّق");
  await expectNoOverflow(page, "Arabic reduced-motion tablet");
  await context.close();
});
