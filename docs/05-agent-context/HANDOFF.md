# Handoff

## Restart checklist

1. `cd /home/user/projects/nasaq-ai`
2. Read `AGENTS.md`, then apply `AGENT-OPERATING-METHOD.md`.
3. Read `docs/05-agent-context/CURRENT-STATE.md`, this handoff, and `DECISIONS.md`.
4. Run `git status --short --branch`, `git log -5 --oneline`, `git rev-parse HEAD`, and `git rev-parse origin/main`.
5. Confirm the newest GitHub/Vercel state; do not assume an identifier copied here is the latest docs-only closure.
6. Read `docs/04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md` before Agent/Run/Tool/Skill/Approval or Backend work.
7. Read `agent-skills-web-uiux/README.md` and its current report; load only relevant extracts.
8. Choose the assigned track explicitly. For U2, read the canonical U2 package plus its mandatory boundary addendum. For product-agent architecture, follow `PA-ARCH-001..012` and do documentation/specification work only.
9. If dependencies are absent, run `npx npm@11.6.4 ci` from the root lockfile.
10. Run the baseline gates before changing runtime code.
11. Keep the workspace light: `bash tools/workspace-hygiene.sh status` before heavy work; install Playwright browsers outside the workspace via `PLAYWRIGHT_BROWSERS_PATH` and only the engines the gate needs.
12. End every task `LIGHT`: the last action of a task or commit is `bash tools/workspace-hygiene.sh clean --all`. A finished task leaves no `node_modules`, browser binary, build output, or test artifact behind.

## Current handoff point

**The product-agent architecture audit is complete; product-agent Backend is `NO-GO`. `U2.0` Foundation and `U2.1` Learn are implemented, verified, and deployed; the next slice is `U2.2` Research, and it needs an explicit go.** See [`U2-NEXT-SESSION-RESEARCH.md`](U2-NEXT-SESSION-RESEARCH.md) for the restart brief of that slice.

The current runtime still uses one generic `ServiceWorkspace` for the service routes and a timeout-driven generic result. Contracts and mock API do not yet contain the U2 service-session/artifact domain. Separately, the Agent/Run contracts are Prototype view/simulation shapes, and no Agent Backend, provider adapter, database, durable orchestrator, worker, tool executor, credential broker, persistent memory, telemetry exporter, prompt registry, or eval runner exists.

There are now two explicit tracks:

- **U2:** may implement Frontend-only Service Depth under the U2 prompt and mandatory boundary addendum.
- **Product-agent architecture:** may close `PA-G0..PA-G10` readiness artifacts; it must not implement Backend until the gates and limited GO pass.

The portable operating standard is now `AGENT-OPERATING-METHOD.md` v2.0, with `.agents/skills/evidence-led-agent-workflow/SKILL.md` v2.0.0 as its concise activation layer. The method integrates requirements, context/prompt engineering, architecture, decomposition, code organization, tests/evals, security, maintainability, and agent lifecycle without replacing project-specific authority. Its permanent verification receipt is [`../04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md`](../04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md). Integration commit `be3cccab0dda867dd5fa40d6e4a2def69e692c04` is on GitHub `main`; matching Vercel deployment `dpl_BtRLiGPnGFKHiuy9wE548MLyzSHE` is `READY`, source-matched, aliased to production, and HTTP-smoked on four Arabic/English routes.

This operating-standard update is closed and does not implement U2. The U2 implementation handoff remains U2.0 Foundation below; the separate product-agent architecture handoff is documentation-only.

### U2.0 delivery (closed)

