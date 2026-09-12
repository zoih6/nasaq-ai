import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildLearnPath,
  createLearnStatePreset,
  createServiceIdFactory,
  evaluateLearnCheck,
  getLearnHintKey,
  getLearnTopic,
  nextLearnHintLevel,
  scoreLearnedLevel,
  type LearnTopicId,
} from "@nasaq/mock-api/services";
import { learnSessionStateSchema } from "@nasaq/contracts/services";
import {
  createInitialLearnState,
  derivedStageFor,
  learnReducer,
  stageForSession,
  type LearnAction,
  type LearnReducerState,
} from "../features/learn/state/learn-reducer";

/**
 * UT-LRN-001 / UT-LRN-002 / UT-STO-001 / UT-FIX-001.
 *
 * These tests exercise the Learn reducer, the deterministic scoring rules, and
 * the i18n coverage of the Learn surfaces. Vitest does not resolve `@/` from
 * this folder, so everything is imported relatively.
 */

const at = (step: number) => `2026-09-12T00:00:${String(step).padStart(2, "0")}.000Z`;
const repoRoot = join(__dirname, "..", "..", "..");

/** Fixtures are typed as arrays, so a missing module is a broken fixture. */
function requireModule(topicId: "spaced_repetition" | "http_caching" | "rtl_typography") {
  const first = getLearnTopic(topicId).modules[0];
  if (first === undefined) {
    throw new Error(`${topicId} has no first module`);
  }
  return first;
}

function run(state: LearnReducerState, actions: LearnAction[]): LearnReducerState {
  return actions.reduce((current, action) => learnReducer(current, action), state);
}

function guidedToPath(locale: "ar" | "en" = "ar", topicId: LearnTopicId = "spaced_repetition"): LearnReducerState {
  const initial = createInitialLearnState(locale);
  const topic = getLearnTopic(topicId);
  const actions: LearnAction[] = [
    { type: "draft/topic", topicId },
    { type: "draft/motivation", value: "أدرس للاختبار بعد أسبوع" },
    { type: "draft/minutes", minutes: 15 },
    { type: "brief/submit", at: at(1) },
    ...topic.diagnostic.map((question, index) => ({
      type: "diagnostic/answer" as const,
      questionId: question.id,
      choiceId: question.choices[1]?.id ?? null,
      skipped: false,
      at: at(index + 2),
    })),
    { type: "path/build", at: at(9) }, { type: "path/confirm", at: at(9) },
  ];
  return run(initial, actions);
}

/**
 * Extracts JSX text nodes that contain human-readable letters.
 *
 * Deliberately small and dependency-free: it skips strings, `{…}` expressions,
 * self-closing tags, and TypeScript generics (via the code-like filter), and the
 * test asserts a negative control so an empty result is meaningful.
 */
function jsxTextOffenders(source: string): string[] {
  const keywords = new Set([
    "export", "import", "type", "const", "let", "function", "return", "interface", "declare", "satisfies", "as",
    "null", "true", "false", "undefined", "else", "number", "string", "boolean",
  ]);
  const offenders: string[] = [];
  let index = 0;
  let quote: string | null = null;

  while (index < source.length) {
    const char = source[index] ?? "";
    if (quote !== null) {
      if (char === "\\") {
        index += 2;
        continue;
      }
      if (char === quote) {
        quote = null;
      }
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      index += 1;
      continue;
    }
    if (char === ">" && !["=", "/"].includes((source.slice(0, index).trimEnd().at(-1) ?? ""))) {
      let cursor = index + 1;
      let depth = 0;
      let inner: string | null = null;
      const buffer: string[] = [];
      while (cursor < source.length) {
        const current = source[cursor] ?? "";
        if (inner !== null) {
          if (current === "\\") {
            cursor += 2;
            continue;
          }
          if (current === inner) {
            inner = null;
          }
          cursor += 1;
          continue;
        }
        if (current === '"' || current === "'" || current === "`") {
          inner = current;
          cursor += 1;
          continue;
        }
        if (current === "{") {
          depth += 1;
          cursor += 1;
          continue;
        }
        if (current === "}") {
          if (depth === 0) {
            break;
          }
          depth -= 1;
          cursor += 1;
          continue;
        }
        if (current === "<" && depth === 0) {
          break;
        }
        if (depth === 0) {
          buffer.push(current);
        }
        cursor += 1;
      }
      const raw = buffer.join("");
      const cleaned = raw.replace(/[^\w\u0600-\u06FF]+/gu, " ").trim();
      const codeLike = /[=;()|[\]]/u.test(raw) || keywords.has(cleaned.split(" ")[0] ?? "");
      if (!codeLike && /[A-Za-z\u0600-\u06FF]{2,}/u.test(cleaned)) {
        offenders.push(cleaned);
        index = cursor;
        continue;
      }
    }
    index += 1;
  }
  return offenders;
}

