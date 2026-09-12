import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * U2.0 foundation E2E skeleton (service-depth-core).
 *
 * These journeys run against the foundation verification surface
 * (`/{locale}/preview/service-foundation`) because U2.0 must not replace a
 * product service route before the foundation gate passes. Each test uses one
 * viewport, transient assertions stay inside a single browser task, and no
 * full-page WebKit screenshot is taken anywhere.
 */

const HARNESS = "/preview/service-foundation";
const serviceOrder = ["learn", "research", "create", "code", "analyze", "explore"] as const;

async function gotoHarness(page: Page, locale: "ar" | "en" = "en") {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(`/${locale}${HARNESS}`);
  await expect(page.getByTestId("u2-harness")).toBeVisible();
  return errors;
}

async function selectScenario(page: Page, scenarioId: string) {
  await page.getByTestId("u2-scenario-select").selectOption(scenarioId);
  await expect(page.getByTestId("u2-harness")).toHaveAttribute("data-scenario", scenarioId);
}

async function runStatus(page: Page) {
  return (await page.getByTestId("u2-workbench").getAttribute("data-run-status")) ?? "";
}

test.describe("U2.0 foundation — run lifecycle and truth disclosure", () => {
  test("a happy run reaches one terminal state with an artifact and a simulation receipt", async ({ page }) => {
    const errors = await gotoHarness(page, "en");
    const declared = await page.getByTestId("u2-harness-stage-count").getAttribute("data-stage-count");
    await expect(page.getByTestId("u2-stage-navigation").locator("li")).toHaveCount(Number(declared));

    await page.getByTestId("u2-start").click();
    await expect(page.getByTestId("u2-run-status")).toBeVisible();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");

    await expect(page.getByTestId("u2-artifact-region")).toHaveAttribute("data-has-artifact", "true");
    const runId = await page.getByTestId("u2-workbench").getAttribute("data-run-id");
    expect(runId).toMatch(/^run_/u);

    await page.getByTestId("u2-simulation-badge").click();
    const receipt = page.getByTestId("u2-receipt-panel");
    await expect(receipt).toBeVisible();
    await expect(receipt.getByTestId("u2-receipt-network")).toHaveText("0");
    await expect(receipt.getByTestId("u2-receipt-boundary")).toContainText(/not implemented/ui);
    await expect(receipt.getByTestId("u2-receipt-mode")).toContainText(/explicit simulation/ui);

    await page.keyboard.press("Escape");
    await expect(receipt).toBeHidden();
    await expect(page.getByTestId("u2-simulation-badge")).toBeFocused();
    expect(errors).toEqual([]);
  });

  test("a cancel race resolves to exactly one terminal state and never completes", async ({ page }) => {
    await gotoHarness(page, "en");
    await selectScenario(page, "cancel_race");
    await page.getByTestId("u2-start").click();

    const cancel = page.getByTestId("u2-cancel");
    await expect(cancel).toBeVisible();
    await expect.poll(() => runStatus(page), { timeout: 10_000 }).not.toBe("idle");

    // Click inside one browser task and read the transient request state in the
    // same task, so a fast run cannot hide the intermediate state.
    const requestStatus = await page.evaluate(() => {
      const root = document.querySelector("[data-testid=\"u2-workbench\"]");
      document.querySelector<HTMLButtonElement>("[data-testid=\"u2-cancel\"]")?.click();
      return root?.getAttribute("data-run-status") ?? "";
    });
    expect(["validating", "running", "queued", "cancel_requested", "cancelled"]).toContain(requestStatus);

    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("cancelled");
    await expect(page.getByTestId("u2-artifact-region")).toHaveAttribute("data-has-artifact", "false");
  });

  test("a retryable failure retries into a new run", async ({ page }) => {
    await gotoHarness(page, "en");
    await selectScenario(page, "failed_retryable");
    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("failed_retryable");
    const firstRunId = await page.getByTestId("u2-workbench").getAttribute("data-run-id");

    await page.getByTestId("u2-retry").click();
    await expect(page.getByTestId("u2-workbench")).toHaveAttribute("data-run-retry-of", firstRunId ?? "");
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
    const retryRunId = await page.getByTestId("u2-workbench").getAttribute("data-run-id");
    expect(retryRunId).toMatch(/^run_/u);
    expect(retryRunId).not.toBe(firstRunId);
  });

  test("a run that needs input waits for the user instead of completing on a timer", async ({ page }) => {
    await gotoHarness(page, "ar");
    await selectScenario(page, "needs_input");
    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("needs_input");

    await page.waitForTimeout(1_000);
    expect(await runStatus(page)).toBe("needs_input");

    await page.getByTestId("u2-provide-input").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
  });

  test("every service keeps its own stage sequence", async ({ page }) => {
    await gotoHarness(page, "en");
    const seen = new Set<string>();
    for (const serviceId of serviceOrder) {
      await page.getByTestId("u2-service-select").selectOption(serviceId);
      await expect(page.getByTestId("u2-workbench")).toHaveAttribute("data-service", serviceId);
      const declared = Number(await page.getByTestId("u2-harness-stage-count").getAttribute("data-stage-count"));
      expect(declared).toBeGreaterThanOrEqual(6);
      await expect(page.getByTestId("u2-stage-navigation").locator("li")).toHaveCount(declared);
      seen.add(String(declared));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  test("no outbound network request leaves the page and no console error appears", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") external.push(request.url());
    });
    const errors = await gotoHarness(page, "en");
    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
  });
});

