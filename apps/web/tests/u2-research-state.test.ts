import { describe, expect, it } from "vitest";
import {
  applySourceExclusion,
  buildResearchEvidenceRefs,
  buildResearchPlan,
  buildResearchSourceRecords,
  buildResearchTopicClaims,
  computeClaimVerdicts,
  createResearchStatePreset,
  discoveredEvidenceIds,
  getDenseResearchSources,
  previewSourceExclusion,
  restoreResearchSource,
  verifyFixtureCoverage,
} from "@nasaq/mock-api/services";
import { researchSessionStateSchema } from "@nasaq/contracts/services";
import type { ResearchSessionState } from "@nasaq/contracts/services";
import {
  createInitialResearchState,
  derivedStageFor,
  researchReducer,
  stageForSession,
  type ResearchAction,
  type ResearchReducerState,
} from "../features/research/state/research-reducer";

/**
 * UT-RSH-001 (plan version and source selection) and UT-RSH-002
 * (claim/evidence coverage, orphan/unsupported/conflict), plus the reducer
 * gates that keep the plan-approval, source-required, claim-resolution, and
 * report-review invariants honest. Everything runs on the same pure rules the
 * live surface uses.
 */

const at = (step: number) => `2026-09-12T00:00:${String(step).padStart(2, "0")}.000Z`;

function run(state: ResearchReducerState, actions: ResearchAction[]): ResearchReducerState {
  return actions.reduce((current, action) => researchReducer(current, action), state);
}

/** Walks the guided flow to an approved plan + finished activity. */
function guidedToSources(locale: "ar" | "en" = "ar"): ResearchReducerState {
  let state = createInitialResearchState(locale);
  state = run(state, [
    { type: "draft/question", value: "ما أثر تقليل زمن الانتظار على رضا العملاء في الربع الثالث؟" },
    { type: "draft/decision", value: "هل نستثمر في فريق دعم إضافي هذا الربع؟" },
    { type: "brief/submit", at: at(1) },
    { type: "clarify/default", questionId: "rsh_clarify_window", at: at(2) },
    { type: "clarify/default", questionId: "rsh_clarify_depth", at: at(3) },
    { type: "clarify/default", questionId: "rsh_clarify_outcome", at: at(4) },
    { type: "plan/build", at: at(5) },
    // The user widens the plan so blogs and archived pages join the pack:
    // this is how the conflicted and unavailable-evidence states become
    // reachable through a normal, editable plan.
    { type: "plan/toggle-type", sourceType: "blog", at: at(5) },
    { type: "plan/toggle-type", sourceType: "archived_page", at: at(5) },
    { type: "plan/approve", at: at(6) },
  ]);
  // Play the whole activity deterministically.
  for (let index = 0; index < 200; index += 1) {
    const next = researchReducer(state, { type: "activity/step" });
    if (next === state) break;
    state = next;
  }
  return state;
}