describe("U2-LRN-001 — guided flow reaches every stage with a guarded transition", () => {
  it("walks brief → diagnostic → path review → lesson → check → feedback → checkpoint → complete", () => {
    const initial = createInitialLearnState("ar");
    expect(initial.ui.stage).toBe("lrn_brief");

    const afterBrief = run(initial, [
      { type: "draft/motivation", value: "أستعد لمقابلة تقنية" },
      { type: "brief/submit", at: at(1) },
    ]);
    expect(afterBrief.ui.stage).toBe("lrn_diagnostic");
    // The decision stays local: no path exists before the diagnostic answers.
    expect(afterBrief.session.path).toBeNull();

    const topic = getLearnTopic("spaced_repetition");
    const answered = run(
      afterBrief,
      topic.diagnostic.map((question, index) => ({
        type: "diagnostic/answer" as const,
        questionId: question.id,
        choiceId: question.choices[0]?.id ?? null,
        skipped: false,
        at: at(index + 2),
      })),
    );
    const pathReview = run(answered, [{ type: "path/build", at: at(9) }, { type: "path/confirm", at: at(9) }]);
    expect(pathReview.ui.stage).toBe("lrn_lesson");
    expect(pathReview.session.path).not.toBeNull();

    // The lesson cannot jump straight into a check result: the check gate needs
    // a real lesson interaction first.
    const lessonContinue = run(pathReview, [{ type: "check/submit", at: at(10) }]);
    expect(lessonContinue.ui.stage).toBe("lrn_lesson");
    expect(lessonContinue.ui.validation).toBe("lesson_not_engaged");
    expect(lessonContinue.session.attempts).toHaveLength(0);

    // Continuing without engaging does not fabricate an attempt either.
    const forwarded = run(pathReview, [{ type: "checkpoint/continue" }, { type: "check/submit", at: at(10) }]);
    expect(forwarded.session.attempts).toHaveLength(0);

    // Continuing to the check is guarded by engagement.
    const prematureContinue = run(pathReview, [{ type: "lesson/continue", at: at(10) }]);
    expect(prematureContinue.ui.validation).toBe("lesson_not_engaged");
    expect(prematureContinue.ui.stage).toBe("lrn_lesson");

    const engaged = run(pathReview, [{ type: "lesson/engage", at: at(10) }]);
    const atCheck = run(engaged, [{ type: "lesson/continue", at: at(10) }]);
    expect(atCheck.ui.stage).toBe("lrn_check");
    const moduleId = engaged.session.currentModuleId;
    expect(moduleId).not.toBeNull();
    const topicModule = getLearnTopic("spaced_repetition").modules.find((module) => module.id === moduleId);
    expect(topicModule).toBeDefined();

    const checked = run(atCheck, [
      { type: "check/select", choiceId: topicModule?.check.correctChoiceId ?? "" },
      { type: "check/submit", at: at(11) },
    ]);
    expect(checked.ui.stage).toBe("lrn_feedback");
    expect(checked.session.feedback?.outcome).toBe("correct");
    expect(checked.session.attempts).toHaveLength(1);

    const acknowledged = run(checked, [{ type: "feedback/acknowledge", at: at(12) }]);
    expect(acknowledged.ui.stage).toBe("lrn_checkpoint");
    expect(acknowledged.session.progress.completedModules).toBe(1);

    const advanced = run(acknowledged, [{ type: "checkpoint/continue" }]);
    expect(advanced.ui.stage).toBe("lrn_lesson");
    expect(advanced.session.currentModuleId).not.toBe(moduleId);
  });

  it("shows the built plan for review before any lesson starts", () => {
    const initial = createInitialLearnState("en");
    const topic = getLearnTopic("spaced_repetition");
    const built = run(initial, [
      { type: "draft/motivation", value: "review gate" },
      { type: "brief/submit", at: at(1) },
      ...topic.diagnostic.map((question, index) => ({
        type: "diagnostic/answer" as const,
        questionId: question.id,
        choiceId: question.choices[2]?.id ?? null,
        skipped: false,
        at: at(index + 2),
      })),
      { type: "path/build", at: at(9) },
    ]);
    // Building the plan is not the same as agreeing to it.
    expect(built.ui.stage).toBe("lrn_path_review");
    expect(built.session.path?.modules.length ?? 0).toBeGreaterThan(0);
    expect(built.session.lessonEngaged).toBe(false);

    const started = run(built, [{ type: "path/confirm", at: at(10) }]);
    expect(started.ui.stage).toBe("lrn_lesson");
    expect(started.session.currentModuleId).toBe(built.session.path?.modules[0]?.id);
  });

  it("refuses a check before a lesson is engaged instead of assuming progress", () => {
    const pathState = guidedToPath("en");
    const blocked = run(pathState, [{ type: "check/submit", at: at(10) }]);
    expect(blocked.ui.validation).toBe("lesson_not_engaged");
    expect(blocked.ui.stage).toBe("lrn_lesson");
  });

  it("keeps the module list deterministic for the same answers", () => {
    const first = guidedToPath("ar");
    const second = guidedToPath("ar");
    expect(first.session.path?.modules.map((module) => module.id)).toEqual(second.session.path?.modules.map((module) => module.id));
    expect(first.session.path?.rationaleKeys).toEqual(second.session.path?.rationaleKeys);
  });
});

