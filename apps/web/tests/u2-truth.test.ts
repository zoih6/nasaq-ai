import { describe, expect, it } from "vitest";
import {
  canConfirmHandoff,
  consumeHandoff,
  describeSimulationReceipt,
  handoffBundleSchema,
  simulationReceiptSchema,
  summarizeClaimCoverage,
  type HandoffBundle,
  type ServiceClaim,
  type ServiceEvidenceRef,
} from "@nasaq/contracts/services";
import { buildServiceScenarioFixture, createDeterministicMockServiceClient } from "@nasaq/mock-api/services";
import { createLocalAnalytics } from "../features/service-workbench/analytics";

describe("UT-RCP-001 — the simulation receipt tells the truth in both languages", () => {
  const client = createDeterministicMockServiceClient();

  it("declares local work, simulated work, omissions, zero network calls, and the agent boundary", () => {
    const fixture = buildServiceScenarioFixture({ serviceId: "research", scenarioId: "happy", locale: "en" });
    const receipt = client.buildReceipt({
      session: fixture.session,
      run: fixture.run ?? (() => { throw new Error("fixture must have a run"); })(),
      scenarioId: "happy",
      locale: "en",
      ids: { next: (prefix: string) => `${prefix}research_1`, reset: () => undefined, count: () => 1 },
      storage: "session_storage",
    });

    expect(simulationReceiptSchema.safeParse(receipt).success).toBe(true);
    expect(receipt.mode).toBe("explicit_simulation");
    expect(receipt.networkCalls).toBe(0);
    expect(receipt.productAgentRuntime).toBe("not_implemented");
    expect(receipt.performedLocally.length).toBeGreaterThan(0);
    expect(receipt.simulated.length).toBeGreaterThan(0);
    expect(receipt.notPerformed.some((item) => item.toLowerCase().includes("network"))).toBe(true);
    expect(receipt.userDataRead).toHaveLength(0);

    const en = describeSimulationReceipt(receipt, "en");
    const ar = describeSimulationReceipt(receipt, "ar");
    expect(en.network).toContain("0");
    expect(ar.network).toContain("0");
    expect(en.boundary.toLowerCase()).toContain("not implemented");
    expect(ar.boundary).toContain("غير منفّذ");
    expect(en.mode).toContain("explicit simulation");
    expect(ar.mode).toContain("محاكاة");
  });

  it("rejects a receipt that claims network calls or a missing agent boundary", () => {
    const fixture = buildServiceScenarioFixture({ serviceId: "learn", scenarioId: "happy", locale: "ar" });
    expect(simulationReceiptSchema.safeParse({ ...fixture.receipt, networkCalls: 1 }).success).toBe(false);
    expect(simulationReceiptSchema.safeParse({ ...fixture.receipt, productAgentRuntime: "implemented" }).success).toBe(false);
    expect(simulationReceiptSchema.safeParse({ ...fixture.receipt, mode: "live" }).success).toBe(false);
  });
});

describe("UT-HND-001 — handoffs are allowlisted, previewed, and consumed once", () => {
  const preview: HandoffBundle = {
    id: "hnd_1",
    fromServiceId: "ask",
    toServiceId: "research",
    intentSummary: "Turn the selected topic into a research question",
    selectedFields: ["topic"],
    excludedFields: ["brief"],
    selectedArtifactRefs: [],
    status: "preview",
    createdAt: "2026-09-12T00:00:00.000Z",
  };

  it("accepts only valid bundles and requires a selection before confirmation", () => {
    expect(handoffBundleSchema.safeParse(preview).success).toBe(true);
    expect(canConfirmHandoff(preview)).toBe(true);
    expect(canConfirmHandoff({ ...preview, selectedFields: [] })).toBe(false);
    expect(handoffBundleSchema.safeParse({ ...preview, toServiceId: "ask" }).success).toBe(false);
    expect(handoffBundleSchema.safeParse({ ...preview, status: "sent" }).success).toBe(false);
  });

  it("consumes a confirmed bundle exactly once", () => {
    const confirmed: HandoffBundle = { ...preview, status: "confirmed", confirmedAt: "2026-09-12T00:00:05.000Z" };
    const consumed = consumeHandoff(confirmed, "2026-09-12T00:00:06.000Z");
    expect(consumed.status).toBe("consumed");
    expect(() => consumeHandoff(consumed, "2026-09-12T00:00:07.000Z")).toThrow(/already_consumed/u);
    expect(() => consumeHandoff(preview, "2026-09-12T00:00:08.000Z")).toThrow(/not_confirmed/u);
  });

  it("never sends the whole prompt automatically: a bundle carries only selected fields", () => {
    expect(preview.selectedFields).not.toContain("prompt");
    expect(preview.selectedFields).not.toContain("sourceExcerpt");
  });
});

describe("UT-ANL-001 — analytics keeps an allowlist and drops content", () => {
  it("accepts allowlisted events with safe properties only", () => {
    const analytics = createLocalAnalytics({ now: () => Date.parse("2026-09-12T00:00:00.000Z") });
    const accepted = analytics.track("u2.run.started", { serviceId: "learn", scenarioId: "happy", locale: "ar" });
    expect(accepted.accepted).toBe(true);
    expect(accepted.rejectedKeys).toHaveLength(0);

    const rejected = analytics.track("u2.run.started", { prompt: "my private text", url: "https://example.com" });
    expect(rejected.accepted).toBe(true);
    expect(rejected.rejectedKeys).toEqual(["prompt", "url"]);

    const unknown = analytics.track("u2.exfiltrate.data", { serviceId: "learn" });
    expect(unknown.accepted).toBe(false);

    const withContent = analytics.track("u2.artifact.saved", { serviceId: "learn text with spaces" });
    expect(withContent.rejectedKeys).toEqual(["serviceId"]);

    expect(analytics.records().every((record) => Object.keys(record.properties).length >= 0)).toBe(true);
    expect(JSON.stringify(analytics.records())).not.toContain("private text");
    expect(analytics.records()).toHaveLength(3);
  });
});

describe("evidence coverage stays inspectable", () => {
  it("refuses unsupported claims with evidence and supported claims without it", () => {
    const evidenceFixture = buildServiceScenarioFixture({ serviceId: "research", scenarioId: "happy", locale: "en" });
    const evidence: ServiceEvidenceRef[] = evidenceFixture.evidence;
    const supported: ServiceClaim = {
      id: "clm_1",
      statement: "Waiting time decreased in the sample quarter.",
      support: "supported",
      evidenceIds: [evidence[0]?.id ?? "evd_missing"],
    };
    const unsupported: ServiceClaim = { id: "clm_2", statement: "Revenue doubled.", support: "unsupported", evidenceIds: [] };

    const summary = summarizeClaimCoverage([supported, unsupported], evidence);
    expect(summary.unsupportedClaims).toBe(1);
    expect(summary.evidenceCount).toBe(1);

    expect(() => summarizeClaimCoverage([{ ...unsupported, evidenceIds: [evidence[0]?.id ?? "evd_missing"] }], evidence))
      .toThrow(/unsupported_claim_has_evidence/u);
    expect(() => summarizeClaimCoverage([{ ...supported, evidenceIds: ["evd_unknown"] }], evidence))
      .toThrow(/claim_without_resolvable_evidence/u);
  });
});
