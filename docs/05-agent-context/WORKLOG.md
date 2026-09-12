# Worklog

## 2026-09-12 — U1.2 started

- Confirmed clean U1.1 production baseline at `2c1d9e5ced7e60a6514857c2b2f1222f1430914f`.
- Audited motion, timers, loading, ready, empty, dialog, drawer, panel, and live-region behavior across Universal marketing, app shell, adaptive home, service workspaces, Library, and route loading.
- Researched Material, Carbon, Fluent, Apple HIG, Motion, MDN, W3C WCAG, NN/g, open-source repositories, Reddit, and X discussions.
- Identified unbounded decorative loops on the marketing live indicator and floating scene cards; these must be bounded or removed.
- Chose a CSS-token-first implementation with small shared React status primitives rather than adding a runtime animation dependency.
- Added `AGENTS.md` and this durable agent-context directory. No U1.2 product code had been changed at this log entry.

## 2026-09-12 — U1.2 implemented and locally verified

- Added centralized duration/easing/distance/activity tokens and a dedicated `motion.css` layer.
- Added shared typed working/success/error/info feedback and persistent toast primitives.
- Applied finite motion and open/closed focus gating across marketing menu, shell drawer/backdrop, advanced disclosure, notifications, command palette, personalization dialog, and route changes.
- Added explicit validation/recovery, busy, success, cancellation, and empty-state recovery to Home, Service Workspace, marketing demo, and Library.
- Removed unbounded marketing float/live loops; retained only active busy motion and a static reduced-motion equivalent.
- Added `motion-feedback.spec.ts`; the gate exposed and drove fixes for bottom-sheet viewport escape, scale-reduced touch targets, a shrinking topbar avatar, and stale completion timers.
- Local results: check PASS; Vitest 4/4; 57-page build; audit 0; full Chromium 46/46; cross-browser U1/U1.1/U1.2 88 passed + 2 expected skips from 90.
- Captured nine U1.2 visual states; every route returned 200 with zero document overflow and zero browser errors.

## 2026-09-12 — U1.2 deployed and production-verified

- Committed the U1.2 implementation as `89ed5294637ca455636496c9e3bc88a1a7a2ec22` and pushed it to GitHub `main`.
- Verified matching Vercel deployment `dpl_HWsQ7JrCqrFZFQY4tbahjyfCwF39` reached `READY` and served <https://nasaq-ai.vercel.app>.
- Ran the live U1.2 gate on Chromium, Firefox, and WebKit: **22 PASS + 2 expected forced-colors skips / 24**.
- Ran the live U1/U1.1 Chromium regression across ten viewports and core flows: **22/22 PASS**.
- The first WebKit reduced-motion run missed the deliberately brief working state because protocol round-trips exceeded its 760ms lifetime. Capturing the DOM state and computed animation styles inside one browser task removed that test race; the targeted rerun and complete live gate passed without a product-code change.
- Restored three legacy evidence screenshots touched by the production regression so the final delivery update does not rewrite prior milestone evidence.
- Updated the receipt, root README, and durable agent context. U1.2 is closed; U2 Service Depth is next.

## 2026-09-12 — Portable evidence-led agent method added

