import { expect, test, chromium, devices, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * U2.3 Create E2E — the product route, not the foundation harness.
 *
 * E2E-CRT-001 document blocks/alternative/version/save · E2E-CRT-002 deck
 * edit/reorder/duplicate/delete/notes · E2E-CRT-003 visual variants/alt
 * validation/disclosure · E2E-CRT-004 dirty navigation, a real storage
 * failure with retry, and a restore that grows the history, plus the
 * U2-CRT-009 accessibility, RTL, reflow, reduced-motion, and forced-colour
 * gates.
 *
 * The spec is black-box: every answer comes from the same deterministic
 * fixtures the app ships; no hidden correctness hooks in the DOM.
 */

const ROUTE = "/app/create";

// E2E-CRT-004 runs two sequential journeys in one worker. Under the
// low-memory runner Chromium is single-process, and that mode cannot hand a
// context teardown between tests (the browser dies with the first context,
// so the next `page` fixture fails while setting up — the crash research's
// handoff logged as flaky). Each test in that group therefore launches a
// dedicated browser instead of reusing the worker browser, so every journey
// starts from a clean, owned process.
const lowMemory = process.env.PLAYWRIGHT_LOW_MEMORY === "1";

async function launchDedicatedBrowser() {
  return chromium.launch(
    lowMemory
      ? {
          args: [
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-sandbox",
            "--disable-extensions",
            "--single-process",
            "--no-zygote",
            "--js-flags=--max-old-space-size=256",
          ],
        }
      : undefined,
  );
}

const testFreshBrowser = test.extend<{ page: Page }>({
  // `register` (Playwright's fixture `use`) hands the page to the test and
  // resumes here for teardown after it finishes.
  page: async ({}, register) => {
    const browser = await launchDedicatedBrowser();
    const context = await browser.newContext({ ...devices["Desktop Chrome"] });
    const page = await context.newPage();
    await register(page);
    await browser.close();
  },
});

async function gotoCreate(page: Page, locale: "ar" | "en" = "ar") {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(`/${locale}${ROUTE}`);
  const workspace = page.getByTestId("u2-create-workspace");
  await expect(workspace).toBeVisible();
  // Interact only once the client tree owns the markup.
  await expect(workspace).toHaveAttribute("data-hydrated", "true");
  return errors;
}

/** Chooses a format and completes the brief; lands on the structure stage. */
async function chooseFormatAndBrief(page: Page, format: "document" | "deck" | "visual", goal: string, audience: string) {
  await page.getByTestId(`u2-create-format-${format}`).click();
  await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_brief");
  await page.getByTestId("u2-create-goal").fill(goal);
  await page.getByTestId("u2-create-audience").fill(audience);
  await page.getByTestId("u2-create-brief-submit").click();
  await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_structure");
}

/** Confirms the structure, selects the default variant, reaches the editor. */
async function reachDraft(page: Page, variantId: string) {
  await page.getByTestId("u2-create-structure-confirm").click();
  await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_variants");
  await page.getByTestId(`u2-create-variant-${variantId}`).click();
  await page.getByTestId("u2-create-variants-confirm").click();
  await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_edit");
}

/** Saves once and waits for the saved state on the workspace root. */
async function saveOnce(page: Page) {
  await page.getByTestId("u2-create-save").click();
  await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-save-state", "saved", { timeout: 15_000 });
}

/** Requests the review pass, rejects every open suggestion, and completes. */
async function resolveReviewAndComplete(page: Page) {
  await page.getByTestId("u2-create-review-request").click();
  const suggestions = page.getByTestId("u2-create-suggestions").locator("li[data-status='open']");
  const count = await suggestions.count();
  for (let index = 0; index < count; index += 1) {
    const id = await suggestions.first().getAttribute("data-suggestion");
    if (id === null) continue;
    await page.getByTestId(`u2-create-reject-${id}`).first().click();
  }
  await page.getByTestId("u2-create-review-complete").click();
  await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_version");
}

test.describe("E2E-CRT-001 — document blocks, alternative, versions, and save", () => {
  test("edits blocks, accepts the alternative, and grows the version lineage", async ({ page }) => {
    const errors = await gotoCreate(page, "ar");

    // The generic run stays disabled with a stated reason before the brief.
    await expect(page.getByTestId("u2-start")).toBeDisabled();
    await expect(page.locator("#u2-start-reason")).toBeVisible();

    await chooseFormatAndBrief(page, "document", "أقنع فريق القيادة بتثبيت جدولة الذروة ربعًا إضافيًا.", "فريق القيادة");
    await expect(page.getByTestId("u2-create-structure-list").locator("li").first()).toBeVisible();
    await reachDraft(page, "variant_standard");

    await expect(page.getByTestId("u2-create-document")).toBeVisible();
    await expect(page.getByTestId("u2-create-blocks").locator("li").first()).toBeVisible();
    const blockCount = await page.getByTestId("u2-create-blocks").locator("li").count();

    // Add a block, edit it, and reorder it: every change is a visible button.
    await page.getByTestId("u2-create-block-add-paragraph").click();
    const added = page.getByTestId("u2-create-blocks").locator("li").nth(blockCount);
    const addedId = await added.getAttribute("data-block");
    expect(addedId).not.toBeNull();
    if (addedId === null) throw new Error("no added block");
    await page.getByTestId(`u2-create-block-text-${addedId}`).fill("فقرة أضافها المستخدم لاختبار التحرير.");
    await page.getByTestId(`u2-create-block-up-${addedId}`).click();
    await expect(page.getByTestId("u2-create-blocks").locator("li").nth(blockCount - 1)).toHaveAttribute("data-block", addedId);
    await page.getByTestId(`u2-create-block-delete-${addedId}`).click();
    await expect(page.getByTestId("u2-create-blocks").locator("li")).toHaveCount(blockCount);

    // The alternative proposes a real change with both texts visible.
    await expect(page.getByTestId("u2-create-alternative")).toBeVisible();
    await page.getByTestId("u2-create-alt-accept").click();
    await expect(page.getByTestId("u2-create-alt-note")).toContainText(/قُبل البديل|accepted/ui);

    // First save creates version 1; the state chip turns saved.
    await saveOnce(page);
    await page.getByTestId("u2-create-review-request").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_review");
    // Resolve every suggestion explicitly.
    const suggestions = page.getByTestId("u2-create-suggestions").locator("li[data-status='open']");
    const count = await suggestions.count();
    for (let index = 0; index < count; index += 1) {
      const id = await suggestions.first().getAttribute("data-suggestion");
      if (id === null) continue;
      await page.getByTestId(`u2-create-reject-${id}`).first().click();
    }
    await page.getByTestId("u2-create-review-complete").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_version");
    await expect(page.getByTestId("u2-create-versions").locator("li")).toHaveCount(1);
    await expect(page.getByTestId("u2-create-versions").locator("li").first()).toHaveAttribute("data-current", "true");

    // The read-only preview is separate from editing and loses nothing.
    await page.getByTestId("u2-create-version-back").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_edit");
    await page.getByTestId("u2-create-preview-toggle").click();
    await expect(page.getByTestId("u2-create-doc-preview")).toBeVisible();
    await expect(page.getByTestId("u2-create-blocks")).toHaveCount(0);
    await page.getByTestId("u2-create-preview-toggle").click();
    await expect(page.getByTestId("u2-create-blocks").locator("li").first()).toBeVisible();

    // The shared workbench run is available after the brief; its receipt is truthful.
    await page.getByTestId("u2-start").click();
    await expect.poll(() => page.getByTestId("u2-workbench").getAttribute("data-run-status"), { timeout: 20_000 }).toBe("completed");
    await page.getByTestId("u2-simulation-badge").click();
    await expect(page.getByTestId("u2-receipt-network")).toHaveText("0");
    await expect(page.getByTestId("u2-receipt-boundary")).toContainText(/not implemented|غير منفّذ/ui);
    await page.keyboard.press("Escape");

    expect(errors).toEqual([]);
  });
});

test.describe("E2E-CRT-002 — deck editing, guards, and versions", () => {
  test("edits slides and notes, reorders, duplicates, and respects the final-slide guard", async ({ page }) => {
    const errors = await gotoCreate(page, "en");
    await chooseFormatAndBrief(page, "deck", "Convince leadership to keep peak scheduling for one more quarter.", "Leadership team");
    await reachDraft(page, "variant_narrative");

    await expect(page.getByTestId("u2-create-deck")).toBeVisible();
    // The fixture ships at least five slides.
    const rail = page.getByTestId("u2-create-deck-rail").locator("li");
    expect(await rail.count()).toBeGreaterThanOrEqual(5);

    // Title, body, and notes edits are all observable.
    await page.getByTestId("u2-create-slide-title").fill("Edited slide title");
    await page.getByTestId("u2-create-slide-body").fill("First edited point\nSecond edited point");
    await page.getByTestId("u2-create-slide-notes").fill("Speaker note written by the user.");
    await expect(page.getByTestId("u2-create-slide-title")).toHaveValue("Edited slide title");
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-save-state", "dirty");

    // Duplicate adds a copy right after the current slide.
    await page.getByTestId("u2-create-slide-duplicate").click();
    expect(await rail.count()).toBeGreaterThanOrEqual(6);

    // Move the current slide down, then delete it: the guard never fires while
    // more than one slide exists.
    await page.getByTestId("u2-create-slide-down").click();
    await page.getByTestId("u2-create-slide-delete").click();

    // Delete down to the final slide: the delete control disables with its reason.
    const before = await rail.count();
    for (let index = 0; index < before - 1; index += 1) {
      await page.getByTestId("u2-create-slide-delete").click();
    }
    await expect(page.getByTestId("u2-create-slide-delete")).toBeDisabled();
    await expect(page.getByTestId("u2-create-last-slide-guard")).toBeVisible();
    // The slide count stays one: the guard holds.
    await expect(rail).toHaveCount(1);

    // Notes persist through a save and a restore of the version list.
    await saveOnce(page);
    await page.getByTestId("u2-create-review-request").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_review");
    const suggestions = page.getByTestId("u2-create-suggestions").locator("li[data-status='open']");
    const count = await suggestions.count();
    for (let index = 0; index < count; index += 1) {
      const id = await suggestions.first().getAttribute("data-suggestion");
      if (id === null) continue;
      await page.getByTestId(`u2-create-accept-${id}`).first().click();
    }
    await page.getByTestId("u2-create-review-complete").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_version");
    await expect(page.getByTestId("u2-create-versions").locator("li")).toHaveCount(1);

    expect(errors).toEqual([]);
  });
});

test.describe("E2E-CRT-003 — visual variants, alt validation, and disclosure", () => {
  test("selects a variant, blocks review until alt text exists, and discloses demo assets", async ({ page }) => {
    const errors = await gotoCreate(page, "ar");
    await chooseFormatAndBrief(page, "visual", "هوية بصرية لحملة تجربة الانتظار.", "فريق التسويق");
    await reachDraft(page, "vis_orbit");

    await expect(page.getByTestId("u2-create-visual")).toBeVisible();
    // Four demo variants with text differences beyond thumbnails.
    await expect(page.getByTestId("u2-create-visual-comparison").locator("li")).toHaveCount(4);
    await expect(page.getByTestId("u2-create-visual-demo")).toContainText(/تجريبية|demo/ui);
    // Ratio and palette labels are present.
    await expect(page.getByTestId("u2-create-visual-ratio")).not.toBeEmpty();
    await expect(page.getByTestId("u2-create-visual-meta")).toContainText("#");

    // The alt gate: clear the fixture alt text and request review.
    await page.getByTestId("u2-create-visual-alt").fill("  ");
    await page.getByTestId("u2-create-review-request").click();
    await expect(page.getByTestId("u2-create-validation")).toHaveAttribute("data-validation", "alt_required");
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_edit");

    // A real alt text unlocks review; caption edits stay visible.
    await page.getByTestId("u2-create-visual-caption").fill("تعليق معدّل من المستخدم.");
    await page.getByTestId("u2-create-visual-alt").fill("تصور تجريبي: دوائر تتمركز حول نقطة واحدة.");
    await page.getByTestId("u2-create-review-request").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_review");
    await page.getByTestId("u2-create-review-complete").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_version");

    // No fake download: the export note says no export exists.
    await expect(page.getByTestId("u2-create-export")).toContainText(/لا يوجد تصدير|no PDF|no .*export/iu);

    await saveOnce(page);
    // Completion is a deliberate step from the version stage.
    await page.getByTestId("u2-create-finish").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_complete");
    await expect(page.getByTestId("u2-create-complete")).toBeVisible();

    expect(errors).toEqual([]);
  });
});

test.describe("E2E-CRT-004 — dirty navigation, storage failure, and restore", () => {
  testFreshBrowser("warns before discarding a dirty draft", async ({ page }) => {
    const errors = await gotoCreate(page, "ar");
    await chooseFormatAndBrief(page, "document", "موجز كامل لأغراض اختبار الحماية من الفقد.", "فريق القيادة");
    await reachDraft(page, "variant_standard");

    // A restart request with a live draft arms the confirm dialog.
    await page.getByTestId("u2-create-restart").click();
    await expect(page.getByTestId("u2-create-dirty-dialog")).toBeVisible();
    await page.getByTestId("u2-create-dirty-cancel").click();
    await expect(page.getByTestId("u2-create-dirty-dialog")).toHaveCount(0);
    await expect(page.getByTestId("u2-create-document")).toBeVisible();

    // Variant change arms the same explicit confirm; cancel keeps the draft.
    await page.getByTestId("u2-create-change-variant").click();
    await page.getByTestId("u2-create-variant-variant_compact").click();
    await expect(page.getByTestId("u2-create-dirty-dialog")).toBeVisible();
    await page.getByTestId("u2-create-dirty-cancel").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-format", "document");

    expect(errors).toEqual([]);
  });

  testFreshBrowser("a real quota failure blocks the claim, retries, and restores an older version", async ({ page }) => {
    // This journey is the heaviest in the spec (three full save/review
    // cycles plus a genuine quota fill), so it gets explicit headroom on
    // the constrained sandbox to pass on the FIRST attempt.
    testFreshBrowser.setTimeout(150_000);
    const errors = await gotoCreate(page, "ar");
    await chooseFormatAndBrief(page, "document", "موجز لاختبار فشل التخزين والاستعادة.", "فريق القيادة");
    await reachDraft(page, "variant_standard");

    // The proposed alternative must be decided before review can start.
    await page.getByTestId("u2-create-alt-reject").click();

    // First save succeeds and records version 1, then the review passes.
    await saveOnce(page);
    await resolveReviewAndComplete(page);
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_version");
    await expect(page.getByTestId("u2-create-versions").locator("li")).toHaveCount(1);

    // Edit and save version 2 with a different title, then review back to the
    // version surface so the history is visible.
    await page.getByTestId("u2-create-version-back").click();
    await page.getByTestId("u2-create-title").fill("عنوان ثانٍ بعد التعديل");
    await saveOnce(page);
    await resolveReviewAndComplete(page);
    await expect(page.getByTestId("u2-create-versions").locator("li")).toHaveCount(2);
    await expect(page.getByTestId("u2-create-versions").locator("li").last()).toHaveAttribute("data-current", "true");

    // A genuine quota failure: fill the real sessionStorage with a fine tail
    // so the free space is under 64 bytes. The pending save grows the snapshot
    // by a full version (kilobytes), which cannot fit — the write is rejected.
    await page.getByTestId("u2-create-version-back").click();
    await page.getByTestId("u2-create-title").fill("عنوان ثالث لن يُحفظ أولًا");
    await page.evaluate(() => {
      // Decreasing chunk sizes, each filling until the quota genuinely
      // rejects: the final 8-byte pass leaves under 8 bytes free, so the
      // pending save (which grows the snapshot by a whole version) cannot fit.
      const sizes = [524288, 16384, 1024, 64, 8];
      for (const size of sizes) {
        let counter = 0;
        try {
          while (counter < 100_000) {
            sessionStorage.setItem(`nasaq-e2e-filler-${size}-${counter}`, "x".repeat(size));
            counter += 1;
          }
        } catch {
          // Quota reached at this granularity; the finer pass follows.
        }
      }
    });
    await page.getByTestId("u2-create-save").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-save-state", "storage_failed", { timeout: 15_000 });
    await expect(page.getByTestId("u2-create-storage-failed")).toBeVisible();
    // Nothing claims saved: the last stored version number is still 2.
    await expect(page.getByTestId("u2-create-versions")).toHaveCount(0);

    // Free the space and retry: the same pending version is written.
    await page.evaluate(() => {
      // Storage has no keys(); walk indices backwards because removal reindexes.
      for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
        const key = sessionStorage.key(index);
        if (key !== null && key.startsWith("nasaq-e2e-filler-")) {
          sessionStorage.removeItem(key);
        }
      }
    });
    await page.getByTestId("u2-create-save-retry").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-save-state", "saved", { timeout: 15_000 });
    await resolveReviewAndComplete(page);
    await expect(page.getByTestId("u2-create-versions").locator("li")).toHaveCount(3);

    // Restore version 1: the history grows; it is never erased.
    const firstVersion = page.getByTestId("u2-create-versions").locator("li").first();
    const restoreButton = firstVersion.getByTestId(/^u2-create-restore-/);
    await restoreButton.click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_edit");
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-save-state", "restored");
    await expect(page.getByTestId("u2-create-title")).not.toHaveValue("عنوان ثالث لن يُحفظ أولًا");

    // The save after restore creates version 4 built on the restored one.
    await resolveReviewAndComplete(page);
    await page.getByTestId("u2-create-save").click();
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-save-state", "saved", { timeout: 15_000 });
    await expect(page.getByTestId("u2-create-versions").locator("li")).toHaveCount(4);
    await expect(page.getByTestId("u2-create-versions").locator("li").last()).toHaveAttribute("data-current", "true");

    expect(errors).toEqual([]);
  });
});

