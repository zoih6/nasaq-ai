# Handoff

## Restart checklist

1. `cd /home/user/projects/nasaq-ai`
2. Read `AGENTS.md`, then apply `AGENT-OPERATING-METHOD.md`.
3. Read `docs/05-agent-context/CURRENT-STATE.md`, this handoff, and `DECISIONS.md`.
4. Run `git status --short --branch`, `git log -5 --oneline`, `git rev-parse HEAD`, and `git rev-parse origin/main`.
5. Confirm the newest GitHub/Vercel state; do not assume an identifier copied here is the latest docs-only closure.
6. Read `agent-skills-web-uiux/README.md` and its current report; load only relevant extracts.
7. Read the three U2 handoff documents listed below before implementation.
8. If dependencies are absent, run `npx npm@11.6.4 ci` from the root lockfile.
9. Run the baseline gates before changing runtime code.

## Current handoff point

**U2 planning is complete. U2 implementation is not started.** The current runtime still uses one generic `ServiceWorkspace` for the service routes and a timeout-driven generic result. Contracts and mock API do not yet contain the U2 service-session/artifact domain.

### Canonical U2 package

1. [`../01-product/U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md) — source of truth for scope and product/architecture behavior.
2. [`../04-delivery/U2-TRACEABILITY-AND-QA.md`](../04-delivery/U2-TRACEABILITY-AND-QA.md) — source of truth for acceptance, tests, browsers, evidence, receipts, and release closure.
3. [`U2-IMPLEMENTATION-PROMPT.md`](U2-IMPLEMENTATION-PROMPT.md) — copy-ready instructions for the implementation agent.

Do not interpret the planning documents as evidence that any requirement passed. All 79 implementation requirements remain `NOT STARTED` until fresh evidence updates the matrix.

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