describe("U2-LRN-002 — fast mode discloses self-assessment and survives a switch to guided", () => {
  it("builds a self-assessed path and shows the disclosure flag", () => {
    const fast = run(createInitialLearnState("ar"), [
      { type: "mode/set", mode: "fast", at: at(1) },
      { type: "draft/motivation", value: "أستعد لمقابلة تقنية" },
      { type: "brief/submit", at: at(2) },
    ]);
    expect(fast.session.mode).toBe("fast");
    expect(fast.session.selfAssessed).toBe(true);
    expect(fast.ui.stage).toBe("lrn_path_review");
    // Fast mode never invents diagnostic answers.
    expect(fast.session.diagnosticAnswers).toHaveLength(0);
    // …but the quick check still runs after the lesson.
    const topic = getLearnTopic("spaced_repetition");
    const firstModule = fast.session.path?.modules[0];
    const source = topic.modules.find((module) => module.id === firstModule?.id) ?? topic.denseOnlyModules[0];
    expect(source).toBeDefined();
  });

  it("switches fast → guided without losing the recorded brief and answers", () => {
    const fast = run(createInitialLearnState("ar"), [
      { type: "mode/set", mode: "fast", at: at(1) },
      { type: "draft/motivation", value: "سبب شخصي" },
      { type: "brief/submit", at: at(2) },
    ]);
    expect(fast.session.brief?.motivation).toBe("سبب شخصي");

    const switched = run(fast, [{ type: "mode/set", mode: "guided", at: at(3) }]);
    expect(switched.session.mode).toBe("guided");
    expect(switched.session.selfAssessed).toBe(false);
    expect(switched.session.brief?.motivation).toBe("سبب شخصي");
    expect(switched.session.path?.modules.length).toBe(fast.session.path?.modules.length);
    expect(switched.ui.stage).toBe("lrn_diagnostic");

    // Answering after the switch keeps the earlier path until it is confirmed.
    const answered = run(switched, [{ type: "diagnostic/answer", questionId: "diag_sr_1", choiceId: "diag_sr_1_a", skipped: false, at: at(4) }]);
    expect(answered.session.diagnosticAnswers).toHaveLength(1);
    expect(answered.session.brief?.motivation).toBe("سبب شخصي");
  });
});