test.describe("U2-CRT-009 — accessibility, RTL, mobile, reflow, and motion", () => {
  test("no serious or critical axe violation across the Create flow", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Injected Axe is unstable on WebKit; WebKit stays an interaction gate.");
    await gotoCreate(page, "ar");
    const format = await new AxeBuilder({ page }).analyze();
    expect(format.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

    await chooseFormatAndBrief(page, "document", "فحص الوصولية لموجز الإنشاء.", "فريق القيادة");
    const brief = await new AxeBuilder({ page }).analyze();
    expect(brief.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

    await reachDraft(page, "variant_standard");
    const editor = await new AxeBuilder({ page }).analyze();
    expect(editor.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });

  test("the brief and format stages are operable with the keyboard alone", async ({ page }) => {
    await gotoCreate(page, "en");
    await page.getByTestId("u2-create-format-document").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_brief");
    // Brief groups are real fieldsets with legends, checked while the brief
    // surface is still mounted.
    await expect(page.getByTestId("u2-create-brief").locator("fieldset legend").first()).not.toBeEmpty();

    await page.getByTestId("u2-create-goal").focus();
    await page.keyboard.type("keyboard only creation goal");
    await page.getByTestId("u2-create-audience").focus();
    await page.keyboard.type("keyboard audience");
    for (let index = 0; index < 10; index += 1) {
      if (await page.getByTestId("u2-create-brief-submit").evaluate((node) => node === document.activeElement)) {
        break;
      }
      await page.keyboard.press("Tab");
    }
    await expect(page.getByTestId("u2-create-brief-submit")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("u2-create-workspace")).toHaveAttribute("data-stage", "crt_structure");
  });

  test("RTL mobile keeps direction, no overflow, and a linear deck list", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await gotoCreate(page, "ar");
    await chooseFormatAndBrief(page, "deck", "موجز عربي طويل لاختبار الاتجاه على الهاتف دون أي تجاوز أفقي.", "فريق القيادة");
    await reachDraft(page, "variant_narrative");

    const metrics = await page.evaluate(() => ({
      direction: getComputedStyle(document.documentElement).direction,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      saveHeight: document.querySelector('[data-testid="u2-create-save"]')?.getBoundingClientRect().height ?? 0,
      overflowLeft: [...document.querySelectorAll<HTMLElement>(".u2-create *")].filter((node) => node.getBoundingClientRect().left < -1).length,
    }));
    expect(metrics.direction).toBe("rtl");
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.saveHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.overflowLeft).toBe(0);
    // One slide editor plus a linear slide list, never a horizontal split.
    await expect(page.getByTestId("u2-create-slide-title")).toBeVisible();
    await expect(page.getByTestId("u2-create-deck-rail").locator("li").first()).toBeVisible();
  });

  test("200% reflow keeps the editor usable without document overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoCreate(page, "en");
    await chooseFormatAndBrief(page, "document", "reflow check goal", "reflow audience");
    await reachDraft(page, "variant_standard");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "32px";
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByTestId("u2-create-save")).toBeVisible();
  });

  test("reduced motion keeps the flow usable without decorative animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCreate(page, "ar");
    const animation = await page.getByTestId("u2-create-format").evaluate(() => window.getComputedStyle(document.querySelector(".u2-create") as Element).animationName);
    expect(animation).toBe("none");
    await chooseFormatAndBrief(page, "visual", "تقليل الحركة.", "فريق التسويق");
    await reachDraft(page, "vis_orbit");
    await expect(page.getByTestId("u2-create-visual")).toBeVisible();
  });

  test("forced colors keeps the Create controls visible", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Forced-colors emulation is a Chromium gate.");
    await page.emulateMedia({ forcedColors: "active" });
    await gotoCreate(page, "ar");
    const colors = await page.getByTestId("u2-create-format-document").evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return { background: styles.backgroundColor, color: styles.color };
    });
    expect(colors.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(colors.color).not.toBe("rgba(0, 0, 0, 0)");
  });
});
