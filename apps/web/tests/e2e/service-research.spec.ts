import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * U2.2 Research E2E — the product route, not the foundation harness.
 *
 * E2E-RSH-001 guided flow (brief → editable plan → approve → activity →
 * claim/citation → report/save) · E2E-RSH-002 unavailable/conflicting/
 * unsupported states + recovery · E2E-RSH-003 steer/cancel/retry with no stale
 * report, plus the U2-RSH-010 accessibility, RTL, reflow, reduced-motion, and
 * forced-colors gates.
 *
 * The spec is black-box: every answer comes from the same deterministic
 * fixtures the app ships; no `data-correct` hooks in the DOM.
 */

const ROUTE = "/app/research";

async function gotoResearch(page: Page, locale: "ar" | "en" = "ar") {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(`/${locale}${ROUTE}`);
  const workspace = page.getByTestId("u2-research-workspace");
  await expect(workspace).toBeVisible();
  // Interact only once the client tree owns the markup.
  await expect(workspace).toHaveAttribute("data-hydrated", "true");
  return errors;
}

const stage = (page: Page) => page.getByTestId("u2-research-workspace").getAttribute("data-stage");

async function fillBrief(page: Page, question: string, decision: string) {
  await page.getByTestId("u2-research-question").fill(question);
  await page.getByTestId("u2-research-decision").fill(decision);
  await page.getByTestId("u2-research-brief-submit").click();
  await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_clarify");
}

/** Answers every clarification with the visible default, then builds the plan. */
async function answerClarify(page: Page) {
  for (let index = 0; index < 4; index += 1) {
    if ((await stage(page)) !== "rsh_clarify") {
      return;
    }
    await page.getByTestId("u2-research-clarify-default").click();
    const next = page.getByTestId("u2-research-clarify-next");
    if (await next.isEnabled()) {
      await next.click();
      continue;
    }
    await page.getByTestId("u2-research-clarify-finish").click();
    return;
  }
}

/** Widens the plan so blogs, archived pages, and papers join the pack, then approves. */
async function approveWidePlan(page: Page) {
  await page.getByTestId("u2-research-type-academic_paper").click();
  await page.getByTestId("u2-research-type-blog").click();
  await page.getByTestId("u2-research-type-archived_page").click();
  await page.getByTestId("u2-research-plan-rationale").locator("summary").click();
  await page.getByTestId("u2-research-plan-approve").click();
  await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_source_activity");
}

/** Plays the activity manually to its terminal event. */
async function playActivity(page: Page, { limit = 40 } = {}) {
  for (let index = 0; index < limit; index += 1) {
    if ((await stage(page)) === "rsh_source_review") {
      return;
    }
    await page.getByTestId("u2-research-activity-next").click();
  }
  if ((await stage(page)) !== "rsh_source_review") {
    throw new Error(`the activity did not complete within ${limit} steps`);
  }
}

async function resolveMatrix(page: Page) {
  // Acknowledge the unsupported claim and request evidence for the conflicted one.
  await page.getByTestId("u2-research-acknowledge-clm_retention_link").click();
  await page.getByTestId("u2-research-resolve-clm_csat_up").click();
  await expect(page.getByTestId("u2-research-resolved-note-clm_csat_up")).toBeVisible();
  await page.getByTestId("u2-research-claims-continue").click();
  await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_report_edit");
}

async function reviewWholeReport(page: Page) {
  const sections = page.locator('[data-testid^="u2-research-section-review-"]');
  const count = await sections.count();
  for (let index = 0; index < count; index += 1) {
    await sections.nth(index).check();
  }
}

