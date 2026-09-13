# Current State

Last updated: 2026-09-13 (Asia/Aden)

## U2.2 Research — locally verified, not release-closed

**Research موجودة كـFrontend-only deterministic simulation على `main@f094faa1d2c75d4004db60b0b6d92e5cd840119d`. التحقق المحلي مرّ، لكن لا يوجد Backend/live search، وE2E احتاج retries في بيئة Chromium النظامية؛ لذلك الحالة `VERIFIED LOCALLY / E2E FLAKY-RETRY OBSERVED` وليست `closed`.**

- الاختبارات المتأثرة: `3` ملفات Vitest، `35/35` اختبارًا ناجحًا، ثم `npm run lint` و`npm run typecheck` نجحا.
- E2E Research: دفعات المشغل الخمس عادت `exit=0` مع `1 passed` في معظم الدفعات و`flaky` retries؛ الفشل الأول كان بيئيًا لأن Playwright Chromium غير موجود، ثم استُخدم `/usr/bin/chromium` عبر رابط مؤقت خارج المستودع.
- الأدلة: [`evidence/u2/u2-2-research/`](../04-delivery/evidence/u2/u2-2-research/) (5 لقطات + `manifest.json`)؛ كل سجل HTTP 200، و`documentOverflowPx=0`، وAxe `serious/critical=0/0`، ولا console/page errors.
- الحقيقة التشغيلية: `networkCalls:0` و`productAgentRuntime:not_implemented` ما زالتا حدود المحاكاة؛ الأدلة تثبت الواجهة والحالة المحلية فقط ولا تثبت بحثًا حيًا أو مزودًا أو Runtime.
- البوابة المفتوحة: تثبيت سبب flakiness وإعادة E2E بجلسة مستقرة، ثم مراجعة keyboard/screen-reader البشرية قبل إعلان U2.2 `closed`. لا يفتح هذا التحقق PA-G0..PA-G10 ولا يغير حالة Product-agent Backend `NO-GO`.

## U2 Service Depth — U2.0 Foundation (closed)

**`U2.0` منفَّذة ومنشورة بأدلة حديثة. التنفيذ Frontend-only بمحاكاة حتمية صريحة؛ لم يُضف Backend/Runtime.**

- commit المحتوى: `4f257124a829202384963510cc3422f58a3c5f6a` على `main`؛ النشر المطابق `dpl_66T9CeDnMz6D1YhRkQ7wMGQ1QRo3` («Deployment has completed») وalias الإنتاج <https://nasaq-ai.vercel.app> عاد 200 على ستة مسارات تشمل مسار المعاينة الجديد.
- المُنجَز: عقود `packages/contracts/src/services` (session/run/stage/artifact/evidence/receipt/handoff/events/transitions)، محاكي `packages/mock-api/src/services` (clock/ids/plans/fixtures/runner/client)، قواميس `packages/i18n/src/services`، Workbench مشترك في `apps/web/features/service-workbench` (تخزين جلسة مُصدَّر، analytics بقائمة مسموحة، reducer/provider، registry، shell، overlays)، سطح تحقق داخلي `apps/web/features/service-foundation` ومسار `/{locale}/preview/service-foundation` (`noindex`)، إضافة إلى 56 اختبار وحدة و15 اختبار E2E.
- البوابات: `npm run check` = 0 (ESLint 0/0، typecheck، Vitest 56/56، build)، `npm audit --audit-level=high` = 0، Chromium 15/15 و30/30، متعدد المحركات 42/3 و88/2 (skips موثقة)، وaxe `pass/0` على 9 لقطات بلا تجاوز مستندي.
- الأدلة: [`evidence/u2/u2-0-foundation/`](../04-delivery/evidence/u2/u2-0-foundation/) (9 لقطات + manifest). الإيصال: [`U2-0-FOUNDATION-VERIFICATION.md`](../04-delivery/U2-0-FOUNDATION-VERIFICATION.md).
- المصفوفة محدَّثة: `U2-CORE-003..018` موزَّعة بين `PASS` و`IN PROGRESS` (الأخيرة بسبب فحوص بشرية أو أسطح لاحقة)؛ صفوف `U2.1`–`U2.7` و`MAN-*` كما هي.
- بيان الحقيقة: تشغيل وكلاء المنتج (Backend/Runtime) غير منفّذ؛ `PA-G0..PA-G10` لم تتغير وما زالت `NO-GO`.
- الخطوة التالية بعد U2.0 كانت `U2.1` Learn، وقد أُغلقت بأدلة؛ الشريحة القادمة `U2.2` Research بعد إذن صريح (تفاصيل التسليم في [`U2-NEXT-SESSION-RESEARCH.md`](U2-NEXT-SESSION-RESEARCH.md)).

