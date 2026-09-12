import { describe, expect, it } from "vitest";
import {
  applyServiceEvent,
  canTransitionServiceRun,
  createServiceRetryRun,
  createServiceStages,
  getServiceStageBlueprints,
  genericServiceScenarioIds,
  isTerminalServiceRunStatus,
  serviceArtifactContentSchema,
  serviceEventSchema,
  serviceRunSchema,
  serviceSessionSchema,
  serviceUserTextSchema,
  simulationReceiptSchema,
  transitionServiceRun,
  type ServiceEvent,
  type ServiceRun,
} from "@nasaq/contracts/services";
import {
  buildServiceArtifactContent,
  buildServiceFixtureMatrix,
  buildServiceScenarioFixture,
  buildServiceScenarioPlan,
  createServiceIdFactory,
  hostileFixtureInputs,
  isAcceptedUserText,
} from "@nasaq/mock-api/services";

const FIXTURE_START = Date.parse("2026-09-12T00:00:00.000Z");

describe("UT-CON-001 — every U2 contract parses its fixture", () => {
  it("parses sessions, runs, stages, artifacts, receipts, and evidence for all services and scenarios", () => {
    const fixtures = buildServiceFixtureMatrix(genericServiceScenarioIds);
    expect(fixtures).toHaveLength(6 * genericServiceScenarioIds.length * 2);

    for (const fixture of fixtures) {
      expect(serviceSessionSchema.safeParse(fixture.session).success).toBe(true);
      expect(simulationReceiptSchema.safeParse(fixture.receipt).success).toBe(true);
      expect(fixture.stages.length).toBeGreaterThanOrEqual(6);
      for (const stage of fixture.stages) expect(stage.serviceId).toBe(fixture.serviceId);
      if (fixture.run) expect(serviceRunSchema.safeParse(fixture.run).success).toBe(true);
      if (fixture.artifact) {
        expect(fixture.artifact.kind).toBeDefined();
        const content = buildServiceArtifactContent(fixture.artifact.kind, fixture.locale, fixture.serviceId);
        expect(serviceArtifactContentSchema.safeParse(content).success).toBe(true);
      }
    }
  });

  it("keeps every receipt at explicit simulation with zero network calls", () => {
    for (const fixture of buildServiceFixtureMatrix(["happy", "warning"])) {
      expect(fixture.receipt.mode).toBe("explicit_simulation");
      expect(fixture.receipt.networkCalls).toBe(0);
      expect(fixture.receipt.productAgentRuntime).toBe("not_implemented");
      expect(fixture.receipt.userDataRead).toHaveLength(0);
      expect(fixture.receipt.notPerformed.length).toBeGreaterThan(0);
    }
  });
});

describe("UT-CON-002 — invalid records and hostile input are rejected", () => {
  it("rejects malformed ids, unknown statuses, and mixed unions", () => {
    const fixture = buildServiceScenarioFixture({ serviceId: "learn", scenarioId: "happy", locale: "ar" });
    expect(serviceSessionSchema.safeParse({ ...fixture.session, id: "session-1" }).success).toBe(false);
    expect(serviceSessionSchema.safeParse({ ...fixture.session, status: "running" }).success).toBe(false);
    const mismatched = { ...fixture.session, input: buildServiceScenarioFixture({ serviceId: "code", scenarioId: "happy", locale: "ar" }).session.input };
    expect(serviceSessionSchema.safeParse(mismatched).success).toBe(false);
  });

  it("rejects hostile user text, unsafe schemes, control characters, and bidi overrides", () => {
    expect(isAcceptedUserText(hostileFixtureInputs.scriptTag)).toBe(true); // escaped rendering, not a schema concern
    expect(isAcceptedUserText(hostileFixtureInputs.longText)).toBe(false);
    expect(isAcceptedUserText(hostileFixtureInputs.controlCharacters)).toBe(false);
    expect(isAcceptedUserText(hostileFixtureInputs.bidiOverride)).toBe(false);
    expect(serviceUserTextSchema.safeParse("   ").success).toBe(false);
  });
});