describe("UT-RSH-001 — plan versions and source selection", () => {
  it("builds the same plan from the same inputs and documents its rules", () => {
    const request = {
      topicId: "waiting_time_q3" as const,
      scope: "recent" as const,
      audience: "team" as const,
      clarifyAnswers: [],
      version: 1,
    };
    const first = buildResearchPlan(request);
    const second = buildResearchPlan(request);
    expect(first).toEqual(second);
    expect(first.axes.length).toBeGreaterThanOrEqual(1);
    expect(first.sourceTypes).toContain("internal_report");
    expect(first.sourceTypes).toContain("news");
    expect(first.rationaleKeys.length).toBeGreaterThan(0);
    // The recent scope drops the historical axis — a documented rule.
    expect(first.axes.some((axis) => axis.id === "axis_history")).toBe(false);
  });

  it("refuses to start the activity before an explicit plan approval", () => {
    let state = createInitialResearchState("ar");
    state = run(state, [
      { type: "draft/question", value: "سؤال بحثي كامل وواضح للاختبار" },
      { type: "draft/decision", value: "قرار واضح مدعوم بالتقرير" },
      { type: "brief/submit", at: at(1) },
      { type: "clarify/default", questionId: "rsh_clarify_window", at: at(2) },
      { type: "clarify/default", questionId: "rsh_clarify_depth", at: at(3) },
      { type: "clarify/default", questionId: "rsh_clarify_outcome", at: at(4) },
      { type: "plan/build", at: at(5) },
    ]);
    expect(state.ui.stage).toBe("rsh_plan_review");
    expect(state.session.planVersions[0]?.status).toBe("draft");
    // A step before approval is a no-op: the gate holds.
    const stepped = researchReducer(state, { type: "activity/step" });
    expect(stepped).toBe(state);
    expect(state.session.activity.status).toBe("idle");
  });

  it("editing after approval creates a new draft version and keeps the approved one frozen", () => {
    let state = guidedToSources();
    // Revise after the run: a new draft appears, approval moves nowhere yet.
    state = run(state, [{ type: "plan/revise", at: at(20) }]);
    expect(state.ui.stage).toBe("rsh_plan_review");
    expect(state.session.planVersions.length).toBe(2);
    expect(state.session.planVersions[0]?.status).toBe("approved");
    expect(state.session.planVersions[1]?.status).toBe("draft");
    // Editing the draft toggles an axis without touching the approved copy.
    state = run(state, [{ type: "plan/toggle-axis", axisId: "axis_trend", at: at(21) }]);
    const approvedPlan = state.session.planVersions[0]?.plan;
    const draftPlan = state.session.planVersions[1]?.plan;
    expect(approvedPlan?.axes.find((axis) => axis.id === "axis_trend")?.included).toBe(true);
    expect(draftPlan?.axes.find((axis) => axis.id === "axis_trend")?.included).toBe(false);
    expect(draftPlan?.revisedByUser).toBe(true);
    // The new draft needs its own explicit approval.
    const before = state.session.approvedPlanVersion;
    state = run(state, [{ type: "plan/approve", at: at(22) }]);
    expect(state.session.approvedPlanVersion).not.toBe(before);
    expect(state.session.planVersions[0]?.status).toBe("superseded");
  });

  it("selects sources by plan types and relevance, and keeps the dense pack bounded at 50", () => {
    const plan = buildResearchPlan({
      topicId: "waiting_time_q3",
      scope: "recent",
      audience: "team",
      clarifyAnswers: [],
      version: 1,
    });
    const sources = buildResearchSourceRecords("waiting_time_q3");
    const evidence = buildResearchEvidenceRefs("waiting_time_q3", "ar");
    const discovered = discoveredEvidenceIds(sources, plan, evidence);
    // Every discovered evidence belongs to an eligible, relevant source.
    for (const id of discovered) {
      const item = evidence.find((candidate) => candidate.id === id);
      const source = sources.find((candidate) => candidate.id === item?.sourceId);
      expect(source?.excluded).toBe(false);
      expect(source && source.relevance >= 1).toBe(true);
    }
    expect(discovered.length).toBeGreaterThan(0);

    const dense = getDenseResearchSources("waiting_time_q3");
    expect(dense.length).toBe(50);
    const denseRecords = buildResearchSourceRecords("waiting_time_q3", { dense: true });
    expect(denseRecords.length).toBe(50);
    expect(researchSessionStateSchema.safeParse({ ...createResearchStatePreset({ locale: "ar", now: at(1), preset: "dense_sources" }) }).success).toBe(true);
  });

  it("excludes a source deterministically, previews affected claims, and restores it", () => {
    const sources = buildResearchSourceRecords("waiting_time_q3");
    const claims = buildResearchTopicClaims("waiting_time_q3");
    const evidence = buildResearchEvidenceRefs("waiting_time_q3", "en");
    const plan = buildResearchPlan({ topicId: "waiting_time_q3", scope: "recent", audience: "team", clarifyAnswers: [], version: 1 });
    const available = discoveredEvidenceIds(sources, plan, evidence);

    const preview = previewSourceExclusion("src_survey_csat", claims, evidence, available);
    expect(preview?.affectedClaimIds).toContain("clm_csat_up");
    expect(preview?.affectedClaimIds).toContain("clm_peak_hours");
    expect(preview?.orphanedEvidenceIds.length).toBeGreaterThan(0);

    const excluded = applySourceExclusion(sources, "src_survey_csat", at(9));
    expect(excluded.find((source) => source.id === "src_survey_csat")?.excluded).toBe(true);
    const afterExclusion = discoveredEvidenceIds(excluded, plan, evidence);
    expect(afterExclusion).not.toContain("evd_survey_csat");
    // Restoring returns to the exact previous coverage set.
    const restored = restoreResearchSource(excluded, "src_survey_csat");
    expect(discoveredEvidenceIds(restored, plan, evidence)).toEqual(available);
  });
});