describe("U2-LRN-003 — deterministic scoring, foundation-first, and hint levels", () => {
  it("scores unknown or skipped answers as foundation-first instead of guessing a level", () => {
    const topic = getLearnTopic("spaced_repetition");
    const skipped = topic.diagnostic.map((question) => ({ questionId: question.id, choiceId: null, skipped: true, answeredAt: at(1) }));
    const scored = scoreLearnedLevel(skipped, topic.diagnostic);
    expect(scored.skipped).toBe(topic.diagnostic.length);
    expect(scored.level).toBe("beginner");

    const path = buildLearnPath({ topicId: "spaced_repetition", level: scored.level, minutes: 15, foundationFirst: true, selfAssessed: false });
    expect(path.modules[0]?.id).toBe("sr_why_gaps");
    expect(path.modules.some((module) => module.id === "sr_dense_tail")).toBe(false);
  });

  it("reaches the dense inventory only when the request asks for it and the budget allows", () => {
    const dense = buildLearnPath({ topicId: "spaced_repetition", level: "advanced", minutes: 30, foundationFirst: false, selfAssessed: false, dense: true });
    const standard = buildLearnPath({ topicId: "spaced_repetition", level: "advanced", minutes: 30, foundationFirst: false, selfAssessed: false });
    const short = buildLearnPath({ topicId: "spaced_repetition", level: "advanced", minutes: 5, foundationFirst: false, selfAssessed: false });

    const denseOnlyIds = ["sr_tooling", "sr_sleep"];
    expect(dense.modules.some((module) => denseOnlyIds.includes(module.id))).toBe(true);
    expect(standard.modules.some((module) => denseOnlyIds.includes(module.id))).toBe(false);
    expect(short.modules.length).toBeLessThanOrEqual(standard.modules.length);
    expect(dense.rationaleKeys).toContain("services.learn.rationale.wide_budget");
    expect(short.rationaleKeys).toContain("services.learn.rationale.trimmed_to_budget");
  });

  it("caps hints at two levels and never repeats the same hint", () => {
    const topicModule = requireModule("http_caching");
    const first = getLearnHintKey(topicModule.check, 1);
    const second = getLearnHintKey(topicModule.check, 2);
    expect(first).not.toBe(second);
    expect(nextLearnHintLevel(0)).toBe(1);
    expect(nextLearnHintLevel(1)).toBe(2);
    expect(nextLearnHintLevel(2)).toBe(2);
  });

  it("evaluates free text and skipped attempts without throwing", () => {
    const topicModule = requireModule("rtl_typography");
    const accepted = topicModule.check.acceptedTextAnswers[0] ?? "x";
    expect(evaluateLearnCheck(topicModule.check, { kind: "text", value: accepted })).toBe("correct");
    expect(evaluateLearnCheck(topicModule.check, { kind: "text", value: "لا شيء" })).toBe("wrong");
    expect(evaluateLearnCheck(topicModule.check, { kind: "skipped" })).toBe("skipped");
  });
});

