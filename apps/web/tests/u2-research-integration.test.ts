import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { handoffBundleSchema, researchSessionStateSchema } from "@nasaq/contracts/services";
import type { ServiceEvent, ServiceRun } from "@nasaq/contracts/services";
import {
  buildServiceScenarioFixture,
  createDeterministicMockServiceClient,
  createManualServiceClock,
  createResearchStatePreset,
  createServiceIdFactory,
} from "@nasaq/mock-api/services";
import {
  buildDemoSnapshot,
  createMemoryStorageBackend,
  createServiceSessionStore,
  demoStoreSnapshotSchema,
} from "../features/service-workbench/storage/store";
import { createInitialWorkbenchState, serviceWorkbenchReducer } from "../features/service-workbench/state/reducer";
import { getServiceRegistryEntry, getRegisteredServiceIds } from "../features/service-workbench/service-registry";
import { researchReducer, createInitialResearchState, type ResearchAction } from "../features/research/state/research-reducer";

/**
 * IT-RSH-001 / IT-WB-003 — Research composes with the shared workbench.
 *
 * The integration point is the seam, not the pixels: the Research slice feeds
 * the generic session/run/receipt/handoff path through the same reducer and
 * store that every other service uses, and owns nothing that belongs to the
 * workbench. DOM-level behaviour is covered by `tests/e2e/service-research.spec.ts`.
 */

const START = Date.parse("2026-09-12T00:00:00.000Z");
const repoRoot = join(__dirname, "..", "..", "..");
const AT = "2026-09-12T00:00:05.000Z";

/** The fixture run is a complete `ServiceRun`, so tests never hand-build one. */
function requireFixtureRun(scenarioId: "happy" | "failed_retryable"): ServiceRun {
  const run = buildServiceScenarioFixture({ serviceId: "research", scenarioId, locale: "ar" }).run;
  if (run === null) {
    throw new Error(`fixture ${scenarioId} has no run`);
  }
  return run;
}