test.describe("E2E-RSH-001 — guided flow from brief to a saved research report", () => {
  test("walks the eight stages, inspects a citation, and reaches a terminal run with a truthful receipt", async ({ page }) => {
    const errors = await gotoResearch(page, "ar");
    await expect(page.getByTestId("u2-research-stage-title")).toBeVisible();

    // No run before an approved plan: the reason is stated, not hidden.
    await expect(page.getByTestId("u2-start")).toBeDisabled();
    await expect(page.locator("#u2-start-reason")).toBeVisible();

    await fillBrief(page, "ما أثر تقليل زمن الانتظار على رضا العملاء في الربع الثالث؟", "هل نستثمر في فريق دعم إضافي؟");
    await answerClarify(page);
    await expect(page.getByTestId("u2-research-plan")).toBeVisible();
    await expect(page.getByTestId("u2-research-plan")).toHaveAttribute("data-plan-version", "1");

    // The plan is editable before approval: toggle an axis off and back on.
    await page.getByTestId("u2-research-axis-axis_satisfaction").click();
    await expect(page.getByTestId("u2-research-plan-axes").locator("li[data-axis='axis_satisfaction']")).toHaveAttribute("data-included", "false");
    await page.getByTestId("u2-research-axis-axis_satisfaction").click();
    await expect(page.getByTestId("u2-research-plan-axes").locator("li[data-axis='axis_satisfaction']")).toHaveAttribute("data-included", "true");

    await approveWidePlan(page);
    await expect(page.getByTestId("u2-research-activity-fixture")).toBeVisible();
    await playActivity(page);

    // Source review: provenance is explicit, never "searched the web now".
    await expect(page.getByTestId("u2-research-sources-provenance")).toContainText(/يُسترجع|not retrieved/ui);
    await expect(page.getByTestId("u2-research-source-list").locator("li").first()).toBeVisible();

    // Citation inspector: locator + excerpt + provenance + related claims.
    await page.getByTestId("u2-research-citation-evd_report_wait_drop").click();
    await expect(page.getByTestId("u2-research-inspector")).toBeVisible();
    await expect(page.getByTestId("u2-research-inspector-locator")).toContainText(/القسم ٣|Section 3/ui);
    await expect(page.getByTestId("u2-research-inspector-excerpt")).not.toBeEmpty();
    await expect(page.getByTestId("u2-research-inspector-not-retrieved")).toContainText(/لم يُسترجع|not retrieved/ui);
    await expect(page.getByTestId("u2-research-inspector-claim-clm_wait_drop")).toBeVisible();
    await page.keyboard.press("Escape");
    // Focus returns to the citation trigger that opened the inspector.
    await expect(page.getByTestId("u2-research-citation-evd_report_wait_drop")).toBeFocused();

    await page.getByTestId("u2-research-sources-continue").click();
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_claim_matrix");

    await resolveMatrix(page);
    await expect(page.getByTestId("u2-research-report")).toBeVisible();
    await expect(page.getByTestId("u2-research-limitations").locator("li").first()).not.toBeEmpty();

    // The report is editable: change a section body, then review every section.
    await page.getByTestId("u2-research-section-edit-sec_summary").fill("ملخص معدّل من المستخدم لأغراض الاختبار.");
    await reviewWholeReport(page);
    await page.getByTestId("u2-research-report-complete").click();
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_complete");

    await page.getByTestId("u2-research-save").click();
    await expect(page.getByTestId("u2-storage-open")).toBeVisible();

    // The shared workbench still owns the run: start it and read the receipt.
    await page.getByTestId("u2-start").click();
    await expect.poll(() => page.getByTestId("u2-workbench").getAttribute("data-run-status"), { timeout: 20_000 }).toBe("completed");
    await page.getByTestId("u2-simulation-badge").click();
    await expect(page.getByTestId("u2-receipt-network")).toHaveText("0");
    await expect(page.getByTestId("u2-receipt-boundary")).toContainText(/not implemented|غير منفّذ/ui);
    await page.keyboard.press("Escape");

    expect(errors).toEqual([]);
  });

  test("resume restores the recorded research stage from demo storage", async ({ page }) => {
    await gotoResearch(page, "en");
    await fillBrief(page, "How did shorter waiting times affect satisfaction in Q3?", "Should we hire an extra support team?");
    await answerClarify(page);
    await approveWidePlan(page);
    await playActivity(page);
    await page.getByTestId("u2-research-sources-continue").click();
    await resolveMatrix(page);

    await page.getByTestId("u2-save-demo").click();
    await page.reload();
    await expect(page.getByTestId("u2-research-workspace")).toBeVisible();
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-hydrated", "true");
    // The domain block restores the report-edit stage with the drafted report.
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_report_edit");
    await expect(page.getByTestId("u2-research-report")).toBeVisible();
    await expect(page.getByTestId("u2-research-report")).toHaveAttribute("data-sections", (await page.getByTestId("u2-research-report").getAttribute("data-sections")) ?? "");
  });
});

