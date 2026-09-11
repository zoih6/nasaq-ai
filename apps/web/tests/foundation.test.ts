import { describe, expect, it } from "vitest";
import { homeSnapshotSchema, localize, localeSchema } from "@nasaq/contracts";
import { getDirection, getDictionary, switchLocaleInPath } from "@nasaq/i18n";
import { getMockHomeSnapshot } from "@nasaq/mock-api";

describe("Nasaq foundation contracts", () => {
  it("accepts only supported locales and maps direction", () => {
    expect(localeSchema.parse("ar")).toBe("ar");
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
    expect(() => localeSchema.parse("de")).toThrow();
  });

  it("keeps translated navigation complete", () => {
    const ar = getDictionary("ar");
    const en = getDictionary("en");
    expect(Object.keys(ar.nav)).toEqual(Object.keys(en.nav));
    expect(ar.nav.chat).toBe("المحادثة");
  });

  it("validates and localizes the shared home fixture", async () => {
    const snapshot = homeSnapshotSchema.parse(await getMockHomeSnapshot());
    expect(localize(snapshot.workspace.name, "ar")).toBe("فريق أفق");
    expect(snapshot.activeRuns).toHaveLength(3);
    expect(snapshot.approvals[0]?.runId).toBe("run_weekly_watch");
  });

  it("switches locale without losing the deep link", () => {
    expect(switchLocaleInPath("/ar/app/chat", "en")).toBe("/en/app/chat");
  });
});
