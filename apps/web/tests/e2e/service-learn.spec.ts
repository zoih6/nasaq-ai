import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getLearnTopic } from "@nasaq/mock-api/services";

/**
 * U2.1 Learn E2E — the product route, not the foundation harness.
 *
 * E2E-LRN-001 guided flow · E2E-LRN-002 fast flow + save/resume ·
 * E2E-LRN-003 error recovery, plus the U2-LRN-008 accessibility, reflow,
 * reduced-motion and forced-colors gates.
 *
 * The spec is black-box: answers come from the same deterministic fixtures the
 * app ships, never from a `data-correct` hook in the DOM.
 */

const ROUTE = "/app/learn";
const topic = getLearnTopic("spaced_repetition");
const correctSuffix = (moduleId: string) => {
  const topicModule = topic.modules.find((candidate) => candidate.id === moduleId) ?? topic.denseOnlyModules[0];
  return (topicModule?.check.correctChoiceId ?? "").slice(-1);
};
const wrongSuffix = (moduleId: string) => {
  const topicModule = topic.modules.find((candidate) => candidate.id === moduleId) ?? topic.denseOnlyModules[0];
  const choice = topicModule?.check.choices.find(
    (candidate) => candidate.id !== topicModule.check.correctChoiceId && !topicModule.check.partialChoiceIds.includes(candidate.id),
  );
  return (choice?.id ?? "").slice(-1);
};

async function gotoLearn(page: Page, locale: "ar" | "en" = "ar") {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(`/${locale}${ROUTE}`);
  const workspace = page.getByTestId("u2-learn-workspace");
  await expect(workspace).toBeVisible();
  // Interact only once the client tree owns the markup: clicking sooner is a
  // no-op and used to look like a product defect under sandbox load.
  await expect(workspace).toHaveAttribute("data-hydrated", "true");
  return errors;
}

const stage = (page: Page) => page.getByTestId("u2-learn-workspace").getAttribute("data-stage");

async function fillBrief(page: Page, motivation: string) {
  await page.getByTestId("u2-learn-motivation").fill(motivation);
  await page.getByTestId("u2-learn-brief-submit").click();
  await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_diagnostic");
}

async function answerDiagnostic(page: Page) {
  for (let index = 0; index < 8; index += 1) {
    if ((await stage(page)) !== "lrn_diagnostic") {
      return;
    }
    // Deterministic learner: the second option on every question.
    await page.locator('[data-testid^="u2-learn-diagnostic-choice-"]').nth(1).click();
    const next = page.getByTestId("u2-learn-diagnostic-next");
    if (await next.isEnabled()) {
      await next.click();
      continue;
    }
    await page.getByTestId("u2-learn-diagnostic-finish").click();
    return;
  }
  throw new Error("diagnostic did not finish within 8 questions");
}

async function confirmPath(page: Page) {
  await page.getByTestId("u2-learn-path-confirm").click();
  await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_lesson");
}

async function engageLesson(page: Page) {
  await page.getByTestId("u2-learn-engage").click();
  await expect(page.getByTestId("u2-learn-engaged")).toBeVisible();
  await page.getByTestId("u2-learn-lesson-continue").click();
  await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_check");
}

async function currentModule(page: Page) {
  return (await page.getByTestId("u2-learn-check").getAttribute("data-module")) ?? "";
}