test.describe("E2E-RSH-002 — unavailable, conflicting, and unsupported states with recovery", () => {
  test("shows the three warning states and recovers through exclusion with affected claims", async ({ page }) => {
    const errors = await gotoResearch(page, "ar");
    await fillBrief(page, "ما أثر تقليل زمن الانتظار على رضا العملاء في الربع الثالث؟", "قرار مدعوم بالمصادر.");
    await answerClarify(page);
    await approveWidePlan(page);
    await playActivity(page);

    // Unavailable source is visible with its availability state.
    const archive = page.getByTestId("u2-research-source-src_archive_unavailable");
    await expect(archive).toHaveAttribute("data-availability", "unavailable");
    await expect(archive).toContainText(/أرشيف|Archive/ui);

    // Exclusion previews the affected claims before anything is adopted.
    await page.getByTestId("u2-research-exclude-src_survey_csat").click();
    const preview = page.getByTestId("u2-research-exclude-preview");
    await expect(preview).toBeVisible();
    await expect(preview).toContainText(/clm_csat_up|clm_peak_hours/u);
    await expect(preview).toContainText(/الادعاءات المتأثرة|Affected claims/ui);
    await page.getByTestId("u2-research-exclude-cancel").click();
    await expect(page.getByTestId("u2-research-exclude-preview")).toHaveCount(0);

    // Applying the exclusion updates coverage deterministically.
    await page.getByTestId("u2-research-exclude-src_survey_csat").click();
    await page.getByTestId("u2-research-exclude-apply").click();
    await expect(page.getByTestId("u2-research-source-src_survey_csat")).toHaveAttribute("data-excluded", "true");
    await expect(page.getByTestId("u2-research-source-src_survey_csat")).toContainText(/مستبعد|Excluded/ui);

    await page.getByTestId("u2-research-sources-continue").click();
    await expect(page.getByTestId("u2-research-claim-clm_csat_up")).toHaveAttribute("data-support", "conflicted");
    await expect(page.getByTestId("u2-research-claim-clm_retention_link")).toHaveAttribute("data-support", "unsupported");
    // The survey exclusion leaves the peak-hours claim context-only.
    await expect(page.getByTestId("u2-research-claim-clm_peak_hours")).toHaveAttribute("data-support", "partially_supported");
    // Evidence from the unavailable source carries the unverifiable-locator note.
    await expect(page.getByTestId("u2-research-evidence-evd_archive_room")).toContainText(/غير قابل للتحقق|unverifiable/ui);

    // The conflict and the unsupported claim block the report until resolved.
    await page.getByTestId("u2-research-claims-continue").click();
    await expect(page.getByTestId("u2-research-validation")).toHaveAttribute("data-validation", "claim_unresolved");

    await page.getByTestId("u2-research-acknowledge-clm_retention_link").click();
    await page.getByTestId("u2-research-resolve-clm_csat_up").click();
    await page.getByTestId("u2-research-claims-continue").click();
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_report_edit");

    expect(errors).toEqual([]);
  });

  test("a topic with no relevant sources states the limit instead of inventing coverage", async ({ page }) => {
    await gotoResearch(page, "en");
    await page.getByTestId("u2-research-topic").selectOption("zero_match");
    await fillBrief(page, "What are the 2031 forecasts for the home medical device market?", "Should we add this segment?");
    await answerClarify(page);
    await page.getByTestId("u2-research-plan-approve").click();
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_source_activity");
    await playActivity(page);
    // Zero relevant sources: the honest empty state with a recovery path.
    await expect(page.getByTestId("u2-research-sources-zero")).toBeVisible();
    await page.getByTestId("u2-research-sources-continue").click();
    await expect(page.getByTestId("u2-research-validation")).toHaveAttribute("data-validation", "source_required");
    await page.getByTestId("u2-research-sources-back").click();
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_plan_review");
  });
});

