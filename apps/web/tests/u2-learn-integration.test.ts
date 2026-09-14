import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { handoffBundleSchema, learnSessionStateSchema } from "@nasaq/contracts/services";
import type { ServiceEvent, ServiceRun } from "@nasaq/contracts/services";
import {
  buildServiceScenarioFixture,
  createDeterministicMockServiceClient,
  createLearnStatePreset,
  createManualServiceClock,
  createServiceIdFactory,
  getLearnTopic,
} from "@nasaq/mock-api/services";
import {
  buildDemoSnapshot,
  createMemoryStorageBackend,
  createServiceSessionStore,
  demoStoreSnapshotSchema,
} from "../features/service-workbench/storage/store";
import { createInitialWorkbenchState, serviceWorkbenchReducer } from "../features/service-workbench/state/reducer";
import { getServiceRegistryEntry, getRegisteredServiceIds } from "../features/service-workbench/service-registry";
import { learnReducer, createInitialLearnState, type LearnAction } from "../features/learn/state/learn-reducer";

/**
 * IT-LRN-001 / IT-WB-003 — Learn composes with the shared workbench.
 *
 * The integration point is the seam, not the pixels: the Learn slice feeds the
 * generic session/run/receipt/handoff path through the same reducer and store
 * that every other service will use, and owns nothing that belongs to the
 * workbench. DOM-level behaviour is covered by `tests/e2e/service-learn.spec.ts`.
 */

const START = Date.parse("2026-09-12T00:00:00.000Z");
const repoRoot = join(__dirname, "..", "..", "..");
const AT = "2026-09-12T00:00:05.000Z";

/** The fixture run is a complete `ServiceRun`, so tests never hand-build one. */
function requireFixtureRun(scenarioId: "happy" | "failed_retryable"): ServiceRun {
  const run = buildServiceScenarioFixture({ serviceId: "learn", scenarioId, locale: "ar" }).run;
  if (run === null) {
    throw new Error(`fixture ${scenarioId} has no run`);
  }
  return run;
}

function driveRun(scenarioId: "happy" | "needs_input" | "failed_retryable") {
  const client = createDeterministicMockServiceClient();
  const clock = createManualServiceClock(START);
  const ids = createServiceIdFactory(`learn_${scenarioId}_ar`);
  const created = client.createSession({ serviceId: "learn", locale: "ar", scenarioId });
  const events: ServiceEvent[] = [];
  const runner = client.createRun({
    session: created.session,
    scenarioId,
    clock,
    stepMs: 100,
    ids,
    onEvent: (event: ServiceEvent) => events.push(event),
  });
  runner.start();
  clock.advance(20_000);

  return {
    client,
    ids,
    created,
    runner,
    events,
    status: runner.terminalStatus(),
  };
}

