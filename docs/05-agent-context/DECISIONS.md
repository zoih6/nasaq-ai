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

## D-015 — U2 builds six domain workspaces; Ask remains the shared gateway

Learn, Research, Create, Code, Analyze, and Explore receive explicit workflows, stage models, review surfaces, and artifact types. Ask & Talk remains the general starting point and deterministic, user-confirmed router. It does not become a seventh specialized editor. This matches the Universal Reset roadmap and prevents another generic-chat skin from being counted as service depth.

## D-016 — Shared workbench through composition, not a conditional monolith

U2 introduces a domain-neutral Service Workbench for session/run lifecycle, storage, artifact actions, simulation receipts, and handoffs. Each service owns an explicit feature composition and reducer/transition logic. Do not expand the current `ServiceWorkspace` with `serviceId === ...` branches or boolean-prop combinations; use typed interfaces, explicit variants, and feature boundaries.

## D-017 — U2 truth boundary is fixtures plus narrow local computation

U2 remains Frontend-only. Research/source activity, drafting, visual concepts, and Code preview/checks are deterministic simulations. Analyze may run pure deterministic transforms on bundled datasets. Local file interaction, if present, is metadata-only and cannot read, upload, process, or persist content. Code is never evaluated. Every result exposes a SimulationReceipt listing local work, simulated work, omitted capabilities, network calls, and storage mode.

## D-018 — U2 demo persistence is session-only and explicit

Artifacts and resumable stages may use a versioned `sessionStorage` adapter so Library and cross-route continuation work within the current tab. The UI must say this is local, temporary, unsynchronized demo storage and offer a clear action. File bytes, auth data, secrets, and external content are excluded from the schema.

## D-019 — Universal Reset and Luminous supersede conflicting Precision direction

`docs/02-design/DESIGN.md` remains historical guidance for non-conflicting semantics, accessibility, RTL/LTR, and component rigor. Its professional-only positioning and Precision Workspace visual direction do not govern Universal/U2. User intent, `NASAQ-UNIVERSAL-RESET.md`, the implemented Luminous CSS, `MOTION-AND-FEEDBACK.md`, and the U2 contract take precedence.

## D-020 — The portable method is one integrated engineering and agent-lifecycle standard

`AGENT-OPERATING-METHOD.md` v2.0 remains the single canonical operating source rather than splitting Software Engineering, Prompt Engineering, security, or lifecycle rules into competing manuals. Project/vendor instruction files and `.agents/skills/evidence-led-agent-workflow/SKILL.md` are thin discovery or activation layers. Deterministic authorization, state transitions, validation, retries, budgets, and side effects belong in code/workflow controls rather than prompt prose; prompts, models, tools, retrieval, memory, parsers, guardrails, datasets, graders, and thresholds are versioned and evaluated as one behavior bundle. Multi-agent execution is conditional, requires isolated ownership plus one integrator, and never transfers final verification responsibility away from the coordinator.

## D-021 — Product-agent Backend is blocked by a formal readiness gate

The product vision, PRD, state machines, conceptual contracts, permissions, security requirements, and Prototype UX collectively describe important parts of Nasaq product agents, but they are not a canonical executable runtime architecture. The current Zod contracts are narrower Prototype view/simulation shapes, and no provider, durable orchestrator, database, worker, tool executor, credential broker, memory service, telemetry pipeline, or eval harness exists. Therefore product-agent Backend is `NO-GO` until `PA-G0..PA-G9` pass with evidence and `PA-G10` records an approved limited scope. The controlling audit is `docs/04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md`.

## D-022 — U2 ServiceRun and future AgentRun remain separate bounded contexts

U2 may proceed as Frontend-only deterministic simulation, but its `ServiceSession`, `ServiceRun`, `ServiceStage`, `ServiceEvent`, `SimulationReceipt`, and handoff/storage contracts must not become implicit Agent/Flow runtime contracts. Use service-specific names or namespaces; do not widen a shared `RunStatus` or promote the current `agentDefinitionSchema` into a Backend model. `docs/05-agent-context/U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md` is mandatory for every U2 implementation agent and does not itself close any product-agent readiness gate.

## D-023 — U2.0 stays simulation-first and evidence-bound

`U2.0` closes only the shared foundation: Zod service contracts, a deterministic event simulator, session-only storage, ar/en service dictionaries, and a shared Service Workbench verified through a noindex internal surface. It adds no Backend/provider/file-processing/execution scope and does not replace `ServiceWorkspace`, so every `/[locale]/app/{service}` route keeps the U1 surface until its own slice lands. Retrying a transient failure creates a new run that resolves deterministically to success instead of re-failing forever, and `needs_input` is reached from `validating`, not from `queued`. Rows move out of `NOT STARTED` only with fresh post-change evidence: `PASS` requires the listed automated checks after the last meaningful change, while rows that still need human `MAN-*` review or a later slice stay `IN PROGRESS`. Deployment evidence must link the exact commit SHA to a Vercel deployment ID, a completed deployment state, and a production alias that serves content unique to that commit.

## D-024 — Transient artifacts never accumulate in the workspace

The delivered repository stays small (~30 MB, under 500 tracked files); dependencies, browser binaries, and build/test output are transient tooling that must not pile up inside it. Playwright browsers live outside the workspace through `PLAYWRIGHT_BROWSERS_PATH` and are installed per gate (Chromium by default, Firefox/WebKit only for the cross-browser close-out). `tools/workspace-hygiene.sh status|clean` is the canonical way to measure and drop that weight, `clean --deps` before a long handoff, and no server, watcher, probe, or scratch file is left behind. **Every task ends `LIGHT`:** the closing action of any task or commit, documentation-only ones included, is `bash tools/workspace-hygiene.sh clean --all`, so no dependency tree, browser binary, build output, or test artifact survives a finished task. This is an operating rule, not a product change: it removes only git-ignored output and never touches tracked sources or evidence.
