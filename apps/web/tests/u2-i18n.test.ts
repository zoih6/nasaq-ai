import { describe, expect, it } from "vitest";
import { getDirection } from "@nasaq/i18n";
import {
  formatServiceDate,
  formatServiceNumber,
  getServiceDictionary,
  getServiceStageTitle,
  serviceDictionaries,
} from "@nasaq/i18n/services";
import { getServiceStageBlueprints, serviceIds } from "@nasaq/contracts/services";

function collectKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value as Record<string, unknown>)
    .flatMap(([key, child]) => collectKeys(child, prefix === "" ? key : `${prefix}.${key}`))
    .sort();
}

describe("UT-I18N-001 — Arabic and English stay key-for-key complete", () => {
  it("exposes the same leaf keys in both dictionaries", () => {
    expect(collectKeys(serviceDictionaries.ar)).toEqual(collectKeys(serviceDictionaries.en));
  });

  it("labels every service, stage, status, and scenario in both languages", () => {
    for (const locale of ["ar", "en"] as const) {
      const dictionary = getServiceDictionary(locale);
      for (const serviceId of serviceIds) {
        const entry = dictionary.services[serviceId];
        expect(entry.label.length).toBeGreaterThan(1);
        expect(entry.description.length).toBeGreaterThan(10);
        for (const blueprint of getServiceStageBlueprints(serviceId)) {
          const title = getServiceStageTitle(locale, blueprint.titleKey);
          expect(title, `${locale} ${blueprint.titleKey}`).not.toBeNull();
          expect((title ?? "").length).toBeGreaterThan(1);
        }
      }
      expect(Object.keys(dictionary.runStatus)).toHaveLength(11);
      expect(Object.keys(dictionary.sessionStatus)).toHaveLength(6);
      expect(Object.keys(dictionary.scenarios)).toHaveLength(12);
    }
  });

  it("returns null for unknown stage keys instead of a silent fallback", () => {
    expect(getServiceStageTitle("ar", "services.learn.stages.unknown_key")).toBeNull();
    expect(getServiceStageTitle("en", "not-a-stage-key")).toBeNull();
  });

  it("keeps the simulation boundary statement in both languages", () => {
    for (const locale of ["ar", "en"] as const) {
      const statement = getServiceDictionary(locale).receipt.boundaryStatement;
      expect(statement.length).toBeGreaterThan(10);
    }
    expect(getServiceDictionary("en").receipt.boundaryStatement).toContain("not implemented");
    expect(getServiceDictionary("ar").receipt.boundaryStatement).toContain("غير منفّذ");
  });
});

describe("UT-I18N-002 — numbers, dates, and direction stay locale-correct", () => {
  it("formats numbers and dates per locale", () => {
    expect(formatServiceNumber("en", 1234.5)).toBe("1,234.5");
    expect(formatServiceNumber("ar", 1234.5).length).toBeGreaterThan(0);
    expect(formatServiceNumber("en", 0.42, { style: "percent" })).toBe("42%");
    expect(formatServiceDate("en", "2026-09-12T00:00:00.000Z")).toContain("2026");
    expect(formatServiceDate("ar", "2026-09-12T00:00:00.000Z").length).toBeGreaterThan(4);
  });

  it("maps direction for both locales", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });

  it("keeps mixed-direction stage titles from the wrong service out of each namespace", () => {
    const learnStage = getServiceStageTitle("en", "services.learn.stages.lrn_lesson");
    const researchStage = getServiceStageTitle("en", "services.research.stages.rsh_source_review");
    expect(learnStage).not.toBe(researchStage);
  });
});
