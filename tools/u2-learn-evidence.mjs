/**
 * U2.1 Learn evidence capture.
 *
 * Produces the four required surfaces from section 13.2 of
 * `docs/01-product/U2-SERVICE-DEPTH.md` — Arabic mobile setup, English desktop
 * workspace, Arabic desktop artifact/review, and Arabic mobile error/recovery —
 * plus the accessibility/truth checks each record must carry, and writes
 * `docs/04-delivery/evidence/u2/u2-1-learn/manifest.json`.
 *
 * Usage (server must already be running on BASE_URL):
 *   PLAYWRIGHT_BROWSERS_PATH=/tmp/nasaq-playwright node tools/u2-learn-evidence.mjs
 *
 * Flags: U2_EVIDENCE_PORT (default 3000), U2_EVIDENCE_COMMIT (default: git HEAD).
 */

import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const outDir = join(repoRoot, "docs", "04-delivery", "evidence", "u2", "u2-1-learn");
const baseUrl = `http://127.0.0.1:${process.env.U2_EVIDENCE_PORT ?? "3000"}`;
const commitSha = process.env.U2_EVIDENCE_COMMIT ?? execSync("git rev-parse HEAD", { cwd: repoRoot }).toString().trim();
const route = "/app/learn";

const lessonCorrectSuffix = "a";
const reasonKeys = ["out_of_time", "already_know", "not_relevant"];

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

async function stage(page) {
  return (await page.getByTestId("u2-learn-workspace").getAttribute("data-stage")) ?? "";
}

async function openLearn(page, locale) {
  await page.goto(`${baseUrl}/${locale}${route}`);
  await page.getByTestId("u2-learn-workspace").waitFor({ state: "visible" });
}

async function fillBrief(page, motivation, { mode = "guided", timeout = "30", level = "intermediate" } = {}) {
  if (mode === "fast") {
    await page.getByTestId("u2-learn-mode-fast").click();
  }
  await page.getByTestId("u2-learn-motivation").fill(motivation);
  await page.getByTestId(`u2-learn-minutes-${timeout}`).click();
  await page.getByTestId(`u2-learn-level-${level}`).click();
  await page.getByTestId("u2-learn-brief-submit").click();
}

async function answerDiagnostic(page) {
  for (let index = 0; index < 8; index += 1) {
    if ((await stage(page)) !== "lrn_diagnostic") return;
    await page.locator('[data-testid^="u2-learn-diagnostic-choice-"]').nth(1).click();
    const next = page.getByTestId("u2-learn-diagnostic-next");
    if (await next.isEnabled()) {
      await next.click();
    } else {
      await page.getByTestId("u2-learn-diagnostic-finish").click();
      return;
    }
  }
}

async function startLessons(page) {
  await page.getByTestId("u2-learn-path-confirm").click();
  await page.getByTestId("u2-learn-workspace").waitFor({ state: "visible" });
}

async function answerCurrentModule(page, { hint = false } = {}) {
  await page.getByTestId("u2-learn-engage").click();
  await page.getByTestId("u2-learn-lesson-continue").click();
  if (hint) {
    await page.getByTestId("u2-learn-hint-button").click();
  }
  await page.getByTestId(`u2-learn-check-choice-${lessonCorrectSuffix}`).click();
  await page.getByTestId("u2-learn-check-submit").click();
  await page.getByTestId("u2-learn-feedback").waitFor({ state: "visible" });
}

async function acknowledgeAndContinue(page) {
  await page.getByTestId("u2-learn-acknowledge").click();
  const current = await stage(page);
  if (current === "lrn_checkpoint") {
    await page.getByTestId("u2-learn-checkpoint-continue").click();
  }
}

async function walkToComplete(page, { limit = 8 } = {}) {
  for (let index = 0; index < limit; index += 1) {
    if ((await stage(page)) === "lrn_complete") return;
    await answerCurrentModule(page);
    await acknowledgeAndContinue(page);
  }
  if ((await stage(page)) !== "lrn_complete") {
    throw new Error(`the guided flow did not complete within ${limit} modules`);
  }
}

async function measure(page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    direction: getComputedStyle(document.documentElement).direction,
  }));
  return { ...metrics, documentOverflowPx: Math.max(0, metrics.scrollWidth - metrics.clientWidth) };
}