- Content commit: `4f257124a829202384963510cc3422f58a3c5f6a`, pushed to GitHub `main` (`17ddea3..4f25712`).
- Matching Vercel deployment `dpl_66T9CeDnMz6D1YhRkQ7wMGQ1QRo3` reached the completed deployment state attached to that exact commit; the production alias <https://nasaq-ai.vercel.app> returned HTTP 200 on `/ar`, `/en`, `/ar/app/home`, `/en/app/research`, and both `/{ar,en}/preview/service-foundation` routes, with a production CSS/HTML fingerprint proving the alias serves this commit only.
- Implemented: shared service contracts, deterministic event simulator, session-only storage, ar/en service dictionaries, shared Service Workbench (registry, reducer/provider, shell, overlays), noindex foundation surface, 56 unit + 15 E2E tests.
- Gates: `npm run check` 0 (ESLint 0/0, typecheck, Vitest 56/56, build); audit 0; Chromium 15/15 and 30/30 baseline; cross-browser 42 passed/3 skipped and 88 passed/2 skipped; Axe `pass/0` on all nine captures with zero document overflow.
- Evidence: `docs/04-delivery/evidence/u2/u2-0-foundation/` (nine captures + manifest). Receipt: [`../04-delivery/U2-0-FOUNDATION-VERIFICATION.md`](../04-delivery/U2-0-FOUNDATION-VERIFICATION.md).
- Boundaries preserved: no Backend/API/DB/provider/live search/upload/file processing/execution/sandbox/persistent memory; `PA-G0..PA-G10` unchanged and still `NO-GO`. `ServiceWorkspace` still serves every `/[locale]/app/{service}` route.
- Next: `U2.1` Learn (not started).

### Canonical U2 package