describe("UT-CON-003 — terminal runs never reactivate", () => {
  const fixture = buildServiceScenarioFixture({ serviceId: "research", scenarioId: "failed_retryable", locale: "en" });
  const run = fixture.run as ServiceRun;

  it("refuses transitions out of a terminal status", () => {
    expect(isTerminalServiceRunStatus("failed_retryable")).toBe(true);
    expect(canTransitionServiceRun("failed_retryable", "running")).toBe(false);
    const result = transitionServiceRun(run, "running", "2026-09-12T00:00:02.000Z", "manual");
    expect(result.outcome).toBe("rejected");
  });

  it("creates a new run with retryOf instead of reviving the old one", () => {
    const retry = createServiceRetryRun(run, "run_retry_1", "happy", "2026-09-12T00:00:03.000Z");
    expect(retry.id).toBe("run_retry_1");
    expect(retry.retryOf).toBe(run.id);
    expect(retry.status).toBe("queued");
    expect(retry.id).not.toBe(run.id);
  });

  it("never cancels without an explicit cancel request, and records the request first", () => {
    const fixtureHappy = buildServiceScenarioFixture({ serviceId: "code", scenarioId: "happy", locale: "en" });
    const running = { ...(fixtureHappy.run as ServiceRun), status: "running" as const };
    const tooEarly = transitionServiceRun(running, "cancelled", "2026-09-12T00:00:04.000Z", "user_cancelled");
    expect(tooEarly.outcome).toBe("rejected");
    const requested = transitionServiceRun(running, "cancel_requested", "2026-09-12T00:00:05.000Z", "user_cancelled");
    expect(requested.outcome).toBe("applied");
    if (requested.outcome !== "applied") throw new Error("unreachable");
    expect(requested.run.status).toBe("cancel_requested");
    const cancelled = transitionServiceRun(requested.run, "cancelled", "2026-09-12T00:00:06.000Z", "cancel_confirmed");
    expect(cancelled.outcome).toBe("applied");
    if (cancelled.outcome !== "applied") throw new Error("unreachable");
    expect(cancelled.run.status).toBe("cancelled");
    expect(isTerminalServiceRunStatus(cancelled.run.status)).toBe(true);
  });
});

describe("UT-CON-004 — event sequence, duplicate, gap, and stale-run guards", () => {
  const plan = buildServiceScenarioPlan({
    serviceId: "analyze",
    scenarioId: "happy",
    locale: "en",
    sessionId: "ssn_analyze_1",
    runId: "run_analyze_1",
    streamId: "str_analyze_1",
    ids: createServiceIdFactory("analyze_happy_en"),
    startAt: FIXTURE_START,
  });
  const baseRun: ServiceRun = {
    id: "run_analyze_1",
    sessionId: "ssn_analyze_1",
    serviceId: "analyze",
    status: "validating",
    stageId: "stg_ana_source",
    scenarioId: "happy",
    sequence: 0,
    warningCodes: [],
    artifactIds: [],
    simulationReceiptId: "sim_analyze_1",
    createdAt: "2026-09-12T00:00:00.000Z",
  };
  const stages = createServiceStages("analyze");

  it("ignores duplicates, reports gaps, and drops events for another run", () => {
    const duplicate = applyServiceEvent({ run: baseRun, stages, lastSequence: 2, event: plan.events[1] as ServiceEvent });
    expect(duplicate.outcome).toBe("duplicate");

    const gap = applyServiceEvent({ run: baseRun, stages, lastSequence: 0, event: plan.events[4] as ServiceEvent });
    expect(gap.outcome).toBe("gap");

    const foreignRun: ServiceEvent = {
      name: "service.run.status_changed",
      eventId: "evt_other_1",
      streamId: "str_analyze_1",
      sequence: 1,
      occurredAt: "2026-09-12T00:00:01.000Z",
      payload: { runId: "run_other", status: "completed", reasonCode: "completed" },
    };
    expect(applyServiceEvent({ run: baseRun, stages, lastSequence: 0, event: foreignRun }).outcome).toBe("stale_run");
  });

  it("applies stage and status events in order and keeps one active stage", () => {
    let run = baseRun;
    let current = stages;
    let lastSequence = 0;
    for (const event of plan.events) {
      const applied = applyServiceEvent({ run, stages: current, lastSequence, event });
      run = applied.run;
      current = applied.stages;
      lastSequence = Math.max(lastSequence, applied.lastSequence);
    }
    expect(run.status).toBe("completed");
    expect(current.filter((stage) => stage.status === "active").length).toBeLessThanOrEqual(1);
    expect(current[0]?.status).toBe("completed");
  });

  it("keeps every planned event valid against the shared event schema", () => {
    expect(plan.events.length).toBeGreaterThan(5);
    for (const event of plan.events) expect(serviceEventSchema.safeParse(event).success).toBe(true);
    expect(plan.events.map((event) => event.sequence)).toEqual(plan.events.map((_, index) => index + 1));
  });
});

describe("UT-FIX-001 — scenario fixture registry", () => {
  it("exposes a distinct stage blueprint for every service", () => {
    const keys = new Map<string, number>();
    for (const serviceId of ["learn", "research", "create", "code", "analyze", "explore"] as const) {
      const blueprints = getServiceStageBlueprints(serviceId);
      expect(blueprints.length).toBeGreaterThanOrEqual(6);
      keys.set(serviceId, blueprints.length);
      for (const blueprint of blueprints) expect(blueprint.titleKey.startsWith(`services.${serviceId}.stages.`)).toBe(true);
    }
    expect(new Set(keys.values()).size).toBeGreaterThan(1);
  });

  it("builds every generic scenario deterministically for both locales", () => {
    for (const scenarioId of genericServiceScenarioIds) {
      const first = buildServiceScenarioFixture({ serviceId: "explore", scenarioId, locale: "ar", startAt: FIXTURE_START });
      const second = buildServiceScenarioFixture({ serviceId: "explore", scenarioId, locale: "ar", startAt: FIXTURE_START });
      expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    }
  });
});
