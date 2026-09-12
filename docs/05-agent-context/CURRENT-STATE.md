# Current State

Last updated: 2026-09-12 (Asia/Aden)

## Milestone status

**U2 — Service Depth is fully specified and ready for implementation handoff; no U2 product implementation has started.**

The completed planning package is:

- [`docs/01-product/U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md) — canonical stage contract: scope, architecture, shared domain model, service-by-service workflows, states, truth/security boundaries, sequencing, risks, and acceptance criteria.
- [`docs/04-delivery/U2-TRACEABILITY-AND-QA.md`](../04-delivery/U2-TRACEABILITY-AND-QA.md) — 79 requirement rows mapped to planned unit/integration/E2E/manual checks and evidence. Every implementation row remains `NOT STARTED`.
- [`U2-IMPLEMENTATION-PROMPT.md`](U2-IMPLEMENTATION-PROMPT.md) — restart-ready request for a new implementation agent.
- [`docs/04-delivery/U2-PLANNING-VERIFICATION.md`](../04-delivery/U2-PLANNING-VERIFICATION.md) — local checks, checksums, GitHub commit, matching Vercel deployment, and production HTTP smoke.

This delivery changes documentation only. It does not replace `ServiceWorkspace`, add contracts/fixtures, implement specialized workspaces, or alter runtime behavior.

## Agent operating standard v2.0

The repository's portable agent method has been expanded and reviewed as version 2.0:

- `AGENT-OPERATING-METHOD.md` is now a 26-section, vendor/model/stack/project-neutral procedure spanning requirements, context and prompt engineering, architecture, decomposition, construction, debugging, testing/evals, security/privacy/safety, maintainability/operations, agent lifecycle, verification, delivery, and reusable templates.
- `.agents/skills/evidence-led-agent-workflow/SKILL.md` is synchronized at version 2.0.0 as a concise activation layer; the canonical method remains the source of truth.
- Research covers current standards/official sites, repositories, and explicitly non-normative forum/social signals. The canonical reference section carries 37 links.
- Full-document structure, portability, links, whitespace, Markdown, credential patterns, and official Agent Skills validation passed. `npm run check` passed after dependency restoration: ESLint, all workspace typechecks, Vitest 4/4, and a 57-page Next.js production build.
- Permanent receipt: [`docs/04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md`](../04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md).
- Integration commit `be3cccab0dda867dd5fa40d6e4a2def69e692c04` was pushed to GitHub `main`; matching Vercel deployment `dpl_BtRLiGPnGFKHiuy9wE548MLyzSHE` reached `READY` with `errorCode: null`, all production aliases attached, and source SHA equal to the integration commit.
- Production smoke returned HTTP 200 for `/ar`, `/en`, `/ar/app/home`, and `/en/app/research`.

This methodology work is closed and does not start or satisfy any U2 implementation row. Inspect the current closure commit and newest deployment on restart rather than assuming the integration deployment remains the newest metadata-only build.

## Stable product baseline before U2 planning

- Branch: `main`
- Commit: `c71d83a9f422d476134b7e39ee077184fbdd2ae5`
- Production: <https://nasaq-ai.vercel.app>
- Vercel deployment recorded for that baseline: `dpl_3PWz7ZDSKT8J1996fvSXD4mC7jqe` (`READY`)
- Working tree was clean and `HEAD == origin/main` when U2 discovery began.
- Final U1.2 runtime hardening: `7f9f9eeba5f15054b03acd9cf4bcbeea03b41dc4`.
- U1.2 local and production evidence remains canonical in `docs/04-delivery/U1-2-MOTION-VERIFICATION.md`.

## U2 planning delivery

- Content commit: `4fc72140f1402c07c40ec0bfefc5d61efcd6db93` (`docs: specify U2 service depth`), pushed to GitHub `main`.
- Matching deployment: `dpl_FQrq9imwQDPehM4mmn6vGLN3mi83` (`READY`, `errorCode: null`, target `production`).
- Confirmed aliases: `nasaq-ai.vercel.app`, `nasaq-ai-4zobir89-labs-projects.vercel.app`, and `nasaq-ai-git-main-4zobir89-labs-projects.vercel.app`.
- Production HTTP smoke: 200 on `/ar`, `/en`, `/ar/app/home`, and `/en/app/research`.
- Repository gates: `npm run check` PASS; Vitest 4/4; build 57 pages; `npm audit --audit-level=high` found 0 vulnerabilities.
- Planning integrity: 79/79 requirement IDs mapped, 0 broken relative links across 23 changed Markdown files, staged credential-pattern scan 0 hits.

A restarting agent must still inspect current `HEAD`, `origin/main`, and the newest Vercel deployment rather than assuming this content commit is the latest context-only closure.

## U2 decisions now fixed

1. Build six specialized workspaces: Learn, Research, Create, Code, Analyze, Explore.
2. Keep Ask & Talk as the general gateway/router with explicit user-confirmed handoff; do not build a seventh domain editor.
3. Use a shared Service Workbench only for lifecycle, session/storage, artifact actions, receipts, and handoffs; compose explicit domain workspaces rather than a giant conditional component.
4. Split ServiceSession, ServiceRun, ServiceStage, Artifact/Version, EvidenceRef, SimulationReceipt, and HandoffBundle into typed Zod contracts.
5. Use deterministic fixtures/events with injectable clock, sequence, cancellation, retry, warning, and race states; no `Math.random()` or timeout-only success.
6. Keep U2 Frontend-only and explicitly simulated: no provider/model, live search, real upload/file processing, arbitrary code execution, sandbox, Git action, database, auth, or external telemetry.
7. Analyze may perform pure local calculations only on bundled sample datasets. A local file control, if present, is metadata-only and must not read/upload/persist content.
8. Code preview/tests are fixed fixture outcomes; user code is never evaluated or injected into executable HTML.
9. Demo artifacts may persist in versioned `sessionStorage` through an adapter, with a visible session-only disclosure and clear action; this is not account/cloud persistence.
10. `DESIGN.md` is a historical Precision Workspace baseline. Universal Reset, the implemented Luminous system, U1.2 motion contract, and the U2 contract supersede conflicting visual/product directions.

## Service outcomes

- **Learn:** diagnostic/self-level → editable path → lesson → check → feedback/progress.
- **Research:** brief → editable approved plan → fixture source activity → evidence/claim matrix → cited report/limitations.
- **Create:** brief → structure/variants → editable document/deck/visual concept → review/version/save.
- **Code:** scope/plan → files → proposed diff → accept/reject → static preview/deterministic checks → review receipt.
- **Analyze:** sample/profile → question/assumptions → pure transform → table/chart → reconciliation.
- **Explore:** seed → bounded map/equivalent list → short/deep trail → branch/checkpoint/save.

## Implementation sequence

- `U2.0` foundation: contracts, lifecycle/events, fixtures/simulator, workbench provider/primitives, i18n namespaces, storage adapter, core tests.
- `U2.1` Learn.
- `U2.2` Research.
- `U2.3` Create.
- `U2.4` Code.
- `U2.5` Analyze.
- `U2.6` Explore.
- `U2.7` Ask/Home/Library/handoffs, integration, hardening, final evidence and production closure.

Each slice is independently verified, committed, pushed, deployed, and production-smoked when complete. Do not batch a broken `main`, and do not claim all U2 complete after one service.

## Quality baseline that must not regress

- Arabic/English, RTL/LTR, and mixed-bidi fixtures.
- 320–1920px, existing ten-viewport regression, 200% reflow, no document horizontal overflow.
- 44px primary touch targets and safe-area/mobile-sheet geometry.
- keyboard/focus/semantic alternatives for graph/chart/diff/editor surfaces.
- reduced motion, forced colors, and U1.2 feedback semantics.
- no serious/critical Axe on critical Chromium/Firefox states; WebKit remains interaction/layout/overflow evidence.
- no console/page errors, no secrets, and no misleading live-service claims.
- Chromium/Firefox/WebKit gates plus exact commit/Vercel/alias evidence.

## Immediate next action

A new agent should use `U2-IMPLEMENTATION-PROMPT.md`, confirm the latest synchronized `main` and baseline gates, then implement **U2.0 Foundation only** before touching Learn. It must use targeted current official documentation and relevant audited skill extracts, keep the current routes stable, and stop if Backend/provider/file-processing/sandbox/new-dependency scope becomes necessary.

## Secrets

No credentials belong in the repository. Use GitHub/Vercel credentials only through secure environment facilities, transiently. Never add tokens, private keys, `.env` values, credential-bearing URLs, or personal browser state to source, docs, logs, screenshots, traces, commits, or agent context.