1. [`../01-product/U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md) — source of truth for scope and product/architecture behavior.
2. [`../04-delivery/U2-TRACEABILITY-AND-QA.md`](../04-delivery/U2-TRACEABILITY-AND-QA.md) — source of truth for acceptance, tests, browsers, evidence, receipts, and release closure.
3. [`U2-IMPLEMENTATION-PROMPT.md`](U2-IMPLEMENTATION-PROMPT.md) — copy-ready instructions for the implementation agent.
4. [`U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md`](U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md) — mandatory separation from future Agent Runtime.

Do not interpret the planning documents as evidence that any requirement passed. `U2.0` rows were updated only with fresh post-change evidence (16 core rows: `PASS` or `IN PROGRESS`); `U2.1`–`U2.7` rows remain `NOT STARTED` until their own evidence updates the matrix. U2 does not close any `PA-G*` product-agent readiness gate.

### Product-agent architecture handoff

The controlling artifact is [`../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md`](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md). Its evidence matrix finds Persona/System Prompt/Context/Memory/Tools/Skills/Permissions/Durable Execution/Errors/Telemetry/Evals/Release partially specified across documents but not joined into an executable canonical architecture. Start with `PA-ARCH-001` (boundaries/glossary), then threat model and data classification. Complete `PA-ARCH-001..012` as documentation/specification work; do not add Backend/API/DB/provider/worker/tool/memory code. Product, Backend/AI, and Security/Privacy must approve the limited GO after `PA-G0..G9` pass.

## Verified product-agent audit delivery

- Content commit: `88e10738a0a23214d440741957f6b15c6323f27a`, pushed to GitHub `main`.
- Matching Vercel deployment: `dpl_6YoLRZg6dRqwfWWJs8JekpjSfREt` (`READY`, `errorCode: null`, target `production`, source SHA matched).
- Production aliases: <https://nasaq-ai.vercel.app>, `nasaq-ai-4zobir89-labs-projects.vercel.app`, and `nasaq-ai-git-main-4zobir89-labs-projects.vercel.app`.
- HTTP 200: `/ar`, `/en`, `/ar/app/home`, `/en/app/research`, plus `/ar` on the immutable deployment.
- Repository/documentation gates: PASS; external URLs 28 HTTP 200 + one non-normative Reddit 403 + no definite broken reference.
- Receipt: [`../04-delivery/PRODUCT-AGENT-ARCHITECTURE-AUDIT-VERIFICATION.md`](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-AUDIT-VERIFICATION.md).

A context-only closure may be newer; trust fresh Git/Vercel inspection over these historical identifiers.

## Verified U2 planning delivery

- Content commit: `4fc72140f1402c07c40ec0bfefc5d61efcd6db93`, pushed to GitHub `main`.
- Matching Vercel deployment: `dpl_FQrq9imwQDPehM4mmn6vGLN3mi83` (`READY`, no error, production aliases attached).
- Production alias: <https://nasaq-ai.vercel.app>
- HTTP 200: `/ar`, `/en`, `/ar/app/home`, `/en/app/research`.
- Receipt: [`../04-delivery/U2-PLANNING-VERIFICATION.md`](../04-delivery/U2-PLANNING-VERIFICATION.md).

## Stable product baseline before planning

- Baseline commit: `c71d83a9f422d476134b7e39ee077184fbdd2ae5`
- Baseline deployment: `dpl_3PWz7ZDSKT8J1996fvSXD4mC7jqe` (`READY`)
- Final U1.2 runtime hardening: `7f9f9eeba5f15054b03acd9cf4bcbeea03b41dc4`

Always trust current Git/Vercel inspection over historical identifiers; a context-only closure commit may follow the content commit.

## First implementation target: U2.0 Foundation

Do not start by restyling all six pages. Build and close the foundation vertically:

- Zod contracts for ServiceSession/Run/Stage, Artifact/Version, EvidenceRef, SimulationReceipt, and HandoffBundle.
- layered lifecycle and final-state guards.
- deterministic fixture/scenario/event simulator with injectable clock, sequence, cancel/retry/race handling.
- Service Workbench provider/interface/primitives, truth disclosure, and receipt.
- typed Arabic/English service namespaces.
- memory + versioned session-storage adapters and privacy/clear/error behavior.
- explicit service registry/feature boundaries while preserving current routes.
- unit/contract/core integration/E2E skeleton and baseline regression.

Only after U2.0 is verified, receipted, pushed, deployed, and production-smoked should the agent proceed to Learn, then the remaining slices in the contract order.

## Hard boundaries

- Ask remains the general gateway/router; no seventh domain editor.
- Six explicit domain compositions; no `serviceId === ...` soup or boolean-prop explosion.
- Frontend simulation only; no Backend/database/auth/provider/live search/real file processing.
- U2 `ServiceRun`/`ServiceEvent`/`SimulationReceipt` remain separate from future `AgentRun`/durable events/`ExecutionReceipt`; do not promote Prototype Agent contracts to Backend schemas.
- Product-agent Backend remains `NO-GO` until `PA-G0..PA-G10` close as defined in the audit.
- no arbitrary code execution, shell, sandbox, Git, image generation, or external telemetry.
- Analyze uses bundled samples for deterministic local calculations only.
- local file interaction is metadata-only if implemented; no content read/upload/persistence.
- Code preview/checks are fixture-based; no `eval`, `new Function`, user `srcdoc`, or executable import.
- storage is session-only with disclosure; never described as account/cloud sync.
- `DESIGN.md` conflicting Precision direction is superseded by Universal Reset/Luminous/U2.
- no new dependency without targeted source research, ADR, supply-chain/license/bundle/accessibility review, and explicit scope discipline.

## Baseline commands

```bash
cd /home/user/projects/nasaq-ai
npx npm@11.6.4 ci          # only when dependencies need restoration
npm run check
npm audit --audit-level=high
npm run test:e2e --workspace=@nasaq/web -- \
  tests/e2e/wave-one.spec.ts \
  tests/e2e/responsive.spec.ts \
  tests/e2e/motion-feedback.spec.ts
PLAYWRIGHT_CROSS_BROWSER=1 npm run test:e2e --workspace=@nasaq/web -- \
  tests/e2e/wave-one.spec.ts \
  tests/e2e/responsive.spec.ts \
  tests/e2e/motion-feedback.spec.ts
```

Use the planned U2 suites/IDs from the QA matrix as they are implemented. If Playwright browsers/host libraries are absent, install only what is required and record it; inspect any external script rather than blindly executing fetched instructions.

## Required updates per completed slice

- `docs/04-delivery/U2-TRACEABILITY-AND-QA.md`
- a slice verification receipt under `docs/04-delivery/`
- evidence + `manifest.json` under `docs/04-delivery/evidence/u2/<slice>/`
- `CURRENT-STATE.md`, `WORKLOG.md`, `DECISIONS.md`, and this handoff
- relevant product/architecture docs when contracts change
- Git commit/push and matching Vercel `READY` + production alias evidence

## Skills/research route

Read the local report, then use only the needed extracts: source-driven, Interface Design, React best practices/composition, accessibility, Playwright, web-quality, security, and research synthesis. Verify implementation-specific APIs against current official docs and version-matched Next docs. Repositories/forums/social are useful for maintenance/accessibility pain and failure signals, but do not outrank official docs or tests.

## Truth in delivery

If a browser, screen reader, deployment credential, or production gate is unavailable, mark it `UNVERIFIED` and give the exact missing capability. Do not turn a skipped test, a screenshot, a local pass, or a Vercel build notification into a broader completion claim.

No credentials are stored here. Never add tokens or secrets to any repository artifact.
