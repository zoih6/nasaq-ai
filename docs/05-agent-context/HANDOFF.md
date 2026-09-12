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

## Current handoff point

**The product-agent architecture audit is complete; product-agent Backend is `NO-GO`. U2 planning is complete and U2 implementation is not started.** No product/runtime code changed during the audit.

The current runtime still uses one generic `ServiceWorkspace` for the service routes and a timeout-driven generic result. Contracts and mock API do not yet contain the U2 service-session/artifact domain. Separately, the Agent/Run contracts are Prototype view/simulation shapes, and no Agent Backend, provider adapter, database, durable orchestrator, worker, tool executor, credential broker, persistent memory, telemetry exporter, prompt registry, or eval runner exists.

There are now two explicit tracks:

- **U2:** may implement Frontend-only Service Depth under the U2 prompt and mandatory boundary addendum.
- **Product-agent architecture:** may close `PA-G0..PA-G10` readiness artifacts; it must not implement Backend until the gates and limited GO pass.

The portable operating standard is now `AGENT-OPERATING-METHOD.md` v2.0, with `.agents/skills/evidence-led-agent-workflow/SKILL.md` v2.0.0 as its concise activation layer. The method integrates requirements, context/prompt engineering, architecture, decomposition, code organization, tests/evals, security, maintainability, and agent lifecycle without replacing project-specific authority. Its permanent verification receipt is [`../04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md`](../04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md). Integration commit `be3cccab0dda867dd5fa40d6e4a2def69e692c04` is on GitHub `main`; matching Vercel deployment `dpl_BtRLiGPnGFKHiuy9wE548MLyzSHE` is `READY`, source-matched, aliased to production, and HTTP-smoked on four Arabic/English routes.

This operating-standard update is closed and does not implement U2. The U2 implementation handoff remains U2.0 Foundation below; the separate product-agent architecture handoff is documentation-only.

### Canonical U2 package

1. [`../01-product/U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md) — source of truth for scope and product/architecture behavior.
2. [`../04-delivery/U2-TRACEABILITY-AND-QA.md`](../04-delivery/U2-TRACEABILITY-AND-QA.md) — source of truth for acceptance, tests, browsers, evidence, receipts, and release closure.
3. [`U2-IMPLEMENTATION-PROMPT.md`](U2-IMPLEMENTATION-PROMPT.md) — copy-ready instructions for the implementation agent.
4. [`U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md`](U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md) — mandatory separation from future Agent Runtime.

Do not interpret the planning documents as evidence that any requirement passed. All 79 implementation requirements remain `NOT STARTED` until fresh evidence updates the matrix. U2 does not close any `PA-G*` product-agent readiness gate.

### Product-agent architecture handoff

The controlling artifact is [`../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md`](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md). Its evidence matrix finds Persona/System Prompt/Context/Memory/Tools/Skills/Permissions/Durable Execution/Errors/Telemetry/Evals/Release partially specified across documents but not joined into an executable canonical architecture. Start with `PA-ARCH-001` (boundaries/glossary), then threat model and data classification. Complete `PA-ARCH-001..012` as documentation/specification work; do not add Backend/API/DB/provider/worker/tool/memory code. Product, Backend/AI, and Security/Privacy must approve the limited GO after `PA-G0..G9` pass.

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
