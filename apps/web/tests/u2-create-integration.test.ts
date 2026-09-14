import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ServiceEvent, ServiceRun } from "@nasaq/contracts/services";
import { createSessionStateSchema } from "@nasaq/contracts/services";
import {
  buildCreateArtifactContent,
  buildCreateArtifactRecords,
  buildServiceScenarioFixture,
  createCreateStatePreset,
  createDeterministicMockServiceClient,
  createManualServiceClock,
  createServiceIdFactory,
  draftFromArtifactContent,
} from "@nasaq/mock-api/services";
import {
  buildDemoSnapshot,
  createMemoryStorageBackend,
  createServiceSessionStore,
  demoStoreSnapshotSchema,
} from "../features/service-workbench/storage/store";
import { createInitialWorkbenchState, serviceWorkbenchReducer } from "../features/service-workbench/state/reducer";
import { getServiceRegistryEntry } from "../features/service-workbench/service-registry";
import { createInitialCreateState, createReducer, type CreateAction, type CreateReducerState } from "../features/create/state/create-reducer";

/**
 * IT-CRT-001 / IT-WB-003 — Create composes with the shared workbench.
 *
 * The integration point is the seam, not the pixels: the Create slice feeds
 * the generic session/receipt path through the same reducer and store every
 * other service uses, owns its version lineage inside a versioned domain
 * block, and survives save → snapshot → restore with its history intact. A
 * failing storage write surfaces retry without ever claiming `saved`.
 * DOM-level behaviour is covered by `tests/e2e/service-create.spec.ts`.
 */

const START = Date.parse("2026-09-12T00:00:00.000Z");
const repoRoot = join(__dirname, "..", "..", "..");
const AT = "2026-09-12T00:00:05.000Z";

function run(state: CreateReducerState, actions: CreateAction[]): CreateReducerState {
  return actions.reduce((current, action) => createReducer(current, action), state);
}

function guidedDocumentDraft(locale: "ar" | "en" = "ar"): CreateReducerState {
  let state = createInitialCreateState(locale);
  state = run(state, [
    { type: "format/select", format: "document" },
    { type: "brief/draft", field: "goal", value: locale === "ar" ? "أقنع فريق القيادة بتثبيت الجدولة." : "Convince leadership to keep scheduling." },
    { type: "brief/draft", field: "audience", value: locale === "ar" ? "فريق القيادة" : "Leadership" },
    { type: "brief/submit", at: AT },
    { type: "structure/confirm", at: AT },
    { type: "variant/select", variantId: "variant_standard" },
    { type: "variants/confirm", at: AT },
  ]);
  return { ...state, session: { ...state.session, locale } };
}