- Researched current official guidance for `AGENTS.md`, Agent Skills structure/progressive disclosure, cross-client skill discovery, Claude project memory/imports, and GitHub Copilot repository instructions.
- Authored `AGENT-OPERATING-METHOD.md` as a vendor-neutral operating procedure covering repository bootstrap, real-tool discipline, source-driven research, skill activation, UI/UX craft, engineering, debugging, security, verification, deployment, and durable handoff.
- Added `.agents/skills/evidence-led-agent-workflow/SKILL.md` as a concise standards-compatible activation layer.
- Copied the complete `agent-skills-web-uiux/` research workspace into the repository: 93 files and approximately 2.2 MB, including the current report, source extracts, audits, archived report, checksums, and renderer.
- Verified the copied library contains no symlinks or nested VCS metadata; its current report checksums pass and a credential/private-key pattern scan found no matches.
- Added lightweight discovery files for Claude Code, Gemini CLI, and GitHub Copilot while keeping `AGENTS.md` canonical.
- Updated the root README and durable context so future agents discover the method and understand that skills/retrieved content are untrusted, progressively loaded references rather than automatic authority.
- Validated the local skill with the official `skills-ref` reference library at upstream commit `69ef37e9424c0a7ea9dd2293b559e43ec8176379`: **Valid skill**.
- Ran `npm run check`: lint and workspace typechecks passed, Vitest 4/4 passed, and the 57-page production build passed.
- Committed and pushed the operating foundation as `b225c5cb2508b4191b92ad43999de3ee6145f983`; matching Vercel deployment `dpl_9QEhikhxnXoWj2rhCtypwK9AFZAD` reached `READY` with the production alias attached.
- Added `docs/04-delivery/AGENT-OPERATING-METHOD-VERIFICATION.md` as the permanent evidence receipt.
- A final alias smoke on the subsequent documentation deployment exposed a timing-sensitive Axe contrast failure in the research workspace output: 7/8 passed initially, and an eight-run reproduction yielded 3 passes / 5 failures while the result entrance opacity was still blending colors.
- First hardening used the semantic `--service-deep` token for the active output step (6.47:1 for research; 6.32–7.85:1 across service deep/soft pairs) and added a computed-token assertion. Local 12/12 + 5/5 targeted and 8/8 full gates passed; commit `0b07c4a70dbf0b3103daba1b8d24a1e806554497` deployed as `dpl_HmfRwMycXAXA8zqCeNzyerX4eXqk` (`READY`).
- An eight-run production repetition on that build passed 7/8: the active step remained fixed, but an earlier scan caught four other descendants blended below 4.5:1. This disproved the narrow hypothesis and located the full cause at the shared parent-opacity entrance.
- Removed opacity from `universal-result-in` while retaining the 6px/.99 spatial cue and reduced-motion path. Replaced the remaining WebKit transient-state race with a browser-local MutationObserver after a React-confirmed starter selection. Final local evidence: `npm run check` PASS, audit 0, targeted repetition 20/20 PASS, Chromium 8/8, WebKit reduced-motion repetition 10/10, and cross-browser 22 pass + 2 expected forced-colors skips.
- Pushed final runtime hardening as `7f9f9eeba5f15054b03acd9cf4bcbeea03b41dc4`; matching deployment `dpl_HuFbb7afzkjRUQrsE9PhZMSNLiCx` reached `READY` with no error and all production aliases. Final-alias evidence: targeted service/Axe **20/20**, complete Chromium repository suite **46/46**, and HTTP **200** for `/ar` and `/en`.

## 2026-09-12 — U2 Service Depth discovery and implementation contract completed

- Confirmed a clean synchronized baseline at `c71d83a9f422d476134b7e39ee077184fbdd2ae5` before planning.
- Inspected the generic service route/component/content, Home, Library, contracts, mock API, i18n, current CSS, architecture/product/design documents, and U1 E2E gates.
- Verified that all seven service routes currently share one timeout-driven `ServiceWorkspace` result and that U2 service-session/artifact contracts and deterministic service fixtures do not yet exist.
- Researched current official product patterns for guided learning, deep research, editable canvases, code-review/sandbox boundaries, data-analysis provenance/accessibility, and knowledge maps; used repository and Reddit/Hacker News signals only as qualitative failure evidence.
- Selected a small audited skill stack: source-driven development, research synthesis, Interface Design, React composition/best practices, accessibility, Playwright, web quality, and security.
- Fixed the U2 product decision: six specialized workspaces; Ask remains the general gateway/router; a shared Service Workbench owns lifecycle/receipts/storage while domain compositions remain independent.
- Resolved roadmap ambiguity: U2 uses explicit fixtures, metadata-only file interaction, static Code preview/checks, bundled deterministic Analyze calculations, and session-only demo persistence; real search/upload/processing/sandboxes/providers remain later milestones.
- Added `docs/01-product/U2-SERVICE-DEPTH.md`, a complete canonical contract with service stages, artifacts, state layers, truth/security/analytics boundaries, sequencing, risks, acceptance criteria, and research/repository/skill links.
- Added `docs/04-delivery/U2-TRACEABILITY-AND-QA.md`, mapping 79 requirements to planned unit/integration/E2E/manual checks, cross-browser/responsive matrices, evidence manifests, receipts, and release gates. All implementation rows remain `NOT STARTED`.
- Added `docs/05-agent-context/U2-IMPLEMENTATION-PROMPT.md`, a restart-ready instruction package that begins with U2.0 Foundation and forbids overclaiming or unapproved Backend/provider scope.
- Added cross-document pointers and a formal supersession notice to the historical Precision design baseline.
- No product code, runtime behavior, dependency, Backend, or provider integration was changed in this planning task.
- Local planning gates passed: 79/79 acceptance IDs traced, 0 broken relative links across 23 changed Markdown files, `npm run check` PASS, Vitest 4/4, 57-page build, audit 0, and staged credential-pattern scan 0 hits.
- Pushed the planning content as `4fc72140f1402c07c40ec0bfefc5d61efcd6db93`; matching Vercel deployment `dpl_FQrq9imwQDPehM4mmn6vGLN3mi83` reached `READY` with the production aliases attached.
- Production HTTP smoke returned 200 for `/ar`, `/en`, `/ar/app/home`, and `/en/app/research`; the permanent receipt is `docs/04-delivery/U2-PLANNING-VERIFICATION.md`.

