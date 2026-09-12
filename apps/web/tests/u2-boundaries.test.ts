import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getRegisteredServiceIds, getServiceRegistryEntry, serviceGatewayRoute } from "../features/service-workbench/service-registry";
import { createDeterministicMockServiceClient } from "@nasaq/mock-api/services";

/**
 * Source-level checks for the mandatory U2 product-agent boundary
 * (U2-PA-001..005, U2-PA-008, U2-PA-012).
 *
 * These assertions read the repository, so a future change that widens U2 into
 * agent runtime, code execution, or a backend call fails the suite instead of
 * passing review by accident.
 */

const repoRoot = join(__dirname, "..", "..", "..");
const u2Roots = [
  join(repoRoot, "packages", "contracts", "src", "services"),
  join(repoRoot, "packages", "mock-api", "src", "services"),
  join(repoRoot, "packages", "i18n", "src", "services"),
  join(repoRoot, "apps", "web", "features", "service-workbench"),
  join(repoRoot, "apps", "web", "features", "service-foundation"),
];

/** Comments explain these rules, so the scan reads code only. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/(^|[^:])\/\/[^\n]*/gu, "$1");
}

function listSourceFiles(root: string): string[] {
  const entries: string[] = [];
  for (const name of readdirSync(root)) {
    const full = join(root, name);
    if (statSync(full).isDirectory()) {
      entries.push(...listSourceFiles(full));
      continue;
    }
    if (name.endsWith(".ts") || name.endsWith(".tsx")) entries.push(full);
  }
  return entries;
}

const u2Files = u2Roots.flatMap(listSourceFiles);

describe("U2-PA-001/002/003 — bounded contexts and naming", () => {
  it("keeps every U2 type inside the service namespace", () => {
    for (const file of u2Files) {
      const source = stripComments(readFileSync(file, "utf8"));
      // U2 must not import or re-declare agent/flow runtime types.
      expect(source, file).not.toMatch(/\bAgentRun\b|\bFlowRun\b|agentDefinitionSchema|\bExecutionReceipt\b/u);
      expect(source, file).not.toMatch(/^\s*(export\s+)?type\s+(RunStatus|AgentSession|AgentRuntime|PromptBundle|MemoryPolicy|ToolGrant|ExecutionReceipt)\b/mu);
    }
  });

  it("never widens the shared run status enum", () => {
    const contractsIndex = readFileSync(join(repoRoot, "packages", "contracts", "src", "index.ts"), "utf8");
    expect(contractsIndex).not.toContain("cancel_requested");
    expect(contractsIndex).not.toContain("review_ready");
    const servicesEnums = readFileSync(join(repoRoot, "packages", "contracts", "src", "services", "enums.ts"), "utf8");
    expect(servicesEnums).toContain("serviceRunStatusSchema");
    expect(servicesEnums).not.toMatch(/export const runStatusSchema/u);
  });

  it("does not use random or time-based success in the simulator", () => {
    for (const file of u2Files) {
      const source = stripComments(readFileSync(file, "utf8"));
      expect(source, file).not.toMatch(/Math\.random/u);
      expect(source, file).not.toMatch(/setTimeout\([^)]*,\s*820/u);
    }
  });
});

describe("U2-PA-008 — no code execution surface", () => {
  it("contains no eval, Function constructor, or executable srcdoc", () => {
    for (const file of u2Files) {
      const source = stripComments(readFileSync(file, "utf8"));
      expect(source, file).not.toMatch(/\beval\s*\(/u);
      expect(source, file).not.toMatch(/new\s+Function\s*\(/u);
      expect(source, file).not.toMatch(/dangerouslySetInnerHTML/u);
      expect(source, file).not.toMatch(/srcdoc=/u);
      expect(source, file).not.toMatch(/child_process|execSync|spawnSync/u);
    }
  });

  it("never reads local file content in the U2 code paths", () => {
    for (const file of u2Files) {
      const source = stripComments(readFileSync(file, "utf8"));
      expect(source, file).not.toMatch(/FileReader|arrayBuffer\(|\.text\(\)\s*;?\s*$/mu);
      expect(source, file).not.toMatch(/dangerouslySetInnerHTML/u);
    }
  });
});

describe("U2-PA-005/012 — truth disclosure is present in the foundation", () => {
  it("declares the capability boundary on the mock client", () => {
    const client = createDeterministicMockServiceClient();
    expect(client.capabilities.kind).toBe("deterministic_mock");
    expect(client.capabilities.mode).toBe("explicit_simulation");
    expect(client.capabilities.networkCalls).toBe(0);
    expect(client.capabilities.fileContentRead).toBe(false);
    expect(client.capabilities.codeExecution).toBe(false);
    expect(client.capabilities.productAgentRuntime).toBe("not_implemented");
  });

  it("states the product-agent boundary in every workbench receipt panel", () => {
    const panel = readFileSync(join(repoRoot, "apps", "web", "features", "service-workbench", "components", "workbench-overlays.tsx"), "utf8");
    expect(panel).toContain("boundaryStatement");
    const i18n = readFileSync(join(repoRoot, "packages", "i18n", "src", "services", "index.ts"), "utf8");
    expect(i18n).toContain("Product Agent Backend/Runtime is not implemented in this wave.");
    expect(i18n).toContain("غير منفّذ في هذه الموجة");
  });
});

describe("U2-CORE-001/002 — explicit registry, shared gateway", () => {
  it("registers exactly the six services and keeps Ask outside the domain registry", () => {
    expect([...getRegisteredServiceIds()]).toEqual(["learn", "research", "create", "code", "analyze", "explore"]);
    expect(serviceGatewayRoute).toBe("/app/chat");
    for (const serviceId of getRegisteredServiceIds()) {
      const entry = getServiceRegistryEntry(serviceId);
      expect(entry.route).toBe(`/app/${serviceId}`);
      expect(entry.screenId).toMatch(/^U2-[A-Z]{3}-001$/u);
      expect(entry.routeId).toMatch(/^R-U2-[A-Z]{3}-001$/u);
      expect(entry.status).toBe("foundation");
    }
  });

  it("keeps the foundation surface outside the product service routes", () => {
    const page = readFileSync(join(repoRoot, "apps", "web", "app", "[locale]", "preview", "service-foundation", "page.tsx"), "utf8");
    expect(page).toContain("robots: { index: false, follow: false }");
    const harness = readFileSync(join(repoRoot, "apps", "web", "features", "service-foundation", "foundation-harness.tsx"), "utf8");
    expect(harness).toContain("NOT a product service");
  });
});

describe("U2-CORE-015 — no conditional monolith", () => {
  it("keeps the service registry free of serviceId branching and boolean props", () => {
    const registry = readFileSync(join(repoRoot, "apps", "web", "features", "service-workbench", "service-registry.ts"), "utf8");
    expect(registry).not.toMatch(/serviceId\s*===\s*"/u);
    const shell = readFileSync(join(repoRoot, "apps", "web", "features", "service-workbench", "components", "service-workbench-shell.tsx"), "utf8");
    expect(shell).not.toMatch(/serviceId\s*===\s*"/u);
    expect(shell).not.toMatch(/hasSources|showDiff|isMap|isLearn|isResearch/u);
  });

  it("keeps the legacy workspace untouched by the foundation", () => {
    const legacy = readFileSync(join(repoRoot, "apps", "web", "components", "universal", "service-workspace.tsx"), "utf8");
    expect(legacy).not.toContain("u2-");
    expect(legacy).not.toContain("@/features/service-workbench");
  });
});