describe("IT-CRT-001 — the Create slice runs inside the shared workbench", () => {
  it("registers Create as an implemented domain workspace and mounts it through the route renderer", () => {
    const entry = getServiceRegistryEntry("create");
    expect(entry.renderer).toBe("domain_workspace");
    expect(entry.status).toBe("implemented");
    expect(entry.route).toBe("/app/create");

    const renderers = readFileSync(join(repoRoot, "apps", "web", "app", "[locale]", "app", "[service]", "service-route-renderers.tsx"), "utf8");
    expect(renderers).toContain("CreateRoute");
    // The route composition stays a thin mapping: no domain logic in app/.
    expect(renderers).not.toMatch(/crt_|createReducer/u);
  });

  it("drives the generic simulator to a terminal run whose receipt names Create's real boundaries", () => {
    const client = createDeterministicMockServiceClient();
    const clock = createManualServiceClock(START);
    const ids = createServiceIdFactory("create_happy_ar");
    const created = client.createSession({ serviceId: "create", locale: "ar", scenarioId: "happy" });
    const events: ServiceEvent[] = [];
    const runner = client.createRun({
      session: created.session,
      scenarioId: "happy",
      clock,
      stepMs: 100,
      ids,
      onEvent: (event: ServiceEvent) => events.push(event),
    });
    runner.start();
    clock.advance(20_000);

    expect(runner.terminalStatus()).toBe("completed");
    const fixtureRun = buildServiceScenarioFixture({ serviceId: "create", scenarioId: "happy", locale: "ar" }).run;
    if (fixtureRun === null) throw new Error("fixture run missing");
    const run: ServiceRun = fixtureRun;
    const receipt = client.buildReceipt({ session: created.session, run, scenarioId: "happy", locale: "ar", ids, storage: "session_storage" });
    expect(receipt.serviceId).toBe("create");
    expect(receipt.mode).toBe("explicit_simulation");
    expect(receipt.networkCalls).toBe(0);
    expect(receipt.productAgentRuntime).toBe("not_implemented");
    // Create's disclosure names its own simulation surface and its own gaps.
    expect(receipt.simulated[0]).toContain("البنية والبدائل");
    expect(receipt.notPerformed.some((line) => /توليد الصور|image generation/iu.test(line))).toBe(true);
    expect(receipt.notPerformed.some((line) => /PDF|تصدير/u.test(line))).toBe(true);
  });

  it("round-trips a draft through the artifact content and back without losing structure", () => {
    for (const locale of ["ar", "en"] as const) {
      const state = guidedDocumentDraft(locale);
      if (state.session.draft === null) throw new Error("no draft");
      const content = buildCreateArtifactContent(state.session.draft);
      expect(content.kind).toBe("creative_document");
      const rebuilt = draftFromArtifactContent(content, locale);
      expect(rebuilt.format).toBe("document");
      if (rebuilt.format !== "document" || state.session.draft?.format !== "document") throw new Error("not a document");
      expect(rebuilt.title).toBe(state.session.draft.title);
      expect(rebuilt.blocks).toHaveLength(state.session.draft.blocks.length);
      expect(rebuilt.outline).toEqual(state.session.draft.outline);
    }
  });

  it("deck and visual drafts round-trip their notes, alt text, and variant identity", () => {
    const deckSession = createCreateStatePreset({ locale: "ar", now: AT, preset: "deck_draft" });
    if (deckSession.draft === null) throw new Error("no deck draft");
    const deckContent = buildCreateArtifactContent(deckSession.draft);
    if (deckContent.kind !== "creative_deck") throw new Error("not a deck");
    const deckRebuilt = draftFromArtifactContent(deckContent, "ar");
    if (deckRebuilt.format !== "deck") throw new Error("not a deck");
    expect(deckRebuilt.slides.map((slide) => slide.notes)).toEqual(deckSession.draft.format === "deck" ? deckSession.draft.slides.map((slide) => slide.notes) : []);

    const visualSession = createCreateStatePreset({ locale: "en", now: AT, preset: "visual_missing_alt" });
    if (visualSession.draft === null) throw new Error("no visual draft");
    const visualContent = buildCreateArtifactContent(visualSession.draft);
    if (visualContent.kind !== "visual_concept") throw new Error("not a visual");
    expect(visualContent.conceptId).toBe("vis_orbit");
    expect(visualContent.altText).toBe("");
    expect(visualContent.ratio).toBe("ratio_1_1");
    const visualRebuilt = draftFromArtifactContent(visualContent, "en");
    if (visualRebuilt.format !== "visual") throw new Error("not a visual");
    expect(visualRebuilt.altText).toBe("");
    expect(visualRebuilt.variantId).toBe("vis_orbit");
  });

  it("builds version records with a growing lineage and bilingual change summaries", () => {
    const client = createDeterministicMockServiceClient();
    const created = client.createSession({ serviceId: "create", locale: "ar", scenarioId: "happy" });
    const ids = createServiceIdFactory("create_save_ar");
    const state = guidedDocumentDraft("ar");
    if (state.session.draft === null) throw new Error("no draft");

    const first = buildCreateArtifactRecords({
      session: created.session,
      create: { draft: state.session.draft, locale: "ar" },
      ids,
      at: START,
      reason: "first",
      createdBy: "user",
    });
    expect(first.version.versionNumber).toBe(1);
    expect(first.version.changeSummary).toContain("الإصدار الأول");

    const second = buildCreateArtifactRecords({
      session: created.session,
      create: { draft: state.session.draft, locale: "ar" },
      ids,
      at: START + 1000,
      artifact: first.artifact,
      reason: "save",
      createdBy: "user",
    });
    expect(second.artifact.id).toBe(first.artifact.id);
    expect(second.version.versionNumber).toBe(2);
    expect(second.version.parentVersionId).toBe(first.version.id);
    expect(second.artifact.versionIds).toHaveLength(2);
  });
});