describe("IT-LRN-001 — the Learn slice runs inside the shared workbench without owning its receipts", () => {
  it("produces a terminal run, one artifact, and one receipt through the shared client", () => {
    const { client, ids, created, runner, events, status } = driveRun("happy");
    expect(status).toBe("completed");
    const terminal = events.at(-1);
    expect(terminal?.name).toBe("service.run.status_changed");
    expect((terminal?.payload as { status?: string }).status).toBe("completed");
    expect(events.every((event) => event.streamId === runner.streamId)).toBe(true);

    const run = requireFixtureRun("happy");

    const { artifact, version } = client.buildArtifact({ session: created.session, run, locale: "ar", ids });
    expect(artifact.kind).toBe("learning_path");
    expect(artifact.serviceId).toBe("learn");

    const receipt = client.buildReceipt({ session: created.session, run, scenarioId: "happy", locale: "ar", ids, storage: "session_storage" });
    expect(receipt.runId).toBe(run.id);
    expect(receipt.serviceId).toBe("learn");
    expect(receipt.mode).toBe("explicit_simulation");
    expect(receipt.networkCalls).toBe(0);
    expect(receipt.productAgentRuntime).toBe("not_implemented");
    expect(receipt.persistentStorage).toBe("session_storage");
    expect(receipt.simulated.length).toBeGreaterThan(0);
    expect(receipt.notPerformed.length).toBeGreaterThan(0);
    expect(version.artifactId).toBe(artifact.id);
  });

  it("keeps the Learn domain block and the shared records in one versioned snapshot", () => {
    const { client, ids, created } = driveRun("happy");
    const run = requireFixtureRun("happy");
    const { artifact, version } = client.buildArtifact({ session: created.session, run, locale: "ar", ids });
    const receipt = client.buildReceipt({ session: created.session, run, scenarioId: "happy", locale: "ar", ids, storage: "session_storage" });

    let workbench = createInitialWorkbenchState(created.session, created.stages);
    expect(workbench.domains).toHaveLength(0);

    const learnState = createLearnStatePreset({ locale: "ar", now: AT, preset: "unit_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    workbench = serviceWorkbenchReducer(workbench, { type: "domain/replaced", block: { serviceId: "learn", stateVersion: 1, payload: learnState } });
    workbench = serviceWorkbenchReducer(workbench, { type: "records/attached", artifact, version, receipt });

    expect(workbench.domains).toHaveLength(1);
    expect(workbench.artifacts).toHaveLength(1);
    expect(workbench.receipts).toHaveLength(1);

    const snapshot = buildDemoSnapshot({
      savedAt: AT,
      sessions: [created.session],
      artifacts: workbench.artifacts,
      receipts: workbench.receipts,
      handoffs: workbench.handoffs,
      domains: workbench.domains,
    });
    const store = createServiceSessionStore({ backend: createMemoryStorageBackend(), kind: "session" });
    expect(store.write(snapshot).ok).toBe(true);
    const read = store.read();
    expect(demoStoreSnapshotSchema.safeParse(read.snapshot).success).toBe(true);
    // Round-trip: the workbench reads the service record, the Learn slice reads
    // its own block, and neither one parses the other's payload.
    expect(read.snapshot?.artifacts[0]?.kind).toBe("learning_path");
    const block = read.snapshot?.domains?.find((candidate) => candidate.serviceId === "learn");
    expect(block?.stateVersion).toBe(1);
    expect(Object.keys(block?.payload ?? {})).not.toContain("kind");
    expect(learnSessionStateSchema.safeParse(block?.payload).success).toBe(true);
    expect(block?.payload.progress.completedModules).toBeGreaterThan(0);
  });

  it("restores saved demo data through one explicit workbench action", () => {
    const { client, created } = driveRun("happy");
    const learnState = createLearnStatePreset({ locale: "en", now: AT, preset: "path_complete", topicId: "spaced_repetition", mode: "guided", minutes: 15 });
    const snapshot = buildDemoSnapshot({
      savedAt: AT,
      sessions: [{ ...created.session, artifactIds: [] }],
      artifacts: [],
      receipts: [],
      handoffs: [],
      domains: [{ serviceId: "learn", stateVersion: 1, payload: learnState }],
    });
    const savedSession = snapshot.sessions.at(0);
    if (savedSession === undefined) {
      throw new Error("fixture snapshot has no session");
    }
    let workbench = createInitialWorkbenchState(created.session, created.stages);
    workbench = serviceWorkbenchReducer(workbench, {
      type: "records/restored",
      session: savedSession,
      artifacts: snapshot.artifacts,
      receipts: snapshot.receipts,
      handoffs: snapshot.handoffs,
      domains: snapshot.domains ?? [],
      savedAt: snapshot.savedAt,
      storageStatus: "session",
    });
    expect(workbench.savedAt).toBe(AT);
    expect(workbench.storageStatus).toBe("session");
    expect(workbench.domains[0]?.serviceId).toBe("learn");
    expect(client.capabilities.networkCalls).toBe(0);
  });

  it("never reads storage while rendering, so hydration matches the server", () => {
    const route = readFileSync(join(repoRoot, "apps", "web", "features", "learn", "learn-route.tsx"), "utf8");
    const provider = readFileSync(join(repoRoot, "apps", "web", "features", "service-workbench", "state", "workbench-provider.tsx"), "utf8");
    // A render-time storage read would render different markup on the server
    // (no storage) and the client (saved data) → hydration mismatch.
    expect(route).not.toContain("createBrowserServiceSessionStore");
    expect(route).not.toContain("store.read()");
    expect(route).toContain("resumeFromStorage");
    expect(provider).toContain("resumeFromStorage");
    expect(provider).toMatch(/resumedRef/u);
    expect(provider).toContain('type: "records/restored"');
  });

  it("keeps the route composition thin and the registry the single flip point", () => {
    const entry = getServiceRegistryEntry("learn");
    expect(entry.route).toBe("/app/learn");
    expect(entry.screenId).toBe("U2-LRN-001");
    expect(entry.renderer).toBe("domain_workspace");
    expect(entry.status).toBe("implemented");
    // U2.1 Learn landed first; U2.2 Research and U2.3 Create joined it. The
    // remaining services stay on the foundation until their slices land with
    // evidence.
    expect(getRegisteredServiceIds().filter((serviceId) => getServiceRegistryEntry(serviceId).status === "implemented")).toEqual(["learn", "research", "create"]);

    const route = readFileSync(join(repoRoot, "apps", "web", "features", "learn", "learn-route.tsx"), "utf8");
    // The route composes: it must not reach into storage internals or re-derive
    // workbench behaviour.
    expect(route).toContain("createDeterministicMockServiceClient");
    expect(route).toContain("LearnWorkspace");
    expect(route).not.toMatch(/localStorage|useReducer|createRun\(/u);
  });
});

describe("IT-WB-003 — the shared handoff path carries Learn output without Learn owning the overlay", () => {
  it("previews, confirms, and consumes a Learn → Research handoff through the workbench reducer", () => {
    const client = createDeterministicMockServiceClient();
    const ids = createServiceIdFactory("learn_to_research");
    const created = client.createSession({ serviceId: "learn", locale: "ar", scenarioId: "happy" });
    const topicModule = getLearnTopic("spaced_repetition").modules[0];
    if (topicModule === undefined) {
      throw new Error("spaced_repetition has no first module");
    }

    const bundle = client.buildHandoff({
      id: ids.next("hnd_"),
      fromServiceId: "learn",
      toServiceId: "research",
      sourceSessionId: created.session.id,
      intentSummary: `${topicModule.id} — ${topicModule.objectiveKey}`,
      selectedFields: ["services.learn.topics.spaced_repetition", "services.learn.content.sr_why_gaps.objective"],
    });
    expect(handoffBundleSchema.safeParse(bundle).success).toBe(true);
    expect(bundle.status).toBe("preview");
    expect(bundle.excludedFields).toEqual([]);

    let workbench = createInitialWorkbenchState(created.session, created.stages);
    workbench = serviceWorkbenchReducer(workbench, { type: "handoff/previewed", bundle });
    expect(workbench.handoffs[0]?.status).toBe("preview");

    workbench = serviceWorkbenchReducer(workbench, { type: "handoff/confirmed", handoffId: bundle.id, at: AT });
    expect(workbench.handoffs[0]?.status).toBe("confirmed");
    expect(workbench.handoffs[0]?.confirmedAt).toBe(AT);

    workbench = serviceWorkbenchReducer(workbench, { type: "handoff/consumed", handoffId: bundle.id, at: AT });
    expect(workbench.handoffs[0]?.status).toBe("consumed");
  });

  it("keeps the Learn workspace on the shared shell and inside the U2 boundaries", () => {
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

    const workspace = readFileSync(join(learnDir, "learn-workspace.tsx"), "utf8");
    expect(workspace).toContain("ServiceWorkbenchShell");
    expect(workspace).toContain("useServiceWorkbench");
    expect(workspace).toContain("setDomainBlock");
    expect(workspace).toContain("previewHandoff");

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      // Boundaries: no backend calls, no agent runtime, no real execution.
      expect(source, file).not.toMatch(/\bfetch\s*\(/u);
      expect(source, file).not.toContain("ExecutionReceipt");
      expect(source, file).not.toContain("AgentRun");
      expect(source, file).not.toContain("FlowRun");
      expect(source, file).not.toMatch(/Math\.random\(/u);
      expect(source, file).not.toMatch(/new Date\(\)/u);
      expect(source, file).not.toMatch(/localStorage/u);
    }
  });

  it("keeps the learn flow's own state machine independent of the run lifecycle", () => {
    // A learner can keep answering while a run is terminal, and a run can fail
    // without erasing the recorded answers: the two state machines never merge.
    const { client } = driveRun("happy");
    const created = client.createSession({ serviceId: "learn", locale: "en", scenarioId: "failed_retryable" });
    const failed = driveRun("failed_retryable");
    expect(String(failed.status)).toContain("failed");

    let workbench = createInitialWorkbenchState(created.session, created.stages);
    let learn = createInitialLearnState("en");
    const actions: LearnAction[] = [
      { type: "draft/motivation", value: "ship the slice" },
      { type: "brief/submit", at: AT },
      // Every diagnostic question must be answered before a guided path exists.
      ...getLearnTopic("spaced_repetition").diagnostic.map((question) => ({
        type: "diagnostic/answer" as const,
        questionId: question.id,
        choiceId: question.choices[1]?.id ?? null,
        skipped: false,
        at: AT,
      })),
      { type: "path/build", at: AT },
      { type: "path/confirm", at: AT },
      { type: "lesson/engage", at: AT },
    ];
    for (const action of actions) {
      learn = learnReducer(learn, action);
    }
    workbench = serviceWorkbenchReducer(workbench, { type: "domain/replaced", block: { serviceId: "learn", stateVersion: 1, payload: learn.session } });
    workbench = serviceWorkbenchReducer(workbench, { type: "storage/status", status: "memory" });

    expect(workbench.run).toBeNull();
    expect(learn.session.path).not.toBeNull();
    expect(learn.session.diagnosticAnswers).toHaveLength(getLearnTopic("spaced_repetition").diagnostic.length);
    expect(learn.session.lessonEngaged).toBe(true);
    expect(workbench.storageStatus).toBe("memory");
  });
});
