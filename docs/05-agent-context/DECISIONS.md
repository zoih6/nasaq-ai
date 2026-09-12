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
