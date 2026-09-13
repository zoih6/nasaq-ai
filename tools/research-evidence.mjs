import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const outDir = join(repoRoot, "docs", "04-delivery", "evidence", "u2", "u2-2-research");
const baseUrl = `http://127.0.0.1:${process.env.U2_EVIDENCE_PORT ?? "3000"}`;
const commitSha = process.env.U2_EVIDENCE_COMMIT ?? execSync("git rev-parse HEAD", { cwd: repoRoot }).toString().trim();
const route = "/app/research";

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

async function stage(page) {
  return (await page.getByTestId("u2-research-workspace").getAttribute("data-stage")) ?? "";
}

async function openResearch(page, locale) {
  const response = await page.goto(`${baseUrl}/${locale}${route}`, { waitUntil: "domcontentloaded" });
  await page.getByTestId("u2-research-workspace").waitFor({ state: "visible" });
  await page.getByTestId("u2-research-workspace").waitFor({ state: "attached" });
  return response;
}

async function fillBrief(page, question, decision) {
  await page.getByTestId("u2-research-question").fill(question);
  await page.getByTestId("u2-research-decision").fill(decision);
  await page.getByTestId("u2-research-brief-submit").click();
}

async function answerClarify(page) {
  for (let index = 0; index < 4; index += 1) {
    if ((await stage(page)) !== "rsh_clarify") return;
    await page.getByTestId("u2-research-clarify-default").click();
    const next = page.getByTestId("u2-research-clarify-next");
    if (await next.isEnabled()) await next.click();
    else {
      await page.getByTestId("u2-research-clarify-finish").click();
      return;
    }
  }
}

async function approveWidePlan(page) {
  await page.getByTestId("u2-research-type-academic_paper").click();
  await page.getByTestId("u2-research-type-blog").click();
  await page.getByTestId("u2-research-type-archived_page").click();
  await page.getByTestId("u2-research-plan-approve").click();
}

async function playActivity(page) {
  for (let index = 0; index < 40; index += 1) {
    if ((await stage(page)) === "rsh_source_review") return;
    await page.getByTestId("u2-research-activity-next").click();
  }
  throw new Error(`activity did not complete; stage=${await stage(page)}`);
}

async function measure(page) {
  return await page.evaluate(() => {
    const metrics = {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      direction: getComputedStyle(document.documentElement).direction,
    };
    return { ...metrics, documentOverflowPx: Math.max(0, metrics.scrollWidth - metrics.clientWidth) };
  });
}

async function launchBrowser() {
  return chromium.launch({
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? "/usr/bin/chromium",
    args: ["--disable-dev-shm-usage", "--disable-gpu", "--no-sandbox", "--single-process", "--no-zygote", "--js-flags=--max-old-space-size=256"],
  });
}