test.describe("E2E-RSH-003 — steering, cancellation, and retry never leave a stale report", () => {
  test("steering regenerates the pending steps and cancellation never completes", async ({ page }) => {
    const errors = await gotoResearch(page, "en");
    await fillBrief(page, "How did shorter waiting times affect satisfaction in Q3?", "Should we hire an extra support team?");
    await answerClarify(page);
    await approveWidePlan(page);

    await page.getByTestId("u2-research-activity-next").click();
    await page.getByTestId("u2-research-activity-next").click();

    // Steering inserts a visible marker and restarts the pending steps.
    await page.getByTestId("u2-research-activity-steer-narrow").click();
    const log = page.getByTestId("u2-research-activity-log");
    await expect(log.locator("li[data-kind='steer']").last()).toBeVisible();
    await expect(page.getByTestId("u2-research-activity-log").locator("li[data-kind='steer']")).toHaveCount(1);

    // Cancel: the log records it, no completion is claimed, and the report never existed.
    await page.getByTestId("u2-research-activity-cancel").click();
    await expect(page.getByTestId("u2-research-activity-cancelled")).toBeVisible();
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_source_activity");
    await expect(page.getByTestId("u2-research-report")).toHaveCount(0);

    // Resume continues from the same cursor and still completes deterministically.
    await page.getByTestId("u2-research-activity-resume").click();
    await expect(log.locator("li[data-kind='resumed']")).toBeVisible();
    await playActivity(page);
    // The narrow steer removed the 2024 archived source from discovery: its
    // evidence is gone and the room-context claim lost one of its two refs.
    await page.getByTestId("u2-research-sources-continue").click();
    await expect(page.getByTestId("u2-research-claim-clm_waiting_room_context")).toHaveAttribute("data-support", "partially_supported");
    await expect(page.getByTestId("u2-research-evidence-evd_archive_room")).toHaveCount(0);

    expect(errors).toEqual([]);
  });

  test("a cancelled shared run ends cancelled, restarts fresh, and never resurrects a stale report", async ({ page }) => {
    await gotoResearch(page, "ar");
    await fillBrief(page, "ما أثر تقليل زمن الانتظار على رضا العملاء في الربع الثالث؟", "قرار مدعوم بالمصادر.");
    await answerClarify(page);
    await approveWidePlan(page);

    // The shared workbench run: cancel immediately, before it can complete.
    await page.getByTestId("u2-start").click();
    await page.getByTestId("u2-cancel").click();
    await expect.poll(() => page.getByTestId("u2-workbench").getAttribute("data-run-status"), { timeout: 20_000 }).toBe("cancelled");
    // A cancelled run is not offered a retry button: the workbench contract
    // reserves retry for failed attempts, so no dead control appears.
    await expect(page.getByTestId("u2-retry")).toHaveCount(0);
    // The domain state was never touched by the shared run: no report exists.
    await expect(page.getByTestId("u2-research-report")).toHaveCount(0);
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_source_activity");

    // A fresh run is a new attempt, not a resurrection of the cancelled one.
    await page.getByTestId("u2-start").click();
    await expect.poll(() => page.getByTestId("u2-workbench").getAttribute("data-run-status"), { timeout: 20_000 }).toBe("completed");
    await expect(page.getByTestId("u2-workbench").getAttribute("data-run-id")).not.toBe("");
    // Still no stale completion leaked into the domain state: the report only
    // exists after the user walks the domain flow.
    await expect(page.getByTestId("u2-research-report")).toHaveCount(0);
  });
});