## U2 Service Depth — U2.1 Learn (closed)

**`U2.1` Learn منفَّذة ومنشورة بمحاكاة حتمية صريحة، بلا Backend/Runtime، وبلا ادعاء اكتمال بلا دليل.**

- commit الكود: `f3e3e31`، ثم أدلته `e7ee7d8`، ثم تسليم الجلسة القادمة `bb3ee65` على `main`؛ Vercel `success`، والإنتاج <https://nasaq-ai.vercel.app> عاد 200 على `/ar`, `/en`, `/ar/app/learn`, `/en/app/learn` وSSR يحمل `data-stage="lrn_brief"`.
- المراحل الثمانية: `lrn_brief → lrn_diagnostic → lrn_path_review → lrn_lesson → lrn_check → lrn_feedback → lrn_checkpoint → lrn_complete`، مع مسار Fast مسجَّل كتقييم ذاتي ظاهر + quick check، وتبديل Fast↔Guided بلا فقدان إجابات.
- بوابات محفوظة: `lesson_not_engaged`, `diagnostic_incomplete`, `path_missing`, `check_incomplete`؛ استئناف المرحلة عبر `resumeStageKey` مع نموذج ثقة `reachableStages` (مرحلة مُزيَّفة تُرفض إلى `lrn_brief`).
- البوابات الميكانيكية: `tsc` 0، ESLint 0، Vitest **87/87** (9 ملفات)، Playwright Chromium **12/12** (‏`--workers=1 --retries=1`)، `axe serious/critical = 0/0` و`documentOverflow = 0` في 7 لقطات.
- الأدلة: [`evidence/u2/u2-1-learn/`](../04-delivery/evidence/u2/u2-1-learn/) (7 لقطات + manifest)؛ والصفوف `U2-LRN-001..007 = PASS` و`U2-LRN-008 = IN PROGRESS` (يبقى فحص قارئ الشاشة البشري `MAN-SR-001`).
- عيوب حقيقية اكتُشفت وأُصلحت قبل الدفع: تباين نص في وحدة مسار متجاوزة، سبب التجاوز غير معروض، نقر قبل hydration، وهدف لمس 44px عند 320px.

## Workspace hygiene (operating constraint)

The saved workspace is small (about 28 MB across ~493 files). It becomes heavy — slow or impossible to open in the file browser — only when transient artifacts accumulate inside it:

- `node_modules` (tens of thousands of files and hundreds of MB),
- Playwright browser binaries (about 1 GB for Chromium + Firefox + WebKit),
- `apps/web/.next`, `apps/web/test-results/`, `apps/web/playwright-report/`, and `*.tsbuildinfo`.

All of these are git-ignored, are excluded from the saved snapshot, and are removed automatically when the sandbox is reset — which is why dependencies must be reinstalled after a restart. The previous session ran three engines, a production build, and repeated E2E suites without cleaning, which is what made the workspace unopenable; the sources and instructions were never the cause.

Rules from now on:

1. Report weight with `bash tools/workspace-hygiene.sh status` before heavy work; a `LIGHT` verdict means it is safe to browse.
2. Install browsers outside the workspace: `export PLAYWRIGHT_BROWSERS_PATH=/tmp/nasaq-playwright`; install Chromium by default and add Firefox/WebKit only for the cross-browser close-out gate.
3. Run `bash tools/workspace-hygiene.sh clean` when pausing, and `clean --deps` (plus removing the browser cache) before a long handoff or when the workspace must stay browsable.
4. Never leave `next start`/`next dev` servers, watchers, or probe scripts behind; delete temporary probes after each run.
5. **Every task ends `LIGHT`:** the closing action of any task or commit is `bash tools/workspace-hygiene.sh clean --all` (dependencies, browser cache, build output, test artifacts). Nothing heavy survives a finished task; the next task reinstalls only what it needs.

## Product-agent architecture readiness

**The repository-wide product-agent audit is complete. Product-agent Backend/Runtime is `NO-GO`; no Backend or runtime code was added.**