## 2026-09-12 — Portable operating method expanded to v2.0 and locally verified

- Re-read the canonical method, activation skill, project instructions, durable context, and previous delivery receipt before editing; confirmed the clean synchronized baseline at `60bc37b5f1b166bf5517fbdd121171763a44c432`.
- Researched and cross-checked SWEBOK, NIST SSDF/AI guidance, CMU SEI architecture material, C4/ADRs, Google code-review practices, current Anthropic/OpenAI/Google/Microsoft prompt and agent guidance, OWASP agentic threats, Agent Skills, HumanLayer 12-Factor Agents, Promptfoo, and qualitative Hacker News/Reddit field signals.
- Expanded `AGENT-OPERATING-METHOD.md` to v2.0 while preserving the previous repository-first, research, UI/UX, debugging, security, verification, and durable-handoff guarantees.
- Integrated practical procedures and gates for BCP 14 instruction precedence, requirements/quality scenarios/change control, context assembly/compaction, prompt contracts and behavior-bundle versioning, architecture/ADRs, dependency-aware planning, safe multi-agent coordination, code organization, risk-based tests and probabilistic evals, privacy/safety/supply chain, maintenance/operations/retirement, and bounded agent lifecycle/recovery.
- Added five reusable templates and a categorized primary-source/reference section with 37 unique URLs; live URL checks returned 34 HTTP 200, three access-controlled HTTP 403, and no 404/5xx.
- Synchronized `.agents/skills/evidence-led-agent-workflow/SKILL.md` at v2.0.0 and validated it with official `skills-ref` at upstream commit `69ef37e9424c0a7ea9dd2293b559e43ec8176379`: **Valid skill**.
- Full-document audits passed: 26/26 sequential sections, balanced fences, no tabs/trailing whitespace, no duplicate non-trivial long lines, required coverage present, portable scope intact, changed relative links valid, and no credential after review of two URL-text false positives from a deliberately broad `sk-` heuristic.
- Markdownlint v0.38.0 passed with 0 errors after disabling only the repository-incompatible 80-column rule (`MD013`); default output contained only that style rule.
- Restored dependencies with `npm ci` after the first gate correctly failed because `eslint` was absent. Installation audited 461 packages with 0 vulnerabilities and warned that locked `eslint@9.39.5` is unsupported.
- `npm run check` then passed: ESLint, all workspace typechecks, Vitest 4/4, Next.js 16.3.4 build, and 57/57 generated pages.
- Added `docs/04-delivery/AGENT-OPERATING-METHOD-V2-VERIFICATION.md` and synchronized discovery/context files. No product/runtime/U2 implementation changed.
- Committed the integrated method as `be3cccab0dda867dd5fa40d6e4a2def69e692c04` and pushed it to GitHub `main`.
- Verified source-matching production deployment `dpl_BtRLiGPnGFKHiuy9wE548MLyzSHE` reached `READY` with no error and all three production aliases attached.
- Production HTTP smoke returned 200 for `/ar`, `/en`, `/ar/app/home`, and `/en/app/research`. The methodology task is closed; U2 remains `NOT STARTED`.

## 2026-09-12 — Product-agent architecture readiness audit completed