describe("UT-RSH-002 — claim/evidence coverage, orphans, conflicts", () => {
  it("keeps the static fixture within the shared contract coverage invariant", () => {
    for (const locale of ["ar", "en"] as const) {
      for (const topicId of ["waiting_time_q3", "zero_match", "remote_onboarding"] as const) {
        const summary = verifyFixtureCoverage(topicId, locale);
        expect(summary.orphanEvidenceRefs).toBe(0);
        expect(summary.claimCount).toBeGreaterThan(0);
      }
    }
  });

  it("derives supported, conflicted, partially-supported, and unsupported verdicts deterministically", () => {
    const claims = buildResearchTopicClaims("waiting_time_q3");
    const evidence = buildResearchEvidenceRefs("waiting_time_q3", "ar");
    // The full pack: every stance the fixture declares is resolvable.
    const available = evidence.map((item) => item.id);

    const verdicts = computeClaimVerdicts(claims, evidence, available, []);
    const byId = new Map(verdicts.map((verdict) => [verdict.claimId, verdict]));
    expect(byId.get("clm_wait_drop")?.support).toBe("supported");
    expect(byId.get("clm_csat_up")?.support).toBe("conflicted");
    expect(byId.get("clm_waiting_room_context")?.support).toBe("partially_supported");
    expect(byId.get("clm_retention_link")?.support).toBe("unsupported");
    // The unavailable archived source stays usable but flagged unverifiable.
    expect(byId.get("clm_waiting_room_context")?.unverifiableEvidenceIds).toContain("evd_archive_room");

    const again = computeClaimVerdicts(claims, evidence, available, []);
    expect(again).toEqual(verdicts);
  });

  it("recomputes the matrix after a source exclusion and leaves no orphan citation", () => {
    const claims = buildResearchTopicClaims("waiting_time_q3");
    const evidence = buildResearchEvidenceRefs("waiting_time_q3", "en");
    const sources = buildResearchSourceRecords("waiting_time_q3");
    const fullPack = evidence.map((item) => item.id);

    // Excluding every source behind clm_peak_hours leaves it unsupported.
    const excludedSources = [
      applySourceExclusion(sources, "src_survey_csat", at(9)),
    ].map((current) => applySourceExclusion(current, "src_mixed_bidi", at(9)));
    const verdicts = computeClaimVerdicts(claims, evidence, fullPack, ["src_survey_csat", "src_mixed_bidi"]);
    const byId = new Map(verdicts.map((verdict) => [verdict.claimId, verdict]));
    expect(byId.get("clm_peak_hours")?.support).toBe("unsupported");
    expect(byId.get("clm_csat_up")?.support).toBe("conflicted");
    // No resolvable evidence points at an excluded source: no orphan remains.
    for (const verdict of verdicts) {
      for (const id of verdict.evidenceIds) {
        const item = evidence.find((candidate) => candidate.id === id);
        expect(item?.sourceId === "src_survey_csat" || item?.sourceId === "src_mixed_bidi").toBe(false);
      }
    }
    expect(excludedSources[0]?.find((source) => source.id === "src_survey_csat")?.excluded).toBe(true);
  });

  it("blocks the report while an unsupported or conflicted claim is unresolved", () => {
    let state = guidedToSources("en");
    expect(state.session.activity.status).toBe("done");
    expect(state.ui.stage).toBe("rsh_source_review");

    state = run(state, [{ type: "sources/continue", at: at(10) }]);
    expect(state.ui.stage).toBe("rsh_claim_matrix");
    // Trying to draft the report with open conflicted/unsupported claims fails.
    state = run(state, [{ type: "claims/continue", at: at(11) }]);
    expect(state.ui.validation).toBe("claim_unresolved");
    expect(state.session.report).toBeNull();

    // Acknowledge the unsupported claim and request evidence for the conflicted one.
    state = run(state, [
      { type: "claim/acknowledge", claimId: "clm_retention_link", at: at(12) },
      { type: "claim/resolve", claimId: "clm_csat_up", at: at(13) },
      { type: "claims/continue", at: at(14) },
    ]);
    expect(state.ui.validation).toBeNull();
    expect(state.ui.stage).toBe("rsh_report_edit");
    expect(state.session.report).not.toBeNull();
    expect(state.session.report?.sections.length).toBeGreaterThan(2);
    expect(state.session.report?.limitationKeys.length).toBeGreaterThan(0);
  });
});

