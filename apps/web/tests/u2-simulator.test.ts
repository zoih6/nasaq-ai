import { describe, expect, it } from "vitest";
import { createServiceRetryRun, isTerminalServiceRunStatus, type ServiceEvent, type ServiceRun } from "@nasaq/contracts/services";
import {
  buildServiceScenarioPlan,
  createManualServiceClock,
  createServiceIdFactory,
  createServiceSimulationRunner,
} from "@nasaq/mock-api/services";

const START = Date.parse("2026-09-12T00:00:00.000Z");

function runToCompletion(options: {
  serviceId: "learn" | "research" | "create" | "code" | "analyze" | "explore";
  scenarioId: "happy" | "needs_input" | "failed_retryable" | "failed_final" | "cancel_race" | "warning";
  cancelAfterEvents?: number;
}) {
  const clock = createManualServiceClock(START);
  const ids = createServiceIdFactory(`${options.serviceId}_${options.scenarioId}_en`);
  const events: ServiceEvent[] = [];
  const runner = createServiceSimulationRunner({
    serviceId: options.serviceId,
    scenarioId: options.scenarioId,
    locale: "en",
    clock,
    ids,
    startAt: START,
    stepMs: 100,
    onEvent: (event) => {
      events.push(event);
      if (options.cancelAfterEvents !== undefined && events.length === options.cancelAfterEvents) {
        runner.cancel("user_cancelled");
      }
    },
  });
  runner.start();
  clock.advance(20_000);
  return { events, runner, clock };
}

describe("UT-SIM-001 — the simulator is deterministic and event-driven", () => {
  it("produces an identical plan for identical inputs", () => {
    const build = () => buildServiceScenarioPlan({
      serviceId: "learn",
      scenarioId: "happy",
      locale: "ar",
      sessionId: "ssn_learn_1",
      runId: "run_learn_1",
      streamId: "str_learn_1",
      ids: createServiceIdFactory("learn_happy_ar"),
      startAt: START,
    });
    expect(JSON.stringify(build())).toBe(JSON.stringify(build()));
  });

  it("emits exactly the planned events, in order, with one sequence", () => {
    const { events, runner } = runToCompletion({ serviceId: "learn", scenarioId: "happy" });
    expect(events.map((event) => event.name)).toEqual(runner.plan.events.map((event) => event.name));
    expect(events.map((event) => event.sequence)).toEqual(events.map((_, index) => index + 1));
    expect(events.every((event) => event.streamId === runner.streamId)).toBe(true);
    expect(new Set(events.map((event) => event.occurredAt)).size).toBeGreaterThan(1);
  });

  it("waits for user input instead of completing on a timer", () => {
    const { events, runner } = runToCompletion({ serviceId: "research", scenarioId: "needs_input" });
    expect(runner.terminalStatus()).toBe("needs_input");
    expect(events.some((event) => event.name === "service.input.requested")).toBe(true);
    expect(events.some((event) => event.name === "artifact.created")).toBe(false);

    const resumed: string[] = [];
    const inputClock = createManualServiceClock(START);
    const runnerWithSink = createServiceSimulationRunner({
      serviceId: "research",
      scenarioId: "needs_input",
      locale: "en",
      clock: inputClock,
      ids: createServiceIdFactory("research_needs_input_en"),
      startAt: START,
      stepMs: 100,
      onEvent: (event) => resumed.push(event.name),
    });
    runnerWithSink.start();
    inputClock.advance(5_000);
    expect(runnerWithSink.terminalStatus()).toBe("needs_input");
    runnerWithSink.provideInput();
    expect(resumed).toContain("service.run.status_changed");
    expect(runnerWithSink.terminalStatus()).toBe("completed");
  });

  it("never uses randomness or elapsed time to decide success", () => {
    const { events } = runToCompletion({ serviceId: "code", scenarioId: "happy" });
    const statuses = events
      .filter((event) => event.name === "service.run.status_changed")
      .map((event) => (event.name === "service.run.status_changed" ? event.payload.status : ""));
    expect(statuses).toContain("completed");
    expect(statuses.indexOf("completed")).toBeGreaterThan(statuses.indexOf("running"));
  });
});

describe("UT-SIM-002 — the cancel race resolves to exactly one terminal state", () => {
  it("requests then confirms cancellation, and suppresses the queued completion", () => {
    const { events, runner } = runToCompletion({ serviceId: "analyze", scenarioId: "cancel_race", cancelAfterEvents: 4 });
    const statuses = events
      .filter((event) => event.name === "service.run.status_changed")
      .map((event) => (event.name === "service.run.status_changed" ? event.payload.status : ""));

    expect(statuses).toContain("cancel_requested");
    expect(statuses).toContain("cancelled");
    expect(statuses).not.toContain("completed");
    expect(statuses.indexOf("cancel_requested")).toBeLessThan(statuses.indexOf("cancelled"));

    const terminalStatuses = statuses.filter((status) => isTerminalServiceRunStatus(status as ServiceRun["status"]));
    expect(terminalStatuses).toEqual(["cancelled"]);
    expect(runner.terminalStatus()).toBe("cancelled");
  });

  it("creates a fresh retry run that points at the failed attempt", () => {
    const { events, runner } = runToCompletion({ serviceId: "code", scenarioId: "failed_retryable" });
    expect(runner.terminalStatus()).toBe("failed_retryable");
    const failedRunId = runner.runId;
    const failedRun: ServiceRun = {
      id: failedRunId,
      sessionId: runner.sessionId,
      serviceId: "code",
      status: "failed_retryable",
      stageId: "stg_cod_scope",
      scenarioId: "failed_retryable",
      sequence: events.length,
      warningCodes: [],
      artifactIds: [],
      simulationReceiptId: "sim_code_retry",
      createdAt: "2026-09-12T00:00:00.000Z",
    };
    const retry = createServiceRetryRun(failedRun, "run_code_retry_1", "happy", "2026-09-12T00:00:09.000Z");
    expect(retry.retryOf).toBe(failedRunId);
    expect(retry.status).toBe("queued");

    const retryClock = createManualServiceClock(START);
    const retryEvents: ServiceEvent[] = [];
    const retryRunner = createServiceSimulationRunner({
      serviceId: "code",
      scenarioId: "happy",
      locale: "en",
      clock: retryClock,
      ids: createServiceIdFactory("code_retry_en"),
      sessionId: runner.sessionId,
      runId: retry.id,
      retryOf: failedRunId,
      stepMs: 50,
      onEvent: (event) => retryEvents.push(event),
    });
    retryRunner.start();
    retryClock.advance(20_000);
    const created = retryEvents.find((event) => event.name === "service.run.created");
    expect(created?.name).toBe("service.run.created");
    if (created?.name === "service.run.created") {
      expect(created.payload.runId).toBe(retry.id);
      expect(created.payload.retryOf).toBe(failedRunId);
    }
    expect(retryRunner.terminalStatus()).toBe("completed");
    expect(retryRunner.runId).not.toBe(failedRunId);
  });

  it("does not emit anything after the terminal event", () => {
    const { events } = runToCompletion({ serviceId: "explore", scenarioId: "happy" });
    const terminalIndex = events.findIndex((event) => event.name === "service.run.status_changed" && event.payload.status === "completed");
    expect(terminalIndex).toBeGreaterThan(-1);
    const afterTerminal = events.slice(terminalIndex + 1).filter((event) =>
      event.name === "service.stage.started" || event.name === "service.run.status_changed");
    expect(afterTerminal).toHaveLength(0);
  });
});