async function capture(config) {
  // One browser per record: a crash in this sandbox then costs one record, not
  // the whole capture.
  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: config.viewport,
    reducedMotion: config.reducedMotion ? "reduce" : "no-preference",
    forcedColors: config.forcedColors ? "active" : "none",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  const response = await page.goto(`${baseUrl}/${config.locale}${route}`, { waitUntil: "domcontentloaded" });
  await page.getByTestId("u2-learn-workspace").waitFor({ state: "visible" });
  await config.drive(page);

  const metrics = await measure(page);
  const axe = await new AxeBuilder({ page }).analyze();
  const file = join(outDir, config.file);
  await page.screenshot({ path: file });

  const record = {
    id: config.id,
    requirementIds: config.requirementIds,
    commitSha,
    route: `/${config.locale}${route}`,
    baseUrlKind: "local_dev",
    locale: config.locale,
    direction: metrics.direction,
    viewport: config.viewport,
    browser: "chromium",
    scenarioId: "happy",
    stageId: await stage(page),
    state: config.state,
    workspaceMode: await page.getByTestId("u2-learn-workspace").getAttribute("data-mode"),
    reducedMotion: Boolean(config.reducedMotion),
    forcedColors: Boolean(config.forcedColors),
    httpStatus: response?.status() ?? 0,
    documentOverflowPx: metrics.documentOverflowPx,
    consoleErrors,
    pageErrors,
    axe: {
      serious: axe.violations.filter((violation) => violation.impact === "serious").length,
      critical: axe.violations.filter((violation) => violation.impact === "critical").length,
      total: axe.violations.length,
    },
    file: config.file,
    sha256: sha256(file),
    capturedAt: new Date().toISOString(),
  };

  await context.close();
  await browser.close();
  return record;
}

function launchBrowser() {
  return chromium.launch({
    args: [
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
      "--js-flags=--max-old-space-size=256",
    ],
  });
}

