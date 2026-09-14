import { describe, expect, it } from "vitest";
import type { ServiceSession } from "@nasaq/contracts/services";
import { buildServiceScenarioFixture } from "@nasaq/mock-api/services";
import { createCreateStatePreset } from "@nasaq/mock-api/services";
import {
  createInitialCreateState,
  createReducer,
  derivedStageFor,
  stageForSession,
  type CreateAction,
  type CreateReducerState,
} from "../features/create/state/create-reducer";

/**
 * UT-CRT-001 (document block operations + alternative acceptance),
 * UT-CRT-002 (deck reorder/duplicate/delete guards), and UT-CRT-003
 * (visual variant/alt/version/restore), plus the stage, dirty/save, and
 * version-lineage invariants that keep Create honest: no silent overwrite, no
 * history erasure, no ready state without alt text, and no transition that a
 * recorded action cannot explain.
 */

const at = (step: number) => `2026-09-12T00:00:${String(step).padStart(2, "0")}.000Z`;

const workbenchSession = (locale: "ar" | "en"): ServiceSession =>
  buildServiceScenarioFixture({ serviceId: "create", scenarioId: "happy", locale }).session;

function run(state: CreateReducerState, actions: CreateAction[]): CreateReducerState {
  return actions.reduce((current, action) => createReducer(current, action), state);
}

/** Walks the guided flow to an editable draft of the given format. */
function guidedToDraft(format: "document" | "deck" | "visual", locale: "ar" | "en" = "ar"): CreateReducerState {
  let state = createInitialCreateState(locale);
  state = run(state, [
    { type: "format/select", format },
    { type: "brief/draft", field: "goal", value: "أقنع فريق القيادة بتثبيت جدولة الذروة ربعًا إضافيًا." },
    { type: "brief/draft", field: "audience", value: "فريق القيادة" },
    { type: "brief/submit", at: at(1) },
    { type: "structure/confirm", at: at(2) },
    { type: "variant/select", variantId: format === "visual" ? "vis_orbit" : format === "deck" ? "variant_narrative" : "variant_standard" },
    { type: "variants/confirm", at: at(3) },
  ]);
  return state;
}

/** Save once: begin → (adapter write) → succeeded. */
function saveOnce(state: CreateReducerState, locale: "ar" | "en" = "ar"): CreateReducerState {
  return run(state, [
    { type: "save/begin", at: at(10), workbenchSession: workbenchSession(locale) },
    { type: "save/succeeded", at: at(11) },
  ]);
}