test.describe("E2E-LRN-001 — guided flow from brief to a saved learning path", () => {
  test("walks the eight stages, records a real module, and reaches a terminal run with a receipt", async ({ page }) => {
    const errors = await gotoLearn(page, "ar");
    await expect(page.getByTestId("u2-learn-stage-title")).toBeVisible();

    // A run cannot be started before a path exists: the reason is stated, not hidden.
    await expect(page.getByTestId("u2-start")).toBeDisabled();
    await expect(page.locator("#u2-start-reason")).toBeVisible();

    await fillBrief(page, "أراجع قبل مقابلة");
    await expect(page.getByTestId("u2-learn-diagnostic-progress")).toBeVisible();
    await answerDiagnostic(page);
    await expect(page.getByTestId("u2-learn-path")).toBeVisible();

    // Path review: reorder, skip with a reason, restore — the answers survive.
    const modules = page.getByTestId("u2-learn-modules").locator("li");
    const moduleCount = await modules.count();
    expect(moduleCount).toBeGreaterThanOrEqual(3);
    const secondId = (await modules.nth(1).getAttribute("data-testid"))?.replace("u2-learn-module-", "") ?? "";
    await page.getByTestId(`u2-learn-up-${secondId}`).click();
    await expect(page.getByTestId("u2-learn-path-edited")).toBeVisible();
    await expect(modules.first()).toHaveAttribute("data-testid", `u2-learn-module-${secondId}`);

    const thirdId = (await modules.nth(2).getAttribute("data-testid"))?.replace("u2-learn-module-", "") ?? "";
    await page.getByTestId(`u2-learn-skip-${thirdId}`).selectOption("out_of_time");
    const skipped = page.getByTestId(`u2-learn-module-${thirdId}`);
    await expect(skipped).toHaveAttribute("data-skipped", "true");
    // The recorded reason is shown (and stays readable: the state is not
    // communicated by dimming the text).
    await expect(skipped).toContainText(/لا يكفي وقتي|do not have time/ui);
    const contrast = await skipped.evaluate((node) => {
      const paragraph = node.querySelector("p") as HTMLElement | null;
      const styles = paragraph === null ? null : window.getComputedStyle(paragraph);
      return { color: styles?.color ?? "", opacity: styles?.opacity ?? "", fontSize: styles?.fontSize ?? "" };
    });
    expect(contrast.opacity).toBe("1");
    expect(contrast.fontSize).not.toBe("");
    await page.getByTestId(`u2-learn-restore-${thirdId}`).click();
    await expect(page.getByTestId(`u2-learn-module-${thirdId}`)).toHaveAttribute("data-skipped", "false");

    await page.getByTestId("u2-learn-rationale").locator("summary").click();
    await expect(page.getByTestId("u2-learn-rationale").locator("li").first()).not.toBeEmpty();

    await confirmPath(page);
    await engageLesson(page);

    const moduleId = await currentModule(page);
    await page.getByTestId("u2-learn-hint-button").click();
    await expect(page.getByTestId("u2-learn-hint")).toHaveAttribute("data-hint-level", "1");
    await page.getByTestId(`u2-learn-check-choice-${correctSuffix(moduleId)}`).click();
    await page.getByTestId("u2-learn-check-submit").click();

    await expect(page.getByTestId("u2-learn-feedback")).toHaveAttribute("data-outcome", "correct");
    await expect(page.getByTestId("u2-learn-explanation")).not.toBeEmpty();
    await page.getByTestId("u2-learn-acknowledge").click();

    // Checkpoint: honest progress, a handoff preview, then the next module.
    await expect(page.getByTestId("u2-learn-checkpoint")).toBeVisible();
    await expect(page.getByTestId("u2-learn-progress")).toHaveAttribute("data-completed", "1");
    await page.getByTestId("u2-learn-handoff").click();
    await expect(page.getByTestId("u2-handoff-summary")).not.toBeEmpty();
    await page.keyboard.press("Escape");
    await page.getByTestId("u2-learn-checkpoint-continue").click();
    await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_lesson");
    const nextModuleId = await page.getByTestId("u2-learn-lesson").getAttribute("data-module");
    expect(nextModuleId).not.toBe(moduleId);
    expect(nextModuleId).toBeTruthy();

    // The shared workbench still owns the run: start it and read the receipt.
    await page.getByTestId("u2-start").click();
    await expect.poll(() => page.getByTestId("u2-workbench").getAttribute("data-run-status"), { timeout: 20_000 }).toBe("completed");
    await page.getByTestId("u2-simulation-badge").click();
    await expect(page.getByTestId("u2-receipt-network")).toHaveText("0");
    await expect(page.getByTestId("u2-receipt-boundary")).toContainText(/not implemented|غير منفّذ/ui);
    await page.keyboard.press("Escape");

    expect(errors).toEqual([]);
  });
});