- Inspected the product vision, PRD, state machines, conceptual contracts, permissions, Frontend architecture, U2 contract/prompt, actual Zod contracts, mock fixtures/data adapters, Agent Builder, Run/Approval UI, package topology, and existing Vitest/Playwright coverage.
- Confirmed the distinction between the mature development-agent method in `AGENT-OPERATING-METHOD.md` and the still-incomplete Nasaq Product Agent Runtime architecture.
- Verified that the current source contains no Agent Backend/API route, provider adapter, database, queue/worker, durable orchestrator, tool executor, credential broker, persistent memory, prompt registry, telemetry exporter, or agent eval runner.
- Documented concrete drift between conceptual contracts and actual schemas: no canonical AgentVersion resource, thin AgentDefinition, reduced tool risks/run states, presentation-only events, no ToolGrant/SkillBinding/ContextPolicy/MemoryPolicy/PromptBundle, and browser-only publish/test/approval/receipt behavior.
- Researched current official guidance from Anthropic, OpenAI, Google ADK, Microsoft, MCP, Agent Skills, Temporal, OpenTelemetry, OWASP, and NIST; checked relevant repositories and retained Hacker News/Reddit only as non-normative field signals.
- Added `docs/04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md` with evidence matrix, threat register, target boundaries, canonical resource requirements, test strategy, `PA-G0..PA-G10` gates, phased remediation plan, sources, repository links, skills, and a restart-ready architecture handoff.
- Added `docs/05-agent-context/U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md` and linked it from the U2 contract/prompt. U2 remains Frontend-only; `ServiceRun`/`SimulationReceipt` cannot become implicit `AgentRun`/execution proof.
- Updated `AGENTS.md`, durable context, decision log, and delivery indexes. No product code, dependency, Backend, runtime, or U2 implementation changed.
- Verification passed: Markdownlint 0 findings with only `MD013` disabled, 0 broken changed relative links, structural/coverage checks, staged credential-pattern scan 0, `npm run check` PASS (Vitest 4/4; Next build 57/57), and `npm audit --audit-level=high` 0 vulnerabilities.
- Live checks of 29 unique report URLs returned 28 HTTP 200 plus one access-controlled Reddit 403 and no definite 404/410. The Reddit reference remains explicitly non-normative.
- Pushed content commit `88e10738a0a23214d440741957f6b15c6323f27a` to GitHub `main`; source-matching Vercel deployment `dpl_6YoLRZg6dRqwfWWJs8JekpjSfREt` reached `READY` with no error and all production aliases attached.
- Production and immutable-deployment smoke returned HTTP 200 on five checks. Permanent receipt: `docs/04-delivery/PRODUCT-AGENT-ARCHITECTURE-AUDIT-VERIFICATION.md`.

## 2026-09-12 — U2.0 Service Depth foundation implemented, verified, and deployed

- Started from synchronized `main@17ddea3d3f80cbbb2c2e5493c18755648f2d24e7`; restored dependencies with `npx npm@11.6.4 ci` and re-ran the baseline gates before touching runtime code.
- Added shared service contracts in `packages/contracts/src/services` (session with consistency `superRefine`, run/stage/artifact/evidence/receipt/handoff, 15 events, transition table, retry creation, event application) without widening the shared run status enum or changing `packages/contracts/src/index.ts`.
- Added the deterministic simulator in `packages/mock-api/src/services` (manual/timer clock, seeded ids, scenario plans, ar/en fixtures, event runner, mock client reporting `deterministic_mock`, `explicit_simulation`, `networkCalls: 0`, and `productAgentRuntime: "not_implemented"`).
- Added `packages/i18n/src/services` ar/en dictionaries for services, stages, statuses, scenarios, notices, and storage messages, plus locale formatters.
- Added `apps/web/features/service-workbench` (versioned session-only storage with memory/session/corrupt_recovered/quota_exceeded/unavailable states, allowlisted analytics, reducer/provider, explicit registry with Ask outside it, shell, primitives, receipt/storage/handoff overlays) and the noindex `/{locale}/preview/service-foundation` verification surface.
- Wrote 56 unit tests across seven files and a 15-test Chromium E2E suite covering lifecycle, cancel race, retry, needs_input, per-service stage sequences, zero network calls, storage recovery, locale switch, handoff confirmation, keyboard path, Axe, forced colors, reduced motion, 44px targets, and 200% reflow.
- Fixed defects the gates exposed: 320px RTL document overflow from an absolutely positioned hidden span, Axe `scrollable-region-focusable` on the disabled stage list, simulator event ordering and cancel re-checks, `needs_input` reached from `validating`, retry-of-transient resolves to success in a new run, and focus restoration after overlay close.
- Captured nine foundation evidence states (ar/en, 320/390/1440, needs_input, failed_retryable, storage recovery, forced colors, reduced motion) into `docs/04-delivery/evidence/u2/u2-0-foundation/` with a manifest; all returned HTTP 200, zero document overflow, and Axe `pass/0`.
- Final gates: `npm run check` 0 (ESLint 0 errors/0 warnings, typecheck, Vitest 56/56, production build); `npm audit --audit-level=high` 0; Chromium E2E 15/15 and baseline 30/30; cross-browser 42 passed/3 skipped and 88 passed/2 skipped.
- Pushed content commit `4f257124a829202384963510cc3422f58a3c5f6a` to GitHub `main`; matching Vercel deployment `dpl_66T9CeDnMz6D1YhRkQ7wMGQ1QRo3` completed with source SHA matched, and the production alias returned HTTP 200 on six routes including the new foundation preview with a commit-specific CSS/HTML fingerprint.
- Updated the U2 traceability matrix (16 core rows), durable context, decision log, and delivery index. Receipt: `docs/04-delivery/U2-0-FOUNDATION-VERIFICATION.md`. No Backend/provider/runtime scope was added; `PA-G0..PA-G10` remain unchanged.