async function capture(config) {
  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: config.viewport,
    reducedMotion: config.reducedMotion ? "reduce" : "no-preference",
    forcedColors: config.forcedColors ? "active" : "none",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  const response = await openResearch(page, config.locale);
  await config.drive(page);
  const metrics = await measure(page);
  const axe = await new AxeBuilder({ page }).analyze();
  const file = join(outDir, config.file);
  await page.screenshot({ path: file, fullPage: true });
  const record = {
    id: config.id,
    requirementIds: config.requirementIds,
    commitSha,
    route: `/${config.locale}${route}`,
    baseUrlKind: "local_dev",
    locale: config.locale,
    direction: metrics.direction,
    viewport: config.viewport,
    browser: "system chromium",
    stageId: await stage(page),
    state: config.state,
    reducedMotion: Boolean(config.reducedMotion),
    forcedColors: Boolean(config.forcedColors),
    httpStatus: response?.status() ?? 0,
    documentOverflowPx: metrics.documentOverflowPx,
    consoleErrors,
    pageErrors,
    axe: {
      serious: axe.violations.filter((v) => v.impact === "serious").length,
      critical: axe.violations.filter((v) => v.impact === "critical").length,
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

const records = [
  {
    id: "u2-2-01-research-setup-ar-390",
    requirementIds: ["U2-RSH-001", "U2-RSH-010"],
    locale: "ar", viewport: { width: 390, height: 844 }, state: "brief_setup", file: "u2-2-01-research-setup-ar-390.png",
    drive: async (page) => { await page.getByTestId("u2-research-question").fill("ما أثر تقليل زمن الانتظار على رضا العملاء؟"); },
  },
  {
    id: "u2-2-02-research-plan-en-1280",
    requirementIds: ["U2-RSH-001", "U2-RSH-002", "U2-RSH-010"],
    locale: "en", viewport: { width: 1280, height: 900 }, state: "plan_review", file: "u2-2-02-research-plan-en-1280.png",
    drive: async (page) => { await fillBrief(page, "How does waiting time affect satisfaction?", "Should we invest in support?"); await answerClarify(page); await page.getByTestId("u2-research-plan-rationale").locator("summary").click(); },
  },
  {
    id: "u2-2-03-research-sources-ar-1280",
    requirementIds: ["U2-RSH-003", "U2-RSH-004", "U2-RSH-006", "U2-RSH-009"],
    locale: "ar", viewport: { width: 1280, height: 900 }, state: "source_review", file: "u2-2-03-research-sources-ar-1280.png",
    drive: async (page) => { await fillBrief(page, "ما أثر تقليل زمن الانتظار على رضا العملاء؟", "قرار مدعوم بالمصادر."); await answerClarify(page); await approveWidePlan(page); await playActivity(page); await page.getByTestId("u2-research-citation-evd_report_wait_drop").click(); },
  },
  {
    id: "u2-2-04-research-claims-en-1280",
    requirementIds: ["U2-RSH-004", "U2-RSH-005", "U2-RSH-008"],
    locale: "en", viewport: { width: 1280, height: 900 }, state: "claim_matrix", file: "u2-2-04-research-claims-en-1280.png",
    drive: async (page) => { await fillBrief(page, "How did shorter waiting times affect satisfaction?", "Should we hire more support?"); await answerClarify(page); await approveWidePlan(page); await playActivity(page); await page.getByTestId("u2-research-sources-continue").click(); },
  },
  {
    id: "u2-2-05-research-report-ar-390",
    requirementIds: ["U2-RSH-007", "U2-RSH-009", "U2-RSH-010"],
    locale: "ar", viewport: { width: 390, height: 844 }, state: "report_edit", file: "u2-2-05-research-report-ar-390.png",
    reducedMotion: true,
    drive: async (page) => { await fillBrief(page, "ما أثر تقليل زمن الانتظار؟", "هل نحتاج فريق دعم إضافي؟"); await answerClarify(page); await approveWidePlan(page); await playActivity(page); await page.getByTestId("u2-research-sources-continue").click(); await page.getByTestId("u2-research-acknowledge-clm_retention_link").click(); await page.getByTestId("u2-research-resolve-clm_csat_up").click(); await page.getByTestId("u2-research-claims-continue").click(); },
  },
];

mkdirSync(outDir, { recursive: true });
const captured = [];
const failures = [];
for (const config of records) {
  try { const record = await capture(config); captured.push(record); console.log(`${record.id} status=${record.httpStatus} stage=${record.stageId} overflow=${record.documentOverflowPx} axe=${record.axe.serious}/${record.axe.critical}`); }
  catch (error) { failures.push(`${config.id}: ${String(error).split("\n")[0]}`); console.error(`${config.id} FAILED: ${String(error).split("\n")[0]}`); }
}
const manifest = {
  milestone: "U2.2 Research",
  generatedAt: new Date().toISOString(),
  source: "main",
  commitSha,
  browser: "system chromium via Playwright",
  baseUrlKind: "local_dev",
  baseUrl,
  command: "node tools/research-evidence.mjs (Next dev served on 127.0.0.1:3000)",
  captureNote: "Local deterministic Research simulation. network/provider/backend claims remain simulated and must not be read as live search evidence.",
  failures,
  records: captured,
};
writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest written: ${join(outDir, "manifest.json")}`);
if (failures.length > 0) process.exitCode = 1;