function driveRun(scenarioId: "happy" | "needs_input" | "failed_retryable") {
  const client = createDeterministicMockServiceClient();
  const clock = createManualServiceClock(START);
  const ids = createServiceIdFactory(`research_${scenarioId}_ar`);
  const created = client.createSession({ serviceId: "research", locale: "ar", scenarioId });
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

describe("IT-RSH-001 — the Research slice runs inside the shared workbench without owning its receipts", () => {
  it("produces a terminal run, one artifact, and one receipt through the shared client", () => {
    const { client, ids, created, runner, events, status } = driveRun("happy");
    expect(status).toBe("completed");
    const terminal = events.at(-1);
    expect(terminal?.name).toBe("service.run.status_changed");
    expect((terminal?.payload as { status?: string }).status).toBe("completed");
    expect(events.every((event) => event.streamId === runner.streamId)).toBe(true);

    const run = requireFixtureRun("happy");
    const { artifact, version } = client.buildArtifact({ session: created.session, run, locale: "ar", ids });
    expect(artifact.kind).toBe("research_report");
    expect(artifact.serviceId).toBe("research");
    if (version.content.kind !== "research_report") {
      throw new Error("artifact content is not a research report");
    }
    expect(version.content.limitations.length).toBeGreaterThan(0);

    const receipt = client.buildReceipt({ session: created.session, run, scenarioId: "happy", locale: "ar", ids, storage: "session_storage" });
    expect(receipt.runId).toBe(run.id);
    expect(receipt.serviceId).toBe("research");
    expect(receipt.mode).toBe("explicit_simulation");
    expect(receipt.networkCalls).toBe(0);
    expect(receipt.productAgentRuntime).toBe("not_implemented");
    expect(receipt.persistentStorage).toBe("session_storage");
    expect(receipt.simulated.length).toBeGreaterThan(0);
    expect(receipt.notPerformed.length).toBeGreaterThan(0);
    expect(version.artifactId).toBe(artifact.id);
  });

  it("keeps the Research domain block and the shared records in one versioned snapshot", () => {
    const { client, ids, created } = driveRun("happy");
    const run = requireFixtureRun("happy");
    const { artifact, version } = client.buildArtifact({ session: created.session, run, locale: "ar", ids });
    const receipt = client.buildReceipt({ session: created.session, run, scenarioId: "happy", locale: "ar", ids, storage: "session_storage" });

    let workbench = createInitialWorkbenchState(created.session, created.stages);
    expect(workbench.domains).toHaveLength(0);

    const researchState = createResearchStatePreset({ locale: "ar", now: AT, preset: "sources_ready", topicId: "waiting_time_q3", mode: "guided" });
    workbench = serviceWorkbenchReducer(workbench, { type: "domain/replaced", block: { serviceId: "research", stateVersion: 1, payload: researchState } });
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
    // Round-trip: the workbench reads the service record, the Research slice
    // reads its own block, and neither one parses the other's payload.
    expect(read.snapshot?.artifacts[0]?.kind).toBe("research_report");
    const block = read.snapshot?.domains?.find((candidate) => candidate.serviceId === "research");
    expect(block?.stateVersion).toBe(1);
    expect(researchSessionStateSchema.safeParse(block?.payload).success).toBe(true);
    expect(block?.payload.activity.status).toBe("done");
    expect(block?.payload.evidenceIds.length).toBeGreaterThan(0);
  });

  it("restores saved demo data through one explicit workbench action", () => {
    const { client, created } = driveRun("happy");
    const researchState = createResearchStatePreset({ locale: "en", now: AT, preset: "report_partial", topicId: "waiting_time_q3", mode: "guided" });
    const snapshot = buildDemoSnapshot({
      savedAt: AT,
      sessions: [{ ...created.session, artifactIds: [] }],
      artifacts: [],
      receipts: [],
      handoffs: [],
      domains: [{ serviceId: "research", stateVersion: 1, payload: researchState }],
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
    expect(workbench.domains[0]?.serviceId).toBe("research");
    expect(client.capabilities.networkCalls).toBe(0);
    // The restored block lands on the stage its recorded facts support.
    const restored = createInitialResearchState("en", researchState);
    expect(restored.ui.stage).toBe("rsh_report_edit");
  });

  it("never reads storage while rendering, so hydration matches the server", () => {
    const route = readFileSync(join(repoRoot, "apps", "web", "features", "research", "research-route.tsx"), "utf8");
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
    const entry = getServiceRegistryEntry("research");
    expect(entry.route).toBe("/app/research");
    expect(entry.screenId).toBe("U2-RSH-001");
    expect(entry.renderer).toBe("domain_workspace");
    expect(entry.status).toBe("implemented");
    expect(getRegisteredServiceIds().filter((serviceId) => getServiceRegistryEntry(serviceId).status === "implemented")).toEqual(["learn", "research", "create"]);

    const route = readFileSync(join(repoRoot, "apps", "web", "features", "research", "research-route.tsx"), "utf8");
    // The route composes: it must not reach into storage internals or re-derive
    // workbench behaviour.
    expect(route).toContain("createDeterministicMockServiceClient");
    expect(route).toContain("ResearchWorkspace");
    expect(route).not.toMatch(/localStorage|useReducer|createRun\(/u);
  });
});

describe("IT-WB-003 — the shared handoff path carries Research output without Research owning the overlay", () => {
  it("previews, confirms, and consumes a Research → Create handoff through the workbench reducer", () => {
    const client = createDeterministicMockServiceClient();
    const ids = createServiceIdFactory("research_to_create");
    const created = client.createSession({ serviceId: "research", locale: "ar", scenarioId: "happy" });

    const bundle = client.buildHandoff({
      id: ids.next("hnd_"),
      fromServiceId: "research",
      toServiceId: "create",
      sourceSessionId: created.session.id,
      intentSummary: "waiting_time_q3 — أثر زمن الانتظار على رضا العملاء",
      selectedFields: ["question", "claims"],
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

  it("keeps the Research workspace on the shared shell and inside the U2 boundaries", () => {
    const researchDir = join(repoRoot, "apps", "web", "features", "research");
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
    walk(researchDir);

    const workspace = readFileSync(join(researchDir, "research-workspace.tsx"), "utf8");
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

  it("keeps the research flow's own state machine independent of the run lifecycle", () => {
    // A researcher can keep excluding sources while a run is terminal, and a
    // run can fail without erasing the recorded plan: the two state machines
    // never merge.
    const { client } = driveRun("happy");
    const created = client.createSession({ serviceId: "research", locale: "en", scenarioId: "failed_retryable" });
    const failed = driveRun("failed_retryable");
    expect(String(failed.status)).toContain("failed");

    let workbench = createInitialWorkbenchState(created.session, created.stages);
    let research = createInitialResearchState("en", createResearchStatePreset({ locale: "en", now: AT, preset: "sources_ready", topicId: "waiting_time_q3", mode: "guided" }));

    const actions: ResearchAction[] = [
      { type: "source/exclude-preview", sourceId: "src_survey_csat" },
      { type: "source/exclude-apply", at: AT },
    ];
    for (const action of actions) {
      research = researchReducer(research, action);
    }
    workbench = serviceWorkbenchReducer(workbench, { type: "domain/replaced", block: { serviceId: "research", stateVersion: 1, payload: research.session } });
    workbench = serviceWorkbenchReducer(workbench, { type: "storage/status", status: "memory" });

    expect(workbench.run).toBeNull();
    expect(research.session.approvedPlanVersion).toBe(1);
    expect(research.session.sources.find((source) => source.id === "src_survey_csat")?.excluded).toBe(true);
    // The exclusion removed the survey evidence from the coverage set.
    expect(research.session.evidenceIds).not.toContain("evd_survey_csat");
    expect(workbench.storageStatus).toBe("memory");
  });
});