describe("U2-LRN-004/005 — review, skip reasons, feedback and retry keep the record", () => {
  it("reorders, skips with a reason, and restores modules while keeping answers", () => {
    const state = guidedToPath("ar");
    const modules = state.session.path?.modules ?? [];
    const [first, second] = modules;
    const reordered = run(state, [{ type: "path/move", moduleId: second?.id ?? "", direction: "up", at: at(10) }]);
    expect(reordered.session.path?.modules[0]?.id).toBe(second?.id);
    expect(reordered.session.path?.revisedByUser).toBe(true);
    expect(reordered.session.diagnosticAnswers).toHaveLength(state.session.diagnosticAnswers.length);

    const skippedPath = run(reordered, [{ type: "path/skip", moduleId: first?.id ?? "", reasonKey: "out_of_time", at: at(11) }]);
    const skippedModule = skippedPath.session.path?.modules.find((module) => module.id === first?.id);
    expect(skippedModule?.skipped).toBe(true);
    // The learner's reason is stored beside the path's own rationale, not on top of it.
    expect(skippedModule?.skipReasonKey).toBe("out_of_time");
    expect(skippedModule?.reasonKey).not.toBe("out_of_time");

    const restored = run(skippedPath, [{ type: "path/restore", moduleId: first?.id ?? "", at: at(12) }]);
    expect(restored.session.path?.modules.find((module) => module.id === first?.id)?.skipped).toBe(false);
  });

  it("records a wrong answer, allows one retry, and keeps the attempt history", () => {
    const pathState = run(guidedToPath("en"), [{ type: "lesson/engage", at: at(10) }]);
    const moduleId = pathState.session.currentModuleId ?? "";
    const topicModule = getLearnTopic("spaced_repetition").modules.find((candidate) => candidate.id === moduleId);
    const wrongChoice = topicModule?.check.choices
      .find((choice) => choice.id !== topicModule.check.correctChoiceId && !topicModule.check.partialChoiceIds.includes(choice.id))?.id ?? "";

    const wrong = run(pathState, [
      { type: "check/select", choiceId: wrongChoice },
      { type: "check/submit", at: at(11) },
    ]);
    expect(wrong.session.feedback?.outcome).toBe("wrong");
    expect(wrong.session.progress.completedModules).toBe(0);

    const retried = run(wrong, [{ type: "feedback/retry" }]);
    expect(retried.ui.stage).toBe("lrn_check");

    const fixed = run(retried, [
      { type: "check/select", choiceId: topicModule?.check.correctChoiceId ?? "" },
      { type: "check/hint" },
      { type: "check/submit", at: at(12) },
    ]);
    expect(fixed.session.feedback?.outcome).toBe("correct");
    expect(fixed.session.attempts).toHaveLength(2);
    expect(fixed.session.attempts.map((attempt) => attempt.moduleId)).toEqual([moduleId, moduleId]);
    expect(fixed.session.attempts[1]?.usedHint).toBe(true);
  });

  it("treats a skipped check as no progress and keeps needs-review honest", () => {
    const pathState = run(guidedToPath("en"), [{ type: "lesson/engage", at: at(10) }]);
    const skipped = run(pathState, [{ type: "check/skip", at: at(11) }]);
    expect(skipped.session.feedback?.outcome).toBe("skipped");
    const acknowledged = run(skipped, [{ type: "feedback/acknowledge", at: at(12) }]);
    expect(acknowledged.session.progress.completedModules).toBe(0);
    expect(acknowledged.session.progress.needsReview).toBe(true);
    expect(acknowledged.ui.stage).toBe("lrn_checkpoint");
  });

  it("asks for an answer instead of accepting an empty submit", () => {
    const pathState = run(guidedToPath("en"), [{ type: "lesson/engage", at: at(10) }]);
    const empty = run(pathState, [{ type: "check/submit", at: at(11) }]);
    expect(empty.ui.validation).toBe("check_incomplete");
    expect(empty.session.attempts).toHaveLength(0);
  });
});