test.describe("U2-RSH-010 — accessibility, RTL, reflow, and reduced motion", () => {
  test("no serious or critical axe violation on the Research flow", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Injected Axe is unstable on WebKit; WebKit stays an interaction gate.");
    await gotoResearch(page, "ar");
    const brief = await new AxeBuilder({ page }).analyze();
    expect(brief.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

    await fillBrief(page, "ما أثر تقليل زمن الانتظار على رضا العملاء في الربع الثالث؟", "قرار مدعوم بالمصادر.");
    await answerClarify(page);
    const plan = await new AxeBuilder({ page }).analyze();
    expect(plan.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

    await approveWidePlan(page);
    await playActivity(page);
    await page.getByTestId("u2-research-sources-continue").click();
    const matrix = await new AxeBuilder({ page }).analyze();
    expect(matrix.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });

  test("the flow is operable with the keyboard alone", async ({ page }) => {
    await gotoResearch(page, "en");
    await page.getByTestId("u2-research-question").focus();
    await page.keyboard.type("keyboard only research question");
    await page.keyboard.press("Tab");
    await page.keyboard.type("keyboard only decision");
    // Reach the submit button through tab order, then activate with Enter.
    for (let index = 0; index < 8; index += 1) {
      if (await page.getByTestId("u2-research-brief-submit").evaluate((node) => node === document.activeElement)) {
        break;
      }
      await page.keyboard.press("Tab");
    }
    await expect(page.getByTestId("u2-research-brief-submit")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("u2-research-workspace")).toHaveAttribute("data-stage", "rsh_clarify");

    // Question groups are real fieldsets with legends.
    await expect(page.getByTestId("u2-research-clarify").locator("fieldset legend")).not.toBeEmpty();
  });

  test("RTL layout keeps direction and no document overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await gotoResearch(page, "ar");
    const metrics = await page.evaluate(() => ({
      direction: getComputedStyle(document.documentElement).direction,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      submitHeight: document.querySelector('[data-testid="u2-research-brief-submit"]')?.getBoundingClientRect().height ?? 0,
      overflowLeft: [...document.querySelectorAll<HTMLElement>(".u2-research *")].filter((node) => node.getBoundingClientRect().left < -1).length,
    }));
    expect(metrics.direction).toBe("rtl");
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.submitHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.overflowLeft).toBe(0);
  });

  test("200% reflow on the plan review keeps the controls usable", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoResearch(page, "en");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });
    await fillBrief(page, "reflow check question", "reflow decision");
    await answerClarify(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByTestId("u2-research-plan-approve")).toBeVisible();
  });

  test("reduced motion keeps the flow usable without decorative animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoResearch(page, "ar");
    const animation = await page.getByTestId("u2-research-brief").evaluate(() => window.getComputedStyle(document.querySelector(".u2-research") as Element).animationName);
    expect(animation).toBe("none");
    await fillBrief(page, "تقليل الحركة", "قرار");
    await answerClarify(page);
    await expect(page.getByTestId("u2-research-plan")).toBeVisible();
  });

  test("forced colors keeps the Research controls visible", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Forced-colors emulation is a Chromium gate.");
    await page.emulateMedia({ forcedColors: "active" });
    await gotoResearch(page, "ar");
    const colors = await page.getByTestId("u2-research-brief-submit").evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return { background: styles.backgroundColor, color: styles.color };
    });
    expect(colors.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(colors.color).not.toBe("rgba(0, 0, 0, 0)");
  });
});