describe("IT-CRT-001 / UT-STO — save, snapshot, restore through the shared store", () => {
  it("persists the Create domain block and restores the exact stage and history", () => {
    const backend = createMemoryStorageBackend();
    const store = createServiceSessionStore({ backend, kind: "session" });

    // Build a saved document session with two versions.
    const client = createDeterministicMockServiceClient();
    const created = client.createSession({ serviceId: "create", locale: "ar", scenarioId: "happy" });
    let state = guidedDocumentDraft("ar");
    state = run(state, [
      { type: "save/begin", at: AT, workbenchSession: created.session },
      { type: "save/succeeded", at: AT },
      { type: "block/add", blockType: "paragraph" },
      { type: "save/begin", at: AT, workbenchSession: created.session },
      { type: "save/succeeded", at: AT },
    ]);
    expect(state.session.versions).toHaveLength(2);
    expect(state.session.saveState).toBe("saved");

    // The workbench reducer receives the domain block exactly as Create built it.
    const workbench = createInitialWorkbenchState(created.session, created.stages);
    const withBlock = serviceWorkbenchReducer(workbench, {
      type: "domain/replaced",
      block: { serviceId: "create", stateVersion: 1, payload: state.session },
    });
    const snapshot = buildDemoSnapshot({
      savedAt: AT,
      sessions: [withBlock.session],
      artifacts: withBlock.artifacts,
      receipts: withBlock.receipts,
      handoffs: withBlock.handoffs,
      domains: withBlock.domains,
    });
    const write = store.write(snapshot);
    expect(write.ok).toBe(true);

    // A fresh read parses the snapshot and hands Create back its state.
    const read = store.read();
    expect(read.status).toBe("session");
    const parsed = demoStoreSnapshotSchema.parse(read.snapshot);
    const block = parsed.domains?.find((candidate) => candidate.serviceId === "create");
    expect(block).toBeDefined();
    if (block === undefined) throw new Error("no create block");
    expect(block.payload.versions).toHaveLength(2);
    expect(createSessionStateSchema.safeParse(block.payload).success).toBe(true);

    const restoredState = createInitialCreateState("ar", block.payload);
    expect(restoredState.session.versions).toHaveLength(2);
    expect(restoredState.session.draft?.format).toBe("document");
    expect(restoredState.ui.stage).toBe("crt_edit");
  });

  it("a rejected write surfaces the failure and a retry rewrites the same version", () => {
    // Quota-style failure: every setItem throws until the "space" is cleared.
    let failing = true;
    const backend = createMemoryStorageBackend();
    const explodingBackend = {
      getItem: backend.getItem,
      setItem: (_key: string, _value: string) => {
        if (failing) throw new Error("QuotaExceededError");
        backend.setItem(_key, _value);
      },
      removeItem: backend.removeItem,
    };
    const store = createServiceSessionStore({ backend: explodingBackend, kind: "session" });

    const client = createDeterministicMockServiceClient();
    const created = client.createSession({ serviceId: "create", locale: "ar", scenarioId: "happy" });
    let state = guidedDocumentDraft("ar");
    state = run(state, [{ type: "save/begin", at: AT, workbenchSession: created.session }]);

    const workbench = createInitialWorkbenchState(created.session, created.stages);
    const withBlock = serviceWorkbenchReducer(workbench, {
      type: "domain/replaced",
      block: { serviceId: "create", stateVersion: 1, payload: state.session },
    });
    const snapshot = buildDemoSnapshot({
      savedAt: AT,
      sessions: [withBlock.session],
      artifacts: withBlock.artifacts,
      receipts: withBlock.receipts,
      handoffs: withBlock.handoffs,
      domains: withBlock.domains,
    });

    const failedWrite = store.write(snapshot);
    expect(failedWrite.ok).toBe(false);
    // The reducer records the honest failure; nothing claims saved.
    state = run(state, [{ type: "save/failed" }]);
    expect(state.session.saveState).toBe("storage_failed");
    expect(state.session.savedVersionNumber).toBeNull();

    // Retry after the failure is cleared: the same pending version is written.
    state = run(state, [{ type: "save/retry", at: AT, workbenchSession: created.session }]);
    failing = false;
    const retried = store.write(snapshot);
    expect(retried.ok).toBe(true);
    state = run(state, [{ type: "save/succeeded", at: AT }]);
    expect(state.session.saveState).toBe("saved");
    expect(state.session.versions).toHaveLength(1);
  });
});

describe("U2-PA — Create keeps the product-agent boundary explicit", () => {
  it("names its types inside the service namespace and never widens shared enums", () => {
    const contracts = readFileSync(join(repoRoot, "packages", "contracts", "src", "services", "create.ts"), "utf8");
    expect(contracts).toContain("createSessionStateSchema");
    expect(contracts).toContain("serviceArtifactVersionSchema");
    expect(contracts).not.toMatch(/AgentSession|AgentRuntime|PromptBundle|MemoryPolicy|ToolGrant|ExecutionReceipt/u);
    expect(contracts).not.toContain("runStatusSchema");
  });

  it("renders no live-generation or export claims anywhere in the Create feature", () => {
    const files = [
      "create-workspace.tsx",
      "create-route.tsx",
      join("components", "create-surfaces.tsx"),
      join("components", "document-editor.tsx"),
      join("components", "deck-editor.tsx"),
      join("components", "visual-editor.tsx"),
    ];
    for (const file of files) {
      const source = readFileSync(join(repoRoot, "apps", "web", "features", "create", file), "utf8");
      expect(source).not.toMatch(/eval\(|new Function|dangerouslySetInnerHTML|srcdoc|href="javascript:/u);
      expect(source).not.toMatch(/generated image|تم توليد الصورة|سيعمل التصدير/u);
    }
  });
});