- Canonical audit: [`docs/04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md`](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-READINESS-AUDIT.md).
- Result: product-agent vision, UX, requirements, state machines, conceptual contracts, permissions, security, and error principles are partly explicit, but no complete executable architecture joins Persona, PromptBundle, Context/Memory, Tool/Skill runtime, Authorization, Durable Execution, Errors, Telemetry, Evals, and release lifecycle.
- The current `packages/contracts` Agent/Run schemas and `packages/mock-api` fixtures are Prototype view/simulation contracts, not canonical Backend models.
- No API handlers, provider adapters, database, queue/worker, durable orchestrator, tool executor, credential broker, persistent memory, telemetry exporter, prompt registry, or agent eval runner exists in source.
- Backend cannot begin until `PA-G0..PA-G9` pass with evidence and `PA-G10` records a limited approved GO.
- U2 remains independent and Frontend-only; its mandatory boundary instructions are [`U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md`](U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md).

### Audit delivery evidence

- Content commit `88e10738a0a23214d440741957f6b15c6323f27a` was pushed to GitHub `main`.
- Matching Vercel deployment `dpl_6YoLRZg6dRqwfWWJs8JekpjSfREt` reached `READY`, target `production`, `errorCode: null`, with source SHA exactly matching the content commit and all three production aliases attached.
- HTTP smoke returned 200 for `/ar`, `/en`, `/ar/app/home`, `/en/app/research`, and `/ar` on the immutable deployment URL.
- Integrity gates passed: Markdownlint, relative links, structural/coverage checks, staged credential patterns, `npm run check` (Vitest 4/4; Next build 57 pages), and audit 0. Of 29 unique external report URLs, 28 returned 200 and the non-normative Reddit signal returned 403; there were no definite 404/410 failures.
- Permanent receipt: [`docs/04-delivery/PRODUCT-AGENT-ARCHITECTURE-AUDIT-VERIFICATION.md`](../04-delivery/PRODUCT-AGENT-ARCHITECTURE-AUDIT-VERIFICATION.md).

A context/receipt-only closure commit follows the content delivery; always inspect current `HEAD`, `origin/main`, and newest Vercel deployment on restart.

## Milestone status

**Two non-conflicting tracks remain: U2 Service Depth proceeds as explicit Frontend simulation (`U2.0` and `U2.1` closed, `U2.2` Research locally verified but not release-closed), and product-agent architecture advances through documentation/readiness only. Product-agent Backend implementation has not started.**

The completed planning package is:

- [`docs/01-product/U2-SERVICE-DEPTH.md`](../01-product/U2-SERVICE-DEPTH.md) — canonical stage contract: scope, architecture, shared domain model, service-by-service workflows, states, truth/security boundaries, sequencing, risks, and acceptance criteria.
- [`docs/04-delivery/U2-TRACEABILITY-AND-QA.md`](../04-delivery/U2-TRACEABILITY-AND-QA.md) — 79 requirement rows mapped to planned unit/integration/E2E/manual checks and evidence. `U2.0` and `U2.1` carry fresh evidence; `U2.2` carries local Research evidence while its release-close gate remains open because E2E retries were observed and manual accessibility review is not complete.
- [`U2-IMPLEMENTATION-PROMPT.md`](U2-IMPLEMENTATION-PROMPT.md) — restart-ready request for a new implementation agent.
- [`U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md`](U2-PRODUCT-AGENT-BOUNDARY-ADDENDUM.md) — mandatory separation of U2 Service contracts from future Product Agent Runtime.
- [`docs/04-delivery/U2-PLANNING-VERIFICATION.md`](../04-delivery/U2-PLANNING-VERIFICATION.md) — local checks, checksums, GitHub commit, matching Vercel deployment, and production HTTP smoke.

The planning delivery changed documentation only. The `U2.0` implementation that followed added the foundation packages/features listed above; it still does not replace `ServiceWorkspace`, so every `/[locale]/app/{service}` route keeps the U1 surface until its slice lands.

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

Choose the assigned track explicitly:

1. **U2 implementation:** `U2.0` is closed (see above). The next slice is **`U2.1` Learn**: read the Learn section of `U2-SERVICE-DEPTH.md` and rows `U2-LRN-001..008`, then implement the Learn workspace over the U2.0 foundation. Keep `ServiceRun` separate from Agent/Flow runtime and stop before any Backend/provider/file-processing/sandbox scope.
2. **Product-agent architecture:** start `PA-ARCH-001` in the readiness audit and complete the documentation/specification package in dependency order. Do not create API/DB/provider/worker/tool/memory runtime until the readiness gates pass and an approved GO exists.

If the assignment does not name a track, ask before mutation; do not infer that auditing authorizes Backend.

## Secrets

No credentials belong in the repository. Use GitHub/Vercel credentials only through secure environment facilities, transiently. Never add tokens, private keys, `.env` values, credential-bearing URLs, or personal browser state to source, docs, logs, screenshots, traces, commits, or agent context.