## 2026-09-12 — Workspace weight investigated and a hygiene protocol added

- The workspace became slow to open during the U2.0 verification runs. Measured cause: transient artifacts inside the tree — `node_modules` (tens of thousands of files), three Playwright browser engines (~1 GB), `apps/web/.next`, `test-results/`, and `tsconfig.tsbuildinfo` — not the repository contents, which are 28 MB across 493 files.
- Those paths are git-ignored and excluded from the saved snapshot, so they disappear on sandbox reset; the tree is light again now and no source, contract, test, or instruction file was at fault.
- Added `tools/workspace-hygiene.sh` with `status`, `clean [--deps]`, and `browsers` subcommands: it reports transient weight, removes only git-ignored output, and prints the outside-workspace browser install commands.
- Added the workspace-hygiene rules to `AGENTS.md`, `CURRENT-STATE.md`, and the `HANDOFF.md` restart checklist, and refreshed the stale `AGENTS.md` milestone line to reflect the deployed `U2.0` foundation.
- Cleaned the two leftover artifacts; `status` now reports `LIGHT`. No product code, contract, or test changed.

## 2026-09-12 — U2.2 Research slice implemented (code landed, verification still pending)

- Started from `main @ eaeb731` and followed `U2-NEXT-SESSION-RESEARCH.md` §3 steps 1–7. The full Research implementation now exists: `packages/contracts/src/services/research.ts` (Zod session/run/artifact/plan/source/claim schemas with `networkCalls: 0` and `productAgentRuntime: "not_implemented"`), `packages/mock-api/src/services/research/` (topics/sources/claims/activity/plan/report/presets, deterministic, no `Math.random`/`Date.now`), `packages/i18n/src/services/research-content.ts` (ar/en), and `apps/web/features/research/` (reducer with the five guards, surfaces incl. citation inspector, workspace, route).
- Registered the slice: `service-registry.ts` flips research to `implemented` / `domain_workspace`, `service-route-renderers.tsx` mounts `ResearchRoute`, `storage/store.ts` adds the research domain block, and the contracts/i18n/mock-api indexes export the new modules. `workbench.css` gains the research-specific layout rules.
- Wrote the test suite per §12.7 naming: `u2-research-state.test.ts`, `u2-research-integration.test.ts`, `e2e/service-research.spec.ts`, updated `u2-boundaries.test.ts` + `u2-learn-integration.test.ts` (implemented list is now `[learn, research]`), and added `tools/run-research-e2e.sh` (memory-resilient dev-server + batch runner, same pattern as Learn).
- Verification status at push time: `npm run typecheck` clean across all five workspaces, `npm run lint` clean, staged-diff credential scan 0 matches. **The Vitest unit/integration suites and the Playwright E2E suite have NOT been run yet** — the session ended mid-E2E-debug (inspector focus + RTL overflow probes in the sandbox scripts dir). No evidence captured, no matrix rows changed, no Vercel deploy.
- Next session must not re-implement anything: run the suites (`bash tools/run-research-e2e.sh`, `npx vitest run --reporter=dot`), fix only real defects, then collect evidence (`tools/research-evidence.mjs` still to be copied from the Learn tool), update the Research matrix rows, and deploy. Registry says `implemented` ahead of evidence by explicit user instruction ("upload what you completed") — treat the matrix, not the registry, as the source of truth until the gates pass.

## Prior stable milestone — U1.1

- Implemented responsive shell modes, touch sizing, safe areas, RTL/LTR behavior, reduced-motion and contrast handling, and WebKit corrections.
- Local gates: check passed; Vitest 4/4; build 57 pages; Chromium 38/38; cross-browser 66/66; audit 0 vulnerabilities.
- Production gate passed 22/22; final alias smoke passed 3/3.