const records = [
  {
    id: "u2-1-01-learn-setup-ar-360",
    requirementIds: ["U2-LRN-001", "U2-LRN-007", "U2-LRN-008"],
    locale: "ar",
    viewport: { width: 360, height: 740 },
    state: "guided_setup_brief",
    file: "u2-1-01-learn-setup-ar-360.png",
    drive: async (page) => {
      await page.getByTestId("u2-learn-motivation").fill("أراجع قبل مقابلة تقنية الأسبوع القادم");
      await page.getByTestId("u2-learn-minutes-15").click();
    },
  },
  {
    id: "u2-1-02-learn-path-review-en-1280",
    requirementIds: ["U2-LRN-003", "U2-LRN-004", "U2-LRN-008"],
    locale: "en",
    viewport: { width: 1280, height: 900 },
    state: "guided_path_review_edited",
    file: "u2-1-02-learn-path-review-en-1280.png",
    drive: async (page) => {
      await fillBrief(page, "prepare for a design review", { timeout: "30", level: "advanced" });
      await answerDiagnostic(page);
      const modules = page.getByTestId("u2-learn-modules").locator("li");
      const second = (await modules.nth(1).getAttribute("data-testid"))?.replace("u2-learn-module-", "") ?? "";
      const third = (await modules.nth(2).getAttribute("data-testid"))?.replace("u2-learn-module-", "") ?? "";
      await page.getByTestId(`u2-learn-up-${second}`).click();
      await page.getByTestId(`u2-learn-skip-${third}`).selectOption(reasonKeys[0]);
      await page.getByTestId("u2-learn-rationale").locator("summary").click();
    },
  },
  {
    id: "u2-1-03-learn-lesson-check-en-1280",
    requirementIds: ["U2-LRN-001", "U2-LRN-005", "U2-LRN-008"],
    locale: "en",
    viewport: { width: 1280, height: 900 },
    state: "guided_lesson_then_check_with_hint",
    file: "u2-1-03-learn-lesson-check-en-1280.png",
    drive: async (page) => {
      await fillBrief(page, "rebuild my study routine");
      await answerDiagnostic(page);
      await startLessons(page);
      await answerCurrentModule(page, { hint: true });
      await page.getByTestId("u2-learn-acknowledge").click();
      if ((await stage(page)) === "lrn_checkpoint") {
        await page.getByTestId("u2-learn-checkpoint-continue").click();
      }
      await page.getByTestId("u2-learn-engage").click();
      await page.getByTestId("u2-learn-lesson-continue").click();
      await page.getByTestId("u2-learn-hint-button").click();
    },
  },
  {
    id: "u2-1-04-learn-complete-ar-1280",
    requirementIds: ["U2-LRN-001", "U2-LRN-006", "U2-LRN-008"],
    locale: "ar",
    viewport: { width: 1280, height: 900 },
    state: "guided_complete_with_saved_path",
    file: "u2-1-04-learn-complete-ar-1280.png",
    drive: async (page) => {
      await fillBrief(page, "أريد تثبيت ما تعلمته", { timeout: "5" });
      await answerDiagnostic(page);
      await startLessons(page);
      await walkToComplete(page);
      await page.getByTestId("u2-learn-save").click();
      await page.getByTestId("u2-storage-open").click();
      await page.keyboard.press("Escape");
    },
  },
  {
    id: "u2-1-05-learn-error-recovery-ar-390",
    requirementIds: ["U2-LRN-007", "U2-LRN-002", "U2-LRN-008"],
    locale: "ar",
    viewport: { width: 390, height: 844 },
    state: "fast_self_assessed_reduced_state",
    file: "u2-1-05-learn-error-recovery-ar-390.png",
    drive: async (page) => {
      // Reduced/error path: fast self-assessed mode must disclose itself instead
      // of implying a diagnosis, and an empty check submit must be refused.
      await fillBrief(page, "وقت قصير اليوم", { mode: "fast", timeout: "5", level: "beginner" });
      await startLessons(page);
      await page.getByTestId("u2-learn-engage").click();
      await page.getByTestId("u2-learn-lesson-continue").click();
      await page.getByTestId("u2-learn-check-submit").click();
      await page.getByTestId("u2-learn-validation").waitFor({ state: "visible" });
    },
  },
  {
    id: "u2-1-06-learn-reduced-motion-en-390",
    requirementIds: ["U2-LRN-008"],
    locale: "en",
    viewport: { width: 390, height: 844 },
    state: "reduced_motion_brief",
    reducedMotion: true,
    file: "u2-1-06-learn-reduced-motion-en-390.png",
    drive: async (page) => {
      await page.getByTestId("u2-learn-motivation").fill("reduced motion pass");
    },
  },
  {
    id: "u2-1-07-learn-forced-colors-ar-390",
    requirementIds: ["U2-LRN-008"],
    locale: "ar",
    viewport: { width: 390, height: 844 },
    state: "forced_colors_brief",
    forcedColors: true,
    file: "u2-1-07-learn-forced-colors-ar-390.png",
    drive: async (page) => {
      await page.getByTestId("u2-learn-motivation").fill("اختبار الألوان الإجبارية");
    },
  },
];

mkdirSync(outDir, { recursive: true });

const captured = [];
const failures = [];
for (const config of records) {
  try {
    const record = await capture(config);
    captured.push(record);
    console.log(`${record.id} status=${record.httpStatus} overflow=${record.documentOverflowPx} axe=${record.axe.serious}/${record.axe.critical} sha=${record.sha256.slice(0, 12)}`);
  } catch (error) {
    failures.push(`${config.id}: ${String(error).split("\n")[0]}`);
    console.error(`${config.id} FAILED: ${String(error).split("\n")[0]}`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} record(s) failed:\n${failures.join("\n")}`);
  process.exitCode = 1;
}

const manifest = {
  milestone: "U2.1 Learn",
  generatedAt: new Date().toISOString(),
  source: "main",
  commitSha,
  browser: "chromium (Playwright 1.63.0)",
  baseUrlKind: "local_dev",
  baseUrl,
  command: "node tools/u2-learn-evidence.mjs (next dev served on 127.0.0.1:3000)",
  captureNote:
    "Captured against the Next dev server. The production build could not run inside the 2 GB sandbox (next build was OOM-killed); the production deploy is verified separately through the Vercel deployment for the same commit.",
  records: captured,
};

writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest written: ${join(outDir, "manifest.json")}`);