test.describe("U2.0 foundation — demo storage, locale, and handoff", () => {
  test("save, corrupt recovery, and clear are explicit and local", async ({ page }) => {
    await gotoHarness(page, "ar");
    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
    await page.getByTestId("u2-save-demo").click();

    await page.getByTestId("u2-storage-open").click();
    await expect(page.getByTestId("u2-storage-status")).toContainText(/تبويب|تخزين/iu);
    await page.getByTestId("u2-storage-clear").click();
    await expect(page.getByTestId("u2-storage-status")).toBeVisible();
    await page.keyboard.press("Escape");

    await page.evaluate(() => window.sessionStorage.setItem("nasaq:u2:session:v1", "{not json"));
    await page.reload();
    await expect(page.getByTestId("u2-harness")).toBeVisible();
    await page.getByTestId("u2-storage-open").click();
    await expect(page.getByTestId("u2-storage-status")).toContainText(/غير صالحة|مسحتها|invalid|cleared/iu);
  });

  test("switching locale keeps the locally saved session", async ({ page }) => {
    await gotoHarness(page, "ar");
    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
    await page.getByTestId("u2-save-demo").click();
    const sessionId = await page.getByTestId("u2-session-id").getAttribute("data-session-id");

    await page.getByTestId("u2-locale-switch").click();
    await expect(page).toHaveURL(/\/en\/preview\/service-foundation/u);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByTestId("u2-session-id")).toHaveAttribute("data-session-id", sessionId ?? "");
    await expect(page.getByTestId("u2-resumed")).toBeVisible();
  });

  test("a handoff is previewed and confirmed by the user only", async ({ page }) => {
    await gotoHarness(page, "en");
    await page.getByTestId("u2-handoff-preview").click();
    const panel = page.getByTestId("u2-handoff-panel");
    await expect(panel).toBeVisible();
    await expect(panel.getByTestId("u2-handoff-confirm")).toBeEnabled();
    await panel.getByTestId("u2-handoff-confirm").click();
    await expect(panel.getByTestId("u2-handoff-status")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });
});

test.describe("U2.0 foundation — accessibility, responsive, and motion", () => {
  test("keyboard-only path opens the receipt and reports unavailable controls", async ({ page }) => {
    await gotoHarness(page, "en");
    await page.getByTestId("u2-simulation-badge").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("u2-receipt-panel")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("u2-simulation-badge")).toBeFocused();

    const stageButtons = page.getByTestId("u2-stage-navigation").locator("button");
    await expect(stageButtons.first()).toBeDisabled();
    await expect(page.getByTestId("u2-stage-navigation").locator("[id$='-reason']").first()).toHaveText(/.+/u);
  });

  test("no serious or critical axe violation on the foundation surface", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Injected Axe is unstable on WebKit; WebKit stays an interaction gate.");
    await gotoHarness(page, "en");
    const initial = await new AxeBuilder({ page }).analyze();
    expect(initial.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
    await page.getByTestId("u2-simulation-badge").click();
    const withReceipt = await new AxeBuilder({ page }).analyze();
    expect(withReceipt.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });

  test("forced colors keeps the workbench controls visible", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Forced-colors emulation is a Chromium gate.");
    await page.emulateMedia({ forcedColors: "active" });
    await gotoHarness(page, "ar");
    const start = page.getByTestId("u2-start");
    await expect(start).toBeVisible();
    const colors = await start.evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return { background: styles.backgroundColor, color: styles.color, border: styles.borderTopColor };
    });
    expect(colors.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(colors.color).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("reduced motion disables decorative entrance animation and keeps the flow usable", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoHarness(page, "ar");
    await page.getByTestId("u2-simulation-badge").click();
    const animation = await page.getByTestId("u2-receipt-panel").evaluate(() => {
      const overlay = document.querySelector(".u2-overlay");
      return overlay ? window.getComputedStyle(overlay).animationName : "missing";
    });
    expect(animation).toBe("none");
    await page.keyboard.press("Escape");
    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
  });

  test("phone layout keeps 44px targets and no document overflow", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await gotoHarness(page, "ar");
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      startHeight: document.querySelector("[data-testid=\"u2-start\"]")?.getBoundingClientRect().height ?? 0,
      badgeHeight: document.querySelector("[data-testid=\"u2-simulation-badge\"]")?.getBoundingClientRect().height ?? 0,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.startHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.badgeHeight).toBeGreaterThanOrEqual(44);
  });

  test("200% reflow keeps the workbench readable without document overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHarness(page, "en");
    await page.evaluate(() => { document.documentElement.style.fontSize = "32px"; });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.getByTestId("u2-start").click();
    await expect.poll(() => runStatus(page), { timeout: 20_000 }).toBe("completed");
  });
});