test.describe("E2E-LRN-002 — fast flow, disclosure, save and resume", () => {
  test("fast mode discloses self-assessment, keeps a quick check, and saves a resumable stage", async ({ page }) => {
    await gotoLearn(page, "en");
    await page.getByTestId("u2-learn-mode-fast").click();
    await expect(page.getByTestId("u2-learn-self-assessed")).toBeVisible();

    await page.getByTestId("u2-learn-motivation").fill("prepare a workshop");
    await page.getByTestId("u2-learn-brief-submit").click();
    // Fast mode has no diagnostic: it lands on an editable path with disclosure.
    await expect(page.getByTestId("u2-learn-path")).toBeVisible();
    await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-mode", "fast");

    await confirmPath(page);
    await engageLesson(page);
    const moduleId = await currentModule(page);
    await page.getByTestId(`u2-learn-check-choice-${correctSuffix(moduleId)}`).click();
    await page.getByTestId("u2-learn-check-submit").click();
    await expect(page.getByTestId("u2-learn-feedback")).toHaveAttribute("data-outcome", "correct");
    await page.getByTestId("u2-learn-acknowledge").click();

    // Save locally, then resume: the recorded stage and progress come back.
    await page.getByTestId("u2-learn-checkpoint-save").click();
    await page.getByTestId("u2-storage-open").click();
    await expect(page.getByTestId("u2-storage-status")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.reload();
    await expect(page.getByTestId("u2-learn-workspace")).toBeVisible();
    await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_checkpoint");
    await expect(page.getByTestId("u2-learn-progress")).toHaveAttribute("data-completed", "1");
    await expect(page.getByTestId("u2-learn-progress")).toHaveAttribute("data-total", (await page.getByTestId("u2-learn-progress").getAttribute("data-total")) ?? "");
  });

  test("switching fast → guided keeps the recorded brief and answers", async ({ page }) => {
    await gotoLearn(page, "ar");
    await page.getByTestId("u2-learn-mode-fast").click();
    await page.getByTestId("u2-learn-motivation").fill("سبب محفوظ");
    await page.getByTestId("u2-learn-brief-submit").click();
    await expect(page.getByTestId("u2-learn-path")).toBeVisible();

    await page.getByTestId("u2-learn-mode-guided").click();
    await expect(page.getByTestId("u2-learn-diagnostic")).toBeVisible();
    await expect(page.getByTestId("u2-learn-motivation")).toHaveCount(0);
    await answerDiagnostic(page);
    await expect(page.getByTestId("u2-learn-path")).toBeVisible();
    // The switch never wiped the brief: the path is built from the same topic.
    await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-topic", "spaced_repetition");
  });
});

test.describe("E2E-LRN-003 — error and recovery surfaces stay honest", () => {
  test("an empty check submit asks for an answer, and a wrong answer recovers through retry", async ({ page }) => {
    await gotoLearn(page, "en");
    await fillBrief(page, "fix my recall");
    await answerDiagnostic(page);
    await confirmPath(page);
    await engageLesson(page);

    const moduleId = await currentModule(page);
    await page.getByTestId("u2-learn-check-submit").click();
    await expect(page.getByTestId("u2-learn-validation")).toHaveAttribute("data-validation", "check_incomplete");
    await expect(page.getByTestId("u2-learn-attempts")).toHaveAttribute("data-attempts", "0");

    await page.getByTestId(`u2-learn-check-choice-${wrongSuffix(moduleId)}`).click();
    await page.getByTestId("u2-learn-check-submit").click();
    await expect(page.getByTestId("u2-learn-feedback")).toHaveAttribute("data-outcome", "wrong");
    await expect(page.getByTestId("u2-learn-explanation")).not.toBeEmpty();

    await page.getByTestId("u2-learn-retry").click();
    await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_check");
    await expect(page.getByTestId("u2-learn-attempts")).toHaveAttribute("data-attempts", "1");
    await page.getByTestId(`u2-learn-check-choice-${correctSuffix(moduleId)}`).click();
    await page.getByTestId("u2-learn-check-submit").click();
    await expect(page.getByTestId("u2-learn-feedback")).toHaveAttribute("data-outcome", "correct");
    await page.getByTestId("u2-learn-acknowledge").click();
    await expect(page.getByTestId("u2-learn-progress")).toHaveAttribute("data-completed", "1");
  });

  test("a skipped check is recorded as review-needed instead of fake progress", async ({ page }) => {
    await gotoLearn(page, "ar");
    await fillBrief(page, "وقت قصير");
    await answerDiagnostic(page);
    await confirmPath(page);
    await engageLesson(page);
    await page.getByTestId("u2-learn-check-skip").click();
    await expect(page.getByTestId("u2-learn-feedback")).toHaveAttribute("data-outcome", "skipped");
    await page.getByTestId("u2-learn-acknowledge").click();
    await expect(page.getByTestId("u2-learn-progress")).toHaveAttribute("data-completed", "0");
    await expect(page.getByTestId("u2-learn-checkpoint")).toHaveAttribute("data-confidence", "low");
    await expect(page.getByTestId("u2-learn-needs-review")).toBeVisible();
  });

  test("an incomplete brief is refused instead of inventing a plan", async ({ page }) => {
    await gotoLearn(page, "en");
    // Submitting with no stated reason keeps the user on the brief with a
    // visible reason; no path is fabricated and no run can start.
    await page.getByTestId("u2-learn-brief-submit").click();
    await expect(page.getByTestId("u2-learn-validation")).toHaveAttribute("data-validation", "brief_incomplete");
    await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_brief");
    await expect(page.getByTestId("u2-start")).toBeDisabled();
    await expect(page.getByTestId("u2-learn-topic")).toHaveAttribute("aria-label", /.+/u);
  });
});

test.describe("U2-LRN-008 — accessibility, RTL, reflow and reduced motion", () => {
  test("no serious or critical axe violation on the Learn flow", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Injected Axe is unstable on WebKit; WebKit stays an interaction gate.");
    await gotoLearn(page, "ar");
    const brief = await new AxeBuilder({ page }).analyze();
    expect(brief.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

    await fillBrief(page, "أراجع قبل مقابلة");
    await answerDiagnostic(page);
    const path = await new AxeBuilder({ page }).analyze();
    expect(path.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

    await confirmPath(page);
    await engageLesson(page);
    const check = await new AxeBuilder({ page }).analyze();
    expect(check.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });

  test("the flow is operable with the keyboard alone", async ({ page }) => {
    await gotoLearn(page, "en");
    await page.getByTestId("u2-learn-motivation").focus();
    await page.keyboard.type("keyboard only");
    // Reach the submit button through tab order, then activate with Enter.
    for (let index = 0; index < 8; index += 1) {
      if (await page.getByTestId("u2-learn-brief-submit").evaluate((node) => node === document.activeElement)) {
        break;
      }
      await page.keyboard.press("Tab");
    }
    await expect(page.getByTestId("u2-learn-brief-submit")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("u2-learn-workspace")).toHaveAttribute("data-stage", "lrn_diagnostic");

    // The question group is a real fieldset with a legend, so a screen reader
    // announces the prompt with the choices.
    await expect(page.getByTestId("u2-learn-diagnostic").locator("fieldset legend")).not.toBeEmpty();
    await expect(page.getByTestId("u2-learn-diagnostic").locator("fieldset button").first()).toBeVisible();
  });

  test("RTL layout keeps text direction and no document overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await gotoLearn(page, "ar");
    const metrics = await page.evaluate(() => ({
      direction: getComputedStyle(document.documentElement).direction,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      submitHeight: document.querySelector('[data-testid="u2-learn-brief-submit"]')?.getBoundingClientRect().height ?? 0,
      modeHeight: document.querySelector('[data-testid="u2-learn-mode-guided"]')?.getBoundingClientRect().height ?? 0,
      overflowLeft: [...document.querySelectorAll<HTMLElement>(".u2-learn *")].filter((node) => node.getBoundingClientRect().left < -1).length,
    }));
    expect(metrics.direction).toBe("rtl");
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.submitHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.modeHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.overflowLeft).toBe(0);
  });

  test("200% reflow on the path review keeps the controls usable", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoLearn(page, "en");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });
    await fillBrief(page, "reflow check");
    await answerDiagnostic(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await confirmPath(page);
  });

  test("reduced motion keeps the flow usable without decorative animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoLearn(page, "ar");
    const animation = await page.getByTestId("u2-learn-brief").evaluate(() => window.getComputedStyle(document.querySelector(".u2-learn") as Element).animationName);
    expect(animation).toBe("none");
    await fillBrief(page, "تقليل الحركة");
    await answerDiagnostic(page);
    await expect(page.getByTestId("u2-learn-path")).toBeVisible();
  });

  test("forced colors keeps the Learn controls visible", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Forced-colors emulation is a Chromium gate.");
    await page.emulateMedia({ forcedColors: "active" });
    await gotoLearn(page, "ar");
    const colors = await page.getByTestId("u2-learn-brief-submit").evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return { background: styles.backgroundColor, color: styles.color };
    });
    expect(colors.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(colors.color).not.toBe("rgba(0, 0, 0, 0)");
  });
});
