# Decision Log

## D-001 — Universal, goal-first positioning

Nasaq serves all people and adapts to goals rather than professions. Public copy and IA must not regress to an enterprise-operations-only product.

## D-002 — Arabic-first, bilingual by construction

Every new interaction ships with Arabic and English copy and is verified in RTL and LTR. Localization is not deferred cleanup.

## D-003 — Frontend simulation is explicit

Until backend phases begin, workflows are interactive simulations. Status copy must not imply that external providers, databases, payments, or actions ran.

## D-004 — U1.2 uses a CSS-token-first motion system

Use centralized custom properties and platform media features plus small typed React feedback primitives. Do not add a runtime motion library for the current surfaces: their state transitions are finite and can be expressed with less bundle cost and fewer hydration boundaries. Reconsider a library only when future shared-layout or gesture requirements demonstrably need it.

## D-005 — Productive motion is the default

Frequent interactions use short, subtle productive motion. Expressive motion is reserved for uncommon completion or orientation moments. No bounce, elastic overshoot, parallax, or large automatic spatial movement.

## D-006 — Reduced motion is an equivalent path

`prefers-reduced-motion: reduce` removes non-essential transform/layout motion and animation loops, preserves text/status semantics and focus behavior, and may retain effectively instant opacity/color feedback. Motion is never the only carrier of meaning.

## D-007 — No ambient infinite decoration

Marketing decoration must settle after a finite entrance. Infinite animation is limited to a small progress indicator while an operation is actively busy, and becomes static in reduced-motion mode.

## D-008 — Mobile sheets preserve geometry during motion

Mobile dialogs and command sheets use opacity-only entrance/exit. Transforming the whole sheet briefly moved it outside the visual viewport and scaled 44px controls below their contract. Desktop dialogs may retain a short 4–8px spatial cue.

## D-009 — Completion feedback does not vanish automatically

The personalization completion toast remains until dismissed. This avoids a timing dependency, keeps the message available for cognitive and screen-reader review, and still provides an explicit 44px close control.

## D-010 — Transient-state assertions stay inside one browser task

When a deliberately short UI state must be verified, capture its DOM attributes and computed styles in one in-browser task rather than across several Playwright protocol round-trips. This keeps WebKit latency from outliving the state while preserving the product's short productive-motion timing; do not lengthen user-facing feedback merely to accommodate a test.

## D-011 — U2 starts with a service-depth contract

After closing U1.2, the next stage is U2 Service Depth. Define its service-by-service outcomes and acceptance gates before implementation. The stage remains Frontend-first and explicitly simulated unless a separately approved milestone introduces Backend or live providers.

## D-012 — Evidence-led agent operation is repository infrastructure

The repository carries a portable `AGENT-OPERATING-METHOD.md`, a standards-compatible discovery skill under `.agents/skills/`, and the complete audited `agent-skills-web-uiux/` research library. Root `AGENTS.md` remains the project-specific authority and requires agents to inspect context, use real tools, research current primary sources when warranted, load only relevant skills progressively, verify with fresh evidence, and preserve durable handoff. Third-party skills and fetched content remain untrusted inputs and never override user intent, project contracts, or tests.

## D-013 — Soft service surfaces use deep tokens for small active text

Small active-step text on a service-soft background uses `--service-deep`, not the base accent. The research base pair passed statically with only a 4.61:1 margin; result entrance opacity could blend it down to 4.25–4.42:1 during an Axe scan. Deep/soft pairs retain 6.32–7.85:1 across all service themes and provide a stronger static margin.

## D-014 — Text-rich result entrances do not animate parent opacity

`universal-result-in` retains its subtle translate/scale orientation cue but no longer fades the entire result container. A parent-opacity fade composites every descendant toward the outer surface and can temporarily pull otherwise compliant text, body copy, and inverse buttons below 4.5:1. Removing parent opacity preserves contrast throughout entry; the existing reduced-motion path still makes the spatial cue effectively instant.