describe("UT-CRT-001 — document blocks and the section alternative", () => {
  it("reaches a document draft with a title, outline, and blocks from one guided flow", () => {
    const state = guidedToDraft("document");
    expect(state.ui.stage).toBe("crt_edit");
    expect(state.session.draft?.format).toBe("document");
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.title.length).toBeGreaterThan(3);
    expect(state.session.draft.outline.length).toBeGreaterThanOrEqual(3);
    expect(state.session.draft.blocks.length).toBeGreaterThanOrEqual(4);
    // Drafts start unsaved: the honest state is dirty, not clean.
    expect(state.session.saveState).toBe("dirty");
    // The deterministic alternative is attached and pending an explicit decision.
    expect(state.session.alternatives).toHaveLength(1);
    expect(state.session.alternatives[0]?.status).toBe("proposed");
  });

  it("adds, edits, reorders, and deletes blocks through recorded actions", () => {
    let state = guidedToDraft("document");
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const before = state.session.draft.blocks.length;

    state = run(state, [{ type: "block/add", blockType: "paragraph" }]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const added = state.session.draft.blocks[before];
    expect(added).toBeDefined();
    expect(state.session.saveState).toBe("dirty");

    state = run(state, [{ type: "block/text", id: added?.id ?? "", text: "فقرة معدلة بالكامل من المستخدم." }]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.blocks[before]?.text).toBe("فقرة معدلة بالكامل من المستخدم.");

    // Reorder: the added block moves up twice, which must be observable.
    const idsBefore = state.session.draft.blocks.map((block) => block.id);
    state = run(state, [
      { type: "block/move", id: added?.id ?? "", direction: "up" },
      { type: "block/move", id: added?.id ?? "", direction: "up" },
    ]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const idsAfter = state.session.draft.blocks.map((block) => block.id);
    expect(idsAfter).not.toEqual(idsBefore);
    expect(idsAfter.indexOf(added?.id ?? "")).toBe(before - 2);

    // Delete keeps at least one block: the guard refuses the last one.
    state = run(state, [{ type: "block/delete", id: added?.id ?? "" }]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.blocks).toHaveLength(before);
  });

  it("accepting the alternative replaces the target block text and records the decision", () => {
    let state = guidedToDraft("document");
    const alternative = state.session.alternatives[0];
    expect(alternative).toBeDefined();
    if (alternative === undefined) throw new Error("no alternative");

    state = run(state, [{ type: "alternative/accept", id: alternative.id, at: at(4) }]);
    expect(state.session.alternatives[0]?.status).toBe("accepted");
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const target = state.session.draft.blocks.find((block) => block.id === alternative.blockId);
    expect(target?.text).toBe(alternative.proposedText);
    expect(state.session.saveState).toBe("dirty");
  });

  it("rejecting the alternative keeps the current text untouched", () => {
    let state = guidedToDraft("document");
    const alternative = state.session.alternatives[0];
    if (alternative === undefined) throw new Error("no alternative");
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const current = state.session.draft.blocks.find((block) => block.id === alternative.blockId)?.text;

    state = run(state, [{ type: "alternative/reject", id: alternative.id }]);
    expect(state.session.alternatives[0]?.status).toBe("rejected");
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const after = state.session.draft.blocks.find((block) => block.id === alternative.blockId)?.text;
    expect(after).toBe(current);
  });

  it("edits the outline: rename, add, and remove are all observable", () => {
    let state = guidedToDraft("document");
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const first = state.session.draft.outline[0];
    expect(first).toBeDefined();
    if (first === undefined) throw new Error("no outline");

    state = run(state, [{ type: "outline/label", id: first.id, label: "قسم معدّل" }]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.outline[0]?.label).toBe("قسم معدّل");

    state = run(state, [{ type: "outline/add", label: "قسم جديد من المستخدم" }]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.outline.at(-1)?.label).toBe("قسم جديد من المستخدم");

    state = run(state, [{ type: "outline/remove", id: first.id }]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.outline.some((item) => item.id === first.id)).toBe(false);
  });
});

describe("UT-CRT-002 — deck slides with the final-slide guard", () => {
  it("ships at least five fixture slides with empty speaker notes", () => {
    const state = guidedToDraft("deck");
    if (state.session.draft?.format !== "deck") throw new Error("not a deck");
    expect(state.session.draft.slides.length).toBeGreaterThanOrEqual(5);
    // Notes start empty on purpose: the surface never claims notes exist.
    expect(state.session.draft.slides.every((slide) => slide.notes === "")).toBe(true);
  });

  it("edits title, body, and notes and observes each change", () => {
    let state = guidedToDraft("deck");
    if (state.session.draft?.format !== "deck") throw new Error("not a deck");
    const slide = state.session.draft.slides[0];
    if (slide === undefined) throw new Error("no slides");

    state = run(state, [
      { type: "slide/title", id: slide.id, value: "عنوان معدّل" },
      { type: "slide/body", id: slide.id, value: "نقطة أولى\nنقطة ثانية" },
      { type: "slide/notes", id: slide.id, value: "ملاحظة متحدث حقيقية." },
    ]);
    if (state.session.draft?.format !== "deck") throw new Error("not a deck");
    const edited = state.session.draft.slides[0];
    expect(edited?.title).toBe("عنوان معدّل");
    expect(edited?.bullets).toEqual(["نقطة أولى", "نقطة ثانية"]);
    expect(edited?.notes).toBe("ملاحظة متحدث حقيقية.");
    expect(state.session.saveState).toBe("dirty");
  });

  it("moves, duplicates, and deletes slides; the final slide can never be deleted", () => {
    let state = guidedToDraft("deck");
    if (state.session.draft?.format !== "deck") throw new Error("not a deck");
    const slides = state.session.draft.slides;
    const count = slides.length;

    // Move the second slide up: order must change.
    const second = slides[1];
    if (second === undefined) throw new Error("no second slide");
    state = run(state, [{ type: "slide/move", id: second.id, direction: "up" }]);
    if (state.session.draft?.format !== "deck") throw new Error("not a deck");
    expect(state.session.draft.slides[0]?.id).toBe(second.id);
    expect(state.ui.currentSlideIndex).toBe(0);

    // Duplicate: a new slide with a fresh id appears right after the source.
    state = run(state, [{ type: "slide/duplicate", id: second.id }]);
    if (state.session.draft?.format !== "deck") throw new Error("not a deck");
    expect(state.session.draft.slides).toHaveLength(count + 1);
    expect(state.session.draft.slides[1]?.title).toBe(second.title);
    expect(state.session.draft.slides[1]?.id).not.toBe(second.id);

    // Delete down to one slide, then the guard holds.
    for (const slide of [...state.session.draft.slides]) {
      state = run(state, [{ type: "slide/delete", id: slide.id }]);
    }
    if (state.session.draft?.format !== "deck") throw new Error("not a deck");
    expect(state.session.draft.slides).toHaveLength(1);
    const last = state.session.draft.slides[0];
    if (last === undefined) throw new Error("no last slide");
    const guarded = run(state, [{ type: "slide/delete", id: last.id }]);
    if (guarded.session.draft?.format !== "deck") throw new Error("not a deck");
    expect(guarded.session.draft.slides).toHaveLength(1);
    expect(guarded.ui.validation).toBe("last_slide");
  });
});

describe("UT-CRT-003 — visual variants, required alt text, and restore", () => {
  it("builds a visual draft from the selected variant with labelled attributes", () => {
    const state = guidedToDraft("visual");
    if (state.session.draft?.format !== "visual") throw new Error("not a visual");
    expect(state.session.draft.variantId).toBe("vis_orbit");
    expect(state.session.draft.ratio).toBe("ratio_1_1");
    expect(state.session.draft.palette.length).toBeGreaterThanOrEqual(2);
    expect(state.session.draft.altText.length).toBeGreaterThan(0);
    expect(state.session.draft.caption.length).toBeGreaterThan(0);
  });

  it("blocks the review request while the alt text is missing, then passes once filled", () => {
    let state = createInitialCreateState("ar");
    state = run(state, [
      { type: "format/select", format: "visual" },
      { type: "brief/draft", field: "goal", value: "هوية بصرية لحملة تجربة الانتظار." },
      { type: "brief/draft", field: "audience", value: "فريق التسويق" },
      { type: "brief/submit", at: at(1) },
      { type: "structure/confirm", at: at(2) },
      { type: "variant/select", variantId: "vis_grid" },
      { type: "variants/confirm", at: at(3) },
    ]);
    if (state.session.draft?.format !== "visual") throw new Error("not a visual");

    state = run(state, [{ type: "visual/alt", value: "  " }]);
    state = run(state, [{ type: "review/request", at: at(4) }]);
    expect(state.ui.validation).toBe("alt_required");
    expect(state.ui.stage).toBe("crt_edit");

    state = run(state, [{ type: "visual/alt", value: "تصور تجريبي: شبكة مربعات متوازنة بألوان خضراء." }]);
    state = run(state, [{ type: "review/request", at: at(5) }]);
    expect(state.ui.validation).toBeNull();
    expect(state.ui.stage).toBe("crt_review");
    // Visual drafts produce no rule-based suggestions: the gate is the alt text.
    expect(state.session.suggestions).toHaveLength(0);
  });

  it("rejects confirming a visual variant before one is selected", () => {
    let state = createInitialCreateState("ar");
    state = run(state, [
      { type: "format/select", format: "visual" },
      { type: "brief/draft", field: "goal", value: "هوية بصرية واضحة." },
      { type: "brief/draft", field: "audience", value: "فريق التسويق" },
      { type: "brief/submit", at: at(1) },
      { type: "structure/confirm", at: at(2) },
    ]);
    // No variant selected: the confirm is refused, not defaulted.
    const refused = run(state, [{ type: "variants/confirm", at: at(3) }]);
    expect(refused.ui.validation).toBe("variant_required");
    expect(refused.session.draft).toBeNull();
  });

  it("swapping variants after a draft exists requires the explicit confirm", () => {
    let state = guidedToDraft("visual");
    // Selecting a different variant on the live draft only arms a pending action.
    state = run(state, [{ type: "variant/select", variantId: "vis_waves" }]);
    expect(state.ui.pending).toEqual({ kind: "variant", variantId: "vis_waves" });
    expect(state.session.draft?.format).toBe("visual");
    if (state.session.draft?.format !== "visual") throw new Error("not a visual");
    expect(state.session.draft.variantId).toBe("vis_orbit");

    state = run(state, [{ type: "pending/confirm", at: at(6), workbenchSession: workbenchSession("ar") }]);
    if (state.session.draft?.format !== "visual") throw new Error("not a visual");
    expect(state.session.draft.variantId).toBe("vis_waves");
    expect(state.ui.pending).toBeNull();
    expect(state.session.saveState).toBe("dirty");
  });

  it("the variants stage reached from a live draft never rebuilds silently", () => {
    let state = guidedToDraft("document");
    state = run(state, [{ type: "edit/variants" }]);
    expect(state.ui.stage).toBe("crt_variants");
    // Confirm with a live draft is a no-op: only the explicit select→confirm
    // dialog path can replace the draft.
    const unchanged = run(state, [{ type: "variants/confirm", at: at(7) }]);
    expect(unchanged).toBe(state);
  });
});

describe("U2-CRT-006/007 — version lineage, dirty states, and storage failure", () => {
  it("creates an informed version on the first save and a parent-linked one after edits", () => {
    let state = guidedToDraft("document");
    state = saveOnce(state);
    expect(state.session.saveState).toBe("saved");
    expect(state.session.savedVersionNumber).toBe(1);
    expect(state.session.versions).toHaveLength(1);
    expect(state.session.versions[0]?.createdBy).toBe("user");
    expect(state.session.versions[0]?.parentVersionId).toBeUndefined();
    expect(state.session.artifact?.versionIds).toHaveLength(1);
    expect(state.ui.stage).toBe("crt_edit");

    // A new edit marks the draft dirty again; the next save creates version 2.
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const block = state.session.draft.blocks[0];
    if (block === undefined) throw new Error("no blocks");
    state = run(state, [{ type: "block/text", id: block.id, text: "عنوان رئيسي معدّل بعد أول حفظ." }]);
    expect(state.session.saveState).toBe("dirty");

    state = saveOnce(state);
    expect(state.session.versions).toHaveLength(2);
    const [first, second] = state.session.versions;
    expect(second?.versionNumber).toBe(2);
    expect(second?.parentVersionId).toBe(first?.id);
    expect(state.session.artifact?.versionIds).toHaveLength(2);
    // History never shrinks: version 1 is still addressable.
    expect(state.session.versions.some((version) => version.id === first?.id)).toBe(true);
  });

  it("restoring an older version rebuilds the draft and the next save builds on it", () => {
    let state = guidedToDraft("document");
    state = saveOnce(state);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    const originalTitle = state.session.draft.title;

    // Edit and save a second version with a different title.
    state = run(state, [{ type: "edit/title", value: "عنوان ثانٍ بعد التعديل" }]);
    state = saveOnce(state);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.title).toBe("عنوان ثانٍ بعد التعديل");

    // Restore version 1: the draft returns to its content, history intact.
    const first = state.session.versions[0];
    if (first === undefined) throw new Error("no first version");
    state = run(state, [{ type: "restore/apply", versionId: first.id, at: at(20) }]);
    if (state.session.draft?.format !== "document") throw new Error("not a document");
    expect(state.session.draft.title).toBe(originalTitle);
    expect(state.session.saveState).toBe("restored");
    expect(state.session.versions).toHaveLength(2);
    expect(state.ui.stage).toBe("crt_edit");

    // The save after restore is a NEW version built on the restored one.
    state = saveOnce(state);
    expect(state.session.versions).toHaveLength(3);
    const third = state.session.versions[2];
    expect(third?.versionNumber).toBe(3);
    expect(third?.parentVersionId).toBe(first.id);
    expect(third?.createdBy).toBe("local_transform");
    expect(third?.changeSummary).toContain("إصدار سابق");
  });

  it("duplicate branches a new artifact that keeps the title and the parent relation", () => {
    let state = guidedToDraft("deck");
    state = saveOnce(state);
    const sourceArtifactId = state.session.artifact?.id;
    const sourceTitle = state.session.draft?.title;

    state = run(state, [{ type: "duplicate/apply", at: at(30), workbenchSession: workbenchSession("ar") }]);
    expect(state.session.artifact?.id).not.toBe(sourceArtifactId);
    expect(state.session.draft?.title).toBe(sourceTitle);
    expect(state.session.parentArtifactId).toBe(sourceArtifactId);
    // The branch starts its own lineage at version 1.
    expect(state.session.versions).toHaveLength(1);
    expect(state.session.versions[0]?.versionNumber).toBe(1);
    expect(state.session.versions[0]?.parentVersionId).toBeDefined();
    expect(state.session.saveState).toBe("saved");
  });

  it("a failed storage write never claims saved and retry re-attempts the same version", () => {
    let state = guidedToDraft("document");
    state = run(state, [{ type: "save/begin", at: at(10), workbenchSession: workbenchSession("ar") }]);
    expect(state.session.saveState).toBe("saving");
    const pending = state.session.versions.at(-1);

    state = run(state, [{ type: "save/failed" }]);
    expect(state.session.saveState).toBe("storage_failed");
    expect(state.session.savedVersionNumber).toBeNull();
    expect(state.session.savedAt).toBeNull();

    state = run(state, [{ type: "save/retry", at: at(11), workbenchSession: workbenchSession("ar") }]);
    expect(state.session.saveState).toBe("saving");
    // The retry writes the already-built version; no second record appears.
    expect(state.session.versions.at(-1)?.id).toBe(pending?.id);
    expect(state.session.versions).toHaveLength(1);

    state = run(state, [{ type: "save/succeeded", at: at(12) }]);
    expect(state.session.saveState).toBe("saved");
    expect(state.session.savedVersionNumber).toBe(1);
  });
});