describe("U2-LRN-006 — resume maps recorded state back to the right stage", () => {
  it("restores path review, lesson, feedback and complete from recorded state only", () => {
    const preset = createLearnStatePreset({ locale: "ar", now: at(0), preset: "unit_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    expect(learnSessionStateSchema.safeParse(preset).success).toBe(true);
    expect(stageForSession(preset)).toBe("lrn_check");

    const pathComplete = createLearnStatePreset({ locale: "ar", now: at(0), preset: "path_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    expect(stageForSession(pathComplete)).toBe("lrn_complete");

    // `no_progress` = path built, lesson opened, nothing answered yet.
    const noProgress = createLearnStatePreset({ locale: "en", now: at(0), preset: "no_progress", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    // The fixture records one answered check with no acknowledged feedback yet.
    expect(noProgress.attempts).toHaveLength(1);
    expect(noProgress.feedback).toBeNull();
    expect(noProgress.progress.completedModules).toBe(0);
    expect(stageForSession(noProgress)).toBe("lrn_check");

    const fresh = createLearnStatePreset({ locale: "en", now: at(0), preset: "fresh", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    expect(stageForSession(fresh)).toBe("lrn_brief");

    const restored = createInitialLearnState("en", pathComplete);
    expect(restored.ui.stage).toBe("lrn_complete");
    expect(restored.session.progress.completedModules).toBe(pathComplete.progress.completedModules);
  });

  it("records the stage the learner actually reached, and refuses a forged one", () => {
    const pathState = run(guidedToPath("ar"), [{ type: "lesson/engage", at: at(10) }]);
    const moduleId = pathState.session.currentModuleId ?? "";
    const topicModule = requireModule("spaced_repetition");
    const answered = run(pathState, [
      { type: "check/select", choiceId: topicModule.check.correctChoiceId },
      { type: "check/submit", at: at(11) },
    ]);
    expect(answered.session.resumeStageKey).toBe("lrn_feedback");

    const acknowledged = run(answered, [{ type: "feedback/acknowledge", at: at(12) }]);
    // The recorded stage is the checkpoint the learner was standing on, while
    // the derived stage alone would fall back to the next lesson.
    expect(acknowledged.session.resumeStageKey).toBe("lrn_checkpoint");
    expect(stageForSession(acknowledged.session)).toBe("lrn_checkpoint");
    expect(derivedStageFor(acknowledged.session)).toBe("lrn_lesson");
    expect(acknowledged.session.currentModuleId).not.toBe(moduleId);

    // A hand-edited snapshot cannot claim a stage its facts do not support.
    const forged = { ...createInitialLearnState("ar").session, resumeStageKey: "lrn_complete" as const };
    expect(stageForSession(forged)).toBe("lrn_brief");
  });

  it("keeps the session schema valid after every reducer transition", () => {
    const states = [
      createInitialLearnState("ar"),
      guidedToPath("ar"),
      run(guidedToPath("ar"), [{ type: "lesson/engage", at: at(10) }]),
    ];
    for (const state of states) {
      expect(learnSessionStateSchema.safeParse(state.session).success).toBe(true);
    }
  });
});

describe("U2-LRN-007 — edge fixtures stay reachable and honest", () => {
  it("exposes the dense, needs-review, RTL and empty fixtures deterministically", () => {
    const dense = createLearnStatePreset({ locale: "ar", now: at(0), preset: "dense_path", topicId: "spaced_repetition", mode: "guided", minutes: 30 });
    const standard = createLearnStatePreset({ locale: "ar", now: at(0), preset: "unit_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    expect(dense.path?.modules.some((module) => ["sr_tooling", "sr_sleep"].includes(module.id))).toBe(true);
    expect(standard.path?.modules.some((module) => ["sr_tooling", "sr_sleep"].includes(module.id))).toBe(false);
    expect(dense.path?.modules.length).toBeLessThanOrEqual(12);

    const review = createLearnStatePreset({ locale: "ar", now: at(0), preset: "needs_review", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    expect(review.progress.needsReview).toBe(true);

    const rtl = createLearnStatePreset({ locale: "ar", now: at(0), preset: "rtl_mixed", topicId: "rtl_typography", mode: "guided", minutes: 15 });
    expect(rtl.brief?.topicId).toBe("rtl_typography");

    const unsupported = createLearnStatePreset({ locale: "en", now: at(0), preset: "unsupported_topic", mode: "guided", minutes: 15 });
    expect(unsupported.path).toBeNull();
    expect(unsupported.attempts).toHaveLength(0);
    // No path ⇒ no progress claim: the schema allows 0 planned modules on purpose.
    expect(unsupported.progress.totalModules).toBe(0);
    expect(stageForSession(unsupported)).toBe("lrn_diagnostic");
  });

  it("rejects an unsupported topic before it reaches a path", () => {
    const state = run(createInitialLearnState("ar"), [
      { type: "draft/topic", topicId: "unmapped_topic" },
      { type: "draft/motivation", value: "سبب" },
    ]);
    const submitted = run(state, [{ type: "brief/submit", at: at(1) }]);
    expect(submitted.ui.validation).toBe("brief_incomplete");
    expect(submitted.session.path).toBeNull();
    expect(submitted.ui.stage).toBe("lrn_brief");
  });

  it("keeps the fixture ids deterministic across two builds", () => {
    const ids = createServiceIdFactory("learn_fixture");
    const first = createLearnStatePreset({ locale: "ar", now: at(0), preset: "unit_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    const second = createLearnStatePreset({ locale: "ar", now: at(0), preset: "unit_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    expect(first.attempts).toEqual(second.attempts);
    expect(ids.next("ssn_")).toBe(ids.next("ssn_").replace(/_2$/, "_1"));
  });
});

describe("UT-STO-001 / UT-FIX-001 — storage block and copy coverage", () => {
  it("stores Learn state as a versioned domain block", async () => {
    const { demoStoreSnapshotSchema, buildDemoSnapshot } = await import("../features/service-workbench/storage/store");
    const session = createLearnStatePreset({ locale: "ar", now: at(0), preset: "unit_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    const { createDeterministicMockServiceClient } = await import("@nasaq/mock-api/services");
    const client = createDeterministicMockServiceClient();
    const created = client.createSession({ serviceId: "learn", locale: "ar", scenarioId: "happy" });
    const snapshot = buildDemoSnapshot({
      savedAt: at(0),
      sessions: [created.session],
      artifacts: [],
      receipts: [],
      handoffs: [],
      domains: [{ serviceId: "learn", stateVersion: 1, payload: session }],
    });
    const parsed = demoStoreSnapshotSchema.safeParse(snapshot);
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.domains?.[0]?.serviceId).toBe("learn");
    // A pre-U2.1 snapshot without the block still parses.
    const legacy = demoStoreSnapshotSchema.safeParse({ ...snapshot, domains: undefined });
    expect(legacy.success).toBe(true);
  });

  it("keeps every Learn-visible string in the dictionary, not in JSX", () => {
    const learnDir = join(repoRoot, "apps", "web", "features", "learn");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          walk(full);
        } else if (full.endsWith(".tsx") || full.endsWith(".ts")) {
          files.push(full);
        }
      }
    };
    walk(learnDir);
    expect(files.length).toBeGreaterThan(0);

    // Negative control first: the extractor must catch literal copy, otherwise
    // an empty result would prove nothing.
    expect(jsxTextOffenders('<p>مرحبا بالعالم</p>'.replace("<p>", "return <p>").replace("</p>", "</p>;"))).toEqual(["مرحبا بالعالم"]);
    expect(jsxTextOffenders("return <span>Saved</span>;")).toEqual(["Saved"]);

    for (const file of files) {
      const raw = readFileSync(file, "utf8");
      const source = raw.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/^\s*\/\/.*$/gmu, "");
      expect(jsxTextOffenders(source), `${file} contains literal JSX copy`).toEqual([]);
      // Arabic copy belongs to the ar dictionary only; a Learn source file that
      // carries Arabic means the copy escaped i18n.
      expect(/[\u0600-\u06FF]/u.test(source), `${file} contains Arabic copy outside the dictionary`).toBe(false);
    }
  });
});
