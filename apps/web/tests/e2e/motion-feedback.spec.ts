import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoSeriousAccessibilityViolations(page: Page) {
  if (page.context().browser()?.browserType().name() === "webkit") return;
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}\n${item.nodes.map((node) => node.target.join(" ")).join("\n")}`).join("\n\n")).toEqual([]);
}

function monitorRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

test("motion tokens are central and public ambient motion is finite", async ({ page }) => {
  const errors = monitorRuntimeErrors(page);
  await page.goto("/en");

  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    function milliseconds(name: string) {
      const value = style.getPropertyValue(name).trim();
      return value.endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1_000;
    }
    return {
      instant: milliseconds("--u-motion-duration-instant"),
      fast: milliseconds("--u-motion-duration-fast"),
      moderate: milliseconds("--u-motion-duration-moderate"),
      slow: milliseconds("--u-motion-duration-slow"),
      expressive: milliseconds("--u-motion-duration-expressive"),
      enter: style.getPropertyValue("--u-motion-ease-enter").trim(),
      exit: style.getPropertyValue("--u-motion-ease-exit").trim(),
      distance: style.getPropertyValue("--u-motion-distance-lg").trim(),
    };
  });
  expect(tokens).toEqual({
    instant: 80,
    fast: 120,
    moderate: 180,
    slow: 260,
    expressive: 420,
    enter: "cubic-bezier(0,0,.38,.9)",
    exit: "cubic-bezier(.2,0,1,.9)",
    distance: "16px",
  });

  await page.waitForTimeout(1_900);
  const ambient = await page.evaluate(() => {
    const root = document.querySelector(".universal-site");
    const infinite = root?.getAnimations({ subtree: true }).filter((animation) => animation.effect?.getComputedTiming().iterations === Infinity).length ?? -1;
    const cards = [...document.querySelectorAll<HTMLElement>(".universal-float-card")].map((element) => getComputedStyle(element).animationIterationCount);
    const liveDot = getComputedStyle(document.querySelector<HTMLElement>(".universal-live-dot")!).animationIterationCount;
    return { infinite, cards, liveDot };
  });
  expect(ambient.infinite).toBe(0);
  expect(ambient.cards).toEqual(["1", "1", "1"]);
  expect(ambient.liveDot).toBe("2");

  await page.setViewportSize({ width: 390, height: 844 });
  const menuRegion = page.locator(".universal-mobile-menu-region");
  await expect(menuRegion).toHaveAttribute("data-state", "closed");
  await expect(menuRegion.locator("a").first()).toHaveAttribute("tabindex", "-1");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(menuRegion).toHaveAttribute("data-state", "open");
  await expect(menuRegion.getByRole("link").first()).toHaveAttribute("tabindex", "0");
  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(menuRegion).toHaveAttribute("data-state", "closed");
  expect(errors).toEqual([]);
});

test("marketing demo acknowledges work immediately and announces completion", async ({ page }) => {
  const errors = monitorRuntimeErrors(page);
  await page.goto("/en");
  const send = page.locator(".universal-send");
  await send.click();

  const working = page.locator('.universal-demo-result[data-feedback-state="working"]');
  await expect(working).toBeVisible();
  await expect(working).toHaveAttribute("role", "status");
  await expect(working).toHaveAttribute("aria-busy", "true");
  await expect(working).toContainText("Interactive simulation");
  await expect(send).toBeDisabled();

  const ready = page.locator('.universal-demo-result[data-feedback-state="success"]');
  await expect(ready).toContainText("Intent understood", { timeout: 8_000 });
  await expect(ready.getByRole("link", { name: /Open the space/ })).toHaveAttribute("href", "/en/app/learn");
  await expect(send).toBeEnabled();
  await expectNoSeriousAccessibilityViolations(page);
  expect(errors).toEqual([]);
});

test("adaptive composer exposes validation, busy, success, and persistent completion feedback", async ({ page }) => {
  const errors = monitorRuntimeErrors(page);
  await page.addInitScript(() => window.localStorage.removeItem("nasaq.universal.goals"));
  await page.goto("/ar/app/home");

  const textarea = page.locator(".adaptive-task-composer textarea");
  await page.locator(".adaptive-task-submit").click();
  const validation = page.locator("#adaptive-task-error");
  await expect(validation).toBeVisible();
  await expect(validation).toHaveAttribute("role", "alert");
  await expect(validation).toContainText("اكتب ما تريد إنجازه أولًا");
  await expect(textarea).toBeFocused();
  await expect(textarea).toHaveAttribute("aria-invalid", "true");

  await textarea.fill("أريد خطة قصيرة لفهم أساسيات الاحتمالات");
  await expect(validation).toBeHidden();
  await page.locator(".adaptive-task-submit").click();
  const working = page.locator('.adaptive-thinking[data-feedback-state="working"]');
  await expect(working).toHaveAttribute("aria-busy", "true");
  await expect(page.locator(".adaptive-task-submit")).toBeDisabled();

  await textarea.fill("أريد خطة محدّثة لفهم أساسيات الاحتمالات");
  await expect(working).toBeHidden();
  await page.waitForTimeout(900);
  const ready = page.locator('.adaptive-ready[data-feedback-state="success"]');
  await expect(ready).toBeHidden();
  await page.locator(".adaptive-task-submit").click();
  await expect(ready).toContainText("تم فهم مقصدك", { timeout: 8_000 });
  await expect(ready.getByRole("link", { name: /افتح المساحة/ })).toHaveAttribute("href", "/ar/app/chat");

  await page.getByRole("button", { name: "خصّص تجربتي" }).click();
  await page.getByRole("dialog").getByRole("button", { name: /اكتب وصمّم/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "احفظ تجربتي" }).click();
  const toast = page.locator(".u-feedback-toast");
  await expect(toast).toContainText("تم تحديث أهدافك محليًا");
  await page.waitForTimeout(900);
  await expect(toast).toBeVisible();
  await toast.getByRole("button", { name: "إغلاق رسالة التأكيد" }).click();
  await expect(toast).toBeHidden();
  await expectNoSeriousAccessibilityViolations(page);
  expect(errors).toEqual([]);
});

test("service workspace recovers from validation and completes its simulated path", async ({ page }) => {
  const errors = monitorRuntimeErrors(page);
  await page.goto("/en/app/research");
  const textarea = page.locator(".service-prompt-area textarea");

  await page.locator(".service-start-button").click();
  const validation = page.locator("#service-request-error");
  await expect(validation).toContainText("Add your intent before starting");
  await expect(textarea).toBeFocused();
  await expect(textarea).toHaveAttribute("aria-invalid", "true");

  await page.getByRole("button", { name: "Find the latest studies" }).click();
  await expect(validation).toBeHidden();
  await page.locator(".service-start-button").click();
  await expect(page.locator('.service-working[data-feedback-state="working"]')).toHaveAttribute("aria-busy", "true");
  await expect(page.locator(".service-start-button")).toBeDisabled();
  await expect(page.locator('.service-output[data-feedback-state="success"]')).toContainText("Your space is ready", { timeout: 8_000 });
  await expect(page.locator(".service-path-card li.is-complete")).toHaveCount(4);
  await expect(page.getByText("No external service runs in this prototype.", { exact: false })).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
  expect(errors).toEqual([]);
});

test("Library empty state reports results and offers one-step recovery", async ({ page }) => {
  const errors = monitorRuntimeErrors(page);
  await page.goto("/en/app/library");
  const search = page.getByRole("textbox", { name: "Search titles and content…" });
  await search.fill("nothing can match this phrase");

  const empty = page.locator(".universal-library-empty");
  await expect(empty).toHaveAttribute("role", "status");
  await expect(empty).toContainText("No matching results");
  await empty.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(search).toHaveValue("");
  await expect(page.locator(".universal-library-item")).toHaveCount(6);
  await expect(page.locator('.universal-library-toolbar [role="status"]')).toContainText("6 items");
  expect(errors).toEqual([]);
});

test("drawers, disclosures, panels, and dialogs preserve open and closed interaction states", async ({ page }) => {
  const errors = monitorRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/app/home");

  const backdrop = page.locator(".universal-shell-backdrop");
  await expect(backdrop).toHaveAttribute("data-state", "closed");
  await expect(backdrop).toHaveCSS("visibility", "hidden");
  await page.getByRole("button", { name: "فتح القائمة" }).click();
  await expect(backdrop).toHaveAttribute("data-state", "open");
  await expect(page.locator(".universal-shell-sidebar")).toHaveCSS("visibility", "visible");

  const advanced = page.getByRole("button", { name: "أدوات متقدمة" });
  await advanced.click();
  const advancedRegion = page.locator(".universal-shell-advanced-region");
  await expect(advancedRegion).toHaveAttribute("data-state", "open");
  await expect(advancedRegion.getByRole("link").first()).toHaveAttribute("tabindex", "0");
  await advanced.click();
  await expect(advancedRegion).toHaveAttribute("data-state", "closed");
  await expect(advancedRegion.locator("a").first()).toHaveAttribute("tabindex", "-1");
  await page.locator(".universal-shell-close").click();
  await expect(backdrop).toHaveAttribute("data-state", "closed");

  await page.getByRole("button", { name: "خصّص تجربتي" }).click();
  const dialog = page.getByRole("dialog", { name: "ما الذي تريد أن يساعدك فيه نَسَق؟" });
  await expect(dialog).toHaveAttribute("data-state", "open");
  await expect(dialog).toHaveCSS("animation-name", "u-sheet-in");
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.y + box!.height).toBeLessThanOrEqual(844.5);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 900 });
  const notificationsButton = page.getByRole("button", { name: "الإشعارات" });
  await notificationsButton.click();
  const notifications = page.locator("#universal-notifications");
  await expect(notifications).toHaveAttribute("data-state", "open");
  await expect(notifications).toHaveCSS("visibility", "visible");
  await page.keyboard.press("Escape");
  await expect(notifications).toHaveAttribute("data-state", "closed");
  await expect(notifications.locator("a").first()).toHaveAttribute("tabindex", "-1");

  await page.keyboard.press("Control+k");
  const command = page.locator(".universal-command");
  await expect(command).toHaveAttribute("data-state", "open");
  await expect(command).toHaveCSS("animation-name", "u-command-in");
  await page.keyboard.press("Escape");
  await expect(command).toBeHidden();
  await expect(page.locator(".universal-shell-search")).toBeFocused();
  expect(errors).toEqual([]);
});

test("reduced motion removes spatial activity without removing feedback meaning", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = monitorRuntimeErrors(page);
  await page.goto("/en/app/home");

  const tileDuration = await page.locator(".adaptive-service-tile").first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(tileDuration).toMatch(/1e-05s|0\.00001s|0\.01ms/);
  await page.locator(".adaptive-task-composer textarea").fill("Help me plan a short learning path");
  await page.locator(".adaptive-task-submit").click();
  const working = page.locator('.adaptive-thinking[data-feedback-state="working"]');
  await expect(working).toContainText("Explicit simulation");
  await expect(working.locator(".u-feedback__icon svg")).toHaveCSS("animation-name", "none");
  await expect(working.locator(".u-feedback__progress > i")).toHaveCSS("animation-name", "none");
  await expect(page.locator('.adaptive-ready[data-feedback-state="success"]')).toContainText("Intent understood", { timeout: 8_000 });

  await page.goto("/en");
  const ambient = await page.evaluate(() => ({
    heroTransform: getComputedStyle(document.querySelector<HTMLElement>(".universal-hero__copy")!).transform,
    cardIterations: getComputedStyle(document.querySelector<HTMLElement>(".universal-float-card")!).animationIterationCount,
    liveIterations: getComputedStyle(document.querySelector<HTMLElement>(".universal-live-dot")!).animationIterationCount,
  }));
  expect(ambient.heroTransform).toBe("none");
  expect(ambient.cardIterations).toBe("1");
  expect(ambient.liveIterations).toBe("1");
  expect(errors).toEqual([]);
  await context.close();
});

test("forced colors retains bordered, text-backed feedback", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Forced-colors emulation is a Chromium contract gate.");
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/en/app/home");
  await page.locator(".adaptive-task-submit").click();
  const validation = page.locator("#adaptive-task-error");
  await expect(validation).toBeVisible();
  await expect(validation).toHaveCSS("border-top-style", "solid");
  await expect(validation.locator(".u-feedback__icon")).toHaveCSS("border-top-style", "solid");
  await expect(validation.getByRole("button", { name: "Write my request" })).toBeVisible();
});