describe("U2-CRT-002 — brief, mode, and stage guards", () => {
  it("refuses an incomplete or invalid brief instead of advancing", () => {
    let state = createInitialCreateState("ar");
    state = run(state, [{ type: "format/select", format: "document" }]);

    const blank = run(state, [{ type: "brief/submit", at: at(1) }]);
    expect(blank.ui.validation).toBe("brief_incomplete");
    expect(blank.session.brief).toBeNull();

    const hostile = run(state, [
      { type: "brief/draft", field: "goal", value: "هدف".repeat(400) },
      { type: "brief/draft", field: "audience", value: "جمهور" },
      { type: "brief/submit", at: at(1) },
    ]);
    expect(hostile.ui.validation).toBe("goal_invalid");
    expect(hostile.session.brief).toBeNull();
  });

  it("fast mode pre-fills the brief and preselects the default variant", () => {
    let state = createInitialCreateState("ar");
    state = run(state, [
      { type: "mode/set", mode: "fast", at: at(1) },
      { type: "format/select", format: "document" },
    ]);
    expect(state.ui.draftGoal.length).toBeGreaterThan(3);
    expect(state.ui.draftAudience.length).toBeGreaterThan(2);

    state = run(state, [
      { type: "brief/submit", at: at(2) },
      { type: "structure/confirm", at: at(3) },
    ]);
    expect(state.session.selectedVariantId).toBe("variant_standard");

    state = run(state, [{ type: "variants/confirm", at: at(4) }]);
    expect(state.session.draft).not.toBeNull();
    expect(state.ui.stage).toBe("crt_edit");
    expect(state.session.mode).toBe("fast");
  });

  it("review requires resolution of every suggestion and the pending alternative", () => {
    let state = guidedToDraft("document");
    // The alternative is still proposed: review is refused.
    state = run(state, [{ type: "review/request", at: at(4) }]);
    expect(state.ui.validation).toBe("alt_pending");
    expect(state.ui.stage).toBe("crt_edit");

    const alternative = state.session.alternatives[0];
    if (alternative === undefined) throw new Error("no alternative");
    state = run(state, [{ type: "alternative/reject", id: alternative.id }]);
    state = run(state, [{ type: "review/request", at: at(5) }]);
    expect(state.ui.stage).toBe("crt_review");
    // The long Arabic fixture triggers the doc-length rule; brand check fires
    // only when the mixed brand paragraph is present.
    expect(state.session.suggestions.length).toBeGreaterThanOrEqual(1);

    // Completing with an open suggestion is refused.
    const refused = run(state, [{ type: "review/complete", at: at(6) }]);
    expect(refused.ui.validation).toBe("review_open");

    for (const suggestion of state.session.suggestions) {
      state = run(state, [{ type: "suggestion/reject", id: suggestion.id }]);
    }
    state = run(state, [{ type: "review/complete", at: at(7) }]);
    expect(state.ui.stage).toBe("crt_version");
    expect(state.session.reviewCompleted).toBe(true);

    // Saving a reviewed draft lands on the version stage; completion is a
    // deliberate step from there.
    state = saveOnce(state);
    expect(state.ui.stage).toBe("crt_version");
    state = run(state, [{ type: "complete/enter" }]);
    expect(state.ui.stage).toBe("crt_complete");
  });

  it("switching format with a draft arms the explicit dirty confirm, never a silent reset", () => {
    let state = guidedToDraft("document");
    state = run(state, [{ type: "format/select", format: "deck" }]);
    // Nothing was discarded: the draft survives and a confirm is pending.
    expect(state.ui.pending).toEqual({ kind: "restart" });
    expect(state.session.draft?.format).toBe("document");

    state = run(state, [{ type: "pending/cancel" }]);
    expect(state.ui.pending).toBeNull();
    expect(state.session.draft?.format).toBe("document");

    state = run(state, [{ type: "format/select", format: "deck" }]);
    state = run(state, [{ type: "pending/confirm", at: at(8), workbenchSession: workbenchSession("ar") }]);
    // The confirmed restart lands on a fresh session at format selection.
    expect(state.session.draft).toBeNull();
    expect(state.session.format).toBeNull();
    expect(state.ui.stage).toBe("crt_format");
  });
});