describe("Research stage derivation and resume trust", () => {
  it("derives the stage from recorded facts and refuses unsupported recorded stages", () => {
    const fresh = createInitialResearchState("ar");
    expect(derivedStageFor(fresh.session)).toBe("rsh_brief");

    const cancelled = createResearchStatePreset({ locale: "ar", now: at(1), preset: "activity_cancelled" });
    expect(derivedStageFor(cancelled)).toBe("rsh_source_activity");
    // A hand-edited snapshot cannot fake a complete stage.
    const faked: ResearchSessionState = researchSessionStateSchema.parse({
      ...cancelled,
      resumeStageKey: "rsh_complete",
    });
    expect(stageForSession(faked)).not.toBe("rsh_complete");
  });

  it("resumes a saved research session from its recorded stage", () => {
    const preset = createResearchStatePreset({ locale: "en", now: at(1), preset: "report_partial" });
    const state = createInitialResearchState("en", preset);
    expect(state.ui.stage).toBe("rsh_report_edit");
    expect(state.session.report).not.toBeNull();
    // Some sections are still unreviewed: completion is refused.
    const attempted = researchReducer(state, { type: "report/complete", at: at(2) });
    expect(attempted.ui.validation).toBe("report_incomplete");
  });

  it("keeps the zero-sources state honest: no claim matrix without sources", () => {
    let state = createInitialResearchState("ar", createResearchStatePreset({ locale: "ar", now: at(1), preset: "zero_sources" }));
    expect(state.session.evidenceIds).toHaveLength(0);
    state = run(state, [{ type: "sources/continue", at: at(2) }]);
    expect(state.ui.validation).toBe("source_required");
    expect(state.ui.stage).toBe("rsh_source_review");
  });
});

describe("Research activity determinism, steering, and cancellation", () => {
  it("replays the same activity log twice with identical entries", () => {
    const first = guidedToSources("en");
    const second = guidedToSources("en");
    expect(first.session.activity.entries).toEqual(second.session.activity.entries);
    expect(first.session.evidenceIds).toEqual(second.session.evidenceIds);
    expect(first.session.activity.status).toBe("done");
  });

  it("cancels without completion and resumes from the same cursor", () => {
    let state = createInitialResearchState("ar");
    state = run(state, [
      { type: "draft/question", value: "سؤال بحثي كامل وواضح للاختبار" },
      { type: "draft/decision", value: "قرار واضح مدعوم بالتقرير" },
      { type: "brief/submit", at: at(1) },
      { type: "clarify/default", questionId: "rsh_clarify_window", at: at(2) },
      { type: "clarify/default", questionId: "rsh_clarify_depth", at: at(3) },
      { type: "clarify/default", questionId: "rsh_clarify_outcome", at: at(4) },
      { type: "plan/build", at: at(5) },
      { type: "plan/approve", at: at(6) },
      { type: "activity/step" },
      { type: "activity/step" },
    ]);
    const played = state.session.activity.entries.length;
    expect(played).toBe(2);

    state = run(state, [{ type: "activity/cancel", at: at(7) }]);
    expect(state.session.activity.status).toBe("cancelled");
    expect(state.session.activity.entries.at(-1)?.kind).toBe("cancelled");
    // No stale completion: stepping while cancelled is a no-op.
    const idle = researchReducer(state, { type: "activity/step" });
    expect(idle).toBe(state);

    state = run(state, [{ type: "activity/resume", at: at(8) }]);
    expect(state.session.activity.status).toBe("playing");
    expect(state.session.activity.entries.at(-1)?.kind).toBe("resumed");
    // Resume continues from the recorded cursor: one more played step after
    // the two markers (cancelled + resumed).
    state = run(state, [{ type: "activity/step" }]);
    expect(state.session.activity.entries.length).toBe(played + 3);
  });

  it("steering regenerates the pending steps and records the steer marker", () => {
    let state = createInitialResearchState("en");
    state = run(state, [
      { type: "draft/question", value: "A complete researchable question for steering" },
      { type: "draft/decision", value: "A clear decision supported by the report" },
      { type: "brief/submit", at: at(1) },
      { type: "clarify/default", questionId: "rsh_clarify_window", at: at(2) },
      { type: "clarify/default", questionId: "rsh_clarify_depth", at: at(3) },
      { type: "clarify/default", questionId: "rsh_clarify_outcome", at: at(4) },
      { type: "plan/build", at: at(5) },
      { type: "plan/toggle-type", sourceType: "blog", at: at(5) },
      { type: "plan/toggle-type", sourceType: "archived_page", at: at(5) },
      { type: "plan/approve", at: at(6) },
      { type: "activity/step" },
    ]);
    const before = state.session.activity.entries.length;

    state = run(state, [{ type: "activity/steer", steer: "narrow_recent", at: at(7) }]);
    expect(state.session.activity.entries.at(-1)?.kind).toBe("steer");
    expect(state.session.activity.cursor).toBe(0);
    expect(state.session.activity.entries.length).toBe(before + 1);
    // The narrow steer keeps only 2026 sources in the regenerated steps.
    let steered = state;
    for (let index = 0; index < 200; index += 1) {
      const next = researchReducer(steered, { type: "activity/step" });
      if (next === steered) break;
      steered = next;
    }
    expect(steered.session.activity.status).toBe("done");
    // Narrowing to 2026 removes the 2024 archived source from discovery.
    expect(steered.session.evidenceIds).not.toContain("evd_archive_room");
  });
});
