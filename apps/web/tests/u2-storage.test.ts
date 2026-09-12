import { describe, expect, it } from "vitest";
import { buildServiceScenarioFixture } from "@nasaq/mock-api/services";
import { serviceSessionSchema } from "@nasaq/contracts/services";
import {
  buildDemoSnapshot,
  createMemoryStorageBackend,
  createServiceSessionStore,
  demoStoreKey,
  demoStoreSnapshotSchema,
  demoStoreVersion,
} from "../features/service-workbench/storage/store";

const fixture = buildServiceScenarioFixture({ serviceId: "learn", scenarioId: "happy", locale: "ar" });
const savedAt = "2026-09-12T06:00:00.000Z";

function snapshot() {
  return buildDemoSnapshot({
    savedAt,
    sessions: [fixture.session],
    artifacts: fixture.artifact ? [fixture.artifact] : [],
    receipts: [fixture.receipt],
    handoffs: [],
  });
}

describe("UT-STO-001 — memory and session adapters save, load, version, and clear", () => {
  it("writes, reads, and clears a versioned snapshot", () => {
    const store = createServiceSessionStore({ backend: createMemoryStorageBackend(), kind: "session" });
    expect(store.read()).toEqual({ snapshot: null, status: "session" });

    const result = store.write(snapshot());
    expect(result.ok).toBe(true);
    const read = store.read();
    expect(read.status).toBe("session");
    expect(read.snapshot?.version).toBe(demoStoreVersion);
    expect(read.snapshot?.sessions[0]?.id).toBe(fixture.session.id);
    expect(serviceSessionSchema.safeParse(read.snapshot?.sessions[0]).success).toBe(true);

    store.clear();
    expect(store.read().snapshot).toBeNull();
  });

  it("keeps the memory adapter in memory only", () => {
    const store = createServiceSessionStore({ backend: createMemoryStorageBackend(), kind: "memory" });
    store.write(snapshot());
    expect(store.read().status).toBe("memory");
    expect(store.kind).toBe("memory");
  });

  it("never stores records the schema does not declare", () => {
    const withExtra = { ...snapshot(), secrets: ["token"], fileBytes: "AAAA" };
    expect(demoStoreSnapshotSchema.safeParse(withExtra).success).toBe(true);
    const parsed = demoStoreSnapshotSchema.parse(withExtra);
    expect("secrets" in parsed).toBe(false);
    expect("fileBytes" in parsed).toBe(false);
  });
});

describe("UT-STO-002 — corrupt data, unknown versions, and quota failures recover honestly", () => {
  it("clears corrupt JSON and reports recovery", () => {
    const backend = createMemoryStorageBackend({ [demoStoreKey]: "{not json" });
    const store = createServiceSessionStore({ backend, kind: "session" });
    const read = store.read();
    expect(read.snapshot).toBeNull();
    expect(read.status).toBe("corrupt_recovered");
    expect(backend.getItem(demoStoreKey)).toBeNull();
  });

  it("clears an unknown schema version instead of migrating silently", () => {
    const stale = JSON.stringify({ ...snapshot(), version: 99 });
    const backend = createMemoryStorageBackend({ [demoStoreKey]: stale });
    const store = createServiceSessionStore({ backend, kind: "session" });
    expect(store.read().status).toBe("corrupt_recovered");
    expect(backend.getItem(demoStoreKey)).toBeNull();
  });

  it("reports quota failure without pretending the save succeeded", () => {
    const store = createServiceSessionStore({
      backend: {
        getItem: () => null,
        setItem: () => { throw new Error("QuotaExceededError"); },
        removeItem: () => undefined,
      },
      kind: "session",
    });
    const result = store.write(snapshot());
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("unreachable");
    expect(result.status).toBe("quota_exceeded");
  });

  it("refuses oversized snapshots before touching the backend", () => {
    let writes = 0;
    const store = createServiceSessionStore({
      backend: {
        getItem: () => null,
        setItem: () => { writes += 1; },
        removeItem: () => undefined,
      },
      kind: "session",
    });
    const big = {
      ...snapshot(),
      receipts: Array.from({ length: 24 }, (_, index) => ({
        ...fixture.receipt,
        id: `sim_big_${index}`,
        notPerformed: Array.from({ length: 24 }, (_, inner) => `${"x".repeat(4000)}_${inner}`),
        performedLocally: Array.from({ length: 24 }, (_, inner) => `${"y".repeat(4000)}_${inner}`),
      })),
    };
    const result = store.write(big);
    expect(result.ok).toBe(false);
    expect(writes).toBe(0);
  });

  it("degrades to unavailable when reading the backend throws", () => {
    const store = createServiceSessionStore({
      backend: {
        getItem: () => { throw new Error("SecurityError"); },
        setItem: () => undefined,
        removeItem: () => undefined,
      },
      kind: "session",
    });
    expect(store.read()).toEqual({ snapshot: null, status: "unavailable" });
  });
});