describe("U2-CRT-007 — presets, stage derivation, and hostile restore", () => {
  it("parses every edge preset and lands it on the stage its facts support", () => {
    const presets = [
      "fresh",
      "format_chosen",
      "blank_brief",
      "conflicting_constraints",
      "structure_review",
      "no_variant",
      "document_draft",
      "deck_draft",
      "visual_missing_alt",
      "dense_document",
      "dense_deck",
      "rtl_stress",
      "document_reviewed",
      "version_saved",
      "restored_version",
      "storage_failed",
    ] as const;
    for (const preset of presets) {
      const session = createCreateStatePreset({ locale: "ar", now: at(1), preset });
      const state = createInitialCreateState("ar", session);
      expect(stageForSession(session)).toBe(state.ui.stage);
    }
  });

  it("dense fixtures fill the bounded maxima and rtl_stress carries mixed-direction text", () => {
    const denseDoc = createCreateStatePreset({ locale: "ar", now: at(1), preset: "dense_document" });
    if (denseDoc.draft?.format !== "document") throw new Error("not a document");
    expect(denseDoc.draft.blocks).toHaveLength(24);
    expect(denseDoc.draft.outline.length).toBeGreaterThanOrEqual(4);

    const denseDeck = createCreateStatePreset({ locale: "ar", now: at(1), preset: "dense_deck" });
    if (denseDeck.draft?.format !== "deck") throw new Error("not a deck");
    expect(denseDeck.draft.slides).toHaveLength(16);

    const rtl = createCreateStatePreset({ locale: "ar", now: at(1), preset: "rtl_stress" });
    if (rtl.draft?.format !== "document") throw new Error("not a document");
    expect(rtl.draft.blocks.some((block) => /Nasaq|QueueSense/u.test(block.text))).toBe(true);
    expect(rtl.draft.blocks.some((block) => block.text.length > 90 && /[\u0600-\u06ff]/u.test(block.text))).toBe(true);
  });

  it("keeps the no-variant state honest: no default is invented", () => {
    const session = createCreateStatePreset({ locale: "en", now: at(1), preset: "no_variant" });
    expect(session.variants).toHaveLength(0);
    expect(session.selectedVariantId).toBeNull();
    expect(session.draft).toBeNull();
    expect(derivedStageFor(session)).toBe("crt_variants");
  });

  it("derives stages from facts alone", () => {
    const fresh = createCreateStatePreset({ locale: "ar", now: at(1), preset: "fresh" });
    expect(derivedStageFor(fresh)).toBe("crt_format");
    const draft = createCreateStatePreset({ locale: "ar", now: at(1), preset: "document_draft" });
    expect(derivedStageFor(draft)).toBe("crt_edit");
    const reviewed = createCreateStatePreset({ locale: "ar", now: at(1), preset: "document_reviewed" });
    expect(derivedStageFor(reviewed)).toBe("crt_review");
    const saved = createCreateStatePreset({ locale: "ar", now: at(1), preset: "version_saved" });
    expect(derivedStageFor(saved)).toBe("crt_complete");
  });

  it("normalizes a mid-save restored snapshot so no surface hangs in saving", () => {
    const saved = createCreateStatePreset({ locale: "ar", now: at(1), preset: "version_saved" });
    const midSave = { ...saved, saveState: "saving" as const };
    const state = createInitialCreateState("ar", midSave);
    expect(state.session.saveState).toBe("saved");
    // The recorded resume stage (version management) is still honoured.
    expect(state.ui.stage).toBe("crt_version");
  });

  it("a hand-edited resume stage the facts cannot support falls back to the derived stage", () => {
    const draft = createCreateStatePreset({ locale: "ar", now: at(1), preset: "document_draft" });
    const faked = { ...draft, resumeStageKey: "crt_complete" as const };
    // crt_complete requires a saved version; the faked stage is refused.
    expect(stageForSession(faked)).toBe("crt_edit");
  });
});
